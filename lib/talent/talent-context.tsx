'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import {
  TalentProfile,
  TalentSkill,
  TalentExperience,
  JobListing,
  Application,
  Interview,
  CareerRoadmap,
  RoadmapMilestone,
  NotificationItem,
  ApplicationStage,
  WorkStyle,
} from '@/lib/types/database';
import {
  SEED_TALENT_PROFILES,
  SEED_JOBS,
  SEED_APPLICATIONS,
  SEED_INTERVIEWS,
  SEED_CAREER_ROADMAP,
  SEED_NOTIFICATIONS,
  SEED_ORGANIZATIONS,
} from '@/lib/data/seed-data';

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_year: string;
  end_year: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  credential_url?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  platform: 'github' | 'linkedin' | 'website' | 'behance' | 'dribbble' | 'other';
  url: string;
}

export interface DetailedTalentProfile extends TalentProfile {
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string | null;
  availability: 'immediate' | 'two_weeks' | 'one_month' | 'not_looking';
  target_role: string;
  skills_list: TalentSkill[];
  experiences_list: TalentExperience[];
  educations_list: EducationItem[];
  certifications_list: CertificationItem[];
  portfolios_list: PortfolioItem[];
}

export interface ReportedJobRecord {
  job_id: string;
  reason: string;
  details: string;
  reported_at: string;
}

export interface TalentRoadmapMilestone extends RoadmapMilestone {
  tasks: { id: string; text: string; done: boolean }[];
}

export interface TalentCareerRoadmap extends Omit<CareerRoadmap, 'milestones'> {
  milestones: TalentRoadmapMilestone[];
}

interface TalentContextType {
  profile: DetailedTalentProfile;
  updateProfile: (updates: Partial<DetailedTalentProfile>) => void;
  addSkill: (skill: Omit<TalentSkill, 'id' | 'talent_id'>) => void;
  removeSkill: (skillId: string) => void;
  addExperience: (exp: Omit<TalentExperience, 'id' | 'talent_id'>) => void;
  removeExperience: (expId: string) => void;
  addEducation: (edu: Omit<EducationItem, 'id'>) => void;
  removeEducation: (eduId: string) => void;
  addCertification: (cert: Omit<CertificationItem, 'id'>) => void;
  removeCertification: (certId: string) => void;
  addPortfolio: (item: Omit<PortfolioItem, 'id'>) => void;
  removePortfolio: (itemId: string) => void;

  // Saved Jobs
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;

  // Applications
  applications: Application[];
  updateApplicationStage: (appId: string, stage: ApplicationStage) => void;
  createApplication: (jobId: string, screeningAnswers?: Record<string, any>) => Application;
  withdrawApplication: (appId: string) => void;

  // Interviews
  interviews: Interview[];

  // Career Roadmap
  roadmap: TalentCareerRoadmap;
  toggleRoadmapTask: (milestoneId: string, taskId: string) => void;
  replaceRoadmap: (newRoadmap: TalentCareerRoadmap) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Reported jobs
  reportedJobs: ReportedJobRecord[];
  reportJob: (jobId: string, reason: string, details: string) => void;

  // Reset to initial demo state
  resetTalentData: () => void;
}

const STORAGE_KEY = 'workdey_talent_workspace_v2';

const INITIAL_PROFILE: DetailedTalentProfile = {
  ...SEED_TALENT_PROFILES[0],
  full_name: 'Aïcha Nkeng',
  email: 'aicha@example.com',
  phone: '+237 670 000 001',
  availability: 'two_weeks',
  target_role: 'Lead Agribusiness Analytics Specialist',
  skills_list: [
    { id: 'sk-1', talent_id: 'talent-aicha', skill_id: 's-sql', skill_name: 'SQL & Window Functions', years_experience: 6, verified_score: 94 },
    { id: 'sk-2', talent_id: 'talent-aicha', skill_id: 's-pbi', skill_name: 'Power BI & DAX', years_experience: 5, verified_score: 90 },
    { id: 'sk-3', talent_id: 'talent-aicha', skill_id: 's-py', skill_name: 'Python (Pandas, NumPy)', years_experience: 4, verified_score: 82 },
    { id: 'sk-4', talent_id: 'talent-aicha', skill_id: 's-fr', skill_name: 'Bilingual (French / English)', years_experience: 8, verified_score: 98 },
    { id: 'sk-5', talent_id: 'talent-aicha', skill_id: 's-etl', skill_name: 'ETL Pipelines', years_experience: 4, verified_score: 85 },
  ],
  experiences_list: [
    {
      id: 'exp-1',
      talent_id: 'talent-aicha',
      job_title: 'Senior Data Analyst',
      company_name: 'Cacao Route SARL',
      city: 'Douala',
      start_date: '2022-03',
      is_current: true,
      description: 'Built cooperative yield reporting in Power BI; cut monthly reporting turnaround by 60% with automated ETL pipelines.',
    },
    {
      id: 'exp-2',
      talent_id: 'talent-aicha',
      job_title: 'Data & Reporting Analyst',
      company_name: 'Kadji Retail Group',
      city: 'Douala',
      start_date: '2020-01',
      end_date: '2022-02',
      is_current: false,
      description: 'Weekly sales, inventory tracking, and warehouse demurrage auditing across 8 regional branches.',
    },
  ],
  educations_list: [
    {
      id: 'edu-1',
      institution: 'University of Buea',
      degree: 'B.Sc. in Computer Science & Applied Statistics',
      field: 'Data Engineering and Statistical Analysis',
      start_year: '2016',
      end_year: '2019',
    },
  ],
  certifications_list: [
    {
      id: 'cert-1',
      name: 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
      issuer: 'Microsoft',
      issue_date: '2024-05',
      credential_url: 'https://learn.microsoft.com/credentials/certifications/pl-300',
    },
  ],
  portfolios_list: [
    {
      id: 'port-1',
      title: 'Cameroon Agritech Yield Forecasting Repo',
      platform: 'github',
      url: 'https://github.com/aichankeng/cacao-yield-analysis',
    },
    {
      id: 'port-2',
      title: 'Aïcha Nkeng on LinkedIn',
      platform: 'linkedin',
      url: 'https://linkedin.com/in/aichankeng-demo',
    },
  ],
};

const INITIAL_ROADMAP: TalentContextType['roadmap'] = {
  ...SEED_CAREER_ROADMAP,
  milestones: [
    {
      id: 'ms-1',
      roadmap_id: 'roadmap-aicha',
      stage_order: 1,
      title: 'Core Agribusiness Forecasting Tools',
      duration_text: 'Months 1–3',
      description: 'Solidify advanced geospatial Python forecasting (GeoPandas, Shapely) for rural Cameroonian cooperatives.',
      status: 'completed',
      tasks: [
        { id: 't-1', text: 'Complete GeoPandas spatial indexing module', done: true },
        { id: 't-2', text: 'Build offline SQLite caching layer for field sync', done: true },
        { id: 't-3', text: 'Publish interactive demo on GitHub', done: true },
      ],
    },
    {
      id: 'ms-2',
      roadmap_id: 'roadmap-aicha',
      stage_order: 2,
      title: 'Cross-Functional Leadership & Mentorship',
      duration_text: 'Months 4–7',
      description: 'Lead analytics sprint for 2 junior data associates and document measurable business impact.',
      status: 'in_progress',
      tasks: [
        { id: 't-4', text: 'Establish peer code review checklists for Power BI DAX formulas', done: true },
        { id: 't-5', text: 'Conduct mock interview with WorkDey AI coach for Lead roles', done: false },
        { id: 't-6', text: 'Quantify 15% reduction in crop transport logistics delay', done: false },
      ],
    },
    {
      id: 'ms-3',
      roadmap_id: 'roadmap-aicha',
      stage_order: 3,
      title: 'Senior Specialist Offer & Executive Alignment',
      duration_text: 'Months 8–12',
      description: 'Target lead analytics vacancies in Douala/Remote with compensation between 900,000 and 1,400,000 XAF/mo.',
      status: 'pending',
      tasks: [
        { id: 't-7', text: 'Refine CV executive summary focusing on bilingual operations leadership', done: false },
        { id: 't-8', text: 'Negotiate verified offer with transparent XAF benchmarking', done: false },
      ],
    },
  ],
};

function calculateProfileStrength(p: DetailedTalentProfile): number {
  let score = 20; // base account created
  if (p.headline && p.headline.length > 10) score += 10;
  if (p.bio && p.bio.length > 20) score += 10;
  if (p.skills_list && p.skills_list.length >= 3) score += 15;
  if (p.experiences_list && p.experiences_list.length >= 1) score += 15;
  if (p.educations_list && p.educations_list.length >= 1) score += 10;
  if (p.certifications_list && p.certifications_list.length >= 1) score += 8;
  if (p.portfolios_list && p.portfolios_list.length >= 1) score += 7;
  if (p.phone && p.phone.length > 5) score += 5;
  return Math.min(100, score);
}

function getStoredItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return parsed[key] !== undefined ? parsed[key] : fallback;
  } catch {
    return fallback;
  }
}

const TalentContext = createContext<TalentContextType | undefined>(undefined);

export function TalentProvider({ children }: { children: React.ReactNode }) {
  const counterRef = useRef(1000);

  // Lazy state initializers eliminate cascading renders in effects
  const [profile, setProfile] = useState<DetailedTalentProfile>(() =>
    getStoredItem('profile', INITIAL_PROFILE)
  );
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() =>
    getStoredItem('savedJobIds', ['job-senior-data-analyst', 'job-frontend-engineer'])
  );
  const [applications, setApplications] = useState<Application[]>(() =>
    getStoredItem('applications', SEED_APPLICATIONS)
  );
  const [interviews, setInterviews] = useState<Interview[]>(() =>
    getStoredItem('interviews', SEED_INTERVIEWS)
  );
  const [roadmap, setRoadmap] = useState<TalentContextType['roadmap']>(() =>
    getStoredItem('roadmap', INITIAL_ROADMAP)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStoredItem('notifications', SEED_NOTIFICATIONS)
  );
  const [reportedJobs, setReportedJobs] = useState<ReportedJobRecord[]>(() =>
    getStoredItem('reportedJobs', [])
  );

  // Save changes to localStorage
  const persistState = useCallback(
    (
      newProfile = profile,
      newSaved = savedJobIds,
      newApps = applications,
      newInterviews = interviews,
      newRoadmap = roadmap,
      newNotifs = notifications,
      newReports = reportedJobs
    ) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            profile: newProfile,
            savedJobIds: newSaved,
            applications: newApps,
            interviews: newInterviews,
            roadmap: newRoadmap,
            notifications: newNotifs,
            reportedJobs: newReports,
          })
        );
      } catch {
        // storage quota exceeded or disabled
      }
    },
    [profile, savedJobIds, applications, interviews, roadmap, notifications, reportedJobs]
  );

  const updateProfile = useCallback(
    (updates: Partial<DetailedTalentProfile>) => {
      setProfile((prev) => {
        const merged = { ...prev, ...updates };
        merged.profile_strength_pct = calculateProfileStrength(merged);
        persistState(merged);
        return merged;
      });
    },
    [persistState]
  );

  const addSkill = useCallback(
    (skill: Omit<TalentSkill, 'id' | 'talent_id'>) => {
      counterRef.current += 1;
      setProfile((prev) => {
        const newSkill: TalentSkill = {
          ...skill,
          id: `sk-${counterRef.current}`,
          talent_id: prev.id,
        };
        const updated = {
          ...prev,
          skills_list: [...prev.skills_list, newSkill],
        };
        updated.profile_strength_pct = calculateProfileStrength(updated);
        persistState(updated);
        return updated;
      });
    },
    [persistState]
  );

  const removeSkill = useCallback(
    (skillId: string) => {
      setProfile((prev) => {
        const updated = {
          ...prev,
          skills_list: prev.skills_list.filter((s) => s.id !== skillId),
        };
        updated.profile_strength_pct = calculateProfileStrength(updated);
        persistState(updated);
        return updated;
      });
    },
    [persistState]
  );

  const addExperience = useCallback(
    (exp: Omit<TalentExperience, 'id' | 'talent_id'>) => {
      counterRef.current += 1;
      setProfile((prev) => {
        const newExp: TalentExperience = {
          ...exp,
          id: `exp-${counterRef.current}`,
          talent_id: prev.id,
        };
        const updated = {
          ...prev,
          experiences_list: [newExp, ...prev.experiences_list],
        };
        updated.profile_strength_pct = calculateProfileStrength(updated);
        persistState(updated);
        return updated;
      });
    },
    [persistState]
  );

  const removeExperience = useCallback(
    (expId: string) => {
      setProfile((prev) => {
        const updated = {
          ...prev,
          experiences_list: prev.experiences_list.filter((e) => e.id !== expId),
        };
        updated.profile_strength_pct = calculateProfileStrength(updated);
        persistState(updated);
        return updated;
      });
    },
    [persistState]
  );

  const addEducation = useCallback(
    (edu: Omit<EducationItem, 'id'>) => {
      counterRef.current += 1;
      setProfile((prev) => {
        const newEdu: EducationItem = { ...edu, id: `edu-${counterRef.current}` };
        const updated = {
          ...prev,
          educations_list: [newEdu, ...prev.educations_list],
        };
        updated.profile_strength_pct = calculateProfileStrength(updated);
        persistState(updated);
        return updated;
      });
    },
    [persistState]
  );

  const removeEducation = useCallback(
    (eduId: string) => {
      setProfile((prev) => {
        const updated = {
          ...prev,
          educations_list: prev.educations_list.filter((e) => e.id !== eduId),
        };
        updated.profile_strength_pct = calculateProfileStrength(updated);
        persistState(updated);
        return updated;
      });
    },
    [persistState]
  );

  const addCertification = useCallback(
    (cert: Omit<CertificationItem, 'id'>) => {
      counterRef.current += 1;
      setProfile((prev) => {
        const newCert: CertificationItem = { ...cert, id: `cert-${counterRef.current}` };
        const updated = {
          ...prev,
          certifications_list: [...prev.certifications_list, newCert],
        };
        updated.profile_strength_pct = calculateProfileStrength(updated);
        persistState(updated);
        return updated;
      });
    },
    [persistState]
  );

  const removeCertification = useCallback(
    (certId: string) => {
      setProfile((prev) => {
        const updated = {
          ...prev,
          certifications_list: prev.certifications_list.filter((c) => c.id !== certId),
        };
        updated.profile_strength_pct = calculateProfileStrength(updated);
        persistState(updated);
        return updated;
      });
    },
    [persistState]
  );

  const addPortfolio = useCallback(
    (item: Omit<PortfolioItem, 'id'>) => {
      counterRef.current += 1;
      setProfile((prev) => {
        const newItem: PortfolioItem = { ...item, id: `port-${counterRef.current}` };
        const updated = {
          ...prev,
          portfolios_list: [...prev.portfolios_list, newItem],
        };
        updated.profile_strength_pct = calculateProfileStrength(updated);
        persistState(updated);
        return updated;
      });
    },
    [persistState]
  );

  const removePortfolio = useCallback(
    (itemId: string) => {
      setProfile((prev) => {
        const updated = {
          ...prev,
          portfolios_list: prev.portfolios_list.filter((p) => p.id !== itemId),
        };
        updated.profile_strength_pct = calculateProfileStrength(updated);
        persistState(updated);
        return updated;
      });
    },
    [persistState]
  );

  const toggleSaveJob = useCallback(
    (jobId: string) => {
      setSavedJobIds((prev) => {
        const next = prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId];
        persistState(profile, next);
        return next;
      });
    },
    [persistState, profile]
  );

  const isJobSaved = useCallback(
    (jobId: string) => {
      return savedJobIds.includes(jobId);
    },
    [savedJobIds]
  );

  const updateApplicationStage = useCallback(
    (appId: string, stage: ApplicationStage) => {
      setApplications((prev) => {
        const updated = prev.map((app) =>
          app.id === appId
            ? { ...app, stage, updated_at: '2026-10-31T12:00:00Z' }
            : app
        );
        persistState(profile, savedJobIds, updated);
        return updated;
      });
    },
    [persistState, profile, savedJobIds]
  );

  const createApplication = useCallback(
    (jobId: string, screeningAnswers?: Record<string, any>) => {
      counterRef.current += 1;
      const job = SEED_JOBS.find((j) => j.id === jobId);
      const newApp: Application = {
        id: `app-${counterRef.current}`,
        job_id: jobId,
        talent_id: profile.id,
        stage: 'applied',
        match_score: 88,
        match_skills_score: 85,
        match_experience_score: 80,
        match_location_score: 100,
        match_reasons: [
          'Skills match core requirements: SQL, analytics reporting',
          'Preferred location Douala / Cameroon aligns with job',
        ],
        match_gaps: ['Explore domain-specific ERP integration'],
        screening_answers: screeningAnswers,
        applied_at: '2026-10-31T12:00:00Z',
        job: job,
      };

      setApplications((prev) => {
        const next = [newApp, ...prev.filter((a) => a.job_id !== jobId)];
        persistState(profile, savedJobIds, next);
        return next;
      });

      // Also create an in-app notification confirming submission
      counterRef.current += 1;
      setNotifications((prev) => {
        const newNotif: NotificationItem = {
          id: `notif-${counterRef.current}`,
          user_id: profile.user_id,
          title: `Application sent: ${job?.title || 'New Job'}`,
          body: `Your profile and CV were submitted to ${job?.organization_id ? 'the hiring team' : 'the employer'}. Status is now Applied.`,
          category: 'application',
          action_url: '/talent/applications',
          is_read: false,
          created_at: '2026-10-31T12:00:00Z',
        };
        const updatedNotifs = [newNotif, ...prev];
        persistState(profile, savedJobIds, applications, interviews, roadmap, updatedNotifs);
        return updatedNotifs;
      });

      return newApp;
    },
    [applications, interviews, persistState, profile, roadmap, savedJobIds]
  );

  const withdrawApplication = useCallback(
    (appId: string) => {
      updateApplicationStage(appId, 'withdrawn');
    },
    [updateApplicationStage]
  );

  const toggleRoadmapTask = useCallback(
    (milestoneId: string, taskId: string) => {
      setRoadmap((prev) => {
        let totalTasks = 0;
        let completedTasks = 0;

        const updatedMilestones: (RoadmapMilestone & { tasks: { id: string; text: string; done: boolean }[] })[] =
          prev.milestones.map((m) => {
            if (m.id !== milestoneId) {
              m.tasks.forEach((t) => {
                totalTasks++;
                if (t.done) completedTasks++;
              });
              return m;
            }

            const updatedTasks = m.tasks.map((t) => {
              if (t.id === taskId) {
                const newDone = !t.done;
                totalTasks++;
                if (newDone) completedTasks++;
                return { ...t, done: newDone };
              }
              totalTasks++;
              if (t.done) completedTasks++;
              return t;
            });

            const allDone = updatedTasks.every((t) => t.done);
            const anyDone = updatedTasks.some((t) => t.done);
            const status: 'completed' | 'in_progress' | 'pending' = allDone
              ? 'completed'
              : anyDone
              ? 'in_progress'
              : 'pending';

            return { ...m, tasks: updatedTasks, status };
          });

        const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : prev.progress_pct;

        const updatedRoadmap = {
          ...prev,
          progress_pct: newProgress,
          milestones: updatedMilestones,
        };

        persistState(profile, savedJobIds, applications, interviews, updatedRoadmap);
        return updatedRoadmap;
      });
    },
    [applications, interviews, persistState, profile, savedJobIds]
  );

  const replaceRoadmap = useCallback(
    (newRoadmap: TalentCareerRoadmap) => {
      setRoadmap(newRoadmap);
      persistState(profile, savedJobIds, applications, interviews, newRoadmap);
    },
    [applications, interviews, persistState, profile, savedJobIds]
  );

  const markNotificationAsRead = useCallback(
    (id: string) => {
      setNotifications((prev) => {
        const next = prev.map((n) => (n.id === id ? { ...n, is_read: true } : n));
        persistState(profile, savedJobIds, applications, interviews, roadmap, next);
        return next;
      });
    },
    [applications, interviews, persistState, profile, roadmap, savedJobIds]
  );

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, is_read: true }));
      persistState(profile, savedJobIds, applications, interviews, roadmap, next);
      return next;
    });
  }, [applications, interviews, persistState, profile, roadmap, savedJobIds]);

  const reportJob = useCallback(
    (jobId: string, reason: string, details: string) => {
      const record: ReportedJobRecord = {
        job_id: jobId,
        reason,
        details,
        reported_at: '2026-10-31T12:00:00Z',
      };
      setReportedJobs((prev) => {
        const next = [record, ...prev];
        persistState(profile, savedJobIds, applications, interviews, roadmap, notifications, next);
        return next;
      });
    },
    [applications, interviews, notifications, persistState, profile, roadmap, savedJobIds]
  );

  const resetTalentData = useCallback(() => {
    setProfile(INITIAL_PROFILE);
    setSavedJobIds(['job-senior-data-analyst', 'job-frontend-engineer']);
    setApplications(SEED_APPLICATIONS);
    setInterviews(SEED_INTERVIEWS);
    setRoadmap(INITIAL_ROADMAP);
    setNotifications(SEED_NOTIFICATIONS);
    setReportedJobs([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  return (
    <TalentContext.Provider
      value={{
        profile,
        updateProfile,
        addSkill,
        removeSkill,
        addExperience,
        removeExperience,
        addEducation,
        removeEducation,
        addCertification,
        removeCertification,
        addPortfolio,
        removePortfolio,
        savedJobIds,
        toggleSaveJob,
        isJobSaved,
        applications,
        updateApplicationStage,
        createApplication,
        withdrawApplication,
        interviews,
        roadmap,
        toggleRoadmapTask,
        replaceRoadmap,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        reportedJobs,
        reportJob,
        resetTalentData,
      }}
    >
      {children}
    </TalentContext.Provider>
  );
}

export function useTalent() {
  const context = useContext(TalentContext);
  if (!context) {
    throw new Error('useTalent must be used within a TalentProvider');
  }
  return context;
}
