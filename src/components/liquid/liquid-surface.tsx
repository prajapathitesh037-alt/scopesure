'use client';

import React, { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface LiquidSurfaceProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  color?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  as?: 'div' | 'button';
}

const intensityConfig = {
  subtle: { scale: 2, opacity: 0.15, duration: 600 },
  medium: { scale: 3, opacity: 0.25, duration: 800 },
  strong: { scale: 4, opacity: 0.35, duration: 1000 },
};

export function LiquidSurface({
  children,
  className,
  intensity = 'medium',
  color = 'var(--water-accent)',
  disabled = false,
  onClick,
  as: Component = 'div',
}: LiquidSurfaceProps) {
  const containerRef = useRef<HTMLDivElement | HTMLButtonElement | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const config = intensityConfig[intensity];

  const createRipple = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      if (disabled || prefersReducedMotion) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      let x: number, y: number;

      if ('clientX' in e) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      } else {
        x = rect.width / 2;
        y = rect.height / 2;
      }

      const size = Math.max(rect.width, rect.height);
      const id = nextId.current++;

      setRipples((prev) => [...prev, { id, x, y, size }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, config.duration);
    },
    [disabled, prefersReducedMotion, config.duration]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<any>) => {
      createRipple(e);
      onClick?.(e);
    },
    [createRipple, onClick]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<any>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        createRipple(e);
      }
    },
    [createRipple]
  );

  return (
    <Component
      ref={containerRef as any}
      className={cn('relative overflow-hidden', className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ cursor: disabled ? 'default' : 'pointer' }}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            opacity: config.opacity,
            transform: 'scale(0)',
            animation: `liquid-ripple ${config.duration}ms ease-out forwards`,
          }}
        />
      ))}
    </Component>
  );
}
