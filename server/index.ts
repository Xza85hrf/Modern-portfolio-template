import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createServer } from "http";
import { AddressInfo } from 'net';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import logger from './lib/logger';

// Global error handlers to prevent server crashes
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception - Server will continue running:', error);
  // Don't exit - let the server continue
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
  // Don't exit - let the server continue
});

function log(message: string) {
  if (process.env.NODE_ENV === 'production') return;

  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [express] ${message}`);
}

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()) || [];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    // In production, check against allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per window
  message: { message: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Ensure UTF-8 encoding for all JSON responses (Polish character support)
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

function findAvailablePort(server: any, initialPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    server.listen(initialPort, "0.0.0.0", () => {
      const port = (server.address() as AddressInfo).port;
      resolve(port);
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // If port is in use, try the next port
        server.close(() => {
          resolve(findAvailablePort(server, initialPort + 1));
        });
      } else {
        reject(err);
      }
    });
  });
}

(async () => {
  registerRoutes(app);
  const server = createServer(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    let status = 500;
    let message = "Internal Server Error";

    // More specific error handling 
    if (err.response) {
      // Error from an API call
      status = err.response.status || 500;
      message = err.response.data.error || err.response.data || err.message;
    } else if (err.name === 'ValidationError') {
      // Mongoose validation error
      status = 400; 
      message = Object.values(err.errors).map((e: any) => e.message).join(', ');
    } else if (err.code === 'P2002') {
      // Prisma unique constraint violation
      status = 409;
      message = 'Unique constraint violation.'; 
    } else if (err.name) {
      // Other named errors
      message = err.name + ': ' + err.message;
    }

    // Log the error
    logger.error(`Request error: ${req.method} ${req.url} - ${message}`, err);

    // Send error response to client
    res.status(status).json({ error: message }); 
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT env var or default to 5001 for the API server (5000 is used by Vite)
  const initialPort = process.env.PORT ? parseInt(process.env.PORT) : 5001;
  
  try {
    const availablePort = await findAvailablePort(server, initialPort);
    log(`serving on port ${availablePort}`);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
})();
