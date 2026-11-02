'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, BrainCircuit, MessageSquare, Target, CheckCircle2, ChevronRight } from 'lucide-react';
import { MatchRing } from '@/components/ui/match-ring';

export function AICareerShowcase() {
  const [activeTab, setActiveTab] = useState<'match' | 'interview' | 'roadmap'>('match');
  const [selectedRole, setSelectedRole] = useState<'analyst' | 'engineer' | 'operations'>('analyst');

  const roleData = {
    analyst: {
      title: 'Senior Data Analyst',
      company: 'Savanna Agritech · Douala',
      salary: '650,000 – 900,000 XAF / mo',
      score: 92,
      skillsScore: 88,
      expScore: 74,
      locScore: 100,
      matchedSkills: ['SQL window functions', 'Power BI', 'Agribusiness metrics', 'Bilingual EN/FR'],
      gapSkill: 'Python geospatial forecasting (Shapely / GeoPandas)',
      coachTip:
        '“You have strong operational reporting experience. Adding one portfolio repo demonstrating agricultural harvest yield forecasting will unlock the top 8% of applicants in Littoral region.”',
      interviewQuestion:
        '“How would you structure a monthly yield variance report for regional farmer cooperatives when field connectivity in rural West region is intermittent?”',
      interviewAdvice:
        'Structure your answer using STAR: mention offline SQLite caching, edge synchronization protocols, and plain French/English summary KPIs for cooperative chairpersons.',
      nextStep: 'Enrol in GeoPandas Spatial Analysis module (Roadmap Month 2)',
    },
    engineer: {
      title: 'Frontend Engineer (React)',
      company: 'Savanna Agritech · Remote',
      salary: '1,800,000 – 2,400,000 XAF / mo',
      score: 87,
      skillsScore: 92,
      expScore: 80,
      locScore: 95,
      matchedSkills: ['React 19', 'TypeScript', 'Tailwind CSS', 'State hydration'],
      gapSkill: 'PWA service workers & offline IndexedDB queuing',
      coachTip:
        '“Savanna builds field tools used in remote agrarian sectors where 3G drops frequently. Highlighting offline-first service worker architecture in your profile will elevate this match to 96%.”',
      interviewQuestion:
        '“Walk us through your architecture for an offline-first data capture form that syncs conflicting updates when internet re-establishes.”',
      interviewAdvice:
        'Explain optimistic UI updates, conflict resolution with vector clocks or last-write-wins timestamping, and background sync registration.',
      nextStep: 'Deploy offline PWA prototype (Roadmap Month 3)',
    },
    operations: {
      title: 'Operations Coordinator',
      company: 'Harbor & Co. Logistics · Kribi Deep Sea Port',
      salary: '350,000 – 450,000 XAF / mo',
      score: 79,
      skillsScore: 82,
      expScore: 70,
      locScore: 85,
      matchedSkills: ['Customs clearance procedures', 'Freight manifest tracking', 'Bilingual negotiation'],
      gapSkill: 'Automated Port Management EDI systems (CAMCIS)',
      coachTip:
        '“You already understand maritime logistics in Douala. Familiarising yourself with Kribi port’s automated CAMCIS customs portal will immediately qualify you for the senior bracket.”',
      interviewQuestion:
        '“Describe how you handled a container demurrage dispute caused by delayed customs paperwork under tight vessel turnaround windows.”',
      interviewAdvice:
        'Detail proactive manifest reconciliation with shipping agents, escalation paths with local customs inspectors, and client communication cadence.',
      nextStep: 'Complete CAMCIS Customs Masterclass (Roadmap Month 1)',
    },
  };

  const current = roleData[selectedRole];

  return (
    <div className="bg-[#0B1C2F] text-white rounded-2xl p-6 sm:p-10 border border-[#223247] shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#14A89E]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-[#2552C2]/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#223247] relative z-10">
        <div>
          <p className="text-xs font-bold text-[#14A89E] tracking-wider uppercase mb-2">
            Career Intelligence Grounded in Evidence
          </p>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white text-balance break-words">
            Transparent fit evaluation &amp; interview preparation
          </h2>
          <p className="text-xs sm:text-sm text-[#A0AEC0] max-w-xl mt-1.5 leading-relaxed">
            WorkDey breaks down match scores into verifiable skill, experience, and location factors with actionable guidance to close gaps.
          </p>
        </div>

        {/* Feature switcher segmented control (Clean functional buttons) */}
        <div className="flex flex-wrap bg-[#162436] p-1 rounded-xl border border-[#223247] self-start md:self-auto gap-1">
          <button
            onClick={() => setActiveTab('match')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all min-h-[40px] ${
              activeTab === 'match'
                ? 'bg-[#0B7F7A] text-white shadow-sm'
                : 'text-[#A0AEC0] hover:text-white'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Fit Breakdown</span>
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all min-h-[40px] ${
              activeTab === 'interview'
                ? 'bg-[#0B7F7A] text-white shadow-sm'
                : 'text-[#A0AEC0] hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Interview Prep</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all min-h-[40px] ${
              activeTab === 'roadmap'
                ? 'bg-[#0B7F7A] text-white shadow-sm'
                : 'text-[#A0AEC0] hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Growth Plan</span>
          </button>
        </div>
      </div>

      {/* Role Picker (Touch-friendly filter buttons) */}
      <div className="pt-6 pb-4 flex flex-wrap items-center gap-2 relative z-10">
        <span className="text-xs text-[#A0AEC0] font-medium mr-1">Simulate candidate profile for:</span>
        {(
          [
            { id: 'analyst', label: 'Senior Data Analyst (Douala)' },
            { id: 'engineer', label: 'Frontend Engineer (Remote)' },
            { id: 'operations', label: 'Operations Coordinator (Kribi)' },
          ] as const
        ).map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`px-3 py-1.5 min-h-[40px] rounded-lg text-xs font-semibold transition-all ${
              selectedRole === role.id
                ? 'bg-white text-[#0B1C2F] shadow-sm'
                : 'bg-[#162436] text-[#A0AEC0] border border-[#223247] hover:text-white'
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content Panels */}
      <div className="mt-4 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'match' && (
            <motion.div
              key={`match-${selectedRole}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#111D2C] p-6 rounded-xl border border-[#223247]"
            >
              {/* Left Column: Match Score & Bars */}
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#223247]">
                  <div>
                    <h3 className="text-base font-bold text-white">{current.title}</h3>
                    <p className="text-xs text-[#A0AEC0]">{current.company}</p>
                    <p className="text-xs font-semibold text-[#14A89E] mt-0.5 tnum">{current.salary}</p>
                  </div>
                  <MatchRing score={current.score} size="lg" />
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-bold text-[#A0AEC0] uppercase tracking-wider">
                    Score Decomposition
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#E7ECF3]">Skills match</span>
                      <span className="font-bold text-white tnum">{current.skillsScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#162436] overflow-hidden">
                      <div
                        className="h-full bg-[#14A89E] rounded-full transition-all duration-700"
                        style={{ width: `${current.skillsScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#E7ECF3]">Experience fit</span>
                      <span className="font-bold text-white tnum">{current.expScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#162436] overflow-hidden">
                      <div
                        className="h-full bg-[#2552C2] rounded-full transition-all duration-700"
                        style={{ width: `${current.expScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#E7ECF3]">Location & work mode</span>
                      <span className="font-bold text-white tnum">{current.locScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#162436] overflow-hidden">
                      <div
                        className="h-full bg-[#1A7F4B] rounded-full transition-all duration-700"
                        style={{ width: `${current.locScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Reasoning & Action Item */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4 bg-[#162436] p-5 rounded-lg border border-[#223247]">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#14A89E]" />
                    <span className="text-xs font-bold text-[#14A89E] uppercase tracking-wider">
                      Why this role matches you
                    </span>
                  </div>

                  <p className="text-xs text-[#E7ECF3] leading-relaxed italic bg-[#111D2C] p-3.5 rounded-lg border border-[#223247]">
                    {current.coachTip}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-[#111D2C] rounded-lg border border-[#223247]">
                      <span className="text-[10px] uppercase font-bold text-[#1A7F4B] block mb-1">
                        Verified Strengths
                      </span>
                      <ul className="space-y-1 text-xs text-[#E7ECF3]">
                        {current.matchedSkills.slice(0, 3).map((s) => (
                          <li key={s} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-[#1A7F4B] flex-shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-[#111D2C] rounded-lg border border-[#223247]">
                      <span className="text-[10px] uppercase font-bold text-[#E8A317] block mb-1">
                        Identified Skill Gap
                      </span>
                      <p className="text-xs text-[#E7ECF3] leading-snug">{current.gapSkill}</p>
                      <span className="text-[10px] text-[#A0AEC0] block mt-1">
                        Easily bridged in 2 weeks
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-[#223247]">
                  <span className="text-[#A0AEC0]">Recommended roadmap milestone:</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    {current.nextStep} <ChevronRight className="w-3.5 h-3.5 text-[#14A89E]" />
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'interview' && (
            <motion.div
              key={`interview-${selectedRole}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#111D2C] p-6 rounded-xl border border-[#223247] space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#14A89E] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> AI Coach Simulated Mock Interview
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    Custom Scenario for {current.title}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-[#162436] text-[#A0AEC0] border border-[#223247]">
                  Difficulty: Professional
                </span>
              </div>

              <div className="p-4 bg-[#162436] rounded-xl border-l-4 border-l-[#14A89E] border border-[#223247]">
                <p className="text-sm text-white font-medium leading-relaxed">
                  {current.interviewQuestion}
                </p>
              </div>

              <div className="p-4 bg-[#111D2C] rounded-xl border border-[#223247] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E8A317]">
                  <Sparkles className="w-3.5 h-3.5" /> Coach Hint & Expected Answering Structure:
                </div>
                <p className="text-xs text-[#E7ECF3] leading-relaxed">{current.interviewAdvice}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
                <span className="text-[#A0AEC0]">
                  Over 1,200 role-specific questions curated for Cameroon and African enterprise contexts.
                </span>
                <span className="text-white font-semibold flex items-center gap-1 text-[#14A89E]">
                  Practice full session in Talent Coach →
                </span>
              </div>
            </motion.div>
          )}

          {activeTab === 'roadmap' && (
            <motion.div
              key={`roadmap-${selectedRole}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#111D2C] p-6 rounded-xl border border-[#223247] space-y-6"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#14A89E]">
                  Personalised Career Trajectory
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  12-Month Target: Advance from Mid-Level to Senior Specialist
                </h3>
                <p className="text-xs text-[#A0AEC0] mt-0.5">
                  Target salary uplift: from 650,000 XAF to 1,200,000 XAF / month
                </p>
              </div>

              {/* 3 Steps in Roadmap Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#162436] rounded-xl border border-[#223247] space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#14A89E] uppercase">Months 1 – 3</span>
                    <span className="w-2 h-2 rounded-full bg-[#14A89E]" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Bridge High-Impact Core Tooling</h4>
                  <p className="text-[11px] text-[#A0AEC0] leading-relaxed">
                    Complete portfolio capstone addressing {current.gapSkill} and submit for peer review.
                  </p>
                </div>

                <div className="p-4 bg-[#162436] rounded-xl border border-[#223247] space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#2552C2] uppercase">Months 4 – 8</span>
                    <span className="w-2 h-2 rounded-full bg-[#2552C2]" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Lead Cross-Functional Project</h4>
                  <p className="text-[11px] text-[#A0AEC0] leading-relaxed">
                    Document quantifiable business ROI (e.g. 15% reduction in stock spoilage or delivery demurrage).
                  </p>
                </div>

                <div className="p-4 bg-[#162436] rounded-xl border border-[#223247] space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#E8A317] uppercase">Months 9 – 12</span>
                    <span className="w-2 h-2 rounded-full bg-[#E8A317]" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Target Senior Offers</h4>
                  <p className="text-[11px] text-[#A0AEC0] leading-relaxed">
                    Leverage verified WorkDey credential and coach interview prep to target senior brackets in XAF.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
