'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTalent } from '@/lib/talent/talent-context';
import { SEED_JOBS, SEED_ORGANIZATIONS } from '@/lib/data/seed-data';
import { MatchRing } from '@/components/ui/match-ring';
import { Bookmark, ArrowRight, X, Clock, MapPin, ShieldCheck, Briefcase, Trash2 } from 'lucide-react';

export default function TalentSavedJobsPage() {
  const { savedJobIds, toggleSaveJob, applications, createApplication } = useTalent();
  const [filterStyle, setFilterStyle] = useState('all');

  const orgMap = useMemo(() => {
    const map = new Map<string, (typeof SEED_ORGANIZATIONS)[0]>();
    SEED_ORGANIZATIONS.forEach((org) => map.set(org.id, org));
    return map;
  }, []);

  const savedJobs = useMemo(() => {
    return SEED_JOBS.filter((job) => savedJobIds.includes(job.id));
  }, [savedJobIds]);

  const filteredSavedJobs = useMemo(() => {
    if (filterStyle === 'all') return savedJobs;
    return savedJobs.filter((j) => j.work_style === filterStyle);
  }, [savedJobs, filterStyle]);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#5A6779] block">
            {savedJobs.length} role{savedJobs.length === 1 ? '' : 's'} saved for later
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C2F] font-display">
            Saved Jobs
          </h1>
        </div>

        <Link
          href="/talent/jobs"
          className="px-4 py-2 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          Discover more roles →
        </Link>
      </div>

      {/* 2. Filter tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: 'all', label: `All (${savedJobs.length})` },
          { id: 'hybrid', label: `Hybrid (${savedJobs.filter((j) => j.work_style === 'hybrid').length})` },
          { id: 'remote', label: `Remote (${savedJobs.filter((j) => j.work_style === 'remote').length})` },
          { id: 'onsite', label: `On-site (${savedJobs.filter((j) => j.work_style === 'onsite').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStyle(tab.id)}
            className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-colors cursor-pointer ${
              filterStyle === tab.id
                ? 'bg-[#0B7F7A] text-white shadow-sm'
                : 'bg-white border border-[#E2E7EE] text-[#5A6779] hover:bg-[#F4F6F9]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Saved Job List */}
      {filteredSavedJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E7EE] p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F4F6F9] text-[#5A6779] flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0B1C2F]">No saved jobs in this category</h3>
          <p className="text-xs text-[#5A6779] max-w-sm mx-auto">
            Bookmark interesting listings while browsing discovery to organize your application targets.
          </p>
          <Link
            href="/talent/jobs"
            className="inline-block px-4 py-2 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E]"
          >
            Browse verified jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSavedJobs.map((job) => {
            const org = orgMap.get(job.organization_id);
            const isApplied = applications.some((a) => a.job_id === job.id);
            const matchScore = job.id === 'job-senior-data-analyst' ? 92 : job.id === 'job-frontend-engineer' ? 87 : 79;

            return (
              <div
                key={job.id}
                className="bg-white p-5 rounded-xl border border-[#E2E7EE] shadow-sm hover:border-[#0B7F7A]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#F4F6F9] border border-[#E2E7EE] text-[#0B1C2F] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {org?.name ? org.name.substring(0, 2).toUpperCase() : 'WD'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#5A6779]">
                        {org?.name || 'Verified Employer'}
                      </span>
                      {org?.verification_status === 'verified' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#1A7F4B]" />
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#0B1C2F]">{job.title}</h3>
                    <p className="text-xs text-[#5A6779]">
                      {job.city} ({job.work_style}) · {job.experience_level}
                    </p>
                    <p className="text-xs font-bold text-[#0B1C2F] tnum">
                      {job.salary_min_xaf.toLocaleString()} – {job.salary_max_xaf.toLocaleString()} XAF / month
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <MatchRing score={matchScore} size="sm" showLabel={false} />
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className="p-2 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#5A6779] hover:text-[#D14343] hover:bg-[#F4F6F9] transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {isApplied ? (
                    <Link
                      href="/talent/applications"
                      className="px-3.5 py-1.5 rounded-lg bg-[#EAF0FC] text-[#2552C2] text-xs font-bold"
                    >
                      View Application
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        createApplication(job.id);
                        alert(`Application submitted for ${job.title}!`);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] transition-colors shadow-sm cursor-pointer"
                    >
                      Apply Now →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
