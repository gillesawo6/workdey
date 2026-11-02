'use client';

import React from 'react';
import Link from 'next/link';
import { WorkspaceSidebar } from '@/components/layout/workspace-sidebar';
import { MobileTabs } from '@/components/layout/mobile-tabs';
import { CommandMenu } from '@/components/layout/command-menu';
import { WorkspaceSwitcher } from '@/components/layout/workspace-switcher';
import { useAuth } from '@/lib/auth/auth-context';
import { ShieldAlert, Search, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';

import { AdminProvider } from '@/lib/admin/admin-context';

export default function AdminWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { platformRole, switchDemoPersona } = useAuth();

  // Access denial guard if user doesn't possess platform admin privileges
  if (!platformRole) {
    return (
      <div className="min-h-screen bg-[#111D2C] text-[#E7ECF3] flex items-center justify-center p-6">
        <div className="max-w-md w-full admin-panel rounded-xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#B42318]/20 text-[#B42318] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            You do not have access
          </h2>
          <p className="text-xs text-[#A0AEC0] leading-relaxed">
            Platform governance and moderation consoles require verified platform administration privileges.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => switchDemoPersona('admin_nadine')}
              className="w-full py-2.5 px-4 rounded-lg bg-[#E8A317] text-[#0B1C2F] text-xs font-bold hover:bg-[#d69514] transition-colors"
            >
              Switch to Nadine O. (Demo Super Admin)
            </button>
            <Link
              href="/talent/dashboard"
              className="w-full py-2 px-4 rounded-lg border border-[#223247] text-xs text-[#A0AEC0] hover:text-white transition-colors"
            >
              Return to Talent Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminProvider>
      <div className="min-h-screen flex bg-[#111D2C] text-[#E7ECF3]">
        {/* 1. Admin Dark Sidebar */}
        <WorkspaceSidebar />

        {/* 2. Main Admin Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
          {/* Top Header Bar */}
          <header className="h-16 bg-[#162436] border-b border-[#223247] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#E8A317] font-bold px-2 py-0.5 rounded bg-[#E8A317]/10 border border-[#E8A317]/20">
                PRODUCTION
              </span>
              <h1 className="text-sm font-bold text-white tracking-tight">
                Platform Administration
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Search */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('workdey:open-search'))}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#A0AEC0] bg-[#111D2C] hover:text-white rounded-lg border border-[#223247] transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search users or reports</span>
                <kbd className="hidden sm:inline px-1 py-0.5 text-[10px] font-mono bg-[#162436] rounded border border-[#223247]">⌘K</kbd>
              </button>

              {/* Quick Review Queue CTA */}
              <Link
                href="/admin/moderation"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#E8A317] text-[#0B1C2F] hover:bg-[#d69514] transition-colors"
              >
                Review queue (14)
              </Link>

              {/* Workspace Switcher */}
              <WorkspaceSwitcher />
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-150">
            {children}
          </main>

          {/* Admin Footer */}
          <footer className="mt-auto px-6 py-4 text-xs text-[#A0AEC0] flex items-center justify-between border-t border-[#223247] max-w-7xl w-full mx-auto">
            <span>WorkDey Platform Admin Console · v1.0.0</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[#1A7F4B]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A7F4B] animate-pulse" />
                All systems operational
              </span>
              <Link href="/admin/audit" className="hover:text-white">
                Audit log
              </Link>
            </div>
          </footer>
        </div>

        {/* 3. Mobile Navigation */}
        <MobileTabs />

        {/* 4. ⌘K Command Menu */}
        <CommandMenu />
      </div>
    </AdminProvider>
  );
}
