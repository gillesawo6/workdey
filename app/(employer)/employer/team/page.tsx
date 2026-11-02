'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Mail,
  Check,
  Trash2,
  Building,
  Upload,
  AlertCircle,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useEmployer } from '@/lib/employer/employer-context';
import { OrgRole } from '@/lib/types/database';

export default function EmployerTeamPage() {
  const {
    activeOrg,
    userOrgs,
    switchOrganization,
    teamMembers,
    inviteTeamMember,
    updateMemberRole,
    removeMember,
    canManageTeam,
    updateOrganizationProfile,
  } = useEmployer();

  // Organisation profile edit state
  const [orgName, setOrgName] = useState(activeOrg?.name || 'Savanna Agritech');
  const [tagline, setTagline] = useState(activeOrg?.tagline || 'Data-driven farming for Cameroon');
  const [website, setWebsite] = useState(activeOrg?.website || 'https://savanna.example');
  const [sector, setSector] = useState(activeOrg?.sector || 'Agriculture technology');
  const [companySize, setCompanySize] = useState(activeOrg?.company_size || '50–200 employees');
  const [city, setCity] = useState(activeOrg?.city || 'Douala');
  const [logoPreview, setLogoPreview] = useState<string | null>(activeOrg?.logo_url || null);

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<OrgRole>('recruiter');
  const [inviteTitle, setInviteTitle] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Notifications
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg) return;

    updateOrganizationProfile(activeOrg.id, {
      name: orgName,
      tagline,
      website,
      sector,
      company_size: companySize,
      city,
      logo_url: logoPreview,
    });

    setStatusNotice('Organisation profile successfully updated.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);

    const res = inviteTeamMember(inviteEmail.trim(), inviteRole, inviteTitle.trim() || undefined);
    if (res.success) {
      setStatusNotice(`Invitation sent to ${inviteEmail}.`);
      setInviteEmail('');
      setInviteTitle('');
      setShowInviteModal(false);
      setTimeout(() => setStatusNotice(null), 3000);
    } else {
      setInviteError(res.error || 'Failed to send invitation.');
    }
  };

  const handleRoleChange = (memberId: string, newRole: OrgRole) => {
    const res = updateMemberRole(memberId, newRole);
    if (res.success) {
      setStatusNotice('Team member role updated.');
      setTimeout(() => setStatusNotice(null), 3000);
    } else {
      alert(res.error || 'Unable to update role.');
    }
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from ${activeOrg?.name}?`)) {
      const res = removeMember(memberId);
      if (res.success) {
        setStatusNotice(`Removed ${memberName} from the organisation.`);
        setTimeout(() => setStatusNotice(null), 3000);
      } else {
        alert(res.error || 'Unable to remove member.');
      }
    }
  };

  const handleFakeLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setLogoPreview(fakeUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#5A6779] block">
            {activeOrg?.name} · Multi-organisation Management
          </span>
          <h1 className="text-2xl font-bold text-[#0B1C2F] font-display">
            Team & Organisation Management
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {canManageTeam && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F] flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" /> Invite Teammate
            </button>
          )}
        </div>
      </div>

      {statusNotice && (
        <div className="p-3 bg-[#E6F5F3] border border-[#0B7F7A]/20 text-[#0B7F7A] text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" /> {statusNotice}
        </div>
      )}

      {/* Organisation Switcher Info Pill */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E7EE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2552C2] text-white flex items-center justify-center font-black text-sm">
            {activeOrg?.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#0B1C2F] text-sm">{activeOrg?.name}</h3>
              <span className="px-2 py-0.5 rounded bg-[#EAF0FC] text-[#2552C2] text-[10px] font-bold capitalize">
                Your role: {activeOrg?.role}
              </span>
            </div>
            <p className="text-[#5A6779] text-[11px] mt-0.5">
              {activeOrg?.sector} · {activeOrg?.city}, Cameroon
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#5A6779]">Switch Org:</span>
          <select
            value={activeOrg?.id}
            onChange={(e) => switchOrganization(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] bg-[#F4F6F9] font-bold text-[#0B1C2F] outline-none"
          >
            {userOrgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Team Members Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E2E7EE] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0B1C2F]">Team Members ({teamMembers.length})</h3>
                <p className="text-[11px] text-[#5A6779]">Collaborating on job postings and applicant review</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F6F9] border-b border-[#E2E7EE] text-[10px] font-bold text-[#5A6779] uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Member</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Status</th>
                    {canManageTeam && <th className="px-5 py-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E7EE]">
                  {teamMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-[#F4F6F9] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EAF0FC] text-[#2552C2] flex items-center justify-center font-bold text-xs">
                            {m.initials}
                          </div>
                          <div>
                            <p className="font-bold text-[#0B1C2F]">{m.user_name}</p>
                            <p className="text-[11px] text-[#5A6779]">{m.user_email}</p>
                            <p className="text-[10px] text-[#2552C2]">{m.user_title}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        {canManageTeam ? (
                          <select
                            value={m.role}
                            onChange={(e) => handleRoleChange(m.id, e.target.value as OrgRole)}
                            className="px-2 py-1 rounded border border-[#E2E7EE] text-[11px] font-semibold text-[#0B1C2F] bg-white outline-none"
                          >
                            <option value="owner">Owner (Full access)</option>
                            <option value="admin">Admin</option>
                            <option value="recruiter">Recruiter</option>
                            <option value="hiring_manager">Hiring Manager</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        ) : (
                          <span className="font-semibold capitalize text-[#0B1C2F]">
                            {m.role.replace('_', ' ')}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.status === 'active'
                              ? 'bg-[#E6F5F3] text-[#0B7F7A]'
                              : 'bg-[#FEF3C7] text-[#92400E]'
                          }`}
                        >
                          {m.status === 'active' ? 'Active' : 'Invited'}
                        </span>
                      </td>

                      {canManageTeam && (
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => handleRemoveMember(m.id, m.user_name)}
                            title="Remove member"
                            className="p-1.5 text-[#5A6779] hover:text-[#B42318] hover:bg-[#F4F6F9] rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Role Permissions Guide */}
          <div className="bg-white p-5 rounded-xl border border-[#E2E7EE] shadow-sm text-xs space-y-2 text-[#5A6779]">
            <h4 className="font-bold text-[#0B1C2F] text-xs">Role Permissions Reference</h4>
            <ul className="space-y-1 text-[11px] list-disc pl-4">
              <li><strong>Owner:</strong> Full organisation governance, verification uploads, billing and team management.</li>
              <li><strong>Admin:</strong> Can post/edit jobs, manage applicants, invite teammates.</li>
              <li><strong>Recruiter:</strong> Manages jobs, views applicants, advances pipeline stages and schedules interviews.</li>
              <li><strong>Hiring Manager:</strong> Reviews candidates and adds internal notes for assigned departments.</li>
              <li><strong>Viewer:</strong> Read-only access to applicant summaries.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Organisation Profile Editor */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#E2E7EE] pb-3">
            <h3 className="font-bold text-sm text-[#0B1C2F]">Organisation Profile</h3>
            {activeOrg?.verification_status === 'verified' ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-[#0B7F7A] font-bold bg-[#E6F5F3] px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            ) : (
              <span className="text-[10px] text-[#92400E] font-bold bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                Verification Pending
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            {/* Logo Preview & Upload */}
            <div>
              <label className="block text-[#5A6779] mb-1 font-semibold">Company Logo</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#2552C2] text-white flex items-center justify-center font-bold text-base overflow-hidden border border-[#E2E7EE]">
                  {logoPreview ? (
                    <div
                      style={{ backgroundImage: `url(${logoPreview})` }}
                      className="w-full h-full bg-cover bg-center"
                      role="img"
                      aria-label="Company Logo"
                    />
                  ) : (
                    orgName.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#0B1C2F] hover:bg-[#F4F6F9] inline-flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Upload logo
                    <input type="file" accept="image/*" onChange={handleFakeLogoUpload} className="hidden" />
                  </label>
                  <p className="text-[10px] text-[#5A6779] mt-0.5">PNG or SVG, max 2MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[#5A6779] mb-1 font-semibold">Company Legal Name</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2E7EE] rounded-lg text-xs outline-none focus:border-[#2552C2] text-[#0B1C2F]"
              />
            </div>

            <div>
              <label className="block text-[#5A6779] mb-1 font-semibold">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2E7EE] rounded-lg text-xs outline-none focus:border-[#2552C2] text-[#0B1C2F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#5A6779] mb-1 font-semibold">Sector</label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E7EE] rounded-lg text-xs outline-none focus:border-[#2552C2] text-[#0B1C2F]"
                />
              </div>

              <div>
                <label className="block text-[#5A6779] mb-1 font-semibold">Company Size</label>
                <input
                  type="text"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E7EE] rounded-lg text-xs outline-none focus:border-[#2552C2] text-[#0B1C2F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#5A6779] mb-1 font-semibold">Headquarters City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2E7EE] rounded-lg text-xs outline-none focus:border-[#2552C2] text-[#0B1C2F]"
              />
            </div>

            <div>
              <label className="block text-[#5A6779] mb-1 font-semibold">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2E7EE] rounded-lg text-xs outline-none focus:border-[#2552C2] text-[#0B1C2F]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#2552C2] text-white font-bold rounded-lg hover:bg-[#1E429F] transition-colors shadow-sm"
            >
              Save Organisation Changes
            </button>
          </form>
        </div>
      </div>

      {/* Invite Teammate Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#2552C2]" />
                <h3 className="text-base font-bold text-[#0B1C2F]">Invite Team Member</h3>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {inviteError && (
              <div className="p-3 bg-[#B42318]/10 text-[#B42318] text-xs font-semibold rounded-lg">
                {inviteError}
              </div>
            )}

            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Colleague Work Email *</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. pierre@company.example"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E7EE] outline-none focus:border-[#2552C2]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Job Title</label>
                <input
                  type="text"
                  value={inviteTitle}
                  onChange={(e) => setInviteTitle(e.target.value)}
                  placeholder="e.g. Technical Hiring Lead"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E7EE] outline-none focus:border-[#2552C2]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as OrgRole)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E7EE] outline-none focus:border-[#2552C2]"
                >
                  <option value="recruiter">Recruiter (Post jobs & manage pipeline)</option>
                  <option value="hiring_manager">Hiring Manager (Review candidates)</option>
                  <option value="admin">Admin (Manage team & all jobs)</option>
                  <option value="viewer">Viewer (Read-only)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E7EE]">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#5A6779]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F]"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
