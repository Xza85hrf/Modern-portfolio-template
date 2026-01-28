/**
 * Portfolio Configuration Sample
 *
 * This file serves as a reference for customizing your portfolio.
 * Copy this to portfolio.config.ts and modify the values.
 *
 * QUICK START:
 * 1. Copy this file: cp portfolio.config.sample.ts portfolio.config.ts
 * 2. Update the personal section with your information
 * 3. Customize other sections as needed
 * 4. Run: npm run dev
 */

import type { PortfolioConfig } from "./shared/types/config";

const config: PortfolioConfig = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PERSONAL INFORMATION
  // Update this section with YOUR information
  // ═══════════════════════════════════════════════════════════════════════════
  personal: {
    name: "Your Full Name", // Your full name
    firstName: "YourName", // Just your first name (used in greetings)
    email: "your.email@example.com", // Contact email
    location: "Your City, Country", // Where you're based
    title: "Your Professional Title", // e.g., "Software Engineer", "Designer"
    tagline: "A brief description of what you do", // One-liner about you
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HERO SECTION (Landing Page)
  // This is the first thing visitors see
  // ═══════════════════════════════════════════════════════════════════════════
  hero: {
    badge: "Your Title", // Small badge above headline
    headline: ["Word1", "Word2", "Word3"], // Main headline (3 words work best)
    description:
      "Write 2-3 sentences about what you do and what makes you unique. This appears below the headline.",
    primaryCta: {
      text: "View My Work", // Primary button text
      href: "/portfolio", // Where it links to
    },
    secondaryCta: {
      text: "Get in Touch", // Secondary button text
      href: "/contact", // Where it links to
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ABOUT SECTION
  // Introduce yourself and highlight your achievements
  // ═══════════════════════════════════════════════════════════════════════════
  about: {
    introduction:
      "Write a longer introduction about yourself here. Include your background, expertise, and what drives you professionally. This appears on the About page.",
    stats: [
      // Add 4 stats that highlight your experience
      // Available icons: https://lucide.dev/icons/
      {
        label: "Years Experience",
        value: 5,
        suffix: "+",
        icon: "Zap", // Lucide icon name
        color: "text-primary", // Tailwind color class
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
  // What you offer (aim for 4-6 services)
  // ═══════════════════════════════════════════════════════════════════════════
  services: [
    {
      icon: "Code2", // Lucide icon name
      title: "Service Name",
      description: "Brief description of this service (1-2 sentences).",
      gradient: "from-primary/20 to-primary/5", // Background gradient
      iconColor: "text-primary", // Icon color
    },
    // Add more services...
    // Tip: Use different colors for visual variety:
    // - text-primary, text-secondary, text-accent
    // - text-chart-4, text-chart-5
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // CAREER TIMELINE
  // Your professional journey (most recent first)
  // ═══════════════════════════════════════════════════════════════════════════
  timeline: [
    {
      year: "2023 - Present", // Date or date range
      title: "Job Title @ Company", // Your role
      description:
        "What you accomplished in this role (1-2 sentences). Focus on impact.",
      type: "leadership", // Options: leadership, development, education, milestone
    },
    // Add more timeline entries...
    // Types control the icon and color:
    // - leadership: Users icon (purple)
    // - development: Code icon (cyan)
    // - education: GraduationCap icon (green)
    // - milestone: Rocket icon (orange)
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // SOCIAL LINKS
  // Your social media profiles (all optional)
  // ═══════════════════════════════════════════════════════════════════════════
  social: {
    github: "https://github.com/yourusername", // Optional
    linkedin: "https://linkedin.com/in/yourusername", // Optional
    twitter: "https://twitter.com/yourusername", // Optional
    website: "https://yourwebsite.com", // Optional
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GITHUB INTEGRATION
  // For automatic project synchronization
  // ═══════════════════════════════════════════════════════════════════════════
  github: {
    username: "yourusername", // Your GitHub username (for API calls)
    showActivity: true, // Show GitHub activity on profile
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SITE METADATA
  // SEO and browser tab settings
  // ═══════════════════════════════════════════════════════════════════════════
  site: {
    title: "Your Name | Your Title", // Browser tab title
    description: "Your portfolio description for search engines (150 chars).",
    logoText: "Portfolio", // Text shown in navigation logo
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NAVIGATION
  // Usually you don't need to change this
  // ═══════════════════════════════════════════════════════════════════════════
  navigation: {
    items: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/contact", label: "Contact" },
    ],
    ctaButton: {
      text: "Let's Talk", // CTA button text
      href: "/contact",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTACT PAGE
  // Contact form settings
  // ═══════════════════════════════════════════════════════════════════════════
  contact: {
    heading: "Let's Connect",
    subheading:
      "Have a project in mind? I'd love to hear from you. Fill out the form below.",
    responseTime: "I typically respond within 24-48 hours.",
  },
};

export default config;
