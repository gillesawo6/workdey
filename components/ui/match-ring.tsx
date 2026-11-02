'use client';

import React from 'react';

interface MatchRingProps {
  score: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function MatchRing({
  score,
  size = 'md',
  showLabel = true,
  className = '',
}: MatchRingProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  const sizeConfig = {
    sm: { dimension: 36, strokeWidth: 3, radius: 14, fontSize: 'text-xs', labelSize: 'text-[9px]' },
    md: { dimension: 48, strokeWidth: 3.5, radius: 19, fontSize: 'text-sm', labelSize: 'text-[10px]' },
    lg: { dimension: 64, strokeWidth: 4.5, radius: 26, fontSize: 'text-lg', labelSize: 'text-[11px]' },
  }[size];

  const circumference = 2 * Math.PI * sizeConfig.radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Color selection according to WorkDey Design PDF
  let strokeColor = '#0B7F7A'; // Talent Teal (high match)
  let bgColor = '#E6F5F3';
  let textColor = '#0B7F7A';

  if (clampedScore < 60) {
    strokeColor = '#5A6779'; // Muted Slate
    bgColor = '#F4F6F9';
    textColor = '#3D4A5C';
  } else if (clampedScore < 80) {
    strokeColor = '#2552C2'; // Blue (moderate match)
    bgColor = '#EAF0FC';
    textColor = '#2552C2';
  }

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{ width: sizeConfig.dimension, height: sizeConfig.dimension, backgroundColor: bgColor }}
      >
        <svg
          className="absolute transform -rotate-90"
          width={sizeConfig.dimension}
          height={sizeConfig.dimension}
          viewBox={`0 0 ${sizeConfig.dimension} ${sizeConfig.dimension}`}
        >
          {/* Background circle track */}
          <circle
            cx={sizeConfig.dimension / 2}
            cy={sizeConfig.dimension / 2}
            r={sizeConfig.radius}
            fill="none"
            stroke="#E2E7EE"
            strokeWidth={sizeConfig.strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={sizeConfig.dimension / 2}
            cy={sizeConfig.dimension / 2}
            r={sizeConfig.radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={sizeConfig.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <span
          className={`font-black font-display tnum ${sizeConfig.fontSize} z-10 leading-none`}
          style={{ color: textColor }}
        >
          {clampedScore}
        </span>
      </div>

      {showLabel && (
        <span className={`font-semibold text-[#5A6779] mt-0.5 leading-none ${sizeConfig.labelSize}`}>
          Match
        </span>
      )}
    </div>
  );
}
