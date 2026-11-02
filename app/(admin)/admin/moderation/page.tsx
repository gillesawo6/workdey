'use client';

import React, { useState } from 'react';
import {
  Flag,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  Check,
  Trash2,
  Edit,
  CheckCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '@/lib/admin/admin-context';

export default function AdminModerationPage() {
  const { moderationReports, moderateJob, jobs } = useAdmin();

  const [activeTab, setActiveTab] = useState<'flagged' | 'reports' | 'resolved'>('flagged');
  const [selectedReportId, setSelectedReportId] = useState<string>(moderationReports[0]?.id || '');
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  // Modal states for Request Edit and Suspend
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRequestText, setEditRequestText] = useState('Remove upfront registration fee request and specify work location details.');

  const flaggedReports = moderationReports.filter((r) => r.status === 'open' && r.target_type === 'job');
  const userReports = moderationReports.filter((r) => r.status === 'open' && r.target_type !== 'job');
  const resolvedReports = moderationReports.filter((r) => r.status === 'resolved' || r.status === 'dismissed');

  const currentTabList = activeTab === 'flagged' ? flaggedReports : activeTab === 'reports' ? userReports : resolvedReports;

  const selectedReport =
    moderationReports.find((r) => r.id === selectedReportId) || currentTabList[0] || moderationReports[0];

  const handleRemove = () => {
    if (!selectedReport) return;
    const res = moderateJob(
      selectedReport.id,
      'remove_listing',
      'Policy violation: Upfront recruitment fee requested from candidates.'
    );
    if (res.success) {
      setActionAlert(`Removed listing "${selectedReport.target_title}". Action logged to immutable audit records.`);
      setTimeout(() => setActionAlert(null), 3500);
    }
  };

  const handleApproveDismiss = () => {
    if (!selectedReport) return;
    const res = moderateJob(
      selectedReport.id,
      'dismiss',
      'Reviewed and confirmed compliant with WorkDey terms.'
    );
    if (res.success) {
      setActionAlert(`Listing "${selectedReport.target_title}" approved and cleared.`);
      setTimeout(() => setActionAlert(null), 3500);
    }
  };

  const handleConfirmRequestEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    const res = moderateJob(selectedReport.id, 'request_edit', editRequestText);
    if (res.success) {
      setActionAlert(`Edit request dispatched to listing owner.`);
      setShowEditModal(false);
      setTimeout(() => setActionAlert(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-[#A0AEC0] block">OPERATE · TRUST & GOVERNANCE</span>
        <h1 className="text-2xl font-bold text-white font-display">
          Job moderation and reports
        </h1>
      </div>

      {actionAlert && (
        <div className="p-3.5 rounded-lg bg-[#1A7F4B]/20 border border-[#1A7F4B]/40 text-[#1A7F4B] text-xs flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{actionAlert}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#223247] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('flagged')}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
            activeTab === 'flagged' ? 'bg-[#E8A317] text-[#0B1C2F]' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Flagged jobs <span className="px-1.5 py-0.2 rounded-full bg-[#0B1C2F]/20 text-[10px]">{flaggedReports.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
            activeTab === 'reports' ? 'bg-[#223247] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          User reports <span className="px-1.5 py-0.2 rounded-full bg-[#111D2C] text-[10px]">{userReports.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={`px-3 py-1.5 rounded-lg font-bold ${
            activeTab === 'resolved' ? 'bg-[#223247] text-white' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Resolved ({resolvedReports.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Flagged Jobs List */}
        <div className="lg:col-span-6 space-y-3">
          {currentTabList.map((report) => {
            const isSelected = selectedReport?.id === report.id;
            return (
              <div
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`admin-panel p-4 rounded-xl cursor-pointer transition-all space-y-2 ${
                  isSelected ? 'border-[#E8A317] ring-1 ring-[#E8A317]/20' : 'hover:border-[#E8A317]/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {report.target_title}
                    </h3>
                    <p className="text-xs text-[#A0AEC0] mt-0.5">{report.reporter_name} · Reported recently</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      report.priority === 'high'
                        ? 'bg-[#B42318]/20 text-[#B42318]'
                        : 'bg-[#E8A317]/20 text-[#E8A317]'
                    }`}
                  >
                    {report.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-[#E8A317]">
                  Flag: {report.flag_type.replace('_', ' ')}
                </p>
              </div>
            );
          })}

          {currentTabList.length === 0 && (
            <div className="admin-panel p-8 text-center text-xs text-[#A0AEC0] rounded-xl">
              No items in this queue.
            </div>
          )}
        </div>

        {/* Right Column: Moderation Detail Panel */}
        {selectedReport && (
          <div className="lg:col-span-6 admin-panel rounded-xl p-6 space-y-6 text-xs text-[#E7ECF3]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#E8A317] uppercase tracking-wider">
                  Target: {selectedReport.target_type}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedReport.status === 'resolved'
                      ? 'bg-[#1A7F4B]/20 text-[#1A7F4B]'
                      : 'bg-[#E8A317]/20 text-[#E8A317]'
                  }`}
                >
                  Status: {selectedReport.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{selectedReport.target_title}</h2>
              <p className="text-xs text-[#A0AEC0] mt-0.5">
                {selectedReport.reporter_name}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#111D2C] border border-[#223247] italic text-sm text-[#E7ECF3] leading-relaxed">
              &ldquo;{selectedReport.reason}&rdquo;
            </div>

            {/* Signals */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider">
                Automated Signals & Heuristics
              </h4>
              <div className="space-y-2 text-xs">
                {selectedReport.flag_type === 'fees_requested' && (
                  <div className="flex items-center gap-2 text-[#B42318]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B42318]" />
                    <span>Fee requested from applicants (strictly prohibited under WorkDey policy)</span>
                  </div>
                )}
                {selectedReport.flag_type === 'discriminatory' && (
                  <div className="flex items-center gap-2 text-[#E8A317]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8A317]" />
                    <span>Protected demographic or age filter detected</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#A0AEC0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A0AEC0]" />
                  <span>Flag Category: {selectedReport.flag_type.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* AI Advisory Suggestion */}
            <div className="p-3.5 rounded-lg bg-[#111D2C] border border-[#223247] text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#14A89E] tracking-wider">
                AI Advisory Assistant
              </span>
              <p className="text-[#A0AEC0] leading-relaxed">
                {selectedReport.ai_suggestion ||
                  'Remove listing. Policy violation: charging applicants upfront fees is strictly prohibited. This is an advisory suggestion; human administrator retains authority.'}
              </p>
            </div>

            {selectedReport.action_taken && (
              <div className="p-3 rounded-lg bg-[#1A7F4B]/10 border border-[#1A7F4B]/20 text-[#1A7F4B]">
                <strong>Action recorded:</strong> {selectedReport.action_taken} (by {selectedReport.reviewed_by})
              </div>
            )}

            {/* Action Buttons */}
            {selectedReport.status !== 'resolved' && (
              <div className="pt-2 border-t border-[#223247] flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleRemove}
                  className="px-4 py-2 rounded-lg bg-[#B42318] text-white font-bold hover:bg-[#961a10] transition-colors shadow-sm"
                >
                  Remove listing
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-3.5 py-2 rounded-lg border border-[#223247] text-[#A0AEC0] hover:text-white transition-colors"
                >
                  Request edit
                </button>
                <button
                  onClick={handleApproveDismiss}
                  className="px-3.5 py-2 rounded-lg border border-[#223247] text-[#A0AEC0] hover:text-white transition-colors ml-auto"
                >
                  Approve / Dismiss
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request Edit Modal */}
      {showEditModal && selectedReport && (
        <div className="fixed inset-0 z-50 bg-[#0B121C]/80 flex items-center justify-center p-4">
          <div className="admin-panel rounded-xl border border-[#223247] max-w-md w-full p-6 space-y-4 text-xs text-[#E7ECF3]">
            <h3 className="text-base font-bold text-white">Request Listing Edit from Employer</h3>
            <form onSubmit={handleConfirmRequestEdit} className="space-y-3">
              <label className="block text-[#A0AEC0]">Required Corrections:</label>
              <textarea
                value={editRequestText}
                onChange={(e) => setEditRequestText(e.target.value)}
                rows={3}
                required
                className="w-full p-2.5 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none focus:border-[#E8A317]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#223247] text-[#A0AEC0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#E8A317] text-[#0B1C2F] font-bold hover:bg-[#d69514]"
                >
                  Send Edit Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
