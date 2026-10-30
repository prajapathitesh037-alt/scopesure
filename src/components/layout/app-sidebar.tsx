'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Layers,
  Wallet,
  Store,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { LiquidSurface } from '@/components/liquid/liquid-surface';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { label: 'Quotation Audits', href: '/dashboard/projects', icon: Layers },
  { label: 'Pricing & Scope', href: '/dashboard/quotations', icon: Wallet },
  { label: 'Vendor Matrix', href: '/dashboard/comparison', icon: Store },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[62px] sm:w-[68px] shrink-0 bg-[#17211D] rounded-[24px] sm:rounded-[28px] p-2.5 flex flex-col items-center justify-between shadow-xl text-white my-auto min-h-[580px] h-full select-none border border-black/20">
      {/* Top Glowing Green Atomic / Solar Rosette Logo matching reference */}
      <div className="flex flex-col items-center pt-1.5">
        <Link href="/dashboard" aria-label="SCOPEsure Dashboard">
          <LiquidSurface
            intensity="subtle"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1E2B24] text-[#6CE57A] hover:bg-[#25362E] transition-colors border border-[#6CE57A]/20 shadow-[0_0_12px_rgba(108,229,122,0.25)]"
          >
            {/* Custom SVG Neon Green Solar Rosette Icon matching screenshot */}
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 stroke-[#72EC81] fill-none stroke-[1.8]"
            >
              {/* Center atom nucleus */}
              <circle cx="12" cy="12" r="2.2" className="fill-[#72EC81]" />
              {/* Petal/orbital 1 */}
              <ellipse cx="12" cy="12" rx="8.5" ry="3.2" transform="rotate(0 12 12)" />
              {/* Petal/orbital 2 */}
              <ellipse cx="12" cy="12" rx="8.5" ry="3.2" transform="rotate(60 12 12)" />
              {/* Petal/orbital 3 */}
              <ellipse cx="12" cy="12" rx="8.5" ry="3.2" transform="rotate(120 12 12)" />
            </svg>
          </LiquidSurface>
        </Link>
      </div>

      {/* Middle Nav Icons Stack matching reference screenshot */}
      <nav className="flex flex-col items-center gap-3.5 my-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname === '/' && item.href === '/dashboard') ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href} title={item.label}>
              <LiquidSurface
                intensity="subtle"
                color="rgba(108, 229, 122, 0.4)"
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#24332B] text-white shadow-xs border border-white/10'
                    : 'text-[#6C7D72] hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="h-5 w-5 stroke-[1.8]" />
              </LiquidSurface>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Chevron Arrow Pill */}
      <div className="pb-1.5">
        <Link href="/dashboard/comparison" aria-label="Expand audit details">
          <LiquidSurface
            intensity="subtle"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#202D26] text-[#7E9084] hover:text-white hover:bg-[#283830] transition-colors border border-white/5"
          >
            <ChevronRight className="h-4 w-4" />
          </LiquidSurface>
        </Link>
      </div>
    </aside>
  );
}
