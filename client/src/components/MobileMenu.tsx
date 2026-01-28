import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { menuVariants, menuItemVariants, backdropVariants } from "@/lib/animations";
import { AnimatedGithubIcon } from "./ui/AnimatedGithubIcon";

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const [location] = useLocation();

  // Close menu when location changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Menu panel */}
          <motion.div
            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-card/95 backdrop-blur-xl border-l border-border/50 shadow-2xl"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold gradient-text">Menu</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-primary/10"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

            {/* Navigation links */}
            <nav className="p-6">
              <motion.ul
                className="space-y-2"
                variants={{
                  open: {
                    transition: {
                      staggerChildren: 0.07,
                      delayChildren: 0.1,
                    },
                  },
                  closed: {
                    transition: {
                      staggerChildren: 0.05,
                      staggerDirection: -1,
                    },
                  },
                }}
              >
                {navItems.map((item) => (
                  <motion.li key={item.href} variants={menuItemVariants}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "block w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        location === item.href
                          ? "bg-primary/20 text-primary"
                          : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            {/* Footer with GitHub & CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-4" />
              <div className="flex items-center justify-center gap-4 mb-3">
                <AnimatedGithubIcon size={32} playOnHover={false} />
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                >
                  Let's Talk
                </Link>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Crafting digital experiences
              </p>
            </div>

            {/* Decorative gradient */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
