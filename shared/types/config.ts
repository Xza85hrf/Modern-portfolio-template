/**
 * Portfolio Configuration Type Definitions
 *
 * These types define the structure of the portfolio.config.ts file.
 * All personal content is centralized here for easy customization.
 */

import type { LucideIcon } from "lucide-react";

/**
 * Personal information displayed throughout the site
 */
export interface PersonalConfig {
  /** Your full name */
  name: string;
  /** First name only (for informal greetings) */
  firstName: string;
  /** Contact email address */
  email: string;
  /** Location (city, country) */
  location: string;
  /** Professional title (e.g., "Software Engineer") */
  title: string;
  /** Short tagline or subtitle */
  tagline: string;
}

/**
 * Hero section configuration (main landing area)
 */
export interface HeroConfig {
  /** Badge text shown above the headline */
  badge: string;
  /** Main headline (can include line breaks as array) */
  headline: string[];
  /** Supporting description paragraph */
  description: string;
  /** Primary call-to-action button */
  primaryCta: {
    text: string;
    href: string;
  };
  /** Secondary call-to-action button */
  secondaryCta: {
    text: string;
    href: string;
  };
}

/**
 * Stat item displayed in the about section
 */
export interface StatItem {
  /** Display label */
  label: string;
  /** Numeric value */
  value: number;
  /** Optional suffix (e.g., "+", "%") */
  suffix?: string;
  /** Lucide icon name (will be mapped to component) */
  icon: string;
  /** Tailwind color class (e.g., "text-primary") */
  color: string;
}

/**
 * About section configuration
 */
export interface AboutConfig {
  /** Introduction paragraph */
  introduction: string;
  /** Stats to display */
  stats: StatItem[];
}

/**
 * Service card configuration
 */
export interface ServiceConfig {
  /** Lucide icon name */
  icon: string;
  /** Service title */
  title: string;
  /** Service description */
  description: string;
  /** Gradient CSS classes for background */
  gradient: string;
  /** Icon color class */
  iconColor: string;
}

/**
 * Timeline event for career journey
 */
export interface TimelineEvent {
  /** Date/period (e.g., "2024", "Jan 2023 - Present") */
  year: string;
  /** Role or event title */
  title: string;
  /** Description of the role/event */
  description: string;
  /** Event type for styling */
  type: "leadership" | "development" | "education" | "milestone";
}

/**
 * Social media links
 */
export interface SocialConfig {
  /** GitHub profile URL */
  github?: string;
  /** LinkedIn profile URL */
  linkedin?: string;
  /** Twitter/X profile URL */
  twitter?: string;
  /** Personal website URL */
  website?: string;
}

/**
 * GitHub integration settings
 */
export interface GitHubConfig {
  /** GitHub username for API calls */
  username: string;
  /** Whether to show GitHub activity */
  showActivity?: boolean;
}

/**
 * Site metadata configuration
 */
export interface SiteConfig {
  /** Site title (shown in browser tab) */
  title: string;
  /** Site description (for SEO) */
  description: string;
  /** Logo text shown in navigation */
  logoText: string;
  /** Optional favicon URL */
  favicon?: string;
}

/**
 * Navigation item
 */
export interface NavItem {
  /** Link destination */
  href: string;
  /** Display label */
  label: string;
}

/**
 * Navigation configuration
 */
export interface NavigationConfig {
  /** Navigation menu items */
  items: NavItem[];
  /** CTA button in navigation */
  ctaButton: {
    text: string;
    href: string;
  };
}

/**
 * Contact page configuration
 */
export interface ContactConfig {
  /** Page heading */
  heading: string;
  /** Page subheading/description */
  subheading: string;
  /** Response time message */
  responseTime: string;
}

/**
 * Complete portfolio configuration
 */
export interface PortfolioConfig {
  /** Personal information */
  personal: PersonalConfig;
  /** Hero section settings */
  hero: HeroConfig;
  /** About section settings */
  about: AboutConfig;
  /** Services/expertise cards */
  services: ServiceConfig[];
  /** Career timeline events */
  timeline: TimelineEvent[];
  /** Social media links */
  social: SocialConfig;
  /** GitHub integration settings */
  github: GitHubConfig;
  /** Site metadata */
  site: SiteConfig;
  /** Navigation settings */
  navigation: NavigationConfig;
  /** Contact page settings */
  contact: ContactConfig;
}
