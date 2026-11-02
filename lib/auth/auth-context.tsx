'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
  UserProfile,
  TalentProfile,
  Organization,
  OrgRole,
  PlatformRole,
} from '@/lib/types/database';
import {
  SEED_USERS,
  SEED_TALENT_PROFILES,
  SEED_ORGANIZATIONS,
  SEED_MEMBERSHIPS,
  SEED_PLATFORM_ROLES,
} from '@/lib/data/seed-data';

export type WorkspaceType = 'talent' | 'employer' | 'admin';

interface AuthContextType {
  // Authentication status
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseLive: boolean;
  authError: string | null;

  // Active identity
  user: UserProfile | null;
  talentProfile: TalentProfile | null;
  organizations: (Organization & { role: OrgRole })[];
  activeOrganization: (Organization & { role: OrgRole }) | null;
  platformRole: PlatformRole | null;

  // Active Workspace
  activeWorkspace: WorkspaceType;
  setActiveWorkspace: (workspace: WorkspaceType) => void;
  setActiveOrganizationId: (orgId: string) => void;

  // Auth Operations
  signIn: (email: string, password?: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role: 'talent' | 'employer') => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;

  // Quick Persona Switcher for developer evaluation & preview
  switchDemoPersona: (persona: 'aicha' | 'savanna_owner' | 'admin_nadine') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Identity state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(SEED_USERS[0]); // Default: Aïcha Nkeng
  const [talentProfile, setTalentProfile] = useState<TalentProfile | null>(SEED_TALENT_PROFILES[0]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<WorkspaceType>('talent');
  const [activeOrgId, setActiveOrgId] = useState<string>(SEED_ORGANIZATIONS[0].id);

  const isSupabaseLive = useMemo(() => isSupabaseConfigured(), []);

  // Compute organization memberships for the current user
  const userOrganizations = useMemo(() => {
    if (!currentUser) return [];
    const memberships = SEED_MEMBERSHIPS.filter((m) => m.user_id === currentUser.id);
    return memberships
      .map((m) => {
        const org = SEED_ORGANIZATIONS.find((o) => o.id === m.organization_id);
        if (!org) return null;
        return {
          ...org,
          role: m.role,
        };
      })
      .filter(Boolean) as (Organization & { role: OrgRole })[];
  }, [currentUser]);

  // Compute active organization
  const activeOrganization = useMemo(() => {
    if (userOrganizations.length === 0) return null;
    return userOrganizations.find((o) => o.id === activeOrgId) || userOrganizations[0];
  }, [userOrganizations, activeOrgId]);

  // Compute platform role for current user
  const platformRole = useMemo<PlatformRole | null>(() => {
    if (!currentUser) return null;
    const roleRecord = SEED_PLATFORM_ROLES.find((r) => r.user_id === currentUser.id);
    return roleRecord ? roleRecord.role : null;
  }, [currentUser]);

  // Safe workspace switcher with RBAC guards
  const setActiveWorkspace = useCallback(
    (ws: WorkspaceType) => {
      if (ws === 'admin' && !platformRole) {
        setAuthError('Permission denied: You do not possess platform administration privileges.');
        return;
      }
      if (ws === 'employer' && userOrganizations.length === 0) {
        setAuthError('No organisation found: You must create or join an organisation to access Employer workspace.');
        return;
      }
      setAuthError(null);
      setActiveWorkspaceState(ws);
    },
    [platformRole, userOrganizations]
  );

  const setActiveOrganizationId = useCallback((orgId: string) => {
    setActiveOrgId(orgId);
  }, []);

  // Initialize live Supabase listener if configured
  useEffect(() => {
    async function initSupabaseAuth() {
      if (!isSupabaseConfigured()) {
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          // Fetch user profile from Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setCurrentUser(profile);
          } else {
            setCurrentUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              language_pref: 'en',
              is_active: true,
              created_at: new Date().toISOString(),
            });
          }

          // Fetch talent profile
          const { data: tProfile } = await supabase
            .from('talent_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          if (tProfile) setTalentProfile(tProfile);
        }

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (currentSession?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
              if (profile) setCurrentUser(profile);
            } else {
              setCurrentUser(null);
              setTalentProfile(null);
            }
          }
        );

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (err: any) {
        console.warn('Supabase auth initialization error:', err.message);
      } finally {
        setIsLoading(false);
      }
    }

    initSupabaseAuth();
  }, []);

  // Live Supabase Sign In with preview fallback
  const signIn = useCallback(
    async (email: string, password?: string): Promise<{ error: string | null }> => {
      setAuthError(null);
      setIsLoading(true);

      if (isSupabaseConfigured()) {
        const supabase = createClient();
        if (!supabase) {
          setIsLoading(false);
          return { error: 'Supabase client creation failed.' };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'TestPassword123!',
        });

        setIsLoading(false);
        if (error) {
          setAuthError(error.message);
          return { error: error.message };
        }
        return { error: null };
      }

      // Preview / Fallback sign-in simulation
      const found = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentUser(found);
        if (found.id === 'user-aicha') {
          setTalentProfile(SEED_TALENT_PROFILES[0]);
          setActiveWorkspaceState('talent');
        } else if (found.id === 'user-nadine') {
          setActiveWorkspaceState('admin');
        } else {
          setActiveWorkspaceState('employer');
        }
        setIsLoading(false);
        return { error: null };
      }

      // Dynamic demo user
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        language_pref: 'en',
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setCurrentUser(newUser);
      setActiveWorkspaceState('talent');
      setIsLoading(false);
      return { error: null };
    },
    []
  );

  // Live Supabase Sign Up
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      role: 'talent' | 'employer'
    ): Promise<{ error: string | null }> => {
      setAuthError(null);
      setIsLoading(true);

      if (isSupabaseConfigured()) {
        const supabase = createClient();
        if (!supabase) {
          setIsLoading(false);
          return { error: 'Supabase client unavailable' };
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              initial_role: role,
            },
          },
        });

        setIsLoading(false);
        if (error) {
          setAuthError(error.message);
          return { error: error.message };
        }
        return { error: null };
      }

      // Preview signup
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        full_name: fullName,
        language_pref: 'en',
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setCurrentUser(newUser);

      if (role === 'talent') {
        const newTalent: TalentProfile = {
          id: `talent-${Date.now()}`,
          user_id: newUser.id,
          city: 'Douala',
          region: 'Littoral',
          country: 'Cameroon',
          work_style_pref: 'hybrid',
          currency: 'XAF',
          profile_strength_pct: 40,
          is_open_to_work: true,
          share_cv_with_employers: true,
          allow_ai_matching: true,
          hide_current_employer: false,
          created_at: new Date().toISOString(),
        };
        setTalentProfile(newTalent);
        setActiveWorkspaceState('talent');
      } else {
        setActiveWorkspaceState('employer');
      }

      setIsLoading(false);
      return { error: null };
    },
    []
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    setCurrentUser(null);
    setTalentProfile(null);
    setActiveWorkspaceState('talent');
    setIsLoading(false);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/update-password`,
        });
        return { error: error ? error.message : null };
      }
    }
    return { error: null };
  }, []);

  // Fast switch for developer persona testing
  const switchDemoPersona = useCallback(
    (persona: 'aicha' | 'savanna_owner' | 'admin_nadine') => {
      if (persona === 'aicha') {
        setCurrentUser(SEED_USERS[0]);
        setTalentProfile(SEED_TALENT_PROFILES[0]);
        setActiveWorkspaceState('talent');
      } else if (persona === 'savanna_owner') {
        setCurrentUser(SEED_USERS[1]);
        setTalentProfile(null);
        setActiveWorkspaceState('employer');
        setActiveOrgId('org-savanna');
      } else if (persona === 'admin_nadine') {
        setCurrentUser(SEED_USERS[2]);
        setTalentProfile(null);
        setActiveWorkspaceState('admin');
      }
      setAuthError(null);
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(currentUser),
        isLoading,
        isSupabaseLive,
        authError,
        user: currentUser,
        talentProfile,
        organizations: userOrganizations,
        activeOrganization,
        platformRole,
        activeWorkspace,
        setActiveWorkspace,
        setActiveOrganizationId,
        signIn,
        signUp,
        signOut,
        resetPassword,
        switchDemoPersona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
