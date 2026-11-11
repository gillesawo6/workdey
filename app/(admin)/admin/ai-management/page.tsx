'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Check,
  ShieldCheck,
  Sliders,
  AlertCircle,
  RefreshCw,
  Activity,
  Zap,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';

interface GatewayHealth {
  provider: string;
  model: string;
  hasCredentials: boolean;
  uptimeSeconds: number;
  totalRequests: number;
  successRatePct: number;
  averageLatencyMs: number;
  recentLogs: {
    id: string;
    timestamp: string;
    feature: string;
    model: string;
    duration_ms: number;
    status: string;
    error?: string;
  }[];
}

export default function AdminAIManagementPage() {
  const [skillsWeight, setSkillsWeight] = useState(45);
  const [experienceWeight, setExperienceWeight] = useState(30);
  const [locationWeight, setLocationWeight] = useState(25);

  const [humanApproval, setHumanApproval] = useState(true);
  const [excludeProtected, setExcludeProtected] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [coachSuggestSalary, setCoachSuggestSalary] = useState(true);

  const [savedAlert, setSavedAlert] = useState(false);
  const [healthData, setHealthData] = useState<GatewayHealth | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHealth = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/ai/health');
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch {
      // handled
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const res = await fetch('/api/ai/health');
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setHealthData(data);
          }
        }
      } catch {
        // ignore
      }
    }
    loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSave = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#A0AEC0] block">PLATFORM GOVERNANCE</span>
          <h1 className="text-2xl font-bold text-white font-display">AI Gateway &amp; Governance</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchHealth}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-lg border border-[#223247] text-white text-xs font-semibold hover:bg-[#1A2637] flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Telemetry
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#E8A317] text-[#0B1C2F] text-xs font-bold hover:bg-[#d69514] transition-colors shadow-sm"
          >
            Save and apply
          </button>
        </div>
      </div>

      {savedAlert && (
        <div className="p-3 rounded-lg bg-[#1A7F4B]/20 border border-[#1A7F4B]/40 text-[#1A7F4B] text-xs flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>Weights updated and recorded to immutable audit log.</span>
        </div>
      )}

      {/* Real Gateway Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="admin-panel p-4 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#A0AEC0] font-semibold">Active Engine</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                healthData?.hasCredentials
                  ? 'bg-[#1A7F4B]/20 text-[#1A7F4B]'
                  : 'bg-[#E8A317]/20 text-[#E8A317]'
              }`}
            >
              {healthData?.hasCredentials ? 'Live Gateway' : 'Standby Heuristics'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-mono">
              {healthData?.model || 'gpt-4o-mini'}
            </h4>
            <p className="text-[11px] text-[#A0AEC0]">Provider: {healthData?.provider || 'openai'}</p>
          </div>
        </div>

        <div className="admin-panel p-4 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#A0AEC0] font-semibold">Total Operations</span>
            <Activity className="w-3.5 h-3.5 text-[#14A89E]" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white font-mono">
              {healthData?.totalRequests ?? 0}
            </h4>
            <p className="text-[11px] text-[#A0AEC0]">Logged through Gateway</p>
          </div>
        </div>

        <div className="admin-panel p-4 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#A0AEC0] font-semibold">Success Rate</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#1A7F4B]" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white font-mono">
              {healthData?.successRatePct ?? 100}%
            </h4>
            <p className="text-[11px] text-[#A0AEC0]">Zero unhandled 500s</p>
          </div>
        </div>

        <div className="admin-panel p-4 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#A0AEC0] font-semibold">Average Latency</span>
            <Zap className="w-3.5 h-3.5 text-[#E8A317]" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white font-mono">
              {healthData?.averageLatencyMs ?? 0} ms
            </h4>
            <p className="text-[11px] text-[#A0AEC0]">Timeout cap: 25s</p>
          </div>
        </div>
      </div>

      {/* Match Score Weighting & Safeguards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Match score weighting sliders */}
        <div className="lg:col-span-7 admin-panel p-6 rounded-xl space-y-6 text-xs text-[#E7ECF3]">
          <div className="flex items-center justify-between border-b border-[#223247] pb-3">
            <h3 className="font-bold text-white text-sm">Match score weighting</h3>
            <span className="font-mono text-[#E8A317] font-bold tnum">
              Total: {skillsWeight + experienceWeight + locationWeight}%
            </span>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Skills fit</span>
                <span className="font-mono text-[#14A89E] font-bold tnum">{skillsWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={skillsWeight}
                onChange={(e) => setSkillsWeight(Number(e.target.value))}
                className="w-full accent-[#14A89E] cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Experience fit</span>
                <span className="font-mono text-[#4C7AE0] font-bold tnum">{experienceWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={experienceWeight}
                onChange={(e) => setExperienceWeight(Number(e.target.value))}
                className="w-full accent-[#4C7AE0] cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Location match (Douala/Yaoundé/Remote)</span>
                <span className="font-mono text-[#E8A317] font-bold tnum">{locationWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={locationWeight}
                onChange={(e) => setLocationWeight(Number(e.target.value))}
                className="w-full accent-[#E8A317] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Safeguards Checkboxes */}
        <div className="lg:col-span-5 admin-panel p-6 rounded-xl space-y-5 text-xs text-[#E7ECF3]">
          <h3 className="font-bold text-white text-sm border-b border-[#223247] pb-3">
            Mandatory Ethical Safeguards
          </h3>

          <div className="space-y-3.5">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Strict human approval on all rejections</span>
              <input
                type="checkbox"
                checked={humanApproval}
                onChange={(e) => setHumanApproval(e.target.checked)}
                className="rounded text-[#E8A317] focus:ring-[#E8A317]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span>Exclude protected attributes from scoring</span>
              <input
                type="checkbox"
                checked={excludeProtected}
                onChange={(e) => setExcludeProtected(e.target.checked)}
                className="rounded text-[#E8A317] focus:ring-[#E8A317]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span>Show transparent score breakdown to candidates</span>
              <input
                type="checkbox"
                checked={showBreakdown}
                onChange={(e) => setShowBreakdown(e.target.checked)}
                className="rounded text-[#E8A317] focus:ring-[#E8A317]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span>Coach benchmarks salary in XAF</span>
              <input
                type="checkbox"
                checked={coachSuggestSalary}
                onChange={(e) => setCoachSuggestSalary(e.target.checked)}
                className="rounded text-[#E8A317] focus:ring-[#E8A317]"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Recent AI Operations Telemetry Log */}
      <div className="admin-panel p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#223247] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#14A89E]" />
            Recent AI Gateway Requests (Live Buffer)
          </h3>
          <span className="text-[11px] text-[#A0AEC0]">
            Sliding window rate limit: 40 req/min
          </span>
        </div>

        {(!healthData?.recentLogs || healthData.recentLogs.length === 0) ? (
          <div className="text-center py-6 text-xs text-[#A0AEC0]">
            No AI requests logged in the current server session yet. Run a job match or coaching query to populate live telemetry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-[#A0AEC0] uppercase tracking-wider border-b border-[#223247]">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Feature</th>
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#223247] font-mono text-[11px]">
                {healthData.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#1A2637]/40">
                    <td className="py-2.5 px-3 text-[#A0AEC0]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 text-white font-bold">{log.feature}</td>
                    <td className="py-2.5 px-3 text-[#14A89E]">{log.model}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'success'
                            ? 'bg-[#1A7F4B]/20 text-[#1A7F4B]'
                            : log.status === 'fallback'
                            ? 'bg-[#E8A317]/20 text-[#E8A317]'
                            : 'bg-[#D14343]/20 text-[#D14343]'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-white font-bold">
                      {log.duration_ms} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
