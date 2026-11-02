'use client';

import React, { useState } from 'react';
import { Layers, Shield, Check, CreditCard } from 'lucide-react';

export default function EmployerSettingsPage() {
  const [hiringAlerts, setHiringAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <span className="text-xs text-[#5A6779] block">Savanna Agritech</span>
        <h1 className="text-2xl font-bold text-[#0B1C2F] font-display">Organisation Settings</h1>
      </div>

      {/* Subscription Plan (PDF Page 42) */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#0B1C2F]">Subscription Plan</h3>
            <p className="text-[#5A6779] mt-0.5">Growth Tier · 5 team seats · Unlimited active roles</p>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#EAF0FC] text-[#2552C2] font-bold text-xs">
            Active
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#F4F6F9] border border-[#E2E7EE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-[#2552C2]" />
            <div>
              <p className="font-bold text-[#0B1C2F]">Billing in XAF</p>
              <p className="text-[11px] text-[#5A6779]">Renews automatically on 15 Nov 2026</p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] bg-white font-semibold text-[#0B1C2F] hover:bg-[#F4F6F9]">
            Change plan
          </button>
        </div>
      </div>

      {/* Hiring Alerts */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-sm text-[#0B1C2F]">Recruitment Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[#3D4A5C]">Instant alert on new 85%+ matched candidates</span>
            <input
              type="checkbox"
              checked={hiringAlerts}
              onChange={(e) => setHiringAlerts(e.target.checked)}
              className="rounded text-[#2552C2] focus:ring-[#2552C2]"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[#3D4A5C]">Daily applicant summary digest</span>
            <input
              type="checkbox"
              checked={dailyDigest}
              onChange={(e) => setDailyDigest(e.target.checked)}
              className="rounded text-[#2552C2] focus:ring-[#2552C2]"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
