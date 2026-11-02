'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, MapPin, Globe, Users, Briefcase, Building, Check, ArrowRight } from 'lucide-react';
import { SEED_ORGANIZATIONS, SEED_JOBS } from '@/lib/data/seed-data';

export default function CompanyShowcasePage() {
  const params = useParams();
  const id = params?.id as string;

  const org = SEED_ORGANIZATIONS.find((o) => o.id === id) || SEED_ORGANIZATIONS[0];
  const orgJobs = SEED_JOBS.filter((j) => j.organization_id === org.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* 1. Header Banner & Identity (PDF Page 13) */}
      <div className="bg-white rounded-2xl border border-[#E2E7EE] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#2552C2] text-white flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-sm">
            {org.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C2F] font-display">
              {org.name}
            </h1>
            <p className="text-xs text-[#5A6779]">
              {org.sector} · {org.city}, {org.region} · {org.company_size}
            </p>
            {org.verification_status === 'verified' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F5F3] text-[#0B7F7A] border border-[#0B7F7A]/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified employer
              </span>
            )}
          </div>
        </div>

        <button className="px-4 py-2 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#0B1C2F] hover:bg-[#F4F6F9] transition-colors self-start sm:self-auto">
          Follow company
        </button>
      </div>

      {/* 2. Main Two-Column Layout (PDF Page 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: About us & Open Roles */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-[#0B1C2F] uppercase tracking-wider">
              About us
            </h2>
            <p className="text-sm text-[#3D4A5C] leading-relaxed">
              {org.about || 'We help growers and cooperatives plan, forecast and sell with better data. Our teams work across field operations, analytics and supply chain.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#0B1C2F]">
                Open roles · {orgJobs.length || 3}
              </h2>
              <span className="text-xs text-[#5A6779]">Monthly ranges in XAF</span>
            </div>

            <div className="space-y-3">
              {(orgJobs.length > 0 ? orgJobs : SEED_JOBS.slice(0, 3)).map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-5 rounded-xl border border-[#E2E7EE] shadow-sm hover:border-[#0B7F7A] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1C2F]">{job.title}</h3>
                    <p className="text-xs text-[#5A6779] mt-0.5">
                      {job.city} · {job.work_style} · {job.contract_type.replace('_', '-')}
                    </p>
                    <p className="text-xs font-bold text-[#0B1C2F] mt-1.5 tnum">
                      {job.salary_min_xaf.toLocaleString()} – {job.salary_max_xaf.toLocaleString()} XAF
                    </p>
                  </div>

                  <Link
                    href={`/jobs`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0B7F7A] hover:underline"
                  >
                    View role details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Company details card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-5 text-xs">
          <h3 className="font-bold text-[#0B1C2F] uppercase tracking-wider text-xs">
            Company details
          </h3>

          <div className="space-y-3 divide-y divide-[#E2E7EE]">
            <div className="flex justify-between pt-2">
              <span className="text-[#5A6779]">Type</span>
              <span className="font-semibold text-[#0B1C2F]">Private company</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#5A6779]">Sector</span>
              <span className="font-semibold text-[#0B1C2F]">{org.sector || 'Technology'}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#5A6779]">Headquarters</span>
              <span className="font-semibold text-[#0B1C2F]">{org.city}, {org.region}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#5A6779]">Company size</span>
              <span className="font-semibold text-[#0B1C2F]">{org.company_size || '50–200'}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#5A6779]">Website</span>
              <a href={org.website || '#'} className="font-semibold text-[#0B7F7A] hover:underline">
                {org.website?.replace('https://', '') || 'savanna.example'}
              </a>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#5A6779]">Languages</span>
              <span className="font-semibold text-[#0B1C2F]">English, French</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#5A6779]">Work styles</span>
              <span className="font-semibold text-[#0B1C2F]">Hybrid, on-site, remote</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#E6F5F3] rounded-lg border border-[#0B7F7A]/20 space-y-1">
            <span className="font-bold text-[#0B7F7A] flex items-center gap-1 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified employer
            </span>
            <p className="text-[11px] text-[#3D4A5C] leading-relaxed">
              WorkDey has reviewed this organisation&apos;s registration documents and verified business registry status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
