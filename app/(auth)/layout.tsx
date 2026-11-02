'use client';

import React from 'react';
import Link from 'next/link';
import { BrandMark } from '@/components/layout/brand-mark';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-[#0B1C2F]">
      {/* Left Column: Auth Forms */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div>
          <BrandMark size="md" />
        </div>

        <div className="max-w-md w-full mx-auto my-8">{children}</div>

        <div className="flex items-center justify-between text-xs text-[#5A6779] pt-6 border-t border-[#E2E7EE]">
          <span>© {new Date().getFullYear()} WorkDey</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#0B1C2F]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#0B1C2F]">Terms</Link>
            <div className="flex items-center gap-1 font-semibold text-[#0B1C2F]">
              <span>EN</span>
              <span className="text-[#5A6779]">|</span>
              <span className="text-[#5A6779] hover:text-[#0B1C2F] cursor-pointer">FR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Dark Navy Ambient Feature Panel (PDF Page 46) */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#0B1C2F] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle decorative contour waves */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 800" fill="none">
            <path d="M-100 200 C 100 300, 200 100, 500 400" stroke="#14A89E" strokeWidth="1.5" />
            <path d="M-50 350 C 150 450, 250 250, 550 550" stroke="#14A89E" strokeWidth="1" />
            <path d="M0 500 C 200 600, 300 400, 600 700" stroke="#14A89E" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative z-10 flex items-center justify-end">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1D2430] text-[#14A89E] border border-[#223247]">
            <Sparkles className="w-3.5 h-3.5" />
            AI that explains every match
          </span>
        </div>

        <div className="relative z-10 space-y-4 max-w-sm">
          <h2 className="text-3xl font-extrabold tracking-tight font-display leading-tight">
            Your next role, with the reasons shown.
          </h2>
          <p className="text-sm text-[#A0AEC0] leading-relaxed">
            Sign in to see your matches, track applications from submitted to offer, and keep your personalized career roadmap moving forward.
          </p>

          <div className="pt-4 space-y-2.5 text-xs text-[#E7ECF3]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#14A89E]" />
              <span>Transparent salary ranges upfront in XAF</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#14A89E]" />
              <span>Verified employers reviewed before posting</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#14A89E]" />
              <span>Humans make the final call — no automated rejections</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#5A6779]">
          WorkDey · Douala, Yaoundé & Remote Worldwide
        </div>
      </div>
    </div>
  );
}
