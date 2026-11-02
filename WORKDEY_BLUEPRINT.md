# WORKDEY — Comprehensive Implementation Blueprint & Architectural Specification

**Product Vision:** *WorkDey — Talent, found. Careers, built.*  
**Initial Market Focus:** Cameroon (Douala, Yaoundé, Buea, Limbe, Bamenda, Bafoussam, Garoua, Kribi; bilingual EN/FR; XAF currency), designed with international and remote scalability.  
**Document Purpose:** Serves as the authoritative, persistent technical and architectural reference for all development phases of WorkDey.

---

## 1. Product Understanding & Ecosystem

WorkDey is a three-sided, AI-powered career development, job discovery, and recruitment platform built upon four foundational pillars:

1. **Talents (Job Seekers & Professionals):**
   - **Discover & Apply:** Transparent search across Cameroonian cities and remote roles with upfront monthly salary ranges in XAF.
   - **Explainable Matching:** Clear match scores (0–100%) broken into Skills, Experience, and Location fit, accompanied by plain-language reasons and identified gaps.
   - **AI Career Coach:** Context-aware coaching for interview preparation, mock sessions, CV optimization, and career progression with granular privacy controls.
   - **Actionable Roadmap:** 12-month goal tracking from current role to target position with micro-skills milestones and progress tracking.
   - **Application Tracking:** Real-time visibility into application lifecycle stages (Applied → In Review / Screening → Shortlisted → Interview → Offer).

2. **Employers (Organisations, Recruiters & Hiring Teams):**
   - **Structured Job Posting:** Fast job creation wizard with AI draft assistance, required skills tagging, work style (On-site, Hybrid, Remote), and mandatory salary disclosure.
   - **Verified Employer Status:** Rigorous business registration verification building trust and eliminating employment scams.
   - **Intelligent ATS Pipeline:** Kanban and list views with ranked candidates, match breakdowns, team collaboration notes, interview scheduling, and stage transitions.
   - **Recruitment Analytics:** Funnel analytics (Applied → Reviewed → Shortlisted → Interview → Offer → Hired), time-to-hire metrics, candidate sources, and drop-off rates.
   - **Team Management:** Scoped role-based team access (Owner, Admin, Recruiter, Hiring Manager, Viewer).

3. **Platform Administrators (Governance, Trust & Operations):**
   - **Dense, High-Throughput Console:** Dark theme by default for long operational sessions with instant interactions.
   - **Organisation Verification Queue:** Document validation, business registry verification, domain checks, and audit-logged decisions.
   - **Job Moderation & Scam Prevention:** Real-time queue for flagged jobs (fees requested, unrealistic pay, discriminatory wording) and user reports.
   - **AI Governance & Safeguards:** Match score weighting adjustment (Skills vs Experience vs Location), AI service health telemetry, and strict human-in-the-loop guardrails.
   - **Audit Log & Subscriptions:** Immutable audit trail of every administrative action, plus tier management (Starter, Growth, Enterprise).

---

## 2. Summary of Design PDF & Critical Design Rules

The authoritative 53-page WorkDey Design Specification establishes a meticulous, high-trust visual grammar:

### 2.1 Brand Principles & Philosophy
1. **Calm over clever:** One primary accent per workspace. Color signals functional meaning and workspace identity, never arbitrary mood.
2. **Data is the decoration:** Dense, readable information hierarchy. Clean progress rails, circular score meters, and structured tables carry visual interest rather than generic decorative graphics.
3. **Evidence before hype:** Real transparency. No vanity numbers or fake testimonials. Match scores always explain their logic ("Guidance that shows its work").
4. **Local roots, global grammar:** XAF currency formatted clearly (e.g., `650,000 – 900,000 XAF / month`), Cameroonian regions/cities alongside remote badges, bilingual English/French parity.

### 2.2 Color System & Workspace Accents
- **Neutral Palette:**
  - Ink: `#0B1C2F` (Primary text & deep brand elements)
  - Slate: `#3D4A5C` (Secondary text, subtitles)
  - Muted: `#5A6779` (Microcopy, hints, inactive states)
  - Line: `#E2E7EE` (Borders, card strokes, dividers)
  - Canvas: `#F4F6F9` (Page background for public, talent & employer)
  - Surface: `#FFFFFF` (Cards, dialogs, dropdowns)
- **Workspace Accents (One Per Workspace):**
  - **Talent Workspace:** Teal 600 (`#0B7F7A`), Teal 500 (`#14A89E`), Teal 50 (`#E6F5F3`) — warm, encouraging.
  - **Employer Workspace:** Blue 600 (`#2552C2`), Blue 50 (`#EAF0FC`) — precise, efficient.
  - **Admin Workspace:** Graphite (`#1D2430`), Amber (`#E8A317`), Dark Surface (`#111D2C`), Dark Line (`#223247`), Dark Text (`#E7ECF3`) — dense, controlled, dark-mode by default.
- **Semantic State Colors:**
  - Success: `#1A7F4B` (Verified badges, strong matches, offers)
  - Danger / Destructive: `#B42318` (Rejections, suspensions, warnings)
  - Amber / Warning: `#E8A317` (Awaiting review, high-priority flags, admin accent)

### 2.3 Typography & Metrics
- **Display & Headings:** `Bricolage Grotesque` (48/52 Display, 28/34 H1, 18/26 H2).
- **Interface & Body:** `Hanken Grotesk` (14/22 standard dense body text, 12/16 caption/small caps labels).
- **Data & Numbers:** Tabular figures (`tnum`) for salary, percentages, dates, and scores to prevent layout jitter.
- **Small Caps Navigation:** Navigation group labels rendered in uppercase small caps (`FIND WORK`, `GROW`, `HIRING`, `OPERATE`, `GOVERNANCE`) with no nested hierarchies.

### 2.4 Geometry, Spacing & Depth
- **Border Radii:** `8px` for controls (buttons, inputs), `10px` for cards, `9999px` strictly for status pill badges only.
- **Spacing Scale:** Predictable 4, 8, 12, 16, 24, 32, 48 px rhythmic hierarchy.
- **Elevation System:**
  - `e0`: Flat (table rows, inputs)
  - `e1`: Resting cards
  - `e2`: Raised / hover
  - `e3`: Floating panels
  - `e4`: Modals, dropdown menus
- **Material Rules (Glass vs Solid):**
  - **Glass is strictly reserved for floating layers:** Sticky header bar, dropdowns, mega-menus, notification popovers, floating hero preview cards.
  - **Solid Surfaces for Data:** Job listings, candidate review cards, ATS tables, form fields, and audit logs must remain crisp and SOLID without blur.
  - **Admin Console:** Blur is completely disabled in Admin to maximize performance and visual clarity; uses solid dark navy surfaces with a 1px 8% white top edge highlight.

### 2.5 Motion System & Three Intensities
- **Tokens:** Instant (100ms), Fast (150ms), Base (220ms), Slow (360ms), Hero (640ms). Exits run at 70% duration of entrances. No animations longer than 800ms.
- **Three Intensities:**
  - *Expressive (Public/Landing):* 640ms staggered hero entrance (24px rise), gentle 5px/7s float on hero preview card, scroll-linked reveals.
  - *Restrained (Talent/Employer):* 320ms section entrance (8px rise, 40ms stagger), single 600ms scaleX progress fill, card hover elevation only.
  - *Instant (Admin):* 180ms opacity-only transitions, 120ms hover states, 0px spatial travel, 0ms stagger.
- **Strict Motion Discipline:** Only `transform` and `opacity` are animated. `prefers-reduced-motion` immediately disables travel and parallax, reducing transitions to instant or simple 150ms fades.

---

## 3. Existing Project Inspection & Technical Baseline

| Attribute | Current Status | Notes & Verification |
|---|---|---|
| **Framework** | Next.js 15.4.9 (App Router) | React 19.2.1, TypeScript 5.9.3 |
| **Tailwind CSS** | Tailwind CSS v4 (`@tailwindcss/postcss` 4.1.11) | Configured in `postcss.config.mjs` & `app/globals.css` |
| **Animation** | `motion` 12.23.24 | Configured in `next.config.ts` transpilePackages |
| **Icons** | `lucide-react` 0.553.0 | Installed and available |
| **AI SDK** | `@google/genai` 2.4.0 | Official Gemini SDK available for server-side AI |
| **Form Management** | `@hookform/resolvers` 5.2.1, `clsx`, `tailwind-merge` | Form utilities and class mergers ready |
| **Supabase Client** | **NOT INSTALLED** | `@supabase/supabase-js` and `@supabase/ssr` are currently missing from `package.json` |
| **Environment Config** | Only `GEMINI_API_KEY` & `APP_URL` in `.env.example` | No Supabase URL, anon key, or service role key present |
| **Existing Pages** | Only `app/layout.tsx` exists | `app/page.tsx` does NOT exist yet (needs initial implementation) |
| **Design PDF** | `/public/assets/aistudio/WorkDey_Design_fbbd9121.pdf` | Fully inspected and verified |

---

## 4. Proposed Application Architecture

```
├── app/
│   ├── (public)/                      # Public marketing & discovery routes
│   │   ├── page.tsx                   # Master Landing Page (Hero, Value Props, Steps, Workspaces)
│   │   ├── jobs/
│   │   │   ├── page.tsx               # Public Job Search & Filter (Douala, Yaoundé, etc.)
│   │   │   └── [id]/page.tsx          # Public Job Detail with Match Preview
│   │   ├── companies/[id]/page.tsx    # Employer Profile & Verified Showcase
│   │   ├── how-it-works/page.tsx      # Explainable Matching & Transparency Manifesto
│   │   ├── about/page.tsx             # WorkDey Mission & Cameroon Roots
│   │   └── auth/
│   │       ├── sign-in/page.tsx       # Unified Sign In
│   │       └── sign-up/page.tsx       # 3-step Role Selection & Onboarding
│   ├── (talent)/talent/               # Talent Workspace (Accent: Teal #0B7F7A)
│   │   ├── layout.tsx                 # Talent Sidebar, ⌘K, Topbar, Mobile Tabs
│   │   ├── dashboard/page.tsx         # Weekly summary, match alerts, interview card, roadmap widget
│   │   ├── jobs/                      # Discover jobs, Saved jobs
│   │   ├── applications/              # Application tracker with stage timeline
│   │   ├── coach/                     # Multi-turn AI Career Coach with privacy toggles
│   │   ├── roadmap/                   # 12-month career milestone & skill assessment tree
│   │   ├── profile/                   # Profile strength meter, CV upload, skills editor
│   │   ├── notifications/             # Activity feeds & alerts
│   │   └── settings/                  # Account, language (EN/FR), currency, privacy controls
│   ├── (employer)/employer/           # Employer Workspace (Accent: Blue #2552C2)
│   │   ├── layout.tsx                 # Employer Sidebar, Org Badge, ⌘K, Mobile Tabs
│   │   ├── dashboard/page.tsx         # Hiring overview, weekly applications chart, active jobs
│   │   ├── jobs/                      # Job postings list, 3-step Create Role Wizard
│   │   ├── applicants/                # Ranked applicants table with match breakdowns
│   │   ├── pipeline/                  # Kanban & stage list (Applied, Screened, Shortlisted, Interview, Offer)
│   │   ├── interviews/                # Interview schedule, notes, calendar
│   │   ├── analytics/                 # Recruitment funnel, drop-off rates, time-to-hire
│   │   ├── team/                      # Organisation member invitations & role management
│   │   ├── profile/                   # Organisation verification status, docs, company branding
│   │   └── settings/                  # Org preferences & billing plans
│   ├── (admin)/admin/                 # Platform Administration Console (Dark theme #111D2C, Accent: Amber #E8A317)
│   │   ├── layout.tsx                 # Admin Sidebar, Instant transitions, Status indicator
│   │   ├── overview/page.tsx          # Platform metrics, AI health status, urgent queues
│   │   ├── verification/page.tsx      # Employer doc verification queue with audit modal
│   │   ├── moderation/page.tsx        # Scam detection, flagged job queue, user reports
│   │   ├── users/page.tsx             # Unified user directory, account suspension
│   │   ├── ai-management/page.tsx     # Match weighting sliders, safeguard toggles, model monitoring
│   │   ├── subscriptions/page.tsx     # Starter, Growth, Enterprise plans & org billing
│   │   ├── governance/page.tsx        # Platform admins, permission matrix, immutable audit log
│   │   └── settings/page.tsx          # Global safety settings, maintenance mode
│   ├── api/
│   │   ├── ai/
│   │   │   ├── match/route.ts         # Match scoring & explainability calculation
│   │   │   ├── coach/route.ts         # Career coaching multi-turn chat
│   │   │   ├── parse-cv/route.ts      # Structured CV parser from text/document
│   │   │   └── draft-job/route.ts     # Employer job description drafting assistant
│   │   └── export/
│   │       ├── cv-print/route.ts      # Clean A4 print template generator
│   │       └── candidate-pack/route.ts # Hiring team interview summary pack
│   ├── globals.css                    # Tailwind v4, custom utility classes, font variables
│   └── layout.tsx                     # Root Layout (Google Fonts: Bricolage & Hanken Grotesk)
├── components/
│   ├── common/                        # Brand mark, workspace switcher, ⌘K search dialog, toast
│   ├── layout/                        # PublicHeader, MegaMenu, WorkspaceSidebar, MobileTabs, AppFooter
│   ├── ui/                            # Buttons (with 3px arrow nudge), Inputs, Badges, Modals
│   ├── talent/                        # MatchScoreRing, RoadmapMilestone, CoachChatPanel
│   ├── employer/                      # PipelineCard, ApplicantRow, JobWizardStep
│   └── admin/                         # AuditLogRow, VerificationCard, ModerationSignalBadge
├── lib/
│   ├── ai/                            # Provider-independent AI abstraction interface & Gemini adapter
│   ├── data/                          # Seed datasets (Cameroon cities, initial jobs, talent profiles, orgs)
│   ├── db/                            # Database client abstraction (Supabase client + local fallback store)
│   ├── types/                         # TypeScript interfaces for all product domains
│   └── utils.ts                       # Currency formatters, date formatters, cn helper
```

---

## 5. Proposed Database Domains & Relationships

To support WorkDey's unified user model, dual permission architecture, and three workspaces, the relational PostgreSQL database schema comprises seven distinct domains:

```
[ auth.users ]
       │ 1:1
[ public.users ] ───────────────┬───────────────────────────┐
       │ 1:1                    │ 1:N                       │ 1:N
[ talent_profiles ]    [ organization_members ]    [ platform_roles ]
       │ 1:N                    │ N:1                       │ (Owner, Super Admin,
       ├── [ profile_skills ]   [ organizations ]            │  Admin, Mod, Support)
       ├── [ work_experiences ]        │ 1:N                │
       ├── [ education_records ]       ├── [ jobs ]         │
       └── [ portfolio_items ]         │      │ 1:N         │
                                       │   [ applications ] │
                                       │      │ 1:N         │
                                       │   [ application_notes ]
                                       │   [ interviews ]   │
                                       │                    │
[ audit_logs ] ◄───────────────────────┴────────────────────┘
```

### Table Definitions & Key Attributes

1. **Identity & Platform Roles:**
   - `users`: `id (uuid, PK)`, `email`, `full_name`, `avatar_url`, `language_pref (en|fr)`, `created_at`, `is_active`.
   - `platform_roles`: `id`, `user_id (FK)`, `role (owner | super_admin | admin | moderator | support)`, `granted_by`, `created_at`.

2. **Talent Domain:**
   - `talent_profiles`: `id`, `user_id (FK, unique)`, `headline`, `bio`, `city`, `region`, `work_style_pref`, `expected_salary_min`, `expected_salary_max`, `currency (XAF)`, `profile_strength (0-100)`, `cv_file_url`, `cv_updated_at`, `share_cv_with_employers (bool)`, `allow_ai_profile_matching (bool)`.
   - `profile_skills`: `id`, `profile_id (FK)`, `skill_name`, `years_experience`, `verified_score`.
   - `work_experiences`: `id`, `profile_id (FK)`, `job_title`, `company_name`, `city`, `start_date`, `end_date`, `is_current`, `description_bullets`.
   - `career_roadmaps`: `id`, `user_id (FK)`, `current_role`, `target_role`, `estimated_months (e.g. 12)`, `overall_progress_pct`.
   - `roadmap_milestones`: `id`, `roadmap_id (FK)`, `stage_index`, `title`, `duration_range`, `description`, `status (completed | in_progress | pending)`.

3. **Organisation & Recruitment Domain:**
   - `organizations`: `id`, `name`, `slug`, `logo_url`, `tagline`, `website`, `sector`, `company_size`, `city`, `region`, `verification_status (pending | verified | rejected)`, `verification_doc_url`, `verified_at`, `verified_by`.
   - `organization_members`: `id`, `organization_id (FK)`, `user_id (FK)`, `role (owner | admin | recruiter | hiring_manager | viewer)`, `invited_at`, `accepted_at`.
   - `jobs`: `id`, `organization_id (FK)`, `title`, `city`, `region`, `work_style (onsite | hybrid | remote)`, `contract_type (full_time | contract | internship)`, `salary_min_xaf`, `salary_max_xaf`, `experience_level (entry | mid | senior | lead)`, `description`, `required_skills (text[])`, `languages (text[])`, `status (draft | pending_moderation | open | closing_soon | closed)`, `moderation_flag`, `published_at`, `deadline`.
   - `applications`: `id`, `job_id (FK)`, `talent_id (FK)`, `stage (applied | screening | shortlisted | interview | offer | hired | rejected)`, `match_score (0-100)`, `match_skills_score`, `match_experience_score`, `match_location_score`, `match_reasons (text[])`, `match_gaps (text[])`, `answers_json`, `created_at`, `updated_at`.
   - `interviews`: `id`, `application_id (FK)`, `scheduled_at`, `duration_minutes`, `format (video | onsite)`, `meeting_url_or_room`, `interviewer_names (text[])`, `status (scheduled | completed | cancelled)`.
   - `application_notes`: `id`, `application_id (FK)`, `author_id (FK)`, `content`, `created_at`.

4. **Safety, Moderation & Audit:**
   - `moderation_reports`: `id`, `target_type (job | profile | organization)`, `target_id`, `reported_by (FK)`, `reason`, `flag_type (fees_requested | discriminatory | unrealistic_pay | scam | duplicate)`, `priority (low | medium | high)`, `status (open | reviewed | resolved | dismissed)`, `ai_suggestion`, `created_at`.
   - `audit_logs`: `id`, `actor_id (FK)`, `action`, `target_type`, `target_id`, `metadata (jsonb)`, `ip_address`, `created_at`. Immutable.

---

## 6. Authentication & Permission Strategy

### 6.1 Unified Identity with Workspace Context
WorkDey utilizes **one unified user identity**:
- A single email/password or OAuth account signs in once.
- The user can seamlessly toggle between workspaces using the header/sidebar **Workspace Switcher**:
  - `Personal (Talent Workspace)`: Always accessible to the user.
  - `Employer Workspaces`: Accessible if the user is an active member of one or more organisations.
  - `Admin Console`: Accessible **only** if the user holds an active record in `platform_roles`.

### 6.2 Strict Isolation of Dual Permission Systems
- **System A — Platform Governance:**
  - Roles: `Owner` > `Super Admin` > `Admin` > `Moderator` > `Support`.
  - Scoped to global platform operations: verifying organisations, moderating jobs, adjusting AI thresholds, reviewing audit logs.
  - **Critical Rule:** Platform roles grant ZERO automated access to an employer organisation's internal applicant notes, interview links, or private billing unless explicitly invited to that organisation.
- **System B — Organisation Membership:**
  - Roles: `Org Owner` > `Org Admin` > `Recruiter` > `Hiring Manager` > `Viewer`.
  - Strictly scoped to the specific `organization_id`.
  - **Critical Rule:** Being an Organisation Owner never conveys any platform moderation or admin console authority.

### 6.3 Row Level Security (RLS) Rules Blueprint
- Talents can only view and mutate their own profile, applications, saved jobs, and roadmap.
- Organisation members can only view applicants and jobs belonging to their specific `organization_id`.
- Recruiters can create jobs, move applicant stages, and schedule interviews; Viewers have read-only access.
- Only verified organisations (`verification_status = 'verified'`) can transition jobs to `open`.
- Platform admins can view moderation queues, verification queues, and audit logs based on their specific platform role capability.

---

## 7. AI Integration Architecture

### 7.1 Provider-Independent Layer (`lib/ai/`)
To ensure enterprise flexibility and zero vendor lock-in, all AI interactions are routed through a provider-neutral interface:
```typescript
export interface IAIEngine {
  calculateMatch(candidate: CandidateProfile, job: JobListing): Promise<MatchResult>;
  chatWithCoach(session: CoachSession, message: string): Promise<CoachResponse>;
  parseCV(rawTextOrBuffer: string | Buffer): Promise<ParsedCVResult>;
  draftJobListing(brief: JobBrief): Promise<StructuredJobDraft>;
}
```

### 7.2 Core AI Capabilities & Behavioral Specs
1. **Explainable Job Matching Engine:**
   - Calculates a deterministic + semantic composite score (0–100%).
   - Weighted breakdown: Skills (45%), Experience (30%), Location & Work Style (25%) — configurable by platform admins.
   - Generates transparent, human-readable bullet points:
     - *Why it matches:* Exact skills overlapping (e.g. "SQL, Power BI and forecasting line up with this role").
     - *Identified gap:* Non-punitive learning recommendation (e.g. "Possible gap: no listed experience with SQL window functions. A two-hour module is in your roadmap.").
   - **Absolute Rule:** AI is strictly advisory. AI never automatically rejects a candidate. Recruiters review every shortlist; people make the final decision.
2. **AI Career Coach:**
   - Multi-turn conversational mentor configured for Cameroon and regional job market realities.
   - Grounded in the talent's CV, assessments, and saved target roles.
   - Structured action chips: "Start mock interview", "Open SQL practice", "Draft intro answer".
   - Non-blocking: replies appear in whole sentences fading in over 220ms (no distracting typewriter jitter).
   - Strict privacy toggles: "Use my CV and profile", "Remember past chats", "Share insights with employers (off by default)".
3. **Structured CV Parser:**
   - Ingests uploaded CV documents or raw text and extracts structured JSON: summary, categorized skills, previous roles with dates, education, and language proficiencies (English/French).
   - Includes graceful fallback parsing if OCR or AI latency exceeds thresholds.
4. **Employer Job Drafting & Scam Pre-Screening:**
   - Turns bullet-point requirements into polished, inclusive job posts with structured experience and salary fields.
   - Automatically pre-screens new listings for illegal/scam signals (e.g., asking registration fees from applicants, discriminatory age/gender language, unrealistic wage promises).

---

## 8. Proposed Implementation Order

To deliver WorkDey systematically without regression:

- **Phase 1: Design Tokens, Typography & Layout Shells**
  - Install font definitions (`Bricolage Grotesque` & `Hanken Grotesk`).
  - Configure Tailwind design tokens (Ink, Slate, Muted, Canvas, Line, Workspace Accents Teal/Blue/Amber).
  - Implement reusable UI primitives (Buttons with 3px arrow shift, Inputs with 3px focus ring, Tabular Badges).
  - Build navigation primitives: Public Header with Mega-Menu & Announcement bar, Workspace Sidebar with Small-Caps labels, Mobile 5-Tab Bar, and ⌘K search bar.

- **Phase 2: Public Landing Page & Job Discovery**
  - Master Landing Page (`/`): Hero with layered interactive preview card, "How it works in 3 clear steps", dual-workspace split, Cameroonian city filters, bilingual selector.
  - Job Search Page (`/jobs`): Search by title/skill, location filters (Douala, Yaoundé, Buea, Limbe, Remote), salary slider in XAF, interactive job detail modal/page.
  - Company Profile Showcase (`/companies/[id]`): Verified badge, company details, active role list.
  - Public Legal & Explanatory Pages: About, How Matching Works, Terms, Privacy.

- **Phase 3: Auth & Unified Workspace Switcher**
  - 3-step Role Selection & Onboarding flow (`/auth/sign-up`).
  - Unified Sign-In (`/auth/sign-in`).
  - Account menu and workspace switcher allowing seamless jumping between Talent, Employer, and Admin views with contextual state preservation.

- **Phase 4: Talent Workspace**
  - Dashboard with weekly digest, interview reminder card, profile strength progress ring, and recommended jobs.
  - Interactive Applications tracker with visual 4-stage pipeline.
  - Interactive AI Career Coach chat with mock interview prompt flows and privacy controls.
  - 12-Month Career Roadmap with skill-gap visualization and progress tracking.
  - Talent Profile & CV management with print-ready A4 export.

- **Phase 5: Employer Workspace & ATS Pipeline**
  - Hiring overview dashboard with weekly application charts and pipeline snapshot.
  - 3-step Job Creation Wizard with AI Drafting Assist and live preview card.
  - Full ATS Candidate Pipeline: Multi-column Kanban board with candidate cards, match percentages, quick-stage moves, and detailed applicant review sheet.
  - Interview scheduling and collaborative team notes.
  - Organisation Profile & Document Verification submission.

- **Phase 6: Platform Administration Console**
  - Instant dark-theme console layout (`#111D2C`).
  - Organisation Verification Queue with document preview, verification checks, and approve/reject actions.
  - Job Moderation & Report Queue with scam signal detection and AI recommendation chips.
  - User Directory with status management (Active, Unverified, Suspended).
  - AI Management Console with match score weighting sliders and safeguard toggles.
  - Immutable Audit Log viewer with time, admin, action, and target parameters.

- **Phase 7: AI Service Integration & Edge States**
  - Server-side Gemini API endpoints for match explanation, career coaching, and job drafting.
  - Edge cases, loading skeletons (matching final layout, opacity pulse only), error states with retry, and offline banners.

---

## 9. Missing Credentials & Dependencies Assessment

1. **Supabase Integration:**
   - Neither `@supabase/supabase-js` nor `@supabase/ssr` is currently installed in `package.json`.
   - `.env.example` does not contain `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, or `SUPABASE_SERVICE_ROLE_KEY`.
   - **Recommended Approach:**
     - Architect a robust Dual-Mode Data Access Layer:
       - When Supabase credentials are provided in `.env`, connect directly to PostgreSQL with RLS.
       - In the interim (or during demo/preview), utilize a rich, reactive local state store pre-seeded with realistic Cameroonian market data (Savanna Agritech, Orbit Telecom, Lumen Health, Bonamoussadi Digital; Douala, Yaoundé; XAF salaries; Aïcha Nkeng talent profile; Nadine O. platform admin) so that all 3 workspaces and all user journeys work end-to-end immediately without crashing or blocking.
2. **Typography Configuration:**
   - `Bricolage Grotesque` and `Hanken Grotesk` must be loaded via `next/font/google` in `app/layout.tsx` to match the design PDF specification.
3. **AI Credentials:**
   - `GEMINI_API_KEY` is supported by the AI Studio environment and will power the server-side AI endpoints via `@google/genai`.

---

## 10. Key Decisions, Constraints & Risk Mitigation

| Area | Challenge / Constraint | Strategic Decision & Mitigation |
|---|---|---|
| **Bilingual Parity (EN/FR)** | French copy expands by 20–30% compared to English, risking button or layout clipping. | Buttons will use content-driven sizing with a minimum 44px height (never fixed width). Text labels will wrap or truncate with ellipsis on list cards and provide full text in detail views. |
| **Workspace Visual Distinction** | Three distinct workspaces must feel cohesive yet instantly recognizable. | Maintain shared typography, radii (8px/10px), and elevation, but assign dedicated workspace accents: Teal for Talent, Blue for Employer, and Dark Navy + Amber for Admin. |
| **AI Reliability & Hallucinations** | Candidate match scoring must be transparent, objective, and legally defensible. | AI recommendations are strictly advisory and itemized. Grounding is strictly constrained to candidate profile data and job criteria. Rejections require human approval. |
| **Mobile Adaptability** | Desktop sidebar and multi-column Kanban boards must be usable on mobile. | As specified in PDF page 29: Desktop sidebars become 5-item bottom tab bars (`Home`, `Jobs`, `Pipeline/Apps`, `Coach/Interviews`, `Profile/More`); multi-column Kanban switches to stage swipe chips on mobile. |
| **Offline Resilience** | Intermittent mobile network connectivity in the Central African region. | Display non-blocking top offline alert banner ("You are offline. Showing what was saved at [time]. Anything you send will go out when you are back online."); preserve form drafts locally. |
