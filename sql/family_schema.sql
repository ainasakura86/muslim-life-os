-- ============================================================
-- MUSLIM LIFE OS™ — Family Mode Schema (Supabase)
-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  family_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Families
CREATE TABLE IF NOT EXISTS public.families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Keluarga Saya',
  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family members
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'child' CHECK (role IN ('parent', 'child', 'member')),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (family_id, user_id)
);

-- Solat logs (per user, per day, per prayer)
CREATE TABLE IF NOT EXISTS public.solat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prayer_name TEXT NOT NULL CHECK (prayer_name IN ('subuh', 'zohor', 'asar', 'maghrib', 'isyak')),
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, prayer_name, log_date)
);

CREATE INDEX IF NOT EXISTS idx_solat_logs_user_date ON public.solat_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_family_members_family ON public.family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_families_code ON public.families(code);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solat_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own_or_family" ON public.profiles
  FOR SELECT USING (
    id = auth.uid()
    OR family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
  );
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Families policies
CREATE POLICY "families_select_member" ON public.families
  FOR SELECT USING (
    id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    OR created_by = auth.uid()
  );
CREATE POLICY "families_insert_auth" ON public.families
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "families_select_by_code" ON public.families
  FOR SELECT USING (true); -- needed to join by code; tighten later if needed

-- Family members policies
CREATE POLICY "fm_select_same_family" ON public.family_members
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    OR user_id = auth.uid()
  );
CREATE POLICY "fm_insert_self" ON public.family_members
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "fm_delete_self" ON public.family_members
  FOR DELETE USING (user_id = auth.uid());

-- Solat logs: own write; family can read
CREATE POLICY "solat_select_own_or_family" ON public.solat_logs
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_id IN (
      SELECT fm2.user_id FROM public.family_members fm1
      JOIN public.family_members fm2 ON fm1.family_id = fm2.family_id
      WHERE fm1.user_id = auth.uid()
    )
  );
CREATE POLICY "solat_insert_own" ON public.solat_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "solat_update_own" ON public.solat_logs
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "solat_delete_own" ON public.solat_logs
  FOR DELETE USING (user_id = auth.uid());
