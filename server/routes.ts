import path from "path";
import fs from "fs";
import type { Express } from "express";
import { sql } from "drizzle-orm";
import { extractRepoInfo, getRepositoryInfo, getAllPublicRepos, repoToProject, getRepoImageUrl } from './lib/github';
import { generateProjectImage, isImageGenerationAvailable } from './lib/image-generation';
import { generateToken, authMiddleware } from './lib/auth';
import { validateRequest, formatValidationErrors, projectSchema, messageSchema, commentSchema, postSchema, skillSchema, loginSchema, pageviewSchema } from './lib/validation';
import logger from './lib/logger';
import { db } from "../db";
import { projects, posts, skills, messages, adminUsers, comments, analytics } from "../db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";

// Initialize admin user if it doesn't exist
async function ensureAdminUser() {
  const adminPassword = process.env.ADMIN_PASSWORD;

  // In production, require ADMIN_PASSWORD to be set
  if (!adminPassword || adminPassword.length < 12) {
    if (process.env.NODE_ENV === 'production') {
      logger.error('ADMIN_PASSWORD must be set and at least 12 characters in production');
      return;
    }
    // Development fallback - use weak password but warn
    logger.warn('Using development admin password. Set ADMIN_PASSWORD in production.');
  }

  try {
    const existingAdmin = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.username, 'admin')
    });

    if (!existingAdmin && adminPassword) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await db.insert(adminUsers).values({
        username: 'admin',
        password_hash: hashedPassword,
      });
      logger.info('Admin user created successfully');
    }
  } catch (error) {
    logger.error('Error ensuring admin user:', error);
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
      logger.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", authMiddleware, async (req, res) => {
    try {
      const validation = validateRequest(projectSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: formatValidationErrors(validation.errors) });
      }
      const result = await db.insert(projects).values(validation.data).returning();
      res.json(result[0]);
    } catch (error) {
      logger.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", authMiddleware, async (req, res) => {
    try {
      const { id, createdAt, ...updateData } = req.body;
      const result = await db
        .update(projects)
        .set(updateData)
        .where(eq(projects.id, parseInt(req.params.id)))
        .returning();
      res.json(result[0]);
    } catch (error) {
      logger.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
    try {
      const result = await db
        .delete(projects)
        .where(eq(projects.id, parseInt(req.params.id)))
        .returning();
      res.json({ success: true, deleted: result[0] });
    } catch (error) {
      logger.error("Error deleting project:", error);
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
      logger.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", authMiddleware, async (req, res) => {
    try {
      const validation = validateRequest(postSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: formatValidationErrors(validation.errors) });
      }
      const result = await db.insert(posts).values(validation.data).returning();
      res.json(result[0]);
    } catch (error) {
      logger.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    const allSkills = await db.query.skills.findMany({
      orderBy: (skills, { desc }) => [desc(skills.proficiency)],
    });
    res.json(allSkills);
  });

  app.post("/api/skills", authMiddleware, async (req, res) => {
    try {
      const validation = validateRequest(skillSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: formatValidationErrors(validation.errors) });
      }
      const result = await db.insert(skills).values(validation.data).returning();
      res.json(result[0]);
    } catch (error) {
      logger.error("Error creating skill:", error);
      res.status(500).json({ message: "Failed to create skill" });
    }
  });

  // GitHub integration routes
  app.post("/api/projects/:id/sync-github", authMiddleware, async (req, res) => {
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
      logger.error("Error syncing with GitHub:", error);
      res.status(500).json({
        message: "Failed to sync with GitHub",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Sync ALL public GitHub repos to projects
  app.post("/api/projects/sync-github-all", authMiddleware, async (req, res) => {
    try {
      const username = req.body.username || process.env.GITHUB_USERNAME || "Xza85hrf";
      logger.info(`Syncing all public repos for GitHub user: ${username}`);

      // Fetch all public repos
      const repos = await getAllPublicRepos(username);
      logger.info(`Found ${repos.length} public repositories`);

      // Get existing projects with GitHub links
      const existingProjects = await db.query.projects.findMany();
      const existingGithubUrls = new Set(
        existingProjects
          .map(p => p.githubLink?.toLowerCase())
          .filter(Boolean)
      );

      const created: string[] = [];
      const updated: string[] = [];
      const skipped: string[] = [];

      for (const repo of repos) {
        const githubUrl = repo.html_url.toLowerCase();
        const projectData = repoToProject(repo, username);

        // Check if project already exists
        const existingProject = existingProjects.find(
          p => p.githubLink?.toLowerCase() === githubUrl
        );

        if (existingProject) {
          // Update existing project with latest GitHub data
          await db.update(projects)
            .set({
              description: projectData.description,
              image: projectData.image,
              technologies: projectData.technologies,
              metadata: projectData.metadata,
              updatedAt: new Date(),
            })
            .where(eq(projects.id, existingProject.id));
          updated.push(repo.name);
        } else {
          // Create new project
          await db.insert(projects).values({
            title: projectData.title,
            description: projectData.description,
            image: projectData.image,
            technologies: projectData.technologies,
            link: projectData.link,
            githubLink: repo.html_url,
            metadata: projectData.metadata,
          });
          created.push(repo.name);
        }
      }

      res.json({
        success: true,
        summary: {
          total: repos.length,
          created: created.length,
          updated: updated.length,
          skipped: skipped.length,
        },
        created,
        updated,
        skipped,
      });
    } catch (error) {
      logger.error("Error syncing all GitHub repos:", error);
      res.status(500).json({
        message: "Failed to sync GitHub repositories",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Image generation routes
  app.get("/api/image-generation/status", (req, res) => {
    res.json({
      available: isImageGenerationAvailable(),
      provider: isImageGenerationAvailable() ? "gemini" : null,
    });
  });

  app.post("/api/projects/:id/regenerate-image", authMiddleware, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      logger.info(`Regenerating image for project: ${project.title}`);
      const result = await generateProjectImage({
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        githubLink: project.githubLink,
      });

      // Update project with new image
      const updated = await db.update(projects)
        .set({
          image: result.image,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId))
        .returning();

      res.json({
        success: true,
        project: updated[0],
        imageSource: result.source,
      });
    } catch (error) {
      logger.error("Error regenerating image:", error);
      res.status(500).json({
        message: "Failed to regenerate image",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.post("/api/projects/regenerate-images-batch", authMiddleware, async (req, res) => {
    try {
      const { projectIds } = req.body;

      // If no specific IDs provided, get all projects
      let targetProjects;
      if (projectIds && Array.isArray(projectIds) && projectIds.length > 0) {
        targetProjects = await db.query.projects.findMany();
        targetProjects = targetProjects.filter(p => projectIds.includes(p.id));
      } else {
        targetProjects = await db.query.projects.findMany();
      }

      logger.info(`Batch regenerating images for ${targetProjects.length} projects`);

      const results: {
        projectId: number;
        title: string;
        success: boolean;
        source?: string;
        error?: string;
      }[] = [];

      // Process sequentially to avoid rate limiting
      for (const project of targetProjects) {
        try {
          const result = await generateProjectImage({
            title: project.title,
            description: project.description,
            technologies: project.technologies,
            githubLink: project.githubLink,
          });

          await db.update(projects)
            .set({
              image: result.image,
              updatedAt: new Date(),
            })
            .where(eq(projects.id, project.id));

          results.push({
            projectId: project.id,
            title: project.title,
            success: true,
            source: result.source,
          });

          // Small delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          results.push({
            projectId: project.id,
            title: project.title,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      const geminiCount = results.filter(r => r.source === "gemini").length;

      res.json({
        success: true,
        summary: {
          total: targetProjects.length,
          successful,
          failed,
          geminiGenerated: geminiCount,
          fallback: successful - geminiCount,
        },
        results,
      });
    } catch (error) {
      logger.error("Error in batch image regeneration:", error);
      res.status(500).json({
        message: "Failed to regenerate images",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
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
      logger.error("Error serving environment template:", error);
      res.status(500).json({ message: "Failed to load environment template" });
    }
  });

  // Documentation routes - with path traversal protection
  app.get("/api/docs/:filename", (req, res) => {
    const filename = req.params.filename;

    // Validate filename to prevent path traversal
    if (!/^[a-zA-Z0-9_-]+\.(md|txt)$/.test(filename)) {
      return res.status(400).json({ message: "Invalid filename format" });
    }

    const docsDir = path.resolve(process.cwd(), "docs");
    const docsPath = path.resolve(docsDir, filename);

    // Ensure the resolved path is still within docs directory
    if (!docsPath.startsWith(docsDir + path.sep)) {
      return res.status(403).json({ message: "Access denied" });
    }

    try {
      if (fs.existsSync(docsPath)) {
        const content = fs.readFileSync(docsPath, 'utf-8');
        res.type('text/markdown').send(content);
      } else {
        res.status(404).json({ message: "Documentation file not found" });
      }
    } catch (error) {
      logger.error("Error serving documentation:", error);
      res.status(500).json({ message: "Failed to load documentation" });
    }
  });
  // Blog post routes
  app.put("/api/posts/:id", authMiddleware, async (req, res) => {
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
      logger.error("Error updating post:", error);
      res.status(500).json({
        message: "Failed to update post",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put("/api/skills/:id", authMiddleware, async (req, res) => {
    try {
      const { id, ...updateData } = req.body;
      const result = await db
        .update(skills)
        .set(updateData)
        .where(eq(skills.id, parseInt(req.params.id)))
        .returning();
      res.json(result[0]);
    } catch (error) {
      logger.error("Error updating skill:", error);
      res.status(500).json({ message: "Failed to update skill" });
    }
  });


  // Contact form route
  app.post("/api/messages", async (req, res) => {
    try {
      const validation = validateRequest(messageSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: formatValidationErrors(validation.errors) });
      }
      const result = await db.insert(messages).values(validation.data).returning();
      res.json(result[0]);
    } catch (error) {
      logger.error("Error saving message:", error);
      res.status(500).json({ message: "Failed to save message" });
    }
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
      logger.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);

      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      // Verify that the post exists
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, postId),
      });

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Validate comment data
      const validation = validateRequest(commentSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: formatValidationErrors(validation.errors) });
      }

      const result = await db.insert(comments).values({
        postId,
        ...validation.data,
      }).returning();

      res.status(201).json(result[0]);
    } catch (error) {
      logger.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Validate login input
      const validation = validateRequest(loginSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: formatValidationErrors(validation.errors) });
      }

      const { username, password } = validation.data;

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

      // Generate real JWT token
      const token = await generateToken(user.id, user.username);

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username
        }
      });
    } catch (error) {
      logger.error("Login error:", error);
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
      logger.error("Error tracking page view:", error);
      res.status(500).json({ message: "Failed to track page view" });
    }
  });

  app.get("/api/analytics", authMiddleware, async (req, res) => {
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
      logger.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Health check endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/ready", async (req, res) => {
    try {
      await db.execute(sql`SELECT 1`);
      res.json({ status: "ready", database: "connected" });
    } catch {
      res.status(503).json({ status: "not ready", database: "disconnected" });
    }
  });
}
