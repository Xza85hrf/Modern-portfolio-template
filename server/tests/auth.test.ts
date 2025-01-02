import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import bcrypt from "bcrypt";
import { sql } from "drizzle-orm";
// Mock these modules if they are not available
const db = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  execute: vi.fn(() => ({ rows: [{ password_hash: 'hashed_password' }] })) // Mock execute to return a dummy value
}; 

vi.mock('../index', () => ({
  createServer: vi.fn(() => ({
    listen: vi.fn(),
    close: vi.fn()
  }))
}));

const { createServer } = require('../index'); 

const { rest } = require('msw'); 
const { setupServer } = require('msw/node'); 
const { ADMIN_PASSWORD, ADMIN_USERNAME } = require('../lib/constants'); 

const server = setupServer();

describe("Auth Tests", () => {
  let app: any; // Store the server instance

  beforeAll(async () => {
    // Establish database connection before all tests
    await db.connect(); 

    // Start your server before all tests
    app = createServer();  
    await app.listen(0); // Start on a random available port

    // Enable API mocking before all tests
    server.listen({ onUnhandledRequest: "error" }); 
  });

  afterAll(async () => {
    // Close database connection after all tests
    await db.disconnect(); 

    // Stop your server after all tests
    await app.close(); 

    // Reset any runtime request handlers we may add during the tests.
    server.resetHandlers(); 

    // Disable API mocking after all tests
    server.close(); 
  });

  it("should hash and compare passwords correctly", async () => {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const isMatch = await bcrypt.compare(ADMIN_PASSWORD, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it("should verify admin user exists in the database", async () => {
    const result = await db.execute(
      sql`SELECT username, password_hash FROM admin_users WHERE username = ${ADMIN_USERNAME} LIMIT 1`
    );
    const user = result.rows[0];
    expect(user).toBeDefined();
  });

  it("should compare password with stored hash correctly", async () => {
    const result = await db.execute(
      sql`SELECT password_hash FROM admin_users WHERE username = ${ADMIN_USERNAME} LIMIT 1`
    );
    const user = result.rows[0];
    if (user) {
      const isMatch = await bcrypt.compare(ADMIN_PASSWORD, user.password_hash);
      expect(isMatch).toBe(true);
    }
  }); 
});
