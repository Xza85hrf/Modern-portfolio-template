// Serverless function entry point for Vercel
console.log('[API] Module loading...');

import express, { type Request, Response, NextFunction } from "express";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

console.log('[API] Core modules imported');

// Wrap imports that might fail
let registerRoutes: any;
let logger: any;
let dbInitialized = false;

// Lazy initialization to catch errors
async function initialize() {
  if (dbInitialized) return;

  try {
    console.log('[API] Loading routes...');
    const routes = await import("../server/routes");
    registerRoutes = routes.registerRoutes;
    console.log('[API] Routes loaded successfully');
  } catch (err) {
    console.error('[API] Routes import failed:', err);
    throw err;
  }

  try {
    console.log('[API] Loading logger...');
    const log = await import("../server/lib/logger");
    logger = log.default;
    console.log('[API] Logger loaded successfully');
  } catch (err) {
    console.error('[API] Logger import failed:', err);
    // Use console as fallback
    logger = { error: console.error };
  }

  dbInitialized = true;
}

const app = express();

// Health check endpoint (before other middleware)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    env: {
      hasDb: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV
    }
  });
});

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()) || [];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Middleware to ensure initialization before route handlers
app.use(async (_req, _res, next) => {
  try {
    await initialize();
    next();
  } catch (err) {
    next(err);
  }
});

// Dynamic route registration after initialization
app.use('/api', async (req, res, next) => {
  if (!registerRoutes) {
    return res.status(503).json({ error: 'Service initializing...' });
  }
  next();
});

// Register routes after middleware
(async () => {
  try {
    await initialize();
    if (registerRoutes) {
      registerRoutes(app);
      console.log('[API] Routes registered');
    }
  } catch (err) {
    console.error('[API] Failed to register routes:', err);
  }
})();

// Error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('[API] Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

console.log('[API] Express app configured');

export default app;
