import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route, Router } from "wouter";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth";
import { usePageView } from "@/hooks/use-page-view";

import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Navigation from "./components/Navigation";

function AppRouter() {
  console.log("AppRouter: Initializing");
  usePageView();
  console.log("AppRouter: Page view hook initialized");
  
  return (
    <Router>
      <div className="min-h-screen bg-background" role="main">
      <Navigation aria-label="Main Navigation" />
      <main className="container mx-auto px-4 py-8"  tabIndex={0}>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/about" component={About} exact />
          <Route path="/portfolio" component={Portfolio} exact />
          <Route path="/blog" component={Blog} exact />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin/*" component={Admin} />
          <Route path="/admin" component={Admin} />
          <Route>404 Page Not Found</Route>
        </Switch>
      </main>
    </div>
    </Router>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
