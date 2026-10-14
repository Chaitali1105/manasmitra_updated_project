'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useStore } from '@/store/useStore';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, accessibility } = useStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen bg-background ${accessibility.largerText ? 'text-lg' : ''} ${accessibility.highContrast ? 'contrast-125' : ''} ${accessibility.reducedMotion ? '[&_*]:!transition-none' : ''}`}>
      <Sidebar />
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
