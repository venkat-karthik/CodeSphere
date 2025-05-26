import { User } from '@/types';
import { getCurrentUser, setCurrentUser, clearCurrentUser, saveUser, findUserByEmail, updateUser } from './storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User> {
    const { email, password } = credentials;
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = findUserByEmail(email, password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    setCurrentUser(user);
    return user;
  }

  static async register(data: RegisterData): Promise<User> {
    const { firstName, lastName, email, password } = data;
    
    if (!firstName || !lastName || !email || !password) {
      throw new Error('All fields are required');
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email, '');
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    const newUser = saveUser({
      firstName,
      lastName,
      email,
      password,
      level: 1,
      xp: 0,
      streak: 0,
      totalXP: 0,
      coursesCompleted: 0,
      problemsSolved: 0,
      joinDate: new Date().toISOString(),
      isActive: true,
    });

    setCurrentUser(newUser);
    return newUser;
  }

  static logout(): void {
    clearCurrentUser();
  }

  static getCurrentUser(): User | null {
    return getCurrentUser();
  }

  static isAuthenticated(): boolean {
    return getCurrentUser() !== null;
  }

  static async updateUserProgress(xpGained: number): Promise<User | null> {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const newXP = currentUser.xp + xpGained;
    const newTotalXP = currentUser.totalXP + xpGained;
    
    // Level up logic (every 1000 XP = new level)
    const newLevel = Math.floor(newTotalXP / 1000) + 1;
    
    const updatedUser: User = {
      ...currentUser,
      xp: newXP % 1000, // Current level progress
      totalXP: newTotalXP,
      level: newLevel,
    };

    updateUser(updatedUser);
    return updatedUser;
  }

  static async incrementStreak(): Promise<User | null> {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const updatedUser: User = {
      ...currentUser,
      streak: currentUser.streak + 1,
    };

    updateUser(updatedUser);
    return updatedUser;
  }

  static async incrementProblemsSolved(): Promise<User | null> {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const updatedUser: User = {
      ...currentUser,
      problemsSolved: currentUser.problemsSolved + 1,
    };

    updateUser(updatedUser);
    return updatedUser;
  }

  static async incrementCoursesCompleted(): Promise<User | null> {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const updatedUser: User = {
      ...currentUser,
      coursesCompleted: currentUser.coursesCompleted + 1,
    };

    updateUser(updatedUser);
    return updatedUser;
  }
}
