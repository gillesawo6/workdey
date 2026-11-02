'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandMark } from './brand-mark';
import { WorkspaceSwitcher } from './workspace-switcher';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Search,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  MapPin,
  Building,
  Briefcase,
  Layers,
  GraduationCap,
} from 'lucide-react';

export function PublicHeader() {
  const router = useRouter();
  const { isAuthenticated, activeWorkspace } = useAuth();
  const [lang, setLang] = useState<'EN' | 'FR'>('EN');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isEmployerMenuOpen, setIsEmployerMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* 1. Announcement Bar */}
      <div className="bg-[#0B1C2F] text-white text-xs py-2 px-4 border-b border-[#223247]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide text-[#14A89E]">WorkDey Cameroon</span>
            <span className="text-[#A0AEC0] hidden sm:inline">· English &amp; French bilingual platform</span>
          </div>
          <Link
            href="/how-it-works"
            className="flex items-center gap-1 text-[#14A89E] hover:text-white transition-colors font-medium text-xs whitespace-nowrap"
          >
            How matching works <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Main Public Navbar (Liquid Glass Material) */}
      <nav className="liquid-glass border-b border-[#E2E7EE] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8 min-w-0">
            <BrandMark size="md" />

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Find Jobs with Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <Link
                  href="/jobs"
                  className="px-3 py-2 text-sm font-medium text-[#3D4A5C] hover:text-[#0B1C2F] rounded-md transition-colors flex items-center gap-1 group whitespace-nowrap"
                >
                  Find jobs
                  <ChevronDown className="w-3.5 h-3.5 text-[#5A6779] group-hover:rotate-180 transition-transform duration-150" />
                </Link>

                {/* Mega Menu Popup */}
                {isMegaMenuOpen && (
                  <div className="absolute top-full left-0 w-[580px] bg-white rounded-xl border border-[#E2E7EE] shadow-xl p-6 grid grid-cols-3 gap-6 animate-in fade-in-50 duration-150 z-50">
                    <div>
                      <p className="text-[11px] font-bold text-[#5A6779] uppercase tracking-wider mb-3">
                        Browse by City
                      </p>
                      <ul className="space-y-2 text-xs">
                        <li>
                          <Link href="/jobs?city=Douala" className="font-semibold text-[#0B1C2F] hover:text-[#0B7F7A] block">
                            Douala
                          </Link>
                          <span className="text-[11px] text-[#5A6779]">Littoral · commerce, logistics</span>
                        </li>
                        <li>
                          <Link href="/jobs?city=Yaoundé" className="font-semibold text-[#0B1C2F] hover:text-[#0B7F7A] block">
                            Yaoundé
                          </Link>
                          <span className="text-[11px] text-[#5A6779]">Centre · public, telecom</span>
                        </li>
                        <li>
                          <Link href="/jobs?city=Buea" className="font-semibold text-[#0B1C2F] hover:text-[#0B7F7A] block">
                            Buea & Limbe
                          </Link>
                          <span className="text-[11px] text-[#5A6779]">South-West · Silicon Mountain</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-[#5A6779] uppercase tracking-wider mb-3">
                        Work Style
                      </p>
                      <ul className="space-y-2 text-xs">
                        <li>
                          <Link href="/jobs?style=remote" className="font-semibold text-[#0B1C2F] hover:text-[#0B7F7A] block">
                            Remote Worldwide
                          </Link>
                          <span className="text-[11px] text-[#5A6779]">Work from anywhere</span>
                        </li>
                        <li>
                          <Link href="/jobs?style=hybrid" className="font-semibold text-[#0B1C2F] hover:text-[#0B7F7A] block">
                            Hybrid Roles
                          </Link>
                          <span className="text-[11px] text-[#5A6779]">Office and home mix</span>
                        </li>
                        <li>
                          <Link href="/jobs?contract=internship" className="font-semibold text-[#0B1C2F] hover:text-[#0B7F7A] block">
                            Internships
                          </Link>
                          <span className="text-[11px] text-[#5A6779]">Start your career</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-[#0B1C2F] text-white p-4 rounded-lg flex flex-col justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#14A89E] tracking-wider mb-1">
                          <Sparkles className="w-3 h-3" /> AI-Matched
                        </span>
                        <h4 className="text-xs font-bold leading-snug">
                          See why a role fits you before applying.
                        </h4>
                        <p className="text-[11px] text-[#E2E7EE]/80 mt-1">
                          Plain-language match score breakdown.
                        </p>
                      </div>
                      <Link
                        href="/auth/sign-up"
                        className="mt-3 px-3 py-1.5 bg-[#0B7F7A] text-white text-xs font-semibold rounded text-center hover:bg-[#14A89E] transition-colors"
                      >
                        Create profile →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* For Employers Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsEmployerMenuOpen(true)}
                onMouseLeave={() => setIsEmployerMenuOpen(false)}
              >
                <button className="px-3 py-2 text-sm font-medium text-[#3D4A5C] hover:text-[#0B1C2F] rounded-md transition-colors flex items-center gap-1 group">
                  For employers
                  <ChevronDown className="w-3.5 h-3.5 text-[#5A6779] group-hover:rotate-180 transition-transform duration-150" />
                </button>

                {isEmployerMenuOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-xl border border-[#E2E7EE] shadow-xl p-3 space-y-1 animate-in fade-in-50 duration-150 z-50">
                    <Link
                      href="/employer/jobs/create"
                      className="p-2 rounded-lg hover:bg-[#F4F6F9] block transition-colors"
                    >
                      <p className="text-xs font-semibold text-[#0B1C2F]">Post a job</p>
                      <p className="text-[11px] text-[#5A6779]">Structured roles, live in minutes</p>
                    </Link>
                    <Link
                      href="/employer/pipeline"
                      className="p-2 rounded-lg hover:bg-[#F4F6F9] block transition-colors"
                    >
                      <p className="text-xs font-semibold text-[#0B1C2F]">Recruitment pipeline</p>
                      <p className="text-[11px] text-[#5A6779]">Shared team board</p>
                    </Link>
                    <Link
                      href="/employer/analytics"
                      className="p-2 rounded-lg hover:bg-[#F4F6F9] block transition-colors"
                    >
                      <p className="text-xs font-semibold text-[#0B1C2F]">Hiring analytics</p>
                      <p className="text-[11px] text-[#5A6779]">See where hiring slows</p>
                    </Link>
                    <div className="pt-2 border-t border-[#E2E7EE]">
                      <Link
                        href="/employer/profile"
                        className="text-xs font-semibold text-[#2552C2] hover:underline flex items-center justify-between p-1"
                      >
                        Employer verification →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/talent/coach"
                className="px-3 py-2 text-sm font-medium text-[#3D4A5C] hover:text-[#0B1C2F] rounded-md transition-colors"
              >
                AI career coach
              </Link>
              <Link
                href="/how-it-works"
                className="px-3 py-2 text-sm font-medium text-[#3D4A5C] hover:text-[#0B1C2F] rounded-md transition-colors"
              >
                How it works
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 text-sm font-medium text-[#3D4A5C] hover:text-[#0B1C2F] rounded-md transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          {/* Right Controls: Search, Lang, Auth / Workspace Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick search shortcut */}
            <Link
              href="/jobs"
              className="p-2 min-h-[44px] min-w-[44px] text-[#5A6779] hover:text-[#0B1C2F] rounded-lg hover:bg-[#E2E7EE]/50 transition-colors hidden sm:flex items-center justify-center"
              title="Search jobs"
              aria-label="Search jobs"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Language Selector EN | FR */}
            <div className="flex items-center text-xs font-bold border border-[#E2E7EE] rounded-lg overflow-hidden bg-white/90 shadow-sm">
              <button
                onClick={() => setLang('EN')}
                className={`min-h-[36px] px-2.5 py-1 transition-colors ${
                  lang === 'EN' ? 'bg-[#0B1C2F] text-white' : 'text-[#5A6779] hover:text-[#0B1C2F]'
                }`}
                aria-label="Switch language to English"
              >
                EN
              </button>
              <button
                onClick={() => setLang('FR')}
                className={`min-h-[36px] px-2.5 py-1 transition-colors ${
                  lang === 'FR' ? 'bg-[#0B1C2F] text-white' : 'text-[#5A6779] hover:text-[#0B1C2F]'
                }`}
                aria-label="Passer en français"
              >
                FR
              </button>
            </div>

            {/* Authenticated Workspace Switcher OR Sign In */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <WorkspaceSwitcher />
                <Link
                  href={
                    activeWorkspace === 'talent'
                      ? '/talent/dashboard'
                      : activeWorkspace === 'employer'
                      ? '/employer/dashboard'
                      : '/admin/overview'
                  }
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0B1C2F] text-white hover:bg-[#3D4A5C] transition-colors"
                >
                  Open {activeWorkspace.charAt(0).toUpperCase() + activeWorkspace.slice(1)} →
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/auth/sign-in"
                  className="px-3 py-2 text-sm font-semibold text-[#0B1C2F] hover:text-[#0B7F7A] transition-colors whitespace-nowrap min-h-[44px] flex items-center"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[#0B7F7A] text-white hover:bg-[#14A89E] shadow-sm transition-all duration-150 group whitespace-nowrap min-h-[44px]"
                >
                  Get started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button (Strict >= 44x44px hitbox) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#0B1C2F] hover:bg-[#E2E7EE]/60 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7F7A]"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Screen Dropdown Menu Sheet */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-[#E2E7EE] p-5 shadow-xl space-y-5 animate-in slide-in-from-top-3 duration-200">
            <div className="space-y-1">
              <Link
                href="/jobs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between min-h-[44px] px-3 py-2 rounded-lg text-base font-bold text-[#0B1C2F] hover:bg-[#F4F6F9] transition-colors"
              >
                <span>Find jobs</span>
                <span className="text-xs font-semibold text-[#0B7F7A]">Browse &rarr;</span>
              </Link>
              <Link
                href="/employer/jobs/create"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between min-h-[44px] px-3 py-2 rounded-lg text-base font-bold text-[#0B1C2F] hover:bg-[#F4F6F9] transition-colors"
              >
                <span>For employers</span>
                <span className="text-xs font-semibold text-[#2552C2]">Post a role</span>
              </Link>
              <Link
                href="/talent/coach"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between min-h-[44px] px-3 py-2 rounded-lg text-base font-bold text-[#0B1C2F] hover:bg-[#F4F6F9] transition-colors"
              >
                <span>Career coach</span>
                <span className="text-xs text-[#5A6779]">Grounded guidance</span>
              </Link>
              <Link
                href="/how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between min-h-[44px] px-3 py-2 rounded-lg text-base font-bold text-[#0B1C2F] hover:bg-[#F4F6F9] transition-colors"
              >
                <span>How matching works</span>
                <span className="text-xs text-[#5A6779]">Architecture</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between min-h-[44px] px-3 py-2 rounded-lg text-base font-bold text-[#0B1C2F] hover:bg-[#F4F6F9] transition-colors"
              >
                <span>About WorkDey</span>
                <span className="text-xs text-[#5A6779]">Mission</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-[#E2E7EE] flex flex-col gap-2.5">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/auth/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full min-h-[48px] flex items-center justify-center font-bold text-sm text-[#0B1C2F] border border-[#E2E7EE] bg-white rounded-xl hover:bg-[#F4F6F9] transition-colors"
                  >
                    Sign in to your account
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full min-h-[48px] flex items-center justify-center font-bold text-sm text-white bg-[#0B7F7A] rounded-xl hover:bg-[#14A89E] transition-colors shadow-sm"
                  >
                    Create free profile &rarr;
                  </Link>
                </>
              ) : (
                <Link
                  href={
                    activeWorkspace === 'talent'
                      ? '/talent/dashboard'
                      : activeWorkspace === 'employer'
                      ? '/employer/dashboard'
                      : '/admin/overview'
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full min-h-[48px] flex items-center justify-center font-bold text-sm text-white bg-[#0B1C2F] rounded-xl hover:bg-[#3D4A5C] transition-colors"
                >
                  Go to {activeWorkspace} workspace &rarr;
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
