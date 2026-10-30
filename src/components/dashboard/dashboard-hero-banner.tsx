'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, Search, Bell, LayoutGrid } from 'lucide-react';
import { LiquidSurface } from '@/components/liquid/liquid-surface';

interface DashboardHeroBannerProps {
  onCompareClick?: () => void;
  onUploadClick?: () => void;
}

export function DashboardHeroBanner({ onCompareClick, onUploadClick }: DashboardHeroBannerProps) {
  return (
    <div className="relative rounded-[26px] sm:rounded-[30px] bg-gradient-to-br from-[#CFDDD0] via-[#D5E1D6] to-[#CBD8CC] p-5 sm:p-6 lg:p-7 overflow-hidden border border-[#BFD0C1]/70 text-[#17211D] shadow-xs">
      {/* Top Header Row: Mini Breadcrumb tag on left, Search + Alerts + User Avatar on right */}
      <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
        {/* Left tiny tag matching reference */}
        <div className="flex items-center gap-1.5 text-xs text-[#445549] font-medium tracking-tight">
          <LayoutGrid className="h-3.5 w-3.5 stroke-[2.2] text-[#3D4C41]" />
          <span className="font-semibold text-[13px]">Dashboard</span>
        </div>

        {/* Right header controls matching reference */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Search pill */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E7F73]" />
            <input
              type="text"
              placeholder="Search"
              className="h-8 w-36 sm:w-52 rounded-full border border-white/70 bg-white/95 pl-9 pr-3 text-xs text-[#1D2823] placeholder:text-[#8B9B90] focus:outline-none focus:ring-1 focus:ring-[#397553]/30 shadow-2xs font-medium"
            />
          </div>

          {/* Notification bell pill with red dot */}
          <LiquidSurface
            as="button"
            intensity="subtle"
            className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/95 border border-white/70 text-[#304036] hover:bg-white shadow-2xs cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#E05353] ring-1 ring-white" />
          </LiquidSurface>

          {/* User circular avatar matching reference screenshot */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A2520] text-white shadow-2xs border border-white/80 overflow-hidden shrink-0">
            {/* SVG Illustration of user portrait matching screenshot */}
            <svg viewBox="0 0 36 36" className="w-full h-full fill-current">
              <rect width="36" height="36" fill="#1C2721" />
              {/* Curly hair & head silhouette */}
              <circle cx="18" cy="14" r="7" fill="#E6BA95" />
              <path
                d="M11 15C10 11 12 7 18 7C24 7 26 11 25 15C27 13 26 10 24 8C22 6 14 6 12 8C10 10 9 13 11 15Z"
                fill="#2B1D14"
              />
              <path
                d="M10 32C10 26 13 22 18 22C23 22 26 26 26 32"
                fill="#E6BA95"
              />
              <path
                d="M8 36C8 28 12 24 18 24C24 24 28 28 28 36"
                fill="#7E4E36"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Hero Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
        {/* Left Side: Headlines + 2 Stat Cards */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          <div>
            <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#15201A] tracking-tight leading-[1.05] uppercase font-sans">
              SOLAR PANEL<br />MANAGEMENT
            </h1>
            <p className="mt-2 text-xs sm:text-[13px] text-[#445549] font-medium leading-relaxed">
              Monitor energy production, consumption, and system performance.
            </p>
          </div>

          {/* Two Pill Stat Cards matching reference screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {/* Card 1: Power Efficiency */}
            <div className="rounded-[20px] bg-white/95 backdrop-blur-xs p-4 border border-white/80 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#4C5D52]">Power Efficiency</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E5EFE3] text-[#397553]">
                  <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
                </span>
              </div>
              <div className="text-right">
                <span className="text-[26px] font-extrabold text-[#17211D] tabular-nums block -mt-1 tracking-tight">
                  64%
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-1 h-2 rounded-full bg-[#18201B] overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-[#65BA4A] w-[64%]" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-[#5C6E62] font-medium">
                <span>Surface +3%</span>
                <span>Trim +5%</span>
              </div>
            </div>

            {/* Card 2: Power Consumption */}
            <div className="rounded-[20px] bg-white/95 backdrop-blur-xs p-4 border border-white/80 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#4C5D52]">Power Consumption</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E5EFE3] text-[#397553]">
                  <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[26px] font-extrabold text-[#17211D] tabular-nums tracking-tight">
                  12.8 kWh
                </span>
                <span className="text-[11px] text-[#4FA757] font-bold">↓ 0.08%</span>
              </div>
              {/* Vertical mini green bars strip matching screenshot */}
              <div className="mt-2 flex items-end gap-[3px] h-4">
                {[22, 38, 55, 75, 95, 70, 85, 90, 100, 75, 88, 65, 40, 25, 18, 14, 10].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-[1.5px]"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i < 12 ? '#65BA4A' : '#D5DDD4',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right: The 3D Rendered Isometric Island & Bottom Stats */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[340px] h-[190px] sm:h-[210px] flex items-center justify-center">
            {/* Real 3D Island Crop from Reference Image */}
            <Image
              src="/images/hero-island.png"
              alt="Solar Panel Island 3D Illustration"
              width={340}
              height={210}
              className="object-contain drop-shadow-md select-none pointer-events-none"
              priority
            />
          </div>

          {/* Bottom Right Two Pills matching reference */}
          <div className="w-full flex items-center justify-end gap-2.5 mt-1 sm:mt-2">
            <div className="rounded-[18px] bg-white/85 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 border border-white/80 shadow-2xs text-left">
              <span className="text-sm font-extrabold text-[#18211C] tabular-nums block">36.5 kw</span>
              <span className="text-[9px] text-[#54665A] uppercase tracking-wider font-bold">CURRENT LOAD</span>
            </div>
            <div className="rounded-[18px] bg-white/85 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 border border-white/80 shadow-2xs text-left">
              <span className="text-sm font-extrabold text-[#18211C] tabular-nums block">98.4 %</span>
              <span className="text-[9px] text-[#54665A] uppercase tracking-wider font-bold">SYSTEM HEATH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
