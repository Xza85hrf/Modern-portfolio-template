import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@db/schema";

// Mock implementation for the database connection
// This avoids the error "DATABASE_URL is not set" and allows the rest of the application
// to proceed without a real database.

// Replace with your actual database connection if needed
class MockPool {
  query(sql: string) {
    console.warn('Using mock database, query:', sql);
    return Promise.resolve({ rows: [] });
  }
}

const pool = new MockPool() as unknown as pg.Pool;

export const db = drizzle(pool, { schema });
