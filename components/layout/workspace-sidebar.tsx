'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, WorkspaceType } from '@/lib/auth/auth-context';
import { BrandMark } from './brand-mark';
import { WorkspaceSwitcher } from './workspace-switcher';
import {
  LayoutDashboard,
  Compass,
  Bookmark,
  FileCheck,
  Bot,
  Route,
  User,
  Bell,
  Settings,
  HelpCircle,
  Briefcase,
  Users,
  GitPullRequest,
  Calendar,
  BarChart3,
  Building,
  ShieldCheck,
  Flag,
  FileText,
  Cpu,
  Layers,
  Lock,
  Search,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const { activeWorkspace, user, activeOrganization } = useAuth();

  // Navigation definition for Talent Workspace (Teal accent #0B7F7A)
  const talentNav: SidebarGroup[] = [
    {
      label: 'FIND WORK',
      items: [
        { name: 'Dashboard', href: '/talent/dashboard', icon: LayoutDashboard },
        { name: 'Discover jobs', href: '/talent/jobs', icon: Compass },
        { name: 'Saved jobs', href: '/talent/saved', icon: Bookmark, badge: 12 },
        { name: 'Applications', href: '/talent/applications', icon: FileCheck, badge: 6 },
      ],
    },
    {
      label: 'GROW',
      items: [
        { name: 'AI career coach', href: '/talent/coach', icon: Bot },
        { name: 'Career roadmap', href: '/talent/roadmap', icon: Route },
        { name: 'Profile and CV', href: '/talent/profile', icon: User },
      ],
    },
    {
      label: 'ACCOUNT',
      items: [
        { name: 'Notifications', href: '/talent/notifications', icon: Bell },
        { name: 'Settings', href: '/talent/settings', icon: Settings },
      ],
    },
  ];

  // Navigation definition for Employer Workspace (Blue accent #2552C2)
  const employerNav: SidebarGroup[] = [
    {
      label: 'HIRING',
      items: [
        { name: 'Dashboard', href: '/employer/dashboard', icon: LayoutDashboard },
        { name: 'Jobs', href: '/employer/jobs', icon: Briefcase, badge: 7 },
        { name: 'Applicants', href: '/employer/applicants', icon: Users, badge: 64 },
        { name: 'Pipeline', href: '/employer/pipeline', icon: GitPullRequest },
        { name: 'Interviews', href: '/employer/interviews', icon: Calendar, badge: 5 },
      ],
    },
    {
      label: 'INSIGHTS',
      items: [
        { name: 'Analytics', href: '/employer/analytics', icon: BarChart3 },
      ],
    },
    {
      label: 'ORGANISATION',
      items: [
        { name: 'Team', href: '/employer/team', icon: Users },
        { name: 'Organisation profile', href: '/employer/profile', icon: Building },
        { name: 'Settings', href: '/employer/settings', icon: Settings },
      ],
    },
  ];

  // Navigation definition for Admin Console (Amber accent #E8A317, Dark Surface)
  const adminNav: SidebarGroup[] = [
    {
      label: 'OPERATE',
      items: [
        { name: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Verification', href: '/admin/verification', icon: ShieldCheck, badge: 9 },
        { name: 'Job moderation', href: '/admin/moderation', icon: Flag, badge: 14 },
        { name: 'Reports', href: '/admin/reports', icon: FileText, badge: 5 },
      ],
    },
    {
      label: 'PLATFORM',
      items: [
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Subscriptions', href: '/admin/subscriptions', icon: Layers },
        { name: 'AI management', href: '/admin/ai-management', icon: Cpu },
      ],
    },
    {
      label: 'GOVERNANCE',
      items: [
        { name: 'Admins and roles', href: '/admin/governance', icon: Lock },
        { name: 'Audit log', href: '/admin/audit', icon: FileCheck },
        { name: 'Platform settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const currentNav =
    activeWorkspace === 'admin'
      ? adminNav
      : activeWorkspace === 'employer'
      ? employerNav
      : talentNav;

  const isAdmin = activeWorkspace === 'admin';
  const isEmployer = activeWorkspace === 'employer';

  const accentColorClass = isAdmin
    ? 'bg-[#E8A317]'
    : isEmployer
    ? 'bg-[#2552C2]'
    : 'bg-[#0B7F7A]';

  const activeItemTextClass = isAdmin
    ? 'text-white font-semibold'
    : isEmployer
    ? 'text-[#2552C2] font-semibold'
    : 'text-[#0B7F7A] font-semibold';

  const activeItemBgClass = isAdmin
    ? 'bg-[#223247]/70'
    : isEmployer
    ? 'bg-[#EAF0FC]'
    : 'bg-[#E6F5F3]';

  return (
    <aside
      className={`hidden md:flex flex-col flex-shrink-0 transition-all duration-200 select-none ${
        isAdmin
          ? 'bg-[#111D2C] text-[#E7ECF3] border-r border-[#223247]'
          : 'bg-white text-[#0B1C2F] border-r border-[#E2E7EE]'
      } w-[72px] xl:w-64 min-h-screen`}
    >
      {/* 1. Header with Logo & Workspace Switcher */}
      <div
        className={`h-16 flex items-center justify-between px-4 border-b ${
          isAdmin ? 'border-[#223247]' : 'border-[#E2E7EE]'
        }`}
      >
        <div className="hidden xl:flex items-center justify-between w-full">
          <BrandMark size="sm" variant={isAdmin ? 'dark' : 'light'} />
          <WorkspaceSwitcher />
        </div>
        <div className="xl:hidden flex justify-center w-full">
          <BrandMark size="sm" variant={isAdmin ? 'dark' : 'light'} showWordmark={false} />
        </div>
      </div>

      {/* 2. Quick Search Trigger (⌘K) */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={() => {
            // Trigger ⌘K dialog
            window.dispatchEvent(new CustomEvent('workdey:open-search'));
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
            isAdmin
              ? 'bg-[#162436] text-[#A0AEC0] hover:text-white border border-[#223247]'
              : 'bg-[#F4F6F9] text-[#5A6779] hover:text-[#0B1C2F] border border-[#E2E7EE]'
          }`}
          title="Search or jump to (⌘K)"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden xl:inline truncate">Search or jump to</span>
          </div>
          <kbd
            className={`hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded ${
              isAdmin ? 'bg-[#223247] text-[#A0AEC0]' : 'bg-white text-[#5A6779] border border-[#E2E7EE]'
            }`}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 3. Grouped Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {currentNav.map((group) => (
          <div key={group.label} className="space-y-1">
            <h3
              className={`hidden xl:block px-3 text-[10px] font-bold tracking-wider uppercase mb-1.5 ${
                isAdmin ? 'text-[#5A6779]' : 'text-[#5A6779]'
              }`}
            >
              {group.label}
            </h3>

            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors duration-150 ${
                    isActive
                      ? `${activeItemBgClass} ${activeItemTextClass}`
                      : isAdmin
                      ? 'text-[#A0AEC0] hover:text-white hover:bg-[#162436]'
                      : 'text-[#3D4A5C] hover:text-[#0B1C2F] hover:bg-[#F4F6F9]'
                  }`}
                  title={item.name}
                >
                  {/* Active 3px accent bar */}
                  {isActive && (
                    <span
                      className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r ${accentColorClass}`}
                    />
                  )}

                  <Icon className="w-4 h-4 flex-shrink-0" />

                  {/* Label (desktop only) */}
                  <span className="hidden xl:inline truncate flex-1 font-medium">
                    {item.name}
                  </span>

                  {/* Count badge (only where work is waiting) */}
                  {item.badge !== undefined && (
                    <>
                      <span
                        className={`hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-bold rounded-md tnum ${
                          isAdmin
                            ? 'bg-[#E8A317]/20 text-[#E8A317]'
                            : isEmployer
                            ? 'bg-[#2552C2]/10 text-[#2552C2]'
                            : 'bg-[#0B7F7A]/10 text-[#0B7F7A]'
                        }`}
                      >
                        {item.badge}
                      </span>
                      {/* Tablet dot indicator */}
                      <span
                        className={`xl:hidden w-1.5 h-1.5 rounded-full ${accentColorClass}`}
                      />
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* 4. Bottom System Status */}
      <div
        className={`p-3 border-t text-[11px] flex items-center gap-2 ${
          isAdmin ? 'border-[#223247] text-[#A0AEC0]' : 'border-[#E2E7EE] text-[#5A6779]'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#1A7F4B] flex-shrink-0" />
        <span className="hidden xl:inline truncate">All systems operational</span>
      </div>
    </aside>
  );
}
