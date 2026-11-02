'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Briefcase, User, Sparkles, Building2, ArrowRight } from 'lucide-react';
import { SEED_JOBS, SEED_ORGANIZATIONS } from '@/lib/data/seed-data';

export function CommandMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('workdey:open-search', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('workdey:open-search', handleCustomOpen);
    };
  }, []);

  if (!isOpen) return null;

  const filteredJobs = SEED_JOBS.filter(
    (j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.city.toLowerCase().includes(query.toLowerCase()) ||
      j.required_skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredOrgs = SEED_ORGANIZATIONS.filter(
    (o) =>
      o.name.toLowerCase().includes(query.toLowerCase()) ||
      o.sector?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B1C2F]/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-[#E2E7EE] overflow-hidden z-10 animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-[#E2E7EE]">
          <Search className="w-4 h-4 text-[#5A6779] mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, candidates, companies... (or type city: Douala)"
            className="w-full py-3.5 text-sm bg-transparent outline-none text-[#0B1C2F] placeholder-[#5A6779]"
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded text-[#5A6779] hover:text-[#0B1C2F]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Candidates / Quick jump */}
          <div>
            <p className="px-2 py-1 text-[10px] font-bold text-[#5A6779] uppercase tracking-wider">
              Quick Jumps
            </p>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/talent/coach');
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-[#F4F6F9] text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0B7F7A]" />
                <span className="font-semibold text-[#0B1C2F]">AI Career Coach</span>
                <span className="text-[11px] text-[#5A6779]">· Interview simulation & guidance</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#5A6779]" />
            </button>
          </div>

          {/* Jobs */}
          {filteredJobs.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-bold text-[#5A6779] uppercase tracking-wider">
                Matching Roles
              </p>
              {filteredJobs.slice(0, 3).map((job) => (
                <button
                  key={job.id}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/jobs`);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-[#F4F6F9] text-left transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#2552C2]" />
                    <span className="font-semibold text-[#0B1C2F] group-hover:text-[#2552C2]">
                      {job.title}
                    </span>
                    <span className="text-[11px] text-[#5A6779]">
                      · {job.city} · {job.salary_min_xaf.toLocaleString()} XAF
                    </span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EAF0FC] text-[#2552C2] font-semibold">
                    {job.work_style}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Companies */}
          {filteredOrgs.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-bold text-[#5A6779] uppercase tracking-wider">
                Verified Organisations
              </p>
              {filteredOrgs.slice(0, 2).map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/companies/${org.id}`);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-[#F4F6F9] text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0B7F7A]" />
                    <span className="font-semibold text-[#0B1C2F]">{org.name}</span>
                    <span className="text-[11px] text-[#5A6779]">· {org.sector} ({org.city})</span>
                  </div>
                  {org.verification_status === 'verified' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E6F5F3] text-[#0B7F7A] font-semibold">
                      Verified
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-[#E2E7EE] bg-[#F4F6F9] flex items-center justify-between text-[11px] text-[#5A6779]">
          <span>Tip: Press <kbd className="font-mono">ESC</kbd> to close</span>
          <span>Tabular search across Cameroon</span>
        </div>
      </div>
    </div>
  );
}
