'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEmployer } from '@/lib/employer/employer-context';
import {
  Plus,
  Briefcase,
  MapPin,
  Users,
  MoreVertical,
  Calendar,
  Check,
  Pause,
  Play,
  Trash2,
  Edit,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { JobListing } from '@/lib/types/database';

export default function EmployerJobsListPage() {
  const { activeOrg, orgJobs, applicants, toggleJobStatus, deleteJob } = useEmployer();
  const [activeTab, setActiveTab] = useState<'open' | 'draft' | 'closed'>('open');
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const filteredJobs = orgJobs.filter((j) => {
    if (activeTab === 'open') return j.status === 'open';
    if (activeTab === 'draft') return j.status === 'draft';
    return j.status === 'closed';
  });

  const openCount = orgJobs.filter((j) => j.status === 'open').length;
  const draftCount = orgJobs.filter((j) => j.status === 'draft').length;
  const closedCount = orgJobs.filter((j) => j.status === 'closed').length;

  const handleToggleStatus = (job: JobListing) => {
    const nextStatus = job.status === 'open' ? 'closed' : 'open';
    toggleJobStatus(job.id, nextStatus);
    setActionAlert(`Role "${job.title}" status changed to ${nextStatus}.`);
    setTimeout(() => setActionAlert(null), 3000);
  };

  const handleDelete = (job: JobListing) => {
    if (confirm(`Are you sure you want to delete the job posting "${job.title}"?`)) {
      deleteJob(job.id);
      setActionAlert(`Role "${job.title}" has been deleted.`);
      setTimeout(() => setActionAlert(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#5A6779] block">
            {activeOrg?.name} · Recruitment Management
          </span>
          <h1 className="text-2xl font-bold text-[#0B1C2F] font-display">Job postings</h1>
        </div>

        <Link
          href="/employer/jobs/create"
          className="px-4 py-2 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F] flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Post a job
        </Link>
      </div>

      {actionAlert && (
        <div className="p-3 bg-[#E6F5F3] border border-[#0B7F7A]/20 text-[#0B7F7A] text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" /> {actionAlert}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => setActiveTab('open')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
            activeTab === 'open'
              ? 'bg-[#2552C2] text-white'
              : 'bg-white border border-[#E2E7EE] text-[#5A6779] hover:bg-[#F4F6F9]'
          }`}
        >
          Open ({openCount})
        </button>
        <button
          onClick={() => setActiveTab('draft')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
            activeTab === 'draft'
              ? 'bg-[#2552C2] text-white'
              : 'bg-white border border-[#E2E7EE] text-[#5A6779] hover:bg-[#F4F6F9]'
          }`}
        >
          Drafts ({draftCount})
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
            activeTab === 'closed'
              ? 'bg-[#2552C2] text-white'
              : 'bg-white border border-[#E2E7EE] text-[#5A6779] hover:bg-[#F4F6F9]'
          }`}
        >
          Closed ({closedCount})
        </button>
      </div>

      {/* Jobs list */}
      <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-sm divide-y divide-[#E2E7EE]">
        {filteredJobs.map((job) => {
          const jobApps = applicants.filter((a) => a.job_id === job.id);
          const shortlisted = jobApps.filter((a) => a.stage === 'shortlisted' || a.stage === 'interview');

          return (
            <div
              key={job.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F4F6F9] transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#0B1C2F]">{job.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      job.status === 'open'
                        ? 'bg-[#E6F5F3] text-[#0B7F7A]'
                        : job.status === 'draft'
                        ? 'bg-[#FEF3C7] text-[#92400E]'
                        : 'bg-[#F4F6F9] text-[#5A6779]'
                    }`}
                  >
                    {job.status === 'open' ? 'Active' : job.status === 'draft' ? 'Draft' : 'Closed'}
                  </span>
                </div>

                <p className="text-xs text-[#5A6779]">
                  {job.city} ({job.region}) · {job.work_style} · {job.contract_type.replace('_', ' ')} ·{' '}
                  <span className="font-semibold text-[#0B1C2F]">
                    {job.salary_min_xaf.toLocaleString()} – {job.salary_max_xaf.toLocaleString()} XAF
                  </span>
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#3D4A5C] pt-1">
                  <span className="font-bold text-[#0B1C2F]">{jobApps.length} applicants</span>
                  <span>·</span>
                  <span className="text-[#0B7F7A] font-bold">{shortlisted.length} shortlisted</span>
                  {job.deadline && (
                    <>
                      <span>·</span>
                      <span className="text-[#5A6779] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Closes: {job.deadline}
                      </span>
                    </>
                  )}
                </div>

                {/* Skill tags preview */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {job.required_skills?.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-[#F4F6F9] text-[10px] font-medium text-[#5A6779] border border-[#E2E7EE]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                <button
                  onClick={() => handleToggleStatus(job)}
                  className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#5A6779] hover:text-[#0B1C2F] hover:bg-white transition-colors flex items-center gap-1"
                >
                  {job.status === 'open' ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-[#E8A317]" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-[#1A7F4B]" /> Publish
                    </>
                  )}
                </button>

                <Link
                  href={`/employer/pipeline?job=${job.id}`}
                  className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#0B1C2F] hover:bg-white transition-colors"
                >
                  Pipeline
                </Link>

                <Link
                  href={`/employer/applicants?job=${job.id}`}
                  className="px-3 py-1.5 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F] transition-colors"
                >
                  Applicants ({jobApps.length}) →
                </Link>

                <button
                  onClick={() => handleDelete(job)}
                  title="Delete job posting"
                  className="p-2 rounded-lg text-[#5A6779] hover:text-[#B42318] hover:bg-[#F4F6F9]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredJobs.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <Briefcase className="w-8 h-8 text-[#A0AEC0] mx-auto" />
            <h4 className="font-bold text-sm text-[#0B1C2F]">No {activeTab} jobs found</h4>
            <p className="text-xs text-[#5A6779]">
              {activeTab === 'open'
                ? 'You have no active listings right now. Publish a new role to start receiving matched candidates.'
                : `There are currently no listings in ${activeTab} state.`}
            </p>
            {activeTab === 'open' && (
              <Link
                href="/employer/jobs/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F]"
              >
                <Plus className="w-3.5 h-3.5" /> Create a job
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
