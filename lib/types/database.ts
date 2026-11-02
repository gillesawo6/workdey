export type PlatformRole = 'owner' | 'super_admin' | 'admin' | 'moderator' | 'support';
export type OrgRole = 'owner' | 'admin' | 'recruiter' | 'hiring_manager' | 'viewer';
export type OrgVerificationStatus = 'pending' | 'verified' | 'rejected';
export type WorkStyle = 'onsite' | 'hybrid' | 'remote';
export type ContractType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type JobStatus = 'draft' | 'pending_moderation' | 'open' | 'closing_soon' | 'closed';
export type ApplicationStage =
  | 'saved'
  | 'preparing'
  | 'applied'
  | 'under_review'
  | 'screening'
  | 'shortlisted'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'
  | 'withdrawn';
export type InterviewFormat = 'video' | 'onsite' | 'phone';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
export type ModerationPriority = 'low' | 'medium' | 'high';
export type ModerationStatus = 'open' | 'in_review' | 'resolved' | 'dismissed';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  phone?: string | null;
  language_pref: 'en' | 'fr';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PlatformRoleRecord {
  id: string;
  user_id: string;
  role: PlatformRole;
  granted_by?: string | null;
  granted_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  tagline?: string | null;
  about?: string | null;
  website?: string | null;
  sector?: string | null;
  company_size?: string | null;
  city: string;
  region: string;
  country: string;
  verification_status: OrgVerificationStatus;
  verification_doc_url?: string | null;
  verified_at?: string | null;
  verified_by?: string | null;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgRole;
  invited_at: string;
  accepted_at?: string | null;
  organization?: Organization;
  profile?: UserProfile;
}

export interface TalentProfile {
  id: string;
  user_id: string;
  headline?: string | null;
  bio?: string | null;
  city: string;
  region: string;
  country: string;
  work_style_pref: WorkStyle;
  expected_salary_min_xaf?: number | null;
  expected_salary_max_xaf?: number | null;
  currency: string;
  profile_strength_pct: number;
  cv_file_url?: string | null;
  cv_filename?: string | null;
  cv_updated_at?: string | null;
  is_open_to_work: boolean;
  share_cv_with_employers: boolean;
  allow_ai_matching: boolean;
  hide_current_employer: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TalentSkill {
  id: string;
  talent_id: string;
  skill_id: string;
  skill_name: string;
  years_experience: number;
  verified_score?: number | null;
}

export interface TalentExperience {
  id: string;
  talent_id: string;
  job_title: string;
  company_name: string;
  city?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description?: string | null;
}

export interface JobListing {
  id: string;
  organization_id: string;
  creator_id?: string | null;
  title: string;
  category_id?: string | null;
  category_name?: string | null;
  city: string;
  region: string;
  country: string;
  work_style: WorkStyle;
  contract_type: ContractType;
  salary_min_xaf: number;
  salary_max_xaf: number;
  currency: string;
  experience_level: string;
  description: string;
  requirements_summary?: string | null;
  required_skills: string[];
  languages: string[];
  status: JobStatus;
  moderation_flag?: string | null;
  published_at?: string | null;
  deadline?: string | null;
  views_count: number;
  applicants_count?: number;
  shortlisted_count?: number;
  organization?: Organization;
  created_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  talent_id: string;
  stage: ApplicationStage;
  match_score?: number | null;
  match_skills_score?: number | null;
  match_experience_score?: number | null;
  match_location_score?: number | null;
  match_reasons: string[];
  match_gaps: string[];
  screening_answers?: Record<string, any>;
  cv_version_url?: string | null;
  applied_at: string;
  updated_at?: string;
  job?: JobListing;
  talent?: TalentProfile & { profile?: UserProfile };
}

export interface Interview {
  id: string;
  application_id: string;
  scheduled_at: string;
  duration_minutes: number;
  format: InterviewFormat;
  meeting_link_or_location?: string | null;
  interviewer_names: string[];
  panel_notes?: string | null;
  status: InterviewStatus;
  application?: Application;
}

export interface CareerRoadmap {
  id: string;
  talent_id: string;
  goal_title: string;
  current_role: string;
  target_role: string;
  estimated_months: number;
  progress_pct: number;
  milestones?: RoadmapMilestone[];
}

export interface RoadmapMilestone {
  id: string;
  roadmap_id: string;
  stage_order: number;
  title: string;
  duration_text: string;
  description?: string | null;
  status: 'completed' | 'in_progress' | 'pending';
  tasks?: { id: string; text: string; done: boolean }[];
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  body: string;
  category: 'application' | 'match' | 'interview' | 'coach' | 'system';
  action_url?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ModerationReport {
  id: string;
  reported_by?: string | null;
  target_type: 'job' | 'profile' | 'organization';
  target_id: string;
  target_title?: string;
  reporter_name?: string;
  reason: string;
  flag_type: 'fees_requested' | 'discriminatory' | 'unrealistic_pay' | 'scam' | 'duplicate' | 'other';
  priority: ModerationPriority;
  status: ModerationStatus;
  ai_suggestion?: string | null;
  action_taken?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string | null;
  actor_name?: string;
  action: string;
  target_type: string;
  target_id?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}
