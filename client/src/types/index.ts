export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'student';
  level: number;
  xp: number;
  nextLevelXP: number;
  streak: number;
  joinDate: string;
  completedCourses: number;
  problemsSolved: number;
  learningPath?: string;
  avatar?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'joinDate'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  completed: boolean;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  completed: boolean;
  current?: boolean;
}

export interface PDFResource {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pages: number;
  size: string;
  downloads: number;
  uploadDate: string;
  tags: string[];
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  xpReward: number;
  completed: boolean;
  attempts: number;
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  timestamp: string;
  liked?: boolean;
}

export type Section = 
  | 'dashboard' 
  | 'admin-dashboard'
  | 'roadmaps' 
  | 'resources' 
  | 'videos' 
  | 'problems' 
  | 'community' 
  | 'studio' 
  | 'sandbox' 
  | 'mentor' 
  | 'sphere-map' 
  | 'profile' 
  | 'settings';
