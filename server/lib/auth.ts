import { SignJWT, jwtVerify } from 'jose';
import type { Request, Response, NextFunction } from 'express';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        username: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production');
    }
    // Development fallback - NOT secure for production
    return new TextEncoder().encode('dev-secret-do-not-use-in-production');
  }
  return new TextEncoder().encode(secret);
}

export async function generateToken(userId: number, username: string): Promise<string> {
  const secret = getJwtSecret();

  return new SignJWT({ sub: String(userId), username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<{
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
} | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as { sub: string; username: string; iat?: number; exp?: number };
  } catch {
    return null;
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing authorization header' });
    return;
  }

  const token = authHeader.slice(7);

  verifyToken(token)
    .then(payload => {
      if (!payload) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
      }
      req.user = payload;
      next();
    })
    .catch(() => {
      res.status(401).json({ message: 'Token verification error' });
    });
}

// Optional auth middleware - doesn't require auth but attaches user if present
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.slice(7);

  verifyToken(token)
    .then(payload => {
      if (payload) {
        req.user = payload;
      }
      next();
    })
    .catch(() => {
      next();
    });
}
