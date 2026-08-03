-- ============================================================
-- MUSLIM LIFE OS™ - Enterprise Normalized Database Schema
-- PostgreSQL / Supabase Ready
-- UUID Primary Keys | Foreign Keys | Indexes | Triggers | RLS Ready
-- ============================================================

-- Enable required extensions (Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- CORE USER & PROFILE
-- ============================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL, -- Supabase auth.users.id
    full_name VARCHAR(150),
    preferred_name VARCHAR(80),
    avatar_url TEXT,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
    birth_date DATE,
    location_city VARCHAR(100),
    location_country VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'Asia/Kuala_Lumpur',
    language_preference VARCHAR(10) DEFAULT 'ms-MY',
    theme_preference VARCHAR(10) DEFAULT 'dark',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODULE 1 & 2: SOLAT + QADA SOLAT
-- ============================================================
CREATE TABLE solat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    prayer_name VARCHAR(20) NOT NULL CHECK (prayer_name IN ('subuh', 'zohor', 'asar', 'maghrib', 'isyak')),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('awal_waktu', 'lewat', 'qada', 'jemaah', 'masjid', 'rumah', 'office', 'travel', 'missed')),
    performed_at TIMESTAMPTZ,
    location_type VARCHAR(30),
    is_jemaah BOOLEAN DEFAULT FALSE,
    is_masjid BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, prayer_name, log_date)
);

CREATE INDEX idx_solat_logs_user_date ON solat_logs(user_id, log_date DESC);
CREATE INDEX idx_solat_logs_prayer ON solat_logs(prayer_name);

-- Qada (Debt) tracking - can be derived but stored for speed & AI forecasting
CREATE TABLE qada_solat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    prayer_name VARCHAR(20) NOT NULL,
    total_debt INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    remaining INTEGER GENERATED ALWAYS AS (total_debt - completed) STORED,
    target_completion_date DATE,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, prayer_name)
);

-- ============================================================
-- MODULE 3: QADA PUASA
-- ============================================================
CREATE TABLE qada_puasa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    total_days INTEGER NOT NULL DEFAULT 0,
    completed_days INTEGER NOT NULL DEFAULT 0,
    remaining_days INTEGER GENERATED ALWAYS AS (total_days - completed_days) STORED,
    target_finish_date DATE,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODULE 4: SOLAT SUNAT
-- ============================================================
CREATE TABLE sunat_prayers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    prayer_type VARCHAR(30) NOT NULL, -- tahajjud, dhuha, rawatib, taubat, hajat, istikharah, tasbih, witir, awwabin, eid, others
    performed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    rakat_count INTEGER DEFAULT 2,
    performed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sunat_user_date ON sunat_prayers(user_id, performed_date DESC);

-- ============================================================
-- MODULE 5 & 6: AL-QURAN + KHATAM TRACKER
-- ============================================================
CREATE TABLE quran_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    surah_number INTEGER NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
    surah_name VARCHAR(60),
    juz_number INTEGER CHECK (juz_number BETWEEN 1 AND 30),
    start_page INTEGER,
    end_page INTEGER,
    start_ayah INTEGER,
    end_ayah INTEGER,
    pages_read INTEGER DEFAULT 0,
    minutes_spent INTEGER DEFAULT 0,
    reading_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quran_user_date ON quran_readings(user_id, reading_date DESC);

CREATE TABLE khatam_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    completed_date DATE NOT NULL,
    total_days_taken INTEGER,
    average_pages_per_day NUMERIC(5,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODULE 7: HAFAZAN (MEMORIZATION)
-- ============================================================
CREATE TABLE hafazan_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    surah_number INTEGER NOT NULL,
    ayah_start INTEGER NOT NULL,
    ayah_end INTEGER NOT NULL,
    fluency_level VARCHAR(20) CHECK (fluency_level IN ('new', 'learning', 'good', 'excellent', 'mastered')),
    mistake_count INTEGER DEFAULT 0,
    last_revision_date DATE,
    next_revision_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODULE 8 & 9: TAHRIRI + TAJWID
-- ============================================================
CREATE TABLE tahriri_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    session_date DATE DEFAULT CURRENT_DATE,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    mistakes INTEGER DEFAULT 0,
    teacher_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tajwid_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    rule_name VARCHAR(80) NOT NULL, -- e.g. 'Ikhfa', 'Idgham', 'Qalqalah'
    lesson_number INTEGER,
    exercise_score INTEGER,
    quiz_score INTEGER,
    progress_percent INTEGER DEFAULT 0,
    last_practiced DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODULE 10 & 11: ZIKIR + SELAWAT
-- ============================================================
CREATE TABLE zikir_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    zikir_type VARCHAR(50) NOT NULL, -- subhanallah, alhamdulillah, allahuakbar, custom, selawat etc.
    count INTEGER NOT NULL DEFAULT 0,
    target_daily INTEGER DEFAULT 100,
    log_date DATE DEFAULT CURRENT_DATE,
    session_duration_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_zikir_user_date ON zikir_logs(user_id, log_date DESC);

-- ============================================================
-- MODULE 12: SEDEKAH
-- ============================================================
CREATE TABLE sedekah_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    category VARCHAR(30) NOT NULL CHECK (category IN ('money', 'food', 'goods', 'volunteer', 'anonymous', 'other')),
    amount NUMERIC(12,2) DEFAULT 0,
    description TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    recipient VARCHAR(150),
    log_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sedekah_user_date ON sedekah_logs(user_id, log_date DESC);

-- ============================================================
-- MODULE 13: DOA
-- ============================================================
CREATE TABLE doa_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    doa_category VARCHAR(40) NOT NULL, -- morning, evening, after_prayer, before_sleep, parents, children, rezeki, health, others
    doa_title VARCHAR(120) NOT NULL,
    arabic_text TEXT,
    translation_ms TEXT,
    translation_en TEXT,
    audio_url TEXT,
    is_favorite BOOLEAN DEFAULT TRUE,
    last_used TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODULE 14,15,16: SUNAT FAST, QIYAMULLAIL, MASJID VISIT
-- ============================================================
CREATE TABLE puasa_sunat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    fast_type VARCHAR(30) NOT NULL, -- monday, thursday, arafah, ashura, ayyamul_bidh, syawal, others
    fast_date DATE NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, fast_date, fast_type)
);

CREATE TABLE qiyamullail_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    wake_up_time TIMESTAMPTZ,
    prayer_duration_minutes INTEGER,
    quran_reading_minutes INTEGER,
    zikir_duration_minutes INTEGER,
    total_duration_minutes INTEGER,
    log_date DATE DEFAULT CURRENT_DATE,
    notes TEXT
);

CREATE TABLE masjid_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    mosque_name VARCHAR(150) NOT NULL,
    location VARCHAR(200),
    prayer_type VARCHAR(20),
    visit_date DATE DEFAULT CURRENT_DATE,
    frequency_this_month INTEGER DEFAULT 1,
    notes TEXT
);

-- ============================================================
-- MODULE 17: ISLAMIC GOALS (SMART Goals)
-- ============================================================
CREATE TABLE islamic_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    goal_type VARCHAR(50) NOT NULL, -- e.g. '100_tahajjud', '365_solat_awal', '2_khatam', '1000_selawat', '100_sedekah', 'custom'
    title VARCHAR(150) NOT NULL,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    target_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    progress_percent INTEGER GENERATED ALWAYS AS (
        CASE WHEN target_value > 0 THEN LEAST(100, ROUND((current_value::NUMERIC / target_value) * 100)) ELSE 0 END
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODULE 20: MUHASABAH JOURNAL
-- ============================================================
CREATE TABLE muhasabah_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    entry_date DATE DEFAULT CURRENT_DATE,
    mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 5),
    gratitude TEXT,
    reflection TEXT,
    lessons_learned TEXT,
    repentance_notes TEXT,
    tomorrow_plan TEXT,
    private_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_muhasabah_user_date ON muhasabah_entries(user_id, entry_date DESC);

-- ============================================================
-- MODULE 21: ISLAMIC HABITS
-- ============================================================
CREATE TABLE habit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    habit_name VARCHAR(80) NOT NULL, -- smile, help_others, visit_parents, lower_gaze, no_gossip, no_anger, etc.
    performed_date DATE DEFAULT CURRENT_DATE,
    is_completed BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, habit_name, performed_date)
);

-- ============================================================
-- MODULE 22: FAMILY MODE
-- ============================================================
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id), -- head of family
    member_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(30), -- husband, wife, son, daughter, parent
    avatar_url TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE family_shared_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID, -- could link to a family table in future
    goal_description TEXT NOT NULL,
    target_value INTEGER,
    current_progress INTEGER DEFAULT 0,
    deadline DATE,
    created_by UUID REFERENCES profiles(user_id)
);

-- ============================================================
-- MODULE 23: CHARITY PROJECTS
-- ============================================================
CREATE TABLE charity_donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    project_name VARCHAR(150),
    ngo_name VARCHAR(120),
    amount NUMERIC(12,2),
    donation_date DATE DEFAULT CURRENT_DATE,
    is_emergency BOOLEAN DEFAULT FALSE,
    receipt_url TEXT,
    notes TEXT
);

-- ============================================================
-- MODULE 24: ISLAMIC CALENDAR / EVENTS
-- ============================================================
CREATE TABLE islamic_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_ms VARCHAR(150) NOT NULL,
    title_en VARCHAR(150),
    hijrah_date VARCHAR(30),
    gregorian_date DATE,
    event_type VARCHAR(40), -- ramadan, eid, dhulhijjah, etc.
    description TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    reminder_days_before INTEGER DEFAULT 3
);

-- User reminders
CREATE TABLE user_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    event_id UUID REFERENCES islamic_events(id),
    reminder_datetime TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- MODULE 25: AI IMAM / COACHING (Logs of AI interactions)
-- ============================================================
CREATE TABLE ai_coaching_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    interaction_type VARCHAR(50), -- muhasabah, habit_coach, solat_analysis, weekly_review, etc.
    prompt TEXT,
    ai_response TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODULE 28: ACHIEVEMENTS & XP
-- ============================================================
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(user_id),
    badge_code VARCHAR(60) NOT NULL, -- e.g. 'first_solat_jemaah', '100_tahajjud', 'khatam_1'
    badge_name VARCHAR(100) NOT NULL,
    description TEXT,
    xp_earned INTEGER DEFAULT 10,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    icon_url TEXT
);

CREATE TABLE user_xp (
    user_id UUID PRIMARY KEY REFERENCES profiles(user_id),
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRIGGERS for updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_qada_solat_updated_at BEFORE UPDATE ON qada_solat FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_islamic_goals_updated_at BEFORE UPDATE ON islamic_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Enable on Supabase
-- ============================================================
-- Example (uncomment in Supabase):
-- ALTER TABLE solat_logs ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can only see own solat logs" ON solat_logs FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- VIEWS for Dashboard (Performance)
-- ============================================================
CREATE OR REPLACE VIEW v_daily_progress AS
SELECT 
    user_id,
    CURRENT_DATE as date,
    COUNT(*) FILTER (WHERE status IN ('awal_waktu', 'lewat', 'jemaah')) as prayers_completed,
    (SELECT COUNT(*) FROM solat_logs WHERE user_id = sl.user_id AND log_date = CURRENT_DATE) as total_prayers_logged
FROM solat_logs sl
WHERE log_date = CURRENT_DATE
GROUP BY user_id;

-- Add more materialized views or functions for streaks, heatmaps etc. as needed.

COMMENT ON DATABASE postgres IS 'MUSLIM LIFE OS™ - Complete Islamic Lifestyle Database | Designed for beauty, scale & spirituality';