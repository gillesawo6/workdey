'use client';

import React from 'react';
import { WorkspaceSidebar } from '@/components/layout/workspace-sidebar';
import { MobileTabs } from '@/components/layout/mobile-tabs';
import { CommandMenu } from '@/components/layout/command-menu';
import { WorkspaceSwitcher } from '@/components/layout/workspace-switcher';
import { useAuth } from '@/lib/auth/auth-context';
import { Bell, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function TalentWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isSupabaseLive } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#F4F6F9] text-[#0B1C2F]">
      {/* 1. Desktop & Tablet Sidebar */}
      <WorkspaceSidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#E2E7EE] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-[#0B1C2F] tracking-tight">
              Talent Workspace
            </h1>
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-[#E6F5F3] text-[#0B7F7A] font-semibold border border-[#0B7F7A]/20">
              Douala, Cameroon
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick search shortcut */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('workdey:open-search'))}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#5A6779] bg-[#F4F6F9] hover:bg-[#E2E7EE] rounded-lg border border-[#E2E7EE] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search jobs or skills</span>
              <kbd className="hidden sm:inline px-1 py-0.5 text-[10px] font-mono bg-white rounded border border-[#E2E7EE]">⌘K</kbd>
            </button>

            {/* Notifications */}
            <Link
              href="/talent/notifications"
              className="p-2 text-[#5A6779] hover:text-[#0B1C2F] rounded-lg hover:bg-[#F4F6F9] transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0B7F7A]" />
            </Link>

            {/* Workspace & Persona Switcher */}
            <WorkspaceSwitcher />
          </div>
        </header>

        {/* Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-200">
          {children}
        </main>

        {/* Quiet footer inside workspace */}
        <footer className="mt-auto px-6 py-4 text-xs text-[#5A6779] flex items-center justify-between border-t border-[#E2E7EE]/60 max-w-7xl w-full mx-auto">
          <span>© {new Date().getFullYear()} WorkDey</span>
          <div className="flex items-center gap-4">
            <Link href="/help" className="hover:text-[#0B1C2F]">Help</Link>
            <Link href="/privacy" className="hover:text-[#0B1C2F]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#0B1C2F]">Terms</Link>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A7F4B]" />
              All systems operational
            </span>
          </div>
        </footer>
      </div>

      {/* 3. Mobile 5-Tab Bar */}
      <MobileTabs />

      {/* 4. ⌘K Command Menu */}
      <CommandMenu />
    </div>
  );
}
