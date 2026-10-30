'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { LiquidSurface } from '@/components/liquid/liquid-surface';

export function ScopeProductionChart() {
  const data = [
    { day: 'Mon', prod: 85, cons: 60 },
    { day: 'Tue', prod: 135, cons: 95 },
    { day: 'Wed', prod: 110, cons: 75 },
    { day: 'Thu', prod: 100, cons: 80 },
    { day: 'Fri', prod: 130, cons: 90 },
    { day: 'Sat', prod: 80, cons: 55 },
    { day: 'Sun', prod: 145, cons: 100 },
    { day: 'Today', prod: 135, cons: 95 },
  ];

  const maxVal = 200;

  return (
    <LiquidSurface
      as="div"
      intensity="subtle"
      className="rounded-[24px] bg-white border border-[#E3E8E1] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer h-full"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#18241D]">Energy Production</h3>
          <button className="flex items-center gap-1 text-[11px] text-[#55675A] hover:text-[#18241D] font-medium bg-[#F3F6F1] px-2.5 py-1 rounded-lg border border-[#E7ECE4]/60">
            <span>This week</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Legend matching screenshot */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-[#5A6D60] mt-2 mb-1">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-[#52B445]" />
            <span>Energy production</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-[#18211C]" />
            <span>Energy consumption</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Area with Y-Axis */}
      <div className="flex items-end gap-1 h-36 pt-1 select-none">
        {/* Y Axis matching screenshot */}
        <div className="flex flex-col justify-between h-28 text-[9px] text-[#86978C] font-mono pr-1 pb-4 leading-none">
          <span className="text-[8px] text-[#A0B0A5]">kWh</span>
          <span>200</span>
          <span>160</span>
          <span>120</span>
          <span>80</span>
          <span>40</span>
          <span>0</span>
        </div>

        {/* Bars Container */}
        <div className="flex-1 flex items-end justify-between gap-1 border-b border-[#E7ECE4] pb-1 h-28">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
              <div className="flex items-end gap-[3px] h-full justify-center">
                {/* Green Bar (Production) */}
                <div
                  className="w-1.5 sm:w-2 rounded-full bg-[#52B445] transition-all duration-300 group-hover:brightness-110"
                  style={{ height: `${(item.prod / maxVal) * 100}%` }}
                />
                {/* Black Bar (Consumption) */}
                <div
                  className="w-1.5 sm:w-2 rounded-full bg-[#18211C] transition-all duration-300 group-hover:brightness-125"
                  style={{ height: `${(item.cons / maxVal) * 100}%` }}
                />
              </div>
              <span className="mt-1 text-[9px] text-[#718276] font-medium block truncate">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </LiquidSurface>
  );
}
