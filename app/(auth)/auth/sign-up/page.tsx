'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { User, Building2, Check, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isSupabaseLive } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<'talent' | 'employer'>('talent');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setErrorMsg('Please accept the Terms and Privacy Policy to proceed.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    const res = await signUp(email, password, fullName, selectedRole);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setStep(3);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between text-xs font-semibold text-[#5A6779] border-b border-[#E2E7EE] pb-3">
        <span className="uppercase tracking-wider">Step {step} of 3</span>
        <div className="flex gap-1.5">
          <span className={`w-6 h-1.5 rounded-full ${step >= 1 ? 'bg-[#0B7F7A]' : 'bg-[#E2E7EE]'}`} />
          <span className={`w-6 h-1.5 rounded-full ${step >= 2 ? 'bg-[#0B7F7A]' : 'bg-[#E2E7EE]'}`} />
          <span className={`w-6 h-1.5 rounded-full ${step >= 3 ? 'bg-[#0B7F7A]' : 'bg-[#E2E7EE]'}`} />
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-[#B42318]/10 border border-[#B42318]/30 text-[#B42318] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Role Selection */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in-50 duration-150">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0B1C2F] font-display tracking-tight">
              How will you use WorkDey?
            </h1>
            <p className="text-xs text-[#5A6779] mt-1">
              Tell us how you will use WorkDey. We tailor the workspace, recommendations, and coaching to your role.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Card 1: Talent */}
            <div
              onClick={() => setSelectedRole('talent')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRole === 'talent'
                  ? 'border-[#0B7F7A] bg-[#E6F5F3]/30 shadow-sm'
                  : 'border-[#E2E7EE] bg-white hover:border-[#0B7F7A]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#0B7F7A] text-white flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                {selectedRole === 'talent' && (
                  <div className="w-5 h-5 rounded-full bg-[#0B7F7A] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <h3 className="text-sm font-bold text-[#0B1C2F]">I&apos;m looking for work</h3>
              <p className="text-xs text-[#5A6779] mt-1 leading-relaxed">
                Get matched to roles, track applications, and grow with an AI career coach.
              </p>
            </div>

            {/* Card 2: Employer */}
            <div
              onClick={() => setSelectedRole('employer')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRole === 'employer'
                  ? 'border-[#2552C2] bg-[#EAF0FC]/30 shadow-sm'
                  : 'border-[#E2E7EE] bg-white hover:border-[#2552C2]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#2552C2] text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                {selectedRole === 'employer' && (
                  <div className="w-5 h-5 rounded-full bg-[#2552C2] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <h3 className="text-sm font-bold text-[#0B1C2F]">I&apos;m hiring</h3>
              <p className="text-xs text-[#5A6779] mt-1 leading-relaxed">
                Post roles, review ranked applicants, and run your recruitment pipeline with your team.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full py-2.5 px-4 rounded-lg bg-[#0B7F7A] text-white text-xs font-semibold hover:bg-[#0B7F7A]/90 transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            Continue to account details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: Create Account Form */}
      {step === 2 && (
        <form onSubmit={handleCreateAccount} className="space-y-4 animate-in fade-in-50 duration-150">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0B1C2F] font-display tracking-tight">
              Create your account
            </h1>
            <p className="text-xs text-[#5A6779] mt-1">
              Joining as {selectedRole === 'talent' ? 'Talent' : 'Employer'} · Free to start
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B1C2F] mb-1.5">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aïcha Nkeng"
              required
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] focus:ring-2 focus:ring-[#0B7F7A]/20 outline-none text-[#0B1C2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B1C2F] mb-1.5">
              Work or personal email
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

          <div>
            <label className="block text-xs font-semibold text-[#0B1C2F] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 10 characters"
              required
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] focus:ring-2 focus:ring-[#0B7F7A]/20 outline-none text-[#0B1C2F]"
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded border-[#E2E7EE] text-[#0B7F7A] focus:ring-[#0B7F7A]"
            />
            <label htmlFor="terms" className="text-[11px] text-[#5A6779] leading-tight cursor-pointer">
              I agree to the <Link href="/terms" className="text-[#0B7F7A] underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#0B7F7A] underline">Privacy Policy</Link>, including how AI is used to explain match scores.
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-2.5 px-4 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#5A6779] hover:bg-[#F4F6F9]"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[#0B7F7A] text-white text-xs font-semibold hover:bg-[#0B7F7A]/90 transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Continue to workspace'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Success Confirmation & Direct Workspace Launch */}
      {step === 3 && (
        <div className="space-y-5 text-center py-4 animate-in fade-in-50 duration-200">
          <div className="w-14 h-14 rounded-full bg-[#E6F5F3] text-[#0B7F7A] flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-[#0B1C2F] font-display">
              Welcome to WorkDey, {fullName || 'there'}!
            </h1>
            <p className="text-xs text-[#5A6779] mt-2 max-w-sm mx-auto leading-relaxed">
              Your unified identity is active. We tailored the {selectedRole === 'talent' ? 'Talent' : 'Employer'} workspace with Cameroonian salary benchmarks in XAF.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (selectedRole === 'talent') router.push('/talent/dashboard');
              else router.push('/employer/dashboard');
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-[#0B7F7A] text-white text-xs font-semibold hover:bg-[#0B7F7A]/90 transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            Enter {selectedRole === 'talent' ? 'Talent Workspace' : 'Employer Workspace'} →
          </button>
        </div>
      )}

      {step !== 3 && (
        <div className="text-center text-xs text-[#5A6779] pt-2">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="font-semibold text-[#0B7F7A] hover:underline">
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
