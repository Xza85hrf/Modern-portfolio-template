/**
 * Vercel Serverless API Entry Point
 *
 * This file bundles the Express server for Vercel's serverless functions.
 * It imports the routes and middleware from the server directory.
 */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "../server/routes";
import logger from "../server/lib/logger";

console.log("[API] Module loading...");

let routesRegistered = false;

const app = express();

// Trust proxy (Vercel uses proxies)
app.set("trust proxy", 1);

// Health check endpoint (always available)
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    env: {
      hasDb: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV || "production",
    },
  });
});

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(",").map((s) => s.trim()) || [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      // Allow Vercel preview deployments and localhost
      if (origin.endsWith(".vercel.app") || origin.includes("localhost")) {
        return callback(null, true);
      }

      // Allow explicitly configured origins
      if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // If no origins configured, allow all (for development)
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown";
  },
});

app.use("/api/", apiLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

// Register routes
if (!routesRegistered) {
  try {
    registerRoutes(app);
    routesRegistered = true;
    console.log("[API] Routes registered");
  } catch (err) {
    console.error("[API] Failed to register routes:", err);
  }
}

// Error handler
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[API] Error:", err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

console.log("[API] Express app configured");

export default app;
