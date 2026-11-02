'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import {
  UserProfile,
  Organization,
  JobListing,
  ModerationReport,
  AuditLog,
  PlatformRole,
  OrgVerificationStatus,
} from '@/lib/types/database';
import {
  SEED_USERS,
  SEED_ORGANIZATIONS,
  SEED_JOBS,
  SEED_APPLICATIONS,
  SEED_MODERATION_REPORTS,
  SEED_AUDIT_LOGS,
  SEED_PLATFORM_ROLES,
} from '@/lib/data/seed-data';
import { canManagePlatformRole, hasPlatformPermission, AdminPermission } from '@/lib/admin/rbac';

export interface AdminUserItem extends UserProfile {
  role_type: 'talent' | 'employer' | 'admin';
  platform_role: PlatformRole | null;
  region: string;
  applications_count: number;
  profile_strength: number;
  status: 'active' | 'suspended' | 'unverified';
  suspension_reason?: string;
  associated_org?: string;
}

export interface AdminTaxonomyCategory {
  id: string;
  name: string;
  slug: string;
  jobs_count: number;
  is_active: boolean;
}

export interface AdminTaxonomySkill {
  id: string;
  name: string;
  category: string;
  usage_count: number;
}

export interface AdminTaxonomyLocation {
  code: string;
  name: string;
  cities: string[];
  is_active: boolean;
}

export interface SubscriptionPlanItem {
  id: string;
  name: string;
  price_xaf: number;
  price_display: string;
  roles_limit: number | 'unlimited';
  seats_limit: number | 'unlimited';
  features: string[];
  is_popular?: boolean;
}

export interface SubscribedOrgItem {
  id: string;
  org_id: string;
  org_name: string;
  plan_id: string;
  plan_name: string;
  seats: number;
  renews_at: string;
  status: 'active' | 'payment_due' | 'cancelled';
  amount_xaf: number;
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  message: string;
  target: 'all' | 'talent' | 'employer';
  priority: 'info' | 'warning' | 'urgent';
  is_active: boolean;
  created_at: string;
  created_by: string;
}

export interface PlatformSettingsState {
  require_verification: boolean;
  allow_remote_international: boolean;
  hide_salary_threshold: boolean;
  maintenance_mode: boolean;
  session_timeout_minutes: number;
  two_factor_required: boolean;
  audit_retention_months: number;
  ai_daily_rate_limit: number;
  ai_model: string;
}

interface AdminContextType {
  // Collections
  users: AdminUserItem[];
  organizations: Organization[];
  jobs: JobListing[];
  moderationReports: ModerationReport[];
  auditLogs: AuditLog[];
  categories: AdminTaxonomyCategory[];
  skills: AdminTaxonomySkill[];
  locations: AdminTaxonomyLocation[];
  subscriptionPlans: SubscriptionPlanItem[];
  subscribedOrgs: SubscribedOrgItem[];
  announcements: PlatformAnnouncement[];
  settings: PlatformSettingsState;

  // Real Calculated Metrics
  metrics: {
    totalUsers: number;
    talentCount: number;
    employerCount: number;
    totalOrgs: number;
    pendingVerifications: number;
    verifiedOrgs: number;
    activeJobs: number;
    pendingModeration: number;
    openReports: number;
    totalApplications: number;
    monthlyRevenueXaf: number;
    activeSubscribers: number;
  };

  // Permission helper
  can: (permission: AdminPermission) => boolean;

  // Operational Actions
  suspendUser: (userId: string, reason: string) => { success: boolean; error?: string };
  reactivateUser: (userId: string) => { success: boolean; error?: string };
  updateUserRole: (userId: string, newRole: PlatformRole | null) => { success: boolean; error?: string };
  
  verifyOrganization: (
    orgId: string,
    decision: 'verified' | 'rejected' | 'requested_info',
    notes: string
  ) => { success: boolean; error?: string };

  moderateJob: (
    reportId: string,
    decision: 'dismiss' | 'request_edit' | 'remove_listing' | 'suspend_org',
    notes: string
  ) => { success: boolean; error?: string };

  addCategory: (name: string) => { success: boolean; error?: string };
  toggleCategory: (categoryId: string) => void;
  addSkill: (name: string, category: string) => { success: boolean; error?: string };
  addLocation: (regionName: string, cities: string[]) => { success: boolean; error?: string };
  
  updatePlanPrice: (planId: string, priceXaf: number) => { success: boolean };
  
  addAnnouncement: (announcement: Omit<PlatformAnnouncement, 'id' | 'created_at' | 'created_by'>) => void;
  toggleAnnouncement: (id: string) => void;
  deleteAnnouncement: (id: string) => void;

  updateSettings: (newSettings: Partial<PlatformSettingsState>) => void;
  exportAuditCSV: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Initial Expanded User Set for Rich Administration
const INITIAL_ADMIN_USERS: AdminUserItem[] = [
  {
    id: 'user-aicha',
    email: 'aicha@example.com',
    full_name: 'Aïcha Nkeng',
    language_pref: 'en',
    is_active: true,
    created_at: '2026-09-15T08:00:00Z',
    role_type: 'talent',
    platform_role: null,
    region: 'Littoral (Douala)',
    applications_count: 6,
    profile_strength: 82,
    status: 'active',
  },
  {
    id: 'user-francoise',
    email: 'francoise@savanna.example',
    full_name: 'Françoise Mbella',
    language_pref: 'fr',
    is_active: true,
    created_at: '2026-08-10T10:00:00Z',
    role_type: 'employer',
    platform_role: null,
    region: 'Littoral (Douala)',
    applications_count: 0,
    profile_strength: 100,
    status: 'active',
    associated_org: 'Savanna Agritech',
  },
  {
    id: 'user-nadine',
    email: 'nadine@workdey.cm',
    full_name: 'Nadine O.',
    language_pref: 'en',
    is_active: true,
    created_at: '2026-07-01T09:00:00Z',
    role_type: 'admin',
    platform_role: 'super_admin',
    region: 'Centre (Yaoundé)',
    applications_count: 0,
    profile_strength: 100,
    status: 'active',
  },
  {
    id: 'user-paul',
    email: 'paul.etame@example.cm',
    full_name: 'Paul Etame',
    language_pref: 'fr',
    is_active: true,
    created_at: '2026-10-04T12:00:00Z',
    role_type: 'talent',
    platform_role: null,
    region: 'South-West (Buea)',
    applications_count: 1,
    profile_strength: 45,
    status: 'unverified',
  },
  {
    id: 'user-quickhire',
    email: 'contact@quickhire.example',
    full_name: 'Quick Hire Recruitment',
    language_pref: 'en',
    is_active: false,
    created_at: '2026-10-18T14:30:00Z',
    role_type: 'employer',
    platform_role: null,
    region: 'Centre (Yaoundé)',
    applications_count: 0,
    profile_strength: 30,
    status: 'suspended',
    suspension_reason: 'Flagged for requesting upfront recruitment fee (15,000 XAF)',
    associated_org: 'Quick Hire Ltd',
  },
  {
    id: 'user-samuel',
    email: 'samuel.tang@orbit.example',
    full_name: 'Samuel Tang',
    language_pref: 'en',
    is_active: true,
    created_at: '2026-08-20T14:00:00Z',
    role_type: 'employer',
    platform_role: null,
    region: 'Centre (Yaoundé)',
    applications_count: 0,
    profile_strength: 95,
    status: 'active',
    associated_org: 'Orbit Telecom',
  },
  {
    id: 'user-cedric',
    email: 'cedric.mod@workdey.cm',
    full_name: 'Cédric Fopa',
    language_pref: 'fr',
    is_active: true,
    created_at: '2026-08-01T10:00:00Z',
    role_type: 'admin',
    platform_role: 'moderator',
    region: 'West (Bafoussam)',
    applications_count: 0,
    profile_strength: 90,
    status: 'active',
  },
];

// Initial Taxonomy
const INITIAL_CATEGORIES: AdminTaxonomyCategory[] = [
  { id: 'cat-data', name: 'Data & Analytics', slug: 'data-analytics', jobs_count: 18, is_active: true },
  { id: 'cat-software', name: 'Software & Engineering', slug: 'software-engineering', jobs_count: 32, is_active: true },
  { id: 'cat-agri', name: 'Agriculture & Food Science', slug: 'agriculture-food-science', jobs_count: 14, is_active: true },
  { id: 'cat-telecom', name: 'Telecommunications & Network', slug: 'telecom-network', jobs_count: 11, is_active: true },
  { id: 'cat-health', name: 'Healthcare & Clinical', slug: 'healthcare-clinical', jobs_count: 9, is_active: true },
  { id: 'cat-logistics', name: 'Logistics & Supply Chain', slug: 'logistics-supply-chain', jobs_count: 15, is_active: true },
  { id: 'cat-finance', name: 'Finance & Accounting', slug: 'finance-accounting', jobs_count: 22, is_active: true },
];

const INITIAL_SKILLS: AdminTaxonomySkill[] = [
  { id: 'sk-1', name: 'SQL', category: 'Data & Analytics', usage_count: 145 },
  { id: 'sk-2', name: 'Power BI', category: 'Data & Analytics', usage_count: 98 },
  { id: 'sk-3', name: 'Python', category: 'Software & Engineering', usage_count: 184 },
  { id: 'sk-4', name: 'React', category: 'Software & Engineering', usage_count: 130 },
  { id: 'sk-5', name: 'Agronomy Forecasting', category: 'Agriculture & Food Science', usage_count: 24 },
  { id: 'sk-6', name: 'Fiber Optics', category: 'Telecommunications & Network', usage_count: 42 },
  { id: 'sk-7', name: 'Port Customs Clearing', category: 'Logistics & Supply Chain', usage_count: 36 },
  { id: 'sk-8', name: 'OHADA Accounting', category: 'Finance & Accounting', usage_count: 78 },
];

const INITIAL_LOCATIONS: AdminTaxonomyLocation[] = [
  { code: 'LT', name: 'Littoral', cities: ['Douala', 'Edéa', 'Nkongsamba'], is_active: true },
  { code: 'CE', name: 'Centre', cities: ['Yaoundé', 'Mbalmayo', 'Bafia'], is_active: true },
  { code: 'SW', name: 'South-West', cities: ['Buea', 'Limbe', 'Kumba', 'Tiko'], is_active: true },
  { code: 'NW', name: 'North-West', cities: ['Bamenda', 'Kumbo'], is_active: true },
  { code: 'OU', name: 'West', cities: ['Bafoussam', 'Dschang', 'Foumban'], is_active: true },
  { code: 'SU', name: 'South', cities: ['Kribi', 'Ebolowa', 'Sangmélima'], is_active: true },
  { code: 'AD', name: 'Adamawa', cities: ['Ngaoundéré'], is_active: true },
  { code: 'NO', name: 'North', cities: ['Garoua'], is_active: true },
  { code: 'EN', name: 'Far North', cities: ['Maroua'], is_active: true },
  { code: 'ES', name: 'East', cities: ['Bertoua'], is_active: true },
  { code: 'REMOTE', name: 'Remote & International', cities: ['Remote (Cameroon)', 'Remote (Worldwide)'], is_active: true },
];

const INITIAL_PLANS: SubscriptionPlanItem[] = [
  {
    id: 'starter',
    name: 'Starter Tier',
    price_xaf: 0,
    price_display: 'Free / 50,000 XAF per job',
    roles_limit: 1,
    seats_limit: 1,
    features: ['1 active listing', 'Standard application review', 'Email notifications', 'Community support'],
  },
  {
    id: 'growth',
    name: 'Growth Tier',
    price_xaf: 150000,
    price_display: '150,000 XAF / month',
    roles_limit: 'unlimited',
    seats_limit: 5,
    features: [
      'Unlimited active job posts',
      'Team collaborative pipeline (5 seats)',
      'AI candidate matching & screening questions',
      'Salary benchmarks & analytics access',
      'Priority verification badge',
    ],
    is_popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Tier',
    price_xaf: 450000,
    price_display: 'Custom (450,000 XAF / mo)',
    roles_limit: 'unlimited',
    seats_limit: 'unlimited',
    features: [
      'Unlimited recruiting seats',
      'Fast-track 2-hour employer verification',
      'Dedicated account lead in Douala/Yaoundé',
      'Custom API & ATS integration',
      'Featured home hero spotlight',
    ],
  },
];

const INITIAL_SUBSCRIBED_ORGS: SubscribedOrgItem[] = [
  {
    id: 'sub-1',
    org_id: 'org-savanna',
    org_name: 'Savanna Agritech',
    plan_id: 'growth',
    plan_name: 'Growth Tier',
    seats: 5,
    renews_at: '2026-11-15T00:00:00Z',
    status: 'active',
    amount_xaf: 150000,
  },
  {
    id: 'sub-2',
    org_id: 'org-orbit',
    org_name: 'Orbit Telecom',
    plan_id: 'enterprise',
    plan_name: 'Enterprise Tier',
    seats: 12,
    renews_at: '2026-11-20T00:00:00Z',
    status: 'active',
    amount_xaf: 450000,
  },
  {
    id: 'sub-3',
    org_id: 'org-lumen',
    org_name: 'Lumen Health',
    plan_id: 'growth',
    plan_name: 'Growth Tier',
    seats: 3,
    renews_at: '2026-11-03T00:00:00Z',
    status: 'payment_due',
    amount_xaf: 150000,
  },
];

const INITIAL_ANNOUNCEMENTS: PlatformAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Cameroon Tech & Agribusiness Recruitment Fair',
    message: 'Participate in the upcoming virtual job showcase for Littoral & Centre employers. Registrations close 15 November.',
    target: 'all',
    priority: 'info',
    is_active: true,
    created_at: '2026-10-25T10:00:00Z',
    created_by: 'Nadine O.',
  },
  {
    id: 'ann-2',
    title: 'Zero Tolerance Policy: Application Fees Strictly Prohibited',
    message: 'Any employer asking for application, training or interview fees will be immediately suspended and reported to local authorities.',
    target: 'talent',
    priority: 'warning',
    is_active: true,
    created_at: '2026-10-20T08:00:00Z',
    created_by: 'Nadine O.',
  },
];

const INITIAL_SETTINGS: PlatformSettingsState = {
  require_verification: true,
  allow_remote_international: true,
  hide_salary_threshold: true,
  maintenance_mode: false,
  session_timeout_minutes: 15,
  two_factor_required: true,
  audit_retention_months: 36,
  ai_daily_rate_limit: 1000,
  ai_model: 'Gemini 3.5 Flash (@google/genai)',
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user, platformRole } = useAuth();

  const [users, setUsers] = useState<AdminUserItem[]>(INITIAL_ADMIN_USERS);
  const [organizations, setOrganizations] = useState<Organization[]>(SEED_ORGANIZATIONS);
  const [jobs, setJobs] = useState<JobListing[]>(SEED_JOBS);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(SEED_MODERATION_REPORTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);
  const [categories, setCategories] = useState<AdminTaxonomyCategory[]>(INITIAL_CATEGORIES);
  const [skills, setSkills] = useState<AdminTaxonomySkill[]>(INITIAL_SKILLS);
  const [locations, setLocations] = useState<AdminTaxonomyLocation[]>(INITIAL_LOCATIONS);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlanItem[]>(INITIAL_PLANS);
  const [subscribedOrgs, setSubscribedOrgs] = useState<SubscribedOrgItem[]>(INITIAL_SUBSCRIBED_ORGS);
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [settings, setSettings] = useState<PlatformSettingsState>(INITIAL_SETTINGS);

  // RBAC Permission Checker
  const can = useCallback(
    (permission: AdminPermission) => {
      return hasPlatformPermission(platformRole, permission);
    },
    [platformRole]
  );

  // Helper to record immutable audit log entry
  const recordAudit = useCallback(
    (action: string, targetType: string, targetId: string, metadata?: Record<string, any>) => {
      const actorName = user?.full_name ? `${user.full_name} (${platformRole || 'Admin'})` : 'Nadine O. (Super Admin)';
      const newLog: AuditLog = {
        id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        actor_id: user?.id || 'user-nadine',
        actor_name: actorName,
        action,
        target_type: targetType,
        target_id: targetId,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    },
    [user, platformRole]
  );

  // 1. Suspend User with mandatory reason
  const suspendUser = useCallback(
    (userId: string, reason: string) => {
      if (!can('suspend_users')) {
        return { success: false, error: 'Unauthorized: You lack permission to suspend users.' };
      }

      const target = users.find((u) => u.id === userId);
      if (!target) return { success: false, error: 'User not found.' };

      if (target.id === user?.id) {
        return { success: false, error: 'Admins cannot suspend their own account.' };
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: 'suspended', is_active: false, suspension_reason: reason } : u
        )
      );

      recordAudit(`Suspended user account (${target.full_name})`, 'user', userId, {
        reason,
        target_email: target.email,
        target_role: target.role_type,
      });

      return { success: true };
    },
    [can, users, user, recordAudit]
  );

  // 2. Reactivate User
  const reactivateUser = useCallback(
    (userId: string) => {
      if (!can('suspend_users')) {
        return { success: false, error: 'Unauthorized: You lack permission to modify user status.' };
      }

      const target = users.find((u) => u.id === userId);
      if (!target) return { success: false, error: 'User not found.' };

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: 'active', is_active: true, suspension_reason: undefined } : u
        )
      );

      recordAudit(`Reactivated user account (${target.full_name})`, 'user', userId, {
        target_email: target.email,
      });

      return { success: true };
    },
    [can, users, recordAudit]
  );

  // 3. Update User Platform Role (Strict RBAC Guardrail)
  const updateUserRole = useCallback(
    (userId: string, newRole: PlatformRole | null) => {
      if (!can('assign_platform_roles')) {
        return { success: false, error: 'Only Owner and Super Admin can manage platform roles.' };
      }

      const check = canManagePlatformRole(platformRole, user?.id || 'user-nadine', userId, newRole || 'support');
      if (!check.allowed) {
        return { success: false, error: check.reason };
      }

      const target = users.find((u) => u.id === userId);
      if (!target) return { success: false, error: 'Target user not found.' };

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                platform_role: newRole,
                role_type: newRole ? 'admin' : u.role_type === 'admin' ? 'talent' : u.role_type,
              }
            : u
        )
      );

      recordAudit(
        newRole ? `Assigned platform role '${newRole}' to ${target.full_name}` : `Revoked platform role from ${target.full_name}`,
        'platform_role',
        userId,
        { previous_role: target.platform_role, new_role: newRole }
      );

      return { success: true };
    },
    [can, platformRole, user, users, recordAudit]
  );

  // 4. Verify Organisation
  const verifyOrganization = useCallback(
    (orgId: string, decision: 'verified' | 'rejected' | 'requested_info', notes: string) => {
      if (!can('verify_organizations')) {
        return { success: false, error: 'Unauthorized: You lack permission to verify organisations.' };
      }

      const org = organizations.find((o) => o.id === orgId);
      if (!org) return { success: false, error: 'Organisation not found.' };

      const statusMap: Record<string, OrgVerificationStatus> = {
        verified: 'verified',
        rejected: 'rejected',
        requested_info: 'pending',
      };

      setOrganizations((prev) =>
        prev.map((o) =>
          o.id === orgId
            ? {
                ...o,
                verification_status: statusMap[decision],
                verified_at: decision === 'verified' ? new Date().toISOString() : o.verified_at,
                verified_by: decision === 'verified' ? user?.id || 'user-nadine' : null,
              }
            : o
        )
      );

      // Also update any pending moderation report for this org
      setModerationReports((prev) =>
        prev.map((r) =>
          r.target_id === orgId
            ? {
                ...r,
                status: decision === 'requested_info' ? 'in_review' : 'resolved',
                action_taken: `Admin decision: ${decision} with notes "${notes}"`,
                reviewed_by: user?.full_name || 'Nadine O.',
                reviewed_at: new Date().toISOString(),
              }
            : r
        )
      );

      recordAudit(`Organisation verification ${decision}: ${org.name}`, 'organization', orgId, {
        decision,
        notes,
        org_name: org.name,
      });

      return { success: true };
    },
    [can, organizations, user, recordAudit]
  );

  // 5. Moderate Job Listing
  const moderateJob = useCallback(
    (reportId: string, decision: 'dismiss' | 'request_edit' | 'remove_listing' | 'suspend_org', notes: string) => {
      if (!can('moderate_jobs')) {
        return { success: false, error: 'Unauthorized: You lack permission to moderate jobs.' };
      }

      const report = moderationReports.find((r) => r.id === reportId);
      if (!report) return { success: false, error: 'Moderation report not found.' };

      // Update report status
      setModerationReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: 'resolved',
                action_taken: `${decision}: ${notes}`,
                reviewed_by: user?.full_name || 'Nadine O.',
                reviewed_at: new Date().toISOString(),
              }
            : r
        )
      );

      // If action is remove_listing, close or remove the job
      if (decision === 'remove_listing') {
        setJobs((prev) =>
          prev.map((j) => (j.id === report.target_id ? { ...j, status: 'closed', moderation_flag: 'removed_by_admin' } : j))
        );
      }

      recordAudit(`Job moderation action (${decision}) on "${report.target_title}"`, 'job_moderation', report.target_id, {
        decision,
        notes,
        flag_type: report.flag_type,
      });

      return { success: true };
    },
    [can, moderationReports, user, recordAudit]
  );

  // 6. Platform Taxonomy Additions
  const addCategory = useCallback(
    (name: string) => {
      if (!can('manage_taxonomy')) return { success: false, error: 'Permission denied.' };
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newCat: AdminTaxonomyCategory = {
        id: `cat-${Date.now()}`,
        name,
        slug,
        jobs_count: 0,
        is_active: true,
      };
      setCategories((prev) => [...prev, newCat]);
      recordAudit(`Added job category "${name}"`, 'taxonomy', newCat.id);
      return { success: true };
    },
    [can, recordAudit]
  );

  const toggleCategory = useCallback(
    (categoryId: string) => {
      if (!can('manage_taxonomy')) return;
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, is_active: !c.is_active } : c))
      );
      recordAudit(`Toggled category visibility`, 'taxonomy', categoryId);
    },
    [can, recordAudit]
  );

  const addSkill = useCallback(
    (name: string, category: string) => {
      if (!can('manage_taxonomy')) return { success: false, error: 'Permission denied.' };
      const newSkill: AdminTaxonomySkill = {
        id: `sk-${Date.now()}`,
        name,
        category,
        usage_count: 0,
      };
      setSkills((prev) => [...prev, newSkill]);
      recordAudit(`Added skill "${name}" to category "${category}"`, 'taxonomy', newSkill.id);
      return { success: true };
    },
    [can, recordAudit]
  );

  const addLocation = useCallback(
    (regionName: string, cities: string[]) => {
      if (!can('manage_taxonomy')) return { success: false, error: 'Permission denied.' };
      const code = regionName.slice(0, 3).toUpperCase();
      const newLoc: AdminTaxonomyLocation = {
        code,
        name: regionName,
        cities,
        is_active: true,
      };
      setLocations((prev) => [...prev, newLoc]);
      recordAudit(`Added location region "${regionName}" with ${cities.length} cities`, 'taxonomy', code);
      return { success: true };
    },
    [can, recordAudit]
  );

  // 7. Plan Price Update
  const updatePlanPrice = useCallback(
    (planId: string, priceXaf: number) => {
      if (!can('manage_billing')) return { success: false };
      setSubscriptionPlans((prev) =>
        prev.map((p) =>
          p.id === planId
            ? {
                ...p,
                price_xaf: priceXaf,
                price_display: `${priceXaf.toLocaleString()} XAF / month`,
              }
            : p
        )
      );
      recordAudit(`Updated pricing for plan "${planId}" to ${priceXaf} XAF`, 'billing', planId);
      return { success: true };
    },
    [can, recordAudit]
  );

  // 8. Announcements
  const addAnnouncement = useCallback(
    (announcement: Omit<PlatformAnnouncement, 'id' | 'created_at' | 'created_by'>) => {
      if (!can('manage_announcements')) return;
      const newAnn: PlatformAnnouncement = {
        ...announcement,
        id: `ann-${Date.now()}`,
        created_at: new Date().toISOString(),
        created_by: user?.full_name || 'Nadine O.',
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
      recordAudit(`Published platform announcement: "${announcement.title}"`, 'announcement', newAnn.id);
    },
    [can, user, recordAudit]
  );

  const toggleAnnouncement = useCallback(
    (id: string) => {
      if (!can('manage_announcements')) return;
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a))
      );
      recordAudit(`Toggled platform announcement status`, 'announcement', id);
    },
    [can, recordAudit]
  );

  const deleteAnnouncement = useCallback(
    (id: string) => {
      if (!can('manage_announcements')) return;
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      recordAudit(`Deleted platform announcement`, 'announcement', id);
    },
    [can, recordAudit]
  );

  // 9. Platform Settings Update
  const updateSettings = useCallback(
    (newSettings: Partial<PlatformSettingsState>) => {
      if (!can('edit_users')) return;
      setSettings((prev) => ({ ...prev, ...newSettings }));
      recordAudit('Updated platform system settings', 'platform_settings', 'global', newSettings);
    },
    [can, recordAudit]
  );

  // 10. Export Audit CSV
  const exportAuditCSV = useCallback(() => {
    const headers = ['Timestamp', 'Actor Name', 'Action', 'Target Type', 'Target ID', 'Metadata'];
    const rows = auditLogs.map((log) => [
      log.created_at,
      `"${log.actor_name?.replace(/"/g, '""') || ''}"`,
      `"${log.action.replace(/"/g, '""')}"`,
      log.target_type,
      log.target_id || '',
      `"${JSON.stringify(log.metadata || {}).replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `workdey_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [auditLogs]);

  // Compute Real Metrics Directly from Data (No Fake Hardcoding)
  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const talentCount = users.filter((u) => u.role_type === 'talent').length;
    const employerCount = users.filter((u) => u.role_type === 'employer').length;
    const totalOrgs = organizations.length;
    const pendingVerifications = organizations.filter((o) => o.verification_status === 'pending').length;
    const verifiedOrgs = organizations.filter((o) => o.verification_status === 'verified').length;
    const activeJobs = jobs.filter((j) => j.status === 'open').length;
    const pendingModeration = moderationReports.filter((r) => r.status === 'open' && r.target_type === 'job').length;
    const openReports = moderationReports.filter((r) => r.status === 'open').length;
    const totalApplications = SEED_APPLICATIONS.length;
    const activeSubscribers = subscribedOrgs.filter((s) => s.status === 'active').length;
    const monthlyRevenueXaf = subscribedOrgs
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => sum + s.amount_xaf, 0);

    return {
      totalUsers,
      talentCount,
      employerCount,
      totalOrgs,
      pendingVerifications,
      verifiedOrgs,
      activeJobs,
      pendingModeration,
      openReports,
      totalApplications,
      monthlyRevenueXaf,
      activeSubscribers,
    };
  }, [users, organizations, jobs, moderationReports, subscribedOrgs]);

  return (
    <AdminContext.Provider
      value={{
        users,
        organizations,
        jobs,
        moderationReports,
        auditLogs,
        categories,
        skills,
        locations,
        subscriptionPlans,
        subscribedOrgs,
        announcements,
        settings,
        metrics,
        can,
        suspendUser,
        reactivateUser,
        updateUserRole,
        verifyOrganization,
        moderateJob,
        addCategory,
        toggleCategory,
        addSkill,
        addLocation,
        updatePlanPrice,
        addAnnouncement,
        toggleAnnouncement,
        deleteAnnouncement,
        updateSettings,
        exportAuditCSV,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
