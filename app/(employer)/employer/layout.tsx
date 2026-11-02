'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WorkspaceSidebar } from '@/components/layout/workspace-sidebar';
import { MobileTabs } from '@/components/layout/mobile-tabs';
import { CommandMenu } from '@/components/layout/command-menu';
import { WorkspaceSwitcher } from '@/components/layout/workspace-switcher';
import { EmployerProvider, useEmployer } from '@/lib/employer/employer-context';
import {
  Plus,
  Bell,
  Search,
  ShieldCheck,
  Building,
  ChevronDown,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

function EmployerHeader() {
  const { activeOrg, userOrgs, switchOrganization, createOrganization } = useEmployer();
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New org modal form state
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgSector, setNewOrgSector] = useState('Technology & Digital Services');
  const [newOrgSize, setNewOrgSize] = useState('10–50 employees');
  const [newOrgCity, setNewOrgCity] = useState('Douala');
  const [newOrgRegion, setNewOrgRegion] = useState('Littoral');
  const [newOrgWebsite, setNewOrgWebsite] = useState('');
  const [newOrgTagline, setNewOrgTagline] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    createOrganization({
      name: newOrgName.trim(),
      sector: newOrgSector,
      company_size: newOrgSize,
      city: newOrgCity,
      region: newOrgRegion,
      website: newOrgWebsite.trim() || undefined,
      tagline: newOrgTagline.trim() || undefined,
    });

    setNewOrgName('');
    setNewOrgWebsite('');
    setNewOrgTagline('');
    setShowCreateModal(false);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E2E7EE] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {/* Organisation selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#E2E7EE] hover:bg-[#F4F6F9] transition-colors text-left"
            >
              <div className="w-6 h-6 rounded bg-[#2552C2] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                {activeOrg?.name.slice(0, 2).toUpperCase() || 'WD'}
              </div>
              <div className="max-w-[140px] sm:max-w-[200px] truncate">
                <span className="text-xs font-bold text-[#0B1C2F] block truncate">
                  {activeOrg?.name || 'Savanna Agritech'}
                </span>
                <span className="text-[10px] text-[#5A6779] capitalize block -mt-0.5">
                  Role: {activeOrg?.role || 'owner'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#5A6779]" />
            </button>

            {showOrgDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl border border-[#E2E7EE] shadow-xl py-2 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-[#5A6779] uppercase tracking-wider">
                  Your Organisations
                </div>
                <div className="divide-y divide-[#E2E7EE]/50 my-1 max-h-56 overflow-y-auto">
                  {userOrgs.map((org) => {
                    const isCurrent = org.id === activeOrg?.id;
                    return (
                      <button
                        key={org.id}
                        onClick={() => {
                          switchOrganization(org.id);
                          setShowOrgDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#F4F6F9] transition-colors ${
                          isCurrent ? 'bg-[#EAF0FC]/60 text-[#2552C2] font-bold' : 'text-[#0B1C2F]'
                        }`}
                      >
                        <div className="truncate">
                          <p className="truncate font-semibold">{org.name}</p>
                          <p className="text-[10px] text-[#5A6779] capitalize">{org.role} · {org.city}</p>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-[#2552C2] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 px-2 border-t border-[#E2E7EE]">
                  <button
                    onClick={() => {
                      setShowOrgDropdown(false);
                      setShowCreateModal(true);
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-[#2552C2]/10 hover:bg-[#2552C2]/20 text-[#2552C2] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create new organisation
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeOrg?.verification_status === 'verified' ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#E6F5F3] text-[#0B7F7A] font-semibold border border-[#0B7F7A]/20">
              <ShieldCheck className="w-3 h-3 text-[#0B7F7A]" />
              Verified Employer
            </span>
          ) : (
            <Link
              href="/employer/profile"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] font-semibold border border-[#FDE68A] hover:bg-[#FDE68A]"
            >
              Verification pending
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Quick search */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('workdey:open-search'))}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#5A6779] bg-[#F4F6F9] hover:bg-[#E2E7EE] rounded-lg border border-[#E2E7EE] transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search candidates or roles</span>
            <kbd className="hidden sm:inline px-1 py-0.5 text-[10px] font-mono bg-white rounded border border-[#E2E7EE]">⌘K</kbd>
          </button>

          {/* Post a job CTA */}
          <Link
            href="/employer/jobs/create"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2552C2] text-white hover:bg-[#1E429F] shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Post a job
          </Link>

          {/* Notifications / Interviews */}
          <Link
            href="/employer/interviews"
            className="p-2 text-[#5A6779] hover:text-[#0B1C2F] rounded-lg hover:bg-[#F4F6F9] transition-colors relative"
            title="Interviews & Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2552C2]" />
          </Link>

          {/* Workspace Switcher */}
          <WorkspaceSwitcher />
        </div>
      </header>

      {/* Create Organisation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EAF0FC] text-[#2552C2] flex items-center justify-center font-bold">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1C2F] font-display">Create Organisation</h3>
                  <p className="text-[11px] text-[#5A6779]">Set up an employer profile to publish roles and hire in Cameroon.</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Company / Organisation Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. Lumen Health Cameroon SARL"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#2552C2] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0B1C2F] mb-1">Industry Sector</label>
                  <select
                    value={newOrgSector}
                    onChange={(e) => setNewOrgSector(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#2552C2] outline-none"
                  >
                    <option>Technology & Digital Services</option>
                    <option>Agriculture technology</option>
                    <option>Telecommunications</option>
                    <option>Healthcare & Clinics</option>
                    <option>Logistics & Supply Chain</option>
                    <option>Banking, Microfinance & FinTech</option>
                    <option>Education & Training</option>
                    <option>Hospitality & Tourism</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#0B1C2F] mb-1">Company Size</label>
                  <select
                    value={newOrgSize}
                    onChange={(e) => setNewOrgSize(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#2552C2] outline-none"
                  >
                    <option>1–10 employees</option>
                    <option>10–50 employees</option>
                    <option>50–200 employees</option>
                    <option>200–500 employees</option>
                    <option>500+ employees</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0B1C2F] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newOrgCity}
                    onChange={(e) => setNewOrgCity(e.target.value)}
                    placeholder="e.g. Douala"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#2552C2] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0B1C2F] mb-1">Region</label>
                  <select
                    value={newOrgRegion}
                    onChange={(e) => setNewOrgRegion(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#2552C2] outline-none"
                  >
                    <option>Littoral</option>
                    <option>Centre</option>
                    <option>South-West</option>
                    <option>North-West</option>
                    <option>West</option>
                    <option>South</option>
                    <option>Adamawa</option>
                    <option>North</option>
                    <option>Far North</option>
                    <option>East</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Tagline</label>
                <input
                  type="text"
                  value={newOrgTagline}
                  onChange={(e) => setNewOrgTagline(e.target.value)}
                  placeholder="e.g. Delivering accessible healthcare across Central Africa"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#2552C2] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Official Website</label>
                <input
                  type="url"
                  value={newOrgWebsite}
                  onChange={(e) => setNewOrgWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#2552C2] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E2E7EE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#5A6779] hover:bg-[#F4F6F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F] shadow-sm"
                >
                  Create and switch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function EmployerWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmployerProvider>
      <div className="min-h-screen flex bg-[#F4F6F9] text-[#0B1C2F]">
        {/* 1. Desktop & Tablet Sidebar */}
        <WorkspaceSidebar />

        {/* 2. Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
          <EmployerHeader />

          {/* Workspace Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-200">
            {children}
          </main>

          {/* App Footer */}
          <footer className="mt-auto px-6 py-4 text-xs text-[#5A6779] flex items-center justify-between border-t border-[#E2E7EE]/60 max-w-7xl w-full mx-auto">
            <span>© {new Date().getFullYear()} WorkDey · Employer Workspace</span>
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
    </EmployerProvider>
  );
}
