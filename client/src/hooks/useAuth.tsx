import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthContextType } from '../types';
import { storage } from '../lib/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });

  useEffect(() => {
    const isAuthenticated = storage.getAuthState();
    const user = storage.getCurrentUser();
    
    if (isAuthenticated && user) {
      setAuthState({ isAuthenticated: true, user });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = storage.getAllUsers();
      const user = users.find(u => u.email === email);
      
      if (user) {
        // In a real app, you'd verify the password hash
        storage.setAuthState(true);
        storage.setCurrentUser(user);
        setAuthState({ isAuthenticated: true, user });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'joinDate'>): Promise<boolean> => {
    try {
      const users = storage.getAllUsers();
      
      // Check if email already exists
      if (users.find(u => u.email === userData.email)) {
        return false;
      }

      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        joinDate: new Date().toISOString(),
        level: 1,
        xp: 0,
        nextLevelXP: 100,
        streak: 0,
        completedCourses: 0,
        problemsSolved: 0
      };

      storage.addUser(newUser);
      storage.setAuthState(true);
      storage.setCurrentUser(newUser);
      setAuthState({ isAuthenticated: true, user: newUser });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    storage.setAuthState(false);
    localStorage.removeItem('codesphere_user');
    setAuthState({ isAuthenticated: false, user: null });
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      storage.updateUser(updatedUser);
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      register, 
      logout, 
      updateUser 
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
