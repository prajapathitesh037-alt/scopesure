'use client';

import React from 'react';
import { MapPin, Zap, Battery, CheckCircle2, FileText } from 'lucide-react';
import { LiquidButton } from '@/components/liquid/liquid-button';
import type { Project } from '@/lib/types';

interface ProjectOverviewProps {
  project: Project;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending Analysis', color: 'bg-sage text-text-secondary' },
  analyzing: { label: 'Analyzing...', color: 'bg-warning/10 text-warning' },
  complete: { label: 'Analysis Complete', color: 'bg-pale-green text-forest' },
  error: { label: 'Analysis Error', color: 'bg-error/10 text-error' },
};

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const status = statusLabels[project.status];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-sage/60 p-8">
      {/* Background illustration */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
        <svg viewBox="0 0 400 300" className="h-full w-full" fill="none">
          {/* Simple solar panel illustration */}
          <rect x="100" y="60" width="200" height="130" rx="4" fill="var(--forest-green)" opacity="0.3" />
          <line x1="100" y1="95" x2="300" y2="95" stroke="var(--forest-green)" strokeWidth="1" opacity="0.5" />
          <line x1="100" y1="125" x2="300" y2="125" stroke="var(--forest-green)" strokeWidth="1" opacity="0.5" />
          <line x1="100" y1="155" x2="300" y2="155" stroke="var(--forest-green)" strokeWidth="1" opacity="0.5" />
          <line x1="160" y1="60" x2="160" y2="190" stroke="var(--forest-green)" strokeWidth="1" opacity="0.5" />
          <line x1="200" y1="60" x2="200" y2="190" stroke="var(--forest-green)" strokeWidth="1" opacity="0.5" />
          <line x1="240" y1="60" x2="240" y2="190" stroke="var(--forest-green)" strokeWidth="1" opacity="0.5" />
          {/* Sun */}
          <circle cx="320" cy="40" r="25" fill="var(--warning-amber)" opacity="0.3" />
          {/* House roof */}
          <path d="M80 200 L200 140 L320 200" stroke="var(--forest-green)" strokeWidth="2" fill="none" opacity="0.3" />
          <rect x="120" y="200" width="160" height="80" fill="var(--forest-green)" opacity="0.15" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">Current Project</p>
            <h2 className="mt-1 text-2xl font-bold text-text-primary">
              {project.name}
            </h2>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.color}`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {status.label}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="h-4 w-4 text-forest" />
            {project.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Zap className="h-4 w-4 text-forest" />
            {project.systemCapacity}
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Battery className="h-4 w-4 text-forest" />
            {project.systemType}
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <FileText className="h-4 w-4 text-forest" />
            {project.quotationCount} Quotations
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <LiquidButton variant="primary" size="md">
            View Comparison
          </LiquidButton>
          <LiquidButton variant="secondary" size="md">
            Upload Quotation
          </LiquidButton>
        </div>
      </div>
    </div>
  );
}
