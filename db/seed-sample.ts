/**
 * Sample Data Seed Script
 *
 * Populates the database with sample data for demonstration purposes.
 * This includes skills, projects, and blog posts.
 *
 * Run with: npm run db:seed-sample
 */

import dotenv from "dotenv";
dotenv.config();

import { db } from "./index";
import { skills, projects, posts } from "./schema";

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE SKILLS
// Generic skills for a full-stack developer
// ═══════════════════════════════════════════════════════════════════════════
const sampleSkills = [
  // Development
  { name: "JavaScript", category: "Development", proficiency: 95 },
  { name: "TypeScript", category: "Development", proficiency: 90 },
  { name: "React", category: "Development", proficiency: 92 },
  { name: "Node.js", category: "Development", proficiency: 88 },
  { name: "Python", category: "Development", proficiency: 85 },

  // Tools
  { name: "Git / GitHub", category: "Tools", proficiency: 90 },
  { name: "Docker", category: "Tools", proficiency: 82 },
  { name: "VS Code", category: "Tools", proficiency: 95 },
  { name: "Figma", category: "Tools", proficiency: 75 },

  // Databases
  { name: "PostgreSQL", category: "Databases", proficiency: 88 },
  { name: "MongoDB", category: "Databases", proficiency: 80 },
  { name: "Redis", category: "Databases", proficiency: 75 },

  // Cloud
  { name: "AWS", category: "Cloud", proficiency: 78 },
  { name: "Vercel", category: "Cloud", proficiency: 90 },
  { name: "Cloudflare", category: "Cloud", proficiency: 72 },
];

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE PROJECTS
// Using Unsplash images for reliable placeholder images
// ═══════════════════════════════════════════════════════════════════════════
const sampleProjects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform with product management, shopping cart, payment processing, and order tracking. Built with React, Node.js, and PostgreSQL.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
    link: "https://demo-ecommerce.example.com",
    githubLink: "https://github.com/example/ecommerce-platform",
    metadata: {
      github: {
        stars: 245,
        forks: 68,
        language: "TypeScript",
        topics: ["ecommerce", "react", "nodejs"],
      },
    },
  },
  {
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, team workspaces, and integrations with popular tools like Slack and GitHub.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    technologies: ["Next.js", "Prisma", "WebSocket", "Tailwind CSS"],
    link: "https://demo-tasks.example.com",
    githubLink: "https://github.com/example/task-management",
    metadata: {
      github: {
        stars: 156,
        forks: 42,
        language: "TypeScript",
        topics: ["productivity", "nextjs", "collaboration"],
      },
    },
  },
  {
    title: "Weather Dashboard",
    description:
      "A beautiful weather dashboard with hourly and weekly forecasts, interactive maps, and customizable alerts. Uses multiple weather APIs for accurate data.",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop",
    technologies: ["React", "Chart.js", "OpenWeather API", "Mapbox"],
    link: "https://demo-weather.example.com",
    githubLink: "https://github.com/example/weather-dashboard",
    metadata: {
      github: {
        stars: 89,
        forks: 23,
        language: "JavaScript",
        topics: ["weather", "dashboard", "api"],
      },
    },
  },
  {
    title: "Blog Platform",
    description:
      "A modern blog platform with Markdown support, syntax highlighting, comments, and SEO optimization. Features a custom CMS for content management.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop",
    technologies: ["Next.js", "MDX", "Prisma", "Vercel"],
    link: "https://demo-blog.example.com",
    githubLink: "https://github.com/example/blog-platform",
    metadata: {
      github: {
        stars: 312,
        forks: 98,
        language: "TypeScript",
        topics: ["blog", "markdown", "cms"],
      },
    },
  },
  {
    title: "Fitness Tracker",
    description:
      "A comprehensive fitness tracking application with workout logging, progress charts, meal planning, and social features to connect with other fitness enthusiasts.",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop",
    technologies: ["React Native", "Node.js", "MongoDB", "Chart.js"],
    link: null,
    githubLink: "https://github.com/example/fitness-tracker",
    metadata: {
      github: {
        stars: 178,
        forks: 54,
        language: "TypeScript",
        topics: ["fitness", "mobile", "health"],
      },
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE BLOG POSTS
// Using TipTap-compatible JSON content
// ═══════════════════════════════════════════════════════════════════════════
const samplePosts = [
  {
    title: "Getting Started with React 19",
    slug: "getting-started-with-react-19",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Introduction" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "React 19 brings exciting new features that make building modern web applications even easier. In this post, we'll explore the most impactful changes and how to use them effectively.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Key Features" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", marks: [{ type: "bold" }], text: "Server Components" },
                    { type: "text", text: " - Improved server-side rendering capabilities" },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", marks: [{ type: "bold" }], text: "Actions" },
                    { type: "text", text: " - Simplified form handling and data mutations" },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", marks: [{ type: "bold" }], text: "use() hook" },
                    { type: "text", text: " - New way to consume promises and context" },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Conclusion" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "React 19 represents a significant step forward in the React ecosystem. Start experimenting with these features today to prepare for the future of React development.",
            },
          ],
        },
      ],
    },
    tags: ["React", "JavaScript", "Web Development"],
  },
  {
    title: "Building Scalable APIs with Node.js",
    slug: "building-scalable-apis-with-nodejs",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Introduction" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Building APIs that can handle millions of requests requires careful planning and the right architectural decisions. Let's explore best practices for creating scalable Node.js APIs.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Architecture Patterns" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Consider using a layered architecture with clear separation of concerns: routes, controllers, services, and repositories. This makes your codebase maintainable and testable.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Performance Tips" }],
        },
        {
          type: "orderedList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Use connection pooling for database connections" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Implement caching with Redis for frequently accessed data" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Use clustering to utilize all CPU cores" }],
                },
              ],
            },
          ],
        },
      ],
    },
    tags: ["Node.js", "API", "Backend", "Performance"],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════════════════════════
async function seedSampleData() {
  console.log("🌱 Seeding sample data...\n");

  try {
    // Seed Skills
    console.log("📚 Seeding skills...");
    await db.delete(skills);
    for (const skill of sampleSkills) {
      await db.insert(skills).values(skill);
      console.log(`   ✓ ${skill.name} (${skill.category})`);
    }
    console.log(`   → ${sampleSkills.length} skills added\n`);

    // Seed Projects
    console.log("💼 Seeding projects...");
    await db.delete(projects);
    for (const project of sampleProjects) {
      await db.insert(projects).values(project);
      console.log(`   ✓ ${project.title}`);
    }
    console.log(`   → ${sampleProjects.length} projects added\n`);

    // Seed Blog Posts
    console.log("📝 Seeding blog posts...");
    await db.delete(posts);
    for (const post of samplePosts) {
      await db.insert(posts).values(post);
      console.log(`   ✓ ${post.title}`);
    }
    console.log(`   → ${samplePosts.length} blog posts added\n`);

    console.log("✅ Sample data seeded successfully!");
    console.log("\n📌 Next steps:");
    console.log("   1. Run 'npm run dev' to start the development server");
    console.log("   2. Visit http://localhost:5000 to see your portfolio");
    console.log("   3. Customize portfolio.config.ts with your information");
    console.log("   4. Use the admin dashboard to manage content");
  } catch (error) {
    console.error("❌ Error seeding sample data:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedSampleData();
