'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface LiquidTabIndicatorProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function LiquidTabIndicator({
  tabs,
  activeTab,
  onTabChange,
  className,
}: LiquidTabIndicatorProps) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-1 rounded-xl bg-sage/40 p-1',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative z-10 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200',
              isActive
                ? 'text-forest'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold',
                  isActive
                    ? 'bg-forest/10 text-forest'
                    : 'bg-border text-text-secondary'
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-lg bg-bg-card shadow-sm"
                style={{ zIndex: -1 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
