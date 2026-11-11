'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useEmployer } from '@/lib/employer/employer-context';
import {
  Users,
  Briefcase,
  GitPullRequest,
  Calendar,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function EmployerDashboardPage() {
  const { activeOrg, metrics, orgJobs, applicants, interviews } = useEmployer();

  // Dynamic pipeline distribution calculated from real applicants
  const pipelineStats = useMemo(() => {
    const total = applicants.length || 1;
    const stages = [
      { key: 'applied', label: 'Applied (New)', color: 'bg-[#2552C2]' },
      { key: 'under_review', label: 'Under Review', color: 'bg-[#2552C2]/80' },
      { key: 'shortlisted', label: 'Shortlisted', color: 'bg-[#0B7F7A]' },
      { key: 'interview', label: 'Interview', color: 'bg-[#E8A317]' },
      { key: 'offer', label: 'Offer', color: 'bg-[#1A7F4B]' },
    ];

    return stages.map((stg) => {
      const count = applicants.filter((a) => a.stage === stg.key).length;
      const pct = Math.round((count / total) * 100);
      return {
        ...stg,
        count,
        pct: `${Math.max(pct, count > 0 ? 8 : 0)}%`,
      };
    });
  }, [applicants]);

  // Recent activity feed generated from real records
  const recentActivities = useMemo(() => {
    const list: { id: string; title: string; time: string; type: 'app' | 'int' | 'job' }[] = [];

    // Applicants
    applicants.slice(0, 3).forEach((a) => {
      list.push({
        id: `act-${a.id}`,
        title: `${a.talent_name} applied for ${orgJobs.find((j) => j.id === a.job_id)?.title || 'Open Role'} (${a.match_score}% match)`,
        time: 'Recently',
        type: 'app',
      });
    });

    // Scheduled interviews
    interviews.slice(0, 2).forEach((i) => {
      const app = applicants.find((a) => a.id === i.application_id);
      list.push({
        id: `act-int-${i.id}`,
        title: `Interview scheduled with ${app?.talent_name || 'Candidate'} (${i.format})`,
        time: 'Scheduled',
        type: 'int',
      });
    });

    return list;
  }, [applicants, orgJobs, interviews]);

  return (
    <div className="space-y-6">
      {/* 1. Top Title & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#5A6779] block">
            Employer Workspace · {activeOrg?.name || 'Savanna Agritech'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C2F] font-display tracking-tight">
            Hiring overview
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/employer/pipeline"
            className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] bg-white text-xs font-semibold text-[#0B1C2F] hover:bg-[#F4F6F9] transition-colors"
          >
            Open Kanban Pipeline
          </Link>
          <Link
            href="/employer/jobs/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F] transition-all shadow-sm group"
          >
            <Plus className="w-3.5 h-3.5" />
            Post a job
          </Link>
        </div>
      </div>

      {/* Verification Banner if pending */}
      {activeOrg?.verification_status !== 'verified' && (
        <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#B45309] flex-shrink-0" />
            <span>
              <strong>Verification Pending:</strong> Submit your business registration document so your job listings receive the verified employer trust badge.
            </span>
          </div>
          <Link
            href="/employer/profile"
            className="px-3 py-1 bg-[#B45309] text-white rounded-lg font-bold text-[11px] hover:bg-[#92400E] flex-shrink-0"
          >
            Upload doc →
          </Link>
        </div>
      )}

      {/* 2. Top Metric Cards (Calculated Dynamically from Real Data) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[10px] border border-[#E2E7EE] shadow-xs">
          <p className="text-xs text-[#5A6779]">Open roles</p>
          <p className="text-3xl font-black text-[#0B1C2F] mt-1 tnum">{metrics.openRoles}</p>
          <p className="text-[11px] text-[#5A6779] mt-1">
            {orgJobs.length} total published/drafted
          </p>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-[#E2E7EE] shadow-xs">
          <p className="text-xs text-[#5A6779]">Total candidates</p>
          <p className="text-3xl font-black text-[#0B1C2F] mt-1 tnum">{metrics.totalApplicants}</p>
          <p className="text-[11px] text-[#1A7F4B] font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {metrics.newApplicantsCount} new this week
          </p>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-[#E2E7EE] shadow-xs">
          <p className="text-xs text-[#5A6779]">Awaiting review</p>
          <p className="text-3xl font-black text-[#2552C2] mt-1 tnum">{metrics.awaitingReviewCount}</p>
          <p className="text-[11px] text-[#5A6779] mt-1">
            {metrics.shortlistedCount} shortlisted for interview
          </p>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-[#E2E7EE] shadow-xs">
          <p className="text-xs text-[#5A6779]">Scheduled interviews</p>
          <p className="text-3xl font-black text-[#0B7F7A] mt-1 tnum">{metrics.interviewsScheduled}</p>
          <p className="text-[11px] text-[#0B7F7A] font-semibold mt-1">
            {metrics.offersCount} offers extended
          </p>
        </div>
      </div>

      {/* 3. Middle Two-Column Grid: Pipeline Rail & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pipeline Snapshot rails */}
        <div className="lg:col-span-7 bg-white p-6 rounded-[10px] border border-[#E2E7EE] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#0B1C2F] uppercase tracking-wider">
              Recruitment pipeline breakdown
            </h3>
            <Link href="/employer/pipeline" className="text-xs text-[#2552C2] hover:underline font-semibold">
              Manage Kanban →
            </Link>
          </div>

          <div className="space-y-3.5 pt-1">
            {pipelineStats.map((p) => (
              <div key={p.key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#0B1C2F]">{p.label}</span>
                  <span className="font-bold text-[#0B1C2F] tnum">{p.count} candidate{p.count === 1 ? '' : 's'}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E2E7EE] overflow-hidden">
                  <div
                    style={{ width: p.pct }}
                    className={`h-full rounded-full transition-all duration-500 ${p.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Recruitment Activity */}
        <div className="lg:col-span-5 bg-white p-6 rounded-[10px] border border-[#E2E7EE] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#0B1C2F] uppercase tracking-wider">
              Live recruitment activity
            </h3>
            <span className="text-[10px] text-[#5A6779]">Real-time feed</span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            {recentActivities.map((act) => (
              <div key={act.id} className="p-3 rounded-lg bg-[#F4F6F9] border border-[#E2E7EE] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#EAF0FC] text-[#2552C2] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  {act.type === 'app' ? <Users className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0B1C2F] leading-snug">{act.title}</p>
                  <p className="text-[11px] text-[#5A6779] mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}

            <Link
              href="/employer/applicants"
              className="block text-center text-xs text-[#2552C2] font-bold hover:underline pt-2"
            >
              View all {applicants.length} applicants →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Active Jobs Table with Direct Status Controls */}
      <div className="bg-white rounded-[10px] border border-[#E2E7EE] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2E7EE] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0B1C2F]">Active jobs ({orgJobs.length})</h3>
            <p className="text-xs text-[#5A6779]">Roles posted under {activeOrg?.name}</p>
          </div>
          <Link
            href="/employer/jobs"
            className="text-xs font-semibold text-[#2552C2] hover:underline"
          >
            Manage all roles
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F6F9] border-b border-[#E2E7EE] text-[10px] font-bold text-[#5A6779] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Location & Type</th>
                <th className="px-5 py-3 tnum">Applicants</th>
                <th className="px-5 py-3 tnum">Shortlisted</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E7EE]">
              {orgJobs.map((job) => {
                const jobApplicants = applicants.filter((a) => a.job_id === job.id);
                const shortlisted = jobApplicants.filter((a) => a.stage === 'shortlisted' || a.stage === 'interview');

                return (
                  <tr key={job.id} className="hover:bg-[#F4F6F9] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-[#0B1C2F]">{job.title}</p>
                      <p className="text-[11px] text-[#5A6779]">
                        {job.category_name || 'Technology'} · {job.salary_min_xaf.toLocaleString()} – {job.salary_max_xaf.toLocaleString()} XAF
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-[#5A6779]">
                      {job.city} · {job.work_style}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#0B1C2F] tnum">
                      {jobApplicants.length || job.applicants_count || 0}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#0B7F7A] tnum">
                      {shortlisted.length || job.shortlisted_count || 0}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          job.status === 'open'
                            ? 'bg-[#E6F5F3] text-[#0B7F7A]'
                            : 'bg-[#F4F6F9] text-[#5A6779]'
                        }`}
                      >
                        {job.status === 'open' ? 'Open' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <Link
                        href={`/employer/pipeline?job=${job.id}`}
                        className="text-xs font-semibold text-[#2552C2] hover:underline"
                      >
                        Pipeline →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
