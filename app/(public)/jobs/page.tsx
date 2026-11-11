'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Search,
  MapPin,
  Bookmark,
  Share2,
  ShieldCheck,
  Check,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
  Briefcase,
  Coins,
} from 'lucide-react';
import { SEED_JOBS } from '@/lib/data/seed-data';
import { JobListing } from '@/lib/types/database';

export default function PublicJobsPage() {
  const { isAuthenticated } = useAuth();

  const [selectedJob, setSelectedJob] = useState<JobListing>(SEED_JOBS[0]);
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  const filteredJobs = SEED_JOBS.filter((job) => {
    if (filterStyle !== 'all' && job.work_style !== filterStyle) return false;
    if (filterCity !== 'all' && job.city.toLowerCase() !== filterCity.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchSkill = job.required_skills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchSkill) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Search Bar & Filter Bar (PDF Page 10) */}
      <div className="bg-white p-4 rounded-[10px] border border-[#E2E7EE] shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 flex items-center px-3 py-2 bg-[#F4F6F9] rounded-lg border border-transparent focus-within:border-[#0B7F7A] focus-within:ring-2 focus-within:ring-[#0B7F7A]/20">
            <Search className="w-4 h-4 text-[#5A6779] mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Job title, skill or company"
              className="w-full text-xs bg-transparent outline-none text-[#0B1C2F] placeholder-[#5A6779]"
            />
          </div>

          <div className="sm:col-span-4 flex items-center px-3 py-2 bg-[#F4F6F9] rounded-lg border border-transparent focus-within:border-[#0B7F7A] focus-within:ring-2 focus-within:ring-[#0B7F7A]/20">
            <MapPin className="w-4 h-4 text-[#5A6779] mr-2" />
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              aria-label="Filter roles by city"
              className="w-full text-xs bg-transparent outline-none text-[#0B1C2F] cursor-pointer"
            >
              <option value="all">All Locations (Cameroon & Remote)</option>
              <option value="Douala">Douala, Littoral</option>
              <option value="Yaoundé">Yaoundé, Centre</option>
              <option value="Buea">Buea, South-West</option>
              <option value="Kribi">Kribi, South</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button className="w-full h-full min-h-[38px] py-2 px-4 rounded-lg bg-[#0B7F7A] text-white text-xs font-semibold hover:bg-[#14A89E] active:translate-y-px transition-all flex items-center justify-center gap-1 shadow-xs">
              Filter roles
            </button>
          </div>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2E7EE] text-xs">
          <div className="inline-flex p-0.5 bg-[#F4F6F9] rounded-lg border border-[#E2E7EE]">
            {['all', 'hybrid', 'remote', 'onsite'].map((style) => (
              <button
                key={style}
                onClick={() => setFilterStyle(style)}
                className={`px-3 py-1.5 rounded-md capitalize font-semibold transition-all ${
                  filterStyle === style
                    ? 'bg-white text-[#0B1C2F] shadow-xs'
                    : 'text-[#5A6779] hover:text-[#0B1C2F]'
                }`}
              >
                {style === 'all' ? 'All Styles' : style}
              </button>
            ))}
          </div>
          <span className="text-[#E2E7EE] mx-1">·</span>
          <span className="text-[11px] font-bold text-[#5A6779] uppercase tracking-wider">Popular:</span>
          {['Douala', 'Yaoundé', 'Buea', 'Remote'].map((city) => (
            <button
              key={city}
              onClick={() => setFilterCity(city === 'Remote' ? 'all' : city)}
              className="text-xs text-[#0B1C2F] hover:text-[#0B7F7A] underline decoration-[#E2E7EE] underline-offset-2 font-medium"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Two-Column Split Layout (PDF Page 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Job Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#5A6779] px-1">
            <span className="font-bold text-[#0B1C2F]">
              Roles in Douala and beyond
            </span>
            <span>{filteredJobs.length} sample roles · Sorted by most recent</span>
          </div>

          {filteredJobs.map((job) => {
            const isSelected = selectedJob.id === job.id;
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-4 rounded-[10px] border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0B7F7A] bg-white shadow-md ring-1 ring-[#0B7F7A]/25'
                    : 'border-[#E2E7EE] bg-white hover:border-[#0B7F7A]/60 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0B1C2F] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {job.title.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0B1C2F] leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-xs text-[#5A6779] mt-0.5">
                        Savanna Agritech · {job.city}, {job.region}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#5A6779] flex-shrink-0">2 days ago</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-[#F4F6F9] text-[#5A6779] font-medium capitalize">
                    {job.work_style}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#F4F6F9] text-[#5A6779] font-medium capitalize">
                    {job.contract_type.replace('_', '-')}
                  </span>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-[#E2E7EE] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0B1C2F] tnum">
                    {job.salary_min_xaf.toLocaleString()} – {job.salary_max_xaf.toLocaleString()} XAF
                  </span>
                  <span className="text-[11px] font-semibold text-[#0B7F7A] bg-[#E6F5F3] px-2 py-0.5 rounded-full">
                    92% Match
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Sticky Job Detail (PDF Page 10) */}
        <div className="lg:col-span-7 sticky top-24 bg-white rounded-[10px] border border-[#E2E7EE] p-6 shadow-sm space-y-6">
          {/* Header & Primary Actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-[#2552C2] text-white flex items-center justify-center font-black text-base flex-shrink-0">
                SA
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0B1C2F] font-display">
                  {selectedJob.title}
                </h2>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-[#5A6779]">
                  <span>Savanna Agritech</span>
                  <span>·</span>
                  <span>{selectedJob.city}, {selectedJob.region}</span>
                  <span className="inline-flex items-center gap-1 text-[#1A7F4B] font-semibold bg-[#E6F5F3] px-2.5 py-0.5 rounded-full text-[10px]">
                    <ShieldCheck className="w-3 h-3" />
                    Verified employer
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSaved ? 'bg-[#E6F5F3] border-[#0B7F7A] text-[#0B7F7A]' : 'border-[#E2E7EE] hover:bg-[#F4F6F9] text-[#5A6779]'
                }`}
                title="Save job"
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Apply CTA Bar */}
          <div className="p-4 rounded-[10px] bg-[#F4F6F9] border border-[#E2E7EE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {appliedSuccess ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A7F4B]">
                  <Check className="w-4 h-4" /> Application sent to Savanna Agritech
                </div>
              ) : (
                <div className="text-xs text-[#5A6779]">
                  {isAuthenticated ? 'Ready to apply with your WorkDey profile?' : 'Free to apply. Your CV stays private until you apply.'}
                </div>
              )}
            </div>

            {!appliedSuccess ? (
              <button
                onClick={() => setAppliedSuccess(true)}
                className="px-5 py-2.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] active:translate-y-px transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                {isAuthenticated ? 'Apply now' : 'Sign in to apply'}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setAppliedSuccess(false)}
                className="text-xs font-semibold text-[#5A6779] underline"
              >
                Undo application
              </button>
            )}
          </div>

          {/* AI Match Explanation Callout (PDF Page 6: Lit dark card) */}
          <div className="p-4 rounded-[10px] bg-[#0B1C2F] text-white space-y-2 border border-[#14A89E]/25 shadow-[0_8px_24px_-4px_rgba(11,28,47,0.28)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#14A89E] tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 92% Match Score
              </span>
              <span className="text-[10px] text-[#A0AEC0]">Evidence-based Advisory</span>
            </div>
            <p className="text-xs text-[#E7ECF3] leading-relaxed">
              Why this fits: SQL, Power BI and forecasting line up directly with this role. Located in {selectedJob.city}.
            </p>
          </div>

          {/* 4 Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#F4F6F9] rounded-lg border border-[#E2E7EE]/60">
              <span className="text-[10px] uppercase font-bold text-[#5A6779] block">Salary</span>
              <span className="font-bold text-[#0B1C2F] tnum mt-0.5 block">
                {selectedJob.salary_min_xaf.toLocaleString()} – {selectedJob.salary_max_xaf.toLocaleString()} XAF
              </span>
            </div>
            <div className="p-3 bg-[#F4F6F9] rounded-lg border border-[#E2E7EE]/60">
              <span className="text-[10px] uppercase font-bold text-[#5A6779] block">Work Style</span>
              <span className="font-bold text-[#0B1C2F] mt-0.5 block capitalize">
                {selectedJob.work_style} · 3d on-site
              </span>
            </div>
            <div className="p-3 bg-[#F4F6F9] rounded-lg border border-[#E2E7EE]/60">
              <span className="text-[10px] uppercase font-bold text-[#5A6779] block">Experience</span>
              <span className="font-bold text-[#0B1C2F] mt-0.5 block">
                {selectedJob.experience_level}
              </span>
            </div>
            <div className="p-3 bg-[#F4F6F9] rounded-lg border border-[#E2E7EE]/60">
              <span className="text-[10px] uppercase font-bold text-[#5A6779] block">Apply By</span>
              <span className="font-bold text-[#0B1C2F] mt-0.5 block">
                30 Nov 2026
              </span>
            </div>
          </div>

          {/* About the role & Responsibilities */}
          <div className="space-y-4 text-xs text-[#3D4A5C] leading-relaxed pt-2 border-t border-[#E2E7EE]">
            <div>
              <h4 className="font-bold text-sm text-[#0B1C2F] mb-1">About the role</h4>
              <p>{selectedJob.description}</p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#0B1C2F] mb-1.5">What you&apos;ll do</h4>
              <ul className="list-disc pl-4 space-y-1 text-[#3D4A5C]">
                <li>Build and maintain dashboards for regional operations in Douala and Yaoundé</li>
                <li>Model yield and demand forecasts with the agronomy team</li>
                <li>Present monthly findings to leadership in English and French</li>
                <li>Mentor junior analysts on SQL optimization and report automation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#0B1C2F] mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.required_skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-[#F4F6F9] border border-[#E2E7EE] text-[#0B1C2F] font-semibold text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
