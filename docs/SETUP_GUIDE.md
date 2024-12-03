# Setup Guide for Portfolio Website

## Initial Setup

### Prerequisites

1. Node.js (v18 or newer)
   - Recommended: Install via Node Version Manager (nvm)
   - Check installation: `node --version`
2. PostgreSQL database
   - Local installation or cloud service (e.g., Supabase, Neon)
   - Required version: 12 or newer
3. GitHub account (for project synchronization)
   - Personal access token with 'repo' scope
   - Organization access if needed

### First Time Setup

1. **Environment Configuration**
   - Copy `.env.template` to `.env`:

     ```bash
     cp .env.template .env
     ```

   - Fill in required environment variables:

     ```env
     # Database Configuration
     # Format: postgresql://[user]:[password]@[host]:[port]/[dbname]
     DATABASE_URL=postgresql://user:password@host:port/dbname
     
     # Database Connection Details
     PGUSER=your_db_user              # PostgreSQL username
     PGPASSWORD=your_db_password      # PostgreSQL password
     PGHOST=your_db_host             # Database host (localhost for local)
     PGPORT=your_db_port             # Database port (default: 5432)
     PGDATABASE=your_db_name         # Database name

     # Port Configuration (Optional)
     PORT=5000  # Specify custom port for development/production

     # GitHub Integration
     # Generate at: https://github.com/settings/tokens
     # Required scopes: repo
     GITHUB_TOKEN=your_github_token
     
     # Security Configuration
     # Generate secure random strings (min 32 chars)
     JWT_SECRET=your_jwt_secret       # For authentication tokens
     COOKIE_SECRET=your_cookie_secret # For session security
     ```

   - Port Configuration Notes:
     - Default port is 5000
     - Can be customized using `PORT` environment variable
     - Server automatically finds next available port if specified port is in use

   - For GitHub token:
     1. Go to GitHub Settings > Developer Settings > Personal Access Tokens
     2. Generate new token with 'repo' scope
     3. Copy token to .env file
     4. Keep token secure and private

   - For GitHub integration:
     1. Go to GitHub Settings > Developer Settings > Personal Access Tokens
     2. Generate a new token with `repo` scope
     3. Copy the token to your `.env` file

2. **Initial Database Setup**

   ```bash
   npm run db:push
   ```

3. **Start Development Server**

   ```bash
   # Start with default port
   npm run dev

   # Or specify a custom port
   PORT=3000 npm run dev
   ```

   Port Configuration:
   - If port 5000 is occupied, server will automatically find an available port
   - Check terminal output to see the exact port being used
   - Access the application at the displayed localhost URL

## Customization

### Theme Configuration

Edit `theme.json` to match your preferred design:

```json
{
  "primary": "#your-primary-color",
  "variant": "professional | tint | vibrant",
  "appearance": "light | dark | system",
  "radius": 0.5
}
```

### Content Setup

1. **Projects Section**
   - Access `/admin/projects`
   - Add projects with:
     - Title and description
     - Technologies used
     - GitHub repository link (for auto-sync)
     - Live demo URL
     - Project image

2. **Blog Section**
   - Navigate to `/admin/posts`
   - Create posts with:
     - Title and content
     - Tags for categorization
     - Featured images
     - SEO metadata

3. **Skills Section**
   - Go to `/admin/skills`
   - Add skills with:
     - Name and category
     - Proficiency level
     - Years of experience

4. **Contact Form**
   - Form submissions are stored in the database
   - View messages in the admin dashboard
   - Configure email notifications (optional)

## Security Configuration

1. **Change Default Admin Credentials**
   - First login: username: `admin`, password: `admin123`
   - Immediately change password after first login
   - Keep credentials secure

2. **API Security**
   - Set strong JWT_SECRET and COOKIE_SECRET
   - Rotate secrets periodically
   - Monitor access logs

## Analytics Setup

1. **Page View Tracking**
   - Automatically tracks:
     - Page visits
     - Session duration
     - Browser information
   - View in analytics dashboard

2. **Custom Tracking**
   - Configure additional metrics
   - Set up conversion goals
   - Monitor user engagement

## Maintenance

### Regular Tasks

1. Database backups
2. Security updates
3. Content reviews
4. Performance monitoring

### Troubleshooting

#### Common Issues and Solutions

1. **Database Connection Issues**

   ```bash
   Error: Could not connect to database
   ```

   Solutions:
   - Verify database credentials in `.env`
   - Ensure PostgreSQL is running
   - Check if database exists: `npm run db:push`
   - Verify network connectivity to database host

2. **GitHub Integration Errors**

   ```bash
   Error: Bad credentials
   ```

   Solutions:
   - Check if GITHUB_TOKEN is correctly set
   - Verify token has required permissions
   - Ensure token hasn't expired

3. **Build Errors**

   ```bash
   Error: Cannot find module 'xyz'
   ```

   Solutions:
   - Clear node_modules: `rm -rf node_modules`
   - Reinstall dependencies: `npm install`
   - Check for Node.js version compatibility

4. **Authentication Issues**

   ```bash
   Error: Invalid credentials
   ```

   Solutions:
   - Reset admin password using default credentials
   - Check JWT_SECRET is properly set
   - Clear browser cookies and cache

#### Logs and Monitoring

- Check application logs in `/logs` directory
- Monitor error reports in the admin dashboard
- Review analytics for system health
- Check browser console for frontend errors

For additional support:

1. Review the full documentation in `/docs`
2. Check GitHub issues for similar problems
3. Contact support team if issues persist

## Support

For technical support or questions:

1. Check documentation in `/docs`
2. Review CONTRIBUTING.md
3. Open GitHub issues
4. Contact development team
