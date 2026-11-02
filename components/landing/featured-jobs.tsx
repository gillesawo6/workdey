'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SEED_JOBS, SEED_ORGANIZATIONS } from '@/lib/data/seed-data';
import { MatchRing } from '@/components/ui/match-ring';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Building2, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export function FeaturedJobs() {
  const [filter, setFilter] = useState<'all' | 'Douala' | 'Yaoundé' | 'remote' | 'Kribi'>('all');

  const orgMap = React.useMemo(() => {
    const map = new Map<string, (typeof SEED_ORGANIZATIONS)[0]>();
    SEED_ORGANIZATIONS.forEach((org) => map.set(org.id, org));
    return map;
  }, []);

  const filteredJobs = React.useMemo(() => {
    return SEED_JOBS.filter((job) => {
      if (filter === 'all') return true;
      if (filter === 'remote') return job.work_style === 'remote';
      return job.city.toLowerCase() === filter.toLowerCase();
    }).slice(0, 6);
  }, [filter]);

  // Demo match scores for guest preview
  const demoScores: Record<string, number> = {
    'job-senior-data-analyst': 92,
    'job-customer-success-lead': 78,
    'job-frontend-engineer': 87,
    'job-operations-coordinator': 74,
  };

  return (
    <section className="py-20 bg-white border-y border-[#E2E7EE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-bold text-[#0B7F7A] uppercase tracking-wider mb-2">
              Verified Employers &amp; Remote Roles
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B1C2F] font-display tracking-tight text-balance break-words">
              Featured opportunities in Cameroon &amp; Remote
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6779] mt-1.5 max-w-xl leading-relaxed">
              Real positions with transparent salary bands in XAF. Every posting is backed by a verified business registry.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-[#F4F6F9] p-1 rounded-lg border border-[#E2E7EE] self-start md:self-auto">
            {(
              [
                { id: 'all', label: 'All Locations' },
                { id: 'Douala', label: 'Douala' },
                { id: 'Yaoundé', label: 'Yaoundé' },
                { id: 'remote', label: 'Remote' },
                { id: 'Kribi', label: 'Kribi' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? 'bg-white text-[#0B1C2F] shadow-sm'
                    : 'text-[#5A6779] hover:text-[#0B1C2F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const org = orgMap.get(job.organization_id);
            const score = demoScores[job.id] || 82;

            return (
              <div
                key={job.id}
                className="bg-white rounded-[10px] border border-[#E2E7EE] p-5 shadow-[0_1px_3px_rgba(11,28,47,0.05)] hover:border-[#0B7F7A]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top row: Company icon, info, and Match Ring */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F4F6F9] border border-[#E2E7EE] text-[#0B1C2F] flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-[#E6F5F3] group-hover:text-[#0B7F7A] transition-colors">
                        {org?.name ? org.name.substring(0, 2).toUpperCase() : 'WD'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-[#5A6779] hover:text-[#0B1C2F]">
                            {org?.name || 'Verified Employer'}
                          </span>
                          {org?.verification_status === 'verified' && (
                            <span title="Verified Organisation">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#1A7F4B]" />
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-[#0B1C2F] group-hover:text-[#0B7F7A] transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    <MatchRing score={score} size="sm" showLabel={false} />
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6779]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0B7F7A]" />
                      {job.city} ({job.work_style})
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {job.experience_level}
                    </span>
                  </div>

                  {/* Job excerpt */}
                  <p className="text-xs text-[#3D4A5C] line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.required_skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F4F6F9] text-[#3D4A5C] border border-[#E2E7EE]"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.required_skills.length > 3 && (
                      <span className="text-[11px] text-[#5A6779] self-center">
                        +{job.required_skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Transparent Salary in XAF and Details CTA */}
                <div className="mt-5 pt-4 border-t border-[#E2E7EE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#5A6779] block">
                      Monthly compensation
                    </span>
                    <span className="text-xs font-bold text-[#0B1C2F] tnum truncate block">
                      {job.salary_min_xaf.toLocaleString()} – {job.salary_max_xaf.toLocaleString()} XAF
                    </span>
                  </div>

                  <Link
                    href={`/jobs?highlight=${job.id}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#0B7F7A] hover:text-[#14A89E] group/link min-h-[40px] px-3 py-1.5 rounded-lg bg-[#E6F5F3]/70 hover:bg-[#E6F5F3] transition-colors shrink-0"
                  >
                    <span>View role</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0B1C2F] text-white text-xs font-bold hover:bg-[#1D2430] transition-colors shadow-sm"
          >
            <span>Explore all open positions across Cameroon</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
