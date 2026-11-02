import { PlatformRole, OrgRole } from '@/lib/types/database';

export type AdminPermission =
  | 'view_overview'
  | 'view_users'
  | 'edit_users'
  | 'suspend_users'
  | 'assign_platform_roles'
  | 'verify_organizations'
  | 'moderate_jobs'
  | 'manage_billing'
  | 'edit_ai_settings'
  | 'view_audit_logs'
  | 'manage_taxonomy'
  | 'view_analytics'
  | 'manage_announcements';

/**
 * Platform Role Hierarchy & Permissions Matrix
 * Owner > Super Admin > Admin > Moderator > Support
 * 
 * Strict rule: Organisation-level roles (owner, admin, recruiter) never grant
 * platform authority. Platform permissions must originate exclusively from PlatformRole.
 */
export const PLATFORM_ROLE_HIERARCHY: Record<PlatformRole, number> = {
  owner: 100,
  super_admin: 80,
  admin: 60,
  moderator: 40,
  support: 20,
};

export const PLATFORM_PERMISSIONS: Record<PlatformRole, AdminPermission[]> = {
  owner: [
    'view_overview',
    'view_users',
    'edit_users',
    'suspend_users',
    'assign_platform_roles',
    'verify_organizations',
    'moderate_jobs',
    'manage_billing',
    'edit_ai_settings',
    'view_audit_logs',
    'manage_taxonomy',
    'view_analytics',
    'manage_announcements',
  ],
  super_admin: [
    'view_overview',
    'view_users',
    'edit_users',
    'suspend_users',
    'assign_platform_roles',
    'verify_organizations',
    'moderate_jobs',
    'manage_billing',
    'edit_ai_settings',
    'view_audit_logs',
    'manage_taxonomy',
    'view_analytics',
    'manage_announcements',
  ],
  admin: [
    'view_overview',
    'view_users',
    'edit_users',
    'suspend_users',
    'verify_organizations',
    'moderate_jobs',
    'manage_billing',
    'edit_ai_settings',
    'view_audit_logs',
    'manage_taxonomy',
    'view_analytics',
    'manage_announcements',
  ],
  moderator: [
    'view_overview',
    'view_users',
    'verify_organizations',
    'moderate_jobs',
    'view_audit_logs',
    'view_analytics',
  ],
  support: [
    'view_overview',
    'view_users',
    'view_analytics',
  ],
};

/**
 * Checks if a platform role has a specific permission
 */
export function hasPlatformPermission(
  role: PlatformRole | null | undefined,
  permission: AdminPermission
): boolean {
  if (!role) return false;
  const permissions = PLATFORM_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

/**
 * Check if the actor can modify or reassign another user's platform role
 * Strict Guardrails:
 * - Only Owner and Super Admin can manage platform roles
 * - An admin cannot edit their own role
 * - Cannot assign a role higher or equal to one's own role rank (except Owner)
 */
export function canManagePlatformRole(
  actorRole: PlatformRole | null | undefined,
  actorUserId: string,
  targetUserId: string,
  targetDesiredRole: PlatformRole
): { allowed: boolean; reason?: string } {
  if (!actorRole) {
    return { allowed: false, reason: 'Actor possesses no platform role.' };
  }

  if (actorUserId === targetUserId) {
    return { allowed: false, reason: 'Admins cannot modify their own platform role.' };
  }

  if (actorRole !== 'owner' && actorRole !== 'super_admin') {
    return { allowed: false, reason: 'Only Owner and Super Admin can assign platform roles.' };
  }

  if (actorRole === 'super_admin' && targetDesiredRole === 'owner') {
    return { allowed: false, reason: 'Only the Platform Owner can grant Owner authority.' };
  }

  return { allowed: true };
}
