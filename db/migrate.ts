import pg from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL!;

// Detect if using Neon serverless (skip database creation)
const isNeonServerless = databaseUrl.includes('.neon.tech') ||
                         databaseUrl.includes('neon.') ||
                         process.env.SKIP_DB_CREATE === 'true';

async function createDatabaseIfNotExists() {
  // Skip for Neon serverless - database is pre-created
  if (isNeonServerless) {
    console.log('Neon serverless detected - skipping database creation');
    return;
  }

  // Connect to the default postgres database to create the new database
  const defaultClient = new pg.Client({
    connectionString: databaseUrl.replace('/portfolio', '/postgres')
  });

  try {
    await defaultClient.connect();

    // Check if database exists
    const checkResult = await defaultClient.query(`
      SELECT 1 FROM pg_catalog.pg_database
      WHERE datname = 'portfolio'
    `);

    if (checkResult.rowCount === 0) {
      console.log('Creating database: portfolio');
      await defaultClient.query('CREATE DATABASE portfolio');
      console.log('Database created successfully');
    } else {
      console.log('Database already exists');
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await defaultClient.end();
  }
}

async function main() {
  // First, ensure the database exists
  await createDatabaseIfNotExists();

  const client = new pg.Client({
    connectionString: databaseUrl
  });

  try {
    console.log('Starting database initialization...');
    
    await client.connect();
    console.log('Connected to database');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        technologies TEXT[] DEFAULT '{}',
        link TEXT,
        github_link TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content JSONB NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        tags TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        proficiency INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES posts(id),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        page_path TEXT NOT NULL,
        view_count INTEGER DEFAULT 1 NOT NULL,
        last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        first_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        hour_of_day INTEGER,
        day_of_week INTEGER,
        session_duration INTEGER,
        browser_info TEXT
      );
    `);

    // Create default admin user if ADMIN_PASSWORD is set
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword && adminPassword.length >= 12) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      await client.query(`
        INSERT INTO admin_users (username, password_hash)
        VALUES ($1, $2)
        ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;
      `, ['admin', hashedPassword]);

      console.log('Admin user configured with ADMIN_PASSWORD');
    } else if (process.env.NODE_ENV !== 'production') {
      // Development only: create with default password
      const devPassword = await bcrypt.hash('dev-admin-password', 12);
      await client.query(`
        INSERT INTO admin_users (username, password_hash)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING;
      `, ['admin', devPassword]);

      console.log('Development admin user created (password: dev-admin-password)');
    } else {
      console.log('Skipping admin user creation: ADMIN_PASSWORD not set or too short');
    }

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
