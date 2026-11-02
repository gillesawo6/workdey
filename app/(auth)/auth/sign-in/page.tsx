'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const { signIn, isSupabaseLive, switchDemoPersona } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await signIn(email, password);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.push(redirectPath || '/talent/dashboard');
    }
  };

  const handleDemoPersona = (persona: 'aicha' | 'savanna_owner' | 'admin_nadine') => {
    switchDemoPersona(persona);
    if (persona === 'aicha') router.push('/talent/dashboard');
    else if (persona === 'savanna_owner') router.push('/employer/dashboard');
    else if (persona === 'admin_nadine') router.push('/admin/overview');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B1C2F] font-display tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs text-[#5A6779] mt-1">
          Sign in to continue to your workspace.
        </p>
      </div>

      {/* Supabase status badge */}
      <div className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
        isSupabaseLive ? 'bg-[#E6F5F3] text-[#0B7F7A] border border-[#0B7F7A]/20' : 'bg-[#F4F6F9] text-[#3D4A5C] border border-[#E2E7EE]'
      }`}>
        {isSupabaseLive ? (
          <>
            <CheckCircle className="w-4 h-4 text-[#0B7F7A] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Connected to live Supabase Auth</p>
              <p className="text-[11px] text-[#5A6779]">Session persistence & RLS active.</p>
            </div>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-[#0B7F7A] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Development Mode (Instant Preview Active)</p>
              <p className="text-[11px] text-[#5A6779]">
                Provide Supabase keys in <code className="bg-white px-1 py-0.5 rounded border border-[#E2E7EE]">.env</code> for remote PostgreSQL, or test immediately below.
              </p>
            </div>
          </>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-[#B42318]/10 border border-[#B42318]/30 text-[#B42318] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Google Sign In */}
      <button
        type="button"
        onClick={() => handleDemoPersona('aicha')}
        className="w-full py-2.5 px-4 rounded-lg border border-[#E2E7EE] bg-white text-[#0B1C2F] text-xs font-semibold hover:bg-[#F4F6F9] transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#E2E7EE] w-full" />
        <span className="bg-white px-3 text-[11px] text-[#5A6779] relative">or with email</span>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#0B1C2F] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] focus:ring-2 focus:ring-[#0B7F7A]/20 outline-none transition-all text-[#0B1C2F]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#0B1C2F]">
              Password
            </label>
            <Link
              href="/auth/reset-password"
              className="text-[11px] font-medium text-[#0B7F7A] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] focus:ring-2 focus:ring-[#0B7F7A]/20 outline-none transition-all text-[#0B1C2F] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-[#5A6779] hover:text-[#0B1C2F]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg bg-[#0B7F7A] text-white text-xs font-semibold hover:bg-[#0B7F7A]/90 transition-all shadow-sm flex items-center justify-center gap-1.5 group disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </form>

      {/* Quick Demo Logins for instant evaluation */}
      <div className="pt-4 border-t border-[#E2E7EE]">
        <p className="text-[11px] font-bold text-[#5A6779] uppercase tracking-wider mb-2">
          One-Click Demo Personas (Design PDF)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemoPersona('aicha')}
            className="p-2 text-left rounded-lg border border-[#E2E7EE] hover:border-[#0B7F7A] hover:bg-[#E6F5F3]/40 transition-colors"
          >
            <p className="text-[11px] font-bold text-[#0B1C2F]">Aïcha Nkeng</p>
            <p className="text-[10px] text-[#0B7F7A]">Talent (Douala)</p>
          </button>

          <button
            type="button"
            onClick={() => handleDemoPersona('savanna_owner')}
            className="p-2 text-left rounded-lg border border-[#E2E7EE] hover:border-[#2552C2] hover:bg-[#EAF0FC]/40 transition-colors"
          >
            <p className="text-[11px] font-bold text-[#0B1C2F]">Françoise M.</p>
            <p className="text-[10px] text-[#2552C2]">Savanna Agritech</p>
          </button>

          <button
            type="button"
            onClick={() => handleDemoPersona('admin_nadine')}
            className="p-2 text-left rounded-lg border border-[#E2E7EE] hover:border-[#E8A317] hover:bg-[#E8A317]/10 transition-colors"
          >
            <p className="text-[11px] font-bold text-[#0B1C2F]">Nadine O.</p>
            <p className="text-[10px] text-[#E8A317]">Super Admin</p>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-[#5A6779]">
        New to WorkDey?{' '}
        <Link href="/auth/sign-up" className="font-semibold text-[#0B7F7A] hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6779]">Loading sign in...</div>}>
      <SignInContent />
    </Suspense>
  );
}
