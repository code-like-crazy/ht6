# HT6 Frontend - Next.js Application

The main user interface for HT6, an AI-powered knowledge engine for team onboarding. Built with Next.js 14, TypeScript, and modern React patterns.

## Architecture Overview

This Next.js application serves as the primary user interface and handles:
- User authentication via Auth0
- Organization and project management
- Dashboard and settings interfaces
- API integration with the Flask backend
- Database operations via DrizzleORM

## Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages (grouped route)
│   │   │   └── login/         # Login page
│   │   ├── (dashboard)/       # Dashboard pages (grouped route)
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── organizations/ # Organization management
│   │   │   └── settings/      # User settings
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Auth0 integration endpoints
│   │   │   ├── organizations/ # Organization CRUD operations
│   │   │   └── user/          # User management endpoints
│   │   ├── hello/             # Test page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable React components
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── layout/            # Layout components (sidebar, navbar)
│   │   ├── organizations/     # Organization management components
│   │   ├── providers/         # Context providers
│   │   └── ui/                # Shadcn/ui components
│   ├── lib/                   # Utilities and configurations
│   │   ├── validations/       # Zod schemas for validation
│   │   ├── auth0.ts           # Auth0 configuration
│   │   └── utils.ts           # Utility functions
│   └── server/                # Server-side code
│       ├── db/                # Database configuration and schema
│       └── services/          # Business logic services
├── certificates/              # SSL certificates for HTTPS development
├── public/                    # Static assets
└── Configuration files (package.json, tsconfig.json, etc.)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (recommend [Neon](https://neon.tech))
- Auth0 account for authentication

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Environment Setup

Create `.env.local` in the client directory:

```env
# Auth0 Configuration
AUTH0_SECRET=your-32-character-secret-key
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Database Setup

The project uses DrizzleORM with PostgreSQL. Schema is defined in `src/server/db/schema.ts`.

```bash
# Generate database migrations (if schema changes)
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio for database management
npm run db:studio
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety throughout the application
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern component library
- **Auth0** - Authentication and user management
- **DrizzleORM** - Type-safe database ORM
- **Zod** - Schema validation
- **React Hook Form** - Form handling

## Development Workflow

### Adding New Pages

1. **Public Pages**: Add to `src/app/` directory
2. **Authenticated Pages**: Add to `src/app/(dashboard)/` directory
3. **Auth Pages**: Add to `src/app/(auth)/` directory

Example: Adding a new dashboard page
```bash
# Create the page directory
mkdir src/app/(dashboard)/projects

# Create the page component
touch src/app/(dashboard)/projects/page.tsx
```

### Creating Components

Components are organized by feature and purpose:

```bash
# UI components (reusable across the app)
src/components/ui/

# Feature-specific components
src/components/dashboard/
src/components/organizations/
src/components/auth/

# Layout components
src/components/layout/
```

Example component structure:
```typescript
// src/components/dashboard/project-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProjectCardProps {
  title: string
  description: string
}

export function ProjectCard({ title, description }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  )
}
```

### Adding API Routes

API routes follow Next.js App Router conventions in `src/app/api/`:

```typescript
// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0'

export async function GET(request: NextRequest) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Your logic here
  return NextResponse.json({ projects: [] })
}
```

### Database Operations

Use DrizzleORM for type-safe database operations:

```typescript
// src/server/services/project.ts
import { db } from '@/server/db'
import { projects } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function getProjectsByUserId(userId: string) {
  return await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
}
```

### Form Handling

Use React Hook Form with Zod validation:

```typescript
// Define schema
const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

// In component
const form = useForm<z.infer<typeof projectSchema>>({
  resolver: zodResolver(projectSchema),
})
```

## Authentication

The app uses Auth0 for authentication with custom session handling:

- **Login**: `/api/auth/custom-login`
- **Logout**: `/api/auth/custom-logout`
- **Callback**: `/api/auth/custom-callback`
- **User Sync**: `/api/auth/sync-user` (syncs Auth0 user to database)

### Protecting Routes

Use middleware for route protection:

```typescript
// src/middleware.ts
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge'

export default withMiddlewareAuthRequired()

export const config = {
  matcher: ['/dashboard/:path*', '/organizations/:path*', '/settings/:path*']
}
```

## Styling

### TailwindCSS

The project uses TailwindCSS for styling with a custom configuration:

```typescript
// Example component with Tailwind classes
export function Button({ children, variant = "default" }) {
  return (
    <button className={cn(
      "px-4 py-2 rounded-md font-medium transition-colors",
      variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
      variant === "outline" && "border border-gray-300 hover:bg-gray-50"
    )}>
      {children}
    </button>
  )
}
```

### Component Variants

Use `class-variance-authority` for component variants:

```typescript
import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## State Management

The app uses React Context for global state:

- **UserProvider**: User session and profile data
- **ThemeProvider**: Dark/light mode toggle

### Adding New Context

```typescript
// src/components/providers/project-provider.tsx
"use client"

import { createContext, useContext, useState } from 'react'

interface ProjectContextType {
  currentProject: Project | null
  setCurrentProject: (project: Project | null) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null)

  return (
    <ProjectContext.Provider value={{ currentProject, setCurrentProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
```

## Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests (when implemented)
npm run test:e2e
```

## Building and Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Analyze bundle size
npm run analyze
```

## Common Development Tasks

### Adding a New Feature

1. Create the database schema in `src/server/db/schema.ts`
2. Generate and push database changes
3. Create API routes in `src/app/api/`
4. Create service functions in `src/server/services/`
5. Build UI components in `src/components/`
6. Create pages in `src/app/(dashboard)/`
7. Add navigation links in sidebar component

### Debugging

- Use React DevTools for component debugging
- Check Network tab for API call issues
- Use Drizzle Studio for database inspection
- Check Auth0 logs for authentication issues

### Performance Optimization

- Use Next.js Image component for images
- Implement proper loading states
- Use React.memo for expensive components
- Optimize database queries with proper indexing

## Troubleshooting

### Common Issues

1. **Auth0 Configuration**: Ensure all environment variables are set correctly
2. **Database Connection**: Check DATABASE_URL format and database accessibility
3. **CORS Issues**: Verify API_URL configuration matches backend
4. **Build Errors**: Check TypeScript errors and missing dependencies

### Getting Help

- Check the main project README for overall architecture
- Review Next.js documentation for framework-specific issues
- Check Auth0 documentation for authentication problems
- Use Drizzle documentation for database-related questions

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Add proper error handling and loading states
4. Test authentication flows thoroughly
5. Update this README when adding new features or changing structure
