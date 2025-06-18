import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCommunityPostSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Roadmap routes
  app.get("/api/roadmaps", async (req, res) => {
    try {
      const roadmaps = await storage.getAllRoadmaps();
      res.json(roadmaps);
    } catch (error) {
      console.error("Get roadmaps error:", error);
      res.status(500).json({ message: "Failed to get roadmaps" });
    }
  });

  app.get("/api/roadmaps/:id", async (req, res) => {
    try {
      const roadmapId = parseInt(req.params.id);
      const roadmap = await storage.getRoadmap(roadmapId);
      
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }
      
      res.json(roadmap);
    } catch (error) {
      console.error("Get roadmap error:", error);
      res.status(500).json({ message: "Failed to get roadmap" });
    }
  });

  // User progress routes
  app.get("/api/users/:userId/progress/:roadmapId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const roadmapId = parseInt(req.params.roadmapId);
      
      const progress = await storage.getUserProgress(userId, roadmapId);
      res.json(progress || null);
    } catch (error) {
      console.error("Get progress error:", error);
      res.status(500).json({ message: "Failed to get progress" });
    }
  });

  app.post("/api/users/:userId/progress/:roadmapId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const roadmapId = parseInt(req.params.roadmapId);
      const progressData = req.body;
      
      const progress = await storage.updateUserProgress(userId, roadmapId, progressData);
      res.json(progress);
    } catch (error) {
      console.error("Update progress error:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Resource routes
  app.get("/api/resources", async (req, res) => {
    try {
      const { category } = req.query;
      
      let resources;
      if (category && typeof category === 'string') {
        resources = await storage.getResourcesByCategory(category);
      } else {
        resources = await storage.getAllResources();
      }
      
      res.json(resources);
    } catch (error) {
      console.error("Get resources error:", error);
      res.status(500).json({ message: "Failed to get resources" });
    }
  });

  // Problem routes
  app.get("/api/problems", async (req, res) => {
    try {
      const { difficulty, daily } = req.query;
      
      let problems;
      if (daily === 'true') {
        const today = new Date();
        const dailyProblem = await storage.getDailyProblem(today);
        problems = dailyProblem ? [dailyProblem] : [];
      } else if (difficulty && typeof difficulty === 'string') {
        problems = await storage.getProblemsByDifficulty(difficulty);
      } else {
        problems = await storage.getAllProblems();
      }
      
      res.json(problems);
    } catch (error) {
      console.error("Get problems error:", error);
      res.status(500).json({ message: "Failed to get problems" });
    }
  });

  // User solutions routes
  app.get("/api/users/:userId/solutions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const solutions = await storage.getUserSolutions(userId);
      res.json(solutions);
    } catch (error) {
      console.error("Get solutions error:", error);
      res.status(500).json({ message: "Failed to get solutions" });
    }
  });

  app.post("/api/users/:userId/solutions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { problemId, solution, isCorrect, xpEarned } = req.body;
      
      const userSolution = await storage.submitSolution(userId, problemId, solution, isCorrect, xpEarned);
      
      // Update user XP if solution is correct
      if (isCorrect && xpEarned > 0) {
        const user = await storage.getUser(userId);
        if (user) {
          await storage.updateUser(userId, { 
            xp: user.xp + xpEarned,
            level: Math.floor((user.xp + xpEarned) / 1000) + 1 
          });
        }
      }
      
      res.status(201).json(userSolution);
    } catch (error) {
      console.error("Submit solution error:", error);
      res.status(500).json({ message: "Failed to submit solution" });
    }
  });

  // Community routes
  app.get("/api/community/posts", async (req, res) => {
    try {
      const { category } = req.query;
      
      let posts;
      if (category && typeof category === 'string') {
        posts = await storage.getPostsByCategory(category);
      } else {
        posts = await storage.getAllPosts();
      }
      
      res.json(posts);
    } catch (error) {
      console.error("Get posts error:", error);
      res.status(500).json({ message: "Failed to get posts" });
    }
  });

  app.post("/api/community/posts", async (req, res) => {
    try {
      const postData = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Create post error:", error);
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  // Live Classes routes
  app.get("/api/live-classes", async (req, res) => {
    try {
      const { status, instructorId } = req.query;
      
      let classes;
      if (status && typeof status === 'string') {
        classes = await storage.getLiveClassesByStatus(status);
      } else if (instructorId && typeof instructorId === 'string') {
        classes = await storage.getLiveClassesByInstructor(instructorId);
      } else {
        classes = await storage.getAllLiveClasses();
      }
      
      res.json(classes);
    } catch (error) {
      console.error("Get live classes error:", error);
      res.status(500).json({ message: "Failed to get live classes" });
    }
  });

  app.get("/api/live-classes/:id", async (req, res) => {
    try {
      const classId = req.params.id;
      const liveClass = await storage.getLiveClass(classId);
      
      if (!liveClass) {
        return res.status(404).json({ message: "Live class not found" });
      }
      
      res.json(liveClass);
    } catch (error) {
      console.error("Get live class error:", error);
      res.status(500).json({ message: "Failed to get live class" });
    }
  });

  app.post("/api/live-classes", async (req, res) => {
    try {
      const { title, description, instructorId, instructorName, startTime, endTime, maxParticipants, tags } = req.body;
      
      const liveClass = await storage.createLiveClass({
        title,
        description,
        instructorId,
        instructorName,
        startTime,
        endTime,
        maxParticipants: maxParticipants || 50,
        tags: tags || [],
        status: 'scheduled',
        roomId: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
      
      res.status(201).json(liveClass);
    } catch (error) {
      console.error("Create live class error:", error);
      res.status(400).json({ message: "Invalid live class data" });
    }
  });

  app.patch("/api/live-classes/:id", async (req, res) => {
    try {
      const classId = req.params.id;
      const updates = req.body;
      
      const updatedClass = await storage.updateLiveClass(classId, updates);
      if (!updatedClass) {
        return res.status(404).json({ message: "Live class not found" });
      }
      
      res.json(updatedClass);
    } catch (error) {
      console.error("Update live class error:", error);
      res.status(500).json({ message: "Failed to update live class" });
    }
  });

  app.delete("/api/live-classes/:id", async (req, res) => {
    try {
      const classId = req.params.id;
      const deleted = await storage.deleteLiveClass(classId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Live class not found" });
      }
      
      res.json({ message: "Live class deleted successfully" });
    } catch (error) {
      console.error("Delete live class error:", error);
      res.status(500).json({ message: "Failed to delete live class" });
    }
  });

  app.post("/api/live-classes/:id/join", async (req, res) => {
    try {
      const classId = req.params.id;
      const { userId, userName } = req.body;
      
      const result = await storage.joinLiveClass(classId, userId, userName);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      
      res.json({ message: "Joined live class successfully", roomId: result.roomId });
    } catch (error) {
      console.error("Join live class error:", error);
      res.status(500).json({ message: "Failed to join live class" });
    }
  });

  app.post("/api/live-classes/:id/leave", async (req, res) => {
    try {
      const classId = req.params.id;
      const { userId } = req.body;
      
      await storage.leaveLiveClass(classId, userId);
      res.json({ message: "Left live class successfully" });
    } catch (error) {
      console.error("Leave live class error:", error);
      res.status(500).json({ message: "Failed to leave live class" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
