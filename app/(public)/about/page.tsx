'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* 1. Hero (PDF Page 12) */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold text-[#0B7F7A] uppercase tracking-wider block">
          About WorkDey
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0B1C2F] font-display tracking-tight leading-tight">
          Hiring should reward ability, not connections.
        </h1>
        <p className="text-base sm:text-lg text-[#3D4A5C] leading-relaxed">
          WorkDey helps people in Cameroon find work that fits and helps employers find people who thrive, with AI that explains itself and humans who make the final call.
        </p>
      </div>

      {/* 2. Three Core Pillars (PDF Page 12) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#E6F5F3] text-[#0B7F7A] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B1C2F]">
            Explainable matching
          </h3>
          <p className="text-xs text-[#5A6779] leading-relaxed">
            Every score breaks down into skills, experience and location, so both sides can see why. No opaque algorithmic black boxes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#EAF0FC] text-[#2552C2] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B1C2F]">
            Verified employers
          </h3>
          <p className="text-xs text-[#5A6779] leading-relaxed">
            Organisations are reviewed before posting, and every listing is checked for scam fees, unrealistic pay, and unfair wording.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#E6F5F3] text-[#0B7F7A] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B1C2F]">
            People decide
          </h3>
          <p className="text-xs text-[#5A6779] leading-relaxed">
            AI recommends and prepares. It never rejects a candidate or makes a hiring decision on its own. People lead every decision.
          </p>
        </div>
      </div>

      {/* 3. Built in Cameroon & Principles (PDF Page 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-8 border-t border-[#E2E7EE]">
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C2F] font-display">
            Built in Cameroon, ready to go further
          </h2>
          <p className="text-sm text-[#3D4A5C] leading-relaxed">
            We start with Cameroonian cities, English and French, and XAF salaries. The same foundations support new countries, currencies and languages as WorkDey grows across Central and West Africa and connects to the global talent economy.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Douala', 'Yaoundé', 'Buea', 'Limbe', 'Bamenda', 'Bafoussam', 'Kribi'].map((city) => (
              <span
                key={city}
                className="px-3 py-1 bg-white border border-[#E2E7EE] rounded-lg text-xs font-semibold text-[#0B1C2F]"
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-xl border border-[#E2E7EE] shadow-sm space-y-6">
          <h3 className="text-xs font-bold text-[#5A6779] uppercase tracking-wider">
            Our Principles
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-4">
              <span className="font-mono font-bold text-sm text-[#0B7F7A]">01</span>
              <div>
                <h4 className="font-bold text-[#0B1C2F]">Transparency over black boxes</h4>
                <p className="text-[#5A6779] mt-0.5">Scoring formulas and reasons are completely exposed to job seekers and recruiters.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="font-mono font-bold text-sm text-[#0B7F7A]">02</span>
              <div>
                <h4 className="font-bold text-[#0B1C2F]">Privacy controlled by the candidate</h4>
                <p className="text-[#5A6779] mt-0.5">You choose when your CV is visible, hide current employers, and dictate what AI can access.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="font-mono font-bold text-sm text-[#0B7F7A]">03</span>
              <div>
                <h4 className="font-bold text-[#0B1C2F]">Fair access for every region and background</h4>
                <p className="text-[#5A6779] mt-0.5">Bilingual French and English parity with equal weighting for local and remote opportunities.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="font-mono font-bold text-sm text-[#0B7F7A]">04</span>
              <div>
                <h4 className="font-bold text-[#0B1C2F]">Careers are long; we support the whole journey</h4>
                <p className="text-[#5A6779] mt-0.5">Not just job boards — continuous coaching, skill roadmap tracking, and interview simulations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom CTA banner */}
      <div className="bg-[#0B1C2F] rounded-2xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold font-display">Ready to start?</h2>
          <p className="text-xs text-[#A0AEC0] mt-1">
            Free for talent. Employers are verified before they can post.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/sign-up"
            className="px-5 py-2.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] transition-colors"
          >
            Create a profile →
          </Link>
          <Link
            href="/auth/sign-up"
            className="px-5 py-2.5 rounded-lg border border-[#223247] text-white text-xs font-bold hover:bg-[#1D2430] transition-colors"
          >
            Start hiring
          </Link>
        </div>
      </div>
    </div>
  );
}
