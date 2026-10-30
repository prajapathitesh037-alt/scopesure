'use client';

import React from 'react';
import { LiquidCard } from '@/components/liquid/liquid-card';
import { FileText, AlertTriangle, GitCompare, XCircle } from 'lucide-react';
import type { MetricCard as MetricCardType } from '@/lib/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  AlertTriangle,
  GitCompare,
  XCircle,
};

const statusColorMap: Record<string, string> = {
  FileText: 'bg-forest/10 text-forest',
  AlertTriangle: 'bg-warning/10 text-warning',
  GitCompare: 'bg-error/10 text-error',
  XCircle: 'bg-error/10 text-error',
};

interface MetricCardProps {
  metric: MetricCardType;
  onClick?: () => void;
}

export function MetricCardComponent({ metric, onClick }: MetricCardProps) {
  const Icon = iconMap[metric.icon] || FileText;
  const colorClass = statusColorMap[metric.icon] || 'bg-sage text-forest';

  return (
    <LiquidCard onClick={onClick} className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-secondary">
            {metric.label}
          </span>
          <span className="text-3xl font-bold text-text-primary tabular-nums">
            {metric.value}
          </span>
          <span className="text-xs text-text-secondary">{metric.description}</span>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </LiquidCard>
  );
}
