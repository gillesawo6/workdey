'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: 'e0' | 'e1' | 'e2' | 'e3' | 'e4';
  glass?: 1 | 2 | 3;
  interactive?: boolean;
  accent?: 'teal' | 'blue' | 'amber' | 'none';
}

export function Card({
  children,
  elevation = 'e1',
  glass,
  interactive = false,
  accent = 'none',
  className = '',
  ...props
}: CardProps) {
  const elevationClass = {
    e0: 'shadow-none',
    e1: 'shadow-[0_1px_2px_rgba(11,28,47,0.04),0_1px_3px_rgba(11,28,47,0.06)]',
    e2: 'shadow-[0_4px_6px_-1px_rgba(11,28,47,0.08),0_2px_4px_-1px_rgba(11,28,47,0.04)]',
    e3: 'shadow-[0_10px_15px_-3px_rgba(11,28,47,0.09),0_4px_6px_-2px_rgba(11,28,47,0.04)]',
    e4: 'shadow-[0_20px_25px_-5px_rgba(11,28,47,0.12),0_10px_10px_-5px_rgba(11,28,47,0.04)]',
  }[elevation];

  const glassClass = glass
    ? {
        1: 'bg-white/60 backdrop-blur-md border border-white/60',
        2: 'bg-white/75 backdrop-blur-lg border border-white/80',
        3: 'bg-white/90 backdrop-blur-xl border border-white',
      }[glass]
    : 'bg-white border border-[#E2E7EE]';

  const accentClass = {
    none: '',
    teal: 'border-t-2 border-t-[#0B7F7A]',
    blue: 'border-t-2 border-t-[#2552C2]',
    amber: 'border-t-2 border-t-[#E8A317]',
  }[accent];

  const interactiveClass = interactive
    ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer'
    : '';

  return (
    <div
      className={`rounded-[10px] ${glassClass} ${elevationClass} ${accentClass} ${interactiveClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 sm:p-5 border-b border-[#E2E7EE] ${className}`}>{children}</div>;
}

export function CardBody({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 sm:p-5 border-t border-[#E2E7EE] bg-[#F4F6F9]/50 rounded-b-[10px] ${className}`}>{children}</div>;
}
