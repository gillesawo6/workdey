'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth/auth-context';
import { TalentProvider } from '@/lib/talent/talent-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TalentProvider>{children}</TalentProvider>
    </AuthProvider>
  );
}
