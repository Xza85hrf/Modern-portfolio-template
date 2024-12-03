# Development Guide

## Project Structure

```sh
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   └── pages/       # Page components
├── server/               # Backend Express application
│   ├── lib/             # Server utilities
│   └── routes.ts        # API routes
├── db/                  # Database configuration
│   ├── schema.ts       # Database schema
│   └── index.ts        # Database connection
└── docs/               # Documentation
```

## Development Setup

This project follows a standard development workflow suitable for any development environment. The setup is platform-agnostic and can be used with any modern IDE or development tools.

Key development features:

- Standard Node.js/React development workflow
- TypeScript for type safety
- Modular architecture for easy maintenance
- Comprehensive testing support
- Platform-agnostic deployment options

See the [Deployment Guide](DEPLOYMENT.md) for detailed setup and deployment instructions.

## Development Standards

### Frontend Development

1. **Component Structure**
   - Use functional components with TypeScript
   - Implement proper error boundaries
   - Follow React Query patterns for data fetching

   ```tsx
   import { useQuery } from "@tanstack/react-query";
   
   export default function Component() {
     const { data, isLoading } = useQuery({
       queryKey: ["key"],
       queryFn: () => fetch("/api/endpoint").then(res => res.json())
     });
   }
   ```

2. **State Management**
   - Use React Query for server state
   - Use local state for UI-only concerns
   - Implement proper loading states

3. **Styling**
   - Use Tailwind CSS for styling
   - Follow mobile-first approach
   - Use Shadcn components when available

   ```tsx
   import { Button } from "@/components/ui/button";
   
   <Button variant="outline" size="sm">
     Click me
   </Button>
   ```

### Backend Development

1. **API Routes**
   - Follow RESTful conventions
   - Implement proper error handling
   - Use TypeScript for type safety

   ```typescript
   app.get("/api/resource", async (req, res) => {
     try {
       // Implementation
     } catch (error) {
       console.error("Error:", error);
       res.status(500).json({ message: "Internal server error" });
     }
   });
   ```

2. **Database Operations**
   - Use Drizzle ORM for database operations
   - Implement proper validation
   - Handle edge cases

   ```typescript
   import { db } from "../db";
   import { projects } from "@db/schema";
   
   const result = await db.query.projects.findMany({
     orderBy: (projects, { desc }) => [desc(projects.createdAt)]
   });
   ```

### Testing

1. **Frontend Testing**
   - Write unit tests for components
   - Test user interactions
   - Verify data fetching

2. **Backend Testing**
   - Test API endpoints
   - Verify database operations
   - Check error handling

### Performance Optimization

1. **Frontend**
   - Implement code splitting
   - Optimize images and assets
   - Use proper caching strategies

2. **Backend**
   - Implement API rate limiting
   - Use proper database indexing
   - Cache frequently accessed data

## Development Workflow

1. **Starting Development**

   ```bash
   npm run dev
   ```

2. **Making Changes**
   - Create feature branch
   - Make changes
   - Run tests
   - Submit pull request

3. **Database Changes**
   - Update schema in `db/schema.ts`
   - Run migration:

   ```bash
   npm run db:push
   ```

4. **Deployment**
   - Build application:

   ```bash
   npm run build
   ```

   - Start production server:

   ```bash
   npm start
   ```

## Best Practices

1. **Code Quality**
   - Use TypeScript strictly
   - Follow ESLint rules
   - Write meaningful comments
   - Use meaningful variable names

2. **Git Workflow**
   - Write clear commit messages
   - Keep commits focused
   - Update documentation
   - Reference issues in commits

3. **Security**
   - Validate user input
   - Implement proper authentication
   - Use environment variables
   - Follow security best practices

4. **Documentation**
   - Update README.md
   - Document API changes
   - Update setup guides
   - Add JSDoc comments

## Getting Help

1. Check existing documentation
2. Review GitHub issues
3. Ask in discussions
4. Contact development team
