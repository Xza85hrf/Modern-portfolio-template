/**
 * Portfolio Configuration Context
 *
 * Provides access to portfolio configuration throughout the app.
 * Use the convenience hooks for accessing specific sections.
 */

import { createContext, useContext, type ReactNode } from "react";
import config from "../../../portfolio.config";
import type {
  PortfolioConfig,
  PersonalConfig,
  HeroConfig,
  AboutConfig,
  ServiceConfig,
  TimelineEvent,
  SocialConfig,
  GitHubConfig,
  SiteConfig,
  NavigationConfig,
  ContactConfig,
} from "../../../shared/types/config";

// Create context with the config as default value
const ConfigContext = createContext<PortfolioConfig>(config);

/**
 * Provider component that wraps the app
 */
export function ConfigProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}

/**
 * Hook to access the full configuration
 *
 * @example
 * const config = useConfig();
 * console.log(config.personal.name);
 */
export function useConfig(): PortfolioConfig {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE HOOKS
// These provide quick access to specific config sections
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook to access personal information
 *
 * @example
 * const { name, email, title } = usePersonal();
 */
export function usePersonal(): PersonalConfig {
  return useConfig().personal;
}

/**
 * Hook to access hero section configuration
 *
 * @example
 * const { headline, description, primaryCta } = useHero();
 */
export function useHero(): HeroConfig {
  return useConfig().hero;
}

/**
 * Hook to access about section configuration
 *
 * @example
 * const { introduction, stats } = useAbout();
 */
export function useAbout(): AboutConfig {
  return useConfig().about;
}

/**
 * Hook to access services configuration
 *
 * @example
 * const services = useServices();
 * services.map(service => ...);
 */
export function useServices(): ServiceConfig[] {
  return useConfig().services;
}

/**
 * Hook to access timeline events
 *
 * @example
 * const timeline = useTimeline();
 * timeline.map(event => ...);
 */
export function useTimeline(): TimelineEvent[] {
  return useConfig().timeline;
}

/**
 * Hook to access social media links
 *
 * @example
 * const { github, linkedin, twitter } = useSocial();
 */
export function useSocial(): SocialConfig {
  return useConfig().social;
}

/**
 * Hook to access GitHub integration settings
 *
 * @example
 * const { username, showActivity } = useGitHub();
 */
export function useGitHub(): GitHubConfig {
  return useConfig().github;
}

/**
 * Hook to access site metadata
 *
 * @example
 * const { title, description, logoText } = useSite();
 */
export function useSite(): SiteConfig {
  return useConfig().site;
}

/**
 * Hook to access navigation configuration
 *
 * @example
 * const { items, ctaButton } = useNavigation();
 */
export function useNavigation(): NavigationConfig {
  return useConfig().navigation;
}

/**
 * Hook to access contact page configuration
 *
 * @example
 * const { heading, subheading, responseTime } = useContact();
 */
export function useContact(): ContactConfig {
  return useConfig().contact;
}

// Re-export types for convenience
export type {
  PortfolioConfig,
  PersonalConfig,
  HeroConfig,
  AboutConfig,
  ServiceConfig,
  TimelineEvent,
  SocialConfig,
  GitHubConfig,
  SiteConfig,
  NavigationConfig,
  ContactConfig,
};
