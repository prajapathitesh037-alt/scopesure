'use client';

import React from 'react';
import { FileText, CheckCircle2, AlertTriangle, Upload, GitCompare } from 'lucide-react';
import { cn } from '@/lib/utils';

const activities = [
  {
    id: 1,
    icon: Upload,
    title: 'Quotation uploaded',
    description: 'ApexSolar_Estimate.pdf uploaded by you',
    time: '2 hours ago',
    color: 'text-forest',
    bg: 'bg-forest/10',
  },
  {
    id: 2,
    icon: CheckCircle2,
    title: 'Analysis complete',
    description: 'All 3 quotations have been analyzed',
    time: '1 hour ago',
    color: 'text-forest',
    bg: 'bg-pale-green',
  },
  {
    id: 3,
    icon: AlertTriangle,
    title: 'Missing information detected',
    description: '5 items not specified across vendors',
    time: '1 hour ago',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    id: 4,
    icon: GitCompare,
    title: 'Conflicting terms found',
    description: 'Warranty duration varies significantly',
    time: '1 hour ago',
    color: 'text-error',
    bg: 'bg-error/10',
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-2xl bg-bg-card border border-border p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  activity.bg
                )}
              >
                <Icon className={cn('h-4 w-4', activity.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {activity.title}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {activity.description}
                </p>
              </div>
              <span className="shrink-0 text-xs text-text-secondary whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
