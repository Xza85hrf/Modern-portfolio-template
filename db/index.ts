import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@db/schema";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set - database operations will fail");
}

// Create Neon client
const sql = neon(process.env.DATABASE_URL || "");

// Create Drizzle instance with Neon HTTP driver
export const db = drizzle(sql, { schema });
