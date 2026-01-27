import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import logger from '../server/lib/logger';

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

// Register API routes
registerRoutes(app);

// Error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  let status = 500;
  let message = "Internal Server Error";

  if (err.response) {
    status = err.response.status || 500;
    message = err.response.data.error || err.response.data || err.message;
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e: any) => e.message).join(', ');
  } else if (err.code === 'P2002') {
    status = 409;
    message = 'Unique constraint violation.';
  } else if (err.name) {
    message = err.name + ': ' + err.message;
  }

  logger.error(`Request error: ${req.method} ${req.url} - ${message}`, err);
  res.status(status).json({ error: message });
});

// Export for Vercel serverless
export default app;
