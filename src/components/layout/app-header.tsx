'use client';

import React from 'react';
import { Bell, Search, User, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
}

export function AppHeader({ title, breadcrumbs, className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        'flex h-16 items-center justify-between border-b border-border bg-bg-card/80 px-8 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex flex-col">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-text-secondary">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="hover:text-text-primary transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-text-primary">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search projects..."
            className="h-9 w-64 rounded-xl border border-border bg-bg-main pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/10 transition-all"
          />
        </div>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-card text-text-secondary hover:text-text-primary hover:border-forest/30 transition-all"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User avatar */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-white"
          aria-label="User menu"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
