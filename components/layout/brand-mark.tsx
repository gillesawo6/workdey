'use client';

import React from 'react';
import Link from 'next/link';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'teal' | 'blue';
  showWordmark?: boolean;
  className?: string;
}

export function BrandMark({
  size = 'md',
  variant = 'light',
  showWordmark = true,
  className = '',
}: BrandMarkProps) {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const bgStyles = {
    light: 'bg-[#0B1C2F] text-white',
    dark: 'bg-[#1D2430] text-white border border-[#223247]',
    teal: 'bg-[#0B7F7A] text-white',
    blue: 'bg-[#2552C2] text-white',
  };

  const textColors = {
    light: 'text-[#0B1C2F]',
    dark: 'text-[#E7ECF3]',
    teal: 'text-[#0B1C2F]',
    blue: 'text-[#0B1C2F]',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none group ${className}`}>
      {/* W Mark with node on upper arm */}
      <div
        className={`${iconSizes[size]} ${bgStyles[variant]} rounded-[7px] flex items-center justify-center font-black relative overflow-hidden transition-transform duration-150 group-hover:scale-[1.02] group-active:scale-[0.98] shadow-sm`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          {/* Stylized W with upper arm node */}
          <path d="M4 6l3.5 12 3.5-9 3.5 9L18 6" />
          <circle cx="18" cy="6" r="2" fill="currentColor" />
        </svg>
      </div>

      {showWordmark && (
        <span
          className={`font-display tracking-tight font-extrabold ${
            size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
          } ${textColors[variant]}`}
        >
          Work<span className={variant === 'dark' ? 'text-white' : 'text-[#0B1C2F]'}>Dey</span>
        </span>
      )}
    </Link>
  );
}
