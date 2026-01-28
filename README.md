# Portfolio Template

A modern, full-stack portfolio template built with React and Express. Features a stunning UI, admin dashboard, GitHub integration, and easy customization through a single configuration file.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://ravinduportfolio.dev/)

**[View Live Demo](https://ravinduportfolio.dev/)**

## Screenshots

![Home Page](docs/screenshots/home.png)

| About | Portfolio | Contact |
|-------|-----------|---------|
| ![About](docs/screenshots/about.png) | ![Portfolio](docs/screenshots/portfolio.png) | ![Contact](docs/screenshots/contact.png) |

<details>
<summary>Admin Dashboard</summary>

![Admin Dashboard](docs/screenshots/admin.png)

</details>

## Features

- **Modern UI** - Glassmorphism design with smooth animations (Framer Motion)
- **Single Config File** - Customize all content through `portfolio.config.ts`
- **Admin Dashboard** - Manage projects, blog posts, and skills
- **GitHub Integration** - Auto-sync projects from your GitHub repositories
- **Blog System** - Rich text editor with comments
- **Analytics** - Built-in page view tracking
- **Responsive** - Looks great on all devices
- **Dark Mode** - Built-in dark theme
- **SEO Ready** - Optimized for search engines

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Xza85hrf/Modern-portfolio-template.git my-portfolio
cd my-portfolio
npm install
```

### 2. Configure Environment

```bash
cp .env.template .env
```

Edit `.env` with your database credentials. At minimum, you need:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your-secret-key-at-least-64-characters
ADMIN_PASSWORD=your-admin-password
```

### 3. Customize Your Portfolio

Edit `portfolio.config.ts` with your information:

```typescript
const config: PortfolioConfig = {
  personal: {
    name: "Your Name",
    email: "your@email.com",
    title: "Your Title",
    // ...
  },
  // See portfolio.config.sample.ts for all options
};
```

### 4. Initialize Database

```bash
npm run db:push
npm run db:seed-sample  # Optional: add sample data
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5000` to see your portfolio!

## Configuration

All personal content is managed through `portfolio.config.ts`:

| Section | Description |
|---------|-------------|
| `personal` | Name, email, location, title |
| `hero` | Landing page headline and CTAs |
| `about` | Introduction and stats |
| `services` | Your services/expertise |
| `timeline` | Career journey events |
| `social` | GitHub, LinkedIn, Twitter links |
| `site` | SEO metadata and logo |
| `navigation` | Menu items and CTA button |
| `contact` | Contact page content |

See `portfolio.config.sample.ts` for a complete reference.

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── lib/          # Utilities and config context
├── server/               # Express backend
│   ├── lib/              # Server utilities
│   └── routes.ts         # API routes
├── db/                   # Database schema and seeds
├── shared/               # Shared types
├── docs/                 # Documentation
├── portfolio.config.ts   # Main configuration file
└── .env.template         # Environment template
```

## Admin Dashboard

Access the admin dashboard at `/admin` with the password set in `ADMIN_PASSWORD`.

Features:
- **Projects** - Add, edit, delete portfolio projects
- **Blog** - Create and manage blog posts
- **Skills** - Manage skill ratings
- **GitHub Sync** - Import projects from GitHub
- **Analytics** - View page statistics

## GitHub Integration

To auto-sync projects from GitHub:

1. Set `GITHUB_USERNAME` in `.env`
2. Create a [Personal Access Token](https://github.com/settings/tokens)
3. Set `GITHUB_TOKEN` in `.env`
4. Use "Sync GitHub" in the admin dashboard

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

### Other Platforms

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for:
- Railway
- Render
- DigitalOcean
- Traditional VPS

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:seed-sample` | Seed with sample data |
| `npm run setup` | Interactive setup wizard |

## Documentation

- [Customization Guide](docs/CUSTOMIZATION.md) - Detailed customization instructions
- [Deployment Guide](docs/DEPLOYMENT.md) - Platform-specific deployment guides
- [Admin Guide](docs/ADMIN_GUIDE.md) - Using the admin dashboard
- [Architecture](docs/ARCHITECTURE.md) - Technical architecture overview

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, Shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL, Drizzle ORM
- **Auth**: JWT, bcrypt
- **API**: GitHub API, Gemini AI (optional)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - feel free to use this template for your own portfolio!

---

**Need help?** Open an issue on GitHub or check the [documentation](docs/).
