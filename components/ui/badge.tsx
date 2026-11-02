'use client';

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'open'
    | 'shortlisted'
    | 'interview'
    | 'pending'
    | 'rejected'
    | 'hybrid'
    | 'remote'
    | 'onsite'
    | 'verified'
    | 'default';
  size?: 'sm' | 'default';
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'default',
  children,
  className = '',
  ...props
}: BadgeProps) {
  const variantStyles = {
    open: 'bg-[#E6F5F3] text-[#0B7F7A] border border-[#0B7F7A]/20',
    shortlisted: 'bg-[#E6F5F3] text-[#0B7F7A] border border-[#0B7F7A]/20',
    interview: 'bg-[#EAF0FC] text-[#2552C2] border border-[#2552C2]/20',
    pending: 'bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]/30',
    rejected: 'bg-[#FEE2E2] text-[#B42318] border border-[#B42318]/20',
    hybrid: 'bg-[#F4F6F9] text-[#5A6779] border border-[#E2E7EE]',
    remote: 'bg-[#0B1C2F] text-white border border-[#223247]',
    onsite: 'bg-[#F4F6F9] text-[#5A6779] border border-[#E2E7EE]',
    verified: 'bg-[#E6F5F3] text-[#1A7F4B] border border-[#1A7F4B]/20',
    default: 'bg-[#F4F6F9] text-[#3D4A5C] border border-[#E2E7EE]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    default: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full select-none capitalize ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
