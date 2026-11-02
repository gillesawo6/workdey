'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTalent } from '@/lib/talent/talent-context';
import { SEED_JOBS, SEED_ORGANIZATIONS } from '@/lib/data/seed-data';
import { ApplicationStage, Application } from '@/lib/types/database';
import { MatchRing } from '@/components/ui/match-ring';
import {
  Check,
  Clock,
  ChevronRight,
  Video,
  ArrowRight,
  Download,
  Plus,
  LayoutGrid,
  List,
  Calendar,
  AlertCircle,
  FileText,
  Building2,
  Trash2,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  X,
} from 'lucide-react';

const STAGE_LABELS: Record<ApplicationStage, { label: string; color: string; bg: string }> = {
  saved: { label: 'Saved', color: 'text-[#5A6779]', bg: 'bg-[#F4F6F9]' },
  preparing: { label: 'Preparing', color: 'text-[#E8A317]', bg: 'bg-[#FEF7EC]' },
  applied: { label: 'Applied', color: 'text-[#0B7F7A]', bg: 'bg-[#E6F5F3]' },
  under_review: { label: 'Under Review', color: 'text-[#2552C2]', bg: 'bg-[#EAF0FC]' },
  screening: { label: 'Screening', color: 'text-[#2552C2]', bg: 'bg-[#EAF0FC]' },
  shortlisted: { label: 'Shortlisted', color: 'text-[#2552C2]', bg: 'bg-[#EAF0FC]' },
  interview: { label: 'Interview', color: 'text-[#14A89E]', bg: 'bg-[#E6F5F3]' },
  offer: { label: 'Offer Received', color: 'text-[#1A7F4B]', bg: 'bg-[#EAF5EF]' },
  hired: { label: 'Hired', color: 'text-[#1A7F4B]', bg: 'bg-[#EAF5EF]' },
  rejected: { label: 'Not Selected', color: 'text-[#D14343]', bg: 'bg-[#FDF2F2]' },
  withdrawn: { label: 'Withdrawn', color: 'text-[#5A6779]', bg: 'bg-[#F4F6F9]' },
};

export default function TalentApplicationsPage() {
  const { applications, updateApplicationStage, withdrawApplication, interviews } = useTalent();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');

  // Notes and tasks state for selected application
  const [appNotes, setAppNotes] = useState<Record<string, string>>({
    'app-1': 'Spoke with recruiter Françoise. Panel will focus on SQL window functions and regional yield forecasting.',
  });
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  const [appTasks, setAppTasks] = useState<Record<string, { id: string; text: string; done: boolean }[]>>({
    'app-1': [
      { id: 't1', text: 'Review Savanna Agritech Q3 agricultural forecast report', done: true },
      { id: 't2', text: 'Prepare 3 questions about their field data collection in West region', done: false },
      { id: 't3', text: 'Test Google Meet webcam and audio setup', done: false },
    ],
  });
  const [newTaskText, setNewTaskText] = useState('');

  const orgMap = useMemo(() => {
    const map = new Map<string, (typeof SEED_ORGANIZATIONS)[0]>();
    SEED_ORGANIZATIONS.forEach((org) => map.set(org.id, org));
    return map;
  }, []);

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];
  const selectedJob = SEED_JOBS.find((j) => j.id === selectedApp?.job_id) || SEED_JOBS[0];
  const selectedOrg = orgMap.get(selectedJob?.organization_id);

  // Filtered applications
  const filteredApps = useMemo(() => {
    if (filterStage === 'all') return applications;
    if (filterStage === 'active') {
      return applications.filter((a) => a.stage !== 'rejected' && a.stage !== 'withdrawn');
    }
    return applications.filter((a) => a.stage === filterStage);
  }, [applications, filterStage]);

  const stagesInOrder: ApplicationStage[] = [
    'applied',
    'under_review',
    'shortlisted',
    'interview',
    'offer',
  ];

  const handleStageChange = (appId: string, newStage: ApplicationStage) => {
    updateApplicationStage(appId, newStage);
  };

  const handleSaveNote = () => {
    if (!selectedApp) return;
    setAppNotes((prev) => ({ ...prev, [selectedApp.id]: noteDraft }));
    setIsEditingNote(false);
  };

  const handleToggleTask = (appId: string, taskId: string) => {
    setAppTasks((prev) => {
      const list = prev[appId] || [];
      return {
        ...prev,
        [appId]: list.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
      };
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || !selectedApp) return;
    setAppTasks((prev) => {
      const list = prev[selectedApp.id] || [];
      return {
        ...prev,
        [selectedApp.id]: [...list, { id: `tk-${Date.now()}`, text: newTaskText.trim(), done: false }],
      };
    });
    setNewTaskText('');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Job Title,Company,Stage,Applied Date', ...applications.map((a) => {
        const j = SEED_JOBS.find((job) => job.id === a.job_id);
        return `"${j?.title || 'Role'}","${j?.organization_id || 'Company'}","${a.stage}","${a.applied_at}"`;
      })].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'WorkDey_Applications_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C2F] font-display">
            Application Tracker
          </h1>
          <div className="flex items-center gap-3 text-xs text-[#5A6779] mt-1">
            <span className="font-semibold text-[#0B7F7A]">
              Active: {applications.filter((a) => a.stage !== 'rejected' && a.stage !== 'withdrawn').length}
            </span>
            <span>·</span>
            <span>Interviews: {applications.filter((a) => a.stage === 'interview').length}</span>
            <span>·</span>
            <span>Offers: {applications.filter((a) => a.stage === 'offer').length}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-lg border border-[#E2E7EE] p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs font-semibold ${
                viewMode === 'list' ? 'bg-[#0B7F7A] text-white shadow-sm' : 'text-[#5A6779] hover:text-[#0B1C2F]'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded text-xs font-semibold ${
                viewMode === 'kanban' ? 'bg-[#0B7F7A] text-white shadow-sm' : 'text-[#5A6779] hover:text-[#0B1C2F]'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] bg-white text-xs font-semibold text-[#0B1C2F] hover:bg-[#F4F6F9] flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <Link
            href="/talent/jobs"
            className="px-4 py-1.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] shadow-sm flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Find more roles
          </Link>
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: 'all', label: `All (${applications.length})` },
          { id: 'active', label: 'Active' },
          { id: 'interview', label: 'Interview Scheduled' },
          { id: 'under_review', label: 'Under Review' },
          { id: 'shortlisted', label: 'Shortlisted' },
          { id: 'offer', label: 'Offers' },
          { id: 'withdrawn', label: 'Withdrawn' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStage(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterStage === tab.id
                ? 'bg-[#0B7F7A] text-white shadow-sm'
                : 'bg-white border border-[#E2E7EE] text-[#5A6779] hover:bg-[#F4F6F9]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Main Views: List View or Kanban Board View */}
      {viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {(['applied', 'under_review', 'interview', 'offer'] as ApplicationStage[]).map((colStage) => {
            const colApps = applications.filter((a) => a.stage === colStage);
            const badge = STAGE_LABELS[colStage];

            return (
              <div key={colStage} className="bg-[#F4F6F9] rounded-xl p-4 border border-[#E2E7EE] space-y-3 min-w-[260px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B1C2F] uppercase tracking-wider">
                    {badge.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-[#0B1C2F] border border-[#E2E7EE] tnum">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {colApps.map((app) => {
                    const job = SEED_JOBS.find((j) => j.id === app.job_id);
                    const org = orgMap.get(job?.organization_id || '');

                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedAppId(app.id)}
                        className="bg-white p-4 rounded-lg border border-[#E2E7EE] shadow-sm hover:border-[#0B7F7A] cursor-pointer space-y-2"
                      >
                        <span className="text-[10px] text-[#5A6779] font-medium block">
                          {org?.name || 'Verified Organization'}
                        </span>
                        <h4 className="text-xs font-bold text-[#0B1C2F] leading-snug">
                          {job?.title || 'Position'}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-[#5A6779] pt-1 border-t border-[#F4F6F9]">
                          <span className="tnum">{job?.city}</span>
                          <span className="font-bold text-[#0B7F7A]">{app.match_score || 85}% match</span>
                        </div>
                      </div>
                    );
                  })}
                  {colApps.length === 0 && (
                    <div className="p-4 text-center text-xs text-[#5A6779] border-2 border-dashed border-[#CBD5E1] rounded-lg">
                      No applications in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View (Two Columns: List + Detail Drawer) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Applications List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredApps.map((app) => {
              const job = SEED_JOBS.find((j) => j.id === app.job_id) || SEED_JOBS[0];
              const org = orgMap.get(job.organization_id);
              const isSelected = selectedApp?.id === app.id;
              const badge = STAGE_LABELS[app.stage] || STAGE_LABELS.applied;

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer space-y-4 ${
                    isSelected
                      ? 'border-[#0B7F7A] bg-white shadow-md ring-1 ring-[#0B7F7A]'
                      : 'border-[#E2E7EE] bg-white hover:border-[#0B7F7A]/50 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F4F6F9] border border-[#E2E7EE] text-[#0B1C2F] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {org?.name?.substring(0, 2).toUpperCase() || 'WD'}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0B1C2F]">{job.title}</h3>
                        <p className="text-xs text-[#5A6779]">
                          {org?.name || 'Verified Employer'} · Applied {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badge.bg} ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* 5-Stage Step Progress Rail (PDF Page 16) */}
                  <div className="pt-3 border-t border-[#E2E7EE] flex items-center justify-between text-xs">
                    {stagesInOrder.map((stg, index) => {
                      const currentIdx = stagesInOrder.indexOf(app.stage as any);
                      const isPassed = currentIdx >= index;
                      const isCurrent = currentIdx === index;

                      return (
                        <div key={stg} className="flex flex-col items-center flex-1 relative">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isPassed
                                ? 'bg-[#0B7F7A] text-white shadow-sm'
                                : 'bg-[#E2E7EE] text-[#5A6779]'
                            }`}
                          >
                            {isPassed ? <Check className="w-3 h-3" /> : index + 1}
                          </div>
                          <span
                            className={`text-[10px] capitalize mt-1 hidden sm:block ${
                              isCurrent ? 'font-bold text-[#0B7F7A]' : 'text-[#5A6779]'
                            }`}
                          >
                            {stg.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Application Details, Notes & Tasks (5 cols) */}
          {selectedApp && (
            <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E7EE] p-6 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E2E7EE]">
                <div>
                  <span className="text-[10px] font-bold text-[#5A6779] uppercase tracking-wider block">
                    Application Focus
                  </span>
                  <h2 className="text-lg font-bold text-[#0B1C2F] mt-1">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs text-[#5A6779]">
                    {selectedOrg?.name} · {selectedJob.city} ({selectedJob.work_style})
                  </p>
                </div>
                <MatchRing score={selectedApp.match_score || 88} size="sm" showLabel={false} />
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1C2F] block">
                  Update Application Stage:
                </label>
                <select
                  value={selectedApp.stage}
                  onChange={(e) => handleStageChange(selectedApp.id, e.target.value as ApplicationStage)}
                  className="w-full p-2 text-xs rounded-lg border border-[#E2E7EE] bg-[#F4F6F9] font-semibold text-[#0B1C2F] outline-none"
                >
                  <option value="saved">Saved</option>
                  <option value="preparing">Preparing</option>
                  <option value="applied">Applied</option>
                  <option value="under_review">Under Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview Scheduled</option>
                  <option value="offer">Offer Received</option>
                  <option value="rejected">Not Selected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              {/* Interview Box (if stage === 'interview') */}
              {selectedApp.stage === 'interview' && (
                <div className="p-4 rounded-xl bg-[#E6F5F3] border border-[#0B7F7A]/30 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#0B7F7A] font-bold">
                    <Video className="w-4 h-4" />
                    <span>Interview Scheduled</span>
                  </div>
                  <p className="font-semibold text-[#0B1C2F]">
                    Tuesday 3 Nov · 10:00 (Douala / WAT)
                  </p>
                  <p className="text-[#5A6779]">
                    Format: Video Conference (Google Meet) · Panel: Head of Analytics, Operations Lead
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/talent/coach"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0B7F7A] hover:underline"
                    >
                      Practice interview questions with AI Coach →
                    </Link>
                  </div>
                </div>
              )}

              {/* Private Candidate Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B1C2F] uppercase tracking-wider text-[11px]">
                    My Private Interview Notes
                  </span>
                  <button
                    onClick={() => {
                      if (!isEditingNote) setNoteDraft(appNotes[selectedApp.id] || '');
                      setIsEditingNote(!isEditingNote);
                    }}
                    className="text-xs font-semibold text-[#0B7F7A] hover:underline cursor-pointer"
                  >
                    {isEditingNote ? 'Cancel' : 'Edit Note'}
                  </button>
                </div>

                {isEditingNote ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Add key talking points, questions to ask, or salary target..."
                      className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                    />
                    <button
                      onClick={handleSaveNote}
                      className="px-3 py-1.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-[#3D4A5C] bg-[#F4F6F9] p-3 rounded-lg border border-[#E2E7EE] italic">
                    {appNotes[selectedApp.id] || 'No notes added yet. Record conversation highlights or salary requirements here.'}
                  </p>
                )}
              </div>

              {/* Follow-up Checklist Tasks */}
              <div className="space-y-2 pt-2 border-t border-[#E2E7EE]">
                <span className="text-xs font-bold text-[#0B1C2F] uppercase tracking-wider text-[11px] block">
                  Follow-up Tasks
                </span>

                <div className="space-y-2">
                  {(appTasks[selectedApp.id] || []).map((t) => (
                    <label
                      key={t.id}
                      className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-[#F4F6F9] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => handleToggleTask(selectedApp.id, t.id)}
                        className="rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
                      />
                      <span className={`text-[#3D4A5C] ${t.done ? 'line-through text-[#5A6779]' : ''}`}>
                        {t.text}
                      </span>
                    </label>
                  ))}
                </div>

                <form onSubmit={handleAddTask} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add follow-up task..."
                    className="flex-1 p-2 text-xs rounded-lg border border-[#E2E7EE] outline-none focus:border-[#0B7F7A]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E]"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Bottom Danger Action */}
              <div className="pt-4 border-t border-[#E2E7EE] flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to withdraw this application?')) {
                      withdrawApplication(selectedApp.id);
                    }
                  }}
                  className="text-xs text-[#D14343] hover:underline cursor-pointer"
                >
                  Withdraw application
                </button>

                <Link
                  href="/talent/coach"
                  className="text-xs font-bold text-[#0B7F7A] hover:underline flex items-center gap-1"
                >
                  Prepare with Coach →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
