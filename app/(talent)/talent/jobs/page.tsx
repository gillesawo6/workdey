'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTalent } from '@/lib/talent/talent-context';
import { SEED_JOBS, SEED_ORGANIZATIONS } from '@/lib/data/seed-data';
import { MatchRing } from '@/components/ui/match-ring';
import { JobListing } from '@/lib/types/database';
import { JobMatchResult } from '@/lib/ai/types';
import {
  Search,
  MapPin,
  Bookmark,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Filter,
  X,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Briefcase,
  Share2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Send,
} from 'lucide-react';

const ORG_MAP = new Map(SEED_ORGANIZATIONS.map((org) => [org.id, org]));

export default function TalentJobsPage() {
  const {
    profile,
    savedJobIds,
    toggleSaveJob,
    isJobSaved,
    applications,
    createApplication,
    reportJob,
  } = useTalent();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterWorkStyle, setFilterWorkStyle] = useState('all');
  const [filterContract, setFilterContract] = useState('all');
  const [filterExperience, setFilterExperience] = useState('all');
  const [minSalary, setMinSalary] = useState(0);
  const [sortBy, setSortBy] = useState<'match' | 'newest' | 'salary'>('match');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Selected job for Details Drawer
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [deepMatchLoading, setDeepMatchLoading] = useState(false);
  const [deepMatchResult, setDeepMatchResult] = useState<JobMatchResult | null>(null);

  const handleRunDeepMatch = async (job: JobListing) => {
    setDeepMatchLoading(true);
    try {
      const res = await fetch('/api/ai/match-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: {
            id: job.id,
            title: job.title,
            company_name: orgMap.get(job.organization_id)?.name || 'Employer',
            city: job.city,
            work_style: job.work_style,
            contract_type: job.contract_type,
            min_salary_xaf: job.salary_min_xaf,
            max_salary_xaf: job.salary_max_xaf,
            required_skills: job.required_skills,
            description: job.description,
            experience_level: job.experience_level,
          },
          talent_profile: {
            id: profile.id,
            headline: profile.headline,
            bio: profile.bio,
            city: profile.city,
            country: 'Cameroon',
            skills: profile.skills_list.map((s) => ({
              name: s.skill_name,
              proficiency: s.verified_score ? `${s.verified_score}% verified` : 'intermediate',
              years_experience: s.years_experience,
            })),
            experiences: profile.experiences_list.map((e) => ({
              title: e.job_title,
              company: e.company_name,
              duration: `${e.start_date} - ${e.is_current ? 'Present' : e.end_date}`,
              description: e.description,
            })),
            educations: profile.educations_list.map((ed) => ({
              institution: ed.institution,
              degree: ed.degree,
              field: ed.field,
            })),
            certifications: profile.certifications_list.map((c) => ({
              name: c.name,
              issuer: c.issuer,
            })),
            preferred_work_styles: ['hybrid', 'remote'],
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setDeepMatchResult(data);
      }
    } catch {
      // handled
    } finally {
      setDeepMatchLoading(false);
    }
  };

  // Application modal
  const [applyingJob, setApplyingJob] = useState<JobListing | null>(null);
  const [screeningAnswer, setScreeningAnswer] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Report Modal
  const [reportingJob, setReportingJob] = useState<JobListing | null>(null);
  const [reportReason, setReportReason] = useState('fees_requested');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const orgMap = ORG_MAP;

  // Compute calculated match score for each job based on talent's skills & city
  const jobMatchScores = useMemo(() => {
    const scores: Record<string, { total: number; skills: number; exp: number; loc: number }> = {};
    const candidateSkillNames = profile.skills_list.map((s) => s.skill_name.toLowerCase());

    SEED_JOBS.forEach((job) => {
      // Skills score
      const matchingSkills = job.required_skills.filter((req) =>
        candidateSkillNames.some((cand) => cand.includes(req.toLowerCase()) || req.toLowerCase().includes(cand))
      );
      const skillsPct = Math.round((matchingSkills.length / Math.max(1, job.required_skills.length)) * 100);

      // Location score
      const locPct = job.work_style === 'remote' ? 100 : job.city.toLowerCase() === profile.city.toLowerCase() ? 100 : 70;

      // Experience score
      const expPct = 80;

      // Weighted total
      const total = Math.min(98, Math.max(55, Math.round(skillsPct * 0.5 + locPct * 0.3 + expPct * 0.2)));

      scores[job.id] = { total, skills: skillsPct, exp: expPct, loc: locPct };
    });

    return scores;
  }, [profile.city, profile.skills_list]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = SEED_JOBS.filter((job) => {
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesDesc = job.description.toLowerCase().includes(q);
        const matchesSkills = job.required_skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesSkills) return false;
      }

      // City filter
      if (filterCity !== 'all') {
        if (filterCity === 'Remote') {
          if (job.work_style !== 'remote') return false;
        } else if (job.city.toLowerCase() !== filterCity.toLowerCase()) {
          return false;
        }
      }

      // Work style
      if (filterWorkStyle !== 'all' && job.work_style !== filterWorkStyle) return false;

      // Contract
      if (filterContract !== 'all' && job.contract_type !== filterContract) return false;

      // Experience level
      if (filterExperience !== 'all' && !job.experience_level.toLowerCase().includes(filterExperience.toLowerCase())) {
        return false;
      }

      // Salary filter
      if (minSalary > 0 && job.salary_max_xaf < minSalary) return false;

      return true;
    });

    // Sorting
    if (sortBy === 'match') {
      result.sort((a, b) => (jobMatchScores[b.id]?.total || 0) - (jobMatchScores[a.id]?.total || 0));
    } else if (sortBy === 'salary') {
      result.sort((a, b) => b.salary_max_xaf - a.salary_max_xaf);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [searchQuery, filterCity, filterWorkStyle, filterContract, filterExperience, minSalary, sortBy, jobMatchScores]);

  // Paginated slice
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredJobs.slice(startIndex, startIndex + pageSize);
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / pageSize);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    createApplication(applyingJob.id, {
      cover_note: screeningAnswer,
    });

    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setApplyingJob(null);
      setScreeningAnswer('');
    }, 1500);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingJob) return;

    reportJob(reportingJob.id, reportReason, reportDetails);
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportingJob(null);
      setReportDetails('');
    }, 1500);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setFilterCity('all');
    setFilterWorkStyle('all');
    setFilterContract('all');
    setFilterExperience('all');
    setMinSalary(0);
    setSortBy('match');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#0B7F7A] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Matched to {profile.skills_list.length} skills in your profile
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#EAF5EF] text-[#1A7F4B] text-[10px] font-bold">
              Transparent XAF Pay
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C2F] font-display">
            Discover Verified Opportunities
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#5A6779]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] bg-white font-semibold text-[#0B1C2F] outline-none"
          >
            <option value="match">Best Match Score</option>
            <option value="newest">Recently Published</option>
            <option value="salary">Highest Salary (XAF)</option>
          </select>
        </div>
      </div>

      {/* 2. Search & Multi-Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E7EE] shadow-sm space-y-3">
        {/* Top search line */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 flex items-center px-3 py-2 bg-[#F4F6F9] rounded-lg border border-[#E2E7EE] focus-within:border-[#0B7F7A]">
            <Search className="w-4 h-4 text-[#5A6779] mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by job title, skill (e.g. Python, SQL), or keyword..."
              className="w-full text-xs bg-transparent outline-none text-[#0B1C2F] placeholder-[#5A6779]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="md:col-span-3">
            <select
              value={filterCity}
              onChange={(e) => {
                setFilterCity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 bg-[#F4F6F9] rounded-lg border border-[#E2E7EE] text-xs text-[#0B1C2F] outline-none"
            >
              <option value="all">All Locations (Douala, Yaoundé, etc.)</option>
              <option value="Douala">Douala (Littoral)</option>
              <option value="Yaoundé">Yaoundé (Centre)</option>
              <option value="Buea">Buea &amp; Limbe (South-West)</option>
              <option value="Bamenda">Bamenda (North-West)</option>
              <option value="Bafoussam">Bafoussam (West)</option>
              <option value="Kribi">Kribi (South)</option>
              <option value="Remote">Remote Worldwide</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={filterWorkStyle}
              onChange={(e) => {
                setFilterWorkStyle(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 bg-[#F4F6F9] rounded-lg border border-[#E2E7EE] text-xs text-[#0B1C2F] outline-none"
            >
              <option value="all">All Work Styles</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Fully Remote</option>
              <option value="onsite">On-Site</option>
            </select>
          </div>
        </div>

        {/* Secondary Filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F4F6F9] text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Experience */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#5A6779]">Experience:</span>
              <select
                value={filterExperience}
                onChange={(e) => {
                  setFilterExperience(e.target.value);
                  setCurrentPage(1);
                }}
                className="p-1 rounded bg-[#F4F6F9] border border-[#E2E7EE] text-[#0B1C2F]"
              >
                <option value="all">Any</option>
                <option value="2+">2+ years</option>
                <option value="3+">3+ years</option>
                <option value="4+">4+ years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>

            {/* Minimum Salary */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#5A6779]">Min Salary:</span>
              <select
                value={minSalary}
                onChange={(e) => {
                  setMinSalary(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1 rounded bg-[#F4F6F9] border border-[#E2E7EE] text-[#0B1C2F]"
              >
                <option value={0}>Any XAF</option>
                <option value={400000}>400,000+ XAF</option>
                <option value={600000}>600,000+ XAF</option>
                <option value={800000}>800,000+ XAF</option>
                <option value={1500000}>1,500,000+ XAF</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#5A6779]">
              Showing <strong className="text-[#0B1C2F]">{filteredJobs.length}</strong> matching roles
            </span>
            {(searchQuery || filterCity !== 'all' || filterWorkStyle !== 'all' || minSalary > 0) && (
              <button
                onClick={resetAllFilters}
                className="text-[#0B7F7A] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Jobs Grid */}
      {paginatedJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E7EE] p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F4F6F9] text-[#5A6779] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0B1C2F]">No roles matched your search criteria</h3>
          <p className="text-xs text-[#5A6779] max-w-md mx-auto">
            Try adjusting your keyword, expanding location to Remote, or lowering the minimum salary filter.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedJobs.map((job) => {
            const org = orgMap.get(job.organization_id);
            const scoreObj = jobMatchScores[job.id] || { total: 82, skills: 80, exp: 75, loc: 90 };
            const isSaved = isJobSaved(job.id);
            const application = applications.find((a) => a.job_id === job.id);

            return (
              <div
                key={job.id}
                className="bg-white rounded-[10px] border border-[#E2E7EE] p-5 shadow-sm hover:border-[#0B7F7A]/40 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F4F6F9] border border-[#E2E7EE] text-[#0B1C2F] flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-[#E6F5F3] group-hover:text-[#0B7F7A] transition-colors">
                        {org?.name ? org.name.substring(0, 2).toUpperCase() : 'WD'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[#5A6779]">
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

                    <div className="flex items-center gap-1.5">
                      <MatchRing score={scoreObj.total} size="sm" showLabel={false} />
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSaved
                            ? 'bg-[#E6F5F3] border-[#0B7F7A] text-[#0B7F7A]'
                            : 'border-[#E2E7EE] text-[#5A6779] hover:text-[#0B1C2F]'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save job'}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Meta details */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6779]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0B7F7A]" />
                      {job.city} ({job.work_style})
                    </span>
                    <span>·</span>
                    <span>{job.experience_level}</span>
                  </div>

                  {/* Description excerpt */}
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
                        +{job.required_skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Salary and Action */}
                <div className="pt-3 border-t border-[#E2E7EE] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5A6779] block">
                      Monthly range
                    </span>
                    <span className="text-xs font-bold text-[#0B1C2F] tnum">
                      {job.salary_min_xaf.toLocaleString()} – {job.salary_max_xaf.toLocaleString()} XAF
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] bg-white text-xs font-bold text-[#0B1C2F] hover:bg-[#F4F6F9] transition-colors"
                    >
                      Details
                    </button>

                    {application ? (
                      <span className="px-2.5 py-1.5 rounded-lg bg-[#EAF0FC] text-[#2552C2] text-xs font-bold">
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => setApplyingJob(job)}
                        className="px-3 py-1.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] transition-colors shadow-sm"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#E2E7EE] text-xs">
          <span className="text-[#5A6779]">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#E2E7EE] bg-white disabled:opacity-40 hover:bg-[#F4F6F9]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[#E2E7EE] bg-white disabled:opacity-40 hover:bg-[#F4F6F9]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* JOB DETAILS DRAWER / MODAL */}
      {/* =================================================================== */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E2E7EE]">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#5A6779]">
                    <span>{orgMap.get(selectedJob.organization_id)?.name || 'Verified Employer'}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1A7F4B]" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[#0B1C2F] font-display mt-1">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs text-[#5A6779] mt-0.5">
                    {selectedJob.city} ({selectedJob.work_style}) · {selectedJob.contract_type}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 text-[#5A6779] hover:text-[#0B1C2F] rounded-lg hover:bg-[#F4F6F9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Match Score decomposition & Deep AI Analysis */}
              <div className="p-4 rounded-xl bg-[#F4F6F9] border border-[#E2E7EE] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#0B7F7A] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Match Intelligence
                    </span>
                    <span className="text-sm font-bold text-[#0B1C2F]">
                      {deepMatchResult ? `Deep Evidence Score: ${deepMatchResult.match_score}%` : 'Why you match this role'}
                    </span>
                  </div>
                  <MatchRing score={deepMatchResult ? deepMatchResult.match_score : (jobMatchScores[selectedJob.id]?.total || 85)} size="md" />
                </div>

                {!deepMatchResult && (
                  <div className="space-y-2 text-xs pt-1">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#3D4A5C]">Skills fit</span>
                        <span className="font-bold text-[#0B1C2F] tnum">{jobMatchScores[selectedJob.id]?.skills || 85}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E2E7EE] overflow-hidden">
                        <div
                          className="h-full bg-[#0B7F7A] rounded-full"
                          style={{ width: `${jobMatchScores[selectedJob.id]?.skills || 85}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#3D4A5C]">Location match</span>
                        <span className="font-bold text-[#0B1C2F] tnum">{jobMatchScores[selectedJob.id]?.loc || 100}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E2E7EE] overflow-hidden">
                        <div
                          className="h-full bg-[#2552C2] rounded-full"
                          style={{ width: `${jobMatchScores[selectedJob.id]?.loc || 100}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleRunDeepMatch(selectedJob)}
                      disabled={deepMatchLoading}
                      className="w-full mt-2 py-2 rounded-lg bg-white hover:bg-[#E6F5F3] border border-[#0B7F7A]/30 text-[#0B7F7A] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${deepMatchLoading ? 'animate-spin' : ''}`} />
                      {deepMatchLoading ? 'Running Gemini Match Reasoner...' : 'Run Deep Evidence & Gap Analysis'}
                    </button>
                  </div>
                )}

                {deepMatchResult && (
                  <div className="space-y-3 pt-2 text-xs border-t border-[#E2E7EE]">
                    {/* Category scores */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-white border border-[#E2E7EE]">
                        <span className="text-[#5A6779] block">Skills Match</span>
                        <span className="font-bold text-[#0B7F7A] text-sm">{deepMatchResult.category_scores.skills}%</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-[#E2E7EE]">
                        <span className="text-[#5A6779] block">Experience Fit</span>
                        <span className="font-bold text-[#2552C2] text-sm">{deepMatchResult.category_scores.experience}%</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-[#E2E7EE]">
                        <span className="text-[#5A6779] block">Location Match</span>
                        <span className="font-bold text-[#1A7F4B] text-sm">{deepMatchResult.category_scores.location}%</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-[#E2E7EE]">
                        <span className="text-[#5A6779] block">Education Fit</span>
                        <span className="font-bold text-[#0B1C2F] text-sm">{deepMatchResult.category_scores.education}%</span>
                      </div>
                    </div>

                    {/* Matched skills */}
                    {deepMatchResult.matched_skills.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-bold text-[#1A7F4B] text-[11px] block">Verified Strengths:</span>
                        <div className="flex flex-wrap gap-1">
                          {deepMatchResult.matched_skills.map((m, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-[#EAF5EF] text-[#1A7F4B] font-bold border border-[#1A7F4B]/20">
                              ✓ {m.skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing skills */}
                    {deepMatchResult.missing_skills.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-bold text-[#B45309] text-[11px] block">Missing / Target Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {deepMatchResult.missing_skills.map((m, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-[#FEF3C7] text-[#B45309] font-bold border border-[#B45309]/20">
                              ! {m.skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Readiness Recommendations */}
                    {deepMatchResult.readiness_recommendations.length > 0 && (
                      <div className="p-2.5 rounded bg-white border border-[#E2E7EE] space-y-1 text-[11px]">
                        <span className="font-bold text-[#0B1C2F]">Readiness Tips:</span>
                        <ul className="list-disc pl-3 text-[#5A6779] space-y-0.5">
                          {deepMatchResult.readiness_recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-[10px] text-[#A0AEC0] italic pt-1">
                      {deepMatchResult.ethical_notice}
                    </div>
                  </div>
                )}
              </div>

              {/* Compensation */}
              <div className="p-4 rounded-xl bg-[#E6F5F3]/50 border border-[#0B7F7A]/20">
                <span className="text-[10px] uppercase font-bold text-[#0B7F7A] block">
                  Transparent Compensation
                </span>
                <p className="text-lg font-black text-[#0B1C2F] mt-0.5 tnum">
                  {selectedJob.salary_min_xaf.toLocaleString()} – {selectedJob.salary_max_xaf.toLocaleString()} XAF / month
                </p>
                <p className="text-[11px] text-[#5A6779] mt-0.5">
                  Published upfront in Central African CFA Francs.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-[#0B1C2F] uppercase tracking-wider text-[11px]">
                  Job Description
                </h3>
                <p className="text-[#3D4A5C] leading-relaxed whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>

              {/* Required Skills */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-[#0B1C2F] uppercase tracking-wider text-[11px]">
                  Required Skills &amp; Qualifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.required_skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded bg-[#F4F6F9] border border-[#E2E7EE] text-[#0B1C2F] font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#0B1C2F]">Languages:</span>{' '}
                <span className="text-[#3D4A5C]">{selectedJob.languages.join(', ')}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#E2E7EE] flex items-center justify-between gap-3">
              <button
                onClick={() => setReportingJob(selectedJob)}
                className="text-xs text-[#5A6779] hover:text-[#D14343] flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Report listing
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSaveJob(selectedJob.id)}
                  className="px-3.5 py-2 rounded-lg border border-[#E2E7EE] text-xs font-semibold hover:bg-[#F4F6F9]"
                >
                  {isJobSaved(selectedJob.id) ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setApplyingJob(selectedJob);
                  }}
                  className="px-5 py-2 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] shadow-sm cursor-pointer"
                >
                  Apply Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* APPLY MODAL */}
      {/* =================================================================== */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div>
                <span className="text-[10px] font-bold text-[#0B7F7A] uppercase tracking-wider block">
                  Submit Application
                </span>
                <h3 className="text-base font-bold text-[#0B1C2F]">
                  {applyingJob.title}
                </h3>
              </div>
              <button onClick={() => setApplyingJob(null)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {appliedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#EAF5EF] text-[#1A7F4B] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#0B1C2F]">Application Submitted!</h4>
                <p className="text-xs text-[#5A6779]">
                  Your CV and profile were submitted. Track status under Applications.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-[#F4F6F9] rounded-lg border border-[#E2E7EE] space-y-1">
                  <p className="text-[#5A6779]">
                    Applying as: <strong className="text-[#0B1C2F]">{profile.full_name}</strong>
                  </p>
                  <p className="text-[#5A6779]">
                    Attached CV: <strong className="text-[#0B1C2F]">{profile.cv_filename || 'Aicha_Nkeng_CV.pdf'}</strong>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">
                    Introductory Note / Motivation (Optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Briefly state why you're a great fit for this team in Cameroon..."
                    value={screeningAnswer}
                    onChange={(e) => setScreeningAnswer(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none text-[#0B1C2F]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyingJob(null)}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#5A6779] hover:bg-[#F4F6F9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* REPORT SUSPICIOUS LISTING MODAL */}
      {/* =================================================================== */}
      {reportingJob && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D14343]" />
                <h3 className="text-sm font-bold text-[#0B1C2F]">Report Listing</h3>
              </div>
              <button onClick={() => setReportingJob(null)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#EAF5EF] text-[#1A7F4B] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#0B1C2F]">Report Received</h4>
                <p className="text-xs text-[#5A6779]">
                  WorkDey platform moderators will review this listing within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                <p className="text-[#5A6779]">
                  Reporting: <strong className="text-[#0B1C2F]">{reportingJob.title}</strong>
                </p>

                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Reason for report</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#E2E7EE] text-[#0B1C2F] outline-none"
                  >
                    <option value="fees_requested">Recruitment or interview fees requested</option>
                    <option value="unrealistic_pay">Unrealistic salary or scam promise</option>
                    <option value="discriminatory">Discriminatory or illegal job requirements</option>
                    <option value="fake_company">Impersonation of another company</option>
                    <option value="other">Other policy violation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Additional details</label>
                  <textarea
                    rows={3}
                    placeholder="Provide context for platform governance moderators..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7EE] focus:border-[#D14343] outline-none text-[#0B1C2F]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingJob(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5A6779] hover:bg-[#F4F6F9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#D14343] text-white text-xs font-bold hover:bg-[#B53333] cursor-pointer"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
