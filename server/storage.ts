import { 
  users, roadmaps, userProgress, resources, problems, userSolutions, communityPosts,
  type User, type InsertUser, type Roadmap, type UserProgress, type Resource, 
  type Problem, type UserSolution, type CommunityPost, type InsertCommunityPost
} from "@shared/schema";

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'live' | 'ended';
  maxParticipants: number;
  currentParticipants: number;
  roomId: string;
  isRecording: boolean;
  tags: string[];
  createdAt: string;
}

export interface InsertLiveClass {
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  tags: string[];
  status: 'scheduled' | 'live' | 'ended';
  roomId: string;
}

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Roadmaps
  getAllRoadmaps(): Promise<Roadmap[]>;
  getRoadmap(id: number): Promise<Roadmap | undefined>;
  
  // User Progress
  getUserProgress(userId: number, roadmapId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, roadmapId: number, progress: Partial<UserProgress>): Promise<UserProgress>;
  
  // Resources
  getAllResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  
  // Problems
  getAllProblems(): Promise<Problem[]>;
  getDailyProblem(date: Date): Promise<Problem | undefined>;
  getProblemsByDifficulty(difficulty: string): Promise<Problem[]>;
  
  // User Solutions
  getUserSolutions(userId: number): Promise<UserSolution[]>;
  submitSolution(userId: number, problemId: number, solution: string, isCorrect: boolean, xpEarned: number): Promise<UserSolution>;
  
  // Community
  getAllPosts(): Promise<CommunityPost[]>;
  getPostsByCategory(category: string): Promise<CommunityPost[]>;
  createPost(post: InsertCommunityPost): Promise<CommunityPost>;

  // Live Classes
  getAllLiveClasses(): Promise<LiveClass[]>;
  getLiveClass(id: string): Promise<LiveClass | undefined>;
  getLiveClassesByStatus(status: string): Promise<LiveClass[]>;
  getLiveClassesByInstructor(instructorId: string): Promise<LiveClass[]>;
  createLiveClass(liveClass: InsertLiveClass): Promise<LiveClass>;
  updateLiveClass(id: string, updates: Partial<LiveClass>): Promise<LiveClass | undefined>;
  deleteLiveClass(id: string): Promise<boolean>;
  joinLiveClass(classId: string, userId: string, userName: string): Promise<{ success: boolean; message?: string; roomId?: string }>;
  leaveLiveClass(classId: string, userId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private roadmaps: Map<number, Roadmap>;
  private userProgress: Map<string, UserProgress>;
  private resources: Map<number, Resource>;
  private problems: Map<number, Problem>;
  private userSolutions: Map<number, UserSolution>;
  private communityPosts: Map<number, CommunityPost>;
  private liveClasses: Map<string, LiveClass>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.roadmaps = new Map();
    this.userProgress = new Map();
    this.resources = new Map();
    this.problems = new Map();
    this.userSolutions = new Map();
    this.communityPosts = new Map();
    this.liveClasses = new Map();
    this.currentId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample roadmaps
    const frontendRoadmap: Roadmap = {
      id: this.currentId++,
      title: "Frontend Developer",
      description: "Master modern frontend technologies including React, Vue, and advanced CSS",
      category: "Frontend",
      difficulty: "Beginner to Advanced",
      estimatedTime: "3-4 months",
      modules: [
        { id: "html-fundamentals", title: "HTML Fundamentals", completed: false },
        { id: "css-basics", title: "CSS Basics", completed: false },
        { id: "javascript-essentials", title: "JavaScript Essentials", completed: false },
        { id: "responsive-design", title: "Responsive Design", completed: false },
        { id: "css-frameworks", title: "CSS Frameworks", completed: false },
        { id: "dom-manipulation", title: "JavaScript DOM Manipulation", completed: false },
        { id: "es6-features", title: "ES6+ Features", completed: false },
        { id: "build-tools", title: "Frontend Build Tools", completed: false },
        { id: "react-fundamentals", title: "React Fundamentals", completed: false },
        { id: "state-management", title: "State Management", completed: false },
      ]
    };
    this.roadmaps.set(frontendRoadmap.id, frontendRoadmap);

    // Initialize with sample resources
    const jsResource: Resource = {
      id: this.currentId++,
      title: "JavaScript Fundamentals Handbook",
      description: "A comprehensive guide to JavaScript basics including variables, functions, and objects",
      category: "JavaScript",
      type: "pdf",
      difficulty: "beginner",
      tags: ["fundamentals", "basics"],
      downloadCount: 1245,
      fileSize: "2.4 MB",
      pageCount: 42,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      url: null
    };
    this.resources.set(jsResource.id, jsResource);

    // Initialize with sample problems
    const twoSumProblem: Problem = {
      id: this.currentId++,
      title: "Two Sum",
      description: "Given an array of integers and a target sum, return indices of two numbers that add up to the target.",
      difficulty: "Easy",
      category: "Arrays",
      tags: ["arrays", "hash-table"],
      solution: "Use a hash map to store complements",
      hints: ["Think about what you need to find for each number", "Can you do this in one pass?"],
      xpReward: 150,
      isDaily: true,
      date: new Date()
    };
    this.problems.set(twoSumProblem.id, twoSumProblem);

    // Initialize with sample live classes
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0); // 2 PM tomorrow

    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    dayAfterTomorrow.setHours(10, 0, 0, 0); // 10 AM day after tomorrow

    const sampleLiveClass1: LiveClass = {
      id: "class_sample_1",
      title: "JavaScript Fundamentals Live Session",
      description: "Join us for an interactive session covering JavaScript basics, ES6 features, and modern development practices. Perfect for beginners!",
      instructorId: "1",
      instructorName: "Sarah Chen",
      startTime: tomorrow.toISOString(),
      endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
      status: 'scheduled',
      maxParticipants: 30,
      currentParticipants: 12,
      roomId: "room_sample_1",
      isRecording: false,
      tags: ["JavaScript", "Beginner", "ES6"],
      createdAt: new Date().toISOString()
    };

    const sampleLiveClass2: LiveClass = {
      id: "class_sample_2",
      title: "React Hooks Deep Dive",
      description: "Advanced React concepts including custom hooks, context API, and performance optimization techniques.",
      instructorId: "2",
      instructorName: "Mike Rodriguez",
      startTime: dayAfterTomorrow.toISOString(),
      endTime: new Date(dayAfterTomorrow.getTime() + 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours later
      status: 'scheduled',
      maxParticipants: 25,
      currentParticipants: 8,
      roomId: "room_sample_2",
      isRecording: false,
      tags: ["React", "Advanced", "Hooks"],
      createdAt: new Date().toISOString()
    };

    this.liveClasses.set(sampleLiveClass1.id, sampleLiveClass1);
    this.liveClasses.set(sampleLiveClass2.id, sampleLiveClass2);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      level: 1,
      xp: 0,
      streak: 0,
      joinDate: new Date(),
      preferences: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllRoadmaps(): Promise<Roadmap[]> {
    return Array.from(this.roadmaps.values());
  }

  async getRoadmap(id: number): Promise<Roadmap | undefined> {
    return this.roadmaps.get(id);
  }

  async getUserProgress(userId: number, roadmapId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-${roadmapId}`;
    return this.userProgress.get(key);
  }

  async updateUserProgress(userId: number, roadmapId: number, progress: Partial<UserProgress>): Promise<UserProgress> {
    const key = `${userId}-${roadmapId}`;
    const existing = this.userProgress.get(key);
    
    const updatedProgress: UserProgress = {
      id: existing?.id || this.currentId++,
      userId,
      roadmapId,
      completedModules: existing?.completedModules || [],
      currentModule: existing?.currentModule || null,
      progressPercentage: existing?.progressPercentage || 0,
      lastAccessed: new Date(),
      ...progress
    };
    
    this.userProgress.set(key, updatedProgress);
    return updatedProgress;
  }

  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(resource => 
      resource.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getAllProblems(): Promise<Problem[]> {
    return Array.from(this.problems.values());
  }

  async getDailyProblem(date: Date): Promise<Problem | undefined> {
    const today = date.toDateString();
    return Array.from(this.problems.values()).find(problem => 
      problem.isDaily && problem.date?.toDateString() === today
    );
  }

  async getProblemsByDifficulty(difficulty: string): Promise<Problem[]> {
    return Array.from(this.problems.values()).filter(problem => 
      problem.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }

  async getUserSolutions(userId: number): Promise<UserSolution[]> {
    return Array.from(this.userSolutions.values()).filter(solution => 
      solution.userId === userId
    );
  }

  async submitSolution(userId: number, problemId: number, solution: string, isCorrect: boolean, xpEarned: number): Promise<UserSolution> {
    const id = this.currentId++;
    const userSolution: UserSolution = {
      id,
      userId,
      problemId,
      solution,
      isCorrect,
      submittedAt: new Date(),
      xpEarned
    };
    
    this.userSolutions.set(id, userSolution);
    return userSolution;
  }

  async getAllPosts(): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPostsByCategory(category: string): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values())
      .filter(post => post.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const id = this.currentId++;
    const post: CommunityPost = {
      ...insertPost,
      id,
      likes: 0,
      replies: 0,
      isResolved: false,
      createdAt: new Date()
    };
    
    this.communityPosts.set(id, post);
    return post;
  }

  async getAllLiveClasses(): Promise<LiveClass[]> {
    return Array.from(this.liveClasses.values());
  }

  async getLiveClass(id: string): Promise<LiveClass | undefined> {
    return this.liveClasses.get(id);
  }

  async getLiveClassesByStatus(status: string): Promise<LiveClass[]> {
    return Array.from(this.liveClasses.values()).filter(liveClass => 
      liveClass.status === status
    );
  }

  async getLiveClassesByInstructor(instructorId: string): Promise<LiveClass[]> {
    return Array.from(this.liveClasses.values()).filter(liveClass => 
      liveClass.instructorId === instructorId
    );
  }

  async createLiveClass(liveClass: InsertLiveClass): Promise<LiveClass> {
    const id = `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newLiveClass: LiveClass = {
      ...liveClass,
      id,
      currentParticipants: 0,
      isRecording: false,
      createdAt: new Date().toISOString()
    };
    
    this.liveClasses.set(id, newLiveClass);
    return newLiveClass;
  }

  async updateLiveClass(id: string, updates: Partial<LiveClass>): Promise<LiveClass | undefined> {
    const liveClass = this.liveClasses.get(id);
    if (!liveClass) return undefined;
    
    const updatedLiveClass = { ...liveClass, ...updates };
    this.liveClasses.set(id, updatedLiveClass);
    return updatedLiveClass;
  }

  async deleteLiveClass(id: string): Promise<boolean> {
    const exists = this.liveClasses.has(id);
    if (exists) {
      this.liveClasses.delete(id);
    }
    return exists;
  }

  async joinLiveClass(classId: string, userId: string, userName: string): Promise<{ success: boolean; message?: string; roomId?: string }> {
    const liveClass = this.liveClasses.get(classId);
    
    if (!liveClass) {
      return { success: false, message: "Live class not found" };
    }
    
    if (liveClass.status === 'ended') {
      return { success: false, message: "This live class has ended" };
    }
    
    if (liveClass.currentParticipants >= liveClass.maxParticipants) {
      return { success: false, message: "Live class is full" };
    }
    
    // Update participant count
    liveClass.currentParticipants += 1;
    this.liveClasses.set(classId, liveClass);
    
    return { success: true, roomId: liveClass.roomId };
  }

  async leaveLiveClass(classId: string, userId: string): Promise<void> {
    const liveClass = this.liveClasses.get(classId);
    
    if (liveClass && liveClass.currentParticipants > 0) {
      liveClass.currentParticipants -= 1;
      this.liveClasses.set(classId, liveClass);
    }
  }
}

export const storage = new MemStorage();
