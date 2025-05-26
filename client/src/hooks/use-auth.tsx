import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { AuthService, LoginCredentials, RegisterData } from '@/lib/auth';
import { initializeDefaultData } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  updateUserProgress: (xpGained: number) => Promise<User | null>;
  incrementStreak: () => Promise<User | null>;
  incrementProblemsSolved: () => Promise<User | null>;
  incrementCoursesCompleted: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize default data
    initializeDefaultData();
    
    // Check for existing user
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      const user = await AuthService.login(credentials);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    try {
      const user = await AuthService.register(data);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const updateUserProgress = async (xpGained: number): Promise<User | null> => {
    const updatedUser = await AuthService.updateUserProgress(xpGained);
    if (updatedUser) {
      setUser(updatedUser);
    }
    return updatedUser;
  };

  const incrementStreak = async (): Promise<User | null> => {
    const updatedUser = await AuthService.incrementStreak();
    if (updatedUser) {
      setUser(updatedUser);
    }
    return updatedUser;
  };

  const incrementProblemsSolved = async (): Promise<User | null> => {
    const updatedUser = await AuthService.incrementProblemsSolved();
    if (updatedUser) {
      setUser(updatedUser);
    }
    return updatedUser;
  };

  const incrementCoursesCompleted = async (): Promise<User | null> => {
    const updatedUser = await AuthService.incrementCoursesCompleted();
    if (updatedUser) {
      setUser(updatedUser);
    }
    return updatedUser;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUserProgress,
    incrementStreak,
    incrementProblemsSolved,
    incrementCoursesCompleted,
  };

  return (
    <AuthContext.Provider value={value}>
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
