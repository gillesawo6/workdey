'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Upload,
  FileText,
  Check,
  AlertCircle,
  Building,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { useEmployer } from '@/lib/employer/employer-context';

export default function EmployerProfilePage() {
  const { activeOrg, submitVerificationDoc } = useEmployer();
  const [docFilename, setDocFilename] = useState('registry_cert_2026.pdf');
  const [taxNumber, setTaxNumber] = useState('RC/DLA/2022/B/492');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg) return;

    submitVerificationDoc(activeOrg.id, `/docs/${docFilename}`, docFilename);
    setSuccessNotice(
      `Verification packet for "${activeOrg.name}" submitted to the platform governance review queue.`
    );
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleFakeDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFilename(file.name);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <span className="text-xs text-[#5A6779] block">
          Organisation Verification & Governance
        </span>
        <h1 className="text-2xl font-bold text-[#0B1C2F] font-display">
          {activeOrg?.name || 'Savanna Agritech'}
        </h1>
      </div>

      {successNotice && (
        <div className="p-3 bg-[#E6F5F3] border border-[#0B7F7A]/20 text-[#0B7F7A] text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" /> {successNotice}
        </div>
      )}

      {/* Verification Status Card */}
      {activeOrg?.verification_status === 'verified' ? (
        <div className="p-5 rounded-xl bg-[#E6F5F3] border border-[#0B7F7A]/20 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 font-bold text-xs text-[#0B7F7A]">
              <ShieldCheck className="w-4 h-4" /> Verified Employer Trust Badge Active
            </span>
            <p className="text-xs text-[#3D4A5C] leading-relaxed">
              Your business registration documents were confirmed by platform administration. All your job listings carry the verified employer badge, which increases candidate response rates by up to 60%.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#0B7F7A] text-white font-bold text-[10px] flex-shrink-0">
            Verified
          </span>
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-start justify-between gap-4">
          <div className="space-y-1 text-xs text-[#92400E]">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#B45309]">
              <Clock className="w-4 h-4" /> Verification In Review
            </span>
            <p className="leading-relaxed">
              Your registration documents are currently pending manual review by WorkDey platform administration. You can still create draft roles.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#B45309] text-white font-bold text-[10px] flex-shrink-0">
            Pending Review
          </span>
        </div>
      )}

      {/* Details & Verification Document Submission */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-5 text-xs">
        <h3 className="font-bold text-sm text-[#0B1C2F]">Legal Entity Credentials</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#5A6779] mb-1 font-semibold">Legal Entity Name</label>
            <input
              type="text"
              value={activeOrg?.name}
              disabled
              className="w-full px-3 py-2 bg-[#F4F6F9] border border-[#E2E7EE] rounded-lg text-[#0B1C2F] font-semibold"
            />
          </div>

          <div>
            <label className="block text-[#5A6779] mb-1 font-semibold">Sector / Industry</label>
            <input
              type="text"
              value={activeOrg?.sector || 'Technology & Digital'}
              disabled
              className="w-full px-3 py-2 bg-[#F4F6F9] border border-[#E2E7EE] rounded-lg text-[#0B1C2F]"
            />
          </div>

          <div>
            <label className="block text-[#5A6779] mb-1 font-semibold">Headquarters Location</label>
            <input
              type="text"
              value={`${activeOrg?.city}, ${activeOrg?.region} · Cameroon`}
              disabled
              className="w-full px-3 py-2 bg-[#F4F6F9] border border-[#E2E7EE] rounded-lg text-[#0B1C2F]"
            />
          </div>

          <div>
            <label className="block text-[#5A6779] mb-1 font-semibold">Tax / Registry ID (RCCM / NIU)</label>
            <input
              type="text"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              className="w-full px-3 py-2 border border-[#E2E7EE] rounded-lg text-[#0B1C2F] font-mono"
            />
          </div>
        </div>

        {/* Document Upload Area */}
        <form onSubmit={handleSubmitVerification} className="pt-2 border-t border-[#E2E7EE] space-y-3">
          <label className="block text-[#0B1C2F] font-bold text-xs">
            Official Business Registration Document (RCCM, Trade Register or Articles)
          </label>
          <div className="p-4 rounded-xl border border-dashed border-[#2552C2]/40 bg-[#EAF0FC]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#2552C2]" />
              <div>
                <p className="font-bold text-[#0B1C2F]">{docFilename}</p>
                <p className="text-[11px] text-[#5A6779]">Valid PDF document</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-[#E2E7EE] bg-white text-xs font-semibold text-[#0B1C2F] hover:bg-[#F4F6F9] flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Choose file
                <input type="file" accept=".pdf,.png,.jpg" onChange={handleFakeDocChange} className="hidden" />
              </label>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#2552C2] text-white font-bold text-xs hover:bg-[#1E429F]"
              >
                Submit for verification
              </button>
            </div>
          </div>
          <p className="text-[11px] text-[#5A6779] leading-relaxed">
            All documents submitted are encrypted and reviewed strictly by certified platform administrators to protect candidates against fraudulent listings.
          </p>
        </form>
      </div>
    </div>
  );
}
