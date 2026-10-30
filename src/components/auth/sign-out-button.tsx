'use client';

import React, { useTransition } from 'react';
import { LogOut } from 'lucide-react';
import { signOutAction } from '@/app/login/actions';
import { LiquidSurface } from '@/components/liquid/liquid-surface';

interface SignOutButtonProps {
  className?: string;
  variant?: 'icon' | 'full';
}

export function SignOutButton({ className, variant = 'icon' }: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction();
    });
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleSignOut}
        disabled={isPending}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-200 cursor-pointer disabled:opacity-50 ${className || ''}`}
      >
        <LogOut className="h-4 w-4" />
        <span>{isPending ? 'Signing out...' : 'Sign Out'}</span>
      </button>
    );
  }

  return (
    <LiquidSurface
      as="button"
      intensity="subtle"
      onClick={handleSignOut}
      disabled={isPending}
      title="Sign Out"
      aria-label="Sign Out"
      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[#202D26] text-[#7E9084] hover:text-red-400 hover:bg-red-950/30 transition-colors border border-white/5 cursor-pointer disabled:opacity-50 ${className || ''}`}
    >
      <LogOut className="h-4 w-4" />
    </LiquidSurface>
  );
}

