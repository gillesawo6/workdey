'use client';

import React, { useState } from 'react';
import { Calendar, Video, Clock, Check, MoreVertical, Plus, MapPin, Phone, X } from 'lucide-react';
import { useEmployer } from '@/lib/employer/employer-context';

export default function EmployerInterviewsPage() {
  const { activeOrg, interviews, applicants, orgJobs, scheduleInterview } = useEmployer();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(applicants[0]?.id || '');
  const [dateTime, setDateTime] = useState('2026-11-05T11:00');
  const [format, setFormat] = useState<'video' | 'onsite' | 'phone'>('video');
  const [locationOrLink, setLocationOrLink] = useState('https://meet.workdey.cm/savanna-panel');
  const [panelMembers, setPanelMembers] = useState('Head of Analytics, HR Director');

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId) return;

    scheduleInterview({
      application_id: selectedAppId,
      scheduled_at: new Date(dateTime).toISOString(),
      duration_minutes: 45,
      format,
      meeting_link_or_location: locationOrLink,
      interviewer_names: panelMembers.split(',').map((s) => s.trim()),
    });

    setShowScheduleModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#5A6779] block">
            {activeOrg?.name} · Interview Management
          </span>
          <h1 className="text-2xl font-bold text-[#0B1C2F] font-display">Interviews ({interviews.length})</h1>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-3.5 py-1.5 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F] flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Schedule interview
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-sm divide-y divide-[#E2E7EE]">
        {interviews.map((int) => {
          const app = applicants.find((a) => a.id === int.application_id);
          const job = orgJobs.find((j) => j.id === app?.job_id);
          const dateObj = new Date(int.scheduled_at);
          const monthName = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
          const dayNum = dateObj.getDate();
          const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div
              key={int.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F4F6F9] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#EAF0FC] text-[#2552C2] flex flex-col items-center justify-center font-bold text-xs flex-shrink-0">
                  <span className="text-[10px] uppercase font-bold">{monthName}</span>
                  <span className="text-base font-black leading-none">{dayNum}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[#0B1C2F]">
                      {app?.talent_name || 'Candidate Interview'}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F5F3] text-[#0B7F7A]">
                      {app?.match_score || 85}% match
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F6F9] text-[#5A6779] capitalize">
                      {int.format}
                    </span>
                  </div>

                  <p className="text-xs text-[#5A6779]">
                    {job?.title || 'Open Position'} · {timeStr} ({app?.talent_city || 'Douala'}) · {int.duration_minutes} min
                  </p>

                  <p className="text-[11px] text-[#3D4A5C]">
                    Panel: {int.interviewer_names.join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {int.format === 'video' ? (
                  <a
                    href={int.meeting_link_or_location || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F] flex items-center gap-1 shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" /> Join video call
                  </a>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-[#F4F6F9] text-xs font-semibold text-[#0B1C2F] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#5A6779]" /> {int.meeting_link_or_location}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {interviews.length === 0 && (
          <div className="p-12 text-center text-xs text-[#5A6779] space-y-2">
            <Calendar className="w-8 h-8 text-[#A0AEC0] mx-auto" />
            <p className="font-bold text-[#0B1C2F]">No interviews scheduled yet</p>
            <p>Schedule interviews from the candidates directory or applicant pipeline.</p>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2552C2]" />
                <h3 className="text-base font-bold text-[#0B1C2F]">Schedule Interview</h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Select Candidate</label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E7EE] outline-none"
                >
                  {applicants.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.talent_name} ({a.talent_headline.slice(0, 30)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E7EE] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Format</label>
                <div className="flex gap-2">
                  {(['video', 'onsite', 'phone'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`px-3 py-1.5 rounded-lg capitalize font-bold ${
                        format === fmt ? 'bg-[#2552C2] text-white' : 'bg-[#F4F6F9] text-[#5A6779]'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Meeting Link or Office Address</label>
                <input
                  type="text"
                  required
                  value={locationOrLink}
                  onChange={(e) => setLocationOrLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E7EE] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Panel Members</label>
                <input
                  type="text"
                  value={panelMembers}
                  onChange={(e) => setPanelMembers(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E7EE] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E7EE]">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#5A6779]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F]"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
