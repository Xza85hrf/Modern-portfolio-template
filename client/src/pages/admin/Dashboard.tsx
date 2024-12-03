import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  type Project,
  type Post,
  type Skill,
  type Message,
  type Analytics,
} from "@db/schema";
import { BarChart, Clock, Timer, Globe, Calendar } from "lucide-react";
import {
  BarChart as Chart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { FolderKanban, FileText, Gauge, MessageSquare } from "lucide-react";

function getLatestUpdate(
  items?: { createdAt: Date | string }[]
): string | undefined {
  if (!items || items.length === 0) return undefined;

  const latestItem = items.reduce((latest, current) => {
    const latestDate =
      latest.createdAt instanceof Date
        ? latest.createdAt
        : new Date(latest.createdAt);

    const currentDate =
      current.createdAt instanceof Date
        ? current.createdAt
        : new Date(current.createdAt);

    return latestDate > currentDate ? latest : current;
  });

  return latestItem.createdAt instanceof Date
    ? latestItem.createdAt.toISOString()
    : String(latestItem.createdAt);
}

export default function Dashboard() {
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => fetch("/api/projects").then((res) => res.json()),
  });

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => fetch("/api/posts").then((res) => res.json()),
  });

  const { data: skills } = useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: () => fetch("/api/skills").then((res) => res.json()),
  });

  const { data: messages } = useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: () => fetch("/api/messages").then((res) => res.json()),
  });

  const dashboardStats = [
    {
      title: "Total Portfolio Projects",
      value: projects?.length ?? 0,
      icon: FolderKanban,
      lastUpdated: getLatestUpdate(
        projects?.map((p) => ({
          createdAt:
            p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt),
        }))
      ),
      description: "Total portfolio projects",
    },
    {
      title: "Published Blog Articles",
      value: posts?.length ?? 0,
      icon: FileText,
      lastUpdated: getLatestUpdate(
        posts?.map((p) => ({
          createdAt:
            p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt),
        }))
      ),
      description: "Published blog articles",
    },
    {
      title: "Technical Skills",
      value: skills?.length ?? 0,
      icon: Gauge,
      lastUpdated: getLatestUpdate(
        skills?.map(() => ({
          createdAt: new Date(),
        }))
      ),
      description: "Listed technical skills",
    },
    {
      title: "Contact Submissions",
      value: messages?.length ?? 0,
      icon: MessageSquare,
      lastUpdated: getLatestUpdate(
        messages?.map((m) => ({
          createdAt:
            m.createdAt instanceof Date ? m.createdAt : new Date(m.createdAt),
        }))
      ),
      description: "Contact form submissions",
    },
  ];

  const { data: analyticsData } = useQuery<{
    pageViews: (Analytics & { percentage: string })[];
    summary: {
      totalViews: number;
      avgSessionDuration: number;
      browserStats: Record<string, number>;
      hourlyDistribution: number[];
    };
  }>({
    queryKey: ["analytics"],
    queryFn: () => fetch("/api/analytics").then((res) => res.json()),
  });

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <CardDescription className="text-xs">
                  {stat.description}
                </CardDescription>
                {stat.lastUpdated &&
                  !isNaN(new Date(stat.lastUpdated).getTime()) && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      Last updated:{" "}
                      {format(new Date(stat.lastUpdated), "MMM d, yyyy")}
                    </div>
                  )}
              </CardContent>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/5 via-primary/50 to-primary/5" />
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsData?.summary && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <BarChart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">
                  {analyticsData.summary.totalViews}
                </div>
                <div className="space-y-1">
                  <CardDescription>
                    Overview of total page visits
                  </CardDescription>
                  <p className="text-xs text-muted-foreground">
                    Across all pages
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Most viewed:{" "}
                    {analyticsData.pageViews[0]?.pagePath
                      .replace(/^\//, "")
                      .replace(/-/g, " ")}{" "}
                    ({analyticsData.pageViews[0]?.percentage}%)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Updated: {format(new Date(), "MMM d, yyyy")}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Session
                </CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(analyticsData.summary.avgSessionDuration)}s
                </div>
                <CardDescription>Average session duration</CardDescription>
                <p className="text-xs text-muted-foreground">
                  Average time spent on site
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
                <Timer className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.summary.hourlyDistribution.indexOf(
                    Math.max(...analyticsData.summary.hourlyDistribution)
                  )}
                  :00
                </div>
                <CardDescription>Highest traffic hour</CardDescription>
                <p className="text-xs text-muted-foreground">
                  Most active time of day
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Browser
                </CardTitle>
                <Globe className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {Object.entries(analyticsData.summary.browserStats)
                    .sort(([, a], [, b]) => b - a)[0]?.[0]
                    .split(" ")[0]
                    .toLowerCase() || "N/A"}
                </div>
                <CardDescription>Primary browser usage</CardDescription>
                <p className="text-xs text-muted-foreground">
                  Most common browser
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="relative overflow-hidden md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Page Views Distribution
            </CardTitle>
            <CardDescription>
              Most viewed pages on your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full p-8 bg-background/50 rounded-lg border-2 border-border/50">
              {analyticsData?.pageViews ? (
                <ResponsiveContainer width="100%" height="100%">
                  <Chart
                    data={analyticsData.pageViews}
                    margin={{ top: 30, right: 40, left: 70, bottom: 70 }}
                    barSize={40}
                  >
                    <defs>
                      <linearGradient
                        id="viewCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.4}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      opacity={0.7}
                    />
                    <XAxis
                      dataKey="pagePath"
                      stroke="hsl(var(--foreground))"
                      tick={{ fill: "hsl(var(--foreground))" }}
                      fontSize={13}
                      tickLine={false}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      tickFormatter={(value) =>
                        value.replace(/^\//, "").replace(/-/g, " ")
                      }
                      height={70}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      padding={{ left: 30, right: 30 }}
                    />
                    <YAxis
                      stroke="hsl(var(--foreground))"
                      tick={{ fill: "hsl(var(--foreground))" }}
                      fontSize={13}
                      tickLine={false}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      tickFormatter={(value) => `${value} views`}
                      padding={{ top: 30 }}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--muted)", opacity: 0.15 }}
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "2px solid var(--border)",
                        borderRadius: "var(--radius)",
                        boxShadow: "var(--shadow)",
                        padding: "16px 20px",
                      }}
                      labelStyle={{
                        color: "var(--foreground)",
                        fontWeight: 600,
                        marginBottom: 12,
                        textTransform: "capitalize",
                        fontSize: "16px",
                      }}
                      itemStyle={{
                        color: "var(--foreground)",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                      formatter={(value, name, props) => {
                        if (name === "viewCount") {
                          return [
                            `${value} views (${props.payload.percentage}%)`,
                            "Page Views",
                          ];
                        }
                        return [value, name];
                      }}
                      labelFormatter={(label) =>
                        label.replace(/^\//, "").replace(/-/g, " ")
                      }
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(value) => (
                        <span className="text-sm font-medium">{value}</span>
                      )}
                    />
                    <Bar
                      dataKey="viewCount"
                      fill="url(#viewCount)"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={80}
                      name="Page Views"
                    />
                  </Chart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Loading analytics data...
                </div>
              )}
            </div>
          </CardContent>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/5 via-primary/50 to-primary/5" />
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentation
            </CardTitle>
            <CardDescription>
              Quick access to guides and documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold">Setup Guide</h4>
                <p className="text-sm text-muted-foreground">
                  Initial configuration and customization steps
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href="/api/docs/SETUP_GUIDE.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Guide
                  </a>
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Deployment Guide</h4>
                <p className="text-sm text-muted-foreground">
                  Instructions for deploying the website
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href="/api/docs/DEPLOYMENT.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Guide
                  </a>
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Admin Guide</h4>
                <p className="text-sm text-muted-foreground">
                  Managing content and features
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href="/api/docs/ADMIN_GUIDE.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Guide
                  </a>
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Environment Templates</h4>
                <p className="text-sm text-muted-foreground">
                  Configuration templates and examples
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href="/api/templates/env"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Templates
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
