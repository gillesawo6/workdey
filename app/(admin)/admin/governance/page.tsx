'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, Check, UserPlus, ShieldAlert, X } from 'lucide-react';
import { useAdmin } from '@/lib/admin/admin-context';
import { PlatformRole } from '@/lib/types/database';

export default function AdminGovernancePage() {
  const { users, updateUserRole, can } = useAdmin();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [targetUserId, setTargetUserId] = useState(users[0]?.id || '');
  const [roleToGrant, setRoleToGrant] = useState<PlatformRole>('moderator');
  const [notice, setNotice] = useState<string | null>(null);

  const permissions = [
    { role: 'Owner', viewUsers: true, editUsers: true, verifyEmps: true, modJobs: true, billing: true, aiSettings: true, auditLog: true },
    { role: 'Super admin', viewUsers: true, editUsers: true, verifyEmps: true, modJobs: true, billing: true, aiSettings: true, auditLog: true },
    { role: 'Admin', viewUsers: true, editUsers: true, verifyEmps: true, modJobs: true, billing: true, aiSettings: true, auditLog: true },
    { role: 'Moderator', viewUsers: true, editUsers: false, verifyEmps: true, modJobs: true, billing: false, aiSettings: false, auditLog: true },
    { role: 'Support', viewUsers: true, editUsers: false, verifyEmps: false, modJobs: false, billing: false, aiSettings: false, auditLog: false },
  ];

  const adminUsers = users.filter((u) => u.platform_role !== null);

  const handleGrantRole = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateUserRole(targetUserId, roleToGrant);
    if (res.success) {
      setNotice(`Platform role granted and recorded in audit log.`);
      setShowInviteModal(false);
      setTimeout(() => setNotice(null), 3500);
    } else {
      alert(res.error || 'Failed to grant role.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#A0AEC0] block">GOVERNANCE · ACCESS CONTROL</span>
          <h1 className="text-2xl font-bold text-white font-display">Admins and roles</h1>
        </div>

        {can('assign_platform_roles') && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#E8A317] text-[#0B1C2F] text-xs font-bold hover:bg-[#d69514] transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" /> Assign platform authority
          </button>
        )}
      </div>

      {notice && (
        <div className="p-3 bg-[#1A7F4B]/20 border border-[#1A7F4B]/40 text-[#1A7F4B] text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" /> {notice}
        </div>
      )}

      {/* Active Platform Role Holders */}
      <div className="admin-panel rounded-xl overflow-hidden p-5 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Active Platform Role Holders ({adminUsers.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E7ECF3]">
            <thead className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider border-b border-[#223247]">
              <tr>
                <th className="py-2.5">Administrator</th>
                <th className="py-2.5">Platform Role</th>
                <th className="py-2.5">Region</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#223247]">
              {adminUsers.map((adm) => (
                <tr key={adm.id} className="hover:bg-[#111D2C]/40">
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-[#162436] text-white flex items-center justify-center font-bold text-[10px] border border-[#223247]">
                      {adm.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p>{adm.full_name}</p>
                      <p className="text-[11px] text-[#A0AEC0] font-normal">{adm.email}</p>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-[#E8A317] font-bold uppercase text-[11px]">
                    {adm.platform_role?.replace('_', ' ')}
                  </td>
                  <td className="py-3 text-[#A0AEC0]">{adm.region}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1A7F4B]/20 text-[#1A7F4B]">
                      {adm.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="admin-panel rounded-xl overflow-hidden space-y-3 p-5">
        <div className="flex items-center justify-between border-b border-[#223247] pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Permission Matrix & Authority Boundaries
          </h3>
          <span className="text-[10px] text-[#A0AEC0]">
            Every change is written to the immutable audit log
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E7ECF3]">
            <thead className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider border-b border-[#223247]">
              <tr>
                <th className="py-2.5 pr-4">Role</th>
                <th className="py-2.5 px-2 text-center">View users</th>
                <th className="py-2.5 px-2 text-center">Edit users</th>
                <th className="py-2.5 px-2 text-center">Verify emps</th>
                <th className="py-2.5 px-2 text-center">Moderate jobs</th>
                <th className="py-2.5 px-2 text-center">Billing</th>
                <th className="py-2.5 px-2 text-center">Edit AI</th>
                <th className="py-2.5 pl-2 text-center">Audit log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#223247]">
              {permissions.map((p) => (
                <tr key={p.role} className="hover:bg-[#111D2C]/40">
                  <td className="py-3 pr-4 font-bold text-white">{p.role}</td>
                  <td className="py-3 px-2 text-center">{p.viewUsers ? <Check className="w-4 h-4 text-[#1A7F4B] mx-auto" /> : <span className="text-[#5A6779]">—</span>}</td>
                  <td className="py-3 px-2 text-center">{p.editUsers ? <Check className="w-4 h-4 text-[#1A7F4B] mx-auto" /> : <span className="text-[#5A6779]">—</span>}</td>
                  <td className="py-3 px-2 text-center">{p.verifyEmps ? <Check className="w-4 h-4 text-[#1A7F4B] mx-auto" /> : <span className="text-[#5A6779]">—</span>}</td>
                  <td className="py-3 px-2 text-center">{p.modJobs ? <Check className="w-4 h-4 text-[#1A7F4B] mx-auto" /> : <span className="text-[#5A6779]">—</span>}</td>
                  <td className="py-3 px-2 text-center">{p.billing ? <Check className="w-4 h-4 text-[#1A7F4B] mx-auto" /> : <span className="text-[#5A6779]">—</span>}</td>
                  <td className="py-3 px-2 text-center">{p.aiSettings ? <Check className="w-4 h-4 text-[#1A7F4B] mx-auto" /> : <span className="text-[#5A6779]">—</span>}</td>
                  <td className="py-3 pl-2 text-center">{p.auditLog ? <Check className="w-4 h-4 text-[#1A7F4B] mx-auto" /> : <span className="text-[#5A6779]">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guardrails */}
      <div className="admin-panel p-5 rounded-xl space-y-2 text-xs text-[#E7ECF3]">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#E8A317]" /> Constitutional Platform Guardrails
        </h3>
        <p className="text-[#A0AEC0] leading-relaxed">
          Organisation-level roles (e.g. organisation owner, recruiter) never grant platform authority. Admins cannot edit their own role or promote peers beyond their own clearance level. All administrative sessions expire after 15 minutes of inactivity.
        </p>
      </div>

      {/* Assign Authority Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-[#0B121C]/80 flex items-center justify-center p-4">
          <div className="admin-panel rounded-xl border border-[#E8A317]/40 max-w-md w-full p-6 space-y-4 text-xs text-[#E7ECF3]">
            <div className="flex items-center justify-between pb-2 border-b border-[#223247]">
              <h3 className="text-base font-bold text-white">Assign Platform Authority</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-[#A0AEC0] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGrantRole} className="space-y-3.5">
              <div>
                <label className="block text-[#A0AEC0] mb-1 font-semibold">Select User</label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.email}) — current: {u.platform_role || 'None'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#A0AEC0] mb-1 font-semibold">Platform Role to Grant</label>
                <select
                  value={roleToGrant}
                  onChange={(e) => setRoleToGrant(e.target.value as PlatformRole)}
                  className="w-full px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none focus:border-[#E8A317]"
                >
                  <option value="moderator">Moderator (Job reviews & reports)</option>
                  <option value="support">Support (User profile lookups)</option>
                  <option value="admin">Admin (Verifications, users, billing)</option>
                  <option value="super_admin">Super Admin (Full governance)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#223247]">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#223247] text-[#A0AEC0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#E8A317] text-[#0B1C2F] font-bold hover:bg-[#d69514]"
                >
                  Grant Authority
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
