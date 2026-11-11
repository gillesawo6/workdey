'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { useTalent } from '@/lib/talent/talent-context';
import { SEED_JOBS, SEED_ORGANIZATIONS } from '@/lib/data/seed-data';
import { MatchRing } from '@/components/ui/match-ring';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Bookmark,
  Building2,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  Target,
  Bell,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

export default function TalentDashboardPage() {
  const { user } = useAuth();
  const {
    profile,
    applications,
    interviews,
    roadmap,
    toggleRoadmapTask,
    savedJobIds,
    toggleSaveJob,
    isJobSaved,
    notifications,
    unreadNotificationsCount,
  } = useTalent();

  const orgMap = React.useMemo(() => {
    const map = new Map<string, (typeof SEED_ORGANIZATIONS)[0]>();
    SEED_ORGANIZATIONS.forEach((org) => map.set(org.id, org));
    return map;
  }, []);

  // Top recommended jobs
  const recommendedJobs = SEED_JOBS.slice(0, 3);
  const nextInterview = interviews[0];

  // Active applications
  const activeApps = applications.filter((a) => a.stage !== 'rejected' && a.stage !== 'withdrawn');

  // Quick wins for profile strength
  const profileQuickWins = [];
  if (profile.portfolios_list.length === 0) {
    profileQuickWins.push({ title: 'Add a portfolio / GitHub link', bump: '+7%', href: '/talent/profile' });
  }
  if (profile.certifications_list.length === 0) {
    profileQuickWins.push({ title: 'Add a professional certification', bump: '+8%', href: '/talent/profile' });
  }
  if (profile.skills_list.length < 5) {
    profileQuickWins.push({ title: 'Add 2 more key skills', bump: '+5%', href: '/talent/profile' });
  }
  if (profileQuickWins.length === 0) {
    profileQuickWins.push({ title: 'Refresh CV or headline', bump: '+3%', href: '/talent/profile' });
  }

  const currentDateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* 1. Header greeting & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#5A6779] block">
            {currentDateStr}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1C2F] font-display tracking-tight">
            Good morning, {profile.full_name?.split(' ')[0] || 'Aïcha'}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/talent/coach"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#E2E7EE] text-[#0B7F7A] text-xs font-bold hover:bg-[#E6F5F3] active:translate-y-px transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0B7F7A]" />
            Career Coach
          </Link>
          <Link
            href="/talent/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] active:translate-y-px transition-all shadow-xs group"
          >
            Discover jobs
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 2. Top Stats Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/talent/applications"
          className="p-4 bg-white rounded-[10px] border border-[#E2E7EE] shadow-xs hover:border-[#0B7F7A]/50 transition-colors"
        >
          <span className="text-[10px] font-bold text-[#5A6779] uppercase tracking-wider block">
            Active Applications
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#0B1C2F] tnum">{activeApps.length}</span>
            <span className="text-xs text-[#0B7F7A] font-semibold">Track stage →</span>
          </div>
        </Link>

        <Link
          href="/talent/saved"
          className="p-4 bg-white rounded-[10px] border border-[#E2E7EE] shadow-xs hover:border-[#0B7F7A]/50 transition-colors"
        >
          <span className="text-[10px] font-bold text-[#5A6779] uppercase tracking-wider block">
            Saved Roles
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#0B1C2F] tnum">{savedJobIds.length}</span>
            <span className="text-xs text-[#5A6779]">In pipeline</span>
          </div>
        </Link>

        <Link
          href="/talent/roadmap"
          className="p-4 bg-white rounded-[10px] border border-[#E2E7EE] shadow-xs hover:border-[#0B7F7A]/50 transition-colors"
        >
          <span className="text-[10px] font-bold text-[#5A6779] uppercase tracking-wider block">
            Roadmap Progress
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#0B1C2F] tnum">{roadmap.progress_pct}%</span>
            <span className="text-xs text-[#1A7F4B] font-semibold">On track</span>
          </div>
        </Link>

        <Link
          href="/talent/notifications"
          className="p-4 bg-white rounded-[10px] border border-[#E2E7EE] shadow-xs hover:border-[#0B7F7A]/50 transition-colors"
        >
          <span className="text-[10px] font-bold text-[#5A6779] uppercase tracking-wider block">
            Notifications
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#0B1C2F] tnum">{unreadNotificationsCount}</span>
            <span className="text-xs text-[#0B7F7A] font-semibold">Unread</span>
          </div>
        </Link>
      </div>

      {/* 3. Top Alert Banner & Interview Reminder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upcoming Interview Card */}
        <div className="lg:col-span-8 bg-white rounded-[10px] border border-[#E2E7EE] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#5A6779] uppercase tracking-wider">
              Upcoming Interview
            </span>
            <span className="text-xs text-[#0B7F7A] font-semibold">
              Savanna Agritech · Video Panel
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#E6F5F3]/60 border border-[#0B7F7A]/20">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-[#0B1C2F] text-white flex flex-col items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                <span className="text-[9px] text-[#14A89E] uppercase leading-none font-semibold">TUE</span>
                <span className="text-base leading-tight font-black tnum">3</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0B1C2F]">
                    Senior Data Analyst
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#0B7F7A] text-white font-semibold">
                    Savanna Agritech
                  </span>
                </div>
                <p className="text-xs text-[#5A6779] mt-0.5">
                  10:00 (Douala / WAT) · Video Call (45 min) · Panel: Head of Analytics, Agronomy Lead
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/talent/coach"
                className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-[#0B7F7A] text-white text-xs font-semibold hover:bg-[#14A89E] active:translate-y-px transition-all text-center shadow-xs"
              >
                Mock prep
              </Link>
              <Link
                href="/talent/applications"
                className="w-full sm:w-auto px-3 py-2 rounded-lg border border-[#E2E7EE] bg-white text-xs font-semibold text-[#0B1C2F] hover:bg-[#F4F6F9] active:translate-y-px transition-all text-center shadow-xs"
              >
                View details
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Profile Strength Meter */}
        <div className="lg:col-span-4 bg-white rounded-[10px] border border-[#E2E7EE] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#5A6779] uppercase tracking-wider">
                Profile Strength
              </p>
              <h3 className="text-sm font-bold text-[#0B1C2F] mt-0.5">
                {profile.profile_strength_pct >= 80 ? 'Strong' : 'Intermediate'}
              </h3>
              <p className="text-xs text-[#5A6779]">
                {profileQuickWins.length} recommendations available
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#0B7F7A] border-t-[#0B7F7A]/20 flex items-center justify-center font-black text-sm text-[#0B7F7A] tnum bg-[#E6F5F3]">
              {profile.profile_strength_pct}%
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#E2E7EE] text-xs">
            {profileQuickWins.slice(0, 3).map((win, idx) => (
              <Link
                key={idx}
                href={win.href}
                className="flex items-center justify-between text-[#3D4A5C] hover:text-[#0B7F7A] group"
              >
                <span className="group-hover:underline truncate">{win.title}</span>
                <span className="font-bold text-[#0B7F7A] tnum flex-shrink-0 ml-2">{win.bump}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Two Columns: Recommended Jobs vs Daily Tasks & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Top Recommended Jobs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0B1C2F]">
                Recommended for your profile
              </h2>
              <p className="text-xs text-[#5A6779]">
                Matches scored based on your SQL, Power BI, and Douala preferences
              </p>
            </div>
            <Link
              href="/talent/jobs"
              className="text-xs font-bold text-[#0B7F7A] hover:underline flex items-center gap-1"
            >
              See all {SEED_JOBS.length} jobs →
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((job) => {
              const org = orgMap.get(job.organization_id);
              const isSaved = isJobSaved(job.id);
              const score = job.id === 'job-senior-data-analyst' ? 92 : job.id === 'job-frontend-engineer' ? 87 : 78;

              return (
                <div
                  key={job.id}
                  className="p-4 bg-white rounded-[10px] border border-[#E2E7EE] shadow-xs hover:border-[#0B7F7A]/50 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F4F6F9] border border-[#E2E7EE] text-[#0B1C2F] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {org?.name?.substring(0, 2).toUpperCase() || 'WD'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[#5A6779]">
                            {org?.name || 'Verified Employer'}
                          </span>
                          {org?.verification_status === 'verified' && (
                            <span title="Verified Enterprise">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#1A7F4B]" />
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-[#0B1C2F]">
                          <Link href={`/talent/jobs?highlight=${job.id}`} className="hover:text-[#0B7F7A]">
                            {job.title}
                          </Link>
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MatchRing score={score} size="sm" showLabel={false} />
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSaved
                            ? 'bg-[#E6F5F3] border-[#0B7F7A] text-[#0B7F7A]'
                            : 'border-[#E2E7EE] text-[#5A6779] hover:text-[#0B1C2F]'
                        }`}
                        title={isSaved ? 'Saved' : 'Save job'}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6779]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0B7F7A]" />
                      {job.city} ({job.work_style})
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-[#0B1C2F] tnum">
                      {job.salary_min_xaf.toLocaleString()} – {job.salary_max_xaf.toLocaleString()} XAF / mo
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#F4F6F9] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#5A6779]">
                      Why: Skills 88% · Location 100%
                    </span>
                    <Link
                      href={`/talent/jobs?highlight=${job.id}`}
                      className="font-bold text-[#0B7F7A] hover:underline"
                    >
                      View match reasoning →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Roadmap Daily Tasks & Deadlines (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Tasks from Roadmap */}
          <div className="bg-white p-5 rounded-[10px] border border-[#E2E7EE] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#0B7F7A]" />
                <h3 className="text-xs font-bold text-[#0B1C2F] uppercase tracking-wider">
                  Roadmap Milestone Tasks
                </h3>
              </div>
              <Link href="/talent/roadmap" className="text-xs font-bold text-[#0B7F7A] hover:underline">
                Full plan →
              </Link>
            </div>

            <p className="text-xs text-[#5A6779]">
              Milestone: <strong className="text-[#0B1C2F]">{roadmap.milestones[1]?.title || 'Agribusiness Analytics'}</strong>
            </p>

            <div className="space-y-2 pt-1">
              {roadmap.milestones[1]?.tasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F4F6F9] cursor-pointer text-xs transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleRoadmapTask(roadmap.milestones[1].id, task.id)}
                    className="mt-0.5 rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
                  />
                  <span
                    className={`leading-relaxed ${
                      task.done ? 'line-through text-[#5A6779]' : 'text-[#0B1C2F] font-medium'
                    }`}
                  >
                    {task.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Application Deadlines */}
          <div className="bg-white p-5 rounded-[10px] border border-[#E2E7EE] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5A6779] uppercase tracking-wider">
                Upcoming Deadlines
              </span>
              <span className="text-xs text-[#5A6779]">This Month</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between p-2.5 rounded-lg bg-[#F4F6F9] border border-[#E2E7EE]">
                <div>
                  <span className="font-bold text-[#0B1C2F] block">Savanna Agritech</span>
                  <span className="text-[#5A6779] text-[11px]">Submit references &amp; portfolio</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF7EC] text-[#E8A317]">
                  Nov 5
                </span>
              </div>

              <div className="flex items-start justify-between p-2.5 rounded-lg bg-[#F4F6F9] border border-[#E2E7EE]">
                <div>
                  <span className="font-bold text-[#0B1C2F] block">Orbit Telecom Lead</span>
                  <span className="text-[#5A6779] text-[11px]">Application window closing</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF0FC] text-[#2552C2]">
                  Nov 15
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
