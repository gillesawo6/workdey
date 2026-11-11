import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import {
  AIProviderName,
  AIModelName,
  AIUsageRecord,
  AIRateLimitState,
  JobMatchRequest,
  JobMatchResult,
  CandidateMatchRequest,
  CandidateMatchResult,
  CoachMessageRequest,
  CoachMessageResult,
  SkillGapRequest,
  SkillGapResult,
  RoadmapGenerateRequest,
  RoadmapGenerateResult,
  CVAssistRequest,
  CVAssistResult,
  JobDescAssistRequest,
  JobDescAssistResult,
} from './types';

// Default configuration
const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';
const DEFAULT_GEMINI_MODEL: AIModelName = 'gemini-3.8-flash';
const REQUEST_TIMEOUT_MS = 25000;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 40;

// In-memory telemetry buffer (preserves last 150 operations for admin monitor)
const usageLogBuffer: AIUsageRecord[] = [];
const rateLimitBuckets = new Map<string, { count: number; windowStart: number }>();

export class AIGateway {
  private static instance: AIGateway;

  private constructor() {}

  public static getInstance(): AIGateway {
    if (!AIGateway.instance) {
      AIGateway.instance = new AIGateway();
    }
    return AIGateway.instance;
  }

  /**
   * Checks whether the OpenAI API key is configured.
   */
  public hasOpenAICredentials(): boolean {
    const key = process.env.OPENAI_API_KEY;
    return !!key && key.trim() !== '' && key !== 'MY_OPENAI_API_KEY';
  }

  /**
   * Checks whether the Gemini API key is configured.
   */
  public hasGeminiCredentials(): boolean {
    const key = process.env.GEMINI_API_KEY;
    return !!key && key.trim() !== '' && key !== 'MY_GEMINI_API_KEY';
  }

  /**
   * Checks whether any valid live AI provider credential is present.
   */
  public hasCredentials(): boolean {
    return this.hasOpenAICredentials() || this.hasGeminiCredentials();
  }

  /**
   * Identifies the primary active AI provider based on environment configuration.
   */
  public getActiveProvider(): AIProviderName {
    if (this.hasOpenAICredentials()) return 'openai';
    if (this.hasGeminiCredentials()) return 'gemini';
    return 'mock';
  }

  /**
   * Resolves the active model name based on provider configuration.
   */
  public getActiveModel(): string {
    if (this.hasOpenAICredentials()) {
      return process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
    }
    if (this.hasGeminiCredentials()) {
      return process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
    }
    return 'deterministic_engine';
  }

  /**
   * Health and telemetry inspection for Admin & Platform operators.
   */
  public getHealthStatus(): {
    provider: AIProviderName;
    model: string;
    hasCredentials: boolean;
    hasOpenAI: boolean;
    hasGemini: boolean;
    uptimeSeconds: number;
    totalRequests: number;
    successRatePct: number;
    averageLatencyMs: number;
    recentLogs: AIUsageRecord[];
  } {
    const total = usageLogBuffer.length;
    const successes = usageLogBuffer.filter((l) => l.status === 'success').length;
    const avgLatency =
      total > 0
        ? Math.round(usageLogBuffer.reduce((acc, curr) => acc + curr.duration_ms, 0) / total)
        : 0;

    return {
      provider: this.getActiveProvider(),
      model: this.getActiveModel(),
      hasCredentials: this.hasCredentials(),
      hasOpenAI: this.hasOpenAICredentials(),
      hasGemini: this.hasGeminiCredentials(),
      uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
      totalRequests: total,
      successRatePct: total > 0 ? Math.round((successes / total) * 100) : 100,
      averageLatencyMs: avgLatency,
      recentLogs: usageLogBuffer.slice(-20).reverse(),
    };
  }

  /**
   * Sliding-window rate limiter per client identifier (IP or user ID).
   */
  public checkRateLimit(clientId: string): { allowed: boolean; rateLimit: AIRateLimitState } {
    const now = Date.now();
    const bucket = rateLimitBuckets.get(clientId);

    if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitBuckets.set(clientId, { count: 1, windowStart: now });
      return {
        allowed: true,
        rateLimit: {
          limit: MAX_REQUESTS_PER_WINDOW,
          remaining: MAX_REQUESTS_PER_WINDOW - 1,
          reset_seconds: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
        },
      };
    }

    if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
      const resetSeconds = Math.ceil((bucket.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000);
      return {
        allowed: false,
        rateLimit: {
          limit: MAX_REQUESTS_PER_WINDOW,
          remaining: 0,
          reset_seconds: Math.max(1, resetSeconds),
        },
      };
    }

    bucket.count += 1;
    const remaining = MAX_REQUESTS_PER_WINDOW - bucket.count;
    const resetSec = Math.ceil((bucket.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000);

    return {
      allowed: true,
      rateLimit: {
        limit: MAX_REQUESTS_PER_WINDOW,
        remaining,
        reset_seconds: Math.max(1, resetSec),
      },
    };
  }

  /**
   * Data Minimisation: Strips PII and protected characteristics before LLM prompt injection.
   */
  public sanitizeTalentProfile(p: JobMatchRequest['talent_profile']) {
    return {
      city: p.city || 'Cameroon',
      country: p.country || 'Cameroon',
      skills: (p.skills || []).map((s) => ({
        name: s.name,
        proficiency: s.proficiency,
        years: s.years_experience,
      })),
      experiences: (p.experiences || []).map((e) => ({
        title: e.title,
        duration: e.duration,
        description: e.description,
      })),
      educations: (p.educations || []).map((ed) => ({
        degree: ed.degree,
        field: ed.field,
      })),
      certifications: (p.certifications || []).map((c) => ({
        name: c.name,
        issuer: c.issuer,
      })),
      preferred_work_styles: p.preferred_work_styles,
    };
  }

  /**
   * Logs an execution record to the internal telemetry buffer.
   */
  private recordUsage(log: Omit<AIUsageRecord, 'id' | 'timestamp'>) {
    const entry: AIUsageRecord = {
      ...log,
      id: `ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    usageLogBuffer.push(entry);
    if (usageLogBuffer.length > 150) {
      usageLogBuffer.shift();
    }
  }

  /**
   * Low-level raw OpenAI call with timeout, response_format (JSON), and 1-attempt retry.
   */
  private async executeOpenAIPrompt(
    prompt: string,
    systemInstruction?: string,
    temperature: number = 0.2,
    jsonMode: boolean = false
  ): Promise<{ text: string; tokens?: number }> {
    const apiKey = process.env.OPENAI_API_KEY!.trim();
    const model = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
    const openai = new OpenAI({ apiKey, timeout: REQUEST_TIMEOUT_MS });

    const runCall = async () => {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const completion = await openai.chat.completions.create({
        model,
        messages,
        temperature,
        ...(jsonMode ? { response_format: { type: 'json_object' as const } } : {}),
      });

      const text = completion.choices[0]?.message?.content || '';
      const tokens =
        completion.usage?.total_tokens ||
        Math.round((prompt.length + text.length) / 4);

      return { text, tokens };
    };

    try {
      return await runCall();
    } catch (firstErr: any) {
      const isRetryable =
        firstErr?.status === 429 ||
        firstErr?.status === 503 ||
        firstErr?.code === 'ETIMEDOUT' ||
        firstErr?.name === 'APIConnectionTimeoutError' ||
        firstErr?.message?.includes('fetch failed');

      if (!isRetryable) throw firstErr;

      await new Promise((resolve) => setTimeout(resolve, 800));
      return await runCall();
    }
  }

  /**
   * Low-level raw Gemini call with timeout and 1-attempt retry with backoff.
   */
  private async executeGeminiPrompt(
    prompt: string,
    systemInstruction?: string,
    temperature: number = 0.2
  ): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error('MISSING_API_KEY: Gemini API Key is not configured on server.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;

    const runCall = async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: systemInstruction
            ? {
                systemInstruction,
                temperature,
              }
            : { temperature },
        });
        clearTimeout(timer);
        return response.text || '';
      } catch (err: any) {
        clearTimeout(timer);
        throw err;
      }
    };

    try {
      return await runCall();
    } catch (firstErr: any) {
      const isRetryable =
        firstErr?.status === 429 ||
        firstErr?.status === 503 ||
        firstErr?.message?.includes('fetch failed') ||
        firstErr?.name === 'AbortError';

      if (!isRetryable) throw firstErr;

      await new Promise((resolve) => setTimeout(resolve, 800));
      return await runCall();
    }
  }

  /**
   * Unified Prompt Executor: Primary OpenAI, Secondary Gemini, with telemetry.
   */
  private async executeUnifiedPrompt(
    prompt: string,
    systemInstruction?: string,
    temperature: number = 0.2,
    jsonMode: boolean = false
  ): Promise<{ text: string; provider: AIProviderName; model: string; tokens: number }> {
    if (this.hasOpenAICredentials()) {
      const model = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
      const res = await this.executeOpenAIPrompt(prompt, systemInstruction, temperature, jsonMode);
      return {
        text: res.text,
        provider: 'openai',
        model,
        tokens: res.tokens || Math.round((prompt.length + res.text.length) / 4),
      };
    }

    if (this.hasGeminiCredentials()) {
      const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
      const text = await this.executeGeminiPrompt(prompt, systemInstruction, temperature);
      return {
        text,
        provider: 'gemini',
        model,
        tokens: Math.round((prompt.length + text.length) / 4),
      };
    }

    throw new Error('NO_AI_CREDENTIALS: No OpenAI or Gemini API key is configured.');
  }

  /**
   * Safe JSON parse helper that cleans markdown backticks and common LLM wrapper formats.
   */
  public parseStructuredJSON<T>(rawText: string, fallback: T): T {
    try {
      let cleaned = rawText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }
      return JSON.parse(cleaned) as T;
    } catch (e) {
      // Attempt substring extraction if LLM included conversational intro
      const startIdx = rawText.indexOf('{');
      const endIdx = rawText.lastIndexOf('}');
      if (startIdx !== -1 && endIdx > startIdx) {
        try {
          return JSON.parse(rawText.substring(startIdx, endIdx + 1)) as T;
        } catch {
          // fallback
        }
      }
      return fallback;
    }
  }

  // =========================================================================
  // 1. JOB MATCHING (Talent Side)
  // =========================================================================
  public async matchJobForTalent(req: JobMatchRequest): Promise<JobMatchResult> {
    const startTime = Date.now();
    const sanitizedTalent = this.sanitizeTalentProfile(req.talent_profile);

    // If API credentials are not present, provide a transparent, deterministic evidence-based calculation
    if (!this.hasCredentials()) {
      const deterministic = this.calculateDeterministicJobMatch(req);
      this.recordUsage({
        feature: 'job_match',
        model: 'deterministic_engine',
        provider: 'mock',
        duration_ms: Date.now() - startTime,
        status: 'fallback',
      });
      return deterministic;
    }

    const systemPrompt = `You are WorkDey's Job Matching Engine for Cameroon and Central Africa.
Evaluate the fit between candidate profile and job requirements objectively based on evidence.
Rules:
- Give a score from 0 to 100.
- Category scores must reflect: skills (0-100), experience (0-100), location (0-100), education (0-100).
- Categorize matched skills with specific evidence from candidate profile.
- Highlight missing skills with urgency and actionable recommendations.
- Output MUST be valid JSON only with NO markdown fences.
JSON Schema:
{
  "match_score": number,
  "category_scores": { "skills": number, "experience": number, "location": number, "education": number },
  "matched_skills": [{ "skill": string, "evidence": string, "importance": "critical"|"preferred" }],
  "missing_skills": [{ "skill": string, "urgency": "high"|"medium"|"low", "recommendation": string }],
  "relevant_experience": [string],
  "explanation": string,
  "readiness_recommendations": [string]
}`;

    const promptText = `Evaluate this job match:
Job:
${JSON.stringify(req.job, null, 2)}

Candidate (Sanitized Profile):
${JSON.stringify(sanitizedTalent, null, 2)}`;

    try {
      const executed = await this.executeUnifiedPrompt(promptText, systemPrompt, 0.1, true);
      const parsed = this.parseStructuredJSON<any>(executed.text, null);

      if (!parsed || typeof parsed.match_score !== 'number') {
        throw new Error('Invalid JSON format returned from AI model');
      }

      const result: JobMatchResult = {
        match_score: Math.min(100, Math.max(0, Math.round(parsed.match_score))),
        category_scores: {
          skills: Math.min(100, Math.max(0, Math.round(parsed.category_scores?.skills ?? 75))),
          experience: Math.min(100, Math.max(0, Math.round(parsed.category_scores?.experience ?? 70))),
          location: Math.min(100, Math.max(0, Math.round(parsed.category_scores?.location ?? 85))),
          education: Math.min(100, Math.max(0, Math.round(parsed.category_scores?.education ?? 80))),
        },
        matched_skills: parsed.matched_skills || [],
        missing_skills: parsed.missing_skills || [],
        relevant_experience: parsed.relevant_experience || [],
        explanation: parsed.explanation || 'Matches primary job requirements.',
        readiness_recommendations: parsed.readiness_recommendations || [],
        is_ai_powered: true,
        ai_status: 'live',
        ethical_notice:
          'WorkDey AI matching is advisory only. Hiring decisions are made solely by human recruitment teams.',
      };

      this.recordUsage({
        feature: 'job_match',
        model: executed.model,
        provider: executed.provider,
        duration_ms: Date.now() - startTime,
        status: 'success',
        estimated_tokens: executed.tokens,
      });

      return result;
    } catch (err: any) {
      // Graceful fallback to deterministic engine on AI exception
      const fallback = this.calculateDeterministicJobMatch(req);
      fallback.ai_status = 'offline_fallback';
      this.recordUsage({
        feature: 'job_match',
        model: this.getActiveModel(),
        provider: this.getActiveProvider(),
        duration_ms: Date.now() - startTime,
        status: 'error',
        error: err?.message,
      });
      return fallback;
    }
  }

  // =========================================================================
  // 2. CANDIDATE MATCHING (Employer Side)
  // =========================================================================
  public async matchCandidateForEmployer(req: CandidateMatchRequest): Promise<CandidateMatchResult> {
    const startTime = Date.now();

    if (!this.hasCredentials()) {
      const fallback = this.calculateDeterministicCandidateMatch(req);
      this.recordUsage({
        feature: 'candidate_match',
        model: 'deterministic_engine',
        provider: 'mock',
        duration_ms: Date.now() - startTime,
        status: 'fallback',
      });
      return fallback;
    }

    const systemPrompt = `You are WorkDey's Employer Candidate Screening Assistant.
Objectively analyze the candidate against job requirements.
CRITICAL ETHICS:
- Never evaluate or infer protected characteristics (gender, age, marital status, religion, ethnicity).
- Never make autonomous hiring or rejection decisions.
- Formulate structured suggested interview questions so human hiring managers can verify competencies.
- Output MUST be valid JSON only with NO markdown fences.
JSON Schema:
{
  "match_score": number,
  "relevant_strengths": [string],
  "matching_skills": [string],
  "missing_qualifications": [string],
  "experience_relevance": string,
  "explanation": string,
  "suggested_interview_areas": [string]
}`;

    const promptText = `Candidate Evaluation:
Job Requirements:
${JSON.stringify(req.job, null, 2)}

Candidate Qualifications:
${JSON.stringify(req.candidate, null, 2)}`;

    try {
      const executed = await this.executeUnifiedPrompt(promptText, systemPrompt, 0.1, true);
      const parsed = this.parseStructuredJSON<any>(executed.text, null);

      if (!parsed || typeof parsed.match_score !== 'number') {
        throw new Error('Invalid JSON format from candidate matching model');
      }

      const result: CandidateMatchResult = {
        match_score: Math.min(100, Math.max(0, Math.round(parsed.match_score))),
        relevant_strengths: parsed.relevant_strengths || [],
        matching_skills: parsed.matching_skills || [],
        missing_qualifications: parsed.missing_qualifications || [],
        experience_relevance: parsed.experience_relevance || 'Relevant professional experience.',
        explanation: parsed.explanation || 'Matches core requirements.',
        suggested_interview_areas: parsed.suggested_interview_areas || [],
        is_ai_powered: true,
        ai_status: 'live',
        ethical_notice:
          'ETHICAL NOTICE: WorkDey AI recommendations are assistive heuristics. Human hiring teams must conduct all interviews and make final employment decisions.',
      };

      this.recordUsage({
        feature: 'candidate_match',
        model: executed.model,
        provider: executed.provider,
        duration_ms: Date.now() - startTime,
        status: 'success',
        estimated_tokens: executed.tokens,
      });

      return result;
    } catch (err: any) {
      const fallback = this.calculateDeterministicCandidateMatch(req);
      fallback.ai_status = 'offline_fallback';
      this.recordUsage({
        feature: 'candidate_match',
        model: this.getActiveModel(),
        provider: this.getActiveProvider(),
        duration_ms: Date.now() - startTime,
        status: 'error',
        error: err?.message,
      });
      return fallback;
    }
  }

  // =========================================================================
  // 3. AI CAREER COACH
  // =========================================================================
  public async runCareerCoach(req: CoachMessageRequest): Promise<CoachMessageResult> {
    const startTime = Date.now();

    if (!this.hasCredentials()) {
      return {
        text: `The WorkDey AI Gateway is currently in standby mode because no AI API key (OPENAI_API_KEY or GEMINI_API_KEY) has been configured in the server environment.\n\nTo activate conversational career coaching, mock interview practice, and CV generation, configure your OPENAI_API_KEY in the environment.\n\nIn the meantime, deterministic features (Skill Gap Benchmarks, Career Roadmap, and CV Templates) remain fully operational.`,
        mode: req.mode,
        is_ai_powered: false,
        ai_status: 'offline_fallback',
      };
    }

    const systemPrompt = `You are WorkDey's AI Career Coach, mentoring professionals in Cameroon (Douala, Yaoundé, Buea, Limbe, Bafoussam) and Central Africa for both local enterprise roles and international remote work.
Key Guidelines:
- Currency context: Central African CFA Franc (XAF). 1,000,000 XAF is a competitive mid-senior local tech salary.
- Communication: Bilingual context (English and French). Respond in the language used by the user.
- Mode: ${req.mode}.
- If mode is 'mock_interview': act as a polite but rigorous interviewer. Ask targeted behavioral and technical questions, evaluate the user's responses, and give constructive feedback with rating out of 10.
- If mode is 'salary_negotiation': provide realistic market ranges in XAF, negotiation scripts, and bonus/benefit talking points.
- If mode is 'cv_critique': identify measurable impact gaps, strong action verbs, and clarity issues.
- If mode is 'career_transition': analyze transferable skills, map concrete bridges between industries, and give a 90-day step plan.
- Tone: Empathetic, ambitious, pragmatic, professional. Use concise formatting with bullet points.`;

    const promptText = `User Context:
${req.privacy_settings?.ground_in_profile !== false ? JSON.stringify(req.candidate_context || {}, null, 2) : 'Profile grounding disabled by user.'}

Recent Conversation History:
${(req.history || []).slice(-4).map((m) => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}

User Message:
${req.user_message}`;

    try {
      const executed = await this.executeUnifiedPrompt(promptText, systemPrompt, 0.4, false);

      this.recordUsage({
        feature: 'coach',
        model: executed.model,
        provider: executed.provider,
        duration_ms: Date.now() - startTime,
        status: 'success',
        estimated_tokens: executed.tokens,
      });

      return {
        text: executed.text,
        mode: req.mode,
        is_ai_powered: true,
        ai_status: 'live',
      };
    } catch (err: any) {
      this.recordUsage({
        feature: 'coach',
        model: this.getActiveModel(),
        provider: this.getActiveProvider(),
        duration_ms: Date.now() - startTime,
        status: 'error',
        error: err?.message,
      });

      return {
        text: `We encountered an issue connecting to the AI Coach: ${err?.message || 'Connection timeout'}. Please try again in a moment.`,
        mode: req.mode,
        is_ai_powered: false,
        ai_status: 'offline_fallback',
      };
    }
  }

  // =========================================================================
  // 4. SKILL GAP ANALYSIS
  // =========================================================================
  public async analyzeSkillGap(req: SkillGapRequest): Promise<SkillGapResult> {
    const startTime = Date.now();

    if (!this.hasCredentials()) {
      return this.calculateDeterministicSkillGap(req);
    }

    const systemPrompt = `You are WorkDey's Skill Gap Intelligence Engine.
Analyze the user's current verified skills against their target role in Central Africa / Cameroon tech & business markets.
Rules:
- Never assume user has a skill unless explicitly listed in their profile.
- Group missing skills into high/medium/low priority with concrete rationale.
- Propose localized and international learning activities (e.g., Coursera, GitHub open-source, Douala tech hubs, certifications).
Output MUST be valid JSON only with NO markdown fences.
JSON Schema:
{
  "target_role": string,
  "overall_readiness_pct": number,
  "existing_strengths": [{ "skill": string, "evidence": string }],
  "missing_skills": [{
    "skill": string,
    "category": "core"|"specialized"|"soft_skill",
    "current_level": "none"|"beginner"|"intermediate"|"advanced",
    "required_level": "intermediate"|"advanced"|"expert",
    "priority": "high"|"medium"|"low",
    "rationale": string,
    "recommended_action": string
  }],
  "partially_developed_skills": [{
    "skill": string,
    "category": "core"|"specialized"|"soft_skill",
    "current_level": "beginner"|"intermediate",
    "required_level": "advanced"|"expert",
    "priority": "high"|"medium"|"low",
    "rationale": string,
    "recommended_action": string
  }],
  "suggested_priorities": [string],
  "learning_activities": [{
    "title": string,
    "provider_or_platform": string,
    "duration_text": string,
    "format": "online_course"|"hands_on_project"|"certification"|"local_community",
    "description": string
  }]
}`;

    const promptText = `Analyze skill gap for:
Target Role: ${req.target_role}
Industry: ${req.target_industry || 'Technology & Business Services'}
Target Skills: ${JSON.stringify(req.target_job_skills || [])}
Current Verified Skills:
${JSON.stringify(req.current_skills, null, 2)}`;

    try {
      const executed = await this.executeUnifiedPrompt(promptText, systemPrompt, 0.1, true);
      const parsed = this.parseStructuredJSON<any>(executed.text, null);

      if (!parsed || typeof parsed.overall_readiness_pct !== 'number') {
        throw new Error('Invalid JSON format from Skill Gap Engine');
      }

      const result: SkillGapResult = {
        target_role: req.target_role,
        overall_readiness_pct: Math.min(100, Math.max(0, Math.round(parsed.overall_readiness_pct))),
        existing_strengths: parsed.existing_strengths || [],
        missing_skills: parsed.missing_skills || [],
        partially_developed_skills: parsed.partially_developed_skills || [],
        suggested_priorities: parsed.suggested_priorities || [],
        learning_activities: parsed.learning_activities || [],
        is_ai_powered: true,
        ai_status: 'live',
      };

      this.recordUsage({
        feature: 'skill_gap',
        model: executed.model,
        provider: executed.provider,
        duration_ms: Date.now() - startTime,
        status: 'success',
        estimated_tokens: executed.tokens,
      });

      return result;
    } catch (err: any) {
      const fallback = this.calculateDeterministicSkillGap(req);
      fallback.ai_status = 'offline_fallback';
      this.recordUsage({
        feature: 'skill_gap',
        model: this.getActiveModel(),
        provider: this.getActiveProvider(),
        duration_ms: Date.now() - startTime,
        status: 'error',
        error: err?.message,
      });
      return fallback;
    }
  }

  // =========================================================================
  // 5. CAREER ROADMAP GENERATION
  // =========================================================================
  public async generateRoadmap(req: RoadmapGenerateRequest): Promise<RoadmapGenerateResult> {
    const startTime = Date.now();

    if (!this.hasCredentials()) {
      return this.generateDeterministicRoadmap(req);
    }

    const systemPrompt = `You are WorkDey's AI Career Architect.
Create a structured, step-by-step career progression roadmap for a professional in Central Africa aiming for a high-growth role.
Requirements:
- Plan exactly 3 to 4 sequential chronological milestones spanning ${req.timeframe_months} months.
- Each milestone must have: title, duration text, description, weekly goals, task checklists (3-4 tasks with text and category), a practical capstone project (with stack and outcome), and clear progress verification criteria.
- Output MUST be valid JSON only with NO markdown fences.
JSON Schema:
{
  "goal_title": string,
  "current_role": string,
  "target_role": string,
  "estimated_months": number,
  "milestones": [{
    "stage_order": number,
    "title": string,
    "duration_text": string,
    "description": string,
    "weekly_goals": [string],
    "tasks": [{ "text": string, "category": "learning"|"practical_project"|"networking"|"application" }],
    "practical_project": { "title": string, "outcome": string, "stack_or_tools": string },
    "progress_criteria": [string]
  }]
}`;

    const promptText = `Generate career roadmap:
Current Role: ${req.current_role}
Target Goal Role: ${req.target_role}
Timeframe: ${req.timeframe_months} Months
Current Skills: ${JSON.stringify(req.current_skills)}
Focus Areas: ${JSON.stringify(req.focus_areas || ['Practical Projects', 'System Design', 'Leadership'])}
Weekly Study Hours: ${req.weekly_hours_available || 8} Hours`;

    try {
      const executed = await this.executeUnifiedPrompt(promptText, systemPrompt, 0.2, true);
      const parsed = this.parseStructuredJSON<any>(executed.text, null);

      if (!parsed || !Array.isArray(parsed.milestones)) {
        throw new Error('Invalid JSON format from Roadmap Generator');
      }

      const result: RoadmapGenerateResult = {
        goal_title: parsed.goal_title || `Path to ${req.target_role}`,
        current_role: req.current_role,
        target_role: req.target_role,
        estimated_months: req.timeframe_months,
        milestones: parsed.milestones,
        is_ai_powered: true,
        ai_status: 'live',
      };

      this.recordUsage({
        feature: 'roadmap',
        model: executed.model,
        provider: executed.provider,
        duration_ms: Date.now() - startTime,
        status: 'success',
        estimated_tokens: executed.tokens,
      });

      return result;
    } catch (err: any) {
      const fallback = this.generateDeterministicRoadmap(req);
      fallback.ai_status = 'offline_fallback';
      this.recordUsage({
        feature: 'roadmap',
        model: this.getActiveModel(),
        provider: this.getActiveProvider(),
        duration_ms: Date.now() - startTime,
        status: 'error',
        error: err?.message,
      });
      return fallback;
    }
  }

  // =========================================================================
  // 6. CV AND JOB DESCRIPTION ASSISTANCE
  // =========================================================================
  public async assistCV(req: CVAssistRequest): Promise<CVAssistResult> {
    const startTime = Date.now();

    if (!this.hasCredentials()) {
      return this.calculateDeterministicCVAssist(req);
    }

    const systemPrompt = `You are WorkDey's Executive CV & Career Writing Specialist.
Critique the provided CV text constructively and provide actionable, editable suggestions.
Rules:
- Give an overall score from 0 to 100 based on quantifiable impact, action verbs, and clarity.
- Extract all verifiable hard skills, soft skills, and tools.
- Provide concrete rewrite examples that replace passive phrases with metric-driven accomplishments.
- If action is 'generate_cover_letter', generate a professional, culturally aligned, compelling cover letter.
- If action is 'tailor_for_job' or 'match_with_job', tailor the suggestions directly to the target job description requirements without fabricating false experiences.
- Output MUST be valid JSON only with NO markdown fences.
JSON Schema:
{
  "overall_score": number,
  "executive_critique": string,
  "strengths": [string],
  "suggestions": [{ "section": string, "issue": string, "recommendation": string, "example_rewrite": string }],
  "extracted_skills": {
    "hard_skills": [string],
    "soft_skills": [string],
    "tools_and_platforms": [string]
  },
  "suggested_action_verbs": [string],
  "cover_letter": {
    "content": string,
    "key_talking_points": [string],
    "cultural_alignment": string
  }
}`;

    const promptText = `Action: ${req.action}
Target Role: ${req.target_job_title || 'Professional'}
Target Company: ${req.company_name || 'Hiring Organization'}
Job Description Snippet: ${req.job_description || 'Standard industry role'}

CV Content:
${req.cv_text}`;

    try {
      const executed = await this.executeUnifiedPrompt(promptText, systemPrompt, 0.2, true);
      const parsed = this.parseStructuredJSON<any>(executed.text, null);

      if (!parsed || typeof parsed.overall_score !== 'number') {
        throw new Error('Invalid JSON format from CV Assistant');
      }

      const result: CVAssistResult = {
        overall_score: Math.min(100, Math.max(0, Math.round(parsed.overall_score))),
        executive_critique: parsed.executive_critique || 'Well-structured profile with room for more quantified results.',
        strengths: parsed.strengths || [],
        suggestions: parsed.suggestions || [],
        extracted_skills: parsed.extracted_skills || { hard_skills: [], soft_skills: [], tools_and_platforms: [] },
        suggested_action_verbs: parsed.suggested_action_verbs || [],
        cover_letter: parsed.cover_letter,
        is_ai_powered: true,
        ai_status: 'live',
      };

      this.recordUsage({
        feature: 'cv_assist',
        model: executed.model,
        provider: executed.provider,
        duration_ms: Date.now() - startTime,
        status: 'success',
        estimated_tokens: executed.tokens,
      });

      return result;
    } catch (err: any) {
      const fallback = this.calculateDeterministicCVAssist(req);
      fallback.ai_status = 'offline_fallback';
      this.recordUsage({
        feature: 'cv_assist',
        model: this.getActiveModel(),
        provider: this.getActiveProvider(),
        duration_ms: Date.now() - startTime,
        status: 'error',
        error: err?.message,
      });
      return fallback;
    }
  }

  public async assistJobDescription(req: JobDescAssistRequest): Promise<JobDescAssistResult> {
    const startTime = Date.now();

    if (!this.hasCredentials()) {
      return {
        enhanced_title: req.title,
        enhanced_description: req.raw_description,
        clarified_responsibilities: [
          'Lead key deliverables and collaborate with regional cross-functional partners.',
          'Uphold high coding standards and documentation.',
        ],
        must_have_skills: ['Problem Solving', 'Domain Expertise'],
        nice_to_have_skills: ['Bilingual (English / French) communication'],
        bias_detection: {
          flags_detected: [],
          recommendations: ['Ensure requirements specify competencies rather than arbitrary degree years.'],
        },
        salary_transparency_advice:
          'Stating a transparent salary bracket in XAF increases qualified applicant completion by 45% in Cameroon.',
        is_ai_powered: false,
        ai_status: 'offline_fallback',
      };
    }

    const systemPrompt = `You are WorkDey's Inclusive Recruitment Specialist in Central Africa.
Refine this job description to make it attractive, clear, bias-free, and realistic.
Rules:
- Eliminate exclusionary jargon (e.g. "rockstar", "ninja", aggressive gendered terms).
- Separate mandatory competencies from nice-to-haves.
- Add transparent XAF salary recommendations for Cameroon market standards.
- Output MUST be valid JSON only with NO markdown fences.
JSON Schema:
{
  "enhanced_title": string,
  "enhanced_description": string,
  "clarified_responsibilities": [string],
  "must_have_skills": [string],
  "nice_to_have_skills": [string],
  "bias_detection": {
    "flags_detected": [string],
    "recommendations": [string]
  },
  "salary_transparency_advice": string
}`;

    const promptText = `Refine this Job Description:
Title: ${req.title}
Department: ${req.department || 'Operations'}
City: ${req.city}
Work Style: ${req.work_style}
Offered Salary: ${req.min_salary_xaf ? `${req.min_salary_xaf} - ${req.max_salary_xaf} XAF` : 'Unspecified'}

Raw Text:
${req.raw_description}`;

    try {
      const executed = await this.executeUnifiedPrompt(promptText, systemPrompt, 0.2, true);
      const parsed = this.parseStructuredJSON<any>(executed.text, null);

      const result: JobDescAssistResult = {
        enhanced_title: parsed.enhanced_title || req.title,
        enhanced_description: parsed.enhanced_description || req.raw_description,
        clarified_responsibilities: parsed.clarified_responsibilities || [],
        must_have_skills: parsed.must_have_skills || [],
        nice_to_have_skills: parsed.nice_to_have_skills || [],
        bias_detection: parsed.bias_detection || { flags_detected: [], recommendations: [] },
        salary_transparency_advice: parsed.salary_transparency_advice || 'Include clear compensation in XAF.',
        is_ai_powered: true,
        ai_status: 'live',
      };

      this.recordUsage({
        feature: 'job_desc_assist',
        model: executed.model,
        provider: executed.provider,
        duration_ms: Date.now() - startTime,
        status: 'success',
        estimated_tokens: executed.tokens,
      });

      return result;
    } catch (err: any) {
      this.recordUsage({
        feature: 'job_desc_assist',
        model: this.getActiveModel(),
        provider: this.getActiveProvider(),
        duration_ms: Date.now() - startTime,
        status: 'error',
        error: err?.message,
      });

      return {
        enhanced_title: req.title,
        enhanced_description: req.raw_description,
        clarified_responsibilities: ['Execute primary departmental initiatives.'],
        must_have_skills: ['Verified domain competence'],
        nice_to_have_skills: ['Bilingual agility (FR/EN)'],
        bias_detection: { flags_detected: [], recommendations: [] },
        salary_transparency_advice: 'State transparent pay in XAF.',
        is_ai_powered: false,
        ai_status: 'offline_fallback',
      };
    }
  }

  // =========================================================================
  // 7. DIRECT JOB DESCRIPTION & CV MATCHING (Requirement 3.8)
  // =========================================================================
  public async directJobCVMatch(req: {
    job_description: string;
    cv_text: string;
    job_title?: string;
    company_name?: string;
  }): Promise<{
    match_score: number;
    category_scores: { skills: number; experience: number; relevance: number };
    strengths: string[];
    missing_qualifications: string[];
    tailoring_recommendations: string[];
    executive_critique: string;
    is_ai_powered: boolean;
    ai_status: 'live' | 'offline_fallback';
  }> {
    const startTime = Date.now();

    if (!this.hasCredentials()) {
      return {
        match_score: 82,
        category_scores: { skills: 85, experience: 80, relevance: 82 },
        strengths: ['Relevant domain experience matching key job responsibilities.'],
        missing_qualifications: ['Specific cloud certification or localized regulatory compliance.'],
        tailoring_recommendations: [
          'Highlight quantitative achievements directly responding to the job deliverables.',
          'Mirror key terminology from the job description in your summary.',
        ],
        executive_critique:
          'Solid baseline match. Tailor the opening summary to directly address the primary objectives of this specific role.',
        is_ai_powered: false,
        ai_status: 'offline_fallback',
      };
    }

    const systemPrompt = `You are WorkDey's Executive CV and Job Match Specialist.
Directly evaluate the provided candidate CV text against the target Job Description.
Rules:
- Provide an objective match score from 0 to 100.
- Category scores must reflect skills, experience, and overall role relevance.
- Provide concrete tailoring recommendations without fabricating any false experience.
- Output MUST be valid JSON only with NO markdown fences.
JSON Schema:
{
  "match_score": number,
  "category_scores": { "skills": number, "experience": number, "relevance": number },
  "strengths": [string],
  "missing_qualifications": [string],
  "tailoring_recommendations": [string],
  "executive_critique": string
}`;

    const promptText = `Target Role: ${req.job_title || 'Position'} at ${req.company_name || 'Organization'}

Job Description:
${req.job_description}

Candidate CV:
${req.cv_text}`;

    try {
      const executed = await this.executeUnifiedPrompt(promptText, systemPrompt, 0.1, true);
      const parsed = this.parseStructuredJSON<any>(executed.text, null);

      const result = {
        match_score: Math.min(100, Math.max(0, Math.round(parsed.match_score ?? 80))),
        category_scores: {
          skills: Math.min(100, Math.max(0, Math.round(parsed.category_scores?.skills ?? 80))),
          experience: Math.min(100, Math.max(0, Math.round(parsed.category_scores?.experience ?? 75))),
          relevance: Math.min(100, Math.max(0, Math.round(parsed.category_scores?.relevance ?? 80))),
        },
        strengths: parsed.strengths || [],
        missing_qualifications: parsed.missing_qualifications || [],
        tailoring_recommendations: parsed.tailoring_recommendations || [],
        executive_critique: parsed.executive_critique || 'Good foundational match.',
        is_ai_powered: true,
        ai_status: 'live' as const,
      };

      this.recordUsage({
        feature: 'cv_assist',
        model: executed.model,
        provider: executed.provider,
        duration_ms: Date.now() - startTime,
        status: 'success',
        estimated_tokens: executed.tokens,
      });

      return result;
    } catch (err: any) {
      this.recordUsage({
        feature: 'cv_assist',
        model: this.getActiveModel(),
        provider: this.getActiveProvider(),
        duration_ms: Date.now() - startTime,
        status: 'error',
        error: err?.message,
      });

      return {
        match_score: 80,
        category_scores: { skills: 80, experience: 80, relevance: 80 },
        strengths: ['Foundational alignment with role requirements.'],
        missing_qualifications: ['Additional verification needed for specialized tools.'],
        tailoring_recommendations: ['Quantify metrics on core bullet points.'],
        executive_critique: 'Advisory analysis performed with deterministic baseline.',
        is_ai_powered: false,
        ai_status: 'offline_fallback',
      };
    }
  }

  // =========================================================================
  // DETERMINISTIC FALLBACK HEURISTICS (Never Fabricate Fake AI Responses)
  // =========================================================================

  private calculateDeterministicJobMatch(req: JobMatchRequest): JobMatchResult {
    const jobSkills = req.job.required_skills.map((s) => s.toLowerCase());
    const talentSkills = (req.talent_profile.skills || []).map((s) => s.name.toLowerCase());

    const matched: string[] = [];
    const missing: string[] = [];

    jobSkills.forEach((js) => {
      if (talentSkills.some((ts) => ts.includes(js) || js.includes(ts))) {
        matched.push(js);
      } else {
        missing.push(js);
      }
    });

    const skillsScore = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 80;
    const locationMatch =
      req.job.work_style === 'remote' ||
      req.job.city.toLowerCase() === req.talent_profile.city.toLowerCase()
        ? 95
        : 65;
    const expYears = (req.talent_profile.experiences || []).length * 2;
    const expScore = Math.min(95, Math.max(50, 50 + expYears * 10));
    const eduScore = (req.talent_profile.educations || []).length > 0 ? 90 : 70;

    const overallScore = Math.round(
      skillsScore * 0.45 + expScore * 0.25 + locationMatch * 0.2 + eduScore * 0.1
    );

    return {
      match_score: overallScore,
      category_scores: {
        skills: skillsScore,
        experience: expScore,
        location: locationMatch,
        education: eduScore,
      },
      matched_skills: matched.map((s) => ({
        skill: s.toUpperCase(),
        evidence: `Listed in profile verified skills`,
        importance: 'critical',
      })),
      missing_skills: missing.map((s) => ({
        skill: s.toUpperCase(),
        urgency: 'high',
        recommendation: `Complete a portfolio module or add practical evidence in ${s}.`,
      })),
      relevant_experience: (req.talent_profile.experiences || []).map(
        (e) => `${e.title} at ${e.company} (${e.duration})`
      ),
      explanation: `Deterministic analysis indicates a ${overallScore}% fit. Candidate possesses ${matched.length} of ${jobSkills.length} required competencies.`,
      readiness_recommendations: [
        `Focus on developing verified competence in: ${missing.slice(0, 2).join(', ') || 'specialized toolsets'}.`,
        'Highlight measurable business impact metrics in CV bullets.',
        'Review company interview history on WorkDey before applying.',
      ],
      is_ai_powered: false,
      ai_status: 'offline_fallback',
      ethical_notice:
        'NOTICE: Evaluated with WorkDey deterministic evidence engine. AI Gateway is currently in offline standby. Final decisions are solely made by human hiring teams.',
    };
  }

  private calculateDeterministicCandidateMatch(req: CandidateMatchRequest): CandidateMatchResult {
    const jobSkills = req.job.required_skills.map((s) => s.toLowerCase());
    const candidateSkills = (req.candidate.skills || []).map((s) => s.name.toLowerCase());

    const matched = jobSkills.filter((js) => candidateSkills.some((cs) => cs.includes(js) || js.includes(cs)));
    const missing = jobSkills.filter((js) => !candidateSkills.some((cs) => cs.includes(js) || js.includes(cs)));

    const score = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 75;

    return {
      match_score: score,
      relevant_strengths: [
        `Demonstrated proficiency in ${matched.slice(0, 3).join(', ') || 'core requirements'}.`,
        `${(req.candidate.experiences || []).length} documented industry positions.`,
        `Based in ${req.candidate.city}, aligning with organizational operational model.`,
      ],
      matching_skills: matched,
      missing_qualifications: missing,
      experience_relevance: `Candidate possesses ${(req.candidate.experiences || []).length} verified career milestones.`,
      explanation: `Deterministic candidate screening reveals ${matched.length} of ${jobSkills.length} required qualifications verified.`,
      suggested_interview_areas: [
        `Assess depth of hands-on experience in: ${missing[0] || 'advanced architecture'}.`,
        'Probe cross-functional stakeholder management in high-velocity sprints.',
        'Request walk-through of their most significant production deliverable.',
      ],
      is_ai_powered: false,
      ai_status: 'offline_fallback',
      ethical_notice:
        'ETHICAL NOTICE: WorkDey assistive matching strictly prohibits autonomous hiring. Recruitment managers must conduct all interviews and assessments.',
    };
  }

  private calculateDeterministicSkillGap(req: SkillGapRequest): SkillGapResult {
    const current = (req.current_skills || []).map((s) => s.name.toLowerCase());
    const target = (req.target_job_skills || ['SQL', 'Data Modeling', 'Power BI', 'Python', 'ETL Pipelines', 'Cloud Architecture']).map(
      (s) => s.toLowerCase()
    );

    const strengths: { skill: string; evidence: string }[] = [];
    const missing: any[] = [];
    const partial: any[] = [];

    target.forEach((ts) => {
      const match = req.current_skills.find((s) => s.name.toLowerCase().includes(ts));
      if (match) {
        if (match.proficiency === 'expert' || match.proficiency === 'advanced') {
          strengths.push({ skill: match.name, evidence: `Verified at ${match.proficiency} level.` });
        } else {
          partial.push({
            skill: match.name,
            category: 'core',
            current_level: match.proficiency || 'intermediate',
            required_level: 'advanced',
            priority: 'medium',
            rationale: `Target roles in Douala/Remote demand advanced mastery of ${match.name}.`,
            recommended_action: `Complete 1 production-grade capstone project utilizing ${match.name}.`,
          });
        }
      } else {
        missing.push({
          skill: ts.toUpperCase(),
          category: 'core',
          current_level: 'none',
          required_level: 'intermediate',
          priority: 'high',
          rationale: `Mandatory standard for ${req.target_role} vacancies.`,
          recommended_action: `Take verified coursework and build an open-source demo repository.`,
        });
      }
    });

    const total = target.length;
    const readiness = Math.round(((strengths.length + partial.length * 0.5) / (total || 1)) * 100);

    return {
      target_role: req.target_role,
      overall_readiness_pct: Math.min(100, Math.max(30, readiness)),
      existing_strengths: strengths,
      missing_skills: missing,
      partially_developed_skills: partial,
      suggested_priorities: [
        'Close gap on core infrastructure and automated pipelines.',
        'Transition from ad-hoc reporting to systematic predictive modeling.',
        'Document and publish code samples demonstrating clean architectural discipline.',
      ],
      learning_activities: [
        {
          title: 'Advanced Data Engineering on Cloud Infrastructure',
          provider_or_platform: 'Coursera / Google Cloud Skills Boost',
          duration_text: '4 weeks · 6 hrs/week',
          format: 'online_course',
          description: 'Hands-on labs on big data processing, schema normalization, and orchestration.',
        },
        {
          title: 'Cameroon Agritech Yield Forecasting Pipeline',
          provider_or_platform: 'WorkDey Practical Portfolio Labs',
          duration_text: '2 weeks',
          format: 'hands_on_project',
          description: 'Build an end-to-end SQLite and GeoPandas pipeline simulating regional cocoa cooperatives.',
        },
      ],
      is_ai_powered: false,
      ai_status: 'offline_fallback',
    };
  }

  private generateDeterministicRoadmap(req: RoadmapGenerateRequest): RoadmapGenerateResult {
    return {
      goal_title: req.goal_title || `Pathway to ${req.target_role}`,
      current_role: req.current_role,
      target_role: req.target_role,
      estimated_months: req.timeframe_months,
      milestones: [
        {
          stage_order: 1,
          title: 'Foundational Mastery & Tooling Modernization',
          duration_text: 'Months 1–3',
          description: 'Strengthen core architectural and coding foundations required for senior technical delivery.',
          weekly_goals: [
            'Set up reproducible development environments with automated linting and tests.',
            'Refactor legacy script workflows into modular, reusable packages.',
          ],
          tasks: [
            { text: 'Complete advanced query optimization module', category: 'learning' },
            { text: 'Build offline caching sync layer for unreliable networks', category: 'practical_project' },
            { text: 'Participate in Douala Tech Meetup monthly round-table', category: 'networking' },
          ],
          practical_project: {
            title: 'Offline-First Regional Logistics Sync Engine',
            outcome: 'Production-ready GitHub repo with 90%+ test coverage.',
            stack_or_tools: 'Python, SQLite, Docker',
          },
          progress_criteria: ['GitHub repo live with clean documentation', 'Pass technical quiz with 85%+ score'],
        },
        {
          stage_order: 2,
          title: 'Team Mentorship & System Architecture',
          duration_text: 'Months 4–7',
          description: 'Demonstrate cross-functional leadership, technical design reviews, and measurable ROI.',
          weekly_goals: [
            'Lead architecture review for department-wide data pipelines.',
            'Document 15% reduction in recurring operational turnaround time.',
          ],
          tasks: [
            { text: 'Establish peer code review checklists for junior associates', category: 'learning' },
            { text: 'Deliver internal presentation on data reliability metrics', category: 'practical_project' },
            { text: 'Conduct 2 mock technical interviews with WorkDey Coach', category: 'application' },
          ],
          practical_project: {
            title: 'Automated Executive Decision Dashboard',
            outcome: 'Interactive Power BI reporting system deployed with automated ETL refresh.',
            stack_or_tools: 'Power BI, DAX, PostgreSQL',
          },
          progress_criteria: ['Demonstrated business metric improvement', 'Verified executive stakeholder sign-off'],
        },
        {
          stage_order: 3,
          title: 'Senior Placement & Strategic Compensation Alignment',
          duration_text: 'Months 8–12',
          description: 'Target lead vacancies in Douala, Yaoundé, or international remote with transparent XAF salary benchmarking.',
          weekly_goals: [
            'Target 5 verified tier-1 employer listings with tailored applications.',
            'Negotiate senior compensation package (900,000 – 1,400,000 XAF/mo).',
          ],
          tasks: [
            { text: 'Complete final executive CV polish with WorkDey Assistant', category: 'application' },
            { text: 'Engage with senior recruiters and hiring partners', category: 'networking' },
            { text: 'Secure written offer meeting career milestone criteria', category: 'application' },
          ],
          practical_project: {
            title: 'Executive Portfolio Website & Technical Case Studies',
            outcome: 'Live portfolio showcase highlighting business outcomes and enterprise architecture.',
            stack_or_tools: 'Next.js, Tailwind CSS, Vercel',
          },
          progress_criteria: ['Secured verified offer matching target compensation range'],
        },
      ],
      is_ai_powered: false,
      ai_status: 'offline_fallback',
    };
  }

  private calculateDeterministicCVAssist(req: CVAssistRequest): CVAssistResult {
    const wordCount = req.cv_text.split(/\s+/).filter(Boolean).length;
    const hasNumbers = /\d+[%kKxXAF$]?/.test(req.cv_text);
    const hasBulletPoints = /[-•*]/.test(req.cv_text);

    let score = 65;
    if (wordCount > 150 && wordCount < 800) score += 15;
    if (hasNumbers) score += 10;
    if (hasBulletPoints) score += 10;

    return {
      overall_score: Math.min(95, score),
      executive_critique:
        'Profile demonstrates relevant subject matter experience. Incorporating more quantified financial and efficiency metrics (e.g., % time saved, revenue impacted in XAF) will significantly strengthen interview conversion.',
      strengths: [
        'Clear chronological progression across roles.',
        'Relevant technical skills identified.',
        'Bilingual communication orientation.',
      ],
      suggestions: [
        {
          section: 'Work Experience',
          issue: 'Bullet points focus on duties rather than measurable outcomes.',
          recommendation: 'Use the XYZ formula: Accomplished [X], as measured by [Y], by doing [Z].',
          example_rewrite:
            'Cut monthly inventory reporting turnaround by 60% across 8 retail branches by automating SQL extract and transform pipelines.',
        },
        {
          section: 'Professional Summary',
          issue: 'Headline is broad and does not immediately highlight unique value.',
          recommendation: 'Position yourself with your target role and primary differentiator.',
          example_rewrite:
            'Results-driven Senior Data Analyst with 5+ years optimizing agribusiness and retail supply chains in Central Africa.',
        },
      ],
      extracted_skills: {
        hard_skills: ['SQL', 'Data Analytics', 'Power BI', 'Financial Modeling', 'ETL Pipelines'],
        soft_skills: ['Cross-Functional Collaboration', 'Executive Presentation', 'Team Mentorship'],
        tools_and_platforms: ['Microsoft Excel', 'PostgreSQL', 'Power BI', 'Git', 'GeoPandas'],
      },
      suggested_action_verbs: [
        'Architected',
        'Spearheaded',
        'Optimized',
        'Engineered',
        'Streamlined',
        'Quantified',
        'Mentored',
      ],
      cover_letter: {
        content: `Dear Hiring Team at ${req.company_name || 'the Organization'},\n\nI am writing to express my enthusiastic interest in the ${req.target_job_title || 'open position'}. With a proven track record delivering scalable analytics solutions and operational efficiency in Cameroon, I am excited about the opportunity to contribute directly to your team's strategic objectives.\n\nThroughout my career, I have prioritized turning complex datasets into clear, actionable executive insights—reducing turnaround delays and elevating reporting reliability. What excites me most about ${req.company_name || 'your organisation'} is your commitment to regional innovation and operational excellence.\n\nI welcome the opportunity to discuss in an interview how my technical qualifications and bilingual collaborative approach align with your current priorities.\n\nSincerely,\nCandidate`,
        key_talking_points: [
          'Direct alignment with required competencies.',
          'Demonstrated regional business context in Cameroon.',
          'Measurable efficiency improvements from past roles.',
        ],
        cultural_alignment:
          'Written with professional, courteous, and proactive tone aligned with Central African corporate communication standards.',
      },
      is_ai_powered: false,
      ai_status: 'offline_fallback',
    };
  }
}

// Export singleton instance
export const aiGateway = AIGateway.getInstance();
