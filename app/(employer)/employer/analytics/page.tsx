'use client';

import React from 'react';
import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';

export default function EmployerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#5A6779] block">Last 90 days · all roles</span>
          <h1 className="text-2xl font-bold text-[#0B1C2F] font-display">Hiring analytics</h1>
        </div>

        <button className="px-3.5 py-1.5 rounded-lg border border-[#E2E7EE] bg-white text-xs font-semibold text-[#0B1C2F] hover:bg-[#F4F6F9] flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Export analytics
        </button>
      </div>

      {/* 4 Stat Cards (PDF Page 40) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E2E7EE] shadow-sm">
          <p className="text-xs text-[#5A6779]">Active roles</p>
          <p className="text-3xl font-black text-[#0B1C2F] mt-1 tnum">7</p>
          <p className="text-[11px] text-[#5A6779] mt-1">2 closing this month</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E7EE] shadow-sm">
          <p className="text-xs text-[#5A6779]">Applicants</p>
          <p className="text-3xl font-black text-[#0B1C2F] mt-1 tnum">248</p>
          <p className="text-[11px] text-[#1A7F4B] font-semibold mt-1">+18% vs previous 90 days</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E7EE] shadow-sm">
          <p className="text-xs text-[#5A6779]">Median time to hire</p>
          <p className="text-3xl font-black text-[#0B1C2F] mt-1 tnum">23 days</p>
          <p className="text-[11px] text-[#5A6779] mt-1">Cameroon tech benchmark: 31d</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E7EE] shadow-sm">
          <p className="text-xs text-[#5A6779]">Offer acceptance</p>
          <p className="text-3xl font-black text-[#0B1C2F] mt-1 tnum">68%</p>
          <p className="text-[11px] text-[#2552C2] font-semibold mt-1">15 of 22 offers accepted</p>
        </div>
      </div>

      {/* Funnel & Candidate Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Hiring Funnel */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#0B1C2F] uppercase tracking-wider text-xs">
              Hiring Funnel
            </h3>
            <span className="text-[10px] text-[#5A6779]">Sample data</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { stage: 'Applied', count: 248, width: '100%', color: 'bg-[#2552C2]' },
              { stage: 'Screened', count: 159, width: '64%', color: 'bg-[#2552C2]/80' },
              { stage: 'Interviewed', count: 77, width: '31%', color: 'bg-[#0B7F7A]' },
              { stage: 'Offered', count: 22, width: '9%', color: 'bg-[#E8A317]' },
              { stage: 'Hired', count: 15, width: '6%', color: 'bg-[#1A7F4B]' },
            ].map((s) => (
              <div key={s.stage} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#0B1C2F]">{s.stage}</span>
                  <span className="text-[#0B1C2F] font-bold tnum">{s.count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E2E7EE] overflow-hidden">
                  <div style={{ width: s.width }} className={`h-full rounded-full ${s.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Where candidates come from */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-[#0B1C2F] uppercase tracking-wider text-xs">
            Where candidates come from
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { source: 'WorkDey AI matching', pct: 46, color: 'bg-[#0B7F7A]' },
              { source: 'Direct platform search', pct: 27, color: 'bg-[#2552C2]' },
              { source: 'Employee referrals', pct: 17, color: 'bg-[#E8A317]' },
              { source: 'External shared links', pct: 10, color: 'bg-[#5A6779]' },
            ].map((src) => (
              <div key={src.source} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#3D4A5C]">{src.source}</span>
                  <span className="text-[#0B1C2F] font-bold tnum">{src.pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E2E7EE] overflow-hidden">
                  <div style={{ width: `${src.pct}%` }} className={`h-full rounded-full ${src.color}`} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#5A6779] pt-2 border-t border-[#E2E7EE]">
            Shares add up to 100%. Matches represent candidates where AI scoring exceeded 80%.
          </p>
        </div>
      </div>
    </div>
  );
}
