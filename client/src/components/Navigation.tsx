import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, Sparkles } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll();

  // Track scroll direction and position
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    // Show/hide based on scroll direction
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    // Add glass effect after scrolling
    setIsScrolled(latest > 50);
  });

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const navVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary-foreground"
      >
        Skip to main content
      </a>

      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-primary/5"
            : "bg-transparent"
        )}
        variants={navVariants}
        initial="visible"
        animate={isVisible ? "visible" : "hidden"}
        aria-label="Main Navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <motion.div
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
              >
                <motion.div
                  className="relative"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          rotate: [0, 360],
                        }
                  }
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Sparkles className="h-6 w-6 text-primary" />
                </motion.div>
                <span className="text-xl font-bold gradient-text">
                  Portfolio
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  className="relative"
                  whileHover={{ y: prefersReducedMotion ? 0 : -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "px-4 py-2 h-10 hover:bg-accent hover:text-accent-foreground",
                      location === item.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                    {/* Active indicator */}
                    {location === item.href && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 h-0.5 bg-primary rounded-full"
                        layoutId="activeNavIndicator"
                        initial={{ width: 0, x: "-50%" }}
                        animate={{ width: "60%", x: "-50%" }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden md:block">
              <motion.div
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-9 px-4 py-2 bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40"
                >
                  Let's Talk
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.div
              className="md:hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
                className="hover:bg-primary/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Gradient line at bottom when scrolled */}
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />

      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-16" />
    </>
  );
}
