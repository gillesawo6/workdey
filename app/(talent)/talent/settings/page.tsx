'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useTalent } from '@/lib/talent/talent-context';
import { Shield, Bell, Globe, Trash2, Check, RotateCcw } from 'lucide-react';

export default function TalentSettingsPage() {
  const { user } = useAuth();
  const { profile, updateProfile, resetTalentData } = useTalent();

  const [matchAlerts, setMatchAlerts] = useState(true);
  const [statusAlerts, setStatusAlerts] = useState(true);
  const [digest, setDigest] = useState(false);
  const [smsReminders, setSmsReminders] = useState(true);
  const [visibleToEmployers, setVisibleToEmployers] = useState(profile.share_cv_with_employers);
  const [hideEmployer, setHideEmployer] = useState(profile.hide_current_employer);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({
      share_cv_with_employers: visibleToEmployers,
      hide_current_employer: hideEmployer,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Reset talent workspace demo data to initial sample values?')) {
      resetTalentData();
      alert('Workspace reset to initial seed state.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C2F] font-display">Settings</h1>
          <p className="text-xs text-[#5A6779] mt-0.5">Manage your account preferences, alerts and privacy</p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] bg-white text-xs font-semibold text-[#5A6779] hover:text-[#0B1C2F] hover:bg-[#F4F6F9] flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Reset demo data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-[#E6F5F3] border border-[#0B7F7A]/20 text-[#0B7F7A] text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" /> Preferences saved successfully.
        </div>
      )}

      {/* Account */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4 text-xs">
        <h2 className="font-bold text-sm text-[#0B1C2F]">Account &amp; Region</h2>
        <div>
          <label className="block text-[#5A6779] mb-1 font-semibold">Registered Email</label>
          <input
            type="email"
            value={profile.email || user?.email || 'aicha@example.com'}
            disabled
            className="w-full px-3 py-2 bg-[#F4F6F9] border border-[#E2E7EE] rounded-lg text-[#0B1C2F]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#5A6779] mb-1 font-semibold">Language</label>
            <select
              aria-label="Select interface language"
              className="w-full px-3 py-2 bg-white border border-[#E2E7EE] rounded-lg text-[#0B1C2F] outline-none"
            >
              <option>English (Cameroon)</option>
              <option>Français (Cameroun)</option>
            </select>
          </div>
          <div>
            <label className="block text-[#5A6779] mb-1 font-semibold">Primary Currency</label>
            <select
              aria-label="Select default salary currency"
              className="w-full px-3 py-2 bg-white border border-[#E2E7EE] rounded-lg text-[#0B1C2F] outline-none"
            >
              <option>XAF (FCFA)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4 text-xs">
        <h2 className="font-bold text-sm text-[#0B1C2F]">Notification Channels</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[#3D4A5C]">New job matches above 80%</span>
            <input
              type="checkbox"
              checked={matchAlerts}
              onChange={(e) => setMatchAlerts(e.target.checked)}
              className="rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[#3D4A5C]">Application status updates</span>
            <input
              type="checkbox"
              checked={statusAlerts}
              onChange={(e) => setStatusAlerts(e.target.checked)}
              className="rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[#3D4A5C]">Weekly career digest by email</span>
            <input
              type="checkbox"
              checked={digest}
              onChange={(e) => setDigest(e.target.checked)}
              className="rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[#3D4A5C]">SMS &amp; WhatsApp reminders for interviews</span>
            <input
              type="checkbox"
              checked={smsReminders}
              onChange={(e) => setSmsReminders(e.target.checked)}
              className="rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
            />
          </label>
        </div>
      </div>

      {/* Privacy (PDF Page 18) */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4 text-xs">
        <h2 className="font-bold text-sm text-[#0B1C2F]">Privacy &amp; Visibility</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[#3D4A5C]">Profile visible to verified employers</span>
            <input
              type="checkbox"
              checked={visibleToEmployers}
              onChange={(e) => setVisibleToEmployers(e.target.checked)}
              className="rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[#3D4A5C]">Hide profile from current employer (Cacao Route SARL)</span>
            <input
              type="checkbox"
              checked={hideEmployer}
              onChange={(e) => setHideEmployer(e.target.checked)}
              className="rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
            />
          </label>
        </div>

        <div className="pt-4 border-t border-[#E2E7EE] flex justify-between items-center">
          <button
            onClick={() => alert('Account deletion request submitted to WorkDey Compliance.')}
            className="text-xs font-semibold text-[#D14343] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete account and data
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#0B7F7A] text-white font-bold rounded-lg hover:bg-[#14A89E] transition-colors shadow-sm cursor-pointer"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
