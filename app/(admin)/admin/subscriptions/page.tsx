'use client';

import React from 'react';
import { Layers, Plus, Check, CreditCard, Building } from 'lucide-react';
import { useAdmin } from '@/lib/admin/admin-context';

export default function AdminSubscriptionsPage() {
  const { subscriptionPlans, subscribedOrgs, metrics } = useAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#A0AEC0] block">PLATFORM · MONETIZATION</span>
          <h1 className="text-2xl font-bold text-white font-display">Subscriptions & billing</h1>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[#111D2C] border border-[#223247] flex items-center gap-3">
          <CreditCard className="w-4 h-4 text-[#E8A317]" />
          <div>
            <span className="text-[10px] text-[#A0AEC0] block uppercase font-mono">Monthly Recurring Revenue</span>
            <span className="text-base font-black text-white font-mono tnum">
              {metrics.monthlyRevenueXaf.toLocaleString()} XAF
            </span>
          </div>
        </div>
      </div>

      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((p) => (
          <div
            key={p.id}
            className={`admin-panel p-6 rounded-xl space-y-4 text-xs text-[#E7ECF3] relative ${
              p.is_popular ? 'border-[#E8A317] ring-1 ring-[#E8A317]/30' : ''
            }`}
          >
            {p.is_popular && (
              <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8A317] text-[#0B1C2F]">
                POPULAR
              </span>
            )}
            <div>
              <h3 className="font-bold text-base text-white">{p.name}</h3>
              <p className="font-black text-xl text-white mt-1 font-display font-mono">{p.price_display}</p>
            </div>

            <ul className="space-y-2 text-[#A0AEC0] pt-2 border-t border-[#223247]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1A7F4B]" />
                <span>Roles limit: {p.roles_limit}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1A7F4B]" />
                <span>Seats limit: {p.seats_limit}</span>
              </li>
              {p.features.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1A7F4B]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Organisations Subscriptions Table */}
      <div className="admin-panel rounded-xl overflow-hidden mt-8">
        <div className="p-4 border-b border-[#223247]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Subscribed Organisations ({subscribedOrgs.length})
          </h3>
        </div>

        <table className="w-full text-left text-xs text-[#E7ECF3]">
          <thead className="bg-[#111D2C] border-b border-[#223247] text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Organisation</th>
              <th className="px-5 py-3">Tier Plan</th>
              <th className="px-5 py-3 tnum">Seats</th>
              <th className="px-5 py-3">Renews</th>
              <th className="px-5 py-3">Amount (XAF)</th>
              <th className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#223247]">
            {subscribedOrgs.map((o) => (
              <tr key={o.id} className="hover:bg-[#111D2C]/40">
                <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#A0AEC0]" />
                  <span>{o.org_name}</span>
                </td>
                <td className="px-5 py-3.5 text-[#E7ECF3]">{o.plan_name}</td>
                <td className="px-5 py-3.5 font-mono text-[#A0AEC0] tnum">{o.seats}</td>
                <td className="px-5 py-3.5 text-[#A0AEC0]">
                  {new Date(o.renews_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5 font-mono text-white tnum font-semibold">
                  {o.amount_xaf.toLocaleString()} XAF
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      o.status === 'active'
                        ? 'bg-[#1A7F4B]/20 text-[#1A7F4B]'
                        : 'bg-[#E8A317]/20 text-[#E8A317]'
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
