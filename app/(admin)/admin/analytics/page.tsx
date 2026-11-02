'use client';

import React from 'react';
import { BarChart3, Download } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const regions = [
    { name: 'Littoral (Douala)', pct: 38 },
    { name: 'Centre (Yaoundé)', pct: 31 },
    { name: 'South-West (Buea, Limbe)', pct: 12 },
    { name: 'North-West (Bamenda)', pct: 8 },
    { name: 'West (Bafoussam)', pct: 6 },
    { name: 'Other regions', pct: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#A0AEC0] block">PLATFORM · PRODUCTION</span>
          <h1 className="text-2xl font-bold text-white font-display">Platform analytics</h1>
        </div>

        <button className="px-3.5 py-1.5 rounded-lg border border-[#223247] text-xs font-semibold text-[#A0AEC0] hover:text-white flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* 4 Stat Cards (PDF Page 41) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-panel p-5 rounded-xl">
          <p className="text-xs text-[#A0AEC0]">Registered talent</p>
          <p className="text-3xl font-black text-white mt-1 tnum">12,480</p>
          <p className="text-[11px] text-[#A0AEC0] mt-1">Across 10 regions</p>
        </div>

        <div className="admin-panel p-5 rounded-xl">
          <p className="text-xs text-[#A0AEC0]">Verified employers</p>
          <p className="text-3xl font-black text-[#14A89E] mt-1 tnum">318</p>
          <p className="text-[11px] text-[#A0AEC0] mt-1">Reviewed by admins</p>
        </div>

        <div className="admin-panel p-5 rounded-xl">
          <p className="text-xs text-[#A0AEC0]">Applications / month</p>
          <p className="text-3xl font-black text-white mt-1 tnum">4,120</p>
          <p className="text-[11px] text-[#A0AEC0] mt-1">Per month average</p>
        </div>

        <div className="admin-panel p-5 rounded-xl">
          <p className="text-xs text-[#A0AEC0]">Match acceptance</p>
          <p className="text-3xl font-black text-[#E8A317] mt-1 tnum">76%</p>
          <p className="text-[11px] text-[#A0AEC0] mt-1">Applications from matches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sign-ups Growth Bar Chart */}
        <div className="lg:col-span-7 admin-panel p-6 rounded-xl space-y-4 text-xs text-[#E7ECF3]">
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">
            New sign-ups per month
          </h3>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-4 pb-2 border-b border-[#223247]">
            {[
              { month: 'May', height: '35%' },
              { month: 'Jun', height: '48%' },
              { month: 'Jul', height: '58%' },
              { month: 'Aug', height: '70%' },
              { month: 'Sep', height: '82%' },
              { month: 'Oct', height: '96%', active: true },
            ].map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-[#111D2C] rounded-t-sm h-32 flex items-end overflow-hidden">
                  <div
                    style={{ height: m.height }}
                    className={`w-full rounded-t-sm ${m.active ? 'bg-[#E8A317]' : 'bg-[#E8A317]/60'}`}
                  />
                </div>
                <span className="text-[11px] text-[#A0AEC0]">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Talent By Region (PDF Page 41) */}
        <div className="lg:col-span-5 admin-panel p-6 rounded-xl space-y-4 text-xs text-[#E7ECF3]">
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">
            Talent by region
          </h3>

          <div className="space-y-3 pt-1">
            {regions.map((reg) => (
              <div key={reg.name} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#A0AEC0]">{reg.name}</span>
                  <span className="text-white font-bold tnum">{reg.pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#111D2C] overflow-hidden">
                  <div style={{ width: `${reg.pct}%` }} className="h-full rounded-full bg-[#14A89E]" />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#A0AEC0] pt-2 border-t border-[#223247]">
            Region follows the profile location field and is never shown below 10 people to protect privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
