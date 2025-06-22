import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Home, 
  Route, 
  FileText, 
  Play, 
  Users, 
  Code, 
  Puzzle, 
  Bot, 
  User, 
  Settings,
  LogOut,
  X,
  Menu,
  Flame,
  Star,
  Shield,
  BarChart3,
  Video,
  Store
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserRole } from '../contexts/UserRoleContext';
import { ThemeToggle } from './ThemeToggle';
import { Section } from '../types';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  onAuthModalOpen: (mode: 'login' | 'register') => void;
}

export function Sidebar({ currentSection, onSectionChange, onAuthModalOpen }: SidebarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdmin, isStudent } = useUserRole();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      onSectionChange(isAdmin ? 'platform-analytics' : 'dashboard');
    }
  }, [isAuthenticated, isAdmin, onSectionChange]);

  if (!isAuthenticated) {
    return (
      <div className="fixed left-0 top-0 h-full bg-sidebar-background border-r border-sidebar-border z-50 w-64 flex flex-col justify-between">
        <div>
          {/* Logo/Header */}
          <div
            className="flex items-center space-x-3 p-6 cursor-pointer select-none"
            onClick={() => setLocation('/')}
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">CS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">CodeSphere</h1>
            </div>
          </div>
          <div className="px-6 pb-2 text-xs text-muted-foreground font-semibold">Navigation</div>
          <div className="flex flex-col gap-2 px-4 mt-2">
            <button
              onClick={() => onAuthModalOpen('login')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <span>Login</span>
            </button>
            <button
              onClick={() => onAuthModalOpen('register')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <span>Register</span>
            </button>
          </div>
        </div>
        <div className="p-4 text-xs text-muted-foreground opacity-60">© CodeSphere</div>
      </div>
    );
  }

  const homeNavigation = [
    { id: 'dashboard' as Section, icon: Home, label: 'Dashboard' },
  ];

  const learnNavigation = [
    { id: 'roadmaps' as Section, icon: Route, label: 'Learning Roadmaps' },
    { id: 'videos' as Section, icon: Play, label: 'Video Library' },
    { id: 'problems' as Section, icon: Puzzle, label: 'Daily Problems' },
    { id: 'studio' as Section, icon: Code, label: 'Project Studio' },
  ];

  const engageNavigation = [
    { id: 'community' as Section, icon: Users, label: 'Community Lounge' },
    { id: 'live-classes' as Section, icon: Video, label: 'Live Classes' },
  ];

  const toolsNavigation = [
    { id: 'mentor' as Section, icon: Bot, label: 'AI Mentor' },
    { id: 'sandbox' as Section, icon: Code, label: 'App Sandbox' },
    { id: 'sphere-map' as Section, icon: Star, label: 'Sphere Map' },
  ];
  
  const storeNavigation = [
    { id: 'store' as Section, icon: Store, label: 'CodeCoin Store' },
    { id: 'resources' as Section, icon: FileText, label: 'PDF Resources' },
  ];

  const adminNavigation = [
    { id: 'platform-analytics' as Section, icon: BarChart3, label: 'Admin Panel' },
  ];

  const profileNavigation = [
    { id: 'profile' as Section, icon: User, label: 'Profile' },
    { id: 'settings' as Section, icon: Settings, label: 'Settings' }
  ];

  const xpProgress = user ? (user.xp / user.nextLevelXP) * 100 : 0;

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-sidebar-background border-r border-sidebar-border z-50 transition-transform duration-300 ${
        isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      } w-80 lg:w-72 overflow-y-auto scrollbar-hide`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div
              className="flex items-center space-x-3 cursor-pointer select-none"
              onClick={() => setLocation('/')}
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">CS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">CodeSphere</h1>
                <p className="text-xs text-muted-foreground">Learning Platform</p>
              </div>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile */}
          {isAuthenticated && user ? (
            <div className="bg-card/50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-muted-foreground">{isAdmin ? 'Administrator' : `Level ${user.level}`}</div>
                </div>
              </div>
              
              {!isAdmin && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>XP Progress</span>
                    <span>{user.xp}/{user.nextLevelXP}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="progress-bar h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-orange-500 font-semibold">{user.streak}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <img src="/coin.svg" alt="CodeCoin" className="h-4 w-4" />
                      <span className="text-yellow-500 font-semibold">
                        {user.codeCoins || 0}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      Courses: {user.completedCourses}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card/50 rounded-xl p-4 mb-6 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">Sign in to track your progress</p>
              <Button 
                onClick={() => onAuthModalOpen('login')}
                className="w-full"
                size="sm"
              >
                Sign In
              </Button>
            </div>
          )}

          {/* Navigation Groups */}
          <div className="space-y-6">
            {isStudent && (
              <>
                <div>
                  <div className="px-6 pb-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">Home</div>
                  <nav className="space-y-2">
                    {homeNavigation.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                          currentSection === item.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
                <div>
                  <div className="px-6 pb-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">Learn</div>
                  <nav className="space-y-2">
                    {learnNavigation.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                          currentSection === item.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
                <div>
                  <div className="px-6 pb-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">Engage</div>
                  <nav className="space-y-2">
                    {engageNavigation.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                          currentSection === item.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
                 <div>
                  <div className="px-6 pb-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">Tools</div>
                  <nav className="space-y-2">
                    {toolsNavigation.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                          currentSection === item.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
                 <div>
                  <div className="px-6 pb-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">Store</div>
                  <nav className="space-y-2">
                    {storeNavigation.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                          currentSection === item.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </>
            )}

            {isAdmin && (
              <div>
                <div className="px-6 pb-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">Admin</div>
                <nav className="space-y-2">
                  {adminNavigation.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                        currentSection === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            )}
            
            <div>
              <div className="px-6 pb-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">Account</div>
              <nav className="space-y-2">
                {profileNavigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                      currentSection === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="sidebar-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
        <div className="p-4 mt-auto">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed top-4 left-4 z-40 lg:hidden bg-card border border-border p-2 rounded-lg"
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  );
}
