'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Organization,
  OrganizationMember,
  JobListing,
  Application,
  Interview,
  OrgRole,
  ApplicationStage,
  UserProfile,
} from '@/lib/types/database';
import {
  SEED_ORGANIZATIONS,
  SEED_MEMBERSHIPS,
  SEED_JOBS,
  SEED_APPLICATIONS,
  SEED_INTERVIEWS,
  SEED_USERS,
  SEED_TALENT_PROFILES,
} from '@/lib/data/seed-data';

export interface EmployerApplicant extends Application {
  talent_name: string;
  talent_city: string;
  talent_headline: string;
  talent_experience_years: number;
  talent_skills: string[];
  cv_url?: string;
  internal_notes: {
    id: string;
    author_name: string;
    text: string;
    created_at: string;
  }[];
}

export interface TeamMemberWithProfile extends OrganizationMember {
  user_name: string;
  user_email: string;
  user_title: string;
  initials: string;
  status: 'active' | 'invited';
}

interface EmployerContextType {
  // Organizations
  userOrgs: (Organization & { role: OrgRole })[];
  activeOrg: (Organization & { role: OrgRole }) | null;
  switchOrganization: (orgId: string) => void;
  createOrganization: (data: {
    name: string;
    slug?: string;
    sector: string;
    company_size: string;
    city: string;
    region: string;
    website?: string;
    tagline?: string;
    about?: string;
  }) => { success: boolean; org?: Organization; error?: string };
  updateOrganizationProfile: (orgId: string, updates: Partial<Organization>) => void;
  submitVerificationDoc: (orgId: string, docUrl: string, docFilename: string) => void;

  // Team
  teamMembers: TeamMemberWithProfile[];
  inviteTeamMember: (email: string, role: OrgRole, title?: string) => { success: boolean; error?: string };
  updateMemberRole: (memberId: string, newRole: OrgRole) => { success: boolean; error?: string };
  removeMember: (memberId: string) => { success: boolean; error?: string };
  canManageTeam: boolean;

  // Jobs
  orgJobs: JobListing[];
  createJob: (jobData: {
    title: string;
    category_name: string;
    city: string;
    region: string;
    work_style: 'onsite' | 'hybrid' | 'remote';
    contract_type: 'full_time' | 'part_time' | 'contract' | 'internship';
    salary_min_xaf: number;
    salary_max_xaf: number;
    experience_level: string;
    description: string;
    requirements_summary?: string;
    required_skills: string[];
    languages: string[];
    deadline?: string;
    status: 'draft' | 'open';
  }) => JobListing;
  updateJob: (jobId: string, updates: Partial<JobListing>) => void;
  toggleJobStatus: (jobId: string, newStatus: JobListing['status']) => void;
  deleteJob: (jobId: string) => void;

  // Applicants & Pipeline
  applicants: EmployerApplicant[];
  updateApplicantStage: (applicationId: string, stage: ApplicationStage) => void;
  addApplicantNote: (applicationId: string, noteText: string) => void;

  // Interviews
  interviews: Interview[];
  scheduleInterview: (interviewData: {
    application_id: string;
    scheduled_at: string;
    duration_minutes: number;
    format: 'video' | 'onsite' | 'phone';
    meeting_link_or_location: string;
    interviewer_names: string[];
    panel_notes?: string;
  }) => Interview;

  // Metrics (computed dynamically from actual data, not hardcoded)
  metrics: {
    openRoles: number;
    totalApplicants: number;
    newApplicantsCount: number;
    awaitingReviewCount: number;
    shortlistedCount: number;
    interviewsScheduled: number;
    offersCount: number;
  };
}

const EmployerContext = createContext<EmployerContextType | undefined>(undefined);

// Initial enriched applicants for Savanna Agritech
const INITIAL_APPLICANTS: EmployerApplicant[] = [
  {
    id: 'app-aicha-savanna',
    job_id: 'job-senior-data-analyst',
    talent_id: 'talent-aicha',
    stage: 'interview',
    match_score: 92,
    match_skills_score: 95,
    match_experience_score: 90,
    match_location_score: 90,
    match_reasons: [
      'Strong match in SQL (6 yrs) and Power BI dashboards',
      'Direct domain background in Cameroon agribusiness reporting',
      'Bilingual French/English professional',
    ],
    match_gaps: ['Yield prediction ML models portfolio link'],
    applied_at: '2026-10-28T14:00:00Z',
    talent_name: 'Aïcha Nkeng',
    talent_city: 'Douala',
    talent_headline: 'Senior Data Analyst with 6 years experience in agribusiness reporting',
    talent_experience_years: 6,
    talent_skills: ['SQL', 'Power BI', 'Python', 'ETL Pipelines', 'GeoPandas'],
    cv_url: '/assets/cvs/Aicha_Nkeng_CV.pdf',
    internal_notes: [
      {
        id: 'note-1',
        author_name: 'Jean-Eric Tamfu',
        text: 'Strong portfolio presentation. Fits technical lead requirements cleanly.',
        created_at: '2026-10-29T10:15:00Z',
      },
    ],
  },
  {
    id: 'app-ruth-savanna',
    job_id: 'job-senior-data-analyst',
    talent_id: 'talent-ruth',
    stage: 'shortlisted',
    match_score: 87,
    match_skills_score: 90,
    match_experience_score: 85,
    match_location_score: 85,
    match_reasons: ['5 years experience in database reporting', 'Proficient in SQL and Python'],
    match_gaps: ['Lives in Yaoundé; requires hybrid commute arrangement to Douala'],
    applied_at: '2026-10-27T11:00:00Z',
    talent_name: 'Ruth Fomum',
    talent_city: 'Yaoundé',
    talent_headline: 'Data Analyst & Reporting Specialist',
    talent_experience_years: 5,
    talent_skills: ['SQL', 'Python', 'Tableau', 'Excel DAX'],
    cv_url: '/assets/cvs/Ruth_Fomum_CV.pdf',
    internal_notes: [
      {
        id: 'note-2',
        author_name: 'Françoise Mbella',
        text: 'Discuss relocation allowance during interview.',
        created_at: '2026-10-28T09:00:00Z',
      },
    ],
  },
  {
    id: 'app-paul-savanna',
    job_id: 'job-senior-data-analyst',
    talent_id: 'talent-paul',
    stage: 'applied',
    match_score: 79,
    match_skills_score: 75,
    match_experience_score: 80,
    match_location_score: 90,
    match_reasons: ['Located in Douala', 'Hands-on reporting experience with Power BI'],
    match_gaps: ['3 years experience (role asks for 4+ years)'],
    applied_at: '2026-10-30T08:30:00Z',
    talent_name: 'Paul Etame',
    talent_city: 'Douala',
    talent_headline: 'Junior BI & Analytics Developer',
    talent_experience_years: 3,
    talent_skills: ['Power BI', 'SQL Basics', 'Excel Advanced'],
    internal_notes: [],
  },
  {
    id: 'app-yannick-savanna',
    job_id: 'job-senior-data-analyst',
    talent_id: 'talent-yannick',
    stage: 'under_review',
    match_score: 85,
    match_skills_score: 85,
    match_experience_score: 85,
    match_location_score: 90,
    match_reasons: ['7 years experience in corporate BI', 'Douala resident'],
    match_gaps: ['Salary expectation slightly above budget'],
    applied_at: '2026-10-29T16:00:00Z',
    talent_name: 'Yannick Tabi',
    talent_city: 'Douala',
    talent_headline: 'Senior Business Intelligence Analyst',
    talent_experience_years: 7,
    talent_skills: ['SQL', 'Tableau', 'PostgreSQL', 'Financial Modeling'],
    internal_notes: [],
  },
  {
    id: 'app-mireille-savanna',
    job_id: 'job-field-ops-lead',
    talent_id: 'talent-mireille',
    stage: 'applied',
    match_score: 64,
    match_skills_score: 60,
    match_experience_score: 70,
    match_location_score: 60,
    match_reasons: ['Agribusiness background', 'Operational management'],
    match_gaps: ['Remote candidate for on-site field role'],
    applied_at: '2026-10-26T12:00:00Z',
    talent_name: 'Mireille Atangana',
    talent_city: 'Remote',
    talent_headline: 'Field Operations Specialist',
    talent_experience_years: 6,
    talent_skills: ['Agribusiness Logistics', 'Field Operations', 'French/English'],
    internal_notes: [],
  },
  {
    id: 'app-brice-savanna',
    job_id: 'job-senior-data-analyst',
    talent_id: 'talent-brice',
    stage: 'interview',
    match_score: 86,
    match_skills_score: 88,
    match_experience_score: 85,
    match_location_score: 90,
    match_reasons: ['5 years experience with Python & SQL', 'Douala-based'],
    match_gaps: ['Limited agribusiness domain experience'],
    applied_at: '2026-10-25T14:20:00Z',
    talent_name: 'Brice Tchinda',
    talent_city: 'Douala',
    talent_headline: 'Data Engineer / Analyst',
    talent_experience_years: 5,
    talent_skills: ['SQL', 'Python', 'Spark', 'Airflow'],
    internal_notes: [
      {
        id: 'note-3',
        author_name: 'Jean-Eric Tamfu',
        text: 'Interview scheduled for today 14:00.',
        created_at: '2026-10-30T08:00:00Z',
      },
    ],
  },
];

const INITIAL_TEAM_MEMBERS: TeamMemberWithProfile[] = [
  {
    id: 'mem-1',
    organization_id: 'org-savanna',
    user_id: 'user-francoise',
    role: 'owner',
    invited_at: '2026-08-10T10:00:00Z',
    accepted_at: '2026-08-10T10:00:00Z',
    user_name: 'Françoise Mbella',
    user_email: 'francoise@savanna.example',
    user_title: 'HR Director & Co-Founder',
    initials: 'FM',
    status: 'active',
  },
  {
    id: 'mem-2',
    organization_id: 'org-savanna',
    user_id: 'user-tamfu',
    role: 'hiring_manager',
    invited_at: '2026-08-15T12:00:00Z',
    accepted_at: '2026-08-15T14:00:00Z',
    user_name: 'Jean-Eric Tamfu',
    user_email: 'jean-eric@savanna.example',
    user_title: 'Head of Analytics',
    initials: 'JE',
    status: 'active',
  },
  {
    id: 'mem-3',
    organization_id: 'org-savanna',
    user_id: 'user-sandrine',
    role: 'recruiter',
    invited_at: '2026-09-01T09:00:00Z',
    accepted_at: '2026-09-01T11:00:00Z',
    user_name: 'Sandrine Biya',
    user_email: 'sandrine@savanna.example',
    user_title: 'Talent Acquisition Partner',
    initials: 'SB',
    status: 'active',
  },
  {
    id: 'mem-4',
    organization_id: 'org-savanna',
    user_id: 'user-pierre-invite',
    role: 'viewer',
    invited_at: '2026-10-28T09:00:00Z',
    user_name: 'Pierre Ntamack',
    user_email: 'pierre.ntamack@savanna.example',
    user_title: 'Operations Director',
    initials: 'PN',
    status: 'invited',
  },
];

export function EmployerProvider({ children }: { children: React.ReactNode }) {
  const { user, organizations: authOrgs, activeOrganization: initialActiveOrg, setActiveOrganizationId } = useAuth();

  // All organizations known in the platform
  const [allOrgs, setAllOrgs] = useState<Organization[]>(SEED_ORGANIZATIONS);

  // Active organization id
  const [activeOrgId, setActiveOrgId] = useState<string>(
    initialActiveOrg?.id || SEED_ORGANIZATIONS[0].id
  );

  // Jobs, applicants, team, interviews
  const [jobs, setJobs] = useState<JobListing[]>(SEED_JOBS);
  const [applicants, setApplicants] = useState<EmployerApplicant[]>(INITIAL_APPLICANTS);
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithProfile[]>(INITIAL_TEAM_MEMBERS);
  const [interviews, setInterviews] = useState<Interview[]>(SEED_INTERVIEWS);

  // Derive active organisation with user role
  const activeOrg = useMemo(() => {
    const org = allOrgs.find((o) => o.id === activeOrgId) || allOrgs[0];
    const membership = teamMembers.find((m) => m.organization_id === org.id && m.user_id === user?.id);
    const role: OrgRole = membership ? membership.role : 'owner';
    return {
      ...org,
      role,
    };
  }, [allOrgs, activeOrgId, teamMembers, user]);

  // User orgs list
  const userOrgs = useMemo(() => {
    return allOrgs.map((org) => {
      const membership = teamMembers.find((m) => m.organization_id === org.id && m.user_id === user?.id);
      return {
        ...org,
        role: membership ? membership.role : ('owner' as OrgRole),
      };
    });
  }, [allOrgs, teamMembers, user]);

  const switchOrganization = useCallback(
    (orgId: string) => {
      setActiveOrgId(orgId);
      setActiveOrganizationId(orgId);
    },
    [setActiveOrganizationId]
  );

  // 1. Create Organization
  const createOrganization = useCallback(
    (data: {
      name: string;
      slug?: string;
      sector: string;
      company_size: string;
      city: string;
      region: string;
      website?: string;
      tagline?: string;
      about?: string;
    }) => {
      const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newOrg: Organization = {
        id: `org-${Date.now()}`,
        name: data.name,
        slug,
        sector: data.sector,
        company_size: data.company_size,
        city: data.city,
        region: data.region,
        country: 'Cameroon',
        website: data.website || null,
        tagline: data.tagline || null,
        about: data.about || null,
        verification_status: 'pending',
        created_at: new Date().toISOString(),
      };

      setAllOrgs((prev) => [...prev, newOrg]);

      // Add user as Owner of new organisation
      const newMembership: TeamMemberWithProfile = {
        id: `mem-${Date.now()}`,
        organization_id: newOrg.id,
        user_id: user?.id || 'user-francoise',
        role: 'owner',
        invited_at: new Date().toISOString(),
        accepted_at: new Date().toISOString(),
        user_name: user?.full_name || 'Françoise Mbella',
        user_email: user?.email || 'francoise@savanna.example',
        user_title: 'Founder & Owner',
        initials: (user?.full_name || 'FM').slice(0, 2).toUpperCase(),
        status: 'active',
      };
      setTeamMembers((prev) => [...prev, newMembership]);

      // Switch to new org
      setActiveOrgId(newOrg.id);
      setActiveOrganizationId(newOrg.id);

      return { success: true, org: newOrg };
    },
    [user, setActiveOrganizationId]
  );

  // 2. Update Organization Profile
  const updateOrganizationProfile = useCallback((orgId: string, updates: Partial<Organization>) => {
    setAllOrgs((prev) =>
      prev.map((o) => (o.id === orgId ? { ...o, ...updates } : o))
    );
  }, []);

  // 3. Submit Verification Document
  const submitVerificationDoc = useCallback((orgId: string, docUrl: string, docFilename: string) => {
    setAllOrgs((prev) =>
      prev.map((o) =>
        o.id === orgId
          ? {
              ...o,
              verification_doc_url: docUrl,
              verification_status: 'pending',
            }
          : o
      )
    );
  }, []);

  // 4. Team Management
  const canManageTeam = useMemo(() => {
    return activeOrg.role === 'owner' || activeOrg.role === 'admin';
  }, [activeOrg.role]);

  const inviteTeamMember = useCallback(
    (email: string, role: OrgRole, title?: string) => {
      if (!canManageTeam) {
        return { success: false, error: 'Only owners and admins can invite team members.' };
      }

      const existing = teamMembers.find(
        (m) => m.organization_id === activeOrg.id && m.user_email.toLowerCase() === email.toLowerCase()
      );
      if (existing) {
        return { success: false, error: 'User is already a member of this organisation.' };
      }

      const nameFromEmail = email.split('@')[0].replace(/[._]/g, ' ');
      const newMember: TeamMemberWithProfile = {
        id: `mem-${Date.now()}`,
        organization_id: activeOrg.id,
        user_id: `user-${Date.now()}`,
        role,
        invited_at: new Date().toISOString(),
        user_name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        user_email: email,
        user_title: title || 'Team Member',
        initials: nameFromEmail.slice(0, 2).toUpperCase(),
        status: 'invited',
      };

      setTeamMembers((prev) => [...prev, newMember]);
      return { success: true };
    },
    [canManageTeam, teamMembers, activeOrg.id]
  );

  const updateMemberRole = useCallback(
    (memberId: string, newRole: OrgRole) => {
      if (!canManageTeam) {
        return { success: false, error: 'Permission denied.' };
      }
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
      return { success: true };
    },
    [canManageTeam]
  );

  const removeMember = useCallback(
    (memberId: string) => {
      if (!canManageTeam) {
        return { success: false, error: 'Permission denied.' };
      }
      const target = teamMembers.find((m) => m.id === memberId);
      if (target?.role === 'owner') {
        const ownerCount = teamMembers.filter((m) => m.organization_id === activeOrg.id && m.role === 'owner').length;
        if (ownerCount <= 1) {
          return { success: false, error: 'Cannot remove the sole organisation owner.' };
        }
      }
      setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
      return { success: true };
    },
    [canManageTeam, teamMembers, activeOrg.id]
  );

  // 5. Jobs Management
  const orgJobs = useMemo(() => {
    return jobs.filter((j) => j.organization_id === activeOrg.id);
  }, [jobs, activeOrg.id]);

  const createJob = useCallback(
    (jobData: {
      title: string;
      category_name: string;
      city: string;
      region: string;
      work_style: 'onsite' | 'hybrid' | 'remote';
      contract_type: 'full_time' | 'part_time' | 'contract' | 'internship';
      salary_min_xaf: number;
      salary_max_xaf: number;
      experience_level: string;
      description: string;
      requirements_summary?: string;
      required_skills: string[];
      languages: string[];
      deadline?: string;
      status: 'draft' | 'open';
    }) => {
      const newJob: JobListing = {
        id: `job-${Date.now()}`,
        organization_id: activeOrg.id,
        creator_id: user?.id || 'user-francoise',
        title: jobData.title,
        category_name: jobData.category_name,
        city: jobData.city,
        region: jobData.region,
        country: 'Cameroon',
        work_style: jobData.work_style,
        contract_type: jobData.contract_type,
        salary_min_xaf: jobData.salary_min_xaf,
        salary_max_xaf: jobData.salary_max_xaf,
        currency: 'XAF',
        experience_level: jobData.experience_level,
        description: jobData.description,
        requirements_summary: jobData.requirements_summary || null,
        required_skills: jobData.required_skills,
        languages: jobData.languages,
        status: jobData.status,
        published_at: jobData.status === 'open' ? new Date().toISOString() : null,
        deadline: jobData.deadline || null,
        views_count: 0,
        applicants_count: 0,
        shortlisted_count: 0,
        created_at: new Date().toISOString(),
      };

      setJobs((prev) => [newJob, ...prev]);
      return newJob;
    },
    [activeOrg.id, user]
  );

  const updateJob = useCallback((jobId: string, updates: Partial<JobListing>) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, ...updates } : j)));
  }, []);

  const toggleJobStatus = useCallback((jobId: string, newStatus: JobListing['status']) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: newStatus,
              published_at: newStatus === 'open' && !j.published_at ? new Date().toISOString() : j.published_at,
            }
          : j
      )
    );
  }, []);

  const deleteJob = useCallback((jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }, []);

  // 6. Applicant Management
  const updateApplicantStage = useCallback((applicationId: string, stage: ApplicationStage) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, stage, updated_at: new Date().toISOString() } : a))
    );
  }, []);

  const addApplicantNote = useCallback(
    (applicationId: string, noteText: string) => {
      const newNote = {
        id: `note-${Date.now()}`,
        author_name: user?.full_name || 'Françoise Mbella',
        text: noteText,
        created_at: new Date().toISOString(),
      };
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === applicationId
            ? { ...a, internal_notes: [...a.internal_notes, newNote] }
            : a
        )
      );
    },
    [user]
  );

  // 7. Interviews
  const scheduleInterview = useCallback(
    (interviewData: {
      application_id: string;
      scheduled_at: string;
      duration_minutes: number;
      format: 'video' | 'onsite' | 'phone';
      meeting_link_or_location: string;
      interviewer_names: string[];
      panel_notes?: string;
    }) => {
      const newInterview: Interview = {
        id: `int-${Date.now()}`,
        application_id: interviewData.application_id,
        scheduled_at: interviewData.scheduled_at,
        duration_minutes: interviewData.duration_minutes,
        format: interviewData.format,
        meeting_link_or_location: interviewData.meeting_link_or_location,
        interviewer_names: interviewData.interviewer_names,
        panel_notes: interviewData.panel_notes || null,
        status: 'scheduled',
      };

      setInterviews((prev) => [newInterview, ...prev]);

      // Automatically move candidate stage to 'interview'
      updateApplicantStage(interviewData.application_id, 'interview');

      return newInterview;
    },
    [updateApplicantStage]
  );

  // 8. Real Calculated Metrics (no fake hardcoding)
  const metrics = useMemo(() => {
    const openRoles = orgJobs.filter((j) => j.status === 'open').length;
    const totalApplicants = applicants.length;
    
    // New applicants awaiting review
    const newApplicantsCount = applicants.filter((a) => a.stage === 'applied').length;

    const awaitingReviewCount = applicants.filter(
      (a) => a.stage === 'applied' || a.stage === 'under_review'
    ).length;

    const shortlistedCount = applicants.filter(
      (a) => a.stage === 'shortlisted'
    ).length;

    const interviewsScheduled = interviews.filter((i) => i.status === 'scheduled').length;

    const offersCount = applicants.filter((a) => a.stage === 'offer').length;

    return {
      openRoles,
      totalApplicants,
      newApplicantsCount,
      awaitingReviewCount,
      shortlistedCount,
      interviewsScheduled,
      offersCount,
    };
  }, [orgJobs, applicants, interviews]);

  return (
    <EmployerContext.Provider
      value={{
        userOrgs,
        activeOrg,
        switchOrganization,
        createOrganization,
        updateOrganizationProfile,
        submitVerificationDoc,
        teamMembers: teamMembers.filter((m) => m.organization_id === activeOrg.id),
        inviteTeamMember,
        updateMemberRole,
        removeMember,
        canManageTeam,
        orgJobs,
        createJob,
        updateJob,
        toggleJobStatus,
        deleteJob,
        applicants,
        updateApplicantStage,
        addApplicantNote,
        interviews,
        scheduleInterview,
        metrics,
      }}
    >
      {children}
    </EmployerContext.Provider>
  );
}

export function useEmployer() {
  const context = useContext(EmployerContext);
  if (!context) {
    throw new Error('useEmployer must be used within an EmployerProvider');
  }
  return context;
}
