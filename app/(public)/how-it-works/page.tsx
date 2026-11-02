'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Bot, Compass, FileCheck } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Title */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold text-[#0B7F7A] uppercase tracking-wider block">
          Matching & Transparency
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0B1C2F] font-display tracking-tight leading-tight">
          Guidance that shows its work
        </h1>
        <p className="text-base sm:text-lg text-[#3D4A5C] leading-relaxed">
          Every recommendation comes with its reasoning, so you can trust it, challenge it, or ignore it. AI informs the decision; people make it.
        </p>
      </div>

      {/* 3 Steps in Detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#E6F5F3] text-[#0B7F7A] flex items-center justify-center font-bold text-lg font-display">
            01
          </div>
          <h3 className="text-base font-bold text-[#0B1C2F]">
            1. Skills, Experience & Location
          </h3>
          <p className="text-xs text-[#5A6779] leading-relaxed">
            Match scores break down into three explicit factors: Skills fit (45%), Experience fit (30%), and Location / Work style fit (25%). Nothing is concealed behind a black box.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#EAF0FC] text-[#2552C2] flex items-center justify-center font-bold text-lg font-display">
            02
          </div>
          <h3 className="text-base font-bold text-[#0B1C2F]">
            2. Identifying the Next Skill Gap
          </h3>
          <p className="text-xs text-[#5A6779] leading-relaxed">
            If you fall short of 100%, WorkDey doesn&apos;t just reject your match. It highlights the specific gap (e.g. SQL window functions) and links it directly to your 12-month career roadmap.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#E6F5F3] text-[#0B7F7A] flex items-center justify-center font-bold text-lg font-display">
            03
          </div>
          <h3 className="text-base font-bold text-[#0B1C2F]">
            3. Human Recruiter in the Loop
          </h3>
          <p className="text-xs text-[#5A6779] leading-relaxed">
            Employers review every shortlist. Our platform architecture strictly disallows automated rejections by algorithm. Hiring managers make every final hiring decision.
          </p>
        </div>
      </div>

      {/* Interactive Mock Breakdown Card (PDF Page 8 & 15) */}
      <div className="bg-[#0B1C2F] text-white rounded-2xl p-8 sm:p-12 border border-[#223247] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[10px] font-bold text-[#14A89E] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Real Example From The Platform
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
            Why is the Data Analyst role in Douala a 92% match?
          </h2>
          <p className="text-xs text-[#A0AEC0] leading-relaxed">
            Three things stand out: strong SQL and forecasting overlap, on-site hybrid fit in Douala, and 6 years of agribusiness experience exceeding the 4-year senior threshold.
          </p>
          <div className="p-3 bg-[#162436] rounded-xl border border-[#223247] text-xs space-y-1">
            <p className="font-semibold text-[#14A89E]">Actionable Gap Recommendation:</p>
            <p className="text-[#A0AEC0]">
              SQL window functions. A two-hour learning practice set is ready in your roadmap.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#111D2C] p-6 rounded-xl border border-[#223247] space-y-4 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#223247]">
            <span className="font-bold text-white">Itemized Factors</span>
            <span className="text-base font-black text-[#14A89E] tnum">92%</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#A0AEC0]">Skills match (SQL, Python, Power BI)</span>
                <span className="font-bold text-white tnum">88%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#223247]">
                <div className="h-full bg-[#14A89E] rounded-full w-[88%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#A0AEC0]">Experience match (6 yrs vs 4 required)</span>
                <span className="font-bold text-white tnum">94%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#223247]">
                <div className="h-full bg-[#14A89E] rounded-full w-[94%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#A0AEC0]">Location fit (Douala, Littoral)</span>
                <span className="font-bold text-white tnum">100%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#223247]">
                <div className="h-full bg-[#14A89E] rounded-full w-[100%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 pt-6">
        <h3 className="text-xl font-bold text-[#0B1C2F]">
          See how your skills match open roles across Cameroon
        </h3>
        <Link
          href="/auth/sign-up"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] transition-all shadow-sm"
        >
          Create your free profile →
        </Link>
      </div>
    </div>
  );
}
