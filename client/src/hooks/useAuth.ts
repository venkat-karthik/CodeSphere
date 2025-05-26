import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthContextType, RegisterData } from '@/types';
import { useLocalStorage } from './useLocalStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>('codesphere_users', []);
  const [currentUserId, setCurrentUserId] = useLocalStorage<number | null>('codesphere_current_user', null);
  
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    if (currentUserId) {
      const user = users.find(u => u.id === currentUserId);
      if (user) {
        setAuth({
          isAuthenticated: true,
          user,
        });
      } else {
        // User not found, clear current user
        setCurrentUserId(null);
      }
    }
  }, [currentUserId, users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Update last login date
      const updatedUsers = users.map(u => 
        u.id === user.id 
          ? { ...u, lastLoginDate: new Date().toISOString() }
          : u
      );
      setUsers(updatedUsers);
      
      const updatedUser = { ...user, lastLoginDate: new Date().toISOString() };
      setCurrentUserId(user.id);
      setAuth({
        isAuthenticated: true,
        user: updatedUser,
      });
      return true;
    }
    
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now(), // Simple ID generation for local storage
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      level: 1,
      xp: 0,
      streak: 0,
      joinDate: new Date().toISOString(),
      lastLoginDate: new Date().toISOString(),
      experienceLevel: 'beginner',
      dailyGoal: 30,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUserId(newUser.id);
    
    setAuth({
      isAuthenticated: true,
      user: newUser,
    });

    return true;
  };

  const logout = () => {
    setCurrentUserId(null);
    setAuth({
      isAuthenticated: false,
      user: null,
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (auth.user) {
      const updatedUser = { ...auth.user, ...userData };
      const updatedUsers = users.map(u => 
        u.id === auth.user!.id ? updatedUser : u
      );
      
      setUsers(updatedUsers);
      setAuth({
        isAuthenticated: true,
        user: updatedUser,
      });
    }
  };

  const value: AuthContextType = {
    auth,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
