# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `bun run dev` (or `npm run dev`)
  - Runs Next.js dev server on http://localhost:3000 with hot reload
- **Build for production**: `bun run build` (or `npm run build`)
- **Start production server**: `bun run start`
- **Lint code**: `bun run lint` (or `npm run lint`)
  - Uses ESLint with Next.js configuration

The project uses Bun as the package manager (see `bun.lock`).

## Project Architecture

This is a **Next.js 16 dashboard application** for settings management across different projects using the **App Router**. The dashboard is protected behind JWT-based authentication.

### Authentication & Access Control Flow

The application implements a two-stage authentication system:

1. **Code Login Phase**: Users initially log in with an access code
   - This is an unprotected entry point
   - Code validation grants an access token (JWT)
   - Protected routes require valid JWT token validation

2. **Dashboard Phase**: After successful authentication
   - Users are redirected to the protected dashboard
   - Dashboard allows viewing and modifying settings for connected projects
   - All dashboard routes are protected and require valid JWT

**Key Points**:
- JWT tokens are used for session management and route protection
- All dashboard functionality requires valid authentication
- Initial code validation is the gate to token generation

### Tech Stack
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 (PostCSS-based) with tw-animate-css animations
- **Component System**: shadcn/ui style (configured in `components.json`)
- **Language**: TypeScript with strict mode enabled
- **Icons**: Lucide React
- **Authentication**: JWT-based

### Directory Structure
- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with metadata and font imports (Geist Sans/Mono)
  - `page.tsx` - Home page (login entry point)
  - `globals.css` - Global styles with Tailwind directives and theme variables
- `lib/` - Utilities
  - `utils.ts` - Export `cn()` function for merging Tailwind classes (uses clsx + tailwind-merge)
- `components.json` - shadcn/ui configuration with aliases (`@/components`, `@/lib`, etc.)

### Styling System

**Tailwind CSS v4 with Custom Theme**:
- Uses CSS custom properties (CSS variables) for theming in `globals.css`
- OKLCH color space for colors (modern CSS color format)
- Defines theme variables: primary, secondary, accent, destructive, border, input, ring, chart colors, and sidebar colors
- Includes dark mode support with `.dark` class selector
- Base layer applies border and outline styles globally

**Theme Color Variables** (set in `globals.css`):
- Primary color palette: `--primary`, `--primary-foreground`
- Sidebar colors: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, etc.
- Chart colors: `--chart-1` through `--chart-5`
- Semantic colors: destructive, accent, muted, secondary
- Spacing: `--radius` with calculated variants (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`)

### TypeScript Configuration
- Target: ES2017
- Module resolution: bundler (Next.js native)
- Path aliases configured for clean imports: `@/*` maps to root
- Strict mode enabled for type safety

## Key Configuration Files

- `next.config.ts` - Next.js configuration (currently empty, ready for customization)
- `tsconfig.json` - TypeScript settings with Next.js plugin integration
- `postcss.config.mjs` - PostCSS configuration (uses @tailwindcss/postcss plugin)
- `package.json` - Dependencies and scripts (using Bun)

## Important Notes for Development

1. **Component Aliases**: When importing components, use the aliases defined in `components.json`:
   - Components: `@/components/...`
   - Utilities: `@/lib/...`
   - UI components: `@/components/ui/...`

2. **Tailwind + Class Merging**: Always use the `cn()` function from `@/lib/utils` when conditionally combining Tailwind classes to avoid conflicts

3. **Font Configuration**: The app uses Google Fonts (Geist Sans and Mono) loaded via `next/font` in the layout

4. **Color Theme**: When adding new components, reference the CSS variables in `globals.css` (e.g., `bg-primary`, `text-foreground`) rather than hardcoding colors to maintain theme consistency

## Authentication System (Fully Implemented)

The authentication system is **complete and ready to use**. See [AUTHENTICATION.md](AUTHENTICATION.md) for detailed documentation.

### Key Files
- [lib/auth.ts](lib/auth.ts) - JWT utilities and code validation
- [app/api/auth/](app/api/auth/) - Authentication endpoints (login, verify, logout)
- [middleware.ts](middleware.ts) - Route protection middleware
- [components/login-form.tsx](components/login-form.tsx) - OTP input component
- [components/dashboard-layout.tsx](components/dashboard-layout.tsx) - Protected layout wrapper

### Quick Reference

**Login Flow**:
1. User enters 4-digit code on `app/page.tsx`
2. Code sent to `/api/auth/login` endpoint
3. Server validates (currently hardcoded: '1111')
4. If valid, JWT token issued and stored in HTTP-only cookie
5. Middleware protects `/dashboard/*` routes - redirects if no valid token

**Testing the System**:
- Test code: **1111**
- Token expires after 24 hours
- All dashboard routes require valid JWT

### For Development
- Change valid code in [lib/auth.ts](lib/auth.ts) line 6: `const VALID_CODE = '1111';`
- Set `JWT_SECRET` environment variable for production (defaults to 'your-secret-key-change-this')
- Database integration for codes is marked as TODO
