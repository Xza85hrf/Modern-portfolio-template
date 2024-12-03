# Administrator Guide for Portfolio Website

## Overview

This guide covers the administrative features of the portfolio website, including content management, analytics, and system maintenance.

## Getting Started

### Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Login with your credentials (default: username: `admin`, password: `admin123`)
3. Change your password after first login

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

## Troubleshooting

### Common Issues

1. GitHub sync fails
   - Verify GitHub token in environment variables
   - Check repository URL format
2. Image upload issues
   - Verify file size and format
   - Check storage permissions

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
