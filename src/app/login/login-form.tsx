'use client';

import React, { useState, useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { login, signup, type AuthState } from './actions';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, SunMedium } from 'lucide-react';

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const urlError = searchParams.get('error');

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // React 19 useActionState
  const [signInState, signInAction, isSigningIn] = useActionState(login, null);
  const [signUpState, signUpAction, isSigningUp] = useActionState(signup, null);

  const activeState: AuthState | null = mode === 'signin' ? signInState : signUpState;
  const isPending = mode === 'signin' ? isSigningIn : isSigningUp;
  const currentAction = mode === 'signin' ? signInAction : signUpAction;

  return (
    <div className="w-full max-w-[440px] bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.12)] border border-[#D9DFD7]">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17211D] text-[#72EC81] shadow-lg border border-[#72EC81]/20 mb-3">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 stroke-[#72EC81] fill-none stroke-[1.8]"
          >
            <circle cx="12" cy="12" r="2.2" className="fill-[#72EC81]" />
            <ellipse cx="12" cy="12" rx="8.5" ry="3.2" transform="rotate(0 12 12)" />
            <ellipse cx="12" cy="12" rx="8.5" ry="3.2" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="8.5" ry="3.2" transform="rotate(120 12 12)" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#17211D]">
          SCOPE<span className="text-[#397553]">sure</span>
        </h1>
        <p className="text-xs text-[#68756C] mt-1">
          Evidence-First Solar Quotation Auditor & Scope Verifier
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-1 bg-[#F3F5F1] rounded-2xl mb-6 border border-[#E2E7DF]">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={`py-2 text-xs font-semibold rounded-xl transition-all ${
            mode === 'signin'
              ? 'bg-white text-[#17211D] shadow-xs'
              : 'text-[#68756C] hover:text-[#17211D]'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`py-2 text-xs font-semibold rounded-xl transition-all ${
            mode === 'signup'
              ? 'bg-white text-[#17211D] shadow-xs'
              : 'text-[#68756C] hover:text-[#17211D]'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Alert Banners */}
      {urlError && !activeState?.error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{urlError}</span>
        </div>
      )}

      {activeState?.error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{activeState.error}</span>
        </div>
      )}

      {activeState?.success && (
        <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-start gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{activeState.success}</span>
        </div>
      )}

      {/* Auth Form */}
      <form action={currentAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#17211D]">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9C90]" />
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="solar.auditor@scopesure.com"
              className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#D9DFD7] bg-[#FAFBF9] text-xs text-[#17211D] placeholder:text-[#9BAAA0] focus:outline-none focus:ring-2 focus:ring-[#397553]/30 focus:border-[#397553] transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#17211D]">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9C90]" />
            <input
              name="password"
              type="password"
              required
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              placeholder="••••••••••••"
              className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#D9DFD7] bg-[#FAFBF9] text-xs text-[#17211D] placeholder:text-[#9BAAA0] focus:outline-none focus:ring-2 focus:ring-[#397553]/30 focus:border-[#397553] transition-all"
            />
          </div>
          {mode === 'signup' && (
            <p className="text-[11px] text-[#8C9C90]">Must be at least 6 characters.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 h-11 flex items-center justify-center gap-2 rounded-xl bg-[#17211D] text-white text-xs font-semibold hover:bg-[#23332C] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-[#17211D]/10"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Create Auditor Account'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Security note */}
      <div className="mt-6 pt-5 border-t border-[#EEF2EC] flex items-center justify-between text-[11px] text-[#7A8A7F]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#397553]" />
          <span>Encrypted with Supabase Auth</span>
        </div>
        <div className="flex items-center gap-1.5">
          <SunMedium className="h-3.5 w-3.5 text-[#D49A35]" />
          <span>RLS Protected</span>
        </div>
      </div>
    </div>
  );
}
