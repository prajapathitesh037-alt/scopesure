'use client';

import React from 'react';
import { Sun, Home, Radio, Battery, Zap } from 'lucide-react';
import { LiquidSurface } from '@/components/liquid/liquid-surface';

export function ScopePowerFlow() {
  return (
    <LiquidSurface
      as="div"
      intensity="subtle"
      className="rounded-[24px] bg-white border border-[#E3E8E1] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#18241D]">Power Flow</h3>
        <div className="flex items-center gap-3 text-[10px] text-[#55675A] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1F3757]" />
            <span>Channeled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6EB856]" />
            <span>Idle</span>
          </div>
        </div>
      </div>

      {/* Circuit Nodes & Flow Diagram */}
      <div className="relative py-2 select-none flex-1 flex flex-col justify-center">
        {/* Curved connecting flow lines matching reference */}
        <svg
          viewBox="0 0 360 170"
          className="w-full h-auto pointer-events-none absolute inset-0 z-0"
          fill="none"
        >
          {/* Top-Left (Solar) to Center Hub (Blue) */}
          <path
            d="M 95 44 C 145 44, 150 85, 180 85"
            stroke="#1F3757"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Bottom-Left (Consumption) to Center Hub (Green) */}
          <path
            d="M 95 125 C 145 125, 150 85, 180 85"
            stroke="#6EB856"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Center Hub to Top-Right Grid (Blue) */}
          <path
            d="M 180 85 C 210 85, 215 44, 265 44"
            stroke="#1F3757"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Center Hub to Bottom-Right Battery (Green) */}
          <path
            d="M 180 85 C 210 85, 215 125, 265 125"
            stroke="#6EB856"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Nodes Grid Layout */}
        <div className="relative z-10 grid grid-cols-3 gap-2 items-center">
          {/* Column 1: Left Nodes */}
          <div className="space-y-4">
            {/* Solar Production */}
            <div className="rounded-[18px] bg-white border border-[#E3E8E1] p-2.5 shadow-2xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#18211C] text-white mb-1 shadow-xs">
                <Sun className="h-3 w-3" />
              </span>
              <span className="text-[10px] text-[#6E7F73] block font-medium">Solar production</span>
              <span className="text-xs font-bold text-[#18211C] tabular-nums">2.09 kW</span>
            </div>

            {/* Consumption */}
            <div className="rounded-[18px] bg-white border border-[#E3E8E1] p-2.5 shadow-2xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#18211C] text-white mb-1 shadow-xs">
                <Home className="h-3 w-3" />
              </span>
              <span className="text-[10px] text-[#6E7F73] block font-medium">Consumption</span>
              <span className="text-xs font-bold text-[#18211C] tabular-nums">1.72 kW</span>
            </div>
          </div>

          {/* Column 2: Center Hub */}
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#17211D] shadow-md border border-black/10">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#53B546] text-white shadow-2xs">
                <Zap className="h-4 w-4 fill-current" />
              </div>
            </div>
          </div>

          {/* Column 3: Right Nodes */}
          <div className="space-y-4">
            {/* Grid */}
            <div className="rounded-[18px] bg-white border border-[#E3E8E1] p-2.5 shadow-2xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#18211C] text-white mb-1 shadow-xs">
                <Radio className="h-3 w-3" />
              </span>
              <span className="text-[10px] text-[#6E7F73] block font-medium">Gird</span>
              <span className="text-xs font-bold text-[#18211C] tabular-nums">0.68 kW</span>
            </div>

            {/* Battery */}
            <div className="rounded-[18px] bg-white border border-[#E3E8E1] p-2.5 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#18211C] text-white shadow-xs">
                  <Battery className="h-3 w-3" />
                </span>
                <span className="rounded-full bg-[#EBF6EA] px-1.5 py-0.2 text-[9px] font-bold text-[#3B9A4A]">
                  90%
                </span>
              </div>
              <span className="text-[10px] text-[#6E7F73] block font-medium">Battery</span>
              <span className="text-xs font-bold text-[#18211C] tabular-nums">0.45 kW</span>
            </div>
          </div>
        </div>
      </div>
    </LiquidSurface>
  );
}
