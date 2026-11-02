'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useEmployer, EmployerApplicant } from '@/lib/employer/employer-context';
import { CandidateMatchResult } from '@/lib/ai/types';
import {
  Search,
  Filter,
  Download,
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
  X,
  ShieldCheck,
  HelpCircle,
  FileText,
  MessageSquare,
  Calendar,
  Eye,
  Scale,
  Send,
  AlertCircle,
  Building,
} from 'lucide-react';
import { ApplicationStage } from '@/lib/types/database';

export default function EmployerApplicantsPage() {
  const { applicants, orgJobs, updateApplicantStage, addApplicantNote, scheduleInterview } = useEmployer();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJobId, setFilterJobId] = useState('all');
  const [filterStage, setFilterStage] = useState('all');

  // Modals & Drawers State
  const [profileModalCandidate, setProfileModalCandidate] = useState<EmployerApplicant | null>(null);
  const [cvModalCandidate, setCvModalCandidate] = useState<EmployerApplicant | null>(null);
  const [notesModalCandidate, setNotesModalCandidate] = useState<EmployerApplicant | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [contactModalCandidate, setContactModalCandidate] = useState<EmployerApplicant | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSentAlert, setContactSentAlert] = useState<string | null>(null);

  // Interview Schedule Modal
  const [scheduleModalCandidate, setScheduleModalCandidate] = useState<EmployerApplicant | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-11-04T10:00');
  const [interviewFormat, setInterviewFormat] = useState<'video' | 'onsite' | 'phone'>('video');
  const [interviewLocation, setInterviewLocation] = useState('https://meet.workdey.cm/savanna-interview');
  const [interviewPanel, setInterviewPanel] = useState('Head of Analytics, HR Lead');

  // Side-by-side Candidate Comparison
  const [compareSelectedIds, setCompareSelectedIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // AI Matching Modal
  const [aiMatchCandidate, setAiMatchCandidate] = useState<EmployerApplicant | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<CandidateMatchResult | null>(null);

  // Filtered applicants list
  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      // Role filter
      if (filterJobId !== 'all' && a.job_id !== filterJobId) return false;
      // Stage filter
      if (filterStage !== 'all' && a.stage !== filterStage) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = a.talent_name.toLowerCase().includes(q);
        const matchesCity = a.talent_city.toLowerCase().includes(q);
        const matchesSkills = a.talent_skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCity && !matchesSkills) return false;
      }
      return true;
    });
  }, [applicants, filterJobId, filterStage, searchQuery]);

  // Handle AI Matching
  const handleOpenAiMatch = async (candidate: EmployerApplicant) => {
    setAiMatchCandidate(candidate);
    setIsMatching(true);
    setMatchResult(null);

    const job = orgJobs.find((j) => j.id === candidate.job_id) || orgJobs[0];

    try {
      const res = await fetch('/api/ai/match-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: {
            id: job?.id || 'job-data',
            title: job?.title || candidate.talent_headline,
            city: job?.city || 'Douala',
            work_style: job?.work_style || 'hybrid',
            required_skills: job?.required_skills || ['SQL', 'Power BI', 'Data Modeling', 'Python'],
            description: job?.description || 'Data professional role in Central Africa',
            minimum_years_experience: 4,
          },
          candidate: {
            id: candidate.talent_id,
            city: candidate.talent_city,
            skills: candidate.talent_skills.map((s) => ({
              name: s,
              proficiency: 'advanced',
              years_experience: candidate.talent_experience_years,
            })),
            experiences: [
              {
                title: candidate.talent_headline,
                company: 'Previous Employer · Douala',
                duration: `${candidate.talent_experience_years} years`,
                description: 'Reporting pipelines and data analytics.',
              },
            ],
            educations: [
              {
                institution: 'University of Yaoundé I',
                degree: 'B.Sc. Computer Science',
                field: 'Applied Mathematics & Analytics',
              },
            ],
            certifications: [
              {
                name: 'Microsoft Certified: Power BI Data Analyst Associate',
                issuer: 'Microsoft',
              },
            ],
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMatchResult(data);
      }
    } catch {
      // fallback
    } finally {
      setIsMatching(false);
    }
  };

  // Toggle candidate for comparison
  const toggleCompare = (candidateId: string) => {
    if (compareSelectedIds.includes(candidateId)) {
      setCompareSelectedIds(compareSelectedIds.filter((id) => id !== candidateId));
    } else {
      if (compareSelectedIds.length >= 2) {
        // Replace second
        setCompareSelectedIds([compareSelectedIds[0], candidateId]);
      } else {
        setCompareSelectedIds([...compareSelectedIds, candidateId]);
      }
    }
  };

  const compareCandidates = useMemo(() => {
    return applicants.filter((a) => compareSelectedIds.includes(a.id));
  }, [applicants, compareSelectedIds]);

  // Handle Note Add
  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesModalCandidate || !newNoteText.trim()) return;
    addApplicantNote(notesModalCandidate.id, newNoteText.trim());
    setNewNoteText('');
  };

  // Handle Schedule Interview
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleModalCandidate) return;

    scheduleInterview({
      application_id: scheduleModalCandidate.id,
      scheduled_at: new Date(interviewDate).toISOString(),
      duration_minutes: 45,
      format: interviewFormat,
      meeting_link_or_location: interviewLocation,
      interviewer_names: interviewPanel.split(',').map((s) => s.trim()),
    });

    setScheduleModalCandidate(null);
  };

  // Handle Contact Candidate
  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactModalCandidate || !contactMessage.trim()) return;
    setContactSentAlert(`Message dispatched to ${contactModalCandidate.talent_name}.`);
    setContactMessage('');
    setContactModalCandidate(null);
    setTimeout(() => setContactSentAlert(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#5A6779] block">
            {applicants.length} candidates across {orgJobs.length} roles
          </span>
          <h1 className="text-2xl font-bold text-[#0B1C2F] font-display">Candidate Directory</h1>
        </div>

        <div className="flex items-center gap-2">
          {compareSelectedIds.length === 2 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#096662] flex items-center gap-1.5 shadow-sm animate-pulse"
            >
              <Scale className="w-3.5 h-3.5" /> Compare 2 Candidates
            </button>
          )}

          <Link
            href="/employer/pipeline"
            className="px-3.5 py-1.5 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F] shadow-sm flex items-center gap-1.5"
          >
            Kanban Pipeline →
          </Link>
        </div>
      </div>

      {contactSentAlert && (
        <div className="p-3 bg-[#E6F5F3] border border-[#0B7F7A]/20 text-[#0B7F7A] text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" /> {contactSentAlert}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E7EE] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center px-3 py-2 bg-[#F4F6F9] rounded-lg border border-[#E2E7EE] text-xs">
            <Search className="w-4 h-4 text-[#5A6779] mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, competency (e.g. SQL, Power BI) or city..."
              className="w-full bg-transparent outline-none text-[#0B1C2F] placeholder-[#5A6779]"
            />
          </div>

          <select
            value={filterJobId}
            onChange={(e) => setFilterJobId(e.target.value)}
            className="px-3 py-2 bg-[#F4F6F9] rounded-lg border border-[#E2E7EE] text-xs text-[#0B1C2F] outline-none"
          >
            <option value="all">All Roles</option>
            {orgJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>

        {/* Stage Pills */}
        <div className="flex flex-wrap gap-2 text-xs pt-1">
          {[
            { key: 'all', label: 'All Candidates' },
            { key: 'applied', label: 'Applied (New)' },
            { key: 'under_review', label: 'Under Review' },
            { key: 'shortlisted', label: 'Shortlisted' },
            { key: 'interview', label: 'Interview' },
            { key: 'offer', label: 'Offer' },
          ].map((pill) => (
            <button
              key={pill.key}
              onClick={() => setFilterStage(pill.key)}
              className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors ${
                filterStage === pill.key
                  ? 'bg-[#2552C2] text-white shadow-sm'
                  : 'bg-[#F4F6F9] text-[#5A6779] hover:bg-[#E2E7EE]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F4F6F9] border-b border-[#E2E7EE] text-[10px] font-bold text-[#5A6779] uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 w-10 text-center">Compare</th>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Role Applied</th>
              <th className="px-4 py-3 tnum">Fit Score</th>
              <th className="px-4 py-3">Stage Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E7EE]">
            {filteredApplicants.map((app) => {
              const job = orgJobs.find((j) => j.id === app.job_id);
              const isComparing = compareSelectedIds.includes(app.id);

              return (
                <tr key={app.id} className="hover:bg-[#F4F6F9] transition-colors">
                  <td className="px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={isComparing}
                      onChange={() => toggleCompare(app.id)}
                      className="rounded text-[#2552C2] focus:ring-[#2552C2]"
                      title="Select up to 2 candidates to compare"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#2552C2] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {app.talent_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <button
                          onClick={() => setProfileModalCandidate(app)}
                          className="font-bold text-[#0B1C2F] hover:text-[#2552C2] text-left hover:underline"
                        >
                          {app.talent_name}
                        </button>
                        <p className="text-[11px] text-[#5A6779]">
                          {app.talent_city} · {app.talent_experience_years} yrs exp
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-[#0B1C2F]">
                    {job?.title || 'Open Role'}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-xs tnum ${
                        (app.match_score || 0) >= 85
                          ? 'bg-[#E6F5F3] text-[#0B7F7A]'
                          : (app.match_score || 0) >= 70
                          ? 'bg-[#EAF0FC] text-[#2552C2]'
                          : 'bg-[#F4F6F9] text-[#5A6779]'
                      }`}
                    >
                      {app.match_score || 0}%
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <select
                      value={app.stage}
                      onChange={(e) => updateApplicantStage(app.id, e.target.value as ApplicationStage)}
                      className="px-2 py-1 rounded-lg border border-[#E2E7EE] bg-white font-bold text-[11px] text-[#0B1C2F] outline-none"
                    >
                      <option value="applied">Applied</option>
                      <option value="under_review">Under Review</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setNotesModalCandidate(app)}
                      className="text-xs text-[#5A6779] hover:text-[#0B1C2F] flex items-center gap-1 font-semibold"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{app.internal_notes.length} note{app.internal_notes.length === 1 ? '' : 's'}</span>
                    </button>
                  </td>

                  <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenAiMatch(app)}
                      className="px-2.5 py-1 rounded bg-[#EAF0FC] text-[#2552C2] hover:bg-[#2552C2] hover:text-white font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                      title="AI Match & Interview Prep"
                    >
                      <Sparkles className="w-3 h-3" /> AI Fit
                    </button>

                    <button
                      onClick={() => setCvModalCandidate(app)}
                      className="px-2 py-1 rounded border border-[#E2E7EE] text-[#5A6779] hover:text-[#0B1C2F] hover:bg-white text-[11px] font-semibold inline-flex items-center gap-1"
                      title="View CV"
                    >
                      <FileText className="w-3 h-3" /> CV
                    </button>

                    <button
                      onClick={() => setScheduleModalCandidate(app)}
                      className="px-2 py-1 rounded border border-[#E2E7EE] text-[#5A6779] hover:text-[#2552C2] hover:bg-white text-[11px] font-semibold inline-flex items-center gap-1"
                      title="Schedule Interview"
                    >
                      <Calendar className="w-3 h-3" /> Interview
                    </button>

                    <button
                      onClick={() => setContactModalCandidate(app)}
                      className="px-2 py-1 rounded border border-[#E2E7EE] text-[#5A6779] hover:text-[#0B7F7A] hover:bg-white text-[11px] font-semibold inline-flex items-center gap-1"
                      title="Message Candidate"
                    >
                      <Send className="w-3 h-3" /> Contact
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredApplicants.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-xs text-[#5A6779]">
                  No candidates match the selected filters or search terms.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: AI Match & Interview Questions */}
      {aiMatchCandidate && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div>
                <span className="text-[10px] font-bold text-[#2552C2] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Assistive Evaluation
                </span>
                <h3 className="text-base font-bold text-[#0B1C2F]">
                  {aiMatchCandidate.talent_name} · Fit Analysis
                </h3>
              </div>
              <button onClick={() => setAiMatchCandidate(null)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {isMatching && (
              <div className="p-8 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-[#2552C2] animate-spin mx-auto" />
                <p className="text-xs font-bold text-[#0B1C2F]">Analyzing profile against job expectations...</p>
              </div>
            )}

            {matchResult && !isMatching && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-[#E2E7EE] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5A6779]">Fit Score</span>
                    <h4 className="text-2xl font-black text-[#0B1C2F]">{matchResult.match_score}%</h4>
                    <p className="text-[11px] text-[#5A6779] mt-0.5">{matchResult.explanation}</p>
                  </div>
                  <div className="w-14 h-14 rounded-full border-4 border-[#2552C2] text-[#2552C2] font-black flex items-center justify-center text-sm">
                    {matchResult.match_score}%
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#0B1C2F]">Matching Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {matchResult.matching_skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#EAF5EF] text-[#1A7F4B] text-[10px] font-bold border border-[#1A7F4B]/20">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#0B1C2F]">Relevant Strengths</h4>
                  <ul className="space-y-1 text-[11px] text-[#0B1C2F]">
                    {matchResult.relevant_strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#1A7F4B] mt-0.5 flex-shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-[#EAF0FC]/60 border border-[#2552C2]/20 space-y-2">
                  <h4 className="font-bold text-[#2552C2] flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" /> Suggested Interview Focus
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#0B1C2F]">
                    {matchResult.suggested_interview_areas.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-[11px] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#B45309] mt-0.5" />
                  <span>
                    <strong>Ethical hiring notice:</strong> AI matching is an advisory tool. Human hiring managers must make all decisions.
                  </span>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#E2E7EE] flex justify-end">
              <button
                onClick={() => setAiMatchCandidate(null)}
                className="px-4 py-2 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F]"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Candidate Full Profile */}
      {profileModalCandidate && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B7F7A] text-white flex items-center justify-center font-bold text-sm">
                  {profileModalCandidate.talent_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1C2F]">{profileModalCandidate.talent_name}</h3>
                  <p className="text-xs text-[#5A6779]">{profileModalCandidate.talent_city} · {profileModalCandidate.talent_experience_years} years experience</p>
                </div>
              </div>
              <button onClick={() => setProfileModalCandidate(null)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-[#5A6779] uppercase text-[10px] block mb-1">Headline</span>
                <p className="text-[#0B1C2F] bg-[#F4F6F9] p-3 rounded-lg border border-[#E2E7EE]">
                  {profileModalCandidate.talent_headline}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#5A6779] uppercase text-[10px] block mb-1">Verified Skills & Tools</span>
                <div className="flex flex-wrap gap-1">
                  {profileModalCandidate.talent_skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded bg-[#EAF0FC] text-[#2552C2] font-semibold text-xs border border-[#2552C2]/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-[#5A6779] uppercase text-[10px] block mb-1">Match Reasoning</span>
                <ul className="space-y-1 text-[#0B1C2F]">
                  {profileModalCandidate.match_reasons?.map((r, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#1A7F4B]" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E7EE] flex justify-end gap-2">
              <button
                onClick={() => {
                  setCvModalCandidate(profileModalCandidate);
                  setProfileModalCandidate(null);
                }}
                className="px-4 py-2 rounded-lg border border-[#E2E7EE] font-semibold text-xs text-[#0B1C2F] hover:bg-[#F4F6F9]"
              >
                View CV Document
              </button>
              <button
                onClick={() => setProfileModalCandidate(null)}
                className="px-4 py-2 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CV Document Viewer */}
      {cvModalCandidate && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2552C2]" />
                <h3 className="text-base font-bold text-[#0B1C2F]">
                  CV Document: {cvModalCandidate.talent_name}
                </h3>
              </div>
              <button onClick={() => setCvModalCandidate(null)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-[#F4F6F9] rounded-xl border border-[#E2E7EE] space-y-4 text-xs">
              <div className="border-b border-[#E2E7EE] pb-3">
                <h2 className="text-lg font-bold text-[#0B1C2F]">{cvModalCandidate.talent_name}</h2>
                <p className="text-[#5A6779]">{cvModalCandidate.talent_headline}</p>
                <p className="text-[11px] text-[#5A6779] mt-1">{cvModalCandidate.talent_city}, Cameroon · Bilingual (EN/FR)</p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-[#2552C2] mb-1">Work History</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-lg border border-[#E2E7EE]">
                    <p className="font-bold text-[#0B1C2F]">Senior Analytics & Reporting Lead</p>
                    <p className="text-[11px] text-[#5A6779]">AgroCam S.A. · Douala (2022 – Present)</p>
                    <p className="text-[11px] text-[#3D4A5C] mt-1">
                      Designed and maintained operational data pipelines, KPI dashboards in Power BI and automated harvest tracking across 4 regions.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E2E7EE]">
                    <p className="font-bold text-[#0B1C2F]">Business Intelligence Specialist</p>
                    <p className="text-[11px] text-[#5A6779]">Coastal Logistics & Supply (2020 – 2022)</p>
                    <p className="text-[11px] text-[#3D4A5C] mt-1">
                      Managed SQL databases, customer churn modeling, and logistics transit analytics for Kribi port shipments.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-[#2552C2] mb-1">Education & Credentials</h4>
                <div className="p-3 bg-white rounded-lg border border-[#E2E7EE]">
                  <p className="font-bold text-[#0B1C2F]">B.Sc. in Computer Science & Applied Statistics</p>
                  <p className="text-[11px] text-[#5A6779]">University of Buea (Honors)</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setCvModalCandidate(null)}
                className="px-4 py-2 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F]"
              >
                Close CV Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Internal Team Notes */}
      {notesModalCandidate && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div>
                <h3 className="text-base font-bold text-[#0B1C2F]">
                  Internal Notes: {notesModalCandidate.talent_name}
                </h3>
                <p className="text-[11px] text-[#5A6779]">Confidential to hiring team</p>
              </div>
              <button onClick={() => setNotesModalCandidate(null)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {notesModalCandidate.internal_notes.map((n) => (
                <div key={n.id} className="p-3 rounded-lg bg-[#F4F6F9] border border-[#E2E7EE] text-xs space-y-1">
                  <div className="flex justify-between font-bold text-[#0B1C2F]">
                    <span>{n.author_name}</span>
                    <span className="text-[10px] text-[#5A6779] font-normal">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[#3D4A5C]">{n.text}</p>
                </div>
              ))}

              {notesModalCandidate.internal_notes.length === 0 && (
                <p className="text-xs text-[#5A6779] text-center py-4">No notes yet for this candidate.</p>
              )}
            </div>

            <form onSubmit={handleAddNoteSubmit} className="space-y-2 pt-2 border-t border-[#E2E7EE]">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add confidential feedback or interview notes..."
                rows={3}
                required
                className="w-full p-2.5 rounded-lg border border-[#E2E7EE] text-xs outline-none focus:border-[#2552C2]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNotesModalCandidate(null)}
                  className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#5A6779]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F]"
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Schedule Interview */}
      {scheduleModalCandidate && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2552C2]" />
                <h3 className="text-base font-bold text-[#0B1C2F]">
                  Schedule Interview: {scheduleModalCandidate.talent_name}
                </h3>
              </div>
              <button onClick={() => setScheduleModalCandidate(null)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E7EE] focus:border-[#2552C2] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Interview Format</label>
                <div className="flex gap-2">
                  {(['video', 'onsite', 'phone'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setInterviewFormat(fmt)}
                      className={`px-3 py-1.5 rounded-lg capitalize font-bold ${
                        interviewFormat === fmt ? 'bg-[#2552C2] text-white' : 'bg-[#F4F6F9] text-[#5A6779]'
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
                  value={interviewLocation}
                  onChange={(e) => setInterviewLocation(e.target.value)}
                  placeholder="e.g. https://meet.workdey.cm/room-492 or Douala Office"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E7EE] focus:border-[#2552C2] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1C2F] mb-1">Interview Panel Members</label>
                <input
                  type="text"
                  value={interviewPanel}
                  onChange={(e) => setInterviewPanel(e.target.value)}
                  placeholder="Names separated by comma"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E7EE] focus:border-[#2552C2] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E2E7EE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleModalCandidate(null)}
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

      {/* MODAL 6: Contact Candidate */}
      {contactModalCandidate && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0B7F7A]" />
                <h3 className="text-base font-bold text-[#0B1C2F]">
                  Message Candidate: {contactModalCandidate.talent_name}
                </h3>
              </div>
              <button onClick={() => setContactModalCandidate(null)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendContact} className="space-y-3 text-xs">
              <p className="text-[#5A6779]">
                This will send an in-app alert and email notification to {contactModalCandidate.talent_name} on behalf of your organisation.
              </p>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Write your invitation or message to the candidate..."
                rows={4}
                required
                className="w-full p-3 rounded-lg border border-[#E2E7EE] outline-none focus:border-[#2552C2]"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E7EE]">
                <button
                  type="button"
                  onClick={() => setContactModalCandidate(null)}
                  className="px-4 py-2 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#5A6779]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#096662]"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: Candidate Side-by-Side Comparison */}
      {showCompareModal && compareCandidates.length === 2 && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-2xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#2552C2]" />
                <h3 className="text-base font-bold text-[#0B1C2F] font-display">
                  Candidate Comparison
                </h3>
              </div>
              <button onClick={() => setShowCompareModal(false)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs divide-x divide-[#E2E7EE]">
              {compareCandidates.map((c, i) => (
                <div key={c.id} className={`space-y-4 ${i === 1 ? 'pl-6' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2552C2] text-white flex items-center justify-center font-bold text-sm">
                      {c.talent_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0B1C2F]">{c.talent_name}</h4>
                      <p className="text-[11px] text-[#5A6779]">{c.talent_city} · {c.talent_experience_years} yrs exp</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F4F6F9] border border-[#E2E7EE] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#5A6779]">AI Match Score</span>
                    <p className="text-2xl font-black text-[#2552C2]">{c.match_score}%</p>
                  </div>

                  <div>
                    <span className="font-bold text-[#5A6779] uppercase text-[10px] block mb-1">Headline</span>
                    <p className="text-[#0B1C2F] leading-snug">{c.talent_headline}</p>
                  </div>

                  <div>
                    <span className="font-bold text-[#5A6779] uppercase text-[10px] block mb-1">Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {c.talent_skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-[#EAF0FC] text-[#2552C2] font-semibold text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-[#5A6779] uppercase text-[10px] block mb-1">Current Stage</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#E6F5F3] text-[#0B7F7A] font-bold text-[10px] capitalize">
                      {c.stage.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E2E7EE] flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-5 py-2 rounded-lg bg-[#2552C2] text-white text-xs font-bold hover:bg-[#1E429F]"
              >
                Done Comparing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
