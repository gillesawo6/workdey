'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTalent } from '@/lib/talent/talent-context';
import { TalentCareerRoadmap, TalentRoadmapMilestone } from '@/lib/talent/talent-context';
import { SkillGapResult, RoadmapGenerateResult } from '@/lib/ai/types';
import {
  Sparkles,
  Check,
  ArrowRight,
  Play,
  BookOpen,
  Route,
  CheckCircle2,
  Clock,
  Target,
  Plus,
  ExternalLink,
  ChevronDown,
  Calendar,
  X,
  FileCheck2,
  AlertCircle,
  Briefcase,
  Layers,
  GraduationCap,
  RefreshCw,
} from 'lucide-react';

export default function CareerRoadmapPage() {
  const { profile, roadmap, toggleRoadmapTask, replaceRoadmap, updateProfile } = useTalent();

  // Active tab: 'milestones' | 'skill_gap' | 'resources'
  const [activeTab, setActiveTab] = useState<'milestones' | 'skill_gap' | 'resources'>('milestones');

  // AI Roadmap Generator Modal
  const [showAiRoadmapModal, setShowAiRoadmapModal] = useState(false);
  const [genTargetRole, setGenTargetRole] = useState(roadmap.target_role || 'Senior Data & Platform Lead');
  const [genTimeframe, setGenTimeframe] = useState<number>(12);
  const [genFocusAreas, setGenFocusAreas] = useState<string[]>([
    'Practical Projects',
    'Executive Leadership',
    'Enterprise Architecture',
  ]);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapSuccessMsg, setRoadmapSuccessMsg] = useState<string | null>(null);

  // Skill Gap State
  const [isAnalyzingSkillGap, setIsAnalyzingSkillGap] = useState(false);
  const [skillGapResult, setSkillGapResult] = useState<SkillGapResult | null>(null);

  const handleRunSkillGap = React.useCallback(async () => {
    setIsAnalyzingSkillGap(true);
    try {
      const res = await fetch('/api/ai/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_role: roadmap.target_role || 'Senior Data Analyst',
          current_skills: profile.skills_list.map((s) => ({
            name: s.skill_name,
            proficiency: s.verified_score ? `${s.verified_score}% verified` : 'intermediate',
            years_experience: s.years_experience,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSkillGapResult(data);
      }
    } catch {
      // handled gracefully
    } finally {
      setIsAnalyzingSkillGap(false);
    }
  }, [profile.skills_list, roadmap.target_role]);

  const handleGenerateAiRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingRoadmap(true);
    setRoadmapSuccessMsg(null);

    try {
      const res = await fetch('/api/ai/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal_title: `Trajectory to ${genTargetRole}`,
          current_role: profile.headline || 'Data & Analytics Professional',
          target_role: genTargetRole,
          timeframe_months: genTimeframe,
          current_skills: profile.skills_list.map((s) => s.skill_name),
          focus_areas: genFocusAreas,
        }),
      });

      const data: RoadmapGenerateResult = await res.json();

      if (res.ok && data.milestones) {
        // Convert to TalentRoadmapMilestone
        const convertedMilestones: TalentRoadmapMilestone[] = data.milestones.map((m, idx) => ({
          id: `ai-ms-${Date.now()}-${idx + 1}`,
          roadmap_id: `roadmap-${profile.id}`,
          stage_order: m.stage_order || idx + 1,
          title: m.title,
          duration_text: m.duration_text,
          description: m.description,
          status: idx === 0 ? 'in_progress' : 'pending',
          tasks: m.tasks.map((t, tIdx) => ({
            id: `ai-task-${Date.now()}-${tIdx}`,
            text: t.text,
            done: false,
          })),
        }));

        const newRoadmap: TalentCareerRoadmap = {
          id: `roadmap-${Date.now()}`,
          talent_id: profile.id,
          goal_title: data.goal_title,
          current_role: data.current_role,
          target_role: data.target_role,
          estimated_months: data.estimated_months,
          progress_pct: 0,
          milestones: convertedMilestones,
        };

        replaceRoadmap(newRoadmap);
        updateProfile({ target_role: genTargetRole });
        setRoadmapSuccessMsg('New AI-generated roadmap has been applied and saved!');
        setShowAiRoadmapModal(false);
        setActiveTab('milestones');
      }
    } catch {
      // handled
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Trajectory Target & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#0B7F7A] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Career Architecture
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F5F3] text-[#0B7F7A] border border-[#0B7F7A]/20">
              {roadmap.estimated_months}-Month Trajectory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C2F] font-display mt-1">
            {roadmap.target_role}
          </h1>
          <p className="text-xs text-[#5A6779] mt-0.5">
            Personalised milestone roadmap, skill-gap analysis, and verified learning activities for Central Africa.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAiRoadmapModal(true)}
            className="px-4 py-2 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate with AI</span>
          </button>
        </div>
      </div>

      {roadmapSuccessMsg && (
        <div className="p-3 bg-[#E6F5F3] border border-[#0B7F7A]/30 text-[#0B7F7A] rounded-lg text-xs flex items-center justify-between">
          <span>{roadmapSuccessMsg}</span>
          <button onClick={() => setRoadmapSuccessMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Top Progress Summary Card */}
      <div className="bg-white rounded-xl border border-[#E2E7EE] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#5A6779] uppercase tracking-wider">
              Overall Roadmap Completion
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#0B1C2F] font-display">
                {roadmap.progress_pct}%
              </span>
              <span className="text-xs text-[#5A6779]">
                Target: Senior role in Cameroon or Remote
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-md">
            <div className="h-3 w-full bg-[#E2E7EE] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0B7F7A] rounded-full transition-all duration-500"
                style={{ width: `${roadmap.progress_pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#5A6779] mt-1.5">
              <span>Current: {roadmap.current_role}</span>
              <span className="font-bold text-[#0B7F7A]">{roadmap.milestones.length} Milestones</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E7EE] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'milestones'
              ? 'bg-[#0B7F7A] text-white shadow-xs'
              : 'text-[#5A6779] hover:text-[#0B1C2F]'
          }`}
        >
          Milestones & Tasks ({roadmap.milestones.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('skill_gap');
            if (!skillGapResult && !isAnalyzingSkillGap) {
              handleRunSkillGap();
            }
          }}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'skill_gap'
              ? 'bg-[#0B7F7A] text-white shadow-xs'
              : 'text-[#5A6779] hover:text-[#0B1C2F]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Skill-Gap Analysis
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'resources'
              ? 'bg-[#0B7F7A] text-white shadow-xs'
              : 'text-[#5A6779] hover:text-[#0B1C2F]'
          }`}
        >
          Curated Learning Labs
        </button>
      </div>

      {/* 4. TAB 1: MILESTONES & TASKS */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {roadmap.milestones.map((milestone, idx) => {
            const completedCount = milestone.tasks?.filter((t) => t.done).length || 0;
            const totalCount = milestone.tasks?.length || 0;
            const isCompleted = milestone.status === 'completed' || completedCount === totalCount;

            return (
              <div
                key={milestone.id}
                className="bg-white rounded-xl border border-[#E2E7EE] p-5 shadow-sm hover:border-[#0B7F7A]/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E7EE]">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? 'bg-[#1A7F4B] text-white'
                          : milestone.status === 'in_progress'
                          ? 'bg-[#0B7F7A] text-white'
                          : 'bg-slate-100 text-[#5A6779]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#0B1C2F] font-display">
                        {milestone.title}
                      </h3>
                      <span className="text-[11px] text-[#5A6779]">
                        {milestone.duration_text}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold self-start sm:self-auto ${
                      isCompleted
                        ? 'bg-[#1A7F4B]/15 text-[#1A7F4B]'
                        : milestone.status === 'in_progress'
                        ? 'bg-[#0B7F7A]/15 text-[#0B7F7A]'
                        : 'bg-slate-100 text-[#5A6779]'
                    }`}
                  >
                    {isCompleted
                      ? 'Completed'
                      : milestone.status === 'in_progress'
                      ? 'In Progress'
                      : 'Upcoming'}
                  </span>
                </div>

                {milestone.description && (
                  <p className="text-xs text-[#5A6779] leading-relaxed">
                    {milestone.description}
                  </p>
                )}

                {/* Tasks checklist */}
                {milestone.tasks && milestone.tasks.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#5A6779]">
                      <span>Actionable Checkpoints:</span>
                      <span>
                        {completedCount} of {totalCount} completed
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {milestone.tasks.map((task) => (
                        <label
                          key={task.id}
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F4F6F9] hover:bg-[#E6F5F3]/40 cursor-pointer transition-colors text-xs text-[#0B1C2F]"
                        >
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => toggleRoadmapTask(milestone.id, task.id)}
                            className="mt-0.5 rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
                          />
                          <span className={task.done ? 'line-through text-[#A0AEC0]' : ''}>
                            {task.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. TAB 2: SKILL-GAP ANALYSIS */}
      {activeTab === 'skill_gap' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E2E7EE] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#0B1C2F] font-display">
                Objective Skill Gap Benchmarking
              </h3>
              <p className="text-xs text-[#5A6779]">
                Comparing your verified profile skills against live employer requirements in Cameroon for {roadmap.target_role}.
              </p>
            </div>
            <button
              onClick={handleRunSkillGap}
              disabled={isAnalyzingSkillGap}
              className="px-3.5 py-1.5 rounded-lg border border-[#E2E7EE] bg-[#F4F6F9] hover:bg-white text-xs font-bold text-[#0B1C2F] flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingSkillGap ? 'animate-spin' : ''}`} />
              Re-analyze
            </button>
          </div>

          {isAnalyzingSkillGap && (
            <div className="p-8 text-center bg-white rounded-xl border border-[#E2E7EE] space-y-2">
              <Sparkles className="w-6 h-6 text-[#0B7F7A] animate-spin mx-auto" />
              <div className="text-xs font-bold text-[#0B1C2F]">Analyzing market skill requirements...</div>
            </div>
          )}

          {skillGapResult && !isAnalyzingSkillGap && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Readiness Score Card */}
              <div className="bg-white rounded-xl border border-[#E2E7EE] p-5 shadow-sm space-y-4">
                <span className="text-xs font-bold text-[#5A6779] uppercase">
                  Target Readiness
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-[#0B7F7A] flex items-center justify-center font-extrabold text-xl text-[#0B7F7A]">
                    {skillGapResult.overall_readiness_pct}%
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0B1C2F]">Competitive Fit</h4>
                    <p className="text-[11px] text-[#5A6779]">
                      Qualifies for ~70% of senior postings in Douala.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E7EE] space-y-1.5 text-xs">
                  <div className="font-bold text-[#0B1C2F]">Recommended Priorities:</div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#5A6779]">
                    {skillGapResult.suggested_priorities.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Skills (High Priority) */}
              <div className="bg-white rounded-xl border border-[#E2E7EE] p-5 shadow-sm space-y-3 md:col-span-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E7EE]">
                  <h4 className="text-xs font-bold text-[#0B1C2F]">Identified Competency Gaps</h4>
                  <span className="text-[10px] text-[#5A6779]">Strictly evidence-based</span>
                </div>

                <div className="space-y-2.5">
                  {skillGapResult.missing_skills.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-[#E2E7EE] bg-[#F4F6F9] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#0B1C2F]">{item.skill}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.priority === 'high'
                              ? 'bg-[#B45309]/15 text-[#B45309]'
                              : 'bg-slate-200 text-[#5A6779]'
                          }`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5A6779]">{item.rationale}</p>
                      <div className="text-[11px] font-medium text-[#0B7F7A]">
                        Action: {item.recommended_action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 3: CURATED LEARNING LABS */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Advanced Geospatial Forecasting for Central Africa (Python & GeoPandas)',
              category: 'Technical',
              estimated_hours: '4 hours',
              provider: 'WorkDey Career Academy',
              relevance: 'Bridges critical gap for 6 agritech and logistics positions in Douala & Kribi',
              url: 'https://workdey.cm/academy/geopandas',
            },
            {
              title: 'Executive Stakeholder Storytelling in French & English',
              category: 'Bilingual Leadership',
              estimated_hours: '2.5 hours',
              provider: 'Bilingual Enterprise Masterclass',
              relevance: 'Key preparation for panel interviews with C-suite and regional directors',
              url: 'https://workdey.cm/academy/storytelling',
            },
            {
              title: 'Power BI Performance Tuning & DAX Optimization',
              category: 'Data Engineering',
              estimated_hours: '3 hours',
              provider: 'Microsoft Enterprise Community',
              relevance: 'Prepares for Senior Specialist bracket (750k - 1.2M XAF/mo)',
              url: 'https://learn.microsoft.com/power-bi',
            },
            {
              title: 'Automated Cloud ETL on GCP & Cloud Run',
              category: 'Cloud Engineering',
              estimated_hours: '5 hours',
              provider: 'Google Cloud Skills Boost',
              relevance: 'Hands-on serverless data pipelines for scalable business systems',
              url: 'https://cloud.google.com/skills',
            },
          ].map((res, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-[#E2E7EE] shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-[#0B7F7A] uppercase bg-[#E6F5F3] px-2 py-0.5 rounded">
                {res.category}
              </span>
              <h4 className="text-xs font-bold text-[#0B1C2F]">{res.title}</h4>
              <p className="text-[11px] text-[#5A6779]">{res.relevance}</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#5A6779] border-t border-[#E2E7EE]">
                <span>{res.provider} · {res.estimated_hours}</span>
                <span className="font-bold text-[#0B7F7A] hover:underline cursor-pointer flex items-center gap-1">
                  Start lab <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. AI ROADMAP GENERATOR MODAL */}
      {showAiRoadmapModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0B7F7A]" />
                <h3 className="text-sm font-bold text-[#0B1C2F] font-display">
                  Generate AI Career Roadmap
                </h3>
              </div>
              <button
                onClick={() => setShowAiRoadmapModal(false)}
                className="text-[#5A6779] hover:text-[#0B1C2F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateAiRoadmap} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#0B1C2F] mb-1">Target Role</label>
                <input
                  type="text"
                  value={genTargetRole}
                  onChange={(e) => setGenTargetRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F6F9] border border-[#E2E7EE] rounded-lg focus:outline-none focus:border-[#0B7F7A] text-[#0B1C2F]"
                  placeholder="e.g. Senior Data Architecture Lead"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B1C2F] mb-1">Timeframe (Months)</label>
                <div className="flex gap-2">
                  {[3, 6, 12].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setGenTimeframe(m)}
                      className={`flex-1 py-1.5 rounded-lg border font-bold ${
                        genTimeframe === m
                          ? 'bg-[#0B7F7A] text-white border-[#0B7F7A]'
                          : 'bg-[#F4F6F9] text-[#5A6779] border-[#E2E7EE]'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B1C2F] mb-1">Primary Focus Areas</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Practical Capstone Projects',
                    'Executive Leadership & Mentoring',
                    'Enterprise Cloud Architecture',
                    'Bilingual Technical Communication',
                  ].map((area) => {
                    const selected = genFocusAreas.includes(area);
                    return (
                      <button
                        type="button"
                        key={area}
                        onClick={() =>
                          setGenFocusAreas((prev) =>
                            selected ? prev.filter((a) => a !== area) : [...prev, area]
                          )
                        }
                        className={`p-2 rounded border text-left font-semibold text-[11px] transition-colors ${
                          selected
                            ? 'bg-[#E6F5F3] text-[#0B7F7A] border-[#0B7F7A]'
                            : 'bg-[#F4F6F9] text-[#5A6779] border-[#E2E7EE]'
                        }`}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F4F6F9] text-[11px] text-[#5A6779]">
                WorkDey AI will generate sequential milestones with practical portfolio projects, verifiable checkpoints, and weekly objectives customized to your verified profile.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E7EE]">
                <button
                  type="button"
                  onClick={() => setShowAiRoadmapModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] text-[#5A6779] hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingRoadmap}
                  className="px-4 py-1.5 rounded-lg bg-[#0B7F7A] text-white font-bold hover:bg-[#14A89E] transition-colors flex items-center gap-1.5"
                >
                  {isGeneratingRoadmap ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Build Roadmap</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
