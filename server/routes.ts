import path from "path";
import fs from "fs";
import type { Express } from "express";
import { extractRepoInfo, getRepositoryInfo } from './lib/github';
import { db } from "../db";
import { projects, posts, skills, messages, adminUsers, comments, analytics } from "@db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";

// Initialize admin user if it doesn't exist
async function ensureAdminUser() {
  try {
    const existingAdmin = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.username, 'admin')
    });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.insert(adminUsers).values({
        username: 'admin',
        password_hash: hashedPassword,
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error ensuring admin user:', error);
  }
}

export function registerRoutes(app: Express) {
  // Ensure admin user exists
  ensureAdminUser();
  
  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const allProjects = await db.query.projects.findMany({
        orderBy: (projects, { desc }) => [desc(projects.createdAt)],
      });
      res.json(allProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const result = await db.insert(projects).values(req.body).returning();
      res.json(result[0]);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const result = await db
        .update(projects)
        .set(updateData)
        .where(eq(projects.id, parseInt(req.params.id)))
        .returning();
      res.json(result[0]);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const result = await db
        .delete(projects)
        .where(eq(projects.id, parseInt(req.params.id)))
        .returning();
      res.json({ success: true, deleted: result[0] });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Blog posts routes
  app.get("/api/posts", async (req, res) => {
    const allPosts = await db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    res.json(allPosts);
  });

  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const post = await db.query.posts.findFirst({
        where: eq(posts.slug, req.params.slug),
      });
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    const result = await db.insert(posts).values(req.body);
    res.json(result);
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    const allSkills = await db.query.skills.findMany({
      orderBy: (skills, { desc }) => [desc(skills.proficiency)],
    });
    res.json(allSkills);
  });

  app.post("/api/skills", async (req, res) => {
    const result = await db.insert(skills).values(req.body);
    res.json(result);
  // GitHub integration routes
  app.post("/api/projects/:id/sync-github", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
      });

      if (!project || !project.githubLink) {
        return res.status(404).json({ message: "Project or GitHub link not found" });
      }

      const { owner, repo } = await extractRepoInfo(project.githubLink);
      const repoInfo = await getRepositoryInfo(owner, repo);

      // Update project with GitHub info
      const currentMetadata = project.metadata || {};
      const result = await db.update(projects)
        .set({
          description: repoInfo.description || project.description,
          updatedAt: new Date(),
          metadata: {
            ...currentMetadata,
            github: {
              stars: repoInfo.stars,
              forks: repoInfo.forks,
              language: repoInfo.language,
              lastUpdate: repoInfo.updatedAt,
            },
          },
        })
        .where(eq(projects.id, projectId))
        .returning();

      res.json(result[0]);
    } catch (error) {
      console.error("Error syncing with GitHub:", error);
      res.status(500).json({ 
        message: "Failed to sync with GitHub",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  });

  // Environment templates route
  app.get("/api/templates/env", (req, res) => {
    const templatePath = path.join(process.cwd(), ".env.template");
    try {
      if (fs.existsSync(templatePath)) {
        const content = fs.readFileSync(templatePath, 'utf-8');
        res.type('text/plain').send(content);
      } else {
        res.status(404).json({ message: "Environment template not found" });
      }
    } catch (error) {
      console.error("Error serving environment template:", error);
      res.status(500).json({ message: "Failed to load environment template" });
    }
  });

  // Documentation routes
  app.get("/api/docs/:filename", (req, res) => {
    const filename = req.params.filename;
    const docsPath = path.join(process.cwd(), "docs", filename);
    
    try {
      if (fs.existsSync(docsPath)) {
        const content = fs.readFileSync(docsPath, 'utf-8');
        res.type('text/markdown').send(content);
      } else {
        res.status(404).json({ message: "Documentation file not found" });
      }
    } catch (error) {
      console.error("Error serving documentation:", error);
      res.status(500).json({ message: "Failed to load documentation" });
    }
  });
  // Blog post routes
  app.put("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const { title, content, slug, tags } = req.body;
      
      // Verify post exists
      const existingPost = await db.query.posts.findFirst({
        where: eq(posts.id, postId),
      });
      
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      const result = await db.update(posts)
        .set({
          title,
          content,
          slug,
          tags: Array.isArray(tags) ? tags : [],
          updatedAt: new Date()
        })
        .where(eq(posts.id, postId))
        .returning();

      res.json(result[0]);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ 
        message: "Failed to update post",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app.put("/api/skills/:id", async (req, res) => {
    try {
      const { id, ...updateData } = req.body;
      const result = await db
        .update(skills)
        .set(updateData)
        .where(eq(skills.id, parseInt(req.params.id)))
        .returning();
      res.json(result[0]);
    } catch (error) {
      console.error("Error updating skill:", error);
      res.status(500).json({ message: "Failed to update skill" });
    }
  });


  // Contact form route
  app.post("/api/messages", async (req, res) => {
    const result = await db.insert(messages).values(req.body);
    res.json(result);
  });

  // Comments routes
  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const postComments = await db.query.comments.findMany({
        where: eq(comments.postId, parseInt(req.params.postId)),
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      });
      res.json(postComments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/posts/:postId/comments", async (req, res) => {
    try {
      console.log("Received comment request with params:", req.params);
      console.log("Request body:", req.body);
      
      const postId = parseInt(req.params.postId);
      console.log("Parsed postId:", postId);
      
      if (isNaN(postId)) {
        console.log("Invalid postId detected");
        return res.status(400).json({ message: "Invalid post ID" });
      }

      // Verify that the post exists
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, postId),
      });
      console.log("Found post:", post);
      
      if (!post) {
        console.log("Post not found for id:", postId);
        return res.status(404).json({ message: "Blog post not found" });
      }

      const { name, email, content } = req.body;
      console.log("Extracted comment data:", { name, email, content });
      
      if (!name || !email || !content) {
        console.log("Missing required fields:", { name, email, content });
        return res.status(400).json({ message: "Missing required fields" });
      }

      console.log("Attempting to insert comment");
      const result = await db.insert(comments).values({
        postId,
        name,
        email,
        content,
      }).returning();

      console.log("Comment created successfully:", result[0]);
      res.status(201).json(result[0]);
    } catch (error: any) {
      console.error("Error creating comment:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ 
        message: "Failed to create comment", 
        error: error.message,
        ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
      });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await db.query.adminUsers.findFirst({
        where: eq(adminUsers.username, username),
      });
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({
        token: "admin-token",
        user: {
          id: user.id,
          username: user.username
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics routes
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const { pagePath, sessionDuration, browserInfo } = req.body;
      if (!pagePath) {
        return res.status(400).json({ message: "Page path is required" });
      }

      // Skip tracking for admin routes
      if (pagePath.startsWith('/admin')) {
        return res.json({ success: true, skipped: true });
      }

      const now = new Date();
      const hourOfDay = now.getHours();
      const dayOfWeek = now.getDay();

      const existingAnalytics = await db.query.analytics.findFirst({
        where: eq(analytics.pagePath, pagePath),
      });

      if (existingAnalytics) {
        await db
          .update(analytics)
          .set({
            viewCount: existingAnalytics.viewCount + 1,
            lastViewedAt: now,
            hourOfDay,
            dayOfWeek,
            sessionDuration: sessionDuration || null,
            browserInfo: browserInfo || null,
          })
          .where(eq(analytics.id, existingAnalytics.id));
      } else {
        await db.insert(analytics).values({
          pagePath,
          viewCount: 1,
          hourOfDay,
          dayOfWeek,
          sessionDuration: sessionDuration || null,
          browserInfo: browserInfo || null,
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking page view:", error);
      res.status(500).json({ message: "Failed to track page view" });
    }
  });

  app.get("/api/analytics", async (req, res) => {
    try {
      // Get analytics data excluding admin routes
      const allPageViews = await db.query.analytics.findMany({
        orderBy: (analytics, { desc }) => [desc(analytics.viewCount)],
      });

      // Filter out admin routes
      const pageViews = allPageViews.filter(page => !page.pagePath.startsWith('/admin'));

      // Calculate total views excluding admin routes
      const totalViews = pageViews.reduce((sum, page) => sum + page.viewCount, 0);

      // Calculate average session duration excluding admin routes
      const validSessions = pageViews.filter(page => page.sessionDuration != null);
      const avgSessionDuration = validSessions.length > 0
        ? validSessions.reduce((sum, page) => sum + (page.sessionDuration || 0), 0) / validSessions.length
        : 0;

      // Get browser statistics excluding admin routes
      const browserStats = pageViews.reduce((acc: Record<string, number>, page) => {
        if (page.browserInfo) {
          acc[page.browserInfo] = (acc[page.browserInfo] || 0) + page.viewCount;
        }
        return acc;
      }, {});

      // Get hourly distribution
      const hourlyDistribution = Array(24).fill(0);
      pageViews.forEach(page => {
        if (page.hourOfDay !== null) {
          hourlyDistribution[page.hourOfDay] += page.viewCount;
        }
      });

      res.json({
        pageViews: pageViews.map(page => ({
          ...page,
          percentage: ((page.viewCount / totalViews) * 100).toFixed(1)
        })),
        summary: {
          totalViews,
          avgSessionDuration,
          browserStats,
          hourlyDistribution
        }
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });
}
