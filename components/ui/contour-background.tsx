'use client';

import React from 'react';

interface ContourBackgroundProps {
  className?: string;
  variant?: 'subtle' | 'hero' | 'accent-teal' | 'accent-blue';
}

export function ContourBackground({ className = '', variant = 'hero' }: ContourBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Ambient Lighting Gradients */}
      {variant === 'hero' && (
        <>
          <div className="absolute -top-32 right-1/4 w-[520px] h-[520px] bg-[#14A89E]/10 rounded-full blur-[100px] transform-gpu" />
          <div className="absolute top-1/3 -left-32 w-[460px] h-[460px] bg-[#2552C2]/8 rounded-full blur-[90px] transform-gpu" />
        </>
      )}

      {variant === 'accent-teal' && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#0B7F7A]/8 rounded-full blur-[110px] transform-gpu" />
      )}

      {variant === 'accent-blue' && (
        <div className="absolute -top-24 right-10 w-[500px] h-[400px] bg-[#2552C2]/8 rounded-full blur-[110px] transform-gpu" />
      )}

      {/* Organic Contour Topographic Curves (Inspired by Mt. Cameroon & Atlantic Coastal Shelf) */}
      <svg
        className="absolute w-full h-full opacity-[0.06] stroke-[#0B1C2F]"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-100,200 C300,120 600,320 900,180 C1200,40 1400,240 1600,160"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <path
          d="M-80,280 C320,200 620,400 920,260 C1220,120 1420,320 1620,240"
          strokeWidth="1"
        />
        <path
          d="M-60,360 C340,280 640,480 940,340 C1240,200 1440,400 1640,320"
          strokeWidth="1.4"
        />
        <path
          d="M-40,440 C360,360 660,560 960,420 C1260,280 1460,480 1660,400"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
        <path
          d="M-20,520 C380,440 680,640 980,500 C1280,360 1480,560 1680,480"
          strokeWidth="1.2"
        />
        <path
          d="M0,600 C400,520 700,720 1000,580 C1300,440 1500,640 1700,560"
          strokeWidth="1"
        />
        <path
          d="M20,680 C420,600 720,800 1020,660 C1320,520 1520,720 1720,640"
          strokeWidth="1.5"
        />
        {/* Coastal Shelf Contour Rings */}
        <ellipse
          cx="1100"
          cy="300"
          rx="240"
          ry="140"
          transform="rotate(-15 1100 300)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <ellipse
          cx="1100"
          cy="300"
          rx="320"
          ry="190"
          transform="rotate(-15 1100 300)"
          strokeWidth="1.2"
        />
        <ellipse
          cx="200"
          cy="750"
          rx="260"
          ry="160"
          transform="rotate(10 200 750)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
