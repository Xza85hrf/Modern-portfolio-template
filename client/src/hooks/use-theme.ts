import { useEffect } from "react";

/**
 * Space theme - Dark mode only
 * This hook ensures dark mode is always applied
 */
export default function useTheme() {
  useEffect(() => {
    // Always apply dark mode for the space theme
    const root = window.document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
  }, []);

  return {
    theme: "dark" as const,
    // No-op since we're dark-only, but kept for API compatibility
    setTheme: () => {},
  };
}
