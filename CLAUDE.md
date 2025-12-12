# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server (runs on port 8080)
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Development Dependencies
- Use `npm i` for installing dependencies (package-lock.json present)
- Development server runs on `localhost:8080`

## Architecture Overview

### Technology Stack
- **Framework**: Vite + React 18 + TypeScript
- **Routing**: React Router DOM v6 with future flags enabled
- **UI Library**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack React Query for server state
- **Animations**: Framer Motion, GSAP
- **Maps**: Mapbox GL and tomtom API
- **Charts**: Recharts

### Project Structure

```
src/
├── components/           # Reusable components
│   ├── ui/              # shadcn/ui components + custom UI
│   ├── education/       # Education-specific components
│   └── *.tsx            # Main layout components (Navigation, Footer, etc.)
├── pages/               # Route components
│   ├── education/       # Education hub pages
│   ├── resume-builder/  # Resume builder section
│   ├── jobs/           # Job-related pages
│   ├── directories/    # Business/institution directories
│   └── scholarship/    # Scholarship pages
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/            # Static assets
```

### Key Features
1. **Education Hub** - Academic resources, study materials, CGPA calculator
2. **Job Portal** - Job listings, company profiles, resume builder
3. **Skilled Workers Directory** - Artisan/tradesperson marketplace
4. **Business Directories** - Hotels, restaurants, universities, schools
5. **Scholarship Hub** - Educational funding opportunities

### Styling System

**CRITICAL: Follow isolation guidelines in STYLING_GUIDELINES.md**
- Avoid global CSS dependencies
- Use component-specific prefixes for classes/IDs
- Use hardcoded hex colors instead of CSS variables when conflicts arise
- Create custom components instead of relying on global UI libraries when conflicts occur

### Design System
- **Typography**: Source Sans Pro (body), Crimson Text (headings)
- **Components**: Prefer shadcn/ui but isolate when conflicts occur

### Route Structure
- `/` - Landing page
- `/education/*` - Educational resources
- `/jobs/*` - Employment services  
- `/scholarship-hub/*` - Scholarship information
- `/skilled-workers/*` - Artisan directory
- `/directories/*` - Business listings

### State Management
- TanStack Query for server state caching
- React Router for navigation state
- Component-level state with useState/useReducer

### Development Notes
- Uses path alias `@/` for `src/` directory
- Dark mode support via next-themes
- Responsive design with custom Tailwind breakpoints
- Loading states managed via PageLoader component
- AI Assistant component for user support