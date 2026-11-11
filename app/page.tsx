'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { CommandMenu } from '@/components/layout/command-menu';
import { ContourBackground } from '@/components/ui/contour-background';
import { MatchRing } from '@/components/ui/match-ring';
import { AICareerShowcase } from '@/components/landing/ai-career-showcase';
import { FeaturedJobs } from '@/components/landing/featured-jobs';
import { TrustSection } from '@/components/landing/trust-section';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import {
  Search,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Coins,
  Globe2,
  CheckCircle2,
  TrendingUp,
  Building2,
  Briefcase,
  Users,
  Compass,
  FileCheck2,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('Douala');
  const [howItWorksTab, setHowItWorksTab] = useState<'talent' | 'employers'>('talent');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/jobs?query=${encodeURIComponent(searchTitle)}&city=${encodeURIComponent(searchLocation)}`
    );
  };

  const handleQuickKeyword = (keyword: string) => {
    setSearchTitle(keyword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] selection:bg-[#0B7F7A]/20 selection:text-[#0B7F7A] relative">
      <PublicHeader />

      <main className="flex-1">
        {/* ================================================================= */}
        {/* 1. HERO SECTION (PDF Page 7 & Motion System Page 5) */}
        {/* ================================================================= */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
          {/* Topographic Contour Background with ambient glow */}
          <ContourBackground variant="hero" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Promise & Search */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 space-y-6"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#0B7F7A] tracking-wider uppercase mb-1">
                  <span>Cameroon &amp; Remote</span>
                  <span aria-hidden="true" className="text-[#A0AEC0]">·</span>
                  <span className="text-[#3D4A5C]">Explainable Career Intelligence</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B1C2F] font-display tracking-tight leading-[1.08] text-balance break-words">
                  Find work that fits. <br />
                  <span className="text-[#0B7F7A]">Hire people who thrive.</span>
                </h1>

                <p className="text-base sm:text-lg text-[#3D4A5C] max-w-xl leading-relaxed text-balance">
                  WorkDey connects ambitious talent and verified employers across Cameroon and beyond, with matches that explain their reasoning and a coach that builds long-term careers.
                </p>

                {/* Search Bar (Strict >= 44px touch targets on mobile) */}
                <form
                  onSubmit={handleSearch}
                  className="bg-white p-2.5 rounded-2xl shadow-md border border-[#E2E7EE] grid grid-cols-1 sm:grid-cols-12 gap-2 max-w-2xl"
                >
                  <div className="sm:col-span-5 min-h-[44px] flex items-center px-3 py-2 bg-[#F4F6F9] rounded-xl border border-transparent focus-within:border-[#0B7F7A] focus-within:ring-2 focus-within:ring-[#0B7F7A]/20">
                    <Search className="w-4 h-4 text-[#5A6779] mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                      placeholder="Job title or skill (e.g. Data analyst)"
                      className="w-full text-xs sm:text-sm bg-transparent outline-none text-[#0B1C2F] placeholder-[#5A6779]"
                    />
                  </div>

                  <div className="sm:col-span-4 min-h-[44px] flex items-center px-3 py-2 bg-[#F4F6F9] rounded-xl border border-transparent focus-within:border-[#0B7F7A] focus-within:ring-2 focus-within:ring-[#0B7F7A]/20">
                    <MapPin className="w-4 h-4 text-[#5A6779] mr-2 flex-shrink-0" />
                    <select
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      aria-label="Filter jobs by location"
                      className="w-full text-xs sm:text-sm bg-transparent outline-none text-[#0B1C2F] cursor-pointer"
                    >
                      <option value="Douala">Douala (Littoral)</option>
                      <option value="Yaoundé">Yaoundé (Centre)</option>
                      <option value="Buea">Buea &amp; Limbe (South-West)</option>
                      <option value="Bamenda">Bamenda (North-West)</option>
                      <option value="Bafoussam">Bafoussam (West)</option>
                      <option value="Kribi">Kribi (South)</option>
                      <option value="Remote">Remote Worldwide</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#0B7F7A] text-white text-xs sm:text-sm font-semibold hover:bg-[#14A89E] shadow-sm transition-all duration-150 flex items-center justify-center gap-1.5 group cursor-pointer active:translate-y-0.5"
                    >
                      <span>Search jobs</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </form>

                {/* Popular Search Buttons (Clean interactive controls, no pills) */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#5A6779]">Popular searches:</span>
                  {['Data Analyst', 'React', 'Logistics', 'Customer Success', 'Sales Lead'].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleQuickKeyword(tag)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E7EE] text-[#3D4A5C] hover:border-[#0B7F7A] hover:text-[#0B7F7A] transition-colors"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>

                {/* Sub-search links & Microcopy */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6779] pt-1">
                  <Link
                    href="/employer/jobs/create"
                    className="font-semibold text-[#2552C2] hover:underline flex items-center gap-1"
                  >
                    I&apos;m hiring, post a role →
                  </Link>
                  <span aria-hidden="true">·</span>
                  <span>Free for talents · Takes about 3 minutes</span>
                </div>
              </motion.div>

              {/* Right Column: Floating Multi-Card Arrangement (Exact Image 2 Asymmetric Offsets) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 relative flex flex-col justify-center py-4"
              >
                <div className="relative space-y-4">
                  {/* 1. Top Card: Shifted to the left, hanging over the dashed line */}
                  <div className="w-[88%] sm:w-[86%] mr-auto -translate-x-2 sm:-translate-x-4 bg-white rounded-2xl p-4 sm:p-4.5 shadow-[0_14px_34px_-8px_rgba(11,28,47,0.10)] border border-[#E2E7EE]/80 flex items-center justify-between gap-3 relative z-20">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#E6F5F3] text-[#0B7F7A] flex items-center justify-center font-black text-xs shrink-0 tracking-tight">
                        SA
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-[#0B1C2F] leading-tight truncate">
                          Senior Data Analyst
                        </h3>
                        <p className="text-[11px] text-[#5A6779] mt-0.5 truncate">
                          Savanna Agritech · Douala · Hybrid
                        </p>
                        <p className="text-xs font-bold text-[#0B1C2F] mt-1 tnum truncate">
                          650,000 – 900,000 XAF <span className="font-normal text-[#5A6779]">/ month</span>
                        </p>
                      </div>
                    </div>

                    {/* Circular Score Badge 92 */}
                    <div className="shrink-0">
                      <MatchRing score={92} size="md" showLabel={false} />
                    </div>
                  </div>

                  {/* 2. Middle Card (WHY 92): Shifted to the right, extending outward */}
                  <div className="w-[92%] sm:w-[90%] ml-auto translate-x-2 sm:translate-x-4 bg-white rounded-2xl p-4 sm:p-5 shadow-[0_12px_30px_-6px_rgba(11,28,47,0.08)] border border-[#E2E7EE]/80 space-y-2.5 relative z-10">
                    <p className="text-[10px] font-bold text-[#5A6779] uppercase tracking-wider">
                      WHY 92
                    </p>
                    <div className="space-y-2 pt-0.5">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="w-20 text-[#5A6779] text-[11px] font-medium shrink-0">Skills</span>
                        <div className="flex-1 h-1.5 rounded-full bg-[#E2E7EE] overflow-hidden">
                          <div className="h-full bg-[#0B7F7A] rounded-full w-[88%]" />
                        </div>
                        <span className="w-7 text-right font-bold text-[#0B1C2F] text-[11px] tnum shrink-0">88</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="w-20 text-[#5A6779] text-[11px] font-medium shrink-0">Experience</span>
                        <div className="flex-1 h-1.5 rounded-full bg-[#E2E7EE] overflow-hidden">
                          <div className="h-full bg-[#0B7F7A] rounded-full w-[74%]" />
                        </div>
                        <span className="w-7 text-right font-bold text-[#0B1C2F] text-[11px] tnum shrink-0">74</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="w-20 text-[#5A6779] text-[11px] font-medium shrink-0">Location</span>
                        <div className="flex-1 h-1.5 rounded-full bg-[#E2E7EE] overflow-hidden">
                          <div className="h-full bg-[#0B7F7A] rounded-full w-[100%]" />
                        </div>
                        <span className="w-7 text-right font-bold text-[#0B1C2F] text-[11px] tnum shrink-0">100</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Bottom Row: Asymmetric split with Application on left & Coach on right */}
                  <div className="flex items-stretch gap-3 w-[95%] sm:w-[94%] ml-0 sm:ml-1 relative z-10">
                    {/* Left: Application Progress Stepper */}
                    <div className="w-[44%] sm:w-[42%] bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0_10px_28px_-6px_rgba(11,28,47,0.07)] border border-[#E2E7EE]/80 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#0B1C2F] block">
                          Application
                        </span>
                        {/* 4-Node Timeline Stepper */}
                        <div className="flex items-center w-full my-3 px-0.5">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#0B7F7A] shrink-0" />
                          <div className="h-0.5 flex-1 bg-[#0B7F7A]" />
                          <div className="w-3.5 h-3.5 rounded-full bg-[#0B7F7A] shrink-0" />
                          <div className="h-0.5 flex-1 bg-[#0B7F7A]" />
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#0B7F7A] bg-white shrink-0" />
                          <div className="h-0.5 flex-1 bg-[#E2E7EE]" />
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#CBD5E1] bg-white shrink-0" />
                        </div>
                      </div>
                      <span className="text-[10px] text-[#5A6779] font-medium block truncate">
                        Interview · Tue 10:00
                      </span>
                    </div>

                    {/* Right: Solid Dark Coach Card */}
                    <div className="w-[56%] sm:w-[58%] bg-[#0B1C2F] rounded-2xl p-3.5 sm:p-4 shadow-[0_12px_32px_-8px_rgba(11,28,47,0.25)] border border-[#162436] flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#14A89E] tracking-wider block">
                        COACH
                      </span>
                      <p className="text-xs text-[#E7ECF3] leading-snug mt-2 font-medium">
                        Add one dashboard project to strengthen six matches.
                      </p>
                    </div>
                  </div>

                  {/* Caption below cards, right-aligned like in screenshot */}
                  <div className="flex justify-end pr-2 pt-1">
                    <p className="text-[11px] text-[#5A6779]/80 font-normal">
                      Illustrative preview with sample data
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. FOUR FOUNDATIONAL PILLARS (PDF Page 7) */}
        {/* ================================================================= */}
        <section className="py-16 bg-white border-y border-[#E2E7EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E7EE] space-y-3 flex flex-col justify-between hover:border-[#0B7F7A]/30 transition-colors">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F5F3] text-[#0B7F7A] flex items-center justify-center font-bold text-sm">
                    01
                  </div>
                  <h3 className="text-sm font-bold text-[#0B1C2F]">
                    Matches that explain themselves
                  </h3>
                  <p className="text-xs text-[#5A6779] leading-relaxed">
                    Skills, experience, and location itemised with plain-language reasons and transparent weights. No black-box filtering.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-[#0B7F7A]">Explainable scoring &rarr;</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E7EE] space-y-3 flex flex-col justify-between hover:border-[#2552C2]/30 transition-colors shadow-sm">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF0FC] text-[#2552C2] flex items-center justify-center font-bold text-sm">
                    02
                  </div>
                  <h3 className="text-sm font-bold text-[#0B1C2F]">
                    100% Verified employers
                  </h3>
                  <p className="text-xs text-[#5A6779] leading-relaxed">
                    Commercial registry (RCCM) and legal accreditation vetted by human administrators before any job goes live.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-[#2552C2]">Zero phantom listings &rarr;</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E7EE] space-y-3 flex flex-col justify-between hover:border-[#0B7F7A]/30 transition-colors">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F5F3] text-[#0B7F7A] flex items-center justify-center font-bold text-sm">
                    03
                  </div>
                  <h3 className="text-sm font-bold text-[#0B1C2F]">
                    Pay shown up front in XAF
                  </h3>
                  <p className="text-xs text-[#5A6779] leading-relaxed">
                    Monthly ranges in Central African CFA Francs. Mandatory disclosure protects candidates and filters genuine roles.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-[#0B7F7A]">Market salary transparency &rarr;</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E7EE] space-y-3 flex flex-col justify-between hover:border-[#2552C2]/30 transition-colors shadow-sm">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF0FC] text-[#2552C2] flex items-center justify-center font-bold text-sm">
                    04
                  </div>
                  <h3 className="text-sm font-bold text-[#0B1C2F]">
                    Bilingual English &amp; French
                  </h3>
                  <p className="text-xs text-[#5A6779] leading-relaxed">
                    Full parity across both official languages for local hubs in Douala, Yaoundé, Buea and international remote teams.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-[#2552C2]">National &amp; global reach &rarr;</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. FEATURED JOBS FROM VERIFIED ORGANIZATIONS */}
        {/* ================================================================= */}
        <FeaturedJobs />

        {/* ================================================================= */}
        {/* 4. AI CAREER ASSISTANCE INTERACTIVE SHOWCASE */}
        {/* ================================================================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AICareerShowcase />
        </section>

        {/* ================================================================= */}
        {/* 5. HOW IT WORKS IN THREE CLEAR STEPS (PDF Page 7) */}
        {/* ================================================================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E2E7EE]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-bold text-[#0B7F7A] uppercase tracking-wider mb-1">
                Structured Workflow
              </p>
              <h2 className="text-3xl font-extrabold text-[#0B1C2F] font-display tracking-tight">
                From profile to offer, in three clear steps
              </h2>
            </div>

            {/* Talent vs Employer toggle */}
            <div className="flex rounded-lg border border-[#E2E7EE] p-1 bg-white shadow-sm">
              <button
                onClick={() => setHowItWorksTab('talent')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  howItWorksTab === 'talent'
                    ? 'bg-[#0B7F7A] text-white shadow-sm'
                    : 'text-[#5A6779] hover:text-[#0B1C2F]'
                }`}
              >
                For Talent
              </button>
              <button
                onClick={() => setHowItWorksTab('employers')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  howItWorksTab === 'employers'
                    ? 'bg-[#2552C2] text-white shadow-sm'
                    : 'text-[#5A6779] hover:text-[#0B1C2F]'
                }`}
              >
                For Employers
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4 hover:border-[#0B7F7A]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#0B7F7A] uppercase tracking-wider">
                  Step 1
                </span>
                <span className="text-xl font-extrabold text-[#0B1C2F] font-display">82%</span>
              </div>
              <h3 className="text-base font-bold text-[#0B1C2F]">
                {howItWorksTab === 'talent' ? 'Build a profile that works' : 'Post a structured role'}
              </h3>
              <p className="text-xs text-[#5A6779] leading-relaxed">
                {howItWorksTab === 'talent'
                  ? 'Add skills, experience and work preferences. Upload an existing CV and let our structured parser extract your strongest credentials.'
                  : 'Specify transparent salary in XAF, required skills, and work style. Draft job descriptions with AI assistance in minutes.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4 hover:border-[#0B7F7A]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#0B7F7A] uppercase tracking-wider">
                  Step 2
                </span>
                <Sparkles className="w-4 h-4 text-[#0B7F7A]" />
              </div>
              <h3 className="text-base font-bold text-[#0B1C2F]">
                {howItWorksTab === 'talent' ? 'See why each role matches' : 'Review ranked candidates'}
              </h3>
              <p className="text-xs text-[#5A6779] leading-relaxed">
                {howItWorksTab === 'talent'
                  ? 'Every score comes with its reasons and gaps, so you know exactly where you stand and what to highlight in interviews.'
                  : 'Applicants are ranked by explainable match scores without automatic rejections. Humans always make the final decision.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4 hover:border-[#0B7F7A]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#0B7F7A] uppercase tracking-wider">
                  Step 3
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#1A7F4B]" />
              </div>
              <h3 className="text-base font-bold text-[#0B1C2F]">
                {howItWorksTab === 'talent' ? 'Apply, track and grow' : 'Collaborate &amp; hire'}
              </h3>
              <p className="text-xs text-[#5A6779] leading-relaxed">
                {howItWorksTab === 'talent'
                  ? 'Follow every application stage, practice with the career coach, and keep advancing your personalized 12-month career roadmap.'
                  : 'Manage stages via Kanban pipeline, share team candidate scorecards, schedule interviews, and track analytics.'}
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 6. DUAL WORKSPACES SECTION (PDF Page 8) */}
        {/* ================================================================= */}
        <section className="py-20 bg-white border-t border-[#E2E7EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl font-extrabold text-[#0B1C2F] font-display tracking-tight">
                Two dedicated workspaces. One unified platform.
              </h2>
              <p className="text-xs sm:text-sm text-[#5A6779] mt-2 leading-relaxed">
                Talents and employers get dedicated portals tailored to their daily objectives, sharing the same consistent design language and data models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: For Talent */}
              <div className="p-8 rounded-2xl bg-[#F4F6F9] border border-[#E2E7EE] space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#0B7F7A] uppercase tracking-wider px-2 py-0.5 rounded bg-[#E6F5F3]">
                      Talent Workspace
                    </span>
                    <span className="text-xs text-[#5A6779] font-medium">Teal Accent</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B1C2F] font-display">
                    A profile that keeps working while you do
                  </h3>
                  <p className="text-xs text-[#5A6779] leading-relaxed">
                    Designed for professionals, job seekers, and freelancers to navigate opportunities across Douala, Yaoundé, Buea, Limbe, and beyond.
                  </p>

                  <ul className="space-y-3 text-xs text-[#3D4A5C] pt-2">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0B7F7A] flex-shrink-0" />
                      <span>Personalised matches with itemized reason scores</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0B7F7A] flex-shrink-0" />
                      <span>Transparent application stage tracker from applied to offer</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0B7F7A] flex-shrink-0" />
                      <span>Interactive AI coach providing mock interview practice &amp; skill advice</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0B7F7A] flex-shrink-0" />
                      <span>12-month career progression roadmap with actionable milestones</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-[#E2E7EE] flex items-center justify-between">
                  <Link
                    href="/auth/sign-up"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] transition-all shadow-sm group"
                  >
                    <span>Create talent profile</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/talent/dashboard"
                    className="text-xs font-semibold text-[#0B7F7A] hover:underline"
                  >
                    Preview workspace →
                  </Link>
                </div>
              </div>

              {/* Card 2: For Employers */}
              <div className="p-8 rounded-2xl bg-[#F4F6F9] border border-[#E2E7EE] space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#2552C2] uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF0FC]">
                      Employer Workspace
                    </span>
                    <span className="text-xs text-[#5A6779] font-medium">Blue Accent</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B1C2F] font-display">
                    A collaborative pipeline, not a pile of CVs
                  </h3>
                  <p className="text-xs text-[#5A6779] leading-relaxed">
                    Designed for HR managers, founders, and hiring teams to publish verified roles and recruit top African talent with confidence.
                  </p>

                  <ul className="space-y-3 text-xs text-[#3D4A5C] pt-2">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2552C2] flex-shrink-0" />
                      <span>Publish roles in minutes with structured requirements &amp; XAF pay</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2552C2] flex-shrink-0" />
                      <span>AI candidate ranking with plain-text match explanations</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2552C2] flex-shrink-0" />
                      <span>Kanban candidate pipeline with team notes and scorecard ratings</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2552C2] flex-shrink-0" />
                      <span>Hiring velocity analytics revealing pipeline bottlenecks</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-[#E2E7EE] flex items-center justify-between">
                  <Link
                    href="/auth/sign-up"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F] transition-all shadow-sm group"
                  >
                    <span>Start hiring talent</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/employer/dashboard"
                    className="text-xs font-semibold text-[#2552C2] hover:underline"
                  >
                    Preview workspace →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 7. TRUST & GOVERNANCE SECTION */}
        {/* ================================================================= */}
        <TrustSection />

        {/* ================================================================= */}
        {/* 8. CITIES OF CAMEROON EXPLORATION GRID (PDF Page 8) */}
        {/* ================================================================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F5F3] text-[#0B7F7A] mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>National &amp; Global Coverage</span>
            </div>
            <h2 className="text-3xl font-black text-[#0B1C2F] font-display">
              Rooted in Cameroon. Open to the world.
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6779] mt-2 max-w-lg mx-auto">
              Browse roles by city, region, or work style. All salaries show in XAF, with support for cross-border and remote contracts.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto pt-4">
            {[
              { name: 'Douala', region: 'Littoral' },
              { name: 'Yaoundé', region: 'Centre' },
              { name: 'Buea', region: 'South-West' },
              { name: 'Limbe', region: 'South-West' },
              { name: 'Bamenda', region: 'North-West' },
              { name: 'Bafoussam', region: 'West' },
              { name: 'Garoua', region: 'North' },
              { name: 'Kribi', region: 'South' },
            ].map((city) => (
              <Link
                key={city.name}
                href={`/jobs?city=${city.name}`}
                className="px-4 py-2 bg-white border border-[#E2E7EE] rounded-lg text-xs font-semibold text-[#0B1C2F] hover:border-[#0B7F7A] hover:bg-[#E6F5F3] transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>{city.name}</span>
                <span className="text-[10px] text-[#5A6779]">({city.region})</span>
              </Link>
            ))}
            <Link
              href="/jobs?style=remote"
              className="px-4 py-2 bg-[#0B1C2F] text-white rounded-lg text-xs font-semibold hover:bg-[#3D4A5C] transition-colors shadow-sm"
            >
              Remote Worldwide
            </Link>
            <Link
              href="/jobs?style=hybrid"
              className="px-4 py-2 bg-white border border-[#E2E7EE] rounded-lg text-xs font-semibold text-[#0B1C2F] hover:border-[#0B7F7A] transition-colors shadow-sm"
            >
              Hybrid
            </Link>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 9. FREQUENTLY ASKED QUESTIONS */}
        {/* ================================================================= */}
        <section className="py-20 bg-white border-t border-[#E2E7EE]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#0B7F7A] uppercase tracking-wider block mb-1">
                Transparency First
              </span>
              <h2 className="text-3xl font-black text-[#0B1C2F] font-display tracking-tight">
                Frequently asked questions
              </h2>
              <p className="text-xs sm:text-sm text-[#5A6779] mt-2">
                Everything you need to know about WorkDey&apos;s matching algorithms, verified employers, and candidate security.
              </p>
            </div>

            <FAQAccordion />
          </div>
        </section>

        {/* ================================================================= */}
        {/* 10. CALL TO ACTION BANNER (PDF Page 8) */}
        {/* ================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-[#0B7F7A] rounded-2xl p-8 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
            {/* Subtle background W watermark */}
            <div className="absolute right-0 top-0 bottom-0 text-[16rem] font-black text-white/5 pointer-events-none select-none flex items-center leading-none">
              W
            </div>

            <div className="relative z-10 space-y-3 max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-black font-display leading-tight">
                Start with a profile or a job post today.
              </h2>
              <p className="text-xs sm:text-sm text-[#E6F5F3] leading-relaxed">
                Joining takes 3 minutes. Talents receive explainable job matches and coaching. Employers gain access to vetted, motivated candidates.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Link
                href="/auth/sign-up"
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-white text-[#0B7F7A] text-xs font-bold hover:bg-[#E6F5F3] transition-colors text-center shadow-lg"
              >
                I&apos;m looking for work →
              </Link>
              <Link
                href="/employer/jobs/create"
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#0B1C2F] text-white text-xs font-bold hover:bg-[#1D2430] transition-colors text-center shadow-md border border-white/20"
              >
                Post a job opening
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
      <CommandMenu />
    </div>
  );
}
