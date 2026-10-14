'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useStore } from '@/store/useStore';
import LanguageRuntime from '@/components/providers/LanguageRuntime';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const hasCompletedAssessment = useStore((state) => state.hasCompletedAssessment);
  const assessmentSkipped = useStore((state) => state.assessmentSkipped);

  useEffect(() => {
    if (pathname !== '/signup' && !isAuthenticated) router.replace('/signup');
    if (
      isAuthenticated &&
      pathname !== '/signup' &&
      pathname !== '/assessment' &&
      !hasCompletedAssessment &&
      !assessmentSkipped
    ) {
      router.replace('/assessment');
    }
  }, [assessmentSkipped, hasCompletedAssessment, isAuthenticated, pathname, router]);

  if (pathname === '/signup') return <><LanguageRuntime />{children}</>;
  if (!isAuthenticated) return <><LanguageRuntime /><div className="min-h-screen bg-background" /></>;
  return <><LanguageRuntime /><MainLayout>{children}</MainLayout></>;
}