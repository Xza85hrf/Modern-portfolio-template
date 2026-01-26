# Project Index - Modern Portfolio Dashboard

> Quick reference for navigating and understanding the codebase.

---

## Project Overview

**Type:** Full-stack Portfolio Website with Admin Dashboard
**Stack:** React + TypeScript + Express + PostgreSQL
**Theme:** Space-inspired dark mode with glassmorphism
**Status:** Phase 7 (Polish) complete - Ready for deployment

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Frontend: http://localhost:5000
# → Backend: Same port (Vite proxy)

# Type check
npm run check

# Build for production
npm run build && npm start
```

---

## Directory Structure

```
📦 Modern-portfolio-dashboard
├── 📁 client/src/
│   ├── 📁 components/         # UI Components
│   │   ├── 📁 3d/             # 3D effects
│   │   │   ├── SplineScene.tsx    # Spline 3D integration
│   │   │   └── TiltCard.tsx       # 3D hover tilt effect
│   │   ├── 📁 about/          # About page
│   │   │   ├── JourneyTimeline.tsx
│   │   │   ├── SkillsVisualization.tsx
│   │   │   └── StatsCounter.tsx
│   │   ├── 📁 blog/           # Blog components
│   │   │   ├── FeaturedPost.tsx
│   │   │   └── ReadingProgress.tsx
│   │   ├── 📁 contact/        # Contact page
│   │   │   ├── FloatingInput.tsx
│   │   │   └── SuccessAnimation.tsx
│   │   ├── 📁 error/          # Error handling
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ComponentErrorFallback.tsx
│   │   │   └── RouteErrorFallback.tsx
│   │   ├── 📁 home/           # Home page
│   │   │   ├── Hero3D.tsx
│   │   │   ├── HeroContent.tsx
│   │   │   ├── ParticleBackground.tsx
│   │   │   └── ServiceCards.tsx
│   │   ├── 📁 layout/         # Layout components
│   │   │   ├── AnimatedPage.tsx   # Page transitions
│   │   │   ├── GlassCard.tsx      # Glassmorphism cards
│   │   │   └── PageLoader.tsx     # Loading spinner
│   │   ├── 📁 portfolio/      # Portfolio page
│   │   │   ├── FilterBar.tsx
│   │   │   ├── ProjectCard3D.tsx
│   │   │   └── ProjectModal.tsx
│   │   └── 📁 ui/             # shadcn/ui components
│   ├── 📁 hooks/              # Custom hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-page-view.ts
│   │   ├── use-reduced-motion.ts  # Accessibility
│   │   ├── use-scroll-animation.ts
│   │   ├── use-theme.ts
│   │   └── use-toast.ts
│   ├── 📁 lib/                # Utilities
│   │   ├── animations.ts      # Animation variants
│   │   ├── auth.tsx           # Auth context
│   │   ├── errorLogger.ts     # Error logging utility
│   │   ├── github.ts          # GitHub API client
│   │   ├── queryClient.ts     # TanStack Query setup
│   │   ├── smoothScroll.ts    # Lenis smooth scroll
│   │   └── utils.ts           # Utility functions
│   ├── 📁 pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Blog.tsx
│   │   ├── BlogPost.tsx
│   │   ├── Contact.tsx
│   │   ├── Admin.tsx
│   │   └── 📁 admin/          # Admin pages
│   │       ├── Dashboard.tsx
│   │       ├── Login.tsx
│   │       ├── Posts.tsx
│   │       ├── Projects.tsx
│   │       └── Skills.tsx
│   ├── index.css              # Global styles + theme
│   └── main.tsx               # App entry point
├── 📁 server/
│   ├── index.ts               # Server entry
│   ├── routes.ts              # API routes
│   ├── vite.ts                # Vite middleware
│   └── 📁 lib/
│       └── github.ts          # Server-side GitHub
├── 📁 db/
│   ├── schema.ts              # Drizzle schema
│   ├── index.ts               # DB connection
│   └── migrate.ts             # Migration runner
├── 📁 docs/
│   ├── PRD.md                 # Product requirements
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT_GUIDE.md
│   └── ADMIN_GUIDE.md
└── 📁 .claude/                # Claude configuration
    ├── CLAUDE.md              # Agent instructions
    └── INDEX.md               # This file
```

---

## Key Files Reference

### Entry Points
| File | Purpose |
|------|---------|
| `client/src/main.tsx` | React app entry, routing, providers |
| `server/index.ts` | Express server entry |
| `db/schema.ts` | Database schema definitions |

### Configuration
| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `tsconfig.json` | TypeScript configuration |
| `theme.json` | Theme colors (optional) |
| `.env` | Environment variables (create from .env.template) |

### Styling
| File | Purpose |
|------|---------|
| `client/src/index.css` | Global CSS, theme variables, animations |
| `client/src/lib/animations.ts` | Framer Motion variants |
| `client/src/lib/smoothScroll.ts` | Lenis configuration |

---

## Database Schema

```typescript
// db/schema.ts
projects      // id, title, description, image, technologies[], link, githubLink
posts         // id, title, content (JSON), slug, tags[], createdAt
skills        // id, name, category, proficiency
messages      // id, name, email, message, createdAt
comments      // id, postId, name, email, content, createdAt
analytics     // id, pagePath, viewCount, timestamps
admin_users   // id, username, password_hash, createdAt
```

---

## API Endpoints

### Public
```
GET  /api/projects          - List projects
GET  /api/posts             - List blog posts
GET  /api/posts/:slug       - Get post by slug
GET  /api/skills            - List skills
POST /api/messages          - Submit contact form
POST /api/comments          - Add comment
GET  /api/comments/:postId  - Get post comments
```

### Admin (Protected)
```
POST   /api/auth/login      - Login
POST   /api/auth/logout     - Logout
GET    /api/auth/user       - Current user
POST   /api/projects        - Create project
PUT    /api/projects/:id    - Update project
DELETE /api/projects/:id    - Delete project
POST   /api/posts           - Create post
PUT    /api/posts/:id       - Update post
DELETE /api/posts/:id       - Delete post
POST   /api/skills          - Create skill
PUT    /api/skills/:id      - Update skill
DELETE /api/skills/:id      - Delete skill
```

---

## Design System

### Theme Colors (CSS Variables)
```css
--primary: 250 90% 65%;     /* Electric purple */
--secondary: 175 60% 40%;   /* Cosmic teal */
--accent: 330 80% 60%;      /* Nebula pink */
--background: 230 25% 5%;   /* Deep space */
--card: 230 25% 8%;         /* Card background */
```

### Key Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `GlassCard` | `layout/GlassCard.tsx` | Glassmorphism container |
| `TiltCard` | `3d/TiltCard.tsx` | 3D hover effect |
| `AnimatedPage` | `layout/AnimatedPage.tsx` | Page transitions |
| `PageLoader` | `layout/PageLoader.tsx` | Code-split loading state |
| `ErrorBoundary` | `error/ErrorBoundary.tsx` | React error boundary |
| `FloatingInput` | `contact/FloatingInput.tsx` | Animated form inputs |
| `ParticleBackground` | `home/ParticleBackground.tsx` | Particle effects |
| `JourneyTimeline` | `about/JourneyTimeline.tsx` | Animated career timeline |

### Animation Variants
```typescript
// lib/animations.ts
fadeInUp        // Fade in with upward motion
staggerContainer // Parent for staggered children
cardHoverVariants // Card hover/tap effects
backdropVariants  // Modal backdrop
modalVariants     // Modal content
```

---

## Hooks Reference

| Hook | Purpose |
|------|---------|
| `useReducedMotion()` | Check prefers-reduced-motion |
| `useTheme()` | Apply dark theme |
| `usePageView()` | Track page analytics |
| `useScrollAnimation()` | Trigger on scroll |
| `useIsMobile()` | Responsive breakpoint |
| `useToast()` | Toast notifications |

---

## Common Tasks

### Add a new page
1. Create component in `client/src/pages/`
2. Add route in `client/src/main.tsx`
3. Add nav item in `Navigation.tsx`

### Add a new component
1. Create in appropriate `components/` subfolder
2. Export from component file
3. Use `GlassCard` for containers, `motion` for animations

### Add API endpoint
1. Add route in `server/routes.ts`
2. Add types if needed in `db/schema.ts`
3. Use `@tanstack/react-query` on frontend

### Modify database
1. Update schema in `db/schema.ts`
2. Run `npm run db:push` to sync

---

## Environment Variables

```bash
# Required
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key

# Optional
GITHUB_TOKEN=your-github-token
NODE_ENV=development
```

---

## Development Workflow

1. **Start dev server:** `npm run dev`
2. **Type check:** `npm run check`
3. **Format code:** `npm run format`
4. **Lint:** `npm run lint`
5. **Build:** `npm run build`
6. **Start production:** `npm start`

---

## Troubleshooting

### Common Issues

**TypeScript errors with array fields:**
- Project `technologies` and Post `tags` are arrays
- Schema explicitly types them in `db/schema.ts`

**Animations not working:**
- Check `useReducedMotion()` isn't blocking
- Verify Framer Motion variants are applied

**Database connection errors:**
- Verify `DATABASE_URL` in `.env`
- Check PostgreSQL is running

**Styles not applying:**
- Check Tailwind classes are valid
- Verify CSS variables in `index.css`

**Vite cache issues (WSL):**
- Kill processes and clear cache: `pkill -f "node"; rm -rf node_modules/.vite`
- Restart: `npm run dev`

**Browserslist outdated warning:**
- Run: `npx update-browserslist-db@latest`

---

## Phase 7 Optimizations Applied

### Code Splitting
- `React.lazy()` for all page components
- `Suspense` with `PageLoader` fallback
- Reduces initial bundle size

### Error Handling
- `ErrorBoundary` wraps route components
- `ComponentErrorFallback` for graceful degradation
- `errorLogger` for centralized error tracking

### Performance
- `React.memo` on heavy components
- `useCallback` for event handlers
- `useReducedMotion` hook for accessibility

### Accessibility (WCAG 2.1 AA)
- No nested interactive elements
- Reduced motion support
- Proper focus management
- Semantic HTML structure
