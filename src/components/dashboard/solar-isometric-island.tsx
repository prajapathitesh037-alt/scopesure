'use client';

import React from 'react';

interface SolarIsometricIslandProps {
  className?: string;
  variant?: 'large' | 'compact';
}

export function SolarIsometricIsland({ className = '', variant = 'large' }: SolarIsometricIslandProps) {
  if (variant === 'compact') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 320 220"
          className="w-full h-auto drop-shadow-md select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="islandTopCompact" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8FC29B" />
              <stop offset="100%" stopColor="#4A8A60" />
            </linearGradient>
            <linearGradient id="islandSoilCompact" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3C5E48" />
              <stop offset="100%" stopColor="#253A2C" />
            </linearGradient>
            <linearGradient id="panelGradCompact" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2C4E65" />
              <stop offset="100%" stopColor="#172935" />
            </linearGradient>
          </defs>

          {/* Floating Island Rock/Soil Base */}
          <path
            d="M160 185 L50 120 L160 80 L270 120 Z"
            fill="url(#islandTopCompact)"
          />
          <path
            d="M50 120 L160 185 L160 210 L50 145 Z"
            fill="url(#islandSoilCompact)"
          />
          <path
            d="M160 185 L270 120 L270 145 L160 210 Z"
            fill="#1E2F23"
          />

          {/* Trees */}
          <circle cx="80" cy="110" r="14" fill="#3D7E54" />
          <circle cx="95" cy="105" r="12" fill="#4E9969" />
          <circle cx="230" cy="115" r="15" fill="#3D7E54" />
          <circle cx="245" cy="120" r="10" fill="#2E6342" />

          {/* Solar Panel Array on Grass */}
          <g transform="translate(115, 95)">
            <polygon points="0,25 45,5 90,25 45,45" fill="url(#panelGradCompact)" stroke="#83D9D5" strokeWidth="0.8" />
            <line x1="22" y1="35" x2="67" y2="15" stroke="#83D9D5" strokeWidth="0.5" opacity="0.7" />
            <line x1="45" y1="5" x2="45" y2="45" stroke="#83D9D5" strokeWidth="0.5" opacity="0.7" />
          </g>

          {/* Wind Turbine */}
          <g transform="translate(200, 45)">
            <line x1="0" y1="50" x2="0" y2="0" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy="0" r="3" fill="#DCE7D8" />
            <line x1="0" y1="0" x2="-18" y2="-12" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="0" y1="0" x2="18" y2="-12" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="0" y1="0" x2="0" y2="22" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* Mini modern building */}
          <polygon points="120,80 145,65 170,80 145,95" fill="#FFFFFF" />
          <polygon points="120,80 145,95 145,115 120,100" fill="#DCE7DF" />
          <polygon points="145,95 170,80 170,100 145,115" fill="#BCC8C0" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 520 380"
        className="w-full h-auto drop-shadow-xl overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="islandGrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9FD4AD" />
            <stop offset="60%" stopColor="#5EA776" />
            <stop offset="100%" stopColor="#3C7F53" />
          </linearGradient>

          <linearGradient id="islandRockLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#415C49" />
            <stop offset="100%" stopColor="#223328" />
          </linearGradient>

          <linearGradient id="islandRockRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#314738" />
            <stop offset="100%" stopColor="#1A281F" />
          </linearGradient>

          <linearGradient id="solarGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E506B" />
            <stop offset="50%" stopColor="#1B3549" />
            <stop offset="100%" stopColor="#0F202D" />
          </linearGradient>

          <filter id="glowAccent" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Floating clouds behind */}
        <ellipse cx="110" cy="100" rx="45" ry="14" fill="#FFFFFF" opacity="0.4" />
        <ellipse cx="430" cy="80" rx="55" ry="16" fill="#FFFFFF" opacity="0.4" />

        {/* 3 Wind Turbines in Background */}
        {/* Turbine 1 (Tall Left) */}
        <g transform="translate(280, 70)">
          <line x1="0" y1="120" x2="0" y2="0" stroke="#F0F4F1" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="0" cy="0" r="4.5" fill="#397553" />
          <line x1="0" y1="0" x2="-35" y2="-22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="0" y1="0" x2="35" y2="-22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="0" y1="0" x2="0" y2="40" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Turbine 2 (Center Mid) */}
        <g transform="translate(325, 95)">
          <line x1="0" y1="100" x2="0" y2="0" stroke="#F0F4F1" strokeWidth="3" strokeLinecap="round" />
          <circle cx="0" cy="0" r="3.5" fill="#397553" />
          <line x1="0" y1="0" x2="-28" y2="-18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="0" x2="28" y2="-18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="0" x2="0" y2="32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Turbine 3 (Right Small) */}
        <g transform="translate(365, 115)">
          <line x1="0" y1="80" x2="0" y2="0" stroke="#E2EAE4" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="0" cy="0" r="3" fill="#397553" />
          <line x1="0" y1="0" x2="-22" y2="-14" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="0" y1="0" x2="22" y2="-14" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="0" y1="0" x2="0" y2="25" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Transmission / Radar Tower */}
        <g transform="translate(230, 110)">
          <polygon points="0,90 -12,90 -2,0 2,0 12,90" stroke="#718679" strokeWidth="1.5" fill="none" />
          <line x1="-8" y1="60" x2="8" y2="60" stroke="#718679" strokeWidth="1" />
          <line x1="-5" y1="35" x2="5" y2="35" stroke="#718679" strokeWidth="1" />
          <circle cx="0" cy="-5" r="5" fill="#83D9D5" opacity="0.8" filter="url(#glowAccent)" />
        </g>

        {/* Floating Island Diamond Base */}
        {/* Grass Top Surface */}
        <polygon
          points="260,195 90,265 260,335 430,265"
          fill="url(#islandGrass)"
          stroke="#B5DEBF"
          strokeWidth="1.5"
        />

        {/* Left Rocky Underbody */}
        <polygon
          points="90,265 260,335 260,370 90,295"
          fill="url(#islandRockLeft)"
        />

        {/* Right Rocky Underbody */}
        <polygon
          points="260,335 430,265 430,295 260,370"
          fill="url(#islandRockRight)"
        />

        {/* Bush and Tree Clusters Around Rim */}
        <circle cx="105" cy="255" r="16" fill="#326B45" />
        <circle cx="120" cy="250" r="14" fill="#4B9463" />
        <circle cx="138" cy="255" r="12" fill="#58A873" />

        <circle cx="410" cy="255" r="16" fill="#295938" />
        <circle cx="395" cy="260" r="14" fill="#3C7F53" />
        <circle cx="380" cy="268" r="13" fill="#539E6C" />

        <circle cx="260" cy="328" r="12" fill="#347048" />
        <circle cx="275" cy="325" r="10" fill="#4A9362" />
        <circle cx="245" cy="325" r="11" fill="#4A9362" />

        {/* Modern Building / Substation Base */}
        <g transform="translate(195, 175)">
          {/* Main House Roof */}
          <polygon points="65,45 130,10 195,45 130,80" fill="#E4EBE6" stroke="#D3DDD5" strokeWidth="1" />
          {/* Main House Left Wall */}
          <polygon points="65,45 130,80 130,125 65,90" fill="#F8FAF9" stroke="#E2EAE4" strokeWidth="1" />
          {/* Main House Right Wall */}
          <polygon points="130,80 195,45 195,90 130,125" fill="#D3DED6" stroke="#C4D1C7" strokeWidth="1" />

          {/* Roof Solar Panels Matrix (Slanted on house roof) */}
          <g transform="translate(75, 25)">
            <polygon points="20,25 60,5 105,25 65,45" fill="url(#solarGlass)" stroke="#83D9D5" strokeWidth="1" />
            {/* Grid lines on panels */}
            <line x1="30" y1="20" x2="75" y2="40" stroke="#83D9D5" strokeWidth="0.6" opacity="0.8" />
            <line x1="40" y1="15" x2="85" y2="35" stroke="#83D9D5" strokeWidth="0.6" opacity="0.8" />
            <line x1="50" y1="10" x2="95" y2="30" stroke="#83D9D5" strokeWidth="0.6" opacity="0.8" />
            <line x1="42" y1="35" x2="82" y2="15" stroke="#83D9D5" strokeWidth="0.6" opacity="0.8" />
          </g>

          {/* Windows on house */}
          <polygon points="80,68 100,78 100,98 80,88" fill="#83D9D5" opacity="0.4" />
          <polygon points="145,95 175,80 175,98 145,113" fill="#83D9D5" opacity="0.4" />
        </g>

        {/* Ground Mounted Solar Array On Grass Terrace (Left Forefront) */}
        <g transform="translate(145, 230)">
          {/* Backing Racks */}
          <line x1="25" y1="40" x2="25" y2="28" stroke="#4B6353" strokeWidth="2.5" />
          <line x1="75" y1="15" x2="75" y2="5" stroke="#4B6353" strokeWidth="2.5" />
          <line x1="125" y1="40" x2="125" y2="28" stroke="#4B6353" strokeWidth="2.5" />

          {/* Primary Array Surface */}
          <polygon
            points="10,32 75,0 140,32 75,64"
            fill="url(#solarGlass)"
            stroke="#83D9D5"
            strokeWidth="1.2"
          />

          {/* Solar Grid Gridlines */}
          <line x1="32" y1="21" x2="97" y2="53" stroke="#83D9D5" strokeWidth="0.8" opacity="0.8" />
          <line x1="53" y1="11" x2="118" y2="43" stroke="#83D9D5" strokeWidth="0.8" opacity="0.8" />
          <line x1="42" y1="48" x2="108" y2="16" stroke="#83D9D5" strokeWidth="0.8" opacity="0.8" />
          <line x1="26" y1="40" x2="92" y2="8" stroke="#83D9D5" strokeWidth="0.8" opacity="0.8" />
        </g>

        {/* Small floating energy data node pills around island */}
        <g transform="translate(320, 290)">
          <circle cx="0" cy="0" r="6" fill="#397553" />
          <circle cx="0" cy="0" r="10" stroke="#83D9D5" strokeWidth="1.5" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
