import { User, Roadmap, Resource, Problem, Post, UserProgress } from '@/types';

const STORAGE_KEYS = {
  USER: 'codesphere_user',
  USERS: 'codesphere_users',
  ROADMAPS: 'codesphere_roadmaps',
  RESOURCES: 'codesphere_resources',
  PROBLEMS: 'codesphere_problems',
  POSTS: 'codesphere_posts',
  USER_PROGRESS: 'codesphere_user_progress',
  USER_SOLUTIONS: 'codesphere_user_solutions',
} as const;

// Default data initialization
const defaultRoadmaps: Roadmap[] = [
  {
    id: 1,
    title: 'Frontend Developer',
    description: 'Master HTML, CSS, JavaScript, and modern frameworks',
    category: 'frontend',
    difficulty: 'beginner',
    totalModules: 12,
    estimatedHours: 60,
    isActive: true,
  },
  {
    id: 2,
    title: 'Backend Developer',
    description: 'Learn server-side programming, databases, and APIs',
    category: 'backend',
    difficulty: 'intermediate',
    totalModules: 15,
    estimatedHours: 80,
    isActive: true,
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    description: 'Complete frontend and backend development skills',
    category: 'fullstack',
    difficulty: 'advanced',
    totalModules: 20,
    estimatedHours: 120,
    isActive: true,
  },
];

const defaultResources: Resource[] = [
  {
    id: 1,
    title: 'JavaScript Fundamentals Handbook',
    description: 'A comprehensive guide to JavaScript basics including variables, functions, and objects',
    category: 'javascript',
    difficulty: 'beginner',
    fileSize: '2.4 MB',
    pages: 42,
    downloads: 1245,
    uploadDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['fundamentals', 'beginner'],
  },
  {
    id: 2,
    title: 'React Hooks Explained',
    description: 'Deep dive into React hooks with practical examples and best practices',
    category: 'react',
    difficulty: 'intermediate',
    fileSize: '1.8 MB',
    pages: 36,
    downloads: 887,
    uploadDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['hooks', 'intermediate'],
  },
  {
    id: 3,
    title: 'CSS Grid and Flexbox Mastery',
    description: 'Master modern CSS layout techniques with detailed examples',
    category: 'css',
    difficulty: 'intermediate',
    fileSize: '3.2 MB',
    pages: 28,
    downloads: 756,
    uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['layout', 'intermediate'],
  },
];

const defaultProblems: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    description: 'Given an array of integers and a target sum, return indices of two numbers that add up to the target.',
    difficulty: 'easy',
    category: 'arrays',
    tags: ['arrays', 'hash-table'],
    xpReward: 100,
    isDaily: true,
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    description: 'Determine if the input string has valid parentheses combinations.',
    difficulty: 'easy',
    category: 'strings',
    tags: ['strings', 'stack'],
    xpReward: 150,
    isDaily: false,
  },
  {
    id: 3,
    title: 'Maximum Subarray',
    description: 'Find the contiguous subarray with the largest sum.',
    difficulty: 'medium',
    category: 'dynamic-programming',
    tags: ['dynamic-programming', 'arrays'],
    xpReward: 250,
    isDaily: false,
  },
];

const defaultPosts: Post[] = [
  {
    id: 1,
    userId: 1,
    title: 'How to optimize React component re-renders?',
    content: "I'm working on a complex React app and noticing performance issues. The components seem to re-render more often than necessary. What are the best practices for optimizing this?",
    category: 'react',
    likes: 24,
    replies: 8,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    userId: 2,
    title: 'My journey from junior to senior developer',
    content: "Just hit my 5-year mark as a developer! Thought I'd share some insights and lessons learned along the way. Here's what I wish I knew when starting out...",
    category: 'career',
    likes: 87,
    replies: 23,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

// Storage utilities
export class LocalStorage {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}

// Initialize default data if not present
export function initializeDefaultData() {
  if (!LocalStorage.get(STORAGE_KEYS.ROADMAPS, null)) {
    LocalStorage.set(STORAGE_KEYS.ROADMAPS, defaultRoadmaps);
  }
  if (!LocalStorage.get(STORAGE_KEYS.RESOURCES, null)) {
    LocalStorage.set(STORAGE_KEYS.RESOURCES, defaultResources);
  }
  if (!LocalStorage.get(STORAGE_KEYS.PROBLEMS, null)) {
    LocalStorage.set(STORAGE_KEYS.PROBLEMS, defaultProblems);
  }
  if (!LocalStorage.get(STORAGE_KEYS.POSTS, null)) {
    LocalStorage.set(STORAGE_KEYS.POSTS, defaultPosts);
  }
  if (!LocalStorage.get(STORAGE_KEYS.USERS, null)) {
    LocalStorage.set(STORAGE_KEYS.USERS, []);
  }
}

// Auth functions
export function getCurrentUser(): User | null {
  return LocalStorage.get(STORAGE_KEYS.USER, null);
}

export function setCurrentUser(user: User): void {
  LocalStorage.set(STORAGE_KEYS.USER, user);
}

export function clearCurrentUser(): void {
  LocalStorage.remove(STORAGE_KEYS.USER);
}

export function saveUser(user: Omit<User, 'id'>): User {
  const users = LocalStorage.get<User[]>(STORAGE_KEYS.USERS, []);
  const newUser: User = {
    ...user,
    id: Date.now(),
  };
  users.push(newUser);
  LocalStorage.set(STORAGE_KEYS.USERS, users);
  return newUser;
}

export function findUserByEmail(email: string, password: string): User | null {
  const users = LocalStorage.get<User[]>(STORAGE_KEYS.USERS, []);
  return users.find(u => u.email === email && u.password === password) || null;
}

export function updateUser(updatedUser: User): void {
  const users = LocalStorage.get<User[]>(STORAGE_KEYS.USERS, []);
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    LocalStorage.set(STORAGE_KEYS.USERS, users);
    setCurrentUser(updatedUser);
  }
}

// Data functions
export function getRoadmaps(): Roadmap[] {
  return LocalStorage.get(STORAGE_KEYS.ROADMAPS, defaultRoadmaps);
}

export function getResources(): Resource[] {
  return LocalStorage.get(STORAGE_KEYS.RESOURCES, defaultResources);
}

export function getProblems(): Problem[] {
  return LocalStorage.get(STORAGE_KEYS.PROBLEMS, defaultProblems);
}

export function getPosts(): Post[] {
  return LocalStorage.get(STORAGE_KEYS.POSTS, defaultPosts);
}

export function getUserProgress(userId: number): UserProgress[] {
  const allProgress = LocalStorage.get<UserProgress[]>(STORAGE_KEYS.USER_PROGRESS, []);
  return allProgress.filter(p => p.userId === userId);
}

export function saveUserProgress(userId: number, roadmapId: number, progress: Partial<UserProgress>): void {
  const allProgress = LocalStorage.get<UserProgress[]>(STORAGE_KEYS.USER_PROGRESS, []);
  const existingIndex = allProgress.findIndex(p => p.userId === userId && p.roadmapId === roadmapId);
  
  const progressData = {
    userId,
    roadmapId,
    completedModules: progress.completedModules || 0,
    progressPercentage: progress.progressPercentage || 0,
    lastActiveDate: new Date().toISOString(),
  };

  if (existingIndex !== -1) {
    allProgress[existingIndex] = { ...allProgress[existingIndex], ...progressData };
  } else {
    allProgress.push(progressData);
  }

  LocalStorage.set(STORAGE_KEYS.USER_PROGRESS, allProgress);
}

export function getUserSolutions(userId: number): any[] {
  const allSolutions = LocalStorage.get<any[]>(STORAGE_KEYS.USER_SOLUTIONS, []);
  return allSolutions.filter(s => s.userId === userId);
}

export function saveProblemSolution(userId: number, problemId: number, solved: boolean): void {
  const allSolutions = LocalStorage.get<any[]>(STORAGE_KEYS.USER_SOLUTIONS, []);
  const existingIndex = allSolutions.findIndex(s => s.userId === userId && s.problemId === problemId);
  
  const solutionData = {
    userId,
    problemId,
    solved,
    solvedDate: solved ? new Date().toISOString() : null,
  };

  if (existingIndex !== -1) {
    allSolutions[existingIndex] = solutionData;
  } else {
    allSolutions.push(solutionData);
  }

  LocalStorage.set(STORAGE_KEYS.USER_SOLUTIONS, allSolutions);
}
