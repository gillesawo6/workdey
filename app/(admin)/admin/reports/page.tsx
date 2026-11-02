'use client';

import React from 'react';
import Link from 'next/link';
import { Flag, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAdmin } from '@/lib/admin/admin-context';

export default function AdminReportsPage() {
  const { moderationReports } = useAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#A0AEC0] block">OPERATE · TRUST & SAFETY</span>
          <h1 className="text-2xl font-bold text-white font-display">User reports & violations ({moderationReports.length})</h1>
        </div>

        <Link
          href="/admin/moderation"
          className="px-3.5 py-1.5 rounded-lg bg-[#E8A317] text-[#0B1C2F] text-xs font-bold hover:bg-[#d69514] transition-colors self-start sm:self-auto shadow-sm"
        >
          Open Moderation Queue →
        </Link>
      </div>

      <div className="admin-panel rounded-xl overflow-hidden divide-y divide-[#223247]">
        {moderationReports.map((r) => (
          <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#111D2C]/50 transition-colors text-xs text-[#E7ECF3]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    r.priority === 'high'
                      ? 'bg-[#B42318]/20 text-[#B42318]'
                      : 'bg-[#E8A317]/20 text-[#E8A317]'
                  }`}
                >
                  {r.priority}
                </span>
                <h3 className="font-bold text-white">{r.target_title}</h3>
                <span className="text-[10px] text-[#A0AEC0] font-mono">({r.flag_type.replace('_', ' ')})</span>
              </div>
              <p className="text-[11px] text-[#A0AEC0]">
                Reporter: {r.reporter_name} · Reason: {r.reason}
              </p>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded text-[10px] font-bold ${
                r.status === 'resolved' ? 'bg-[#1A7F4B]/20 text-[#1A7F4B]' : 'bg-[#E8A317]/20 text-[#E8A317]'
              }`}>
                {r.status}
              </span>
              <Link
                href="/admin/moderation"
                className="px-3 py-1.5 rounded-lg bg-[#E8A317] text-[#0B1C2F] text-xs font-bold hover:bg-[#d69514]"
              >
                Inspect →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
