# Authentication & Authorization System

This document describes the complete authentication and authorization system implemented in the IMKAT Dashboard.

## Overview

The application uses JWT (JSON Web Tokens) for session management with a code-based entry system. Users enter a 4-digit code to receive a JWT token, which is then used to access protected dashboard routes. Route protection is enforced by Next.js middleware, which validates tokens on every request to protected routes.

## Architecture

### Authentication Flow

```
1. User enters 4-digit code on login page (/)
   ↓
2. LoginForm sends code to /api/auth/login endpoint
   ↓
3. Server validates code (currently hardcoded as '1111')
   ↓
4. If valid: generates JWT token and sets HTTP-only cookie
   ↓
5. Client redirects to /dashboard
   ↓
6. Middleware validates JWT on each protected route request
   ↓
7. If token valid: allows access to dashboard
   If token invalid/missing: redirects to login
```

### Security Features

- **HTTP-Only Cookies**: JWT tokens stored in HTTP-only cookies (cannot be accessed by JavaScript)
- **Secure Flag**: Cookies marked as secure in production (HTTPS only)
- **SameSite Protection**: SameSite=Lax to prevent CSRF attacks
- **Token Expiration**: Tokens expire after 24 hours
- **Token Verification**: Every protected route verifies token validity

## File Structure

### Core Authentication Files

#### `lib/auth.ts`
Contains authentication utilities:
- `validateCode(code: string)`: Validates the access code (currently hardcoded to '1111')
- `generateToken()`: Creates a new JWT token valid for 24 hours
- `verifyToken(token: string)`: Verifies token validity
- `decodeToken(token: string)`: Decodes token without verification

**JWT Configuration**:
- Secret: `process.env.JWT_SECRET` (defaults to 'your-secret-key-change-this')
- Expiry: 24 hours ('24h')

#### `middleware.ts`
Middleware for protecting routes:
- Allows public routes (/, /api/auth/login)
- Protects /dashboard/* and /api/protected/* routes
- Verifies JWT on protected routes
- Redirects to login if token is missing or invalid
- Clears invalid tokens from cookies

### API Routes

#### `app/api/auth/login/route.ts`
- **Method**: POST
- **Body**: `{ code: string }`
- **Response**:
  - Success: `{ success: true, token: string }` + HTTP-only cookie
  - Error: `{ error: string }` with status 401

Sets HTTP-only cookie with 24-hour expiration.

#### `app/api/auth/verify/route.ts`
- **Method**: GET
- **Response**:
  - Success: `{ authenticated: true }` (status 200)
  - Error: `{ error: string }` (status 401)

Checks if token in cookie is valid. Used by components to verify authentication status.

#### `app/api/auth/logout/route.ts`
- **Method**: POST
- **Response**: `{ success: true }` and clears token cookie

### Components

#### `components/login-form.tsx`
Login page UI component:
- 4-digit OTP input using shadcn/ui `InputOTP`
- Validates code format (must be exactly 4 digits)
- Shows loading state during submission
- Displays error messages
- Auto-submits when 4 digits are entered
- Test code hint: '1111'

#### `components/dashboard-layout.tsx`
Layout wrapper for protected dashboard pages:
- Displays logout button in header
- Handles logout flow (clears token, redirects to login)
- Wraps all dashboard content
- **Note**: Route protection is handled by middleware, not this component

### Pages

#### `app/page.tsx`
Home/login page:
- Displays LoginForm for entering access code
- Client component for login form interactivity
- No auth checks (middleware handles redirects for authenticated users accessing `/`)

#### `app/dashboard/layout.tsx`
Dashboard layout:
- Wraps dashboard content with DashboardLayout component

#### `app/dashboard/page.tsx`
Dashboard home page:
- Protected route (requires valid JWT)
- Shows authentication status cards
- Placeholder for future dashboard features

## Usage

### For Users

1. Navigate to the application
2. Enter the 4-digit access code (test code: **1111**)
3. Click "Verify Code" or wait for auto-submit
4. If valid, you're redirected to the dashboard
5. Click "Logout" to clear your session and return to login

### For Developers

#### Adding a New Protected Route

1. Create route under `app/dashboard/`
2. Use `DashboardLayout` component wrapper
3. Middleware will automatically protect it
4. Components can use `/api/auth/verify` to check auth status

#### Changing the Access Code

Edit `lib/auth.ts`:
```typescript
const VALID_CODE = '1111'; // Change this to your code
```

**Note**: Currently the code is hardcoded. The TODO mentions implementing database validation later.

#### Customizing Token Expiry

Edit `lib/auth.ts`:
```typescript
const JWT_EXPIRY = '24h'; // Change this duration
```

#### Using JWT Secret from Environment

Set in `.env.local`:
```
JWT_SECRET=your-secure-secret-key-here
```

The code defaults to 'your-secret-key-change-this' if not set.

## Protected Routes

Currently protected routes:
- `/dashboard` - Main dashboard
- `/dashboard/*` - Any sub-routes under dashboard
- `/api/protected/*` - Protected API endpoints

Login and authentication endpoints are public:
- `/` - Login page
- `/api/auth/login` - Code validation
- `/api/auth/verify` - Token verification (public, used by components)
- `/api/auth/logout` - Logout endpoint

## Components Used

The authentication UI is built with shadcn/ui components:
- `Button` - Submit button
- `InputOTP` - 4-digit code input
- `Alert` - Error messages
- `Card` - Dashboard status cards

## Next Steps (TODO)

1. **Database Integration**: Replace hardcoded code with database lookup
   - Create codes table with expiration
   - Validate code existence and expiration

2. **Enhanced Security** (optional):
   - Implement refresh tokens for extended sessions
   - Add rate limiting on login attempts
   - Add audit logging for authentication events

3. **User Improvements** (optional):
   - Add code generation/management UI
   - Add session management (view active sessions)
   - Add password recovery options

## Troubleshooting

### "Invalid code" error
- Check the code you entered matches exactly (should be '1111' for testing)
- Ensure no spaces are included

### Redirected to login after entering dashboard
- Token may have expired (valid for 24 hours)
- Browser cookies may be disabled
- Check browser console for errors

### Middleware warning about deprecated format
- Next.js is warning about the middleware file convention
- This can be safely ignored or updated to use the new "proxy" pattern in future versions

## Environment Variables

```bash
# Optional: Set a custom JWT secret
JWT_SECRET=your-secure-secret-key-here

# Or use the default (not recommended for production):
# JWT_SECRET=your-secret-key-change-this
```

## Security Recommendations for Production

1. **Change JWT Secret**: Generate a strong random secret in production
2. **Use HTTPS**: Ensure all traffic is encrypted
3. **Add Rate Limiting**: Prevent brute force attacks on the login endpoint
4. **Implement Code Rotation**: Change valid codes periodically
5. **Add Logging**: Log all authentication attempts
6. **Use Database**: Move from hardcoded codes to a secure database
7. **Add MFA** (optional): Implement multi-factor authentication if needed
