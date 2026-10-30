'use client';

import React from 'react';
import { Zap, Cloud, Droplet } from 'lucide-react';

export function EnergyMetricsStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      {/* 1. Energy Yield */}
      <div className="rounded-[18px] bg-white border border-[#E3E8E1] px-3.5 py-2 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#55675A]" />
          <div>
            <div className="text-xs font-bold text-[#18211C] tabular-nums leading-tight">
              3,100 <span className="text-[10px] font-normal text-[#66786C]">kW</span>
            </div>
            <span className="text-[9px] text-[#718276] block font-medium">Energy Yield</span>
          </div>
        </div>
        <span className="rounded-full bg-[#EBF6EA] px-1.5 py-0.5 text-[9px] font-bold text-[#46A253]">
          ^ 28%
        </span>
      </div>

      {/* 2. Carbon Offset */}
      <div className="rounded-[18px] bg-white border border-[#E3E8E1] px-3.5 py-2 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#55675A] font-sans">CO₂</span>
          <div>
            <div className="text-xs font-bold text-[#18211C] tabular-nums leading-tight">
              36.5 <span className="text-[10px] font-normal text-[#66786C]">tCO₂</span>
            </div>
            <span className="text-[9px] text-[#718276] block font-medium">Carbon offset</span>
          </div>
        </div>
        <span className="rounded-full bg-[#FCEAEA] px-1.5 py-0.5 text-[9px] font-bold text-[#DF5858]">
          1.04%
        </span>
      </div>

      {/* 3. Water Saved */}
      <div className="rounded-[18px] bg-white border border-[#E3E8E1] px-3.5 py-2 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <Droplet className="h-4 w-4 text-[#55675A]" />
          <div>
            <div className="text-xs font-bold text-[#18211C] tabular-nums leading-tight">
              3,100 <span className="text-[10px] font-normal text-[#66786C]">m³</span>
            </div>
            <span className="text-[9px] text-[#718276] block font-medium">Water saved</span>
          </div>
        </div>
        <span className="rounded-full bg-[#EBF6EA] px-1.5 py-0.5 text-[9px] font-bold text-[#46A253]">
          ^ 18%
        </span>
      </div>
    </div>
  );
}
