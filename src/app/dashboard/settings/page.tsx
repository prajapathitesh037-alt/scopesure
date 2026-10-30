'use client';

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { LiquidButton } from '@/components/liquid/liquid-button';
import { Settings, Sliders, Shield, Droplets, Bell, Save, CheckCircle2, User } from 'lucide-react';
import { SignOutButton } from '@/components/auth/sign-out-button';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [minWarranty, setMinWarranty] = useState('15');
  const [panelUpgradeTolerance, setPanelUpgradeTolerance] = useState('strict');
  const [rippleIntensity, setRippleIntensity] = useState<'subtle' | 'medium' | 'strong'>('medium');
  const [notifyOnExclusion, setNotifyOnExclusion] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Settings & Audit Policies"
        breadcrumbs={[
          { label: 'SCOPEsure', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings' },
        ]}
      />

      <div className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Audit Policy & Interface Preferences</h1>
          <p className="text-xs text-text-secondary">
            Configure risk thresholds, liquid interaction feedback, and quotation auditor rules
          </p>
        </div>

        {saved && (
          <div className="rounded-xl bg-pale-green border border-forest/30 p-4 flex items-center gap-2 text-xs font-semibold text-forest">
            <CheckCircle2 className="h-4 w-4" />
            Preferences and audit criteria saved successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Policy Section 1: Auditor Risk Rules */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Shield className="h-4 w-4 text-forest" />
              Procurement Audit Rules
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-text-primary block mb-1">
                  Minimum Workmanship Warranty Threshold
                </label>
                <select
                  value={minWarranty}
                  onChange={(e) => setMinWarranty(e.target.value)}
                  className="w-full sm:w-64 rounded-xl border border-border bg-bg-main px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value="10">10 Years (Basic)</option>
                  <option value="15">15 Years (Standard)</option>
                  <option value="25">25 Years (Premium Benchmark)</option>
                </select>
                <p className="text-[11px] text-text-secondary mt-1">
                  Quotes falling below this threshold will automatically be flagged with a High Variance alert.
                </p>
              </div>

              <div>
                <label className="font-semibold text-text-primary block mb-1">
                  Main Electrical Panel Upgrade Policy
                </label>
                <select
                  value={panelUpgradeTolerance}
                  onChange={(e) => setPanelUpgradeTolerance(e.target.value)}
                  className="w-full sm:w-64 rounded-xl border border-border bg-bg-main px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value="strict">Strict (Flag any unincluded electrical upgrade as Critical)</option>
                  <option value="warn">Warning Only (Treat as potential change order)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Policy Section 2: Interactive Liquid Feedback */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Droplets className="h-4 w-4 text-water" />
              Liquid Interaction Feedback
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-text-primary block mb-2">
                  Tactile Liquid Ripple Intensity
                </label>
                <div className="flex items-center gap-3">
                  {(['subtle', 'medium', 'strong'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setRippleIntensity(level)}
                      className={`px-4 py-2 rounded-xl font-semibold capitalize border transition-all ${
                        rippleIntensity === level
                          ? 'border-forest bg-pale-green text-forest ring-1 ring-forest/20'
                          : 'border-border bg-bg-main text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-text-secondary mt-1.5">
                  Controls the water refraction expansion radius when clicking cards, tabs, and buttons.
                </p>
              </div>
            </div>
          </div>

          {/* Policy Section 3: Notification Toggles */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Bell className="h-4 w-4 text-forest" />
              Audit Notification Channels
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnExclusion}
                  onChange={(e) => setNotifyOnExclusion(e.target.checked)}
                  className="rounded text-forest focus:ring-forest h-4 w-4"
                />
                <span className="text-text-primary font-medium">
                  Immediately flag explicit line-item exclusions in quotation notifications
                </span>
              </label>
            </div>
          </div>

          {/* Section 4: Account & Security */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <User className="h-4 w-4 text-forest" />
              Auditor Session & Security
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-[#FAFBF9] p-4 rounded-xl border border-border">
              <div>
                <p className="font-semibold text-text-primary">Current Supabase Session</p>
                <p className="text-text-secondary text-[11px] mt-0.5">
                  Your session is authenticated and protected with Row-Level Security policies.
                </p>
              </div>
              <SignOutButton variant="full" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <LiquidButton
              variant="primary"
              size="md"
              icon={<Save className="h-4 w-4" />}
              className="bg-forest text-white"
            >
              Save Preferences
            </LiquidButton>
          </div>
        </form>
      </div>
    </div>
  );
}
