'use client';

import React from 'react';
import { DEMO_COMPARISON } from '@/lib/demo-data';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, HelpCircle, AlertTriangle, GitCompare } from 'lucide-react';
import type { FindingStatus } from '@/lib/types';

const statusConfig: Record<FindingStatus, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  'included': { icon: CheckCircle2, color: 'text-forest', label: 'Included' },
  'excluded': { icon: XCircle, color: 'text-error', label: 'Excluded' },
  'not-specified': { icon: HelpCircle, color: 'text-warning', label: 'Not Specified' },
  'unclear': { icon: AlertTriangle, color: 'text-warning', label: 'Unclear' },
  'conflicting': { icon: GitCompare, color: 'text-error', label: 'Conflicting' },
};

export function ScopeCoverage() {
  const categories = [...new Set(DEMO_COMPARISON.map((item) => item.category))];

  return (
    <div className="rounded-2xl bg-bg-card border border-border p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Scope Coverage</h3>
      <div className="space-y-4">
        {categories.map((category) => {
          const items = DEMO_COMPARISON.filter((c) => c.category === category);
          const totalStatuses = items.flatMap((item) => Object.values(item.vendors).map((v) => v.status));
          const included = totalStatuses.filter((s) => s === 'included').length;
          const total = totalStatuses.length;
          const coverage = total > 0 ? Math.round((included / total) * 100) : 0;

          return (
            <div key={category}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-text-primary">{category}</span>
                <span className="text-text-secondary tabular-nums">{coverage}%</span>
              </div>
              <div className="h-2 rounded-full bg-sage/50 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    coverage >= 80 ? 'bg-forest' : coverage >= 50 ? 'bg-warning' : 'bg-error'
                  )}
                  style={{ width: `${coverage}%` }}
                />
              </div>
              <div className="mt-1.5 flex gap-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-1 text-[10px] text-text-secondary">
                    <span>{item.item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div key={key} className="flex items-center gap-1 text-[11px]">
              <Icon className={cn('h-3 w-3', config.color)} />
              <span className="text-text-secondary">{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
