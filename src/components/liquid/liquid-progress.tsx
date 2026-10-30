'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LiquidProgressProps {
  progress: number;
  status: string;
  className?: string;
}

export function LiquidProgress({ progress, status, className }: LiquidProgressProps) {
  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      {/* Circular progress with water fill */}
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--sage-green)"
            strokeWidth="8"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--forest-green)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={339.292}
            initial={{ strokeDashoffset: 339.292 }}
            animate={{ strokeDashoffset: 339.292 * (1 - progress / 100) }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold text-text-primary">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Status text */}
      <motion.p
        key={status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-medium text-text-secondary"
      >
        {status}
      </motion.p>

      {/* Water wave bar */}
      <div className="h-2 w-64 overflow-hidden rounded-full bg-sage/50">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-water to-forest"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
