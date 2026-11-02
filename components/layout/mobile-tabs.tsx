'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Home,
  Briefcase,
  FileCheck,
  Bot,
  User,
  GitPullRequest,
  Plus,
  MoreHorizontal,
  LayoutDashboard,
  ShieldCheck,
  Users,
  FileText,
} from 'lucide-react';

export function MobileTabs() {
  const pathname = usePathname();
  const { activeWorkspace } = useAuth();

  const isEmployer = activeWorkspace === 'employer';

  // 1. Administration Mobile Tabs (Graphite/Navy Theme)
  if (activeWorkspace === 'admin') {
    const adminTabs = [
      { name: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
      { name: 'Queue', href: '/admin/verification', icon: ShieldCheck },
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Audit', href: '/admin/audit', icon: FileText },
    ];

    return (
      <nav
        aria-label="Mobile Administration Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 liquid-glass-dark border-t border-[#223247] px-3 py-1 flex items-center justify-around h-16 safe-bottom shadow-2xl"
      >
        {adminTabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-[#E8A317] font-semibold bg-[#162436] border border-[#223247] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]'
                  : 'text-[#A0AEC0] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-tight font-medium tracking-tight truncate">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // 2. Employer Mobile Tabs (Blue Accent Theme)
  if (isEmployer) {
    const employerTabs = [
      { name: 'Home', href: '/employer/dashboard', icon: Home },
      { name: 'Jobs', href: '/employer/jobs', icon: Briefcase },
      { name: 'Post', href: '/employer/jobs/create', icon: Plus, isPrimary: true },
      { name: 'Pipeline', href: '/employer/pipeline', icon: GitPullRequest },
      { name: 'Team', href: '/employer/team', icon: MoreHorizontal },
    ];

    return (
      <nav
        aria-label="Mobile Employer Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 liquid-glass border-t border-[#E2E7EE] px-3 py-1 flex items-center justify-around h-16 safe-bottom shadow-lg"
      >
        {employerTabs.map((tab) => {
          if (tab.isPrimary) {
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="flex items-center justify-center -mt-5 w-12 h-12 rounded-2xl bg-[#2552C2] text-white shadow-[0_8px_20px_rgba(37,82,194,0.35)] hover:bg-[#1E429F] transition-transform active:scale-95 touch-target"
                title="Post a job"
                aria-label="Post a new job"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </Link>
            );
          }

          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-[#2552C2] font-semibold bg-white border border-[#E2E7EE] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(11,28,47,0.06)]'
                  : 'text-[#5A6779] hover:text-[#0B1C2F]'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-tight font-medium tracking-tight truncate">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // 3. Talent Workspace Tabs (Teal Accent Theme)
  const talentTabs = [
    { name: 'Home', href: '/talent/dashboard', icon: Home },
    { name: 'Jobs', href: '/talent/jobs', icon: Briefcase },
    { name: 'Apps', href: '/talent/applications', icon: FileCheck },
    { name: 'Coach', href: '/talent/coach', icon: Bot },
    { name: 'Profile', href: '/talent/profile', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Talent Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 liquid-glass border-t border-[#E2E7EE] px-3 py-1 flex items-center justify-around h-16 safe-bottom shadow-lg"
    >
      {talentTabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
        const Icon = tab.icon;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 rounded-xl transition-all duration-150 ${
              isActive
                ? 'text-[#0B7F7A] font-semibold bg-white border border-[#E2E7EE] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(11,28,47,0.06)]'
                : 'text-[#5A6779] hover:text-[#0B1C2F]'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight font-medium tracking-tight truncate">
              {tab.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
