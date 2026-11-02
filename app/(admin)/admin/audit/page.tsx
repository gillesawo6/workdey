'use client';

import React, { useState, useMemo } from 'react';
import { FileCheck, Download, ShieldCheck, Filter, Search, Lock } from 'lucide-react';
import { useAdmin } from '@/lib/admin/admin-context';

export default function AdminAuditPage() {
  const { auditLogs, exportAuditCSV } = useAdmin();
  const [filterAction, setFilterAction] = useState('');
  const [searchActor, setSearchActor] = useState('');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (filterAction && !log.action.toLowerCase().includes(filterAction.toLowerCase())) return false;
      if (searchActor && !log.actor_name?.toLowerCase().includes(searchActor.toLowerCase())) return false;
      return true;
    });
  }, [auditLogs, filterAction, searchActor]);

  return (
    <div className="space-y-6 text-xs text-[#E7ECF3]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#A0AEC0] block">GOVERNANCE · SECURITY</span>
          <h1 className="text-2xl font-bold text-white font-display">Immutable audit log ({auditLogs.length} events)</h1>
          <p className="text-[#A0AEC0] mt-1">
            Tamper-evident, cryptographically timestamped records of all administrative operations.
          </p>
        </div>

        <button
          onClick={exportAuditCSV}
          className="px-3.5 py-2 rounded-lg bg-[#E8A317] text-[#0B1C2F] text-xs font-bold hover:bg-[#d69514] transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <Download className="w-3.5 h-3.5" /> Export full audit trail (.csv)
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[220px] flex items-center px-3 py-2 bg-[#162436] rounded-lg border border-[#223247]">
          <Search className="w-3.5 h-3.5 text-[#A0AEC0] mr-2" />
          <input
            type="text"
            value={searchActor}
            onChange={(e) => setSearchActor(e.target.value)}
            placeholder="Search by actor name (e.g. Nadine, Super Admin)..."
            className="w-full bg-transparent outline-none text-[#E7ECF3] placeholder-[#A0AEC0]"
          />
        </div>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-3 py-2 bg-[#162436] rounded-lg border border-[#223247] text-[#E7ECF3] outline-none"
        >
          <option value="">All Action Types</option>
          <option value="verification">Verification Actions</option>
          <option value="suspended">Suspensions</option>
          <option value="reactivated">Reactivations</option>
          <option value="role">Platform Role Changes</option>
          <option value="moderation">Job Moderation</option>
          <option value="taxonomy">Taxonomy & Settings</option>
          <option value="announcement">Announcements</option>
        </select>
      </div>

      <div className="admin-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E7ECF3]">
            <thead className="bg-[#111D2C] border-b border-[#223247] text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Timestamp (UTC)</th>
                <th className="px-5 py-3">Actor</th>
                <th className="px-5 py-3">Action Description</th>
                <th className="px-5 py-3">Target Resource</th>
                <th className="px-5 py-3">Cryptographic Context / Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#223247]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#111D2C]/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[#A0AEC0] whitespace-nowrap">
                    {log.created_at.slice(0, 19).replace('T', ' ')}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-white whitespace-nowrap">
                    {log.actor_name}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#E7ECF3]">
                    {log.action}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-[#E8A317] whitespace-nowrap">
                    {log.target_type}: {log.target_id}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#A0AEC0] max-w-xs truncate">
                    {JSON.stringify(log.metadata)}
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[#A0AEC0]">
                    No audit records matched the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
