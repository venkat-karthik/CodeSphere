import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { ProgressBar } from './ProgressBar';
import {
  Home,
  Route,
  FileText,
  Play,
  Code,
  Users,
  Brain,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Learning Roadmaps', href: '/roadmaps', icon: Route },
  { name: 'PDF Resources', href: '/resources', icon: FileText },
  { name: 'Video Library', href: '/videos', icon: Play },
  { name: 'Daily Problems', href: '/problems', icon: Code },
  { name: 'Community Lounge', href: '/community', icon: Users },
  { name: 'AI Mentor', href: '/mentor', icon: Brain },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  onAuthModalOpen: (mode: 'login' | 'register') => void;
}

export function Sidebar({ onAuthModalOpen }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [location] = useLocation();
  const { auth, logout } = useAuth();

  const xpProgress = auth.user ? (auth.user.xp % 1000) / 1000 * 100 : 0;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">CS</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-white">CodeSphere</h1>
                <p className="text-xs text-gray-400">Learning Platform</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex text-gray-400 hover:text-white"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User Profile Section */}
      {auth.isAuthenticated && auth.user && (
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {auth.user.firstName.charAt(0)}{auth.user.lastName.charAt(0)}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <h3 className="font-semibold text-white">
                  {auth.user.firstName} {auth.user.lastName}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Level</span>
                  <span className="text-xs font-semibold text-purple-400">{auth.user.level}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-warning text-xs">🔥</span>
                    <span className="text-xs text-orange-400 font-semibold">{auth.user.streak}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>XP</span>
                <span>{auth.user.xp}/{(Math.floor(auth.user.xp / 1000) + 1) * 1000}</span>
              </div>
              <ProgressBar value={auth.user.xp % 1000} max={1000} color="primary" />
            </div>
          )}
        </div>
      )}

      {/* Guest Profile Section */}
      {!auth.isAuthenticated && (
        <div className="p-6 border-b border-gray-700">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-6 w-6 text-gray-400" />
            </div>
            {!isCollapsed && (
              <>
                <p className="text-sm text-gray-400 mb-3">Sign in to track your progress</p>
                <Button
                  onClick={() => onAuthModalOpen('login')}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                  size="sm"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50",
                  isActive && "bg-purple-600 text-white hover:bg-purple-700",
                  isCollapsed && "px-2"
                )}
              >
                <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {auth.isAuthenticated ? (
          <Button
            onClick={logout}
            variant="ghost"
            className={cn(
              "w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20",
              isCollapsed && "px-2"
            )}
          >
            <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        ) : !isCollapsed && (
          <div className="space-y-2">
            <Button
              onClick={() => onAuthModalOpen('login')}
              variant="outline"
              className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              size="sm"
            >
              Login
            </Button>
            <Button
              onClick={() => onAuthModalOpen('register')}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              size="sm"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden text-white bg-gray-800"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-30 h-screen bg-gray-900 border-r border-gray-700 transition-all duration-300 hidden lg:block",
        isCollapsed ? "w-20" : "w-80"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-80 bg-gray-900 border-r border-gray-700 transition-transform duration-300 lg:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">CS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CodeSphere</h1>
              <p className="text-xs text-gray-400">Learning Platform</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="h-[calc(100vh-80px)]">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
