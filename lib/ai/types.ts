/**
 * WorkDey AI Layer Types & Contracts
 * Structured schemas for AI Gateway, Job Matching, Candidate Matching,
 * Career Coaching, Skill-Gap Analysis, Roadmap Generation, and CV Assistance.
 */

export type AIProviderName = 'openai' | 'gemini' | 'anthropic' | 'mock';

export type AIModelName =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4-turbo'
  | 'gpt-3.5-turbo'
  | 'gemini-3.8-flash'
  | 'gemini-2.5-flash'
  | 'gemini-3.1-flash-lite'
  | (string & {});

export interface AIProviderConfig {
  provider: AIProviderName;
  model: string;
  timeoutMs: number;
  maxRetries: number;
}

export interface AIUsageRecord {
  id: string;
  timestamp: string;
  feature: 'job_match' | 'candidate_match' | 'coach' | 'skill_gap' | 'roadmap' | 'cv_assist' | 'job_desc_assist' | 'health_check';
  model: string;
  provider: AIProviderName;
  duration_ms: number;
  estimated_tokens?: number;
  status: 'success' | 'error' | 'rate_limited' | 'fallback';
  error?: string;
  user_id?: string;
}

export interface AIRateLimitState {
  limit: number;
  remaining: number;
  reset_seconds: number;
}

// ---------------------------------------------------------------------------
// 1. Job Matching Types (Talent side)
// ---------------------------------------------------------------------------

export interface JobMatchRequest {
  job: {
    id: string;
    title: string;
    company_name: string;
    city: string;
    work_style: 'onsite' | 'hybrid' | 'remote';
    contract_type?: string;
    min_salary_xaf?: number | null;
    max_salary_xaf?: number | null;
    required_skills: string[];
    description: string;
    experience_level?: string;
  };
  talent_profile: {
    id: string;
    headline?: string | null;
    bio?: string | null;
    city: string;
    country: string;
    skills: { name: string; proficiency: string; years_experience?: number }[];
    experiences: { title: string; company: string; duration: string; description: string }[];
    educations: { institution: string; degree: string; field: string }[];
    certifications: { name: string; issuer: string }[];
    preferred_work_styles?: string[];
  };
}

export interface MatchedSkillItem {
  skill: string;
  evidence: string;
  importance: 'critical' | 'preferred';
}

export interface MissingSkillItem {
  skill: string;
  urgency: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface JobMatchResult {
  match_score: number; // 0 - 100
  category_scores: {
    skills: number; // 0 - 100
    experience: number; // 0 - 100
    location: number; // 0 - 100
    education: number; // 0 - 100
  };
  matched_skills: MatchedSkillItem[];
  missing_skills: MissingSkillItem[];
  relevant_experience: string[];
  explanation: string;
  readiness_recommendations: string[];
  is_ai_powered: boolean;
  ai_status: 'live' | 'offline_fallback';
  ethical_notice: string;
}

// ---------------------------------------------------------------------------
// 2. Candidate Matching Types (Employer side)
// ---------------------------------------------------------------------------

export interface CandidateMatchRequest {
  job: {
    id: string;
    title: string;
    department?: string;
    city: string;
    work_style: string;
    required_skills: string[];
    description: string;
    minimum_years_experience?: number;
  };
  candidate: {
    id: string;
    headline?: string;
    city: string;
    skills: { name: string; proficiency: string; years_experience?: number }[];
    experiences: { title: string; company: string; duration: string; description: string }[];
    educations: { institution: string; degree: string; field: string }[];
    certifications: { name: string; issuer: string }[];
  };
}

export interface CandidateMatchResult {
  match_score: number; // 0 - 100
  relevant_strengths: string[];
  matching_skills: string[];
  missing_qualifications: string[];
  experience_relevance: string;
  explanation: string;
  suggested_interview_areas: string[];
  is_ai_powered: boolean;
  ai_status: 'live' | 'offline_fallback';
  ethical_notice: string;
}

// ---------------------------------------------------------------------------
// 3. AI Career Coach Types
// ---------------------------------------------------------------------------

export type CoachMode =
  | 'career_strategy'
  | 'mock_interview'
  | 'cv_critique'
  | 'cover_letter'
  | 'salary_negotiation'
  | 'freelance_proposal'
  | 'skill_improvement';

export interface CoachMessageRequest {
  mode: CoachMode;
  user_message: string;
  history?: { role: 'user' | 'assistant'; text: string }[];
  candidate_context?: {
    headline?: string;
    city?: string;
    skills?: string[];
    current_role?: string;
    target_role?: string;
    salary_target_xaf?: number;
  };
  privacy_settings?: {
    ground_in_profile?: boolean;
    save_transcript?: boolean;
    share_with_employers?: boolean;
  };
}

export interface CoachMessageResult {
  text: string;
  mode: CoachMode;
  suggested_actions?: string[];
  interview_feedback?: {
    strengths: string[];
    improvements: string[];
    score_out_of_10?: number;
  };
  is_ai_powered: boolean;
  ai_status: 'live' | 'offline_fallback';
}

// ---------------------------------------------------------------------------
// 4. Skill Gap Analysis Types
// ---------------------------------------------------------------------------

export interface SkillGapRequest {
  target_role: string;
  target_industry?: string;
  current_skills: { name: string; proficiency: string; years_experience?: number }[];
  target_job_skills?: string[];
}

export interface SkillGapItem {
  skill: string;
  category: 'core' | 'specialized' | 'soft_skill';
  current_level: 'none' | 'beginner' | 'intermediate' | 'advanced';
  required_level: 'intermediate' | 'advanced' | 'expert';
  priority: 'high' | 'medium' | 'low';
  rationale: string;
  recommended_action: string;
}

export interface LearningActivityItem {
  title: string;
  provider_or_platform: string;
  duration_text: string;
  format: 'online_course' | 'hands_on_project' | 'certification' | 'local_community';
  description: string;
  link_or_resource?: string;
}

export interface SkillGapResult {
  target_role: string;
  overall_readiness_pct: number;
  existing_strengths: { skill: string; evidence: string }[];
  missing_skills: SkillGapItem[];
  partially_developed_skills: SkillGapItem[];
  suggested_priorities: string[];
  learning_activities: LearningActivityItem[];
  is_ai_powered: boolean;
  ai_status: 'live' | 'offline_fallback';
}

// ---------------------------------------------------------------------------
// 5. Career Roadmap Generation Types
// ---------------------------------------------------------------------------

export interface RoadmapGenerateRequest {
  goal_title: string;
  current_role: string;
  target_role: string;
  timeframe_months: number; // e.g. 3, 6, 12
  current_skills: string[];
  focus_areas?: string[];
  weekly_hours_available?: number;
}

export interface GeneratedRoadmapTask {
  text: string;
  category: 'learning' | 'practical_project' | 'networking' | 'application';
}

export interface GeneratedRoadmapMilestone {
  stage_order: number;
  title: string;
  duration_text: string;
  description: string;
  weekly_goals: string[];
  tasks: GeneratedRoadmapTask[];
  practical_project?: {
    title: string;
    outcome: string;
    stack_or_tools: string;
  };
  progress_criteria: string[];
}

export interface RoadmapGenerateResult {
  goal_title: string;
  current_role: string;
  target_role: string;
  estimated_months: number;
  milestones: GeneratedRoadmapMilestone[];
  is_ai_powered: boolean;
  ai_status: 'live' | 'offline_fallback';
}

// ---------------------------------------------------------------------------
// 6. CV & Job Description Assistance Types
// ---------------------------------------------------------------------------

export interface CVAssistRequest {
  cv_text: string;
  target_job_title?: string;
  action:
    | 'analyze_and_improve'
    | 'extract_skills'
    | 'generate_cover_letter'
    | 'tailor_for_job'
    | 'match_with_job';
  company_name?: string;
  job_description?: string;
}

export interface CVSuggestion {
  section: string;
  issue: string;
  recommendation: string;
  example_rewrite: string;
}

export interface CVAssistResult {
  overall_score: number; // 0 - 100
  executive_critique: string;
  strengths: string[];
  suggestions: CVSuggestion[];
  extracted_skills: {
    hard_skills: string[];
    soft_skills: string[];
    tools_and_platforms: string[];
  };
  suggested_action_verbs: string[];
  cover_letter?: {
    content: string;
    key_talking_points: string[];
    cultural_alignment: string;
  };
  is_ai_powered: boolean;
  ai_status: 'live' | 'offline_fallback';
}

export interface JobDescAssistRequest {
  title: string;
  department?: string;
  raw_description: string;
  city: string;
  work_style: string;
  min_salary_xaf?: number | null;
  max_salary_xaf?: number | null;
}

export interface JobDescAssistResult {
  enhanced_title: string;
  enhanced_description: string;
  clarified_responsibilities: string[];
  must_have_skills: string[];
  nice_to_have_skills: string[];
  bias_detection: {
    flags_detected: string[];
    recommendations: string[];
  };
  salary_transparency_advice: string;
  is_ai_powered: boolean;
  ai_status: 'live' | 'offline_fallback';
}
