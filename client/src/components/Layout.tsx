import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { AuthModals } from './AuthModals';
import { Section } from '../types';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../contexts/NotificationsContext';
import { LiveClasses } from './LiveClasses';
import { SphereMap } from './SphereMap';
import { CodeSandbox } from './CodeSandbox';

interface LayoutProps {
  children: React.ReactNode;
  currentSection: Section;
  onSectionChange: (section: Section) => void;
}

export function Layout({ children, currentSection, onSectionChange }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const getSectionTitle = (section: Section): string => {
    const titles: Record<Section, string> = {
      dashboard: 'Dashboard',
      'admin-dashboard': 'Admin Dashboard',
      roadmaps: 'Learning Roadmaps',
      resources: 'PDF Resources',
      videos: 'Video Library',
      problems: 'Daily Problems',
      community: 'Community Lounge',
      studio: 'Project Studio',
      sandbox: 'App Sandbox',
      mentor: 'AI Mentor',
      'sphere-map': 'Sphere Map',
      analytics: 'Analytics',
      'platform-analytics': 'Platform Analytics',
      'live-classes': 'Live Classes',
      profile: 'Profile',
      settings: 'Settings'
    };
    return titles[section];
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        currentSection={currentSection}
        onSectionChange={onSectionChange}
        onAuthModalOpen={openAuthModal}
      />

      <main className="flex-1 lg:ml-72">
        {/* Top Navigation */}
        <header className="bg-card/50 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold ml-12 lg:ml-0">
                {getSectionTitle(currentSection)}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-background border border-border rounded-lg px-4 py-2 pl-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              
              {isAuthenticated && (
                <button className="relative text-muted-foreground hover:text-foreground transition-colors">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {currentSection === 'live-classes' ? <LiveClasses /> :
           currentSection === 'sphere-map' ? <SphereMap /> :
           currentSection === 'sandbox' ? <CodeSandbox /> : children}
        </div>
      </main>

      <AuthModals
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
}
