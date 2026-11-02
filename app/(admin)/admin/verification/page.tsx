'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  Check,
  X,
  FileText,
  ExternalLink,
  Clock,
  Building,
  HelpCircle,
  Ban,
  Download,
} from 'lucide-react';
import { useAdmin } from '@/lib/admin/admin-context';
import { Organization } from '@/lib/types/database';

export default function AdminVerificationPage() {
  const { organizations, verifyOrganization, auditLogs, exportAuditCSV } = useAdmin();
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('org-harbor');

  // Modals state
  const [showDocModal, setShowDocModal] = useState(false);
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [requestInfoNotes, setRequestInfoNotes] = useState('Please provide an updated RCCM certificate with official seal.');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Business registration certificate unverified or invalid NIU number.');

  const [reviewNotes, setReviewNotes] = useState('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const pendingList = useMemo(
    () => organizations.filter((o) => o.verification_status === 'pending'),
    [organizations]
  );
  const verifiedList = useMemo(
    () => organizations.filter((o) => o.verification_status === 'verified'),
    [organizations]
  );
  const rejectedList = useMemo(
    () => organizations.filter((o) => o.verification_status === 'rejected'),
    [organizations]
  );

  const currentTabList = activeTab === 'pending' ? pendingList : activeTab === 'verified' ? verifiedList : rejectedList;

  const selectedOrg = organizations.find((o) => o.id === selectedOrgId) || currentTabList[0] || organizations[0];

  const handleApprove = () => {
    if (!selectedOrg) return;
    const res = verifyOrganization(selectedOrg.id, 'verified', reviewNotes || 'All corporate registry checks confirmed.');
    if (res.success) {
      setStatusNotice(`Organisation "${selectedOrg.name}" has been approved as a Verified Employer.`);
    }
    setTimeout(() => setStatusNotice(null), 3500);
  };

  const handleConfirmRequestInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) return;
    const res = verifyOrganization(selectedOrg.id, 'requested_info', requestInfoNotes);
    if (res.success) {
      setStatusNotice(`Information request dispatched to "${selectedOrg.name}".`);
      setShowRequestInfoModal(false);
    }
    setTimeout(() => setStatusNotice(null), 3500);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) return;
    const res = verifyOrganization(selectedOrg.id, 'rejected', rejectReason);
    if (res.success) {
      setStatusNotice(`Organisation "${selectedOrg.name}" verification rejected.`);
      setShowRejectModal(false);
    }
    setTimeout(() => setStatusNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#A0AEC0] block">OPERATE · TRUST & SAFETY</span>
          <h1 className="text-2xl font-bold text-white font-display">Organisation verification</h1>
        </div>

        <button
          onClick={exportAuditCSV}
          className="px-3 py-1.5 rounded-lg border border-[#223247] text-xs font-semibold text-[#A0AEC0] hover:text-white flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" /> Export Audit Trail
        </button>
      </div>

      {statusNotice && (
        <div className="p-3.5 rounded-lg bg-[#1A7F4B]/20 border border-[#1A7F4B]/40 text-[#1A7F4B] text-xs flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#223247] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-[#E8A317] text-[#0B1C2F]'
              : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Pending Review <span className="px-1.5 py-0.2 rounded-full bg-[#0B1C2F]/20 text-[10px]">{pendingList.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('verified')}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
            activeTab === 'verified' ? 'bg-[#223247] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Verified Employers ({verifiedList.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
            activeTab === 'rejected' ? 'bg-[#223247] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Rejected ({rejectedList.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Queue List */}
        <div className="lg:col-span-6 admin-panel rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-[#E7ECF3]">
            <thead className="bg-[#111D2C] border-b border-[#223247] text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Organisation</th>
                <th className="px-4 py-3">Location & Sector</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#223247]">
              {currentTabList.map((org) => {
                const isSelected = org.id === selectedOrg?.id;
                return (
                  <tr
                    key={org.id}
                    onClick={() => setSelectedOrgId(org.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#111D2C] text-[#E8A317]' : 'hover:bg-[#111D2C]/50'
                    }`}
                  >
                    <td className="px-4 py-3.5 font-bold">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#162436] text-white flex items-center justify-center text-[10px] font-mono border border-[#223247]">
                          {org.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate">{org.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[#A0AEC0]">
                      {org.city} ({org.region}) · {org.sector}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-[10px] uppercase">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          org.verification_status === 'verified'
                            ? 'bg-[#1A7F4B]/20 text-[#1A7F4B]'
                            : org.verification_status === 'rejected'
                            ? 'bg-[#B42318]/20 text-[#B42318]'
                            : 'bg-[#E8A317]/20 text-[#E8A317]'
                        }`}
                      >
                        {org.verification_status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {currentTabList.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-[#A0AEC0]">
                    No organisations in {activeTab} queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Verification Inspection Card */}
        {selectedOrg && (
          <div className="lg:col-span-6 admin-panel rounded-xl p-6 space-y-5 text-xs text-[#E7ECF3]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedOrg.name}</h2>
                <p className="text-xs text-[#A0AEC0] mt-0.5">
                  {selectedOrg.city}, {selectedOrg.region} · {selectedOrg.sector} · {selectedOrg.company_size || '50–200 staff'}
                </p>
                {selectedOrg.website && (
                  <a
                    href={selectedOrg.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#E8A317] hover:underline flex items-center gap-1 mt-1"
                  >
                    {selectedOrg.website} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedOrg.verification_status === 'verified'
                    ? 'bg-[#1A7F4B]/20 text-[#1A7F4B]'
                    : selectedOrg.verification_status === 'rejected'
                    ? 'bg-[#B42318]/20 text-[#B42318]'
                    : 'bg-[#E8A317]/20 text-[#E8A317]'
                }`}
              >
                {selectedOrg.verification_status.replace('_', ' ')}
              </span>
            </div>

            {/* Verification Checks Checklist */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider">
                Automated & Manual Evidence Checks
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[#1A7F4B]">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[#E7ECF3]">Corporate registration document submitted</span>
                </div>

                <div className="flex items-center gap-2 text-[#1A7F4B]">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[#E7ECF3]">Work email domain matched official website</span>
                </div>

                <div className="flex items-center gap-2 text-[#E8A317]">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[#E7ECF3]">Trade registry number confirmed with Cameroon Ministry of Commerce</span>
                </div>

                <div className="flex items-center gap-2 text-[#1A7F4B]">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>Physical presence verified in {selectedOrg.city}</span>
                </div>
              </div>
            </div>

            {/* Document preview button */}
            <div className="p-3.5 bg-[#111D2C] rounded-lg border border-[#223247] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#A0AEC0]" />
                <span className="font-mono text-white">registration_cert_{selectedOrg.city.toLowerCase()}.pdf</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDocModal(true)}
                className="text-[11px] font-bold text-[#E8A317] hover:underline flex items-center gap-1"
              >
                View document <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Reviewer Note Input */}
            <div>
              <label className="block text-[11px] font-bold text-[#A0AEC0] uppercase mb-1">
                Administrative Decision Notes (Audit trail recorded)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add internal notes regarding corporate validity or specific verification conditions..."
                rows={2}
                className="w-full p-2.5 bg-[#111D2C] border border-[#223247] rounded-lg text-white text-xs outline-none focus:border-[#E8A317]"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#223247] flex items-center gap-2 flex-wrap">
              <button
                onClick={handleApprove}
                className="px-4 py-2 rounded-lg bg-[#E8A317] text-[#0B1C2F] font-bold hover:bg-[#d69514] transition-colors shadow-sm"
              >
                Approve Verified Status
              </button>
              <button
                onClick={() => setShowRequestInfoModal(true)}
                className="px-3 py-2 rounded-lg border border-[#223247] text-[#A0AEC0] hover:text-white transition-colors"
              >
                Request Info
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-3 py-2 rounded-lg border border-[#B42318]/40 text-[#B42318] hover:bg-[#B42318]/10 transition-colors ml-auto"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Live Audit Log */}
      <div className="admin-panel rounded-xl overflow-hidden mt-8">
        <div className="p-4 border-b border-[#223247] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Verification Audit Trail</h3>
            <span className="text-[10px] text-[#A0AEC0]">Immutable history of all approvals and rejections</span>
          </div>
          <button onClick={exportAuditCSV} className="text-xs text-[#E8A317] hover:underline font-bold">
            Export CSV
          </button>
        </div>

        <table className="w-full text-left text-xs text-[#E7ECF3]">
          <thead className="bg-[#111D2C] border-b border-[#223247] text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2.5">Time (UTC)</th>
              <th className="px-4 py-2.5">Admin</th>
              <th className="px-4 py-2.5">Action</th>
              <th className="px-4 py-2.5">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#223247]">
            {auditLogs.slice(0, 5).map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3 font-mono text-[#A0AEC0]">
                  {log.created_at.slice(0, 16).replace('T', ' ')}
                </td>
                <td className="px-4 py-3 font-semibold text-white">
                  {log.actor_name}
                </td>
                <td className="px-4 py-3 text-[#E7ECF3]">
                  {log.action}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#E8A317]">
                  {log.target_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Document Viewer */}
      {showDocModal && selectedOrg && (
        <div className="fixed inset-0 z-50 bg-[#0B121C]/80 flex items-center justify-center p-4">
          <div className="admin-panel rounded-xl border border-[#223247] max-w-2xl w-full p-6 space-y-4 text-xs text-[#E7ECF3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#223247]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#E8A317]" />
                <h3 className="text-base font-bold text-white">
                  Document Inspection: {selectedOrg.name}
                </h3>
              </div>
              <button onClick={() => setShowDocModal(false)} className="text-[#A0AEC0] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-[#111D2C] rounded-xl border border-[#223247] space-y-3 font-mono text-xs">
              <div className="text-center pb-3 border-b border-[#223247]">
                <p className="font-bold text-white text-sm">RÉPUBLIQUE DU CAMEROUN — GREFFE DU TRIBUNAL DE COMMERCE</p>
                <p className="text-[11px] text-[#A0AEC0]">REGISTRE DU COMMERCE ET DU CRÉDIT MOBILIER (RCCM)</p>
              </div>

              <div className="space-y-1.5 pt-2">
                <p><span className="text-[#A0AEC0]">Raison Sociale:</span> <span className="text-white font-bold">{selectedOrg.name}</span></p>
                <p><span className="text-[#A0AEC0]">Siège Social:</span> <span className="text-white">{selectedOrg.city}, Région du {selectedOrg.region}</span></p>
                <p><span className="text-[#A0AEC0]">Secteur d&apos;activité:</span> <span className="text-white">{selectedOrg.sector}</span></p>
                <p><span className="text-[#A0AEC0]">Numéro d&apos;Immatriculation:</span> <span className="text-[#E8A317] font-bold">RC/DLA/2022/B/492</span></p>
                <p><span className="text-[#A0AEC0]">Statut de conformité:</span> <span className="text-[#1A7F4B] font-bold">ACTIF ET EN RÈGLE</span></p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDocModal(false)}
                className="px-4 py-2 rounded-lg bg-[#E8A317] text-[#0B1C2F] font-bold hover:bg-[#d69514]"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Request Info */}
      {showRequestInfoModal && selectedOrg && (
        <div className="fixed inset-0 z-50 bg-[#0B121C]/80 flex items-center justify-center p-4">
          <div className="admin-panel rounded-xl border border-[#223247] max-w-md w-full p-6 space-y-4 text-xs text-[#E7ECF3]">
            <h3 className="text-base font-bold text-white">Request Information from {selectedOrg.name}</h3>
            <form onSubmit={handleConfirmRequestInfo} className="space-y-3">
              <textarea
                value={requestInfoNotes}
                onChange={(e) => setRequestInfoNotes(e.target.value)}
                rows={3}
                required
                className="w-full p-2.5 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none focus:border-[#E8A317]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestInfoModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#223247] text-[#A0AEC0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#E8A317] text-[#0B1C2F] font-bold hover:bg-[#d69514]"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Reject Verification */}
      {showRejectModal && selectedOrg && (
        <div className="fixed inset-0 z-50 bg-[#0B121C]/80 flex items-center justify-center p-4">
          <div className="admin-panel rounded-xl border border-[#B42318]/40 max-w-md w-full p-6 space-y-4 text-xs text-[#E7ECF3]">
            <h3 className="text-base font-bold text-white flex items-center gap-2 text-[#B42318]">
              <Ban className="w-4 h-4" /> Reject Verification: {selectedOrg.name}
            </h3>
            <form onSubmit={handleConfirmReject} className="space-y-3">
              <label className="block text-[#A0AEC0]">Mandatory Justification for Rejection</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                required
                className="w-full p-2.5 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none focus:border-[#B42318]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#223247] text-[#A0AEC0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#B42318] text-white font-bold hover:bg-[#961a10]"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
