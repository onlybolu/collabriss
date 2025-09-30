'use client';

import { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from '@/app/context/AppContext';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/(routes)/(app)/components-dashboard/Header';
import Loader from '@/app/components/Loader';
import Walkthrough from '@/app/(routes)/(app)/components-dashboard/Walkthrough';

function ProtectedLayout({ children }) {
  const { isLoading, user, profile, showWalkthrough, setShowWalkthrough } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Effect to track window size and determine if the view is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's `md` breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

    useEffect(() => {
      const hasSeenWalkthrough = localStorage.getItem('walkthroughCompleted');
      if (!hasSeenWalkthrough) {
        setShowWalkthrough(true);
      }
    }, [setShowWalkthrough]);
  
    const handleCloseWalkthrough = () => {
      setShowWalkthrough(false);
      localStorage.setItem('walkthroughCompleted', 'true');
    };

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    // Although the provider redirects, this is a fallback
    // and prevents rendering children before redirect happens.
    return <Loader />;
  }

  return (
    <div className="flex h-screen bg-slate-100">
       <Walkthrough isOpen={showWalkthrough} onClose={handleCloseWalkthrough} />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isMobile ? '0' : (isCollapsed ? '5rem' : '16rem'),
        }}
      >
        {profile && (
          <Header
            profile={profile}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }) {
  return (
    <AppProvider>
      <ProtectedLayout>{children}</ProtectedLayout>
    </AppProvider>
  );
}