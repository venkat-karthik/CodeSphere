import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { StorageService } from '@/utils/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already authenticated on app start
    const checkAuth = () => {
      const isAuth = StorageService.isAuthenticated();
      const currentUser = StorageService.getCurrentUser();
      
      if (isAuth && currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = StorageService.findUserByEmail(email);
      
      if (foundUser && foundUser.email === email) {
        // In a real app, you'd verify the password hash
        setUser(foundUser);
        setIsAuthenticated(true);
        StorageService.setAuthenticated(true);
        StorageService.setCurrentUser(foundUser);
        
        // Add login activity
        StorageService.addActivity({
          id: Date.now().toString(),
          type: 'course_completion',
          title: 'Logged In',
          description: 'Successfully logged into CodeSphere',
          xpGained: 0,
          timestamp: new Date().toISOString(),
          icon: 'login',
          color: 'green'
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = StorageService.findUserByEmail(userData.email);
      if (existingUser) {
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        level: 1,
        xp: 0,
        streak: 0,
        totalXP: 0,
        coursesCompleted: 0,
        problemsSolved: 0,
        joinDate: new Date().toISOString(),
        preferences: {
          learningPath: 'frontend',
          experienceLevel: 'beginner',
          dailyGoal: 30,
          notifications: {
            email: true,
            dailyReminders: true,
            communityUpdates: false
          }
        }
      };

      StorageService.addUser(newUser);
      setUser(newUser);
      setIsAuthenticated(true);
      StorageService.setAuthenticated(true);
      StorageService.setCurrentUser(newUser);

      // Add welcome activity
      StorageService.addActivity({
        id: Date.now().toString(),
        type: 'course_completion',
        title: 'Welcome to CodeSphere!',
        description: 'Account created successfully',
        xpGained: 100,
        timestamp: new Date().toISOString(),
        icon: 'star',
        color: 'purple'
      });

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    StorageService.setAuthenticated(false);
    // Keep user data in storage for future logins
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      StorageService.updateUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
