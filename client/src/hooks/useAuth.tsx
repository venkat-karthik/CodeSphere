import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthContextType, RegisterData } from '../types';
import api, { setAuthToken } from '../lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          const res = await api.get('/auth/me');
          setAuthState({ isAuthenticated: true, user: res.data });
        } catch (err) {
          setAuthToken(null);
          console.error('Auth check failed', err);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      
      setAuthToken(token);
      setAuthState({ isAuthenticated: true, user });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setAuthToken(null);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const res = await api.post('/auth/register', userData);
      const { token, user } = res.data;
      
      setAuthToken(token);
      setAuthState({ isAuthenticated: true, user });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setAuthToken(null);
      return false;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setAuthState({ isAuthenticated: false, user: null });
  };

  const updateUser = async (updates: Partial<User>) => {
    if (authState.user) {
      try {
        const res = await api.patch(`/users/${authState.user.id}`, updates);
        setAuthState(prev => ({ ...prev, user: res.data }));
      } catch (error) {
        console.error('Update user error:', error);
      }
    }
  };

  if (loading) {
    // You can return a loading spinner here
    return <div>Loading...</div>;
  }

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
