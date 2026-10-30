'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LiquidSurface } from './liquid-surface';

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  hoverable?: boolean;
}

export function LiquidCard({
  children,
  className,
  selected = false,
  onClick,
  hoverable = true,
}: LiquidCardProps) {
  return (
    <LiquidSurface
      intensity={selected ? 'strong' : 'medium'}
      onClick={onClick}
      className={cn(
        'rounded-2xl bg-bg-card border transition-all duration-300',
        hoverable && 'hover:shadow-lg hover:-translate-y-0.5',
        selected
          ? 'border-forest/40 shadow-md ring-1 ring-forest/20'
          : 'border-border shadow-sm',
        className
      )}
    >
      {children}
    </LiquidSurface>
  );
}
