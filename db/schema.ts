import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  technologies: text("technologies").array().notNull().default([]).$type<string[]>(),
  link: text("link"),
  githubLink: text("github_link"),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  content: jsonb("content").notNull(), // For rich text content
  slug: text("slug").unique().notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skills = pgTable("skills", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  proficiency: integer("proficiency").notNull(),
});

export const messages = pgTable("messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);
export type InsertProject = z.infer<typeof insertProjectSchema>;
// Explicitly type technologies as array (drizzle-zod doesn't infer array types correctly)
export type Project = Omit<z.infer<typeof selectProjectSchema>, 'technologies'> & {
  technologies: string[];
};

export const insertPostSchema = createInsertSchema(posts);
export const selectPostSchema = createSelectSchema(posts);
export type InsertPost = z.infer<typeof insertPostSchema>;
// Explicitly type tags as array (drizzle-zod doesn't infer array types correctly)
export type Post = Omit<z.infer<typeof selectPostSchema>, 'tags'> & {
  tags: string[] | null;
};

export const insertSkillSchema = createInsertSchema(skills);
export const selectSkillSchema = createSelectSchema(skills);
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = z.infer<typeof selectSkillSchema>;

export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = z.infer<typeof selectMessageSchema>;

export const adminUsers = pgTable("admin_users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers);
export const selectAdminUserSchema = createSelectSchema(adminUsers);
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = z.infer<typeof selectAdminUserSchema>;

export const comments = pgTable("comments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  postId: integer("post_id").notNull().references(() => posts.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analytics = pgTable("analytics", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  pagePath: text("page_path").notNull(),
  viewCount: integer("view_count").default(1).notNull(),
  lastViewedAt: timestamp("last_viewed_at").defaultNow().notNull(),
  firstViewedAt: timestamp("first_viewed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  hourOfDay: integer("hour_of_day"),
  dayOfWeek: integer("day_of_week"),
  sessionDuration: integer("session_duration"),
  browserInfo: text("browser_info"),
});

export const insertCommentSchema = createInsertSchema(comments);
export const selectCommentSchema = createSelectSchema(comments);
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = z.infer<typeof selectCommentSchema>;

export const insertAnalyticsSchema = createInsertSchema(analytics);
export const selectAnalyticsSchema = createSelectSchema(analytics);
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = z.infer<typeof selectAnalyticsSchema>;