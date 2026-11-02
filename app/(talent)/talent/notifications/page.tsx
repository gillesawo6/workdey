'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTalent } from '@/lib/talent/talent-context';
import {
  Bell,
  Check,
  Clock,
  Calendar,
  Sparkles,
  CheckCheck,
  Video,
  FileCheck2,
  Briefcase,
  Settings,
  Mail,
  Smartphone,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function TalentNotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useTalent();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showSettingsTab, setShowSettingsTab] = useState(false);

  // User notification preferences state
  const [prefEmailAlerts, setPrefEmailAlerts] = useState(true);
  const [prefSmsInterview, setPrefSmsInterview] = useState(true);
  const [prefDigestFrequency, setPrefDigestFrequency] = useState('daily');
  const [prefSalaryAlerts, setPrefSalaryAlerts] = useState(true);

  const filteredNotifications = notifications.filter((n) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'unread') return !n.is_read;
    return n.category === activeCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'interview':
        return <Video className="w-4 h-4 text-[#2552C2]" />;
      case 'match':
        return <Sparkles className="w-4 h-4 text-[#0B7F7A]" />;
      case 'application':
        return <FileCheck2 className="w-4 h-4 text-[#1A7F4B]" />;
      case 'coach':
        return <Sparkles className="w-4 h-4 text-[#E8A317]" />;
      default:
        return <Bell className="w-4 h-4 text-[#5A6779]" />;
    }
  };

  const handleSavePreferences = () => {
    alert('Notification preferences saved successfully!');
    setShowSettingsTab(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#5A6779] block">
            {unreadNotificationsCount} unread alert{unreadNotificationsCount === 1 ? '' : 's'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C2F] font-display">
            Notifications &amp; Activity
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettingsTab(!showSettingsTab)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showSettingsTab
                ? 'bg-[#0B7F7A] text-white border-[#0B7F7A]'
                : 'border-[#E2E7EE] bg-white text-[#0B1C2F] hover:bg-[#F4F6F9]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{showSettingsTab ? 'View Alerts' : 'Preferences'}</span>
          </button>

          {unreadNotificationsCount > 0 && !showSettingsTab && (
            <button
              onClick={markAllNotificationsAsRead}
              className="px-3 py-1.5 rounded-lg border border-[#E2E7EE] bg-white text-xs font-semibold text-[#0B7F7A] hover:bg-[#E6F5F3] flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      {showSettingsTab ? (
        /* Notification Preferences Panel */
        <div className="bg-white rounded-xl border border-[#E2E7EE] p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#0B1C2F]">Notification Channels &amp; Delivery</h2>
            <p className="text-xs text-[#5A6779] mt-0.5">
              Choose how and when WorkDey notifies you of interviews, stage updates, and high-match vacancies in Cameroon.
            </p>
          </div>

          <div className="space-y-4 text-xs divide-y divide-[#F4F6F9]">
            <div className="flex items-start justify-between pt-3 first:pt-0">
              <div className="space-y-0.5 max-w-md">
                <span className="font-bold text-[#0B1C2F] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0B7F7A]" /> Email Job Alerts &amp; Digest
                </span>
                <p className="text-[#5A6779]">
                  Receive notifications when roles matching &ge;85% of your skills open in Douala or Remote.
                </p>
              </div>
              <input
                type="checkbox"
                checked={prefEmailAlerts}
                onChange={(e) => setPrefEmailAlerts(e.target.checked)}
                className="mt-1 rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
              />
            </div>

            <div className="flex items-start justify-between pt-3">
              <div className="space-y-0.5 max-w-md">
                <span className="font-bold text-[#0B1C2F] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#0B7F7A]" /> Urgent Interview SMS / WhatsApp
                </span>
                <p className="text-[#5A6779]">
                  Send instant SMS reminder 2 hours prior to scheduled interviews to ensure no missed appointments.
                </p>
              </div>
              <input
                type="checkbox"
                checked={prefSmsInterview}
                onChange={(e) => setPrefSmsInterview(e.target.checked)}
                className="mt-1 rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
              />
            </div>

            <div className="flex items-start justify-between pt-3">
              <div className="space-y-0.5 max-w-md">
                <span className="font-bold text-[#0B1C2F]">Salary Transparent Alerts</span>
                <p className="text-[#5A6779]">
                  Only alert me for roles whose verified salary range meets or exceeds my minimum XAF requirement.
                </p>
              </div>
              <input
                type="checkbox"
                checked={prefSalaryAlerts}
                onChange={(e) => setPrefSalaryAlerts(e.target.checked)}
                className="mt-1 rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
              />
            </div>

            <div className="pt-3 space-y-1.5">
              <label className="font-bold text-[#0B1C2F] block">Email Summary Frequency</label>
              <select
                value={prefDigestFrequency}
                onChange={(e) => setPrefDigestFrequency(e.target.value)}
                className="p-2 rounded-lg border border-[#E2E7EE] text-xs text-[#0B1C2F] outline-none"
              >
                <option value="instant">Instant as events occur</option>
                <option value="daily">Daily morning digest (08:00 WAT)</option>
                <option value="weekly">Weekly Friday recap</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E7EE] flex justify-end gap-2">
            <button
              onClick={() => setShowSettingsTab(false)}
              className="px-4 py-2 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#5A6779] hover:bg-[#F4F6F9]"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePreferences}
              className="px-5 py-2 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] shadow-sm cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      ) : (
        /* Notifications Feed */
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { id: 'all', label: 'All Alerts' },
              { id: 'unread', label: `Unread (${unreadNotificationsCount})` },
              { id: 'interview', label: 'Interviews' },
              { id: 'application', label: 'Applications' },
              { id: 'match', label: 'Job Matches' },
              { id: 'coach', label: 'Coach Tips' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#0B7F7A] text-white shadow-sm'
                    : 'bg-white border border-[#E2E7EE] text-[#5A6779] hover:bg-[#F4F6F9]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E2E7EE] p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F4F6F9] text-[#5A6779] flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B1C2F]">No notifications in this view</h3>
              <p className="text-xs text-[#5A6779]">
                You&apos;re completely up to date. Application status changes and interview notices will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E2E7EE] shadow-sm divide-y divide-[#E2E7EE] overflow-hidden">
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer hover:bg-[#F4F6F9]/60 ${
                    !n.is_read ? 'bg-[#E6F5F3]/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[#F4F6F9] border border-[#E2E7EE] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getCategoryIcon(n.category)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-xs ${!n.is_read ? 'font-bold text-[#0B1C2F]' : 'font-medium text-[#3D4A5C]'}`}>
                          {n.title}
                        </p>
                        {!n.is_read && (
                          <span className="w-2 h-2 rounded-full bg-[#0B7F7A] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#5A6779] leading-relaxed">{n.body}</p>
                      {n.action_url && (
                        <Link
                          href={n.action_url}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B7F7A] hover:underline pt-1"
                        >
                          View in platform <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] text-[#5A6779] flex-shrink-0 tnum">
                    {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
