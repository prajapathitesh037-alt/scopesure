'use client';

import React from 'react';
import { MoreHorizontal, AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { LiquidSurface } from '@/components/liquid/liquid-surface';
import type { Finding } from '@/lib/types';

interface AuditNotificationsCardProps {
  onSelectFinding?: (finding?: Finding) => void;
}

export function AuditNotificationsCard({ onSelectFinding }: AuditNotificationsCardProps) {
  const notifications = [
    {
      id: 'notif-1',
      title: 'Inverter failure detected',
      severity: 'Critical',
      color: 'text-[#E05353]',
      icon: AlertCircle,
    },
    {
      id: 'notif-2',
      title: 'Solar output below expected level',
      severity: 'Warning',
      color: 'text-[#DCA038]',
      icon: AlertTriangle,
    },
    {
      id: 'notif-3',
      title: 'Scheduled maintenance starting soon',
      severity: 'Info',
      color: 'text-[#4485B8]',
      icon: Info,
    },
    {
      id: 'notif-4',
      title: 'System diagnostic check finished',
      severity: 'Info',
      color: 'text-[#47A156]',
      icon: CheckCircle2,
    },
  ];

  return (
    <LiquidSurface
      as="div"
      intensity="subtle"
      className="rounded-[24px] bg-white border border-[#E3E8E1] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[#18241D]">Solar Panel Notifications</h3>
        <button
          className="text-[#78887E] hover:text-[#18241D] p-1"
          aria-label="Notification settings"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* 4 Notification Rows matching screenshot */}
      <div className="space-y-3 my-auto">
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectFinding?.()}
              className="flex items-start gap-2.5 group cursor-pointer"
            >
              <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${item.color}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#1E2922] leading-tight group-hover:text-[#397553] transition-colors">
                  {item.title}
                </p>
                <span className={`text-[10px] font-bold ${item.color}`}>
                  {item.severity}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-1" />
    </LiquidSurface>
  );
}
