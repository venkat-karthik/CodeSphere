import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

type UserRole = 'admin' | 'student';

interface UserRoleContextType {
  role: UserRole;
  isAdmin: boolean;
  isStudent: boolean;
  canUploadContent: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

interface UserRoleProviderProps {
  children: ReactNode;
}

export function UserRoleProvider({ children }: UserRoleProviderProps) {
  const { user } = useAuth();
  
  const role: UserRole = (user?.role as UserRole) || 'student';
  const isAdmin = role === 'admin';
  const isStudent = role === 'student';
  
  const canUploadContent = isAdmin;
  const canManageUsers = isAdmin;
  const canViewAnalytics = isAdmin;

  return (
    <UserRoleContext.Provider value={{
      role,
      isAdmin,
      isStudent,
      canUploadContent,
      canManageUsers,
      canViewAnalytics
    }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}