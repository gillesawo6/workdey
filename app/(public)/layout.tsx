'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { CommandMenu } from '@/components/layout/command-menu';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9]">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <CommandMenu />
    </div>
  );
}
