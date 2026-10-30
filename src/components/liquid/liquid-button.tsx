'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LiquidSurface } from './liquid-surface';

interface LiquidButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-forest text-white hover:bg-forest/90 shadow-sm',
  secondary: 'bg-bg-card text-text-primary border border-border hover:bg-sage/30',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-sage/20',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export function LiquidButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  icon,
}: LiquidButtonProps) {
  return (
    <LiquidSurface
      as="button"
      intensity="subtle"
      color={variant === 'primary' ? 'rgba(255,255,255,0.3)' : 'var(--water-accent)'}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </LiquidSurface>
  );
}
