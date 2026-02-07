# Security Documentation

This document outlines the security measures implemented in the Bible-Study HUB application.

## Authentication System

### Password Protection
- **Environment Variable**: Password must be set via `SITE_PASSWORD` environment variable
- **No Hardcoded Defaults**: The application will not allow login if the password is not configured
- **Password Hashing**: Passwords are hashed using SHA-256 with a configurable salt (`PASSWORD_SALT`)
- **Timing-Safe Comparison**: Prevents timing attacks when comparing password hashes

### Session Management
- **Secure Session Tokens**: 64-character cryptographically random tokens
- **Server-Side Session Store**: Sessions are validated server-side (in production, use Redis/database)
- **Session Expiry**: Sessions automatically expire after 24 hours
- **Session Invalidation**: Proper logout invalidates the session token

### Cookie Security
- **HttpOnly**: Prevents JavaScript access to cookies (XSS protection)
- **SameSite=Strict**: Prevents CSRF attacks
- **Secure Flag**: Automatically enabled in production (HTTPS only)
- **Server-Side Validation**: Cookies are validated on every request

### Rate Limiting
- **Brute Force Protection**: Maximum 5 login attempts per 15-minute window
- **IP-Based Tracking**: Rate limits are tracked per client IP address
- **Automatic Reset**: Rate limits reset after the window expires

## API Security

### Input Validation
All API endpoints validate and sanitize input data:
- **String Sanitization**: Removes HTML tags, JavaScript protocols, and event handlers
- **Length Limits**: All input strings are limited to reasonable lengths
- **Type Checking**: Strict type validation for all parameters
- **Format Validation**: Email, phone, and date formats are validated

### Authorization
- **Middleware Protection**: All API routes (except login/logout) require authentication
- **Cookie Validation**: Session tokens are verified on every API request

### Security Headers
The following security headers are added to all responses:
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS filter
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts browser features (camera, microphone, etc.)

## Setup Instructions

### 1. Create Environment File
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 2. Generate Secure Password
```bash
# Generate a strong random password
openssl rand -base64 32
```

### 3. Generate Password Salt
```bash
# Generate a secure salt for password hashing
openssl rand -hex 32
```

### 4. Configure Environment Variables
Edit `.env.local` with your values:
```env
SITE_PASSWORD=your-secure-password-here
PASSWORD_SALT=your-random-salt-here
DATABASE_URL=your-database-connection-string
```

### 5. Production Deployment
When deploying to production (Vercel, etc.):
1. Set `SITE_PASSWORD` in environment variables
2. Set `PASSWORD_SALT` in environment variables (different from development)
3. Set `NODE_ENV=production` (usually automatic)
4. Ensure HTTPS is enabled (required for Secure cookies)

## Security Best Practices

### For Developers
1. **Never commit secrets**: Keep `.env.local` in `.gitignore`
2. **Rotate credentials**: Change passwords periodically
3. **Use different salts**: Use unique salts for each environment
4. **Review dependencies**: Keep packages updated
5. **Audit logs**: Monitor access logs for suspicious activity

### For Production
1. **Use a proper session store**: Replace in-memory store with Redis/database
2. **Enable HTTPS**: Required for secure cookies
3. **Set up monitoring**: Track failed login attempts
4. **Regular backups**: Backup database securely
5. **Principle of least privilege**: Limit database permissions

## Known Limitations

### Current Implementation
- **In-Memory Session Store**: Sessions are lost on server restart (use Redis in production)
- **In-Memory Rate Limiting**: Rate limits reset on server restart (use Redis in production)
- **Single Password**: Consider implementing user accounts for multi-user scenarios

### Recommended Enhancements for High-Security Environments
- [ ] Implement bcrypt for password hashing (requires Node.js runtime)
- [ ] Add CAPTCHA after multiple failed attempts
- [ ] Implement 2FA (Two-Factor Authentication)
- [ ] Add audit logging for all operations
- [ ] Implement IP allowlisting for admin access
- [ ] Add Content Security Policy (CSP) headers

## Reporting Security Issues

If you discover a security vulnerability, please:
1. Do NOT create a public GitHub issue
2. Contact the maintainers privately
3. Allow reasonable time for a fix before disclosure
