// ============================================================
// MUSLIM LIFE OS™ - Core Application Logic (Vanilla JS)
// Enterprise-grade SPA | Offline-first | Premium UX
// UPGRADED VERSION 1.1 — Achievements, Sedekah, Zikir Types,
// Confetti, smarter streaks, Lucide icons, better mobile
// ============================================================

// -------------------- GLOBAL STATE & DATA STORE --------------------
let state = {
    user: {
        id: null,
        name: 'Pengguna',
        level: 1,
        xp: 0,
        streak: 0,
        location: ''
    },
    solat: {
        today: {
            subuh: { status: null, time: '05:45' },
            zohor: { status: null, time: '13:11' },
            asar: { status: null, time: '16:33' },
            maghrib: { status: null, time: '19:17' },
            isyak: { status: null, time: '20:29' }
        },
        history: []
    },
    qada: {
        subuh:   { debt: 0, completed: 0 },
        zohor:   { debt: 0, completed: 0 },
        asar:    { debt: 0, completed: 0 },
        maghrib: { debt: 0, completed: 0 },
        isyak:   { debt: 0, completed: 0 },
        dailyRate: 1
    },
    qadaPuasa: {
        totalDays: 0,
        completedDays: 0,
        dailyRate: 1
    },
    solatSunat: {
        // key: count today + total lifetime optional
        tahajjud: 0, dhuha: 0, rawatib: 0, taubat: 0, hajat: 0,
        istikharah: 0, tasbih: 0, witir: 0, awwabin: 0, eid: 0, others: 0,
        history: []
    },
    puasaSunat: {
        logs: [] // {type, date, note}
    },
    prayerMeta: {
        source: 'fallback',
        lastFetched: null,
        hijri: '12 Muharram 1448 H',
        city: 'Johor Bahru'
    },
    zikir: {
        currentCount: 0,
        currentType: 'subhanallah',
        dailyTarget: 100,
        todayTotal: 87,
        sessions: []
    },
    quran: {
        dailyTargetPages: 5,
        todayPages: 0,
        juzCompleted: 0,
        totalKhatam: 0,
        readings: []
    },
    hafazan: [], // {surah, start, end, level, updated}
    tajwid: {
        ikhfa: 0, idgham: 0, iqlab: 0, izhar: 0, qalqalah: 0, mad: 0, other: 0
    },
    tahriri: [], // {score, mistakes, notes, date}
    selawat: {
        current: 0,
        todayTotal: 0,
        dailyTarget: 100,
        sessions: []
    },
    aiImam: { history: [] },
    family: {
        members: [],
        goals: [],
        todayLogs: { solat: 0, quran: 0, zikir: 0 }
    },
    wiridStreak: 0,
    wiridLastDate: null,
    journal: [],
    sedekah: {
        logs: [],
        monthlyTotal: 0
    },
    goals: [
        { id: 'g1', type: 'tahajjud', title: '100 Tahajjud', current: 0, target: 100, icon: '🌙' },
        { id: 'g2', type: 'solat-awal', title: '365 Solat Awal Waktu', current: 0, target: 365, icon: '🕌' },
        { id: 'g3', type: 'khatam', title: '2 Full Khatam Al-Quran', current: 0, target: 2, icon: '📖' },
        { id: 'g4', type: 'selawat', title: '1,000 Selawat', current: 0, target: 1000, icon: '🤲' },
        { id: 'g5', type: 'sedekah', title: '100 Kali Sedekah', current: 0, target: 100, icon: '💝' }
    ],
    achievements: [
        { code: 'streak_7', name: '7 Hari Berturut', desc: 'Solat 5 waktu 7 hari berturut-turut', unlocked: false, xp: 50, icon: '🔥' },
        { code: 'streak_30', name: '30 Hari Streak', desc: 'Konsisten 30 hari penuh', unlocked: false, xp: 150, icon: '⚡' },
        { code: 'first_khatam', name: 'Khatam Pertama', desc: 'Menamatkan 1 kali khatam Al-Quran', unlocked: false, xp: 300, icon: '📖' },
        { code: 'tahajjud_50', name: '50 Tahajjud', desc: 'Bangun malam 50 kali', unlocked: false, xp: 200, icon: '🌙' },
        { code: 'sedekah_10', name: 'Sedekah 10x', desc: 'Memberi sedekah 10 kali', unlocked: false, xp: 80, icon: '💝' },
        { code: 'zikir_1000', name: '1000 Zikir', desc: 'Jumlah 1000 zikir dalam sehari', unlocked: false, xp: 120, icon: '📿' },
        { code: 'solat_awal_100', name: '100 Solat Awal', desc: 'Solat awal waktu 100 kali', unlocked: false, xp: 180, icon: '🕌' },
        { code: 'muhasabah_30', name: 'Muhasabah Master', desc: 'Menulis muhasabah 30 hari', unlocked: false, xp: 150, icon: '✍️' }
    ],
    settings: {
        theme: 'dark',
        language: 'ms-MY'
    }
};

const Store = {
    save() {
        localStorage.setItem('muslimLifeOS_state_v3_clean', JSON.stringify(state));
    },
    load() {
        const saved = localStorage.getItem('muslimLifeOS_state_v3_clean') || localStorage.getItem('muslimLifeOS_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Deep merge carefully
                state = {
                    ...state,
                    ...parsed,
                    user: { ...state.user, ...(parsed.user || {}) },
                    solat: { ...state.solat, ...(parsed.solat || {}) },
                    qada: { ...state.qada, ...(parsed.qada || {}) },
                    qadaPuasa: { ...state.qadaPuasa, ...(parsed.qadaPuasa || {}) },
                    solatSunat: { ...state.solatSunat, ...(parsed.solatSunat || {}) },
                    puasaSunat: { ...state.puasaSunat, ...(parsed.puasaSunat || {}) },
                    prayerMeta: { ...state.prayerMeta, ...(parsed.prayerMeta || {}) },
                    zikir: { ...state.zikir, ...(parsed.zikir || {}) },
                    sedekah: { ...state.sedekah, ...(parsed.sedekah || {}) },
                    hafazan: parsed.hafazan || state.hafazan,
                    tajwid: { ...state.tajwid, ...(parsed.tajwid || {}) },
                    tahriri: parsed.tahriri || state.tahriri,
                    selawat: { ...state.selawat, ...(parsed.selawat || {}) },
                    family: { ...state.family, ...(parsed.family || {}), members: parsed.family?.members || state.family.members, goals: parsed.family?.goals || state.family.goals },
                    aiImam: { ...state.aiImam, ...(parsed.aiImam || {}) },
                    goals: parsed.goals || state.goals,
                    achievements: parsed.achievements || state.achievements
                };
            } catch (e) {
                console.warn('Failed to parse saved state', e);
            }
        }
    },
    resetDemo() {
        localStorage.removeItem('muslimLifeOS_state_v3_clean');
        localStorage.removeItem('muslimLifeOS_state');
        location.reload();
    }
};

// -------------------- UTILITIES --------------------
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    const colors = type === 'success' 
        ? 'bg-emerald-600 border-emerald-400/50' 
        : type === 'xp'
        ? 'bg-amber-600 border-amber-400/50'
        : 'bg-slate-700 border-slate-500/50';
    
    toast.className = `px-5 py-3.5 rounded-2xl shadow-xl border text-sm flex items-center gap-x-3 ${colors} text-white max-w-xs animate-fade-in`;
    toast.innerHTML = `
        <div class="flex-1 leading-snug">${message}</div>
        <button class="text-white/70 hover:text-white text-xl leading-none" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 4200);
}

function celebrate(intensity = 'normal') {
    if (typeof confetti === 'undefined') return;
    
    const defaults = {
        particleCount: intensity === 'big' ? 180 : 90,
        spread: intensity === 'big' ? 100 : 70,
        origin: { y: 0.65 },
        colors: ['#10b981', '#34d399', '#d4af37', '#fbbf24', '#ffffff']
    };
    
    confetti(defaults);
    
    if (intensity === 'big') {
        setTimeout(() => confetti({ ...defaults, particleCount: 60, origin: { y: 0.7, x: 0.3 } }), 200);
        setTimeout(() => confetti({ ...defaults, particleCount: 60, origin: { y: 0.7, x: 0.7 } }), 350);
    }
}

function celebrateDemo() {
    celebrate('big');
    showToast('🎉 Celebration test berjaya!', 'success');
}

function addXP(amount, reason = '') {
    state.user.xp += amount;
    
    // Simple level calculation (every 250 XP = 1 level)
    const newLevel = Math.floor(state.user.xp / 250) + 1;
    if (newLevel > state.user.level) {
        state.user.level = newLevel;
        celebrate('big');
        showToast(`Naik Level ${newLevel}! +${amount} XP ${reason}`, 'xp');
    } else {
        showToast(`+${amount} XP ${reason}`, 'xp');
    }
    
    // Update UI if elements exist
    const xpEls = document.querySelectorAll('#ach-xp, [data-xp]');
    xpEls.forEach(el => el.textContent = state.user.xp.toLocaleString() + ' XP');
    
    const levelEls = document.querySelectorAll('#ach-level, [data-level]');
    levelEls.forEach(el => el.textContent = `Level ${state.user.level}`);
    
    Store.save();
}

function formatDate(date = new Date()) {
    return date.toLocaleDateString('ms-MY', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
}

function getHijriDate() {
    return state.prayerMeta?.hijri || "12 Muharram 1448 H";
}

function updateHeaderDates() {
    const greetingEl = document.getElementById('greeting');
    const dateEl = document.getElementById('current-date');
    const hijriEl = document.getElementById('hijri-date');
    const gregorianEl = document.getElementById('gregorian-date');
    
    const hour = new Date().getHours();
    let greeting = 'Selamat Petang';
    if (hour < 12) greeting = 'Selamat Pagi';
    else if (hour < 15) greeting = 'Selamat Tengah Hari';
    else if (hour < 19) greeting = 'Selamat Petang';
    else greeting = 'Selamat Malam';
    
    if (greetingEl) greetingEl.textContent = `${greeting}, ${state.user.name}`;
    if (dateEl) dateEl.textContent = formatDate();
    
    if (hijriEl) hijriEl.textContent = getHijriDate();
    if (gregorianEl) gregorianEl.textContent = new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });
}

// -------------------- THEME --------------------
function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    
    state.settings.theme = html.classList.contains('dark') ? 'dark' : 'light';
    Store.save();
}

// -------------------- NAVIGATION --------------------
function showModule(module) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(`view-${module}`);
    if (target) target.classList.add('active');
    
    // Sidebar active
    document.querySelectorAll('#sidebar-nav button').forEach(btn => {
        btn.classList.toggle('nav-active', btn.dataset.module === module);
    });
    
    // Mobile nav active color
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        btn.classList.remove('text-emerald-400');
        btn.classList.add('text-slate-400');
    });
    
    // Module-specific init
    if (module === 'solat') renderSolatModule();
    if (module === 'qada') renderQadaModule();
    if (module === 'qada-puasa') renderQadaPuasa();
    if (module === 'solat-sunat') renderSolatSunat();
    if (module === 'puasa-sunat') renderPuasaSunat();
    if (module === 'goals') renderGoalsModule();
    if (module === 'journal') renderJournalHistory();
    if (module === 'stats') renderStatsCharts();
    if (module === 'achievements') renderAchievements();
    if (module === 'sedekah') renderSedekahHistory();
    if (module === 'zikir') updateZikirProgress();
    if (module === 'quran') { populateSurahSelect(); renderKhatamProgress(); }
    if (module === 'hafazan') renderHafazan();
    if (module === 'tajwid') { renderTajwid(); renderTahririHistory(); populateTahririSurah(); }
    if (module === 'selawat') updateSelawatUI();
    if (module === 'ai-imam') renderAIImam();
    if (module === 'family') renderFamily();
    if (module === 'family-report') refreshFamilyReport();
    if (module === 'doa-hadis') renderDoaHadis();
    if (module === 'sunnah') renderSunnah();
    if (module === 'wirid') renderWirid();
    
    // Re-init Lucide icons after DOM change
    if (typeof lucide !== 'undefined') {
        setTimeout(() => lucide.createIcons(), 50);
    }
}

function buildSidebarNav() {
    const navContainer = document.getElementById('sidebar-nav');
    if (!navContainer) return;
    
    const modules = [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'solat', label: 'Solat Tracker', icon: 'clock' },
        { id: 'qada', label: 'Qada Solat', icon: 'rotate-ccw' },
        { id: 'qada-puasa', label: 'Qada Puasa', icon: 'calendar-x' },
        { id: 'solat-sunat', label: 'Solat Sunat', icon: 'moon' },
        { id: 'puasa-sunat', label: 'Puasa Sunat', icon: 'sunrise' },
        { id: 'zikir', label: 'Digital Tasbih', icon: 'sparkles' },
        { id: 'quran', label: 'Al-Quran & Khatam', icon: 'book-open' },
        { id: 'hafazan', label: 'Hafazan', icon: 'brain' },
        { id: 'tajwid', label: 'Tajwid & Tahriri', icon: 'pen-tool' },
        { id: 'selawat', label: 'Selawat', icon: 'heart' },
        { id: 'ai-imam', label: 'AI Imam', icon: 'bot' },
        { id: 'family', label: 'Family Mode', icon: 'users' },
        { id: 'family-report', label: 'Family Report', icon: 'clipboard-list' },
        { id: 'doa-hadis', label: 'Doa & Hadis', icon: 'book-marked' },
        { id: 'sunnah', label: 'Sunnah Nabi', icon: 'sparkle' },
        { id: 'wirid', label: 'Bacaan Lepas Solat', icon: 'list-checks' },
        { id: 'sedekah', label: 'Sedekah', icon: 'heart-handshake' },
        { id: 'journal', label: 'Muhasabah Journal', icon: 'notebook-pen' },
        { id: 'goals', label: 'Islamic Goals', icon: 'target' },
        { id: 'achievements', label: 'Achievements', icon: 'trophy' },
        { id: 'stats', label: 'Statistics', icon: 'bar-chart-3' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
    ];
    
    navContainer.innerHTML = modules.map(m => `
        <button data-module="${m.id}" 
                onclick="showModule('${m.id}')"
                class="nav-link w-full flex items-center gap-x-3 px-4 py-3 text-sm hover:bg-white/5 rounded-2xl mb-0.5 text-left">
            <i data-lucide="${m.icon}" class="w-4 h-4"></i>
            <span>${m.label}</span>
        </button>
    `).join('');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// -------------------- PRAYER TIMES & COUNTDOWN (REAL API) --------------------
let PRAYER_TIMES = [
    { name: 'Subuh', key: 'subuh', time: '05:45', apiKey: 'Fajr' },
    { name: 'Zohor', key: 'zohor', time: '13:11', apiKey: 'Dhuhr' },
    { name: 'Asar', key: 'asar', time: '16:33', apiKey: 'Asr' },
    { name: 'Maghrib', key: 'maghrib', time: '19:17', apiKey: 'Maghrib' },
    { name: 'Isyak', key: 'isyak', time: '20:29', apiKey: 'Isha' }
];

async function fetchPrayerTimes(force = false) {
    const todayKey = new Date().toISOString().split('T')[0];
    const cacheKey = 'mlos_prayer_' + todayKey;
    
    // Use cache if available and not forced
    if (!force) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const data = JSON.parse(cached);
                applyPrayerData(data);
                console.log('%c[Prayer] Loaded from cache', 'color:#166534');
                return true;
            } catch (e) {}
        }
    }
    
    try {
        // AlAdhan API - JAKIM method (17) for Malaysia
        const dateStr = todayKey.split('-').reverse().join('-'); // DD-MM-YYYY
        const url = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=Johor%20Bahru&country=Malaysia&method=17`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('API ' + res.status);
        
        const json = await res.json();
        if (json.code !== 200) throw new Error('Invalid response');
        
        const timings = json.data.timings;
        const hijri = json.data.date.hijri;
        
        const data = {
            timings,
            hijri: `${hijri.day} ${hijri.month.en} ${hijri.year} H`,
            fetchedAt: new Date().toISOString(),
            city: 'Johor Bahru'
        };
        
        localStorage.setItem(cacheKey, JSON.stringify(data));
        applyPrayerData(data);
        
        state.prayerMeta.source = 'aladhan-jakim';
        state.prayerMeta.lastFetched = data.fetchedAt;
        state.prayerMeta.hijri = data.hijri;
        Store.save();
        
        console.log('%c[Prayer] Live times fetched from AlAdhan (JAKIM)', 'color:#166534');
        showToast('Waktu solat dikemaskini (JAKIM)', 'success');
        return true;
    } catch (err) {
        console.warn('[Prayer] Fetch failed, using fallback/cache', err);
        // Keep existing times
        const note = document.getElementById('prayer-source-note');
        if (note) note.textContent = 'Offline mode • Menggunakan waktu tersimpan / default';
        return false;
    }
}

function applyPrayerData(data) {
    const map = {
        Fajr: 'subuh',
        Dhuhr: 'zohor',
        Asr: 'asar',
        Maghrib: 'maghrib',
        Isha: 'isyak'
    };
    
    PRAYER_TIMES.forEach(p => {
        const apiTime = data.timings[p.apiKey];
        if (apiTime) {
            // API returns "HH:MM (timezone)" sometimes, take first 5 chars
            p.time = apiTime.substring(0, 5);
            if (state.solat.today[p.key]) {
                state.solat.today[p.key].time = p.time;
            }
        }
    });
    
    if (data.hijri) {
        state.prayerMeta.hijri = data.hijri;
        const hijriEl = document.getElementById('hijri-date');
        if (hijriEl) hijriEl.textContent = data.hijri;
    }
    
    renderPrayerTimesGrid();
    updateNextPrayerCountdown();
    updateCurrentPrayerLabel();
}

function renderPrayerTimesGrid() {
    const container = document.getElementById('prayer-times-grid');
    if (!container) return;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    let nextKey = null;
    for (const p of PRAYER_TIMES) {
        const [h, m] = p.time.split(':').map(Number);
        if (h * 60 + m > currentMinutes) {
            nextKey = p.key;
            break;
        }
    }
    if (!nextKey) nextKey = 'subuh';
    
    container.innerHTML = PRAYER_TIMES.map(p => {
        const status = state.solat.today[p.key]?.status;
        let badge = '';
        if (status === 'awal_waktu') badge = `<div class="status-badge status-awal text-[9px] mt-1">Awal</div>`;
        else if (status === 'lewat') badge = `<div class="status-badge status-lewat text-[9px] mt-1">Lewat</div>`;
        else if (status === 'qada') badge = `<div class="status-badge status-qada text-[9px] mt-1">Qada</div>`;
        else if (status === 'jemaah') badge = `<div class="status-badge status-jemaah text-[9px] mt-1">Jemaah</div>`;
        
        const isNext = p.key === nextKey && !status;
        
        return `
            <div class="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-3 text-center border ${isNext ? 'border-emerald-500/50 ring-1 ring-emerald-500/30' : 'border-white/10'}">
                <div class="text-xs text-emerald-300">${p.name}</div>
                <div class="font-mono text-xl font-semibold mt-0.5">${p.time}</div>
                ${badge}
            </div>
        `;
    }).join('');
}

function updateNextPrayerCountdown() {
    const countdownEl = document.getElementById('next-prayer-countdown');
    if (!countdownEl) return;
    
    const now = new Date();
    let nextPrayer = null;
    
    for (const p of PRAYER_TIMES) {
        const [h, m] = p.time.split(':').map(Number);
        const target = new Date();
        target.setHours(h, m, 0, 0);
        
        if (target > now) {
            nextPrayer = { name: p.name, time: target };
            break;
        }
    }
    
    if (!nextPrayer) {
        const [h, m] = PRAYER_TIMES[0].time.split(':').map(Number);
        const target = new Date();
        target.setDate(target.getDate() + 1);
        target.setHours(h, m, 0, 0);
        nextPrayer = { name: 'Subuh', time: target };
    }
    
    const diff = Math.max(0, nextPrayer.time - now);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    countdownEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    updateCurrentPrayerLabel(nextPrayer.name);
}

function updateCurrentPrayerLabel(nextName) {
    const label = document.getElementById('current-or-next-prayer-label');
    if (!label) return;
    
    if (!nextName) {
        const now = new Date();
        for (const p of PRAYER_TIMES) {
            const [h, m] = p.time.split(':').map(Number);
            const target = new Date();
            target.setHours(h, m, 0, 0);
            if (target > now) {
                nextName = p.name;
                break;
            }
        }
        if (!nextName) nextName = 'Subuh';
    }
    
    const p = PRAYER_TIMES.find(x => x.name === nextName);
    label.textContent = nextName + (p ? ' • ' + p.time : '');
}

// -------------------- SOLAT MODULE --------------------
function renderSolatModule() {
    const container = document.getElementById('solat-prayer-cards');
    if (!container) return;
    
    container.innerHTML = PRAYER_TIMES.map(prayer => {
        const currentStatus = state.solat.today[prayer.key]?.status;
        
        return `
            <div class="premium-card glass rounded-3xl p-5 border border-white/10 prayer-card ${currentStatus ? 'marked' : ''}">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="font-semibold text-xl">${prayer.name}</div>
                        <div class="font-mono text-emerald-400 text-sm">${prayer.time}</div>
                    </div>
                    ${currentStatus ? 
                        `<div class="status-badge status-${currentStatus.includes('awal') ? 'awal' : currentStatus === 'jemaah' ? 'jemaah' : currentStatus}">${currentStatus.replace('_', ' ')}</div>` : 
                        `<div class="text-xs px-3 py-1 bg-white/5 rounded-full text-slate-400">Belum</div>`
                    }
                </div>
                
                <div class="mt-5 grid grid-cols-2 gap-2 text-xs">
                    <button onclick="markPrayer('${prayer.key}', 'awal_waktu')" 
                            class="py-2.5 rounded-2xl bg-emerald-600/90 hover:bg-emerald-600 active:bg-emerald-700 text-white text-xs font-medium transition-all">Awal Waktu</button>
                    
                    <button onclick="markPrayer('${prayer.key}', 'lewat')" 
                            class="py-2.5 rounded-2xl border border-white/20 hover:bg-white/5 text-xs font-medium transition-all">Lewat</button>
                    
                    <button onclick="markPrayer('${prayer.key}', 'jemaah')" 
                            class="py-2.5 rounded-2xl border border-white/20 hover:bg-white/5 text-xs font-medium transition-all">Jemaah</button>
                    
                    <button onclick="markPrayer('${prayer.key}', 'qada')" 
                            class="py-2.5 rounded-2xl border border-white/20 hover:bg-white/5 text-xs font-medium transition-all">Qada</button>
                </div>
            </div>
        `;
    }).join('');
    
    renderPrayerHeatmap();
}

function markPrayer(prayerKey, status) {
    const wasEmpty = !state.solat.today[prayerKey].status;
    state.solat.today[prayerKey].status = status;
    
    const todayStr = new Date().toISOString().split('T')[0];
    state.solat.history.push({
        date: todayStr,
        prayer: prayerKey,
        status: status,
        timestamp: new Date().toISOString()
    });
    
    Store.save();
    renderSolatModule();
    updateDashboardStats();
    
    const prayerName = PRAYER_TIMES.find(p => p.key === prayerKey).name;
    showToast(`Solat ${prayerName} → ${status.replace('_', ' ')}`, 'success');
    
    if (wasEmpty) {
        addXP(5, '• Solat');
        checkStreakAndAchievements();
    }
}

function markAllPrayersToday() {
    let newlyMarked = 0;
    PRAYER_TIMES.forEach(p => {
        if (!state.solat.today[p.key].status) {
            state.solat.today[p.key].status = 'awal_waktu';
            state.solat.history.push({
                date: new Date().toISOString().split('T')[0],
                prayer: p.key,
                status: 'awal_waktu'
            });
            newlyMarked++;
        }
    });
    
    Store.save();
    renderSolatModule();
    updateDashboardStats();
    
    if (newlyMarked > 0) {
        celebrate('big');
        addXP(newlyMarked * 8, '• Semua Solat Awal!');
        showToast('Alhamdulillah! Semua solat ditandakan Awal Waktu ✨', 'success');
        checkStreakAndAchievements();
    } else {
        showToast('Semua solat sudah ditandakan hari ini.', 'success');
    }
}

function renderPrayerHeatmap() {
    const container = document.getElementById('prayer-heatmap');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // More realistic completion based on streak
        const base = state.user.streak > 30 ? 0.85 : 0.7;
        const completion = Math.random() < base ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 1;
        const intensity = Math.min(4, Math.floor(completion / 1.25));
        
        const colors = ['#1e2937', '#14532d', '#166534', '#15803d', '#4ade80'];
        
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.style.backgroundColor = colors[intensity];
        cell.title = `${date.toLocaleDateString('ms-MY')} — ${completion}/5 solat`;
        
        container.appendChild(cell);
    }
}


// -------------------- QADA SOLAT MODULE --------------------
function renderQadaModule() {
    const container = document.getElementById('qada-cards');
    if (!container) return;
    
    let totalDebt = 0, totalCompleted = 0;
    
    container.innerHTML = PRAYER_TIMES.map(p => {
        const q = state.qada[p.key] || { debt: 0, completed: 0 };
        const remaining = Math.max(0, q.debt - q.completed);
        totalDebt += q.debt;
        totalCompleted += q.completed;
        const percent = q.debt > 0 ? Math.min(100, Math.round((q.completed / q.debt) * 100)) : 0;
        
        return `
            <div class="premium-card glass rounded-3xl p-5 border border-white/10">
                <div class="flex justify-between items-start mb-3">
                    <div class="font-semibold text-lg">${p.name}</div>
                    <div class="text-xs px-2.5 py-1 rounded-full ${remaining === 0 && q.debt > 0 ? 'bg-emerald-900/50 text-emerald-300' : 'bg-white/5 text-slate-400'}">
                        ${remaining === 0 && q.debt > 0 ? 'Selesai' : remaining + ' baki'}
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 text-center mb-4">
                    <div class="bg-white/5 rounded-2xl py-3">
                        <div class="text-[10px] text-slate-400">Total Debt</div>
                        <div class="text-2xl font-semibold tabular-nums">${q.debt}</div>
                    </div>
                    <div class="bg-white/5 rounded-2xl py-3">
                        <div class="text-[10px] text-slate-400">Completed</div>
                        <div class="text-2xl font-semibold tabular-nums text-emerald-400">${q.completed}</div>
                    </div>
                </div>
                
                <div class="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                    <div class="h-2 bg-emerald-500 rounded-full transition-all" style="width:${percent}%"></div>
                </div>
                
                <div class="flex gap-2">
                    <button onclick="adjustQadaDebt('${p.key}', 1)" class="flex-1 py-2 rounded-xl border border-white/15 text-xs hover:bg-white/5">+ Debt</button>
                    <button onclick="adjustQadaDebt('${p.key}', -1)" class="flex-1 py-2 rounded-xl border border-white/15 text-xs hover:bg-white/5">− Debt</button>
                    <button onclick="completeOneQada('${p.key}')" class="flex-1 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-xs font-medium text-white">+1 Done</button>
                </div>
                
                <div class="mt-3">
                    <button onclick="setQadaDebtPrompt('${p.key}')" class="w-full py-1.5 text-[10px] text-slate-400 hover:text-emerald-300">Set exact debt…</button>
                </div>
            </div>
        `;
    }).join('');
    
    const remainingTotal = Math.max(0, totalDebt - totalCompleted);
    const overallPercent = totalDebt > 0 ? Math.min(100, Math.round((totalCompleted / totalDebt) * 100)) : 0;
    
    const remEl = document.getElementById('qada-total-remaining');
    const pctEl = document.getElementById('qada-overall-percent');
    const barEl = document.getElementById('qada-overall-bar');
    const forecastEl = document.getElementById('qada-forecast');
    
    if (remEl) remEl.textContent = remainingTotal.toLocaleString();
    if (pctEl) pctEl.textContent = overallPercent + '%';
    if (barEl) barEl.style.width = overallPercent + '%';
    
    if (forecastEl) {
        if (remainingTotal === 0) {
            forecastEl.textContent = totalDebt > 0 ? 'Alhamdulillah! Semua qada telah selesai.' : 'Tiada hutang qada direkodkan lagi.';
        } else {
            const rate = state.qada.dailyRate || 1;
            const days = Math.ceil(remainingTotal / rate);
            const finish = new Date();
            finish.setDate(finish.getDate() + days);
            forecastEl.textContent = `AI Prediction: Jika buat ${rate} qada/hari, dijangka siap dalam ~${days} hari (${finish.toLocaleDateString('ms-MY', { day:'numeric', month:'short', year:'numeric' })}).`;
        }
    }
}

function adjustQadaDebt(key, delta) {
    if (!state.qada[key]) state.qada[key] = { debt: 0, completed: 0 };
    state.qada[key].debt = Math.max(0, state.qada[key].debt + delta);
    if (state.qada[key].completed > state.qada[key].debt) {
        state.qada[key].completed = state.qada[key].debt;
    }
    Store.save();
    renderQadaModule();
}

function setQadaDebtPrompt(key) {
    const current = state.qada[key]?.debt || 0;
    const val = prompt(`Masukkan jumlah hutang Qada untuk ${key.toUpperCase()}:`, current);
    if (val === null) return;
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0) {
        showToast('Sila masukkan nombor yang sah.', 'error');
        return;
    }
    if (!state.qada[key]) state.qada[key] = { debt: 0, completed: 0 };
    state.qada[key].debt = num;
    if (state.qada[key].completed > num) state.qada[key].completed = num;
    Store.save();
    renderQadaModule();
    showToast(`Hutang ${key} dikemaskini kepada ${num}`, 'success');
}

function completeOneQada(key) {
    if (!state.qada[key]) state.qada[key] = { debt: 0, completed: 0 };
    const q = state.qada[key];
    if (q.completed >= q.debt) {
        showToast('Tiada baki qada untuk waktu ini.', 'error');
        return;
    }
    q.completed += 1;
    Store.save();
    renderQadaModule();
    addXP(5, '• Qada ' + key);
    showToast(`Qada ${key} +1. Baki: ${q.debt - q.completed}`, 'success');
    
    if (q.completed >= q.debt && q.debt > 0) {
        celebrate();
        showToast(`Alhamdulillah! Qada ${key} selesai sepenuhnya.`, 'success');
    }
}


// -------------------- QADA PUASA --------------------
function renderQadaPuasa() {
    const qp = state.qadaPuasa || { totalDays: 0, completedDays: 0, dailyRate: 1 };
    const remain = Math.max(0, qp.totalDays - qp.completedDays);
    const pct = qp.totalDays > 0 ? Math.min(100, Math.round((qp.completedDays / qp.totalDays) * 100)) : 0;
    
    const el = (id) => document.getElementById(id);
    if (el('qp-total')) el('qp-total').textContent = qp.totalDays;
    if (el('qp-done')) el('qp-done').textContent = qp.completedDays;
    if (el('qp-remain')) el('qp-remain').textContent = remain;
    if (el('qp-percent')) el('qp-percent').textContent = pct + '%';
    if (el('qp-bar')) el('qp-bar').style.width = pct + '%';
    if (el('qp-debt-input')) el('qp-debt-input').value = qp.totalDays;
    
    const forecast = el('qp-forecast');
    if (forecast) {
        if (remain === 0) {
            forecast.textContent = qp.totalDays > 0 ? 'Alhamdulillah! Semua qada puasa telah selesai.' : 'Tiada hutang qada puasa.';
        } else {
            const days = Math.ceil(remain / (qp.dailyRate || 1));
            const finish = new Date();
            finish.setDate(finish.getDate() + days);
            forecast.textContent = `AI Forecast: ~${days} hari lagi (target siap ${finish.toLocaleDateString('ms-MY', {day:'numeric', month:'short', year:'numeric'})}).`;
        }
    }
}

function setQadaPuasaDebt() {
    const input = document.getElementById('qp-debt-input');
    const num = parseInt(input?.value || 0, 10);
    if (isNaN(num) || num < 0) {
        showToast('Masukkan nombor yang sah.', 'error');
        return;
    }
    state.qadaPuasa.totalDays = num;
    if (state.qadaPuasa.completedDays > num) state.qadaPuasa.completedDays = num;
    Store.save();
    renderQadaPuasa();
    showToast(`Hutang qada puasa: ${num} hari`, 'success');
}

function adjustQadaPuasa(delta) {
    state.qadaPuasa.totalDays = Math.max(0, (state.qadaPuasa.totalDays || 0) + delta);
    if (state.qadaPuasa.completedDays > state.qadaPuasa.totalDays) {
        state.qadaPuasa.completedDays = state.qadaPuasa.totalDays;
    }
    Store.save();
    renderQadaPuasa();
}

function completeQadaPuasa() {
    const qp = state.qadaPuasa;
    if (qp.completedDays >= qp.totalDays) {
        showToast('Tiada baki qada puasa.', 'error');
        return;
    }
    qp.completedDays += 1;
    Store.save();
    renderQadaPuasa();
    addXP(8, '• Qada Puasa');
    showToast(`Qada puasa +1. Baki: ${qp.totalDays - qp.completedDays} hari`, 'success');
    if (qp.completedDays >= qp.totalDays) {
        celebrate('big');
        showToast('Alhamdulillah! Semua qada puasa selesai.', 'success');
    }
}

// -------------------- SOLAT SUNAT --------------------
const SUNAT_LIST = [
    { key: 'tahajjud', name: 'Tahajjud', icon: '🌙' },
    { key: 'dhuha', name: 'Dhuha', icon: '☀️' },
    { key: 'rawatib', name: 'Rawatib', icon: '🕌' },
    { key: 'witir', name: 'Witir', icon: '✨' },
    { key: 'awwabin', name: 'Awwabin', icon: '🌟' },
    { key: 'taubat', name: 'Taubat', icon: '🙏' },
    { key: 'hajat', name: 'Hajat', icon: '💭' },
    { key: 'istikharah', name: 'Istikharah', icon: '🧭' },
    { key: 'tasbih', name: 'Tasbih', icon: '📿' },
    { key: 'eid', name: 'Solat Eid', icon: '🎉' },
    { key: 'others', name: 'Lain-lain', icon: '➕' }
];

function renderSolatSunat() {
    const grid = document.getElementById('sunat-prayer-grid');
    if (!grid) return;
    
    let todayCount = 0;
    grid.innerHTML = SUNAT_LIST.map(s => {
        const count = state.solatSunat[s.key] || 0;
        todayCount += count;
        return `
            <div class="premium-card glass rounded-3xl p-4 border border-white/10 text-center">
                <div class="text-2xl mb-1">${s.icon}</div>
                <div class="font-semibold text-sm">${s.name}</div>
                <div class="text-2xl font-semibold tabular-nums text-emerald-400 my-2">${count}</div>
                <button onclick="logSolatSunat('${s.key}')" class="w-full py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-xs font-medium text-white active:scale-95 transition-all">
                    + Rekod
                </button>
            </div>
        `;
    }).join('');
    
    const todayEl = document.getElementById('sunat-today-count');
    if (todayEl) todayEl.textContent = todayCount;
}

function logSolatSunat(key) {
    if (!state.solatSunat[key]) state.solatSunat[key] = 0;
    state.solatSunat[key] += 1;
    
    if (!state.solatSunat.history) state.solatSunat.history = [];
    state.solatSunat.history.unshift({
        type: key,
        date: new Date().toISOString(),
        name: SUNAT_LIST.find(s => s.key === key)?.name || key
    });
    
    // keep history short
    if (state.solatSunat.history.length > 50) state.solatSunat.history.length = 50;
    
    Store.save();
    renderSolatSunat();
    addXP(4, '• Solat Sunat');
    showToast(`${SUNAT_LIST.find(s => s.key === key)?.name || key} direkodkan`, 'success');
    
    // Tahajjud related achievement check
    if (key === 'tahajjud' && state.solatSunat.tahajjud >= 50) {
        unlockAchievement('tahajjud_50');
    }
}

// -------------------- PUASA SUNAT --------------------
const PUASA_SUNAT_TYPES = [
    { key: 'monday', name: 'Isnin', icon: '📅' },
    { key: 'thursday', name: 'Khamis', icon: '📅' },
    { key: 'ayyamul_bidh', name: 'Ayyamul Bidh', icon: '🌕' },
    { key: 'arafah', name: 'Arafah', icon: '🕋' },
    { key: 'ashura', name: 'Ashura', icon: '🖤' },
    { key: 'syawal', name: '6 Syawal', icon: '🌙' },
    { key: 'others', name: 'Lain-lain', icon: '✨' }
];

function renderPuasaSunat() {
    const grid = document.getElementById('puasa-sunat-grid');
    if (!grid) return;
    
    // Count this month per type
    const thisMonth = new Date().toISOString().slice(0, 7);
    const counts = {};
    (state.puasaSunat.logs || []).forEach(log => {
        if (log.date.startsWith(thisMonth)) {
            counts[log.type] = (counts[log.type] || 0) + 1;
        }
    });
    
    grid.innerHTML = PUASA_SUNAT_TYPES.map(t => {
        const cnt = counts[t.key] || 0;
        return `
            <div class="premium-card glass rounded-3xl p-5 border border-white/10">
                <div class="flex items-center gap-3 mb-3">
                    <div class="text-2xl">${t.icon}</div>
                    <div>
                        <div class="font-semibold">${t.name}</div>
                        <div class="text-xs text-slate-400">Bulan ini: ${cnt}x</div>
                    </div>
                </div>
                <button onclick="logPuasaSunat('${t.key}')" class="w-full py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-sm font-medium text-white active:scale-95 transition-all">
                    Rekod Hari Ini
                </button>
            </div>
        `;
    }).join('');
    
    // History
    const hist = document.getElementById('puasa-sunat-history');
    if (hist) {
        const logs = state.puasaSunat.logs || [];
        if (logs.length === 0) {
            hist.innerHTML = `<div class="text-xs text-slate-500 text-center py-4">Belum ada rekod</div>`;
        } else {
            hist.innerHTML = logs.slice(0, 10).map(log => {
                const name = PUASA_SUNAT_TYPES.find(t => t.key === log.type)?.name || log.type;
                const d = new Date(log.date).toLocaleDateString('ms-MY', { day:'numeric', month:'short' });
                return `<div class="flex justify-between py-2 border-b border-white/5 last:border-0">
                    <span>${name}</span>
                    <span class="text-xs text-slate-400">${d}</span>
                </div>`;
            }).join('');
        }
    }
}

function logPuasaSunat(type) {
    if (!state.puasaSunat.logs) state.puasaSunat.logs = [];
    
    const today = new Date().toISOString().split('T')[0];
    // prevent double log same type same day
    const exists = state.puasaSunat.logs.some(l => l.type === type && l.date.startsWith(today));
    if (exists) {
        showToast('Sudah direkodkan untuk hari ini.', 'error');
        return;
    }
    
    state.puasaSunat.logs.unshift({
        type,
        date: new Date().toISOString(),
        note: ''
    });
    
    if (state.puasaSunat.logs.length > 100) state.puasaSunat.logs.length = 100;
    
    Store.save();
    renderPuasaSunat();
    addXP(6, '• Puasa Sunat');
    const name = PUASA_SUNAT_TYPES.find(t => t.key === type)?.name || type;
    showToast(`Puasa Sunat ${name} direkodkan. Semoga diterima.`, 'success');
}

// -------------------- ZIKIR MODULE (UPGRADED) --------------------
const ZIKIR_LABELS = {
    subhanallah: 'SUBHANALLAH',
    alhamdulillah: 'ALHAMDULILLAH',
    allahuakbar: 'ALLAHU AKBAR',
    selawat: 'ALLAHUMMA SALLI ALA MUHAMMAD',
    lailaha: 'LA ILAHA ILLALLAH'
};

function setZikirType(type) {
    state.zikir.currentType = type;
    
    document.querySelectorAll('.zikir-type-btn').forEach(btn => {
        const isActive = btn.dataset.type === type;
        btn.classList.toggle('border-emerald-500/50', isActive);
        btn.classList.toggle('bg-emerald-900/30', isActive);
        btn.classList.toggle('text-emerald-300', isActive);
        btn.classList.toggle('border-white/15', !isActive);
        btn.classList.toggle('text-slate-300', !isActive);
    });
    
    const label = document.getElementById('zikir-label');
    if (label) label.textContent = ZIKIR_LABELS[type] || type.toUpperCase();
    
    Store.save();
}

function incrementZikir() {
    state.zikir.currentCount++;
    state.zikir.todayTotal = (state.zikir.todayTotal || 0) + 1;
    
    const counter = document.getElementById('zikir-counter');
    if (counter) {
        counter.textContent = state.zikir.currentCount;
        counter.style.transform = 'scale(1.06)';
        setTimeout(() => counter.style.transform = 'scale(1)', 100);
    }
    
    updateZikirProgress();
    
    // Every 33 counts small celebration
    if (state.zikir.currentCount % 33 === 0) {
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 }, colors: ['#10b981', '#d4af37'] });
        }
        showToast(`Subhanallah! ${state.zikir.currentCount} counts`, 'success');
    }
    
    if (state.zikir.currentCount % 10 === 0) Store.save();
}

function updateZikirProgress() {
    const bar = document.getElementById('zikir-progress-bar');
    const dailyEl = document.getElementById('zikir-daily');
    
    if (bar) {
        const percent = Math.min(100, Math.round((state.zikir.todayTotal / state.zikir.dailyTarget) * 100));
        bar.style.width = `${percent}%`;
    }
    if (dailyEl) dailyEl.textContent = state.zikir.todayTotal;
}

function resetZikir() {
    state.zikir.currentCount = 0;
    const counter = document.getElementById('zikir-counter');
    if (counter) counter.textContent = '0';
}

function saveZikirSession() {
    if (state.zikir.currentCount === 0) {
        showToast('Tiada zikir untuk disimpan.', 'error');
        return;
    }
    
    const count = state.zikir.currentCount;
    
    state.zikir.sessions.push({
        count: count,
        type: state.zikir.currentType,
        timestamp: new Date().toISOString()
    });
    
    state.zikir.todayTotal += count;
    state.zikir.currentCount = 0;
    
    const counter = document.getElementById('zikir-counter');
    if (counter) counter.textContent = '0';
    
    updateZikirProgress();
    Store.save();
    
    addXP(Math.min(20, Math.floor(count / 5)), '• Zikir');
    showToast(`Alhamdulillah! ${count} zikir (${ZIKIR_LABELS[state.zikir.currentType]}) direkodkan.`, 'success');
    
    // Check zikir achievement
    if (state.zikir.todayTotal >= 1000) {
        unlockAchievement('zikir_1000');
    }
}

// -------------------- QURAN --------------------

// -------------------- AL-QURAN FULL + KHATAM + HAFAZAN + TAJWID + SELAWAT --------------------
const SURAH_LIST = [
  {n:1, name:"Al-Fatihah"},{n:2, name:"Al-Baqarah"},{n:3, name:"Ali 'Imran"},{n:4, name:"An-Nisa"},{n:5, name:"Al-Ma'idah"},
  {n:6, name:"Al-An'am"},{n:7, name:"Al-A'raf"},{n:8, name:"Al-Anfal"},{n:9, name:"At-Tawbah"},{n:10, name:"Yunus"},
  {n:11, name:"Hud"},{n:12, name:"Yusuf"},{n:13, name:"Ar-Ra'd"},{n:14, name:"Ibrahim"},{n:15, name:"Al-Hijr"},
  {n:16, name:"An-Nahl"},{n:17, name:"Al-Isra"},{n:18, name:"Al-Kahf"},{n:19, name:"Maryam"},{n:20, name:"Ta-Ha"},
  {n:21, name:"Al-Anbiya"},{n:22, name:"Al-Hajj"},{n:23, name:"Al-Mu'minun"},{n:24, name:"An-Nur"},{n:25, name:"Al-Furqan"},
  {n:26, name:"Ash-Shu'ara"},{n:27, name:"An-Naml"},{n:28, name:"Al-Qasas"},{n:29, name:"Al-'Ankabut"},{n:30, name:"Ar-Rum"},
  {n:31, name:"Luqman"},{n:32, name:"As-Sajdah"},{n:33, name:"Al-Ahzab"},{n:34, name:"Saba"},{n:35, name:"Fatir"},
  {n:36, name:"Ya-Sin"},{n:37, name:"As-Saffat"},{n:38, name:"Sad"},{n:39, name:"Az-Zumar"},{n:40, name:"Ghafir"},
  {n:41, name:"Fussilat"},{n:42, name:"Ash-Shura"},{n:43, name:"Az-Zukhruf"},{n:44, name:"Ad-Dukhan"},{n:45, name:"Al-Jathiyah"},
  {n:46, name:"Al-Ahqaf"},{n:47, name:"Muhammad"},{n:48, name:"Al-Fath"},{n:49, name:"Al-Hujurat"},{n:50, name:"Qaf"},
  {n:51, name:"Adh-Dhariyat"},{n:52, name:"At-Tur"},{n:53, name:"An-Najm"},{n:54, name:"Al-Qamar"},{n:55, name:"Ar-Rahman"},
  {n:56, name:"Al-Waqi'ah"},{n:57, name:"Al-Hadid"},{n:58, name:"Al-Mujadila"},{n:59, name:"Al-Hashr"},{n:60, name:"Al-Mumtahanah"},
  {n:61, name:"As-Saff"},{n:62, name:"Al-Jumu'ah"},{n:63, name:"Al-Munafiqun"},{n:64, name:"At-Taghabun"},{n:65, name:"At-Talaq"},
  {n:66, name:"At-Tahrim"},{n:67, name:"Al-Mulk"},{n:68, name:"Al-Qalam"},{n:69, name:"Al-Haqqah"},{n:70, name:"Al-Ma'arij"},
  {n:71, name:"Nuh"},{n:72, name:"Al-Jinn"},{n:73, name:"Al-Muzzammil"},{n:74, name:"Al-Muddaththir"},{n:75, name:"Al-Qiyamah"},
  {n:76, name:"Al-Insan"},{n:77, name:"Al-Mursalat"},{n:78, name:"An-Naba"},{n:79, name:"An-Nazi'at"},{n:80, name:"'Abasa"},
  {n:81, name:"At-Takwir"},{n:82, name:"Al-Infitar"},{n:83, name:"Al-Mutaffifin"},{n:84, name:"Al-Inshiqaq"},{n:85, name:"Al-Buruj"},
  {n:86, name:"At-Tariq"},{n:87, name:"Al-A'la"},{n:88, name:"Al-Ghashiyah"},{n:89, name:"Al-Fajr"},{n:90, name:"Al-Balad"},
  {n:91, name:"Ash-Shams"},{n:92, name:"Al-Layl"},{n:93, name:"Ad-Duha"},{n:94, name:"Ash-Sharh"},{n:95, name:"At-Tin"},
  {n:96, name:"Al-'Alaq"},{n:97, name:"Al-Qadr"},{n:98, name:"Al-Bayyinah"},{n:99, name:"Az-Zalzalah"},{n:100, name:"Al-'Adiyat"},
  {n:101, name:"Al-Qari'ah"},{n:102, name:"At-Takathur"},{n:103, name:"Al-'Asr"},{n:104, name:"Al-Humazah"},{n:105, name:"Al-Fil"},
  {n:106, name:"Quraysh"},{n:107, name:"Al-Ma'un"},{n:108, name:"Al-Kawthar"},{n:109, name:"Al-Kafirun"},{n:110, name:"An-Nasr"},
  {n:111, name:"Al-Masad"},{n:112, name:"Al-Ikhlas"},{n:113, name:"Al-Falaq"},{n:114, name:"An-Nas"}
];

function populateSurahSelect() {
    const sel = document.getElementById('quran-surah');
    if (!sel || sel.options.length > 10) return; // already filled
    sel.innerHTML = SURAH_LIST.map(s => `<option value="${s.n}">${s.n}. ${s.name}</option>`).join('');
}

function renderKhatamProgress() {
    const juz = state.quran.juzCompleted || 0;
    const pct = Math.min(100, Math.round((juz / 30) * 100));
    const elJuz = document.getElementById('khatam-juz');
    const elBar = document.getElementById('khatam-bar');
    const elEst = document.getElementById('khatam-estimate');
    const elTotal = document.getElementById('khatam-total');
    if (elJuz) elJuz.textContent = juz;
    if (elBar) elBar.style.width = pct + '%';
    if (elTotal) elTotal.textContent = state.quran.totalKhatam || 0;
    
    if (elEst) {
        if (juz >= 30) {
            elEst.textContent = 'Khatam selesai! Alhamdulillah';
        } else {
            const remain = 30 - juz;
            const days = remain; // 1 juz/day plan
            const d = new Date();
            d.setDate(d.getDate() + days);
            elEst.textContent = `Anggaran siap (1 juz/hari): ${d.toLocaleDateString('ms-MY', {day:'numeric', month:'short', year:'numeric'})}`;
        }
    }
}




// Quran Audio — only valid Islamic Network CDN sources
let currentQuranAudio = null;

function playQuranAudio() {
    const surahSelect = document.getElementById('quran-surah');
    const reciterSelect = document.getElementById('quran-reciter');
    const audioEl = document.getElementById('quran-audio');
    const btn = document.getElementById('btn-play-quran');
    
    if (!surahSelect || !reciterSelect || !audioEl) return;
    
    const surahNum = parseInt(surahSelect.value) || 1;
    const key = reciterSelect.value || 'alafasy';
    const padded = String(surahNum).padStart(3, '0');
    
    // Verified working full-surah URLs from mp3quran.net (famous sheikhs)
    const RECITER_URLS = {
        alafasy:  `https://server8.mp3quran.net/afs/${padded}.mp3`,
        sudais:   `https://server11.mp3quran.net/sds/${padded}.mp3`,
        maher:    `https://server12.mp3quran.net/maher/${padded}.mp3`,
        husary:   `https://server13.mp3quran.net/husr/${padded}.mp3`,
        minshawi: `https://server10.mp3quran.net/minsh/${padded}.mp3`,
        shatri:   `https://server11.mp3quran.net/shatri/${padded}.mp3`,
        basit:    `https://server7.mp3quran.net/basit/${padded}.mp3`
    };
    
    const url = RECITER_URLS[key] || RECITER_URLS.alafasy;
    
    if (currentQuranAudio) {
        try { currentQuranAudio.pause(); } catch(e){}
    }
    
    audioEl.src = url;
    audioEl.style.display = 'block';
    audioEl.play().then(() => {
        currentQuranAudio = audioEl;
        if (btn) btn.textContent = '▶ Sedang dimainkan...';
        const name = (typeof SURAH_LIST !== 'undefined' ? SURAH_LIST.find(s => s.n === surahNum)?.name : null) || ('Surah ' + surahNum);
        const sheikh = reciterSelect.options[reciterSelect.selectedIndex]?.text || key;
        showToast(`Memainkan ${name} — ${sheikh}`, 'success');
    }).catch(err => {
        console.warn('Audio error', err);
        showToast('Gagal main audio. Cuba sheikh lain atau semak internet.', 'error');
        audioEl.style.display = 'none';
        if (btn) btn.textContent = '▶ Mainkan Surah';
    });
    
    audioEl.onended = () => {
        if (btn) btn.textContent = '▶ Mainkan Surah';
    };
}

function stopQuranAudio() {
    const audioEl = document.getElementById('quran-audio');
    const btn = document.getElementById('btn-play-quran');
    if (audioEl) {
        audioEl.pause();
        audioEl.currentTime = 0;
        audioEl.style.display = 'none';
    }
    if (btn) btn.textContent = '▶ Mainkan Surah';
    currentQuranAudio = null;
}


function logQuranReading() {
    const surahSelect = document.getElementById('quran-surah');
    const pagesInput = document.getElementById('quran-pages');
    const minutesSlider = document.getElementById('quran-minutes');
    
    if (!pagesInput) return;
    
    const pages = parseInt(pagesInput.value) || 1;
    const minutes = parseInt(minutesSlider?.value) || 15;
    const surahNum = parseInt(surahSelect?.value || 1);
    const surahName = SURAH_LIST.find(s => s.n === surahNum)?.name || ('Surah ' + surahNum);
    
    state.quran.todayPages = (state.quran.todayPages || 0) + pages;
    state.quran.readings = state.quran.readings || [];
    state.quran.readings.push({
        date: new Date().toISOString().split('T')[0],
        surah: surahName,
        surahNum,
        pages,
        minutes
    });
    
    // Rough juz progress (very approximate: ~20 pages = 1 juz)
    const addedJuz = pages / 20;
    state.quran.juzCompleted = Math.min(30, (state.quran.juzCompleted || 0) + addedJuz);
    if (state.quran.juzCompleted >= 30) {
        state.quran.juzCompleted = 0;
        state.quran.totalKhatam = (state.quran.totalKhatam || 0) + 1;
        celebrate('big');
        showToast('Alhamdulillah! Khatam selesai!', 'success');
    }
    
    Store.save();
    addXP(pages * 3, '• Quran');
    showToast(`Alhamdulillah! ${pages} muka (${surahName}) direkodkan.`, 'success');
    renderKhatamProgress();
    updateDashboardStats();
    pagesInput.value = '2';
}

// ---- HAFAZAN ----
function renderHafazan() {
    const list = document.getElementById('hafazan-list');
    if (!list) return;
    populateHafazSurah('all');
    const items = state.hafazan || [];
    if (items.length === 0) {
        list.innerHTML = `<div class="text-sm text-slate-500 text-center py-8">Belum ada hafazan direkodkan. Tambah di atas. Boleh mula dengan Juz Amma.</div>`;
        return;
    }
    const levelLabel = {new:'Baru', learning:'Sedang', good:'Baik', excellent:'Sangat Baik', mastered:'Lancar'};
    list.innerHTML = items.map((h, i) => {
        const sname = (typeof SURAH_LIST !== 'undefined' ? SURAH_LIST.find(s => s.n === h.surah)?.name : null) || '';
        return `
        <div class="glass rounded-2xl p-4 border border-white/10 flex justify-between items-center">
            <div>
                <div class="font-semibold">${h.surah}. ${sname} : ${h.start}–${h.end}</div>
                <div class="text-xs text-slate-400 mt-0.5">${levelLabel[h.level] || h.level} • ${new Date(h.updated).toLocaleDateString('ms-MY')}</div>
            </div>
            <button onclick="removeHafazan(${i})" class="text-xs text-red-400 hover:text-red-300 px-2">Hapus</button>
        </div>`;
    }).join('');
}


function populateHafazSurah(filter) {
    const sel = document.getElementById('hafaz-surah');
    if (!sel || typeof SURAH_LIST === 'undefined') return;
    let list = SURAH_LIST;
    if (filter === 'amma') list = SURAH_LIST.filter(s => s.n >= 78);
    sel.innerHTML = list.map(s => `<option value="${s.n}">${s.n}. ${s.name}</option>`).join('');
}

function filterHafazSurah(mode) {
    populateHafazSurah(mode === 'amma' ? 'amma' : 'all');
}

function addHafazan() {
    const surah = parseInt(document.getElementById('hafaz-surah')?.value || 1);
    const start = parseInt(document.getElementById('hafaz-start')?.value || 1);
    const end = parseInt(document.getElementById('hafaz-end')?.value || 1);
    const level = document.getElementById('hafaz-level')?.value || 'new';
    if (!state.hafazan) state.hafazan = [];
    state.hafazan.unshift({ surah, start, end, level, updated: new Date().toISOString() });
    Store.save();
    renderHafazan();
    addXP(6, '• Hafazan');
    showToast('Hafazan disimpan', 'success');
}

function removeHafazan(i) {
    state.hafazan.splice(i, 1);
    Store.save();
    renderHafazan();
}

// ---- TAJWID & TAHRIRI ----
const TAJWID_RULES = [
    {key:'ikhfa', name:'Ikhfa'}, {key:'idgham', name:'Idgham'}, {key:'iqlab', name:'Iqlab'},
    {key:'izhar', name:'Izhar'}, {key:'qalqalah', name:'Qalqalah'}, {key:'mad', name:'Mad'}, {key:'other', name:'Lain-lain'}
];


const TAJWID_HUKUM = {
    ikhfa: "Ikhfa: Nun sakinah/tanwin bertemu huruf ikhfa (ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك). Dibaca dengung samar.",
    idgham: "Idgham: Nun sakinah/tanwin bertemu ي ن م و ل ر. Ada Idgham Bighunnah & Bilaghunnah.",
    iqlab: "Iqlab: Nun sakinah/tanwin bertemu ب. Ditukar kepada mim dan dengung.",
    izhar: "Izhar: Nun sakinah/tanwin bertemu ء ه ع ح غ خ. Dibaca jelas tanpa dengung.",
    qalqalah: "Qalqalah: Huruf ق ط ب ج د ketika sukun — dibaca memantul.",
    mad: "Mad: Panjang bacaan (Mad Asli 2 harakat, Mad Wajib/Jaiz lebih panjang).",
    other: "Lain-lain: Ghunnah, Waqaf, Ibtida, Saktah, dll."
};

function renderTajwid() {
    const list = document.getElementById('tajwid-list');
    if (!list) return;
    list.innerHTML = TAJWID_RULES.map(r => {
        const pct = state.tajwid[r.key] || 0;
        return `
            <div>
                <div class="flex justify-between text-sm mb-1">
                    <span>${r.name}</span>
                    <span class="text-emerald-400">${pct}%</span>
                </div>
                <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-2 bg-emerald-500 rounded-full" style="width:${pct}%"></div>
                </div>
                <div class="flex gap-2 mt-1">
                    <button onclick="adjustTajwid('${r.key}', 5)" class="text-[10px] px-2 py-0.5 border border-white/10 rounded-lg hover:bg-white/5">+5%</button>
                    <button onclick="adjustTajwid('${r.key}', -5)" class="text-[10px] px-2 py-0.5 border border-white/10 rounded-lg hover:bg-white/5">−5%</button>
                </div>
            </div>
        `;
    }).join('');
    
    const info = document.getElementById('tajwid-info');
    if (info && typeof TAJWID_HUKUM !== 'undefined') {
        info.innerHTML = TAJWID_RULES.map(r => `
            <div class="bg-white/5 rounded-xl p-3">
                <div class="font-medium text-emerald-300 mb-0.5">${r.name}</div>
                <div>${TAJWID_HUKUM[r.key] || ''}</div>
            </div>
        `).join('');
    }
}

function adjustTajwid(key, delta) {
    state.tajwid[key] = Math.max(0, Math.min(100, (state.tajwid[key] || 0) + delta));
    Store.save();
    renderTajwid();
}



// Tahriri zoom & download
let tahririZoomPx = 28;
let lastTahririPlainText = '';

function zoomTahririText(delta) {
    tahririZoomPx = Math.max(16, Math.min(56, tahririZoomPx + delta));
    const el = document.getElementById('tahriri-arabic');
    const label = document.getElementById('tahriri-zoom-label');
    if (el) el.style.fontSize = tahririZoomPx + 'px';
    if (label) label.textContent = tahririZoomPx + 'px';
}

function downloadTahririText() {
    const arabicEl = document.getElementById('tahriri-arabic');
    const surahNum = parseInt(document.getElementById('tahriri-surah')?.value || 1);
    const start = parseInt(document.getElementById('tahriri-ayat-start')?.value || 1);
    const end = parseInt(document.getElementById('tahriri-ayat-end')?.value || 1);
    const sname = (typeof SURAH_LIST !== 'undefined' ? SURAH_LIST.find(s => s.n === surahNum)?.name : null) || ('Surah-' + surahNum);
    
    let text = lastTahririPlainText;
    if (!text && arabicEl) {
        // fallback: strip HTML roughly
        text = arabicEl.innerText || arabicEl.textContent || '';
    }
    if (!text || text.includes('Memuatkan') || text.includes('Gagal')) {
        showToast('Tiada teks untuk dimuat turun. Papar bacaan dulu.', 'error');
        return;
    }
    
    const header = `MUSLIM LIFE OS — Tahriri\n${sname} (Surah ${surahNum}) Ayat ${start}–${end}\nSumber: AlQuran Cloud (Uthmani)\n${'─'.repeat(40)}\n\n`;
    const blob = new Blob([header + text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tahriri_${surahNum}_${sname.replace(/\s+/g,'_')}_${start}-${end}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Teks dimuat turun', 'success');
}

async function loadTahririText() {
    const surahNum = parseInt(document.getElementById('tahriri-surah')?.value || 1);
    let start = parseInt(document.getElementById('tahriri-ayat-start')?.value || 1);
    let end = parseInt(document.getElementById('tahriri-ayat-end')?.value || 1);
    if (start < 1) start = 1;
    if (end < start) end = start;
    
    const area = document.getElementById('tahriri-text-area');
    const arabicEl = document.getElementById('tahriri-arabic');
    const statusEl = document.getElementById('tahriri-text-status');
    if (!area || !arabicEl) return;
    
    area.classList.remove('hidden');
    arabicEl.innerHTML = '<span class="text-slate-500 text-base">Memuatkan bacaan...</span>';
    if (statusEl) statusEl.textContent = '';
    
    try {
        // Official AlQuran Cloud — Uthmani script (sahih)
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`);
        if (!res.ok) throw new Error('API error ' + res.status);
        const data = await res.json();
        const ayahs = data.data?.ayahs || [];
        const total = ayahs.length;
        
        // clamp range
        if (end > total) end = total;
        if (start > total) start = 1;
        
        const selected = ayahs.filter(a => a.numberInSurah >= start && a.numberInSurah <= end);
        if (!selected.length) {
            arabicEl.innerHTML = '<span class="text-red-400 text-base">Tiada ayat dalam julat ini.</span>';
            return;
        }
        
        lastTahririPlainText = selected.map(a => `﴿${a.numberInSurah}﴾ ${a.text}`).join('\n\n');
        arabicEl.innerHTML = selected.map(a => {
            return `<div class="mb-4">
                <span class="text-emerald-400/70 text-sm ml-2">﴿${a.numberInSurah}﴾</span>
                ${a.text}
            </div>`;
        }).join('');
        // apply current zoom
        arabicEl.style.fontSize = tahririZoomPx + 'px';
        const zl = document.getElementById('tahriri-zoom-label');
        if (zl) zl.textContent = tahririZoomPx + 'px';
        
        const sname = (typeof SURAH_LIST !== 'undefined' ? SURAH_LIST.find(s => s.n === surahNum)?.name : data.data?.englishName) || '';
        if (statusEl) {
            statusEl.textContent = `${sname} • Ayat ${start}–${end} daripada ${total} • Sumber: AlQuran Cloud (Uthmani)`;
        }
    } catch (err) {
        console.warn(err);
        arabicEl.innerHTML = '<span class="text-red-400 text-base">Gagal muat bacaan. Semak internet.</span>';
        if (statusEl) statusEl.textContent = 'Perlu sambungan internet untuk papar teks.';
    }
}

function populateTahririSurah() {
    const sel = document.getElementById('tahriri-surah');
    if (!sel || typeof SURAH_LIST === 'undefined') return;
    if (sel.options.length > 5) return; // already filled
    sel.innerHTML = SURAH_LIST.map(s => `<option value="${s.n}">${s.n}. ${s.name}</option>`).join('');
}

function logTahriri() {
    const score = parseInt(document.getElementById('tahriri-score')?.value || 0);
    const mistakes = parseInt(document.getElementById('tahriri-mistakes')?.value || 0);
    const notes = document.getElementById('tahriri-notes')?.value || '';
    const surahNum = parseInt(document.getElementById('tahriri-surah')?.value || 1);
    const ayatStart = parseInt(document.getElementById('tahriri-ayat-start')?.value || 1);
    const ayatEnd = parseInt(document.getElementById('tahriri-ayat-end')?.value || 1);
    const surahName = (typeof SURAH_LIST !== 'undefined' ? SURAH_LIST.find(s => s.n === surahNum)?.name : null) || ('Surah ' + surahNum);
    
    if (!state.tahriri) state.tahriri = [];
    state.tahriri.unshift({
        surah: surahNum,
        surahName,
        ayatStart,
        ayatEnd,
        score,
        mistakes,
        notes,
        date: new Date().toISOString()
    });
    if (state.tahriri.length > 30) state.tahriri.length = 30;
    Store.save();
    renderTahririHistory();
    addXP(5, '• Tahriri');
    showToast(`Tahriri ${surahName} (${ayatStart}–${ayatEnd}) disimpan`, 'success');
}

function renderTahririHistory() {
    const el = document.getElementById('tahriri-history');
    if (!el) return;
    populateTahririSurah();
    const items = state.tahriri || [];
    if (!items.length) {
        el.innerHTML = `<div class="text-xs text-slate-500">Belum ada sesi tracing</div>`;
        return;
    }
    el.innerHTML = items.slice(0,8).map(t => {
        const d = new Date(t.date).toLocaleDateString('ms-MY', {day:'numeric', month:'short'});
        const sname = t.surahName || ('Surah ' + (t.surah || '?'));
        const range = (t.ayatStart && t.ayatEnd) ? ` ${t.ayatStart}–${t.ayatEnd}` : '';
        return `<div class="flex justify-between text-xs border-b border-white/5 py-2 gap-2">
            <span class="truncate">${d} • <strong>${sname}</strong>${range}</span>
            <span class="text-emerald-400 shrink-0">Skor ${t.score} · ${t.mistakes} silap</span>
        </div>`;
    }).join('');
}

// ---- SELAWAT ----
function aiReviewTahriri() {
    const score = parseInt(document.getElementById('tahriri-score')?.value || 0);
    const mistakes = parseInt(document.getElementById('tahriri-mistakes')?.value || 0);
    const box = document.getElementById('tahriri-ai-feedback');
    if (!box) return;
    
    let feedback = '';
    if (score >= 90 && mistakes <= 1) {
        feedback = '✨ Semakan AI: Sangat baik. Tulisan rapi, hampir tiada kesalahan. Teruskan latihan harian untuk kekalkan konsistensi.';
    } else if (score >= 75) {
        feedback = '✨ Semakan AI: Baik. Ada sedikit ruang penambahbaikan pada jarak huruf / baris. Ulang 1–2 baris yang lemah.';
    } else if (score >= 50) {
        feedback = '✨ Semakan AI: Sederhana. Fokus pada bentuk huruf yang kerap silap. Cadangan: trace perlahan sambil dengar tilawah.';
    } else {
        feedback = '✨ Semakan AI: Perlu banyak latihan. Mulakan dengan surah pendek (Juz Amma). Jangan kejar cepat — ketepatan lebih penting.';
    }
    if (mistakes >= 5) {
        feedback += ' Bilangan kesalahan agak tinggi — semak semula huruf yang sama berulang kali.';
    }
    feedback += ' (Nota: Ini semakan berdasarkan skor yang anda masukkan. Semakan AI visual sebenar memerlukan kamera + model di masa hadapan.)';
    
    box.textContent = feedback;
    box.classList.remove('hidden');
    showToast('Semakan AI dijana', 'success');
}


function incrementSelawat() {
    state.selawat.current = (state.selawat.current || 0) + 1;
    state.selawat.todayTotal = (state.selawat.todayTotal || 0) + 1;
    updateSelawatUI();
    if (state.selawat.current % 10 === 0) Store.save();
    if (state.selawat.current % 33 === 0 && typeof confetti !== 'undefined') {
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 }, colors: ['#f59e0b', '#fbbf24'] });
    }
}

function updateSelawatUI() {
    const counter = document.getElementById('selawat-counter');
    const daily = document.getElementById('selawat-daily');
    const target = document.getElementById('selawat-target');
    const bar = document.getElementById('selawat-bar');
    if (counter) counter.textContent = state.selawat.current || 0;
    if (daily) daily.textContent = state.selawat.todayTotal || 0;
    if (target) target.textContent = state.selawat.dailyTarget || 100;
    if (bar) {
        const pct = Math.min(100, Math.round(((state.selawat.todayTotal || 0) / (state.selawat.dailyTarget || 100)) * 100));
        bar.style.width = pct + '%';
    }
}

function resetSelawat() {
    state.selawat.current = 0;
    updateSelawatUI();
}

function saveSelawatSession() {
    const count = state.selawat.current || 0;
    if (count === 0) {
        showToast('Tiada selawat untuk disimpan', 'error');
        return;
    }
    if (!state.selawat.sessions) state.selawat.sessions = [];
    state.selawat.sessions.push({ count, date: new Date().toISOString() });
    state.selawat.current = 0;
    Store.save();
    updateSelawatUI();
    addXP(Math.min(25, Math.floor(count / 4)), '• Selawat');
    showToast(`${count} selawat disimpan. Jazakallah.`, 'success');
}

// -------------------- GOALS --------------------
function renderGoalsModule() {
    const container = document.getElementById('goals-grid');
    if (!container) return;
    
    container.innerHTML = state.goals.map(goal => {
        const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
        
        return `
            <div class="premium-card glass rounded-3xl p-6 border border-white/10">
                <div class="flex justify-between">
                    <div class="text-3xl">${goal.icon}</div>
                    <div class="text-xs px-3 h-fit py-1 rounded-full bg-emerald-900/40 text-emerald-300 font-medium">${progress}%</div>
                </div>
                
                <div class="mt-4">
                    <div class="font-semibold text-lg leading-tight">${goal.title}</div>
                    <div class="mt-4 flex items-baseline gap-x-1">
                        <span class="text-4xl font-semibold tabular-nums">${goal.current}</span>
                        <span class="text-emerald-300 text-sm">/ ${goal.target}</span>
                    </div>
                </div>
                
                <div class="mt-5 h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-2.5 bg-emerald-500 transition-all rounded-full" style="width: ${progress}%"></div>
                </div>
                
                <button onclick="incrementGoal('${goal.id}')" 
                        class="mt-4 w-full text-xs py-2.5 border border-white/15 hover:bg-white/5 rounded-2xl font-medium active:scale-[0.985]">
                    + Tambah 1
                </button>
            </div>
        `;
    }).join('');
}

function incrementGoal(goalId) {
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal) return;
    
    goal.current = Math.min(goal.target, goal.current + 1);
    Store.save();
    
    renderGoalsModule();
    updateDashboardStats();
    
    if (goal.current === goal.target) {
        celebrate('big');
        addXP(50, `• Goal completed: ${goal.title}`);
        showToast(`Alhamdulillah! Matlamat "${goal.title}" telah dicapai!`, 'success');
    } else {
        addXP(3, '');
    }
}

// -------------------- SEDEKAH MODULE (NEW) --------------------
let selectedSedekahCategory = 'money';

function selectSedekahCategory(cat) {
    selectedSedekahCategory = cat;
    document.querySelectorAll('.sedekah-cat').forEach(btn => {
        const isActive = btn.dataset.cat === cat;
        btn.classList.toggle('border-emerald-500/60', isActive);
        btn.classList.toggle('bg-emerald-900/20', isActive);
    });
}

function logSedekah() {
    const amountInput = document.getElementById('sedekah-amount');
    const noteInput = document.getElementById('sedekah-note');
    
    const amount = parseFloat(amountInput?.value) || 0;
    const note = noteInput?.value.trim() || '';
    
    const entry = {
        id: Date.now(),
        category: selectedSedekahCategory,
        amount: amount,
        note: note,
        date: new Date().toISOString()
    };
    
    state.sedekah.logs.unshift(entry);
    state.sedekah.monthlyTotal = (state.sedekah.monthlyTotal || 0) + amount;
    
    // Also increment the sedekah goal
    const sedekahGoal = state.goals.find(g => g.type === 'sedekah');
    if (sedekahGoal) sedekahGoal.current = Math.min(sedekahGoal.target, sedekahGoal.current + 1);
    
    Store.save();
    
    if (amountInput) amountInput.value = '';
    if (noteInput) noteInput.value = '';
    
    renderSedekahHistory();
    addXP(8, '• Sedekah');
    showToast('Sedekah direkodkan. Semoga diberkati Allah 🤲', 'success');
    
    // Check achievement
    if (state.sedekah.logs.length >= 10) {
        unlockAchievement('sedekah_10');
    }
}

function renderSedekahHistory() {
    const container = document.getElementById('sedekah-history');
    const monthlyEl = document.getElementById('sedekah-monthly');
    
    if (monthlyEl) {
        monthlyEl.textContent = `RM ${state.sedekah.monthlyTotal.toLocaleString('ms-MY', { minimumFractionDigits: 0 })}`;
    }
    
    if (!container) return;
    
    if (state.sedekah.logs.length === 0) {
        container.innerHTML = `<div class="text-xs text-slate-500 text-center py-4">Belum ada rekod</div>`;
        return;
    }
    
    const catEmoji = {
        money: '💰', food: '🍲', goods: '🎁', volunteer: '🤝', anonymous: '🤫'
    };
    
    container.innerHTML = state.sedekah.logs.slice(0, 8).map(log => {
        const date = new Date(log.date).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' });
        return `
            <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div class="flex items-center gap-x-2">
                    <span>${catEmoji[log.category] || '💝'}</span>
                    <div>
                        <div class="text-xs font-medium">${log.note || log.category}</div>
                        <div class="text-[10px] text-slate-500">${date}</div>
                    </div>
                </div>
                ${log.amount > 0 ? `<div class="text-xs text-emerald-400 font-medium">RM ${log.amount}</div>` : ''}
            </div>
        `;
    }).join('');
}

// -------------------- ACHIEVEMENTS (NEW) --------------------
function renderAchievements() {
    const container = document.getElementById('achievements-grid');
    if (!container) return;
    
    // Update header stats
    const levelEl = document.getElementById('ach-level');
    const xpEl = document.getElementById('ach-xp');
    if (levelEl) levelEl.textContent = `Level ${state.user.level}`;
    if (xpEl) xpEl.textContent = `${state.user.xp.toLocaleString()} XP`;
    
    container.innerHTML = state.achievements.map(ach => {
        const locked = !ach.unlocked;
        return `
            <div class="premium-card glass rounded-3xl p-5 border ${locked ? 'border-white/5 opacity-60' : 'border-amber-500/30'} text-center relative overflow-hidden">
                ${ach.unlocked ? '<div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>' : ''}
                <div class="text-4xl mb-3 ${locked ? 'grayscale' : ''}">${ach.icon}</div>
                <div class="font-semibold text-sm leading-tight">${ach.name}</div>
                <div class="text-[10px] text-slate-400 mt-1.5 line-clamp-2">${ach.desc}</div>
                <div class="mt-3 text-xs ${ach.unlocked ? 'text-amber-400' : 'text-slate-500'}">
                    ${ach.unlocked ? `+${ach.xp} XP` : 'Locked'}
                </div>
            </div>
        `;
    }).join('');
}

function unlockAchievement(code) {
    const ach = state.achievements.find(a => a.code === code);
    if (!ach || ach.unlocked) return;
    
    ach.unlocked = true;
    Store.save();
    
    celebrate('big');
    addXP(ach.xp, `• Badge: ${ach.name}`);
    showToast(`🏅 Badge Unlocked: ${ach.name}!`, 'success');
    
    // Re-render if on achievements page
    if (document.getElementById('view-achievements')?.classList.contains('active')) {
        renderAchievements();
    }
}

// -------------------- DASHBOARD UPDATES --------------------
function updateDashboardStats() {
    const streakEls = document.querySelectorAll('#streak-count, #sidebar-streak');
    streakEls.forEach(el => el.textContent = state.user.streak);
    
    const ibadahEl = document.getElementById('ibadah-score');
    if (ibadahEl) {
        const completed = Object.values(state.solat.today).filter(p => p.status).length;
        const score = Math.min(100, 70 + completed * 5 + Math.floor(state.user.streak / 5));
        ibadahEl.textContent = score;
    }
    
    const recentContainer = document.getElementById('recent-activities');
    if (recentContainer) {
        const items = [];
        
        // From solat history
        state.solat.history.slice(-2).reverse().forEach(h => {
            items.push(`<div class="glass rounded-2xl px-4 py-3 text-sm flex gap-x-3 items-center border border-white/10">
                <div>🕌</div>
                <div class="flex-1">Solat ${h.prayer} — <span class="text-emerald-400">${h.status.replace('_', ' ')}</span></div>
            </div>`);
        });
        
        if (state.zikir.sessions.length > 0) {
            const last = state.zikir.sessions[state.zikir.sessions.length - 1];
            items.push(`<div class="glass rounded-2xl px-4 py-3 text-sm flex gap-x-3 items-center border border-white/10">
                <div>📿</div>
                <div class="flex-1">Zikir ${last.count}x • ${last.type}</div>
            </div>`);
        }
        
        if (state.sedekah.logs.length > 0) {
            items.push(`<div class="glass rounded-2xl px-4 py-3 text-sm flex gap-x-3 items-center border border-white/10">
                <div>💝</div>
                <div class="flex-1">Sedekah direkodkan</div>
            </div>`);
        }
        
        if (items.length === 0) {
            items.push(`<div class="glass rounded-2xl px-4 py-3 text-sm flex gap-x-3 items-center border border-white/10">
                <div>✨</div>
                <div class="flex-1">Mulakan ibadah hari ini</div>
            </div>`);
        }
        
        recentContainer.innerHTML = items.slice(0, 3).join('');
    }
}

function checkStreakAndAchievements() {
    const completedToday = Object.values(state.solat.today).filter(p => p.status).length;
    
    if (completedToday === 5) {
        // In a real app we would check consecutive days properly
        // For demo we gently increase
        if (Math.random() > 0.3) {
            state.user.streak++;
            const streakEls = document.querySelectorAll('#streak-count, #sidebar-streak');
            streakEls.forEach(el => el.textContent = state.user.streak);
            Store.save();
        }
        
        if (state.user.streak >= 7) unlockAchievement('streak_7');
        if (state.user.streak >= 30) unlockAchievement('streak_30');
    }
}

// -------------------- STATS CHARTS --------------------
let weeklyChartInstance = null;
let balanceChartInstance = null;

function renderStatsCharts() {
    const weeklyCtx = document.getElementById('weekly-chart');
    if (weeklyCtx) {
        if (weeklyChartInstance) weeklyChartInstance.destroy();
        
        weeklyChartInstance = new Chart(weeklyCtx, {
            type: 'bar',
            data: {
                labels: ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'],
                datasets: [{
                    label: 'Ibadah Score',
                    data: [92, 78, 95, 88, 100, 85, 70],
                    backgroundColor: '#10b981',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                    y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.06)' } },
                    x: { grid: { color: 'rgba(255,255,255,0.06)' } }
                }
            }
        });
    }
    
    const balanceCtx = document.getElementById('balance-chart');
    if (balanceCtx) {
        if (balanceChartInstance) balanceChartInstance.destroy();
        
        balanceChartInstance = new Chart(balanceCtx, {
            type: 'radar',
            data: {
                labels: ['Solat', 'Quran', 'Zikir', 'Puasa', 'Sedekah', 'Muhasabah'],
                datasets: [{
                    label: 'Current',
                    data: [92, 65, 87, 40, 55, 78],
                    borderColor: '#34d399',
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                    pointBackgroundColor: '#34d399'
                }]
            },
            options: {
                responsive: true,
                scales: { r: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.1)' } } },
                plugins: { legend: { display: false } }
            }
        });
    }
}

// -------------------- PROFILE & SETTINGS --------------------
function showProfileModal() {
    const modal = document.getElementById('profile-modal');
    const nameInput = document.getElementById('profile-fullname');
    
    if (nameInput) nameInput.value = state.user.name || 'Pengguna';
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function hideProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

function saveProfile() {
    const nameInput = document.getElementById('profile-fullname');
    if (nameInput) {
        state.user.name = nameInput.value.trim() || state.user.name;
        const nameEls = document.querySelectorAll('#profile-name');
        nameEls.forEach(el => el.textContent = state.user.name);
        
        const greeting = document.getElementById('greeting');
        if (greeting) greeting.textContent = `Assalamualaikum, ${state.user.name}`;
    }
    
    Store.save();
    hideProfileModal();
    showToast('Profile updated successfully.');
}

function syncWithSupabase() {
    showToast('Syncing with Supabase... (Demo)');
    setTimeout(() => {
        showToast('✅ Data synced successfully to cloud.', 'success');
    }, 1350);
}

function exportData() {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `muslim-life-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showToast('Data exported successfully.');
}

function logoutDemo() {
    if (confirm('Reset demo data and reload?')) {
        Store.resetDemo();
    }
}

// -------------------- INITIALIZATION --------------------
function initializeApp() {
    console.log('%c[MUSLIM LIFE OS] v1.2 — Real Prayer Times (JAKIM) + Qada Tracker', 'color:#166534; font-weight:bold');
    
    Store.load();
    
    // Ensure dark mode
    document.documentElement.classList.add('dark');
    
    updateHeaderDates();
    setInterval(updateHeaderDates, 60000);
    
    // Fetch live prayer times (AlAdhan JAKIM) with cache
    fetchPrayerTimes().then(() => {
        updateNextPrayerCountdown();
        renderPrayerTimesGrid();
    });
    setInterval(updateNextPrayerCountdown, 1000);
    
    buildSidebarNav();
    renderPrayerTimesGrid();
    updateDashboardStats();
    
    renderMoodSelector();
    updateZikirProgress();
    populateSurahSelect();
    renderKhatamProgress();
    
    // Init Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Show dashboard
    const dashboard = document.getElementById('view-dashboard');
    if (dashboard) dashboard.classList.add('active');
    
    // Keyboard shortcut
    document.addEventListener('keydown', function(e) {
        if (e.metaKey && e.key === '/') {
            e.preventDefault();
            showModule('zikir');
        }
    });
    
    // Minutes slider live update (if exists)
    const minutesSlider = document.getElementById('quran-minutes');
    const minutesValue = document.getElementById('minutes-value');
    if (minutesSlider && minutesValue) {
        minutesSlider.addEventListener('input', () => {
            minutesValue.textContent = minutesSlider.value + ' min';
        });
    }
    
    console.log('%c[MUSLIM LIFE OS™] Ready. Offline-first • Premium Islamic UX', 'color:#166534');
    if (localStorage.getItem('mlos_notif') === '1' && typeof schedulePrayerNotifications === 'function') {
        setTimeout(schedulePrayerNotifications, 2000);
    }
    if (window.MLOS_SB) {
        MLOS_SB.init().then(() => {
            refreshAuthUI();
            console.log('%c[Supabase] Auth ready', 'color:#166534');
        }).catch(e => console.warn('Supabase init', e));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// -------------------- AI IMAM --------------------
const AI_TIPS = [
    "Mulakan hari dengan doa dan solat Subuh tepat waktu. Barakah pagi membawa barakah sepanjang hari.",
    "Baca walaupun 1 muka surat Al-Quran setiap hari. Konsisten lebih baik daripada sekali banyak.",
    "Sedekah tidak mengurangkan harta. Ia membersihkan hati dan membuka pintu rezeki.",
    "Jika terlepas solat, segera qada. Jangan biarkan hutang ibadah menumpuk.",
    "Tahajjud 2 rakaat lebih baik daripada tidur panjang tanpa manfaat.",
    "Ajarkan anak solat dengan lembut, bukan dengan marah. Contoh lebih kuat daripada kata-kata.",
    "Zikir selepas solat adalah perisai daripada kealpaan.",
    "Muhasabah setiap malam: Apa yang saya buat hari ini yang mendekatkan saya kepada Allah?"
];

const AI_RESPONSES = [
    { keys: ["subuh", "bangun pagi", "pagi", "fajr"], ans: "Tips Solat Subuh: Tidur awal, letak jam jauh dari katil, niat kuat sebelum tidur. Bangun terus ambil wuduk, jangan layan telefon. Solat Subuh disaksikan malaikat malam & siang." },
    { keys: ["tahajjud", "malam", "qiyam"], ans: "Tahajjud: Mulakan 2 rakaat sahaja. Tidur awal, bangun 30–45 minit sebelum Subuh. Rasulullah ﷺ tidak pernah meninggalkan tahajjud." },
    { keys: ["khatam", "quran", "bacaan", "tilawah"], ans: "Untuk khatam: Target 1 juz sehari = 30 hari. Pecahkan slot (Subuh, petang, malam). Konsisten lebih penting daripada laju." },
    { keys: ["was-was", "waswas", "ragu"], ans: "Was-was solat: Abaikan bisikan syaitan, teruskan solat. Jangan ulang wuduk/solat tanpa sebab jelas. Ucap ta'awwuz dan bertawakal." },
    { keys: ["sedekah", "derma", "infaq"], ans: "Sedekah: Mulakan kecil tapi konsisten. Niat ikhlas. Sedekah memadam dosa & membuka rezeki." },
    { keys: ["anak", "keluarga", "family", "didik"], ans: "Didik anak dengan contoh. Solat bersama, baca Quran bersama, puji usaha mereka. Doakan mereka selalu." },
    { keys: ["malas", "lemah", "motivasi", "bosan"], ans: "Bila rasa malas: Ingat mati, buat solat dulu walaupun berat. Selepas solat hati biasanya lebih ringan. Istiqamah sedikit demi sedikit." },
    { keys: ["doa", "minta", "hajat"], ans: "Adab doa: Angkat tangan, puji Allah, selawat ke atas Nabi ﷺ, sebut hajat dengan yakin, tutup dengan selawat & amin." },
    { keys: ["istighfar", "taubat", "dosa"], ans: "Perbanyak istighfar. Rasulullah ﷺ beristighfar 70–100 kali sehari. Taubat: tinggalkan dosa, sesal, azam tidak ulang." },
    { keys: ["selawat", "nabi"], ans: "Perbanyak selawat ke atas Nabi ﷺ. Ia mengangkat darjat, menghapus dosa, dan doa lebih mustajab." },
    { keys: ["zikir", "dzikir", "wirid"], ans: "Zikir selepas solat: Subhanallah 33, Alhamdulillah 33, Allahu Akbar 34. Ditambah Ayat Kursi. Zikir menenangkan hati." },
    { keys: ["sabar", "ujian", "susah"], ans: "Sabar ada 3: sabar taat, sabar tinggalkan maksiat, sabar atas ujian. Bersama kesulitan ada kemudahan." },
    { keys: ["syukur", "nikmat"], ans: "Syukur dengan hati, lidah & perbuatan. Yang sedikit tapi disyukuri lebih baik daripada banyak yang dilupakan." },
    { keys: ["assalamualaikum", "hai", "hello", "salam"], ans: "Waalaikumussalam warahmatullahi wabarakatuh. Tanya sahaja tentang solat, Quran, motivasi, atau amalan sunnah." },
    { keys: ["terima kasih", "thanks", "jazak"], ans: "Wa iyyakum. Semoga Allah mudahkan semua urusan kebaikan anda. Teruskan istiqamah." },
    { keys: ["sunnah", "sunah", "rasulullah"], ans: "Amalan sunnah mudah: senyum, baca Bismillah, tidur atas kanan, masuk masjid dengan kaki kanan, perbanyak selawat, bersiwak, dan jaga solat sunat rawatib." }
];

function renderAIImam() {
    const tip = document.getElementById('ai-daily-tip');
    if (tip) {
        const day = new Date().getDate();
        tip.textContent = AI_TIPS[day % AI_TIPS.length];
    }
}

function quickAsk(q) {
    const input = document.getElementById('ai-input');
    if (input) input.value = q;
    askAIImam();
}

function askAIImam() {
    const input = document.getElementById('ai-input');
    const chat = document.getElementById('ai-chat');
    if (!input || !chat) return;
    const q = (input.value || '').trim();
    if (!q) return;
    
    // user bubble
    chat.innerHTML += `<div class="flex justify-end"><div class="bg-emerald-700/40 border border-emerald-500/30 rounded-2xl rounded-br-md px-4 py-2.5 text-sm max-w-[85%]">${escapeHtml(q)}</div></div>`;
    input.value = '';
    
    const lower = q.toLowerCase();
    let ans = null;
    for (const r of AI_RESPONSES) {
        if (r.keys.some(k => lower.includes(k))) {
            ans = r.ans;
            break;
        }
    }
    if (!ans) {
        ans = "Terima kasih atas soalan. Teruskan istiqamah dalam solat, bacaan Quran, dan akhlak. Untuk hukum yang spesifik, sila rujuk ustaz yang dipercayai. Saya boleh bantu dengan tips motivasi & amalan harian.";
    }
    
    setTimeout(() => {
        chat.innerHTML += `<div class="flex justify-start"><div class="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm max-w-[85%] text-slate-200">${escapeHtml(ans)}</div></div>`;
        chat.scrollTop = chat.scrollHeight;
    }, 400);
    
    if (!state.aiImam) state.aiImam = { history: [] };
    state.aiImam.history.push({ q, a: ans, date: new Date().toISOString() });
    if (state.aiImam.history.length > 30) state.aiImam.history.shift();
    Store.save();
}

function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// -------------------- FAMILY MODE (enhanced + solat tracking) --------------------
function ensureFamilyState() {
    if (!state.family) state.family = { members: [], goals: [], todayLogs: { solat: 0, quran: 0, zikir: 0 } };
    if (!Array.isArray(state.family.members)) state.family.members = [];
    if (!Array.isArray(state.family.goals)) state.family.goals = [];
    if (!state.family.todayLogs) state.family.todayLogs = { solat: 0, quran: 0, zikir: 0 };
}

function renderFamily() {
    ensureFamilyState();
    const list = document.getElementById('family-list');
    const goalsEl = document.getElementById('family-goals');
    const prayers = ['subuh', 'zohor', 'asar', 'maghrib', 'isyak'];
    const labels = { subuh: 'Subuh', zohor: 'Zohor', asar: 'Asar', maghrib: 'Maghrib', isyak: 'Isyak' };
    
    if (list) {
        const members = state.family.members;
        if (!members.length) {
            list.innerHTML = `<div class="text-xs text-slate-500 text-center py-4">Belum ada ahli. Tambah nama di atas.</div>`;
        } else {
            list.innerHTML = members.map((m, i) => {
                if (!m.solat) m.solat = { subuh: false, zohor: false, asar: false, maghrib: false, isyak: false };
                const done = prayers.filter(p => m.solat[p]).length;
                const chips = prayers.map(p => {
                    const on = m.solat[p];
                    return `<button type="button" onclick="toggleFamilySolat(${i},'${p}')" class="text-[10px] px-2 py-1 rounded-lg border ${on ? 'bg-emerald-600/40 border-emerald-500 text-emerald-200' : 'border-white/15 text-slate-400'}">${labels[p]}</button>`;
                }).join('');
                return `
                <div class="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <div class="font-medium text-sm">${escapeHtml(m.name)}</div>
                            <div class="text-[10px] text-slate-400 capitalize">${escapeHtml(m.role)} · ${done}/5 solat</div>
                        </div>
                        <button type="button" onclick="removeFamilyMember(${i})" class="text-[10px] text-red-400 hover:text-red-300">Hapus</button>
                    </div>
                    <div class="flex flex-wrap gap-1.5">${chips}</div>
                </div>`;
            }).join('');
        }
    }
    
    if (goalsEl) {
        const goals = state.family.goals;
        if (!goals.length) {
            goalsEl.innerHTML = `<div class="text-xs text-slate-500">Tiada matlamat lagi</div>`;
        } else {
            goalsEl.innerHTML = goals.map((g, i) => `
                <div class="flex justify-between items-center py-2 border-b border-white/5">
                    <span class="${g.done ? 'line-through text-slate-500' : ''}">${escapeHtml(g.text)}</span>
                    <div class="flex gap-2">
                        <button type="button" onclick="toggleFamilyGoal(${i})" class="text-[10px] text-emerald-400">${g.done ? 'Undo' : 'Selesai'}</button>
                        <button type="button" onclick="removeFamilyGoal(${i})" class="text-[10px] text-red-400">×</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Aggregate stats
    let totalSolat = 0;
    state.family.members.forEach(m => {
        if (m.solat) totalSolat += ['subuh','zohor','asar','maghrib','isyak'].filter(p => m.solat[p]).length;
    });
    state.family.todayLogs.solat = totalSolat;
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('fam-solat', totalSolat);
    set('fam-quran', state.family.todayLogs.quran || 0);
    set('fam-zikir', state.family.todayLogs.zikir || 0);
    set('fam-members', state.family.members.length);
}

function addFamilyMember() {
    ensureFamilyState();
    const nameEl = document.getElementById('family-name');
    const roleEl = document.getElementById('family-role');
    const name = (nameEl?.value || '').trim();
    const role = roleEl?.value || 'anak';
    if (!name) {
        showToast('Masukkan nama ahli', 'error');
        return;
    }
    state.family.members.push({
        name,
        role,
        solat: { subuh: false, zohor: false, asar: false, maghrib: false, isyak: false },
        ibadahToday: 0
    });
    if (nameEl) nameEl.value = '';
    Store.save();
    renderFamily();
    showToast(name + ' ditambah ke keluarga', 'success');
}

function removeFamilyMember(i) {
    ensureFamilyState();
    const name = state.family.members[i]?.name || '';
    state.family.members.splice(i, 1);
    Store.save();
    renderFamily();
    showToast(name ? (name + ' dibuang') : 'Ahli dibuang', 'success');
}

function toggleFamilySolat(memberIndex, prayer) {
    ensureFamilyState();
    const m = state.family.members[memberIndex];
    if (!m) return;
    if (!m.solat) m.solat = { subuh: false, zohor: false, asar: false, maghrib: false, isyak: false };
    m.solat[prayer] = !m.solat[prayer];
    Store.save();
    renderFamily();
    if (m.solat[prayer]) {
        addXP(2, '• Family Solat');
        showToast(m.name + ' — ' + prayer.toUpperCase() + ' ✓', 'success');
    }
}

function logFamilyIbadah(i) {
    // legacy — redirect to solat tracking
    toggleFamilySolat(i, 'subuh');
}

function addFamilyGoal() {
    ensureFamilyState();
    const input = document.getElementById('family-goal-input');
    const text = (input?.value || '').trim();
    if (!text) {
        showToast('Tulis matlamat keluarga', 'error');
        return;
    }
    state.family.goals.push({ text, done: false });
    if (input) input.value = '';
    Store.save();
    renderFamily();
    showToast('Matlamat ditambah', 'success');
}

function toggleFamilyGoal(i) {
    ensureFamilyState();
    if (!state.family.goals[i]) return;
    state.family.goals[i].done = !state.family.goals[i].done;
    Store.save();
    renderFamily();
}

function removeFamilyGoal(i) {
    ensureFamilyState();
    state.family.goals.splice(i, 1);
    Store.save();
    renderFamily();
}

// Expose for onclick (safety)
window.addFamilyMember = addFamilyMember;
window.removeFamilyMember = removeFamilyMember;
window.toggleFamilySolat = toggleFamilySolat;
window.addFamilyGoal = addFamilyGoal;
window.toggleFamilyGoal = toggleFamilyGoal;
window.removeFamilyGoal = removeFamilyGoal;
window.askAIImam = askAIImam;
window.quickAsk = quickAsk;
window.renderFamily = renderFamily;


// -------------------- DOA, HADIS, SUNNAH, WIRID --------------------
const DOA_DATA = [
    { title: "Doa Mohon Petunjuk", ar: "اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي", ms: "Ya Allah, berilah petunjuk kepadaku dan tetapkanlah aku.", src: "Muslim" },
    { title: "Doa Mohon Perlindungan", ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", ms: "Ya Allah, aku berlindung dengan-Mu dari keresahan dan kesedihan.", src: "Bukhari" },
    { title: "Doa Sebelum Makan", ar: "بِسْمِ اللَّهِ", ms: "Dengan nama Allah.", src: "Abu Dawud" },
    { title: "Doa Masuk Rumah", ar: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا", ms: "Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan kepada Allah Tuhan kami kami bertawakal.", src: "Abu Dawud" },
    { title: "Doa Keluar Rumah", ar: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", ms: "Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan upaya kecuali dengan Allah.", src: "Abu Dawud, Tirmidzi" },
    { title: "Doa Mohon Ilmu Bermanfaat", ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا", ms: "Ya Allah, aku pohon ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.", src: "Ibn Majah" }
];

const HADIS_DATA = [
    { text: "Sesungguhnya amalan itu bergantung kepada niat, dan setiap orang akan mendapat apa yang dia niatkan.", src: "Bukhari & Muslim — dari Umar r.a." },
    { text: "Sesiapa yang beriman kepada Allah dan hari akhir, hendaklah dia berkata yang baik atau diam.", src: "Bukhari & Muslim" },
    { text: "Senyumanmu kepada saudara seagama adalah sedekah.", src: "Tirmidzi — hasan" },
    { text: "Sebaik-baik kamu adalah yang mempelajari Al-Quran dan mengajarkannya.", src: "Bukhari — dari Uthman r.a." },
    { text: "Janganlah kamu marah." , src: "Bukhari — nasihat berulang Rasulullah ﷺ" },
    { text: "Muslim yang sebenar ialah yang orang lain selamat dari lidah dan tangannya.", src: "Bukhari & Muslim" },
    { text: "Sesiapa yang menempuh jalan untuk menuntut ilmu, Allah mudahkan baginya jalan ke syurga.", src: "Muslim" },
    { text: "Bersihkanlah mulut kamu dengan siwak kerana ia menyucikan mulut dan mendapat redha Allah.", src: "Nasai, Ibn Khuzaimah" }
];

const SUNNAH_DATA = [
    { icon: "😊", title: "Senyum", desc: "Senyuman kepada saudara adalah sedekah." },
    { icon: "🦷", title: "Bersiwak", desc: "Membersihkan mulut; digalakkan terutama sebelum solat." },
    { icon: "📖", title: "Baca Quran harian", desc: "Walaupun sedikit — istiqamah lebih utama." },
    { icon: "🤲", title: "Selawat ke atas Nabi", desc: "Perbanyak selawat, terutama hari Jumaat." },
    { icon: "🛏️", title: "Tidur atas sebelah kanan", desc: "Sunnah tidur menghadap kiblat jika mampu." },
    { icon: "🕌", title: "Solat sunat rawatib", desc: "12 rakaat sehari semalam — rumah dibina di syurga." },
    { icon: "💧", title: "Wuduk sebelum tidur", desc: "Tidur dalam keadaan suci." },
    { icon: "🤝", title: "Memberi salam", desc: "Sebarkan salam untuk menyebarkan kasih sayang." },
    { icon: "🍽️", title: "Makan dengan tangan kanan", desc: "Dan baca Bismillah sebelum makan." }
];

const WIRID_DATA = [
    { n: 1, ar: "أَسْتَغْفِرُ اللَّهَ", ms: "Astaghfirullah (3x)", note: "Mohon keampunan" },
    { n: 2, ar: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ", ms: "Allahumma antas-salam wa minkas-salam...", note: "Selepas salam" },
    { n: 3, ar: "سُبْحَانَ اللَّهِ (٣٣)  الْحَمْدُ لِلَّهِ (٣٣)  اللَّهُ أَكْبَرُ (٣٤)", ms: "Subhanallah 33, Alhamdulillah 33, Allahu Akbar 34", note: "Tasbih Fatimah" },
    { n: 4, ar: "آيَةُ الْكُرْسِيِّ", ms: "Bacaan Ayat Kursi (Al-Baqarah 255)", note: "Pelindung hingga solat seterusnya" },
    { n: 5, ar: "قُلْ هُوَ اللَّهُ أَحَدٌ  •  قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ  •  قُلْ أَعُوذُ بِرَبِّ النَّاسِ", ms: "Al-Ikhlas, Al-Falaq, An-Nas (1x atau 3x)", note: "Terutama pagi & petang" },
    { n: 6, ar: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ...", ms: "La ilaha illallah wahdahu la sharika lah... (10x selepas Maghrib & Subuh)", note: "Hadis sahih" }
];

function renderDoaHadis() {
    const doaEl = document.getElementById('doa-list');
    const hadisEl = document.getElementById('hadis-list');
    if (doaEl) {
        doaEl.innerHTML = DOA_DATA.map(d => `
            <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div class="font-semibold text-emerald-300 mb-1">${d.title}</div>
                <div class="text-right text-lg leading-relaxed mb-2" dir="rtl" style="font-family:Amiri,serif">${d.ar}</div>
                <div class="text-slate-300 text-xs mb-1">${d.ms}</div>
                <div class="text-[10px] text-slate-500">Sumber: ${d.src}</div>
            </div>
        `).join('');
    }
    if (hadisEl) {
        hadisEl.innerHTML = HADIS_DATA.map(h => `
            <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div class="text-slate-200 leading-relaxed mb-2">"${h.text}"</div>
                <div class="text-[10px] text-amber-400/80">— ${h.src}</div>
            </div>
        `).join('');
    }
}

function renderSunnah() {
    const grid = document.getElementById('sunnah-grid');
    if (!grid) return;
    grid.innerHTML = SUNNAH_DATA.map(s => `
        <div class="glass rounded-3xl p-5 border border-white/10 text-center hover:border-emerald-500/30 transition-all">
            <div class="text-3xl mb-2">${s.icon}</div>
            <div class="font-semibold mb-1">${s.title}</div>
            <div class="text-xs text-slate-400">${s.desc}</div>
        </div>
    `).join('');
}

function renderWirid() {
    const list = document.getElementById('wirid-list');
    if (list) {
        list.innerHTML = WIRID_DATA.map(w => `
            <div class="border-b border-white/5 pb-4">
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-xs text-emerald-300 shrink-0">${w.n}</div>
                    <div class="flex-1">
                        <div class="text-right text-xl leading-relaxed mb-1" dir="rtl" style="font-family:Amiri,serif">${w.ar}</div>
                        <div class="text-sm text-slate-300">${w.ms}</div>
                        <div class="text-[10px] text-slate-500 mt-1">${w.note}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    const streakEl = document.getElementById('wirid-streak');
    if (streakEl) streakEl.textContent = state.wiridStreak || 0;
}

function markWiridDone() {
    const today = new Date().toISOString().slice(0, 10);
    if (state.wiridLastDate === today) {
        showToast('Sudah direkod untuk hari ini', 'error');
        return;
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    if (state.wiridLastDate === yStr) {
        state.wiridStreak = (state.wiridStreak || 0) + 1;
    } else {
        state.wiridStreak = 1;
    }
    state.wiridLastDate = today;
    Store.save();
    renderWirid();
    addXP(5, '• Wirid');
    showToast('Wirid hari ini direkod. Streak: ' + state.wiridStreak, 'success');
}

window.markWiridDone = markWiridDone;
window.renderDoaHadis = renderDoaHadis;
window.renderSunnah = renderSunnah;
window.renderWirid = renderWirid;


// -------------------- SUPABASE FAMILY CLOUD UI --------------------
async function mlosSignUp() {
    const name = document.getElementById('auth-name')?.value?.trim();
    const email = document.getElementById('auth-email')?.value?.trim();
    const password = document.getElementById('auth-password')?.value || '';
    if (!email || password.length < 6) {
        showToast('Email & password (min 6) diperlukan', 'error');
        return;
    }
    if (!window.MLOS_SB) {
        showToast('Supabase belum dimuatkan', 'error');
        return;
    }
    const res = await MLOS_SB.signUp(email, password, name);
    if (res.error) {
        showToast(res.error, 'error');
        return;
    }
    showToast('Daftar berjaya! Semak email jika perlu confirm, atau terus log masuk.', 'success');
    await refreshAuthUI();
}

async function mlosSignIn() {
    const email = document.getElementById('auth-email')?.value?.trim();
    const password = document.getElementById('auth-password')?.value || '';
    if (!email || !password) {
        showToast('Isi email & password', 'error');
        return;
    }
    const res = await MLOS_SB.signIn(email, password);
    if (res.error) {
        showToast(res.error, 'error');
        return;
    }
    showToast('Log masuk berjaya', 'success');
    await refreshAuthUI();
    await renderCloudFamily();
}

async function mlosSignOut() {
    await MLOS_SB.signOut();
    showToast('Log keluar', 'success');
    await refreshAuthUI();
}

async function mlosCreateFamily() {
    const name = document.getElementById('family-create-name')?.value?.trim() || 'Keluarga Saya';
    const res = await MLOS_SB.createFamily(name);
    if (res.error) {
        showToast(res.error, 'error');
        return;
    }
    showToast('Keluarga dicipta! Kod: ' + res.data.code, 'success');
    await renderCloudFamily();
}

async function mlosJoinFamily() {
    const code = document.getElementById('family-join-code')?.value?.trim();
    if (!code) {
        showToast('Masukkan kod keluarga', 'error');
        return;
    }
    const res = await MLOS_SB.joinFamily(code);
    if (res.error) {
        showToast(res.error, 'error');
        return;
    }
    showToast(res.message || ('Join berjaya: ' + res.data.name), 'success');
    await renderCloudFamily();
}

async function refreshAuthUI() {
    const status = document.getElementById('auth-status');
    const forms = document.getElementById('auth-forms');
    const actions = document.getElementById('family-cloud-actions');
    const mySolat = document.getElementById('my-cloud-solat');
    if (!window.MLOS_SB) return;

    const user = MLOS_SB.getUser();
    if (user) {
        if (status) status.textContent = 'Log masuk: ' + (user.user_metadata?.full_name || user.email);
        if (forms) forms.classList.add('hidden');
        if (actions) actions.classList.remove('hidden');
        if (mySolat) mySolat.classList.remove('hidden');
        await renderMyCloudSolat();
    } else {
        if (status) status.textContent = 'Belum log masuk — daftar / log masuk untuk sync keluarga';
        if (forms) forms.classList.remove('hidden');
        if (actions) actions.classList.add('hidden');
        if (mySolat) mySolat.classList.add('hidden');
        const mon = document.getElementById('family-cloud-monitor');
        if (mon) mon.innerHTML = '';
    }
}

async function renderMyCloudSolat() {
    const box = document.getElementById('my-cloud-solat-btns');
    if (!box || !MLOS_SB.isLoggedIn()) return;
    const res = await MLOS_SB.getMySolatToday();
    if (res.error) {
        box.innerHTML = '<span class="text-xs text-red-400">' + res.error + '</span>';
        return;
    }
    const labels = { subuh: 'Subuh', zohor: 'Zohor', asar: 'Asar', maghrib: 'Maghrib', isyak: 'Isyak' };
    const solat = res.data || {};
    box.innerHTML = Object.keys(labels).map(p => {
        const on = !!solat[p];
        return `<button type="button" onclick="toggleMyCloudSolat('${p}')" class="text-[10px] px-2.5 py-1.5 rounded-lg border ${on ? 'bg-emerald-600/40 border-emerald-500 text-emerald-200' : 'border-white/15 text-slate-400'}">${labels[p]}</button>`;
    }).join('');
}

async function toggleMyCloudSolat(prayer) {
    const res = await MLOS_SB.getMySolatToday();
    if (res.error) {
        showToast(res.error, 'error');
        return;
    }
    const current = !!(res.data && res.data[prayer]);
    const next = !current;
    const up = await MLOS_SB.upsertSolatLog(prayer, next);
    if (up.error) {
        showToast(up.error, 'error');
        return;
    }
    showToast(prayer.toUpperCase() + (next ? ' ✓' : ' dibatalkan'), 'success');
    await renderMyCloudSolat();
    await renderCloudFamily();
}

async function renderCloudFamily() {
    const mon = document.getElementById('family-cloud-monitor');
    if (!mon || !window.MLOS_SB || !MLOS_SB.isLoggedIn()) return;

    const res = await MLOS_SB.getFamilySolatToday();
    if (res.error) {
        mon.innerHTML = `<div class="text-xs text-red-400">${res.error}</div>`;
        return;
    }
    if (!res.data) {
        mon.innerHTML = `<div class="text-xs text-slate-500">Belum join / cipta keluarga. Cipta atau masukkan kod di atas.</div>`;
        return;
    }

    const fam = res.data.family;
    const members = res.data.members || [];
    const labels = { subuh: 'S', zohor: 'Z', asar: 'A', maghrib: 'M', isyak: 'I' };

    mon.innerHTML = `
        <div class="text-sm font-semibold mb-1">${escapeHtml(fam?.name || 'Keluarga')} <span class="text-emerald-400 text-xs">Kod: ${escapeHtml(fam?.code || '')}</span></div>
        <div class="text-[10px] text-slate-500 mb-3">Peranan anda: ${escapeHtml(res.data.myRole || '-')} · Parent boleh monitor semua ahli</div>
        ${members.map(m => {
            const chips = Object.keys(labels).map(p => {
                const on = m.solat && m.solat[p];
                return `<span class="text-[10px] px-1.5 py-0.5 rounded ${on ? 'bg-emerald-600/50 text-emerald-100' : 'bg-white/5 text-slate-500'}">${labels[p]}</span>`;
            }).join('');
            return `<div class="flex justify-between items-center bg-white/5 rounded-xl px-3 py-2">
                <div>
                    <div class="text-sm">${escapeHtml(m.display_name || 'User')}</div>
                    <div class="text-[10px] text-slate-400 capitalize">${escapeHtml(m.role)} · ${m.done}/5</div>
                </div>
                <div class="flex gap-1">${chips}</div>
            </div>`;
        }).join('') || '<div class="text-xs text-slate-500">Tiada ahli</div>'}
        <button type="button" onclick="renderCloudFamily()" class="mt-2 text-[10px] text-emerald-400">↻ Refresh monitor</button>
    `;
}

// Hook into existing renderFamily
const _origRenderFamily = typeof renderFamily === 'function' ? renderFamily : null;
renderFamily = function() {
    if (_origRenderFamily) _origRenderFamily();
    refreshAuthUI();
    if (window.MLOS_SB && MLOS_SB.isLoggedIn()) renderCloudFamily();
};

window.mlosSignUp = mlosSignUp;
window.mlosSignIn = mlosSignIn;
window.mlosSignOut = mlosSignOut;
window.mlosCreateFamily = mlosCreateFamily;
window.mlosJoinFamily = mlosJoinFamily;
window.toggleMyCloudSolat = toggleMyCloudSolat;
window.renderCloudFamily = renderCloudFamily;
window.refreshAuthUI = refreshAuthUI;


// -------------------- FAMILY REPORT + NOTIFICATIONS --------------------
let reportRange = 'daily';

function setReportRange(range) {
    reportRange = range;
    const d = document.getElementById('btn-report-daily');
    const w = document.getElementById('btn-report-weekly');
    if (d) {
        d.className = range === 'daily'
            ? 'px-4 py-2 rounded-2xl bg-emerald-600 text-sm font-medium'
            : 'px-4 py-2 rounded-2xl border border-white/15 text-sm';
    }
    if (w) {
        w.className = range === 'weekly'
            ? 'px-4 py-2 rounded-2xl bg-emerald-600 text-sm font-medium'
            : 'px-4 py-2 rounded-2xl border border-white/15 text-sm';
    }
    const title = document.getElementById('report-title');
    if (title) title.textContent = range === 'daily' ? 'Laporan Hari Ini' : 'Laporan 7 Hari';
    refreshFamilyReport();
}

async function refreshFamilyReport() {
    const table = document.getElementById('family-report-table');
    if (!table) return;

    // Prefer cloud data
    let members = [];
    if (window.MLOS_SB && MLOS_SB.isLoggedIn()) {
        if (reportRange === 'daily') {
            const res = await MLOS_SB.getFamilySolatToday();
            if (res.data && res.data.members) {
                members = res.data.members.map(m => ({
                    name: m.display_name || 'User',
                    role: m.role,
                    solat: m.solat,
                    done: m.done,
                    pct: Math.round((m.done / 5) * 100)
                }));
            } else if (res.error) {
                table.innerHTML = `<div class="text-xs text-red-400">${res.error}</div>`;
                return;
            }
        } else {
            // Weekly: fetch last 7 days logs if possible
            const res = await getFamilyWeeklyReport();
            if (res.error) {
                table.innerHTML = `<div class="text-xs text-amber-400">${res.error}</div><div class="text-xs text-slate-500 mt-2">Cuba laporan Harian, atau pastikan ahli dah tick solat.</div>`;
            }
            if (res.data) members = res.data;
        }
    }

    // Fallback: local offline family members
    if (!members.length && state.family && state.family.members) {
        members = state.family.members.map(m => {
            const solat = m.solat || {};
            const done = ['subuh','zohor','asar','maghrib','isyak'].filter(p => solat[p]).length;
            return {
                name: m.name,
                role: m.role,
                solat,
                done,
                pct: Math.round((done / 5) * 100)
            };
        });
    }

    if (!members.length) {
        table.innerHTML = `<div class="text-xs text-slate-500">Tiada data. Log masuk + join keluarga, atau tambah ahli lokal di Family Mode.</div>`;
        setReportCards(0,0,0,0);
        return;
    }

    let complete = 0, partial = 0, none = 0, sumPct = 0;
    members.forEach(m => {
        sumPct += m.pct;
        if (m.done >= 5) complete++;
        else if (m.done > 0) partial++;
        else none++;
    });
    const avg = members.length ? Math.round(sumPct / members.length) : 0;
    setReportCards(complete, partial, none, avg);

    const labels = { subuh: 'Subuh', zohor: 'Zohor', asar: 'Asar', maghrib: 'Maghrib', isyak: 'Isyak' };
    table.innerHTML = members.map(m => {
        const chips = Object.keys(labels).map(p => {
            const on = m.solat && m.solat[p];
            // weekly may have counts
            const val = typeof on === 'number' ? on : (on ? '✓' : '·');
            const cls = (typeof on === 'number' ? on > 0 : on)
                ? 'bg-emerald-600/40 text-emerald-100'
                : 'bg-white/5 text-slate-500';
            return `<span class="text-[10px] px-1.5 py-0.5 rounded ${cls}">${labels[p].slice(0,1)}${typeof on === 'number' ? on : ''}</span>`;
        }).join('');
        return `<div class="flex flex-wrap justify-between items-center gap-2 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
            <div>
                <div class="font-medium">${escapeHtml(m.name)}</div>
                <div class="text-[10px] text-slate-400 capitalize">${escapeHtml(m.role || '')} · ${m.done}/5 · ${m.pct}%</div>
            </div>
            <div class="flex gap-1">${chips}</div>
        </div>`;
    }).join('');
}

function setReportCards(c, p, n, avg) {
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('rep-complete', c);
    set('rep-partial', p);
    set('rep-none', n);
    set('rep-pct', avg + '%');
}

async function getFamilyWeeklyReport() {
    if (!window.MLOS_SB || !MLOS_SB.isLoggedIn()) return { error: 'Log masuk dulu' };
    const client = MLOS_SB.getSupabase && MLOS_SB.getSupabase();
    if (!client) return { error: 'Supabase tak tersedia' };

    const fam = await MLOS_SB.getMyFamily();
    if (fam.error || !fam.data) return { error: fam.error || 'Belum ada keluarga' };

    const userIds = fam.data.members.map(m => m.user_id);
    if (!userIds.length) return { data: [] };

    const start = new Date();
    start.setDate(start.getDate() - 6);
    const startStr = start.toISOString().slice(0, 10);

    const { data: logs, error } = await client.from('solat_logs')
        .select('*')
        .in('user_id', userIds)
        .gte('log_date', startStr)
        .eq('completed', true);

    if (error) return { error: error.message };

    // per user: count unique prayer completions across 7 days (max 35)
    const result = fam.data.members.map(m => {
        const counts = { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 };
        (logs || []).filter(l => l.user_id === m.user_id).forEach(l => {
            if (counts.hasOwnProperty(l.prayer_name)) counts[l.prayer_name]++;
        });
        const totalDone = Object.values(counts).reduce((a, b) => a + b, 0);
        const pct = Math.round((totalDone / 35) * 100);
        // for display chips use counts; done = average-ish out of 5 using today-equivalent
        const todayLike = Object.values(counts).filter(x => x > 0).length;
        return {
            name: m.display_name || 'User',
            role: m.role,
            solat: counts,
            done: todayLike,
            pct,
            weeklyTotal: totalDone
        };
    });
    return { data: result };
}

// ---- Notifications ----
function updateNotifStatus() {
    const el = document.getElementById('notif-status');
    if (!el) return;
    if (!('Notification' in window)) {
        el.textContent = 'Status: browser tak support notifikasi';
        return;
    }
    el.textContent = 'Status: ' + Notification.permission;
}

async function enableNotifications() {
    if (!('Notification' in window)) {
        showToast('Browser tak support notifikasi', 'error');
        return;
    }
    const perm = await Notification.requestPermission();
    updateNotifStatus();
    if (perm === 'granted') {
        showToast('Notifikasi diaktifkan', 'success');
        localStorage.setItem('mlos_notif', '1');
        schedulePrayerNotifications();
    } else {
        showToast('Kebenaran notifikasi ditolak', 'error');
    }
}

function testNotification() {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        showToast('Aktifkan notifikasi dulu', 'error');
        return;
    }
    new Notification('Muslim Life OS', {
        body: 'Test berjaya. Anda akan dapat peringatan solat & ringkasan keluarga.',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🕌</text></svg>'
    });
}

function schedulePrayerNotifications() {
    if (Notification.permission !== 'granted') return;
    if (localStorage.getItem('mlos_notif') !== '1') return;

    // Simple check every minute while page open
    if (window._mlosNotifTimer) clearInterval(window._mlosNotifTimer);
    window._mlosNotifTimer = setInterval(() => {
        try {
            const prayerCb = document.getElementById('notif-prayer');
            if (prayerCb && !prayerCb.checked) return;
            const times = state?.solat?.today;
            if (!times) return;
            const now = new Date();
            const hhmm = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
            const names = { subuh: 'Subuh', zohor: 'Zohor', asar: 'Asar', maghrib: 'Maghrib', isyak: 'Isyak' };
            Object.keys(names).forEach(k => {
                const t = times[k]?.time;
                if (!t) return;
                // notify at exact minute
                if (t.slice(0,5) === hhmm) {
                    const key = 'notif_' + k + '_' + now.toDateString();
                    if (sessionStorage.getItem(key)) return;
                    sessionStorage.setItem(key, '1');
                    new Notification('Waktu ' + names[k], {
                        body: 'Sudah masuk waktu ' + names[k] + ' (' + t + '). Jangan lupa solat.',
                        tag: 'prayer-' + k
                    });
                }
            });
        } catch (e) {}
    }, 30000);

    // Family summary once per session mid-day style
    const famCb = document.getElementById('notif-family');
    if (famCb && famCb.checked && !sessionStorage.getItem('fam_sum_today')) {
        const h = new Date().getHours();
        if (h >= 8 && h <= 21) {
            sessionStorage.setItem('fam_sum_today', '1');
            // soft reminder after 3s
            setTimeout(() => {
                if (Notification.permission === 'granted') {
                    new Notification('Family Report', {
                        body: 'Buka Family Report untuk semak solat ahli keluarga hari ini.',
                        tag: 'family-summary'
                    });
                }
            }, 5000);
        }
    }
}

window.setReportRange = setReportRange;
window.refreshFamilyReport = refreshFamilyReport;
window.enableNotifications = enableNotifications;
window.testNotification = testNotification;


async function mlosProfileSignOut() {
    try {
        if (window.MLOS_SB && MLOS_SB.isLoggedIn()) {
            await MLOS_SB.signOut();
        }
    } catch (e) {}
    hideProfileModal();
    showToast('Log keluar berjaya', 'success');
    if (typeof refreshAuthUI === 'function') refreshAuthUI();
}
window.mlosProfileSignOut = mlosProfileSignOut;
window.MLOS = { state, Store, showModule, celebrate, unlockAchievement };