import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createServer } from "http";
import { AddressInfo } from 'net';
import helmet from 'helmet';

// Dummy logger module
const logger = {
  info: (message: any, ...optionalParams: any[]) => console.log(message, ...optionalParams),
  warn: (message: any, ...optionalParams: any[]) => console.warn(message, ...optionalParams),
  error: (message: any, ...optionalParams: any[]) => console.error(message, ...optionalParams),
};

// Dummy security module
const sanitizeInput = (input: any) => {
  // Placeholder for input sanitization logic
  // You should implement proper sanitization here to prevent vulnerabilities
  // For example, using libraries like DOMPurify for HTML sanitization
  // or escaping special characters to prevent SQL injection
  
  // Currently, this function does nothing, which is insecure.
  return input; 
};

function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [express] ${message}`);
}

const app = express();
app.use(express.json());
// Security middleware
app.use(helmet()); // Set security headers

// Input sanitization middleware
app.use((req, res, next) => {
  sanitizeInput(req.body); // Sanitize request body
  sanitizeInput(req.query); // Sanitize query parameters
  next();
});
app.use(express.urlencoded({ extended: false }));

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

    // Logging (using Pino for structured logs)
    logger.error({ 
      req: { method: req.method, url: req.url }, 
      err: err.stack || err, // Full error in development, just message in production
      message,
    }, 'Request error');

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

  // Use PORT env var or default to 5000, with fallback to dynamic port
  const initialPort = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  
  try {
    const availablePort = await findAvailablePort(server, initialPort);
    log(`serving on port ${availablePort}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
