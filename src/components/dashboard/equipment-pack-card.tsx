'use client';

import React from 'react';
import Image from 'next/image';
import { Zap } from 'lucide-react';
import { LiquidSurface } from '@/components/liquid/liquid-surface';

interface EquipmentPackCardProps {
  onClick?: () => void;
}

export function EquipmentPackCard({ onClick }: EquipmentPackCardProps) {
  return (
    <LiquidSurface
      as="div"
      intensity="subtle"
      onClick={onClick}
      className="rounded-[24px] bg-white border border-[#E3E8E1] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer h-full"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#4EB440] text-white shadow-2xs">
              <Zap className="h-3 w-3 fill-current" />
            </span>
            <span className="text-xs font-bold text-[#18221D]">EnergyPack</span>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF6EA] px-2.5 py-0.5 text-[10px] font-semibold text-[#42A150]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#42A150]" />
            Active
          </span>
        </div>

        <h3 className="text-sm font-semibold text-[#18241D] mt-0.5">Solar Panel</h3>
      </div>

      {/* Middle Specs & Solar Rack Image */}
      <div className="grid grid-cols-12 items-center gap-2 my-2">
        <div className="col-span-7 space-y-1">
          <span className="text-[11px] text-[#69796E] block font-medium">Power Usage</span>
          <div className="text-[26px] font-extrabold text-[#18211C] tabular-nums tracking-tight leading-none">
            90.45
          </div>
          <span className="text-[10px] text-[#78887E] block font-medium">1 hour usage 8.5 kWh</span>

          {/* Battery Pill */}
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#EBF6EA] px-2.5 py-0.5 text-[11px] font-semibold text-[#3C9C4B]">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#3C9C4B] text-white text-[9px] font-bold">
              +
            </span>
            <span>90% Battery</span>
          </div>
        </div>

        {/* Freestanding 3D Solar Panel Image */}
        <div className="col-span-5 relative flex items-center justify-center h-24">
          <Image
            src="/images/solar-rack.png"
            alt="Solar Panel Rack 3D Render"
            width={130}
            height={95}
            className="object-contain drop-shadow-sm select-none pointer-events-none"
            priority
          />
        </div>
      </div>

      {/* 3 Bottom Metrics matching reference */}
      <div className="grid grid-cols-3 gap-1 border-t border-[#EEF2EB] pt-3 text-center">
        <div className="border-r border-[#EEF2EB] pr-1">
          <span className="text-xs font-bold text-[#18211C] block tabular-nums">134 kWh</span>
          <span className="text-[10px] text-[#718175] font-medium">Today</span>
        </div>
        <div className="border-r border-[#EEF2EB] pr-1">
          <span className="text-xs font-bold text-[#18211C] block tabular-nums">835 kWh</span>
          <span className="text-[10px] text-[#718175] font-medium">This month</span>
        </div>
        <div>
          <span className="text-xs font-bold text-[#18211C] block tabular-nums">238 MWh</span>
          <span className="text-[10px] text-[#718175] font-medium">All time</span>
        </div>
      </div>
    </LiquidSurface>
  );
}
