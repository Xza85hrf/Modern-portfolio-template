# Administrator Guide for Portfolio Website

## Overview

This guide covers the administrative features of the portfolio website, including content management, analytics, and system maintenance.

## Getting Started

### Accessing the Admin Panel

1. Navigate to `/admin/login`
   - Default port is 5000, but may vary based on configuration
   - Check terminal output for exact server port when starting the application
2. Login with your credentials (default: username: `admin`, password: `admin123`)
3. Change your password after first login

### Port Configuration

- Default development port: 5000
- Can be customized using `PORT` environment variable
- Server automatically finds next available port if specified port is in use
- Verify the exact port in terminal when starting the server

Example port configuration:

```bash
# Start with default port
npm run dev

# Or specify a custom port
PORT=3000 npm run dev
```

## Content Management

### Projects

- Add new projects via `/admin/projects`
- Include project title, description, image, and technologies
- GitHub integration available for projects with repository links
- Use "Sync GitHub" to update project stats automatically

### Blog Posts

- Manage blog content through `/admin/posts`
- Rich text editor for content creation
- Support for tags and categories
- Preview posts before publishing

### Skills

- Update skills and proficiency levels at `/admin/skills`
- Group skills by categories
- Set proficiency levels (1-100)

## Analytics Dashboard

### Viewing Analytics

- Access analytics at `/admin/dashboard`
- View page visits, session duration, and user behavior
- Track most popular content
- Monitor user engagement

### Understanding Metrics

- Page Views: Total visits per page
- Session Duration: Average time spent on site
- Peak Hours: Most active times
- Browser Stats: User browser preferences

## Maintenance

### Database Management

1. Regular backups

   ```bash
   npm run db:backup
   ```

2. Update schema

   ```bash
   npm run db:push
   ```

### System Updates

1. Update dependencies

   ```bash
   npm update
   ```

2. Check for security updates

   ```bash
   npm audit
   ```

### Server Management

1. Starting the Server

   ```bash
   # Start with default port
   npm run dev

   # Specify a custom port
   PORT=3030 npm run dev
   ```

2. Port Conflict Resolution
   - If default port is occupied, server will automatically find an available port
   - Check terminal output for the exact port being used
   - Update any local configurations or bookmarks accordingly

## Troubleshooting

### Common Issues

1. GitHub sync fails
   - Verify GitHub token in environment variables
   - Check repository URL format
2. Image upload issues
   - Verify file size and format
   - Check storage permissions
3. Port Configuration Problems
   - Ensure no other services are using the specified port
   - Check firewall settings
   - Use `PORT` environment variable to specify alternative ports

### Support

For technical support or questions, refer to:

- Project documentation in `/docs`
- GitHub repository issues
- Development team contact

## Security Best Practices

1. Change default admin credentials
2. Keep environment variables secure
3. Regular security audits
4. Monitor access logs
5. Be aware of port configuration and potential conflicts
