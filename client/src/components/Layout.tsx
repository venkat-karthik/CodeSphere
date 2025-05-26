import { useState } from 'react';
import { useLocation } from 'wouter';
import { Sidebar } from './Sidebar';
import { AuthModal } from './AuthModal';
import { Button } from '@/components/ui/button';
import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [location] = useLocation();
  const { auth } = useAuth();

  const handleAuthModalOpen = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/roadmaps': 'Learning Roadmaps',
      '/resources': 'PDF Resources',
      '/videos': 'Video Library',
      '/problems': 'Daily Problems',
      '/community': 'Community Lounge',
      '/mentor': 'AI Mentor',
      '/profile': 'Profile',
      '/settings': 'Settings',
    };
    return titles[location] || 'Dashboard';
  };

  // Show welcome page for unauthenticated users
  if (!auth.isAuthenticated && location !== '/') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-8">
        <div className="text-center max-w-4xl">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-white font-bold text-2xl">CS</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 text-white">
              CodeSphere
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                The Ultimate Coding Hub
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              A comprehensive, user-centric platform designed to revolutionize the way coders and developers learn, collaborate, and grow.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleAuthModalOpen('register')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-lg text-lg"
                size="lg"
              >
                Get Started →
              </Button>
              <Button
                onClick={() => handleAuthModalOpen('login')}
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-semibold px-8 py-4 rounded-lg text-lg"
                size="lg"
              >
                Login
              </Button>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🛣️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Curated Learning Paths</h3>
              <p className="text-gray-300">Follow structured roadmaps designed by industry experts</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🎮</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Gamified Learning</h3>
              <p className="text-gray-300">Earn XP, maintain streaks, and level up your skills</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Community Driven</h3>
              <p className="text-gray-300">Connect with peers and learn from experts</p>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultMode={authMode}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar onAuthModalOpen={handleAuthModalOpen} />
      
      <main className="flex-1 lg:ml-80">
        {/* Top Navigation */}
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white ml-12 lg:ml-0">{getPageTitle()}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10 w-64"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <Button variant="ghost" size="sm" className="relative text-gray-400 hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
}
