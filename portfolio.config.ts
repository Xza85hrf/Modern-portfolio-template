/**
 * Portfolio Configuration
 *
 * This is the main configuration file for your portfolio.
 * Edit the values below to customize your portfolio content.
 *
 * For a reference example, see portfolio.config.sample.ts
 */

import type { PortfolioConfig } from "./shared/types/config";

const config: PortfolioConfig = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PERSONAL INFORMATION
  // ═══════════════════════════════════════════════════════════════════════════
  personal: {
    name: "Alex Johnson",
    firstName: "Alex",
    email: "alex@example.com",
    location: "San Francisco, CA",
    title: "Full Stack Developer",
    tagline: "Building digital experiences that matter",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HERO SECTION (Landing Page)
  // ═══════════════════════════════════════════════════════════════════════════
  hero: {
    badge: "Full Stack Developer",
    headline: ["Building", "Digital", "Experiences"],
    description:
      "Full Stack Developer passionate about creating elegant solutions to complex problems. I combine modern technologies with clean design principles to build applications that users love.",
    primaryCta: {
      text: "View My Work",
      href: "/portfolio",
    },
    secondaryCta: {
      text: "Get in Touch",
      href: "/contact",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ABOUT SECTION
  // ═══════════════════════════════════════════════════════════════════════════
  about: {
    introduction:
      "Full Stack Developer with a passion for building scalable web applications and intuitive user interfaces. I specialize in React, Node.js, and cloud technologies, with experience across the entire development lifecycle from concept to deployment.",
    stats: [
      {
        label: "Years Experience",
        value: 5,
        suffix: "+",
        icon: "Zap",
        color: "text-primary",
      },
      {
        label: "Projects Completed",
        value: 50,
        suffix: "+",
        icon: "Code2",
        color: "text-secondary",
      },
      {
        label: "Technologies",
        value: 20,
        suffix: "+",
        icon: "Layers",
        color: "text-accent",
      },
      {
        label: "Happy Clients",
        value: 30,
        suffix: "+",
        icon: "Users",
        color: "text-chart-4",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SERVICES / EXPERTISE
  // ═══════════════════════════════════════════════════════════════════════════
  services: [
    {
      icon: "Code2",
      title: "Web Development",
      description:
        "Building responsive, performant web applications using modern frameworks like React, Next.js, and Vue.",
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
    },
    {
      icon: "Server",
      title: "Backend Development",
      description:
        "Designing and implementing scalable APIs and microservices with Node.js, Python, and cloud platforms.",
      gradient: "from-secondary/20 to-secondary/5",
      iconColor: "text-secondary",
    },
    {
      icon: "Database",
      title: "Database Design",
      description:
        "Architecting efficient database schemas with PostgreSQL, MongoDB, and Redis for optimal performance.",
      gradient: "from-accent/20 to-accent/5",
      iconColor: "text-accent",
    },
    {
      icon: "Cloud",
      title: "Cloud & DevOps",
      description:
        "Deploying and managing applications on AWS, GCP, and Azure with CI/CD pipelines and containerization.",
      gradient: "from-chart-4/20 to-chart-4/5",
      iconColor: "text-chart-4",
    },
    {
      icon: "Smartphone",
      title: "Mobile Development",
      description:
        "Creating cross-platform mobile applications with React Native and Flutter for iOS and Android.",
      gradient: "from-chart-5/20 to-chart-5/5",
      iconColor: "text-chart-5",
    },
    {
      icon: "Users",
      title: "Technical Consulting",
      description:
        "Providing expert guidance on architecture decisions, code reviews, and best practices for development teams.",
      gradient: "from-primary/20 to-accent/5",
      iconColor: "text-primary",
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // CAREER TIMELINE
  // ═══════════════════════════════════════════════════════════════════════════
  timeline: [
    {
      year: "2023 - Present",
      title: "Senior Developer @ TechCorp",
      description:
        "Leading development of enterprise SaaS platform, mentoring junior developers, and implementing best practices across the engineering team.",
      type: "leadership",
    },
    {
      year: "2021 - 2023",
      title: "Full Stack Developer @ StartupXYZ",
      description:
        "Built core product features from scratch, established testing frameworks, and scaled the platform to handle 100K+ daily active users.",
      type: "development",
    },
    {
      year: "2019 - 2021",
      title: "Frontend Developer @ DigitalAgency",
      description:
        "Developed interactive web experiences for Fortune 500 clients, specializing in React and animations.",
      type: "development",
    },
    {
      year: "2019",
      title: "Bachelor's in Computer Science",
      description:
        "Graduated with honors from State University. Focused on software engineering and distributed systems.",
      type: "education",
    },
    {
      year: "2018",
      title: "First Open Source Contribution",
      description:
        "Started contributing to open source projects, laying the foundation for my career in software development.",
      type: "milestone",
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // SOCIAL LINKS
  // ═══════════════════════════════════════════════════════════════════════════
  social: {
    github: "https://github.com/alexjohnson",
    linkedin: "https://linkedin.com/in/alexjohnson",
    twitter: "https://twitter.com/alexjohnson",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GITHUB INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════
  github: {
    username: "alexjohnson",
    showActivity: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SITE METADATA
  // ═══════════════════════════════════════════════════════════════════════════
  site: {
    title: "Alex Johnson | Full Stack Developer",
    description:
      "Portfolio of Alex Johnson - Full Stack Developer specializing in React, Node.js, and cloud technologies.",
    logoText: "Portfolio",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════
  navigation: {
    items: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/contact", label: "Contact" },
    ],
    ctaButton: {
      text: "Let's Talk",
      href: "/contact",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTACT PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  contact: {
    heading: "Let's Connect",
    subheading:
      "Have a project in mind or just want to say hello? I'd love to hear from you. Fill out the form below and I'll get back to you as soon as possible.",
    responseTime:
      "I typically respond within 24-48 hours. For urgent matters, feel free to reach out on social media.",
  },
};

export default config;
