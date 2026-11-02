'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'employer' | 'admin' | 'secondary' | 'tertiary' | 'danger' | 'dark';
  size?: 'sm' | 'default' | 'lg';
  href?: string;
  showArrow?: boolean;
  loading?: boolean;
  microcopy?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'default',
      href,
      showArrow = false,
      loading = false,
      microcopy,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Height & padding scale from PDF Page 4: Small 36, Default 44, Large 52
    const sizeStyles = {
      sm: 'h-9 px-3.5 text-xs',
      default: 'h-11 px-5 text-xs',
      lg: 'h-[52px] px-6 text-sm',
    };

    // Color & shadow variants from PDF Page 4
    const variantStyles = {
      primary:
        'bg-[#0B7F7A] text-white hover:bg-[#14A89E] active:translate-y-[1px] focus:ring-2 focus:ring-[#0B7F7A] focus:ring-offset-2 shadow-sm',
      employer:
        'bg-[#2552C2] text-white hover:bg-[#1E429F] active:translate-y-[1px] focus:ring-2 focus:ring-[#2552C2] focus:ring-offset-2 shadow-sm',
      admin:
        'bg-[#E8A317] text-[#0B1C2F] font-bold hover:bg-[#d69514] active:translate-y-[1px] focus:ring-2 focus:ring-[#E8A317] focus:ring-offset-2 shadow-sm',
      secondary:
        'bg-white text-[#0B1C2F] border border-[#E2E7EE] hover:bg-[#F4F6F9] hover:border-[#CBD5E1] active:translate-y-[1px] focus:ring-2 focus:ring-[#0B1C2F]/20 shadow-sm',
      tertiary:
        'bg-transparent text-[#0B7F7A] hover:underline p-0 h-auto font-semibold active:translate-y-[1px]',
      danger:
        'bg-[#B42318] text-white hover:bg-[#961a10] active:translate-y-[1px] focus:ring-2 focus:ring-[#B42318] focus:ring-offset-2 shadow-sm',
      dark:
        'bg-[#1D2430] text-white border border-[#223247] hover:bg-[#252E3D] active:translate-y-[1px] shadow-sm',
    };

    const baseStyles =
      'inline-flex items-center justify-center font-bold tracking-tight rounded-lg select-none transition-all duration-150 outline-none group disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

    const buttonContent = (
      <>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : null}
        <span>{children}</span>
        {showArrow && !loading && (
          <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-150 group-hover:translate-x-[3px]" />
        )}
      </>
    );

    if (href) {
      return (
        <div className="inline-flex flex-col items-start">
          <Link
            href={href}
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
          >
            {buttonContent}
          </Link>
          {microcopy && (
            <span className="text-[11px] text-[#5A6779] mt-1.5 leading-none">
              {microcopy}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="inline-flex flex-col items-start">
        <button
          ref={ref}
          disabled={disabled || loading}
          className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
          {...props}
        >
          {buttonContent}
        </button>
        {microcopy && (
          <span className="text-[11px] text-[#5A6779] mt-1.5 leading-none">
            {microcopy}
          </span>
        )}
      </div>
    );
  }
);

Button.displayName = 'Button';
