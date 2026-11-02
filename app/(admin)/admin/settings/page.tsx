'use client';

import React, { useState } from 'react';
import {
  Settings,
  Check,
  Lock,
  Shield,
  Layers,
  MapPin,
  Tag,
  Bell,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  CreditCard,
  Building,
} from 'lucide-react';
import { useAdmin } from '@/lib/admin/admin-context';

export default function AdminSettingsPage() {
  const {
    settings,
    updateSettings,
    categories,
    addCategory,
    toggleCategory,
    skills,
    addSkill,
    locations,
    addLocation,
    announcements,
    addAnnouncement,
    toggleAnnouncement,
    deleteAnnouncement,
    subscriptionPlans,
    updatePlanPrice,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'system' | 'taxonomy' | 'locations' | 'announcements' | 'pricing'>('system');
  const [savedAlert, setSavedAlert] = useState<string | null>(null);

  // Form states for adding items
  const [newCatName, setNewCatName] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState(categories[0]?.name || 'Data & Analytics');
  const [newRegionName, setNewRegionName] = useState('');
  const [newRegionCities, setNewRegionCities] = useState('');

  // Form state for announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annTarget, setAnnTarget] = useState<'all' | 'talent' | 'employer'>('all');
  const [annPriority, setAnnPriority] = useState<'info' | 'warning' | 'urgent'>('info');

  const notify = (msg: string) => {
    setSavedAlert(msg);
    setTimeout(() => setSavedAlert(null), 3500);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const res = addCategory(newCatName.trim());
    if (res.success) {
      notify(`Job category "${newCatName}" added.`);
      setNewCatName('');
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const res = addSkill(newSkillName.trim(), newSkillCategory);
    if (res.success) {
      notify(`Skill "${newSkillName}" added to ${newSkillCategory}.`);
      setNewSkillName('');
    }
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegionName.trim() || !newRegionCities.trim()) return;
    const citiesList = newRegionCities.split(',').map((c) => c.trim());
    const res = addLocation(newRegionName.trim(), citiesList);
    if (res.success) {
      notify(`Region "${newRegionName}" added with ${citiesList.length} cities.`);
      setNewRegionName('');
      setNewRegionCities('');
    }
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;
    addAnnouncement({
      title: annTitle.trim(),
      message: annMessage.trim(),
      target: annTarget,
      priority: annPriority,
      is_active: true,
    });
    notify('Platform announcement published.');
    setAnnTitle('');
    setAnnMessage('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs text-[#E7ECF3]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#A0AEC0] block">GOVERNANCE · PLATFORM CONFIGURATION</span>
          <h1 className="text-2xl font-bold text-white font-display">Platform settings & taxonomy</h1>
          <p className="text-[#A0AEC0] mt-0.5">Configuration updates are logged directly to the immutable audit trail</p>
        </div>
      </div>

      {savedAlert && (
        <div className="p-3.5 rounded-lg bg-[#1A7F4B]/20 border border-[#1A7F4B]/40 text-[#1A7F4B] font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" /> {savedAlert}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#223247] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('system')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
            activeTab === 'system' ? 'bg-[#E8A317] text-[#0B1C2F]' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          System & Safety
        </button>
        <button
          onClick={() => setActiveTab('taxonomy')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
            activeTab === 'taxonomy' ? 'bg-[#E8A317] text-[#0B1C2F]' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Categories & Skills ({categories.length} / {skills.length})
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
            activeTab === 'locations' ? 'bg-[#E8A317] text-[#0B1C2F]' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Cameroon Locations ({locations.length})
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
            activeTab === 'announcements' ? 'bg-[#E8A317] text-[#0B1C2F]' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Announcements ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
            activeTab === 'pricing' ? 'bg-[#E8A317] text-[#0B1C2F]' : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          Subscription Pricing
        </button>
      </div>

      {/* TAB 1: System & Safety */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="admin-panel p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-white text-sm">General Platform Standards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#A0AEC0] mb-1">Platform Brand</label>
                <input
                  type="text"
                  value="WorkDey"
                  disabled
                  className="w-full px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-[#A0AEC0] mb-1">Official Languages</label>
                <input
                  type="text"
                  value="English & French (Bilingual)"
                  disabled
                  className="w-full px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-[#A0AEC0] mb-1">Currency Standard</label>
                <input
                  type="text"
                  value="XAF (Central African CFA Franc)"
                  disabled
                  className="w-full px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          <div className="admin-panel p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-white text-sm">Access, Safety & Anti-Scam Controls</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg bg-[#111D2C] border border-[#223247]">
                <div>
                  <p className="font-bold text-white">Require employer verification before publishing roles</p>
                  <p className="text-[11px] text-[#A0AEC0]">
                    Prevents unverified organisations from publishing live listings until reviewed by administrators.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.require_verification}
                  onChange={(e) => updateSettings({ require_verification: e.target.checked })}
                  className="rounded text-[#E8A317] focus:ring-[#E8A317] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg bg-[#111D2C] border border-[#223247]">
                <div>
                  <p className="font-bold text-white">Allow remote roles from international organisations</p>
                  <p className="text-[11px] text-[#A0AEC0]">
                    Allows verified employers outside Cameroon to recruit Cameroonian professionals.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allow_remote_international}
                  onChange={(e) => updateSettings({ allow_remote_international: e.target.checked })}
                  className="rounded text-[#E8A317] focus:ring-[#E8A317] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg bg-[#111D2C] border border-[#223247]">
                <div>
                  <p className="font-bold text-white">Privacy Threshold: Hide salary below 10 applicants in analytics</p>
                  <p className="text-[11px] text-[#A0AEC0]">
                    Protects individual wage privacy across Cameroon salary benchmark aggregations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.hide_salary_threshold}
                  onChange={(e) => updateSettings({ hide_salary_threshold: e.target.checked })}
                  className="rounded text-[#E8A317] focus:ring-[#E8A317] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg bg-[#111D2C] border border-[#223247]">
                <div>
                  <p className="font-bold text-white">Maintenance mode</p>
                  <p className="text-[11px] text-[#A0AEC0]">
                    Displays maintenance banner across public portals and pauses new applications.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(e) => updateSettings({ maintenance_mode: e.target.checked })}
                  className="rounded text-[#E8A317] focus:ring-[#E8A317] w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Categories & Skills Taxonomy */}
      {activeTab === 'taxonomy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Categories */}
          <div className="lg:col-span-6 admin-panel p-5 rounded-xl space-y-4">
            <h3 className="font-bold text-white text-sm">Job Categories ({categories.length})</h3>

            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New category (e.g. Legal & Compliance)"
                className="flex-1 px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none focus:border-[#E8A317]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-lg bg-[#E8A317] text-[#0B1C2F] font-bold hover:bg-[#d69514]"
              >
                + Add
              </button>
            </form>

            <div className="divide-y divide-[#223247] max-h-96 overflow-y-auto">
              {categories.map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className={`font-semibold ${c.is_active ? 'text-white' : 'text-[#5A6779] line-through'}`}>
                      {c.name}
                    </p>
                    <p className="text-[10px] text-[#A0AEC0]">{c.jobs_count} jobs active</p>
                  </div>
                  <button
                    onClick={() => toggleCategory(c.id)}
                    className="text-xs font-bold text-[#E8A317] hover:underline"
                  >
                    {c.is_active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Taxonomy */}
          <div className="lg:col-span-6 admin-panel p-5 rounded-xl space-y-4">
            <h3 className="font-bold text-white text-sm">Skills Taxonomy ({skills.length})</h3>

            <form onSubmit={handleAddSkill} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="New skill (e.g. Flutter, Kubernetes)"
                  className="flex-1 px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none focus:border-[#E8A317]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-[#E8A317] text-[#0B1C2F] font-bold hover:bg-[#d69514]"
                >
                  + Add
                </button>
              </div>
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#111D2C] border border-[#223247] rounded-lg text-[#A0AEC0] outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    Category: {c.name}
                  </option>
                ))}
              </select>
            </form>

            <div className="flex flex-wrap gap-1.5 max-h-96 overflow-y-auto pt-2">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="px-2.5 py-1 rounded bg-[#111D2C] text-[#E7ECF3] border border-[#223247] text-xs flex items-center gap-1.5"
                >
                  <span>{s.name}</span>
                  <span className="text-[10px] text-[#A0AEC0] font-mono">({s.usage_count})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Locations */}
      {activeTab === 'locations' && (
        <div className="space-y-6">
          <div className="admin-panel p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-white text-sm">Add Cameroonian Region or Market Zone</h3>
            <form onSubmit={handleAddLocation} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  required
                  value={newRegionName}
                  onChange={(e) => setNewRegionName(e.target.value)}
                  placeholder="Region name (e.g. South)"
                  className="w-full px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none focus:border-[#E8A317]"
                />
              </div>
              <div className="sm:col-span-6">
                <input
                  type="text"
                  required
                  value={newRegionCities}
                  onChange={(e) => setNewRegionCities(e.target.value)}
                  placeholder="Cities separated by comma (e.g. Kribi, Ebolowa)"
                  className="w-full px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none focus:border-[#E8A317]"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#E8A317] text-[#0B1C2F] font-bold rounded-lg hover:bg-[#d69514]"
                >
                  + Add Region
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((loc) => (
              <div key={loc.code} className="admin-panel p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">{loc.name}</h4>
                  <span className="font-mono text-[10px] text-[#E8A317]">{loc.code}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {loc.cities.map((city) => (
                    <span
                      key={city}
                      className="px-2 py-0.5 rounded bg-[#111D2C] text-[#A0AEC0] border border-[#223247] text-[10px]"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Platform Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="admin-panel p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-white text-sm">Broadcast System Announcement</h3>
            <form onSubmit={handleAddAnnouncement} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[#A0AEC0] mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Scheduled System Maintenance / Career Fair Notice"
                    className="w-full px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none focus:border-[#E8A317]"
                  />
                </div>
                <div>
                  <label className="block text-[#A0AEC0] mb-1">Target Audience</label>
                  <select
                    value={annTarget}
                    onChange={(e) => setAnnTarget(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none"
                  >
                    <option value="all">All Users (Talents & Employers)</option>
                    <option value="talent">Talents Only</option>
                    <option value="employer">Employers Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#A0AEC0] mb-1">Message Body</label>
                <textarea
                  required
                  rows={2}
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  placeholder="Details of the announcement..."
                  className="w-full px-3 py-2 bg-[#111D2C] border border-[#223247] rounded-lg text-white outline-none focus:border-[#E8A317]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E8A317] text-[#0B1C2F] font-bold rounded-lg hover:bg-[#d69514]"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="admin-panel p-4 rounded-xl flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ann.priority === 'urgent'
                          ? 'bg-[#B42318]/20 text-[#B42318]'
                          : ann.priority === 'warning'
                          ? 'bg-[#E8A317]/20 text-[#E8A317]'
                          : 'bg-[#14A89E]/20 text-[#14A89E]'
                      }`}
                    >
                      {ann.target.toUpperCase()}
                    </span>
                    <h4 className="font-bold text-white">{ann.title}</h4>
                  </div>
                  <p className="text-[#A0AEC0]">{ann.message}</p>
                  <p className="text-[10px] text-[#5A6779]">
                    Published by {ann.created_by} on {new Date(ann.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAnnouncement(ann.id)}
                    className="px-3 py-1 rounded border border-[#223247] text-xs font-semibold text-[#A0AEC0] hover:text-white"
                  >
                    {ann.is_active ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-1.5 text-[#5A6779] hover:text-[#B42318]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Subscription Pricing */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`admin-panel p-6 rounded-xl space-y-4 text-xs relative ${
                  plan.is_popular ? 'border-[#E8A317] ring-1 ring-[#E8A317]/40' : ''
                }`}
              >
                {plan.is_popular && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8A317] text-[#0B1C2F]">
                    POPULAR
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-base text-white">{plan.name}</h3>
                  <p className="text-xl font-black text-white mt-1 font-display font-mono">
                    {plan.price_display}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-[#223247]">
                  <p className="text-[#A0AEC0]">Active Roles: <strong>{plan.roles_limit}</strong></p>
                  <p className="text-[#A0AEC0]">Team Seats: <strong>{plan.seats_limit}</strong></p>
                </div>

                <ul className="space-y-1.5 text-[#A0AEC0] pt-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#1A7F4B] mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {plan.price_xaf > 0 && (
                  <div className="pt-2">
                    <label className="block text-[10px] text-[#A0AEC0] mb-1">Adjust XAF Price</label>
                    <input
                      type="number"
                      defaultValue={plan.price_xaf}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (val > 0) {
                          updatePlanPrice(plan.id, val);
                          notify(`Updated ${plan.name} price to ${val.toLocaleString()} XAF.`);
                        }
                      }}
                      className="w-full px-3 py-1.5 bg-[#111D2C] border border-[#223247] rounded-lg text-white font-mono"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
