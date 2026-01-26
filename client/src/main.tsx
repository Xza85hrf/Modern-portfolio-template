import { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route, Router, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth";
import { usePageView } from "@/hooks/use-page-view";
import useTheme from "@/hooks/use-theme";
import { initSmartSmoothScroll, destroySmoothScroll } from "@/lib/smoothScroll";
import { AnimatedPage } from "@/components/layout/AnimatedPage";
import { PageLoader } from "@/components/layout/PageLoader";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { RouteErrorFallback } from "@/components/error/RouteErrorFallback";

// Navigation is loaded eagerly (needed on every page)
import Navigation from "./components/Navigation";

// Lazy load all page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));

// Initialize smooth scrolling
function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = initSmartSmoothScroll();

    return () => {
      destroySmoothScroll();
    };
  }, []);

  return <>{children}</>;
}

// Theme provider component
function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme(); // Ensures dark mode is applied
  return <>{children}</>;
}

// Animated route wrapper with Suspense for lazy loading
function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait" initial={false}>
        <Switch key={location}>
          <Route path="/">
            <AnimatedPage>
              <Home />
            </AnimatedPage>
          </Route>
          <Route path="/about">
            <AnimatedPage>
              <About />
            </AnimatedPage>
          </Route>
          <Route path="/portfolio">
            <AnimatedPage>
              <Portfolio />
            </AnimatedPage>
          </Route>
          <Route path="/blog">
            <AnimatedPage>
              <Blog />
            </AnimatedPage>
          </Route>
          <Route path="/blog/:slug">
            <AnimatedPage>
              <BlogPost />
            </AnimatedPage>
          </Route>
          <Route path="/contact">
            <AnimatedPage>
              <Contact />
            </AnimatedPage>
          </Route>
          {/* Admin routes don't need page transitions */}
          <Route path="/admin/*" component={Admin} />
          <Route path="/admin" component={Admin} />
          <Route>
            <AnimatedPage>
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
                  <p className="text-muted-foreground">Page not found</p>
                </div>
              </div>
            </AnimatedPage>
          </Route>
        </Switch>
      </AnimatePresence>
    </Suspense>
  );
}

function AppRouter() {
  usePageView();

  return (
    <Router>
      <div className="min-h-screen bg-background" role="main">
        <Navigation aria-label="Main Navigation" />
        <main id="main-content" className="container mx-auto px-4 py-8" tabIndex={-1}>
          <ErrorBoundary
            fallback={(error, reset) => (
              <RouteErrorFallback error={error} reset={reset} />
            )}
            level="route"
          >
            <AnimatedRoutes />
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SmoothScrollProvider>
            <AppRouter />
            <Toaster />
          </SmoothScrollProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
