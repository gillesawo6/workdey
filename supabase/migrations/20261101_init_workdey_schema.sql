-- ==============================================================================
-- WORKDEY DATABASE INITIALIZATION SCHEMA & ROW LEVEL SECURITY POLICIES
-- Brand: WorkDey — Talent, found. Careers, built.
-- Target: Supabase PostgreSQL (Postgres 15+)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- ENUM TYPES
-- ------------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE platform_role_type AS ENUM ('owner', 'super_admin', 'admin', 'moderator', 'support');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE org_role_type AS ENUM ('owner', 'admin', 'recruiter', 'hiring_manager', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE org_verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE work_style_type AS ENUM ('onsite', 'hybrid', 'remote');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE contract_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE job_status_type AS ENUM ('draft', 'pending_moderation', 'open', 'closing_soon', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE application_stage_type AS ENUM ('applied', 'screening', 'shortlisted', 'interview', 'offer', 'hired', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE interview_format_type AS ENUM ('video', 'onsite', 'phone');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE interview_status_type AS ENUM ('scheduled', 'completed', 'cancelled', 'rescheduled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE moderation_priority_type AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE moderation_status_type AS ENUM ('open', 'in_review', 'resolved', 'dismissed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ------------------------------------------------------------------------------
-- 1. USER PROFILES & UNIFIED IDENTITY
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  language_pref TEXT NOT NULL DEFAULT 'en' CHECK (language_pref IN ('en', 'fr')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. PLATFORM ROLES (INDEPENDENT FROM ORGANISATION ROLES)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.platform_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role platform_role_type NOT NULL,
  granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_platform_role UNIQUE (user_id, role)
);

-- ------------------------------------------------------------------------------
-- 3. ORGANISATIONS & REPUTATION
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  tagline TEXT,
  about TEXT,
  website TEXT,
  sector TEXT,
  company_size TEXT,
  city TEXT NOT NULL DEFAULT 'Douala',
  region TEXT NOT NULL DEFAULT 'Littoral',
  country TEXT NOT NULL DEFAULT 'Cameroon',
  verification_status org_verification_status NOT NULL DEFAULT 'pending',
  verification_doc_url TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organisation Members (RBAC)
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role org_role_type NOT NULL DEFAULT 'viewer',
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_org_user UNIQUE (organization_id, user_id)
);

-- Organisation Invitations
CREATE TABLE IF NOT EXISTS public.organization_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role org_role_type NOT NULL DEFAULT 'recruiter',
  token TEXT NOT NULL UNIQUE,
  invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. TALENT PROFILES & PROFESSIONAL RESUME DATA
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.talent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  headline TEXT,
  bio TEXT,
  city TEXT NOT NULL DEFAULT 'Douala',
  region TEXT NOT NULL DEFAULT 'Littoral',
  country TEXT NOT NULL DEFAULT 'Cameroon',
  work_style_pref work_style_type NOT NULL DEFAULT 'hybrid',
  expected_salary_min_xaf INTEGER,
  expected_salary_max_xaf INTEGER,
  currency TEXT NOT NULL DEFAULT 'XAF',
  profile_strength_pct INTEGER NOT NULL DEFAULT 40 CHECK (profile_strength_pct BETWEEN 0 AND 100),
  cv_file_url TEXT,
  cv_filename TEXT,
  cv_updated_at TIMESTAMPTZ,
  is_open_to_work BOOLEAN NOT NULL DEFAULT TRUE,
  share_cv_with_employers BOOLEAN NOT NULL DEFAULT TRUE,
  allow_ai_matching BOOLEAN NOT NULL DEFAULT TRUE,
  hide_current_employer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Standardized Skills Taxonomy
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Talent Skills Link
CREATE TABLE IF NOT EXISTS public.talent_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  years_experience INTEGER DEFAULT 1,
  verified_score INTEGER CHECK (verified_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_talent_skill UNIQUE (talent_id, skill_id)
);

-- Talent Work Experiences
CREATE TABLE IF NOT EXISTS public.talent_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  city TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Talent Education Records
CREATE TABLE IF NOT EXISTS public.talent_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  graduation_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. JOBS & RECRUITMENT PIPELINE
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.job_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category_id UUID REFERENCES public.job_categories(id) ON DELETE SET NULL,
  city TEXT NOT NULL DEFAULT 'Douala',
  region TEXT NOT NULL DEFAULT 'Littoral',
  country TEXT NOT NULL DEFAULT 'Cameroon',
  work_style work_style_type NOT NULL DEFAULT 'hybrid',
  contract_type contract_type NOT NULL DEFAULT 'full_time',
  salary_min_xaf INTEGER NOT NULL,
  salary_max_xaf INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XAF',
  experience_level TEXT NOT NULL DEFAULT 'Mid',
  description TEXT NOT NULL,
  requirements_summary TEXT,
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{"English", "French"}',
  status job_status_type NOT NULL DEFAULT 'draft',
  moderation_flag TEXT,
  published_at TIMESTAMPTZ,
  deadline DATE,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Saved Jobs Bookmarks
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_saved_job UNIQUE (user_id, job_id)
);

-- Applications with Explainable Match Scores
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  stage application_stage_type NOT NULL DEFAULT 'applied',
  match_score INTEGER CHECK (match_score BETWEEN 0 AND 100),
  match_skills_score INTEGER CHECK (match_skills_score BETWEEN 0 AND 100),
  match_experience_score INTEGER CHECK (match_experience_score BETWEEN 0 AND 100),
  match_location_score INTEGER CHECK (match_location_score BETWEEN 0 AND 100),
  match_reasons TEXT[] NOT NULL DEFAULT '{}',
  match_gaps TEXT[] NOT NULL DEFAULT '{}',
  screening_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  cv_version_url TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_job_talent_app UNIQUE (job_id, talent_id)
);

-- Application Stage History Audit Trail
CREATE TABLE IF NOT EXISTS public.application_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  from_stage application_stage_type,
  to_stage application_stage_type NOT NULL,
  moved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Interviews
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  format interview_format_type NOT NULL DEFAULT 'video',
  meeting_link_or_location TEXT,
  interviewer_names TEXT[] NOT NULL DEFAULT '{}',
  panel_notes TEXT,
  status interview_status_type NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recruitment Collaboration Notes
CREATE TABLE IF NOT EXISTS public.recruitment_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. CAREER GOALS & ROADMAPS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.career_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  goal_title TEXT NOT NULL,
  current_role TEXT NOT NULL,
  target_role TEXT NOT NULL,
  estimated_months INTEGER NOT NULL DEFAULT 12,
  progress_pct INTEGER NOT NULL DEFAULT 35 CHECK (progress_pct BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.roadmap_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.career_roadmaps(id) ON DELETE CASCADE,
  stage_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  duration_text TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'in_progress', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. NOTIFICATIONS & ALERTS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'system' CHECK (category IN ('application', 'match', 'interview', 'coach', 'system')),
  action_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. AI CONVERSATIONS & USAGE LOGS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  context_type TEXT NOT NULL DEFAULT 'career_coach' CHECK (context_type IN ('career_coach', 'interview_prep', 'job_drafting', 'cv_parsing')),
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. SUBSCRIPTIONS & BILLING
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL CHECK (tier IN ('starter', 'growth', 'enterprise')),
  price_xaf_monthly INTEGER NOT NULL DEFAULT 0,
  max_active_jobs INTEGER NOT NULL DEFAULT 1,
  seat_limit INTEGER NOT NULL DEFAULT 1,
  features TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.organization_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'payment_due', 'canceled', 'past_due')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. MODERATION, SAFETY & AUDIT LOGS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.moderation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('job', 'profile', 'organization')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  flag_type TEXT NOT NULL CHECK (flag_type IN ('fees_requested', 'discriminatory', 'unrealistic_pay', 'scam', 'duplicate', 'other')),
  priority moderation_priority_type NOT NULL DEFAULT 'medium',
  status moderation_status_type NOT NULL DEFAULT 'open',
  ai_suggestion TEXT,
  action_taken TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Immutable Platform Audit Log
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR HIGH-THROUGHPUT PERFORMANCE
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_jobs_status_city ON public.jobs(status, city);
CREATE INDEX IF NOT EXISTS idx_jobs_org_id ON public.jobs(organization_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_talent_id ON public.applications(talent_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_org ON public.organization_members(user_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_platform_roles_user ON public.platform_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_moderation_status_priority ON public.moderation_reports(status, priority);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- RLS HELPER FUNCTIONS
-- ------------------------------------------------------------------------------

-- Helper to check if current user has a platform admin role
CREATE OR REPLACE FUNCTION public.is_platform_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_roles
    WHERE platform_roles.user_id = user_id
      AND platform_roles.role IN ('owner', 'super_admin', 'admin', 'moderator', 'support')
  );
$$;

-- Helper to check if current user is an active member of an organisation
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = org_id
      AND organization_members.user_id = user_id
      AND organization_members.accepted_at IS NOT NULL
  );
$$;

-- Helper to check specific role within an organisation
CREATE OR REPLACE FUNCTION public.has_org_role(org_id UUID, user_id UUID, required_roles org_role_type[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = org_id
      AND organization_members.user_id = user_id
      AND organization_members.role = ANY(required_roles)
      AND organization_members.accepted_at IS NOT NULL
  );
$$;

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read basic profiles, owners can update their own
CREATE POLICY profiles_select_all ON public.profiles FOR SELECT USING (true);
CREATE POLICY profiles_update_owner ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Platform Roles: Only platform admins can view, only Super Admin can grant/modify
CREATE POLICY platform_roles_select_admins ON public.platform_roles
  FOR SELECT USING (public.is_platform_admin(auth.uid()));
CREATE POLICY platform_roles_modify_super_admin ON public.platform_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.platform_roles
      WHERE user_id = auth.uid() AND role IN ('owner', 'super_admin')
    )
  );

-- Organisations: Anyone can view verified orgs; members view own orgs; admins view all
CREATE POLICY orgs_select_policy ON public.organizations
  FOR SELECT USING (
    verification_status = 'verified'
    OR public.is_org_member(id, auth.uid())
    OR public.is_platform_admin(auth.uid())
  );

CREATE POLICY orgs_insert_auth ON public.organizations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY orgs_update_owner_admin ON public.organizations
  FOR UPDATE USING (
    public.has_org_role(id, auth.uid(), ARRAY['owner', 'admin']::org_role_type[])
    OR public.is_platform_admin(auth.uid())
  );

-- Organisation Members:
CREATE POLICY org_members_select ON public.organization_members
  FOR SELECT USING (
    public.is_org_member(organization_id, auth.uid())
    OR public.is_platform_admin(auth.uid())
  );

CREATE POLICY org_members_manage ON public.organization_members
  FOR ALL USING (
    public.has_org_role(organization_id, auth.uid(), ARRAY['owner', 'admin']::org_role_type[])
    OR public.is_platform_admin(auth.uid())
  );

-- Talent Profiles: Talents control their own; employers can view if candidate opted-in
CREATE POLICY talent_profiles_select ON public.talent_profiles
  FOR SELECT USING (
    user_id = auth.uid()
    OR (share_cv_with_employers = TRUE AND auth.uid() IS NOT NULL)
    OR public.is_platform_admin(auth.uid())
  );

CREATE POLICY talent_profiles_modify ON public.talent_profiles
  FOR ALL USING (user_id = auth.uid());

-- Talent sub-records:
CREATE POLICY talent_skills_all ON public.talent_skills
  FOR ALL USING (talent_id IN (SELECT id FROM public.talent_profiles WHERE user_id = auth.uid()));

CREATE POLICY talent_exp_all ON public.talent_experiences
  FOR ALL USING (talent_id IN (SELECT id FROM public.talent_profiles WHERE user_id = auth.uid()));

CREATE POLICY talent_edu_all ON public.talent_education
  FOR ALL USING (talent_id IN (SELECT id FROM public.talent_profiles WHERE user_id = auth.uid()));

-- Jobs: Public can see open jobs; org members see all their own org jobs; admins see all
CREATE POLICY jobs_select ON public.jobs
  FOR SELECT USING (
    status = 'open'
    OR status = 'closing_soon'
    OR public.is_org_member(organization_id, auth.uid())
    OR public.is_platform_admin(auth.uid())
  );

CREATE POLICY jobs_insert ON public.jobs
  FOR INSERT WITH CHECK (
    public.has_org_role(organization_id, auth.uid(), ARRAY['owner', 'admin', 'recruiter', 'hiring_manager']::org_role_type[])
  );

CREATE POLICY jobs_update ON public.jobs
  FOR UPDATE USING (
    public.has_org_role(organization_id, auth.uid(), ARRAY['owner', 'admin', 'recruiter']::org_role_type[])
    OR public.is_platform_admin(auth.uid())
  );

-- Applications: Talent can see own applications; employers see applications to their jobs
CREATE POLICY applications_select ON public.applications
  FOR SELECT USING (
    talent_id IN (SELECT id FROM public.talent_profiles WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
        AND public.is_org_member(jobs.organization_id, auth.uid())
    )
    OR public.is_platform_admin(auth.uid())
  );

CREATE POLICY applications_insert ON public.applications
  FOR INSERT WITH CHECK (
    talent_id IN (SELECT id FROM public.talent_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY applications_update ON public.applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
        AND public.has_org_role(jobs.organization_id, auth.uid(), ARRAY['owner', 'admin', 'recruiter', 'hiring_manager']::org_role_type[])
    )
    OR public.is_platform_admin(auth.uid())
  );

-- Moderation & Audit Logs: Strict platform admin access
CREATE POLICY moderation_reports_select ON public.moderation_reports
  FOR SELECT USING (public.is_platform_admin(auth.uid()));

CREATE POLICY moderation_reports_insert ON public.moderation_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY audit_logs_select ON public.audit_logs
  FOR SELECT USING (public.is_platform_admin(auth.uid()));

CREATE POLICY audit_logs_insert ON public.audit_logs
  FOR INSERT WITH CHECK (public.is_platform_admin(auth.uid()));
