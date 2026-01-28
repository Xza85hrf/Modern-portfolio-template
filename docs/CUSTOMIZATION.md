# Customization Guide

This guide walks you through customizing every aspect of your portfolio template.

## Table of Contents

1. [Configuration File](#configuration-file)
2. [Personal Information](#personal-information)
3. [Hero Section](#hero-section)
4. [About Section](#about-section)
5. [Services](#services)
6. [Career Timeline](#career-timeline)
7. [Social Links](#social-links)
8. [Site Metadata](#site-metadata)
9. [Navigation](#navigation)
10. [Contact Page](#contact-page)
11. [Skills (via Admin)](#skills-via-admin)
12. [Projects (via Admin)](#projects-via-admin)
13. [Styling & Theming](#styling--theming)
14. [Environment Variables](#environment-variables)

---

## Configuration File

All content customization happens in `portfolio.config.ts`. This single file controls:

- Your personal information displayed throughout the site
- Hero section content
- About page text and statistics
- Services/expertise you offer
- Career timeline
- Social media links
- Site metadata (SEO)
- Navigation structure
- Contact page content

### Getting Started

```bash
# Start with the sample configuration
cp portfolio.config.sample.ts portfolio.config.ts

# Edit with your preferred editor
code portfolio.config.ts
```

---

## Personal Information

The `personal` section is used across multiple pages:

```typescript
personal: {
  name: "Alex Johnson",           // Full name
  firstName: "Alex",               // First name only (for greetings)
  email: "alex@example.com",       // Contact email
  location: "San Francisco, CA",   // Your location
  title: "Full Stack Developer",   // Professional title
  tagline: "Building digital experiences that matter",
}
```

**Where it appears:**
- About page header
- Contact page information
- Email links

---

## Hero Section

The hero section is the main landing area:

```typescript
hero: {
  badge: "Full Stack Developer",   // Small badge above headline
  headline: ["Building", "Digital", "Experiences"],  // Three words (middle is gradient)
  description: "Your 2-3 sentence introduction...",
  primaryCta: {
    text: "View My Work",
    href: "/portfolio",
  },
  secondaryCta: {
    text: "Get in Touch",
    href: "/contact",
  },
}
```

**Tips:**
- Keep the headline to 3 short words for best visual impact
- The middle word automatically gets the gradient effect
- Description should be 2-3 sentences max

---

## About Section

Configure your introduction and stats:

```typescript
about: {
  introduction: "A longer paragraph about yourself...",
  stats: [
    {
      label: "Years Experience",
      value: 5,
      suffix: "+",
      icon: "Zap",        // Lucide icon name
      color: "text-primary",
    },
    // Add up to 4 stats
  ],
}
```

**Available Icons:**
Browse icons at [lucide.dev/icons](https://lucide.dev/icons). Common choices:
- `Zap` - Experience
- `Code2` - Projects
- `Users` - Clients
- `Layers` - Technologies
- `GraduationCap` - Education

**Available Colors:**
- `text-primary` - Purple/violet
- `text-secondary` - Cyan
- `text-accent` - Green
- `text-chart-4` - Orange
- `text-chart-5` - Pink

---

## Services

Define your services/expertise (4-6 recommended):

```typescript
services: [
  {
    icon: "Code2",
    title: "Web Development",
    description: "Brief description of this service...",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  // Add more services
]
```

**Gradient Options:**
```typescript
"from-primary/20 to-primary/5"    // Purple
"from-secondary/20 to-secondary/5" // Cyan
"from-accent/20 to-accent/5"       // Green
"from-chart-4/20 to-chart-4/5"     // Orange
"from-chart-5/20 to-chart-5/5"     // Pink
"from-primary/20 to-accent/5"      // Purple to green
```

---

## Career Timeline

Add your professional journey (most recent first):

```typescript
timeline: [
  {
    year: "2023 - Present",
    title: "Senior Developer @ Company",
    description: "What you accomplished in 1-2 sentences.",
    type: "leadership",  // Controls icon and color
  },
  // Add more events
]
```

**Event Types:**

| Type | Icon | Use Case |
|------|------|----------|
| `leadership` | Users | Management, leadership roles |
| `development` | Code | Developer positions, projects |
| `education` | GraduationCap | Degrees, certifications |
| `milestone` | Rocket | Achievements, awards |

---

## Social Links

All social links are optional:

```typescript
social: {
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  twitter: "https://twitter.com/yourusername",
  website: "https://yourwebsite.com",  // Personal site
}
```

**Note:** If a link is omitted, it won't appear in the UI.

---

## Site Metadata

SEO and branding settings:

```typescript
site: {
  title: "Alex Johnson | Full Stack Developer",  // Browser tab
  description: "Portfolio description for search engines (150 chars).",
  logoText: "Portfolio",  // Text in navigation logo
}
```

**SEO Tips:**
- Keep title under 60 characters
- Description should be 150-160 characters
- Include relevant keywords naturally

---

## Navigation

Usually you don't need to change this:

```typescript
navigation: {
  items: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/contact", label: "Contact" },
  ],
  ctaButton: {
    text: "Let's Talk",
    href: "/contact",
  },
}
```

---

## Contact Page

Customize the contact page content:

```typescript
contact: {
  heading: "Let's Connect",
  subheading: "Have a project in mind? I'd love to hear from you...",
  responseTime: "I typically respond within 24-48 hours.",
}
```

---

## Skills (via Admin)

Skills are managed through the admin dashboard at `/admin`:

1. Log in with your `ADMIN_PASSWORD`
2. Navigate to Skills section
3. Add/edit/delete skills

**Or seed sample data:**

```bash
npm run db:seed-sample
```

Skills have:
- **Name** - Skill name (e.g., "React")
- **Category** - Grouping (e.g., "Development", "Tools")
- **Proficiency** - Percentage 0-100

---

## Projects (via Admin)

Projects are also managed in the admin dashboard:

1. **Manual Entry:** Add projects with title, description, image, technologies
2. **GitHub Sync:** Import all public repositories automatically

### GitHub Sync Setup

```bash
# In .env file
GITHUB_USERNAME=yourusername
GITHUB_TOKEN=your_personal_access_token
```

Then use "Sync GitHub" in the admin dashboard.

---

## Styling & Theming

### Colors

Colors are defined in `client/src/index.css`. The default theme uses:

| Variable | Description |
|----------|-------------|
| `--primary` | Main accent (purple) |
| `--secondary` | Secondary accent (cyan) |
| `--accent` | Tertiary accent (green) |
| `--background` | Page background |
| `--foreground` | Main text color |

### Custom CSS

Add custom styles to `client/src/index.css`:

```css
/* Add your custom styles at the bottom */
.my-custom-class {
  /* ... */
}
```

### Fonts

The default font is system UI. To change:

1. Add font import to `client/index.html`
2. Update font-family in `client/src/index.css`

---

## Environment Variables

Required for full functionality:

```env
# Required
DATABASE_URL=postgresql://...
JWT_SECRET=your-64-char-secret
ADMIN_PASSWORD=your-password

# Recommended
GITHUB_USERNAME=yourusername
GITHUB_TOKEN=your-token

# Optional
GEMINI_API_KEY=for-image-generation
GOOGLE_ANALYTICS_ID=UA-xxxxx
```

See `.env.template` for full documentation.

---

## Quick Checklist

Before deploying, ensure you've:

- [ ] Updated `portfolio.config.ts` with your information
- [ ] Set all required environment variables
- [ ] Added your skills in admin dashboard
- [ ] Added at least 3-5 projects
- [ ] Tested all pages locally
- [ ] Verified contact form works

---

## Need Help?

- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guides
- Check [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for admin dashboard help
- Open an issue on GitHub for bugs or questions
