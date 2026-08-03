// ============================================================
// MUSLIM LIFE OS™ — Supabase Client (Auth + Family Sync)
// ============================================================

const SUPABASE_URL = 'https://nariouymfqkyrbbppzxx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_J-iPNmgrNyxTMuKMopRDvA_L6-67dNa';

let sb = null;
let currentSession = null;

function getSupabase() {
    if (sb) return sb;
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
        console.warn('[Supabase] CDN not loaded');
        return null;
    }
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    });
    return sb;
}

async function initSupabaseAuth() {
    const client = getSupabase();
    if (!client) return null;
    const { data: { session } } = await client.auth.getSession();
    currentSession = session;
    client.auth.onAuthStateChange((event, session) => {
        currentSession = session;
        window.dispatchEvent(new CustomEvent('mlos-auth', { detail: { event, session } }));
    });
    return session;
}

function getUser() {
    return currentSession?.user || null;
}

function isLoggedIn() {
    return !!currentSession?.user;
}

async function signUp(email, password, fullName) {
    const client = getSupabase();
    if (!client) return { error: 'Supabase tidak tersedia' };
    const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName || email.split('@')[0] } }
    });
    if (error) return { error: error.message };
    if (data.user) {
        await client.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName || email.split('@')[0],
            email: email.trim()
        });
    }
    return { data, user: data.user };
}

async function signIn(email, password) {
    const client = getSupabase();
    if (!client) return { error: 'Supabase tidak tersedia' };
    const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password
    });
    if (error) return { error: error.message };
    currentSession = data.session;
    return { data, user: data.user };
}

async function signOut() {
    const client = getSupabase();
    if (!client) return;
    await client.auth.signOut();
    currentSession = null;
}

function generateFamilyCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'ML-';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

async function createFamily(familyName) {
    const client = getSupabase();
    const user = getUser();
    if (!client || !user) return { error: 'Sila log masuk dulu' };
    const code = generateFamilyCode();
    const { data: fam, error } = await client.from('families').insert({
        name: familyName || 'Keluarga Saya',
        code,
        created_by: user.id
    }).select().single();
    if (error) return { error: error.message };
    const { error: memErr } = await client.from('family_members').insert({
        family_id: fam.id,
        user_id: user.id,
        role: 'parent',
        display_name: user.user_metadata?.full_name || user.email
    });
    if (memErr) return { error: memErr.message };
    await client.from('profiles').update({ family_id: fam.id }).eq('id', user.id);
    return { data: fam };
}

async function joinFamily(code) {
    const client = getSupabase();
    const user = getUser();
    if (!client || !user) return { error: 'Sila log masuk dulu' };
    const clean = (code || '').trim().toUpperCase();
    const { data: fam, error } = await client.from('families').select('*').eq('code', clean).maybeSingle();
    if (error) return { error: error.message };
    if (!fam) return { error: 'Kod keluarga tidak dijumpai' };
    const { data: existing } = await client.from('family_members')
        .select('id').eq('family_id', fam.id).eq('user_id', user.id).maybeSingle();
    if (existing) return { data: fam, message: 'Sudah dalam keluarga ini' };
    const { error: memErr } = await client.from('family_members').insert({
        family_id: fam.id,
        user_id: user.id,
        role: 'child',
        display_name: user.user_metadata?.full_name || user.email
    });
    if (memErr) return { error: memErr.message };
    await client.from('profiles').update({ family_id: fam.id }).eq('id', user.id);
    return { data: fam };
}

async function getMyFamily() {
    const client = getSupabase();
    const user = getUser();
    if (!client || !user) return { error: 'Tidak log masuk' };
    const { data: membership } = await client.from('family_members')
        .select('*, families(*)')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
    if (!membership) return { data: null };
    const { data: members } = await client.from('family_members')
        .select('id, user_id, role, display_name')
        .eq('family_id', membership.family_id);
    return {
        data: {
            family: membership.families,
            myRole: membership.role,
            members: members || []
        }
    };
}

async function upsertSolatLog(prayer, done, logDate) {
    const client = getSupabase();
    const user = getUser();
    if (!client || !user) return { error: 'Tidak log masuk' };
    const date = logDate || new Date().toISOString().slice(0, 10);
    const { data, error } = await client.from('solat_logs').upsert({
        user_id: user.id,
        prayer_name: prayer,
        log_date: date,
        completed: !!done,
        updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,prayer_name,log_date' }).select();
    if (error) return { error: error.message };
    return { data };
}

async function getFamilySolatToday() {
    const client = getSupabase();
    const user = getUser();
    if (!client || !user) return { error: 'Tidak log masuk' };
    const fam = await getMyFamily();
    if (fam.error || !fam.data) return fam;
    const today = new Date().toISOString().slice(0, 10);
    const userIds = fam.data.members.map(m => m.user_id);
    if (!userIds.length) return { data: { family: fam.data.family, myRole: fam.data.myRole, members: [] } };
    const { data: logs, error } = await client.from('solat_logs')
        .select('*')
        .in('user_id', userIds)
        .eq('log_date', today);
    if (error) return { error: error.message };
    const result = fam.data.members.map(m => {
        const solat = { subuh: false, zohor: false, asar: false, maghrib: false, isyak: false };
        (logs || []).filter(l => l.user_id === m.user_id && l.completed).forEach(l => {
            if (Object.prototype.hasOwnProperty.call(solat, l.prayer_name)) solat[l.prayer_name] = true;
        });
        return {
            user_id: m.user_id,
            display_name: m.display_name,
            role: m.role,
            solat,
            done: Object.values(solat).filter(Boolean).length
        };
    });
    return { data: { family: fam.data.family, myRole: fam.data.myRole, members: result } };
}

async function getMySolatToday() {
    const client = getSupabase();
    const user = getUser();
    if (!client || !user) return { error: 'Tidak log masuk' };
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await client.from('solat_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', today);
    if (error) return { error: error.message };
    const solat = { subuh: false, zohor: false, asar: false, maghrib: false, isyak: false };
    (data || []).forEach(l => {
        if (l.completed && Object.prototype.hasOwnProperty.call(solat, l.prayer_name)) solat[l.prayer_name] = true;
    });
    return { data: solat };
}

window.MLOS_SB = {
    init: initSupabaseAuth,
    getUser,
    isLoggedIn,
    signUp,
    signIn,
    signOut,
    createFamily,
    joinFamily,
    getMyFamily,
    upsertSolatLog,
    getFamilySolatToday,
    getMySolatToday,
    getSupabase
};
