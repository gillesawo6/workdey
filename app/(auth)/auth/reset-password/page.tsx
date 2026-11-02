'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await resetPassword(email);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/auth/sign-in"
          className="inline-flex items-center gap-1.5 text-xs text-[#5A6779] hover:text-[#0B1C2F] mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
        <h1 className="text-2xl font-extrabold text-[#0B1C2F] font-display tracking-tight">
          Reset your password
        </h1>
        <p className="text-xs text-[#5A6779] mt-1">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      {submitted ? (
        <div className="p-4 rounded-xl bg-[#E6F5F3] border border-[#0B7F7A]/20 text-[#0B7F7A] space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            Check your inbox
          </div>
          <p className="text-xs text-[#3D4A5C] leading-relaxed">
            If an account exists for <span className="font-semibold text-[#0B1C2F]">{email}</span>, you will receive an email with instructions to choose a new password.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0B1C2F] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] focus:ring-2 focus:ring-[#0B7F7A]/20 outline-none text-[#0B1C2F]"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-[#B42318]">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#0B7F7A] text-white text-xs font-semibold hover:bg-[#0B7F7A]/90 transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {loading ? 'Sending link...' : 'Send reset instructions'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
