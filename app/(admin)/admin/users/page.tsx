'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  AlertTriangle,
  ShieldCheck,
  Mail,
  Ban,
  Check,
  X,
  ShieldAlert,
  UserCheck,
  Building,
  Briefcase,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { useAdmin, AdminUserItem } from '@/lib/admin/admin-context';
import { useAuth } from '@/lib/auth/auth-context';
import { PlatformRole } from '@/lib/types/database';

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const { users, suspendUser, reactivateUser, updateUserRole, can, exportAuditCSV } = useAdmin();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');

  // Selected user for inspection drawer
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');

  // Suspension modal state
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('Violation of platform policy: upfront recruitment fee requested');

  // Role reassignment modal state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedNewRole, setSelectedNewRole] = useState<PlatformRole | 'none'>('moderator');

  // Status alerts
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filterRole !== 'all' && u.role_type !== filterRole) return false;
      if (filterStatus !== 'all' && u.status !== filterStatus) return false;
      if (filterRegion !== 'all' && !u.region.toLowerCase().includes(filterRegion.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = u.full_name.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        const matchOrg = u.associated_org?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchOrg) return false;
      }
      return true;
    });
  }, [users, filterRole, filterStatus, filterRegion, searchQuery]);

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  const handleConfirmSuspend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !suspendReason.trim()) return;

    const res = suspendUser(selectedUser.id, suspendReason.trim());
    if (res.success) {
      setActionAlert({
        type: 'success',
        message: `Account "${selectedUser.full_name}" has been suspended. Written to immutable audit log.`,
      });
      setShowSuspendModal(false);
    } else {
      setActionAlert({ type: 'error', message: res.error || 'Failed to suspend account.' });
    }
    setTimeout(() => setActionAlert(null), 4000);
  };

  const handleReactivate = () => {
    if (!selectedUser) return;
    const res = reactivateUser(selectedUser.id);
    if (res.success) {
      setActionAlert({
        type: 'success',
        message: `Account "${selectedUser.full_name}" has been reactivated. Action logged.`,
      });
    } else {
      setActionAlert({ type: 'error', message: res.error || 'Failed to reactivate account.' });
    }
    setTimeout(() => setActionAlert(null), 4000);
  };

  const handleConfirmRoleChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const newRole = selectedNewRole === 'none' ? null : selectedNewRole;
    const res = updateUserRole(selectedUser.id, newRole);
    if (res.success) {
      setActionAlert({
        type: 'success',
        message: `Platform authority for "${selectedUser.full_name}" updated to ${newRole || 'None'}. Logged.`,
      });
      setShowRoleModal(false);
    } else {
      setActionAlert({ type: 'error', message: res.error || 'Permission denied.' });
    }
    setTimeout(() => setActionAlert(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#A0AEC0] block">OPERATE · GOVERNANCE</span>
          <h1 className="text-2xl font-bold text-white font-display">User directory ({users.length})</h1>
        </div>

        <button
          onClick={exportAuditCSV}
          className="px-3 py-1.5 rounded-lg border border-[#223247] text-xs font-semibold text-[#A0AEC0] hover:text-white flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" /> Export Audit Trail
        </button>
      </div>

      {actionAlert && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
            actionAlert.type === 'success'
              ? 'bg-[#1A7F4B]/20 border border-[#1A7F4B]/40 text-[#1A7F4B]'
              : 'bg-[#B42318]/20 border border-[#B42318]/40 text-[#B42318]'
          }`}
        >
          {actionAlert.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <Ban className="w-4 h-4 flex-shrink-0" />}
          <span>{actionAlert.message}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[240px] flex items-center px-3 py-2 bg-[#162436] rounded-lg border border-[#223247]">
          <Search className="w-3.5 h-3.5 text-[#A0AEC0] mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, or associated organisation..."
            className="w-full bg-transparent outline-none text-[#E7ECF3] placeholder-[#A0AEC0]"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 bg-[#162436] rounded-lg border border-[#223247] text-[#E7ECF3] outline-none"
        >
          <option value="all">Role: All</option>
          <option value="talent">Talent</option>
          <option value="employer">Employer</option>
          <option value="admin">Platform Admin</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-[#162436] rounded-lg border border-[#223247] text-[#E7ECF3] outline-none"
        >
          <option value="all">Status: All</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="unverified">Unverified</option>
        </select>

        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          className="px-3 py-2 bg-[#162436] rounded-lg border border-[#223247] text-[#E7ECF3] outline-none"
        >
          <option value="all">Region: All</option>
          <option value="littoral">Littoral (Douala)</option>
          <option value="centre">Centre (Yaoundé)</option>
          <option value="south-west">South-West (Buea)</option>
          <option value="west">West (Bafoussam)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table List */}
        <div className="lg:col-span-8 admin-panel rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E7ECF3]">
              <thead className="bg-[#111D2C] border-b border-[#223247] text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Workspace Role</th>
                  <th className="px-5 py-3">Platform Authority</th>
                  <th className="px-5 py-3">Region</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#223247]">
                {filteredUsers.map((u) => {
                  const isSelected = selectedUser?.id === u.id;
                  return (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUserId(u.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#111D2C] text-[#E8A317]' : 'hover:bg-[#111D2C]/60'
                      }`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#162436] text-white flex items-center justify-center font-bold text-[10px] border border-[#223247]">
                            {u.full_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white">{u.full_name}</p>
                            <p className="text-[11px] text-[#A0AEC0]">{u.email}</p>
                            {u.associated_org && (
                              <p className="text-[10px] text-[#2552C2]">{u.associated_org}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 capitalize text-[#E7ECF3]">
                        {u.role_type}
                      </td>

                      <td className="px-5 py-3.5">
                        {u.platform_role ? (
                          <span className="px-2 py-0.5 rounded bg-[#E8A317]/10 text-[#E8A317] font-mono font-bold text-[10px] border border-[#E8A317]/20 uppercase">
                            {u.platform_role.replace('_', ' ')}
                          </span>
                        ) : (
                          <span className="text-[#5A6779]">—</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-[#A0AEC0]">{u.region}</td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'active'
                              ? 'bg-[#1A7F4B]/20 text-[#1A7F4B]'
                              : u.status === 'suspended'
                              ? 'bg-[#B42318]/20 text-[#B42318]'
                              : 'bg-[#E8A317]/20 text-[#E8A317]'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-[#A0AEC0]">
                      No accounts matched the query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected User Detail Card */}
        {selectedUser && (
          <div className="lg:col-span-4 admin-panel rounded-xl p-6 space-y-5 text-xs text-[#E7ECF3]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B7F7A] text-white flex items-center justify-center font-bold text-base shadow-sm">
                {selectedUser.full_name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm truncate">{selectedUser.full_name}</h3>
                <p className="text-[#A0AEC0] text-[11px] truncate">{selectedUser.email}</p>
                <p className="text-[10px] text-[#E8A317] font-semibold capitalize mt-0.5">
                  {selectedUser.role_type} · {selectedUser.region}
                </p>
              </div>
            </div>

            {selectedUser.status === 'suspended' && (
              <div className="p-3 rounded-lg bg-[#B42318]/20 border border-[#B42318]/40 text-[#B42318] text-xs space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" /> Account Suspended
                </div>
                <p className="text-[11px] text-[#E7ECF3] leading-relaxed">
                  Reason: {selectedUser.suspension_reason || 'Policy violation.'}
                </p>
              </div>
            )}

            <div className="space-y-2.5 pt-2 divide-y divide-[#223247]">
              <div className="flex justify-between pt-2">
                <span className="text-[#A0AEC0]">Platform Authority</span>
                <span className="font-bold text-[#E8A317] uppercase text-[11px]">
                  {selectedUser.platform_role || 'Standard User'}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-[#A0AEC0]">Profile Strength</span>
                <span className="font-bold text-white tnum">{selectedUser.profile_strength}%</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-[#A0AEC0]">Applications</span>
                <span className="font-bold text-white tnum">{selectedUser.applications_count}</span>
              </div>
              {selectedUser.associated_org && (
                <div className="flex justify-between pt-2">
                  <span className="text-[#A0AEC0]">Organisation</span>
                  <span className="font-bold text-[#2552C2]">{selectedUser.associated_org}</span>
                </div>
              )}
              <div className="flex justify-between pt-2">
                <span className="text-[#A0AEC0]">Member Since</span>
                <span className="font-bold text-white">
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-[#223247]">
              {can('assign_platform_roles') && (
                <button
                  onClick={() => {
                    setSelectedNewRole((selectedUser.platform_role as any) || 'none');
                    setShowRoleModal(true);
                  }}
                  className="w-full py-2 px-3 rounded-lg border border-[#E8A317]/40 text-[#E8A317] font-semibold hover:bg-[#E8A317]/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Manage Platform Role
                </button>
              )}

              {selectedUser.status === 'active' ? (
                <button
                  onClick={() => setShowSuspendModal(true)}
                  className="w-full py-2 px-3 rounded-lg bg-[#B42318]/20 border border-[#B42318]/40 text-[#B42318] font-bold hover:bg-[#B42318]/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" /> Suspend Account
                </button>
              ) : (
                <button
                  onClick={handleReactivate}
                  className="w-full py-2 px-3 rounded-lg bg-[#1A7F4B]/20 border border-[#1A7F4B]/40 text-[#1A7F4B] font-bold hover:bg-[#1A7F4B]/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Reactivate Account
                </button>
              )}
            </div>

            <p className="text-[10px] text-[#A0AEC0] text-center pt-1 leading-relaxed">
              Every action taken here is cryptographically timestamped and attributed to your session in the audit log.
            </p>
          </div>
        )}
      </div>

      {/* MODAL 1: Account Suspension Confirmation with mandatory reason */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-[#0B121C]/80 flex items-center justify-center p-4">
          <div className="admin-panel rounded-xl border border-[#B42318]/40 max-w-md w-full p-6 space-y-4 text-xs text-[#E7ECF3]">
            <div className="flex items-center gap-2.5 text-[#B42318]">
              <Ban className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Suspend Account: {selectedUser.full_name}</h3>
            </div>

            <p className="text-[#A0AEC0] leading-relaxed">
              Suspension immediately revokes this user&apos;s active session across WorkDey, disables published jobs, and prevents further applications.
            </p>

            <form onSubmit={handleConfirmSuspend} className="space-y-3">
              <div>
                <label className="block font-bold text-white mb-1">
                  Mandatory Suspension Reason (recorded in audit trail) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="State the policy violation or safety reason..."
                  className="w-full p-2.5 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none focus:border-[#B42318]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#223247]">
                <button
                  type="button"
                  onClick={() => setShowSuspendModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#223247] text-[#A0AEC0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#B42318] text-white font-bold hover:bg-[#961a10] shadow-sm"
                >
                  Confirm Suspension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Platform Role Assignment */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-[#0B121C]/80 flex items-center justify-center p-4">
          <div className="admin-panel rounded-xl border border-[#E8A317]/40 max-w-md w-full p-6 space-y-4 text-xs text-[#E7ECF3]">
            <div className="flex items-center gap-2.5 text-[#E8A317]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Assign Platform Role</h3>
            </div>

            <p className="text-[#A0AEC0] leading-relaxed">
              Platform roles grant operational control over WorkDey itself. Organisation owners never gain platform authority unless explicitly assigned here.
            </p>

            <form onSubmit={handleConfirmRoleChange} className="space-y-3.5">
              <div>
                <label className="block font-bold text-white mb-1">Target User</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedUser.full_name} (${selectedUser.email})`}
                  className="w-full px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-[#A0AEC0]"
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1">Platform Role</label>
                <select
                  value={selectedNewRole}
                  onChange={(e) => setSelectedNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none focus:border-[#E8A317]"
                >
                  <option value="none">None (Regular Talent / Employer)</option>
                  <option value="support">Support (Read-only user profiles)</option>
                  <option value="moderator">Moderator (Job reviews & reports)</option>
                  <option value="admin">Admin (Verification, user management, billing)</option>
                  <option value="super_admin">Super Admin (Full governance & AI management)</option>
                  <option value="owner">Owner (Platform Owner)</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-[#111D2C] border border-[#223247] text-[11px] text-[#A0AEC0]">
                <strong>Guardrail:</strong> Platform owners and super admins cannot modify their own role. Modifying roles requires verified supervisory authority.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#223247]">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#223247] text-[#A0AEC0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#E8A317] text-[#0B1C2F] font-bold hover:bg-[#d69514]"
                >
                  Apply Role Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
