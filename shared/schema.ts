import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
  totalXP: integer("total_xp").notNull().default(0),
  coursesCompleted: integer("courses_completed").notNull().default(0),
  problemsSolved: integer("problems_solved").notNull().default(0),
  joinDate: timestamp("join_date").defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  totalModules: integer("total_modules").notNull(),
  estimatedHours: integer("estimated_hours").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  roadmapId: integer("roadmap_id").notNull().references(() => roadmaps.id),
  completedModules: integer("completed_modules").notNull().default(0),
  progressPercentage: integer("progress_percentage").notNull().default(0),
  lastActiveDate: timestamp("last_active_date").defaultNow(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  fileSize: text("file_size").notNull(),
  pages: integer("pages").notNull(),
  downloads: integer("downloads").notNull().default(0),
  uploadDate: timestamp("upload_date").defaultNow().notNull(),
  tags: text("tags").array(),
});

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  xpReward: integer("xp_reward").notNull(),
  isDaily: boolean("is_daily").notNull().default(false),
});

export const userSolutions = pgTable("user_solutions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  problemId: integer("problem_id").notNull().references(() => problems.id),
  solved: boolean("solved").notNull().default(false),
  solvedDate: timestamp("solved_date"),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  likes: integer("likes").notNull().default(0),
  replies: integer("replies").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  firstName: true,
  lastName: true,
  email: true,
  password: true,
});

export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({
  id: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  downloads: true,
  uploadDate: true,
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  likes: true,
  replies: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type Roadmap = typeof roadmaps.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Problem = typeof problems.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type UserSolution = typeof userSolutions.$inferSelect;
