import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { Section } from '@/types';
import { 
  Home, 
  Route, 
  FileText, 
  Play, 
  Users, 
  Code, 
  Bot, 
  User,
  LogOut,
  Menu,
  X,
  Flame
} from 'lucide-react';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  onAuthModalOpen: (mode: 'login' | 'register') => void;
}

export function Sidebar({ activeSection, onSectionChange, onAuthModalOpen }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { section: 'dashboard' as Section, icon: Home, label: 'Dashboard', authRequired: true },
    { section: 'roadmaps' as Section, icon: Route, label: 'Learning Roadmaps', authRequired: false },
    { section: 'resources' as Section, icon: FileText, label: 'PDF Resources', authRequired: false },
    { section: 'community' as Section, icon: Users, label: 'Community Lounge', authRequired: false },
    { section: 'problems' as Section, icon: Code, label: 'Daily Problems', authRequired: true },
    { section: 'mentor' as Section, icon: Bot, label: 'AI Mentor', authRequired: false },
    { section: 'profile' as Section, icon: User, label: 'Profile', authRequired: true },
  ];

  const getXPProgress = () => {
    if (!user) return 0;
    return (user.xp / 1000) * 100; // Assuming 1000 XP per level
  };

  const handleNavClick = (section: Section, authRequired: boolean) => {
    if (authRequired && !isAuthenticated) {
      onAuthModalOpen('login');
      return;
    }
    onSectionChange(section);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-700 z-50 transition-all duration-300",
        isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "w-80"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CS</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">CodeSphere</h1>
                  <p className="text-xs text-slate-400">Learning Platform</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-slate-400 hover:text-white lg:hidden"
            >
              {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
          </div>

          {/* User Profile */}
          {isAuthenticated && user && !isCollapsed && (
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{user.firstName} {user.lastName}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Level {user.level}</span>
                    <div className="flex items-center space-x-1">
                      <Flame className="h-3 w-3 text-orange-400" />
                      <span className="text-xs text-orange-400 font-semibold">{user.streak}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>XP Progress</span>
                  <span>{user.xp}/1000</span>
                </div>
                <Progress value={getXPProgress()} className="h-2" />
              </div>
            </div>
          )}

          {/* Guest Profile */}
          {!isAuthenticated && !isCollapsed && (
            <div className="p-6 border-b border-slate-700">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-400 mb-3">Sign in to track your progress</p>
                <Button 
                  onClick={() => onAuthModalOpen('login')}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  Sign In
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.section;
              
              return (
                <button
                  key={item.section}
                  onClick={() => handleNavClick(item.section, item.authRequired)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors",
                    isActive && "bg-violet-600 text-white hover:bg-violet-700",
                    isCollapsed && "justify-center"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          {!isAuthenticated && !isCollapsed && (
            <div className="p-4 space-y-2 border-t border-slate-700">
              <Button 
                onClick={() => onAuthModalOpen('login')}
                variant="outline"
                className="w-full border-violet-600 text-violet-400 hover:bg-violet-600 hover:text-white"
              >
                Login
              </Button>
              <Button 
                onClick={() => onAuthModalOpen('register')}
                className="w-full bg-violet-600 hover:bg-violet-700"
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Logout Button */}
          {isAuthenticated && !isCollapsed && (
            <div className="p-4 border-t border-slate-700">
              <Button 
                onClick={logout}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(false)}
        className="fixed top-4 left-4 z-40 lg:hidden text-slate-400 hover:text-white"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
}
