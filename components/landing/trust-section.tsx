'use client';

import React from 'react';
import { ShieldCheck, UserCheck, Lock, EyeOff, Coins, Sparkles, Scale, FileText } from 'lucide-react';

export function TrustSection() {
  const trustPillars = [
    {
      icon: ShieldCheck,
      iconColor: 'text-[#1A7F4B]',
      bgColor: 'bg-[#EAF5EF]',
      title: 'Manual Organisation Review',
      description:
        'Every employer must submit commercial registry documentation (RCCM) or ministerial accreditation before posting. We verify legitimacy to protect job seekers from ghost listings and scam recruiting.',
    },
    {
      icon: Scale,
      iconColor: 'text-[#0B7F7A]',
      bgColor: 'bg-[#E6F5F3]',
      title: 'Ethical Human-in-the-Loop',
      description:
        'AI analyzes qualifications and drafts interview questions, but is forbidden from automatically eliminating applicants. Final shortlisting and hiring choices are exclusively executed by human recruiters.',
    },
    {
      icon: Lock,
      iconColor: 'text-[#2552C2]',
      bgColor: 'bg-[#EAF0FC]',
      title: 'Strict Candidate Privacy & RLS',
      description:
        'Your profile and CV are stored behind cryptographic PostgreSQL Row Level Security. You determine when your contact details are shared, with options to hide current employers.',
    },
    {
      icon: Coins,
      iconColor: 'text-[#E8A317]',
      bgColor: 'bg-[#FEF7EC]',
      title: 'Mandatory Salary Bands in XAF',
      description:
        'We believe career growth begins with honesty. Employers must publish realistic monthly or annual salary ranges in Central African CFA Francs (XAF) to prevent wage exploitation.',
    },
  ];

  return (
    <section className="py-20 bg-[#F4F6F9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B7F7A] mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Integrity & Governance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1C2F] font-display tracking-tight text-balance">
            Trust is built into every layer
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6779] mt-2 leading-relaxed">
            Hiring in emerging markets has long suffered from opaque middlemen, undisclosed salaries, and phantom roles. WorkDey establishes a new standard for Central Africa.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-[10px] p-6 border border-[#E2E7EE] shadow-[0_1px_3px_rgba(11,28,47,0.05)] hover:border-[#CBD5E1] transition-colors flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div
                    className={`w-11 h-11 rounded-lg ${pillar.bgColor} ${pillar.iconColor} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0B1C2F] leading-snug">{pillar.title}</h3>
                  <p className="text-xs text-[#5A6779] leading-relaxed">{pillar.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F4F6F9] flex items-center gap-1.5 text-[11px] font-semibold text-[#0B7F7A]">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Enforced by policy</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
