export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  totalXP: number;
  coursesCompleted: number;
  problemsSolved: number;
  joinDate: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Roadmap {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  totalModules: number;
  estimatedHours: number;
  progress?: number;
  completedModules?: number;
  isActive: boolean;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  fileSize: string;
  pages: number;
  downloads: number;
  uploadDate: string;
  tags: string[];
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  tags: string[];
  xpReward: number;
  isDaily: boolean;
  solved?: boolean;
  solvedDate?: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
    level: number;
  };
}

export interface UserProgress {
  roadmapId: number;
  completedModules: number;
  progressPercentage: number;
  lastActiveDate: string;
}

export type Section = 
  | 'landing'
  | 'dashboard'
  | 'roadmaps'
  | 'resources'
  | 'community'
  | 'problems'
  | 'mentor'
  | 'profile';
