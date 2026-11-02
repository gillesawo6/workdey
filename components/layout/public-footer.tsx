'use client';

import React from 'react';
import Link from 'next/link';
import { BrandMark } from './brand-mark';

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1C2F] text-white pt-16 pb-12 relative overflow-hidden border-t border-[#223247]">
      {/* Decorative large WorkDey background watermark as specified in PDF */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none opacity-[0.04] text-[18vw] font-black leading-none tracking-tighter text-center overflow-hidden">
        WorkDey
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & Origin */}
          <div className="col-span-2 space-y-4">
            <BrandMark size="md" variant="dark" />
            <p className="text-sm text-[#A0AEC0] max-w-sm leading-relaxed">
              Talent, found. Careers, built. Connecting job seekers and verified organisations across Cameroon with explainable AI and human-led hiring.
            </p>
            <div className="pt-2 text-xs text-[#5A6779]">
              Douala · Yaoundé · Buea · Limbe · Kribi · Remote
            </div>
          </div>

          {/* Col 2: Talent */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Talent
            </h4>
            <ul className="space-y-2 text-sm text-[#A0AEC0]">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Find jobs
                </Link>
              </li>
              <li>
                <Link href="/talent/coach" className="hover:text-white transition-colors">
                  AI career coach
                </Link>
              </li>
              <li>
                <Link href="/talent/roadmap" className="hover:text-white transition-colors">
                  Career roadmap
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-up" className="hover:text-white transition-colors">
                  Create a profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Employers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Employers
            </h4>
            <ul className="space-y-2 text-sm text-[#A0AEC0]">
              <li>
                <Link href="/employer/jobs/create" className="hover:text-white transition-colors">
                  Post a job
                </Link>
              </li>
              <li>
                <Link href="/employer/pipeline" className="hover:text-white transition-colors">
                  Recruitment pipeline
                </Link>
              </li>
              <li>
                <Link href="/employer/profile" className="hover:text-white transition-colors">
                  Employer verification
                </Link>
              </li>
              <li>
                <Link href="/employer/analytics" className="hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-sm text-[#A0AEC0]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About WorkDey
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How matching works
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#223247] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A0AEC0] gap-4">
          <div className="flex items-center gap-4">
            <span>© {currentYear} WorkDey</span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A7F4B] animate-pulse" />
              All systems operational
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#E7ECF3] font-medium">Cameroon · XAF</span>
            <span>·</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">EN</span>
              <span className="text-[#5A6779]">|</span>
              <span className="text-[#A0AEC0] hover:text-white cursor-pointer">FR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
