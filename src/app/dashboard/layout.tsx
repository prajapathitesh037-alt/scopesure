import React from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#E5E8E1] p-2.5 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center font-sans antialiased text-[#17211D] selection:bg-[#D5E1D6] selection:text-[#17211D]">
      {/* Outer Rounded White Dashboard Container matching reference screenshot */}
      <div className="w-full max-w-[1400px] bg-white rounded-[30px] sm:rounded-[36px] p-3 sm:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.07)] border border-[#D9DFD7] flex gap-3 sm:gap-4 overflow-hidden min-h-[760px]">
        {/* Left Dark Navigation Rail */}
        <AppSidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto max-h-[94vh] pr-1 scrollbar-thin scrollbar-thumb-[#CFDCD0] scrollbar-track-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
