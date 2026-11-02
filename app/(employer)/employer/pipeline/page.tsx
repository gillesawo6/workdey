'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useEmployer } from '@/lib/employer/employer-context';
import {
  Users,
  Calendar,
  Filter,
  Check,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Plus,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Award,
  XCircle,
} from 'lucide-react';
import { ApplicationStage } from '@/lib/types/database';

export default function EmployerPipelinePage() {
  const { applicants, orgJobs, updateApplicantStage, scheduleInterview, addApplicantNote } = useEmployer();
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [filterMinMatch, setFilterMinMatch] = useState<number>(0);

  // Quick schedule modal state
  const [schedulingCandidateId, setSchedulingCandidateId] = useState<string | null>(null);
  const [scheduleDateTime, setScheduleDateTime] = useState('2026-11-04T14:00');
  const [scheduleFormat, setScheduleFormat] = useState<'video' | 'onsite' | 'phone'>('video');

  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      if (selectedJobId !== 'all' && a.job_id !== selectedJobId) return false;
      if ((a.match_score || 0) < filterMinMatch) return false;
      return true;
    });
  }, [applicants, selectedJobId, filterMinMatch]);

  const stages: { key: ApplicationStage; label: string; color: string; desc: string }[] = [
    { key: 'applied', label: 'New Applied', color: 'border-t-[#2552C2]', desc: 'Recently received' },
    { key: 'under_review', label: 'Under Review', color: 'border-t-[#2552C2]/70', desc: 'Screening in progress' },
    { key: 'shortlisted', label: 'Shortlisted', color: 'border-t-[#0B7F7A]', desc: 'Passed initial screening' },
    { key: 'interview', label: 'Interview', color: 'border-t-[#E8A317]', desc: 'Panel & technical talks' },
    { key: 'offer', label: 'Offer', color: 'border-t-[#1A7F4B]', desc: 'Offer extended / hired' },
  ];

  const handleAdvance = (applicantId: string, currentStage: ApplicationStage) => {
    const order: ApplicationStage[] = ['applied', 'under_review', 'shortlisted', 'interview', 'offer'];
    const idx = order.indexOf(currentStage);
    if (idx < order.length - 1) {
      updateApplicantStage(applicantId, order[idx + 1]);
    }
  };

  const handlePrevious = (applicantId: string, currentStage: ApplicationStage) => {
    const order: ApplicationStage[] = ['applied', 'under_review', 'shortlisted', 'interview', 'offer'];
    const idx = order.indexOf(currentStage);
    if (idx > 0) {
      updateApplicantStage(applicantId, order[idx - 1]);
    }
  };

  const handleQuickSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingCandidateId) return;

    scheduleInterview({
      application_id: schedulingCandidateId,
      scheduled_at: new Date(scheduleDateTime).toISOString(),
      duration_minutes: 45,
      format: scheduleFormat,
      meeting_link_or_location: 'https://meet.workdey.cm/savanna-panel',
      interviewer_names: ['Head of Analytics', 'Technical Lead'],
    });

    setSchedulingCandidateId(null);
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#5A6779] block">
            Recruitment Workflow · Interactive Kanban
          </span>
          <h1 className="text-2xl font-bold text-[#0B1C2F] font-display">
            Hiring Pipeline
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] bg-white text-xs font-semibold text-[#0B1C2F] outline-none"
          >
            <option value="all">All Jobs ({applicants.length} total)</option>
            {orgJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({applicants.filter((a) => a.job_id === j.id).length})
              </option>
            ))}
          </select>

          <select
            value={filterMinMatch}
            onChange={(e) => setFilterMinMatch(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] bg-white text-xs font-semibold text-[#0B1C2F] outline-none"
          >
            <option value={0}>All Fit Scores</option>
            <option value={75}>Match ≥ 75%</option>
            <option value={85}>Match ≥ 85% (High Fit)</option>
          </select>

          <Link
            href="/employer/applicants"
            className="px-3.5 py-1.5 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F] shadow-sm"
          >
            Table View
          </Link>
        </div>
      </div>

      {/* Multi-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start">
        {stages.map((stg) => {
          const stageCandidates = filteredApplicants.filter((c) => c.stage === stg.key);

          return (
            <div
              key={stg.key}
              className={`bg-[#F4F6F9] rounded-xl border border-[#E2E7EE] border-t-4 ${stg.color} p-3 flex flex-col min-w-[240px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E7EE] mb-3">
                <div>
                  <h3 className="text-xs font-bold text-[#0B1C2F]">{stg.label}</h3>
                  <p className="text-[10px] text-[#5A6779]">{stg.desc}</p>
                </div>
                <span className="text-xs font-bold text-[#5A6779] bg-white px-2 py-0.5 rounded border border-[#E2E7EE] tnum">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 min-h-[300px]">
                {stageCandidates.map((cand) => {
                  const job = orgJobs.find((j) => j.id === cand.job_id);

                  return (
                    <div
                      key={cand.id}
                      className="bg-white p-3.5 rounded-xl border border-[#E2E7EE] shadow-sm hover:shadow-md transition-all space-y-2.5 text-xs group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-[#0B1C2F] text-xs leading-tight">
                            {cand.talent_name}
                          </h4>
                          <p className="text-[11px] text-[#5A6779]">
                            {cand.talent_city} · {cand.talent_experience_years} yrs
                          </p>
                          <p className="text-[10px] font-semibold text-[#2552C2] truncate mt-0.5">
                            {job?.title || 'Open Role'}
                          </p>
                        </div>
                        <span
                          className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center tnum flex-shrink-0 ${
                            (cand.match_score || 0) >= 85
                              ? 'bg-[#E6F5F3] text-[#0B7F7A]'
                              : 'bg-[#EAF0FC] text-[#2552C2]'
                          }`}
                        >
                          {cand.match_score}%
                        </span>
                      </div>

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1">
                        {cand.talent_skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 bg-[#F4F6F9] rounded text-[10px] text-[#3D4A5C] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Notes count indicator */}
                      {cand.internal_notes.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-[#5A6779] bg-[#F4F6F9] px-2 py-1 rounded">
                          <MessageSquare className="w-3 h-3 text-[#5A6779]" />
                          <span className="truncate">{cand.internal_notes[cand.internal_notes.length - 1].text}</span>
                        </div>
                      )}

                      {/* Card Stage Movement Controls */}
                      <div className="pt-2 border-t border-[#E2E7EE] flex items-center justify-between text-[11px]">
                        <div>
                          {stg.key !== 'applied' && (
                            <button
                              onClick={() => handlePrevious(cand.id, cand.stage)}
                              className="text-[#5A6779] hover:text-[#0B1C2F] p-1 rounded hover:bg-[#F4F6F9]"
                              title="Move back a stage"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {stg.key === 'shortlisted' && (
                            <button
                              onClick={() => setSchedulingCandidateId(cand.id)}
                              className="px-2 py-0.5 rounded bg-[#EAF0FC] text-[#2552C2] font-bold text-[10px] hover:bg-[#2552C2] hover:text-white transition-colors"
                            >
                              Schedule
                            </button>
                          )}

                          {stg.key === 'interview' && (
                            <button
                              onClick={() => updateApplicantStage(cand.id, 'offer')}
                              className="px-2 py-0.5 rounded bg-[#E6F5F3] text-[#0B7F7A] font-bold text-[10px] hover:bg-[#0B7F7A] hover:text-white transition-colors flex items-center gap-0.5"
                            >
                              <Award className="w-3 h-3" /> Offer
                            </button>
                          )}

                          {stg.key !== 'offer' && (
                            <button
                              onClick={() => handleAdvance(cand.id, cand.stage)}
                              className="font-bold text-[#2552C2] hover:underline flex items-center gap-0.5"
                            >
                              Advance <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => updateApplicantStage(cand.id, 'rejected')}
                            title="Reject candidate"
                            className="text-[#5A6779] hover:text-[#B42318] p-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {stageCandidates.length === 0 && (
                  <div className="p-6 text-center text-xs text-[#5A6779] border-2 border-dashed border-[#E2E7EE] rounded-xl flex flex-col items-center justify-center min-h-[140px]">
                    <span className="text-[11px]">No candidates currently in {stg.label.toLowerCase()} stage.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Schedule Interview Modal */}
      {schedulingCandidateId && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-[#0B1C2F]">Schedule Interview</h3>
            <form onSubmit={handleQuickSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E7EE] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Format</label>
                <select
                  value={scheduleFormat}
                  onChange={(e) => setScheduleFormat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E7EE] outline-none"
                >
                  <option value="video">Video Conference</option>
                  <option value="onsite">On-site Interview</option>
                  <option value="phone">Phone Screening</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSchedulingCandidateId(null)}
                  className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#5A6779]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F]"
                >
                  Schedule & Move to Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
