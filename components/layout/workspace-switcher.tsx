'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, WorkspaceType } from '@/lib/auth/auth-context';
import { Check, ChevronDown, Plus, Building2, User, ShieldAlert, Sparkles } from 'lucide-react';

export function WorkspaceSwitcher() {
  const router = useRouter();
  const {
    user,
    activeWorkspace,
    setActiveWorkspace,
    organizations,
    activeOrganization,
    setActiveOrganizationId,
    platformRole,
    switchDemoPersona,
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectWorkspace = (ws: WorkspaceType, orgId?: string) => {
    setActiveWorkspace(ws);
    if (orgId) {
      setActiveOrganizationId(orgId);
    }
    setIsOpen(false);

    if (ws === 'talent') router.push('/talent/dashboard');
    else if (ws === 'employer') router.push('/employer/dashboard');
    else if (ws === 'admin') router.push('/admin/overview');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'WD';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Header display config based on current workspace
  let badgeLabel = 'Personal';
  let badgeTitle = user?.full_name || 'Talent';
  let avatarInitials = getInitials(user?.full_name);
  let avatarBg = 'bg-[#0B7F7A] text-white';

  if (activeWorkspace === 'employer' && activeOrganization) {
    badgeLabel = activeOrganization.role ? `${activeOrganization.role.charAt(0).toUpperCase() + activeOrganization.role.slice(1)}` : 'Employer';
    badgeTitle = activeOrganization.name;
    avatarInitials = getInitials(activeOrganization.name);
    avatarBg = 'bg-[#2552C2] text-white';
  } else if (activeWorkspace === 'admin') {
    badgeLabel = 'Platform admin';
    badgeTitle = user?.full_name || 'Admin';
    avatarInitials = 'NO';
    avatarBg = 'bg-[#E8A317] text-[#0B1C2F] font-bold';
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-lg hover:bg-[#E2E7EE]/60 transition-colors text-left select-none group"
        aria-expanded={isOpen}
      >
        <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs ${avatarBg}`}>
          {avatarInitials}
        </div>
        <div className="flex flex-col text-left max-w-[90px] sm:max-w-[140px]">
          <span className="text-xs font-semibold text-[#0B1C2F] group-hover:text-[#0B7F7A] transition-colors leading-tight truncate">
            {badgeTitle}
          </span>
          <span className="text-[11px] text-[#5A6779] capitalize leading-none mt-0.5 truncate">
            {badgeLabel}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#5A6779] ml-0.5 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-32px)] rounded-xl bg-white border border-[#E2E7EE] shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-[#E2E7EE] text-[10px] font-bold tracking-wider text-[#5A6779] uppercase">
            Switch Workspace
          </div>

          {/* 1. Talent Personal Workspace */}
          <button
            onClick={() => handleSelectWorkspace('talent')}
            className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#F4F6F9] transition-colors ${
              activeWorkspace === 'talent' ? 'bg-[#E6F5F3]' : ''
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#0B7F7A] text-white flex items-center justify-center text-xs font-bold">
                {getInitials(user?.full_name)}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0B1C2F]">
                  Talent · {user?.full_name || 'Aïcha Nkeng'}
                </p>
                <p className="text-[11px] text-[#5A6779]">Personal workspace</p>
              </div>
            </div>
            {activeWorkspace === 'talent' && <Check className="w-4 h-4 text-[#0B7F7A]" />}
          </button>

          {/* 2. Employer Workspaces */}
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => handleSelectWorkspace('employer', org.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#F4F6F9] transition-colors ${
                activeWorkspace === 'employer' && activeOrganization?.id === org.id
                  ? 'bg-[#EAF0FC]'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#2552C2] text-white flex items-center justify-center text-xs font-bold">
                  {getInitials(org.name)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0B1C2F]">
                    Employer · {org.name}
                  </p>
                  <p className="text-[11px] text-[#5A6779] capitalize">{org.role}</p>
                </div>
              </div>
              {activeWorkspace === 'employer' && activeOrganization?.id === org.id && (
                <Check className="w-4 h-4 text-[#2552C2]" />
              )}
            </button>
          ))}

          {/* 3. Platform Admin Console (Only visible if platform role exists) */}
          {platformRole && (
            <button
              onClick={() => handleSelectWorkspace('admin')}
              className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#111D2C] hover:text-white transition-colors ${
                activeWorkspace === 'admin' ? 'bg-[#1D2430] text-white' : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#E8A317] text-[#0B1C2F] flex items-center justify-center text-xs font-bold">
                  NO
                </div>
                <div>
                  <p className={`text-xs font-semibold ${activeWorkspace === 'admin' ? 'text-white' : 'text-[#0B1C2F]'}`}>
                    Platform Admin · {user?.full_name || 'Nadine O.'}
                  </p>
                  <p className="text-[11px] text-[#5A6779] capitalize">{platformRole.replace('_', ' ')}</p>
                </div>
              </div>
              {activeWorkspace === 'admin' && <Check className="w-4 h-4 text-[#E8A317]" />}
            </button>
          )}

          {/* Quick Demo Switcher Footer */}
          <div className="mt-1 pt-1 border-t border-[#E2E7EE] px-3 py-2 bg-[#F4F6F9]">
            <p className="text-[10px] font-semibold text-[#5A6779] mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#0B7F7A]" /> Demo Personas
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  switchDemoPersona('aicha');
                  setIsOpen(false);
                  router.push('/talent/dashboard');
                }}
                className="px-2 py-1 bg-white text-[10px] font-medium rounded border border-[#E2E7EE] hover:border-[#0B7F7A] text-[#0B1C2F]"
              >
                Aïcha (Talent)
              </button>
              <button
                onClick={() => {
                  switchDemoPersona('savanna_owner');
                  setIsOpen(false);
                  router.push('/employer/dashboard');
                }}
                className="px-2 py-1 bg-white text-[10px] font-medium rounded border border-[#E2E7EE] hover:border-[#2552C2] text-[#0B1C2F]"
              >
                Savanna (Employer)
              </button>
              <button
                onClick={() => {
                  switchDemoPersona('admin_nadine');
                  setIsOpen(false);
                  router.push('/admin/overview');
                }}
                className="px-2 py-1 bg-white text-[10px] font-medium rounded border border-[#E2E7EE] hover:border-[#E8A317] text-[#0B1C2F]"
              >
                Nadine (Admin)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
