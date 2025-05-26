import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  joinDate: timestamp("join_date").notNull().defaultNow(),
  preferences: json("preferences"),
});

export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  modules: json("modules").notNull(),
  estimatedTime: text("estimated_time"),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  roadmapId: integer("roadmap_id").notNull(),
  completedModules: json("completed_modules").notNull().default([]),
  currentModule: text("current_module"),
  progressPercentage: integer("progress_percentage").notNull().default(0),
  lastAccessed: timestamp("last_accessed").notNull().defaultNow(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(), // 'pdf', 'video', 'article'
  url: text("url"),
  difficulty: text("difficulty").notNull(),
  tags: json("tags").notNull().default([]),
  downloadCount: integer("download_count").notNull().default(0),
  fileSize: text("file_size"),
  pageCount: integer("page_count"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
  tags: json("tags").notNull().default([]),
  solution: text("solution"),
  hints: json("hints").notNull().default([]),
  xpReward: integer("xp_reward").notNull().default(100),
  isDaily: boolean("is_daily").notNull().default(false),
  date: timestamp("date"),
});

export const userSolutions = pgTable("user_solutions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  problemId: integer("problem_id").notNull(),
  solution: text("solution").notNull(),
  isCorrect: boolean("is_correct").notNull().default(false),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  xpEarned: integer("xp_earned").notNull().default(0),
});

export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: json("tags").notNull().default([]),
  likes: integer("likes").notNull().default(0),
  replies: integer("replies").notNull().default(0),
  isResolved: boolean("is_resolved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  joinDate: true,
});

export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({
  id: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
  likes: true,
  replies: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Roadmap = typeof roadmaps.$inferSelect;
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type UserSolution = typeof userSolutions.$inferSelect;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
