# Deployment Guide

## Overview

This guide covers deployment options and configuration for the portfolio website. The application is built with Node.js and React, using PostgreSQL for data storage. It can be deployed on any platform that supports these technologies.

This project is a platform-agnostic full-stack application that can be deployed on any hosting service that supports Node.js and PostgreSQL. This guide will walk you through the deployment process for various platforms and configurations.

### Key Features

- Modern React frontend with TypeScript
- Express.js backend with RESTful API
- PostgreSQL database with Drizzle ORM
- GitHub integration for project synchronization
- Analytics dashboard
- Content management system
- Blog system with comments

### Setting Up for Deployment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio-website
   ```

2. Replace the package.json with the clean template:
   ```bash
   # Backup existing package.json (optional)
   cp package.json package.json.backup
   
   # Copy the template to package.json
   cp package.template.json package.json
   
   # Install dependencies
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

Note: The package.template.json file contains a clean configuration without any platform-specific dependencies while maintaining all core functionality. This ensures a smooth deployment process across different hosting platforms.

## Prerequisites

### Required Software
- Node.js v18 or newer
- PostgreSQL 12 or newer
- npm or yarn package manager

### Required Environment Variables
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/dbname
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGHOST=your_db_host
PGPORT=your_db_port
PGDATABASE=your_db_name

# GitHub Integration (Optional)
GITHUB_TOKEN=your_github_token

# Security
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
```

## Initial Setup

### 1. Project Setup
1. Clone and prepare the repository:
   ```bash
   git clone <repository-url>
   cd portfolio-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.template` file to `.env`
   - Fill in all required environment variables
   - Ensure database credentials are correct
   - Generate secure values for JWT_SECRET and COOKIE_SECRET

4. Initialize the database:
   ```bash
   # Create database tables and initial schema
   npm run db:push
   ```

5. Build the application:
   ```bash
   # Build frontend assets and server
   npm run build
   ```

6. Start the production server:
   ```bash
   # Start the application on port 5000
   npm start
   ```

7. Verify the installation:
   - Access the application at http://localhost:5000
   - Confirm database connectivity
   - Test admin dashboard access
   - Verify GitHub integration (if configured)

## Deployment Options

### 1. Traditional VPS/Dedicated Server

1. Server Setup:
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PostgreSQL
   sudo apt-get install postgresql postgresql-contrib

   # Install Nginx
   sudo apt-get install nginx
   ```

2. Configure Nginx as reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Set up process management:
   ```bash
   # Install PM2
   npm install -g pm2

   # Start application
   pm2 start npm --name "portfolio" -- start

   # Enable startup script
   pm2 startup
   pm2 save
   ```

4. Configure SSL with Let's Encrypt:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### 2. Platform-as-a-Service (PaaS)

#### A. Heroku Deployment
1. Install Heroku CLI
2. Configure application:
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   heroku config:set COOKIE_SECRET=your-secret
   git push heroku main
   ```

#### B. DigitalOcean App Platform
1. Connect GitHub repository
2. Select Node.js environment
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy application

#### C. Railway/Render
1. Connect to GitHub repository
2. Select Node.js template
3. Add PostgreSQL service
4. Configure build command: `npm run build`
5. Configure start command: `npm start`
6. Set environment variables
7. Deploy application

## Database Setup

1. Create PostgreSQL database
2. Run migrations:
   ```bash
   npm run db:push
   ```
3. Verify database connection

## Security Configuration

1. Set secure environment variables:
   - Generate strong JWT_SECRET
   - Generate secure COOKIE_SECRET
   - Store GitHub token securely

2. Configure CORS if needed:
   ```typescript
   app.use(cors({
     origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
     credentials: true
   }));
   ```

3. Set up rate limiting and security headers

## Monitoring & Maintenance

1. Health Checks:
   - Database connectivity
   - GitHub API integration
   - Authentication system
   - Analytics tracking

2. Regular Tasks:
   - Database backups
   - Log rotation
   - Security updates
   - Performance monitoring

3. Backup Strategy:
   - Daily database backups
   - Configuration backups
   - Content backup schedule

## Support

For deployment assistance:
1. Check troubleshooting guides
2. Review documentation
3. Open GitHub issues
4. Contact support team
