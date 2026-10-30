'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LiquidSurface } from '@/components/liquid/liquid-surface';

export function ScopeRiskImpact() {
  return (
    <LiquidSurface
      as="div"
      intensity="subtle"
      className="rounded-[24px] bg-white border border-[#E3E8E1] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-[#18241D]">Weather impact</h3>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F3F6F1] text-[#69796E]">
          <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.2]" />
        </span>
      </div>

      {/* Main Weather Metrics Chart Area */}
      <div className="relative flex items-end gap-1.5 h-44 select-none pt-1">
        {/* Y Axis: 10 to 0 with legends */}
        <div className="flex flex-col justify-between h-36 text-[9px] text-[#86978C] font-mono pr-1 pb-4 leading-none">
          <span>10</span>
          <div className="my-auto space-y-1.5 py-1">
            <span className="text-[8px] text-[#8C9C91] block font-sans">Expected</span>
            <div className="flex items-center gap-1 text-[8px] text-[#C28C1A] font-semibold font-sans whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C28C1A]" />
              <span>Current output 4.8 kwh</span>
            </div>
          </div>
          <span>0</span>
        </div>

        {/* 3 Tall Vertical Segmented Capsule Bars matching screenshot */}
        <div className="flex-1 flex items-end justify-between gap-2.5 h-36 pb-3">
          {/* 1. Sunlight Hours */}
          <div className="flex-1 flex flex-col items-center h-full justify-end">
            <span className="rounded bg-[#EBF6EA] px-1.5 py-0.2 text-[8px] font-bold text-[#45A152] mb-1">
              8-12 hr
            </span>
            <div className="relative w-7 sm:w-8 h-24 rounded-full border border-[#DDE4DC] overflow-hidden flex flex-col">
              {/* Green solid block */}
              <div className="w-full h-14 bg-[#62B84D] rounded-t-full" />
              {/* Hatched striped lower block */}
              <div
                className="w-full flex-1 bg-[#F5F8F4]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #CBD6CA 0, #CBD6CA 1.5px, transparent 0, transparent 6px)',
                }}
              />
            </div>
            <span className="mt-1 text-[9px] text-[#6E7F73] font-medium block truncate text-center">
              Sunlight hours
            </span>
          </div>

          {/* 2. Cloud Cover */}
          <div className="flex-1 flex flex-col items-center h-full justify-end">
            <span className="rounded bg-[#EBF6EA] px-1.5 py-0.2 text-[8px] font-bold text-[#45A152] mb-1">
              24-32%
            </span>
            <div className="relative w-7 sm:w-8 h-24 rounded-full border border-[#DDE4DC] overflow-hidden flex flex-col">
              {/* Hatched striped top */}
              <div
                className="w-full h-4 bg-[#F5F8F4]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #CBD6CA 0, #CBD6CA 1.5px, transparent 0, transparent 6px)',
                }}
              />
              {/* Green solid block */}
              <div className="w-full h-13 bg-[#62B84D]" />
              {/* Hatched striped bottom */}
              <div
                className="w-full flex-1 bg-[#F5F8F4]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #CBD6CA 0, #CBD6CA 1.5px, transparent 0, transparent 6px)',
                }}
              />
            </div>
            <span className="mt-1 text-[9px] text-[#6E7F73] font-medium block truncate text-center">
              Cloud cover
            </span>
          </div>

          {/* 3. Temperature */}
          <div className="flex-1 flex flex-col items-center h-full justify-end">
            <span className="rounded bg-[#EBF6EA] px-1.5 py-0.2 text-[8px] font-bold text-[#45A152] mb-1">
              24°C
            </span>
            <div className="relative w-7 sm:w-8 h-24 rounded-full border border-[#DDE4DC] overflow-hidden flex flex-col justify-end">
              {/* Hatched striped top */}
              <div
                className="w-full h-13 bg-[#F5F8F4]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #CBD6CA 0, #CBD6CA 1.5px, transparent 0, transparent 6px)',
                }}
              />
              {/* Green solid bottom */}
              <div className="w-full h-11 bg-[#62B84D] rounded-b-full" />
            </div>
            <span className="mt-1 text-[9px] text-[#6E7F73] font-medium block truncate text-center">
              Temperature
            </span>
          </div>
        </div>
      </div>
    </LiquidSurface>
  );
}
