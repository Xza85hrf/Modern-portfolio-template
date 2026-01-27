import { Switch, Route, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Gauge,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

import Dashboard from "./admin/Dashboard";
import Projects from "./admin/Projects";
import Posts from "./admin/Posts";
import Skills from "./admin/Skills";
import Login from "./admin/Login";
import { ProtectedRoute, useAuth } from "@/lib/auth";

export default function Admin() {
  const [location] = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban },
    { href: "/admin/posts", label: "Blog Posts", icon: FileText },
    { href: "/admin/skills", label: "Skills", icon: Gauge },
  ];

  if (location === "/admin/login") {
    return <Login />;
  }

  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen>
        <Sidebar variant="inset" className="border-none">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex flex-col gap-3">
              <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Admin Panel
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:border-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.label}
                        className="w-full"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-6">
            <Switch>
              <Route path="/admin" component={Dashboard} />
              <Route path="/admin/projects" component={Projects} />
              <Route path="/admin/posts" component={Posts} />
              <Route path="/admin/skills" component={Skills} />
              <Route path="/admin/*">
                <div className="flex h-[80vh] items-center justify-center text-muted-foreground">
                  Select a section from the sidebar
                </div>
              </Route>
            </Switch>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
