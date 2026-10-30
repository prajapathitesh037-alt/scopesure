'use client';

import React from 'react';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { LiquidSurface } from '@/components/liquid/liquid-surface';

export function AssetSystemCard() {
  return (
    <LiquidSurface
      as="div"
      intensity="subtle"
      className="rounded-[24px] bg-white border border-[#E3E8E1] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-[#18241D]">Asset System</h3>
        <button className="text-[#78887E] hover:text-[#18241D] p-1" aria-label="Asset options">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Center Floating Island Graphic Crop from Reference Image */}
      <div className="relative my-1 h-36 flex items-center justify-center select-none">
        <Image
          src="/images/asset-island.png"
          alt="Asset System Floating Earth Island"
          width={185}
          height={130}
          className="object-contain drop-shadow-md pointer-events-none"
          priority
        />

        {/* Tag 1: Smart grid */}
        <div className="absolute top-2 left-2 bg-[#17211D] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-black/10">
          <span>Smart grid</span>
        </div>

        {/* Tag 2: Solar array */}
        <div className="absolute bottom-4 left-2 bg-[#17211D] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-black/10">
          <span>Solar array</span>
        </div>

        {/* Tag 3: Wind farm */}
        <div className="absolute bottom-5 right-2 bg-[#17211D] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-black/10">
          <span>Wind farm</span>
        </div>
      </div>

      {/* Bottom Status Active Badge */}
      <div className="flex items-center justify-center border-t border-[#EEF2EB] pt-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#5D6F63] font-medium">
          <span>Status</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF6EA] px-2 py-0.5 text-[10px] font-bold text-[#44A051]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#44A051]" />
            Active
          </span>
        </div>
      </div>
    </LiquidSurface>
  );
}
