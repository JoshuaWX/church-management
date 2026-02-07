/**
 * Security utilities for the application
 * - Password hashing with SHA-256 + salt
 * - Rate limiting for brute force protection
 * - Secure token generation
 * - Timing-safe comparison
 */

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { attempts: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

/**
 * Check if an IP is rate limited
 */
export function isRateLimited(ip: string): { limited: boolean; remainingAttempts: number; resetInMs: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(ip, { attempts: 0, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, remainingAttempts: MAX_ATTEMPTS, resetInMs: RATE_LIMIT_WINDOW_MS };
  }
  
  const remainingAttempts = MAX_ATTEMPTS - record.attempts;
  const resetInMs = record.resetTime - now;
  
  return {
    limited: record.attempts >= MAX_ATTEMPTS,
    remainingAttempts: Math.max(0, remainingAttempts),
    resetInMs
  };
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { attempts: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
  } else {
    record.attempts++;
  }
}

/**
 * Clear rate limit for an IP (on successful login)
 */
export function clearRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}

/**
 * Hash a password using SHA-256 with a static salt
 * In production, consider using bcrypt via a Node.js runtime
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = process.env.PASSWORD_SALT || 'bible-study-hub-2024';
  const data = new TextEncoder().encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Compare against itself to maintain constant time
    const dummy = a;
    let result = 0;
    for (let i = 0; i < dummy.length; i++) {
      result |= dummy.charCodeAt(i) ^ dummy.charCodeAt(i);
    }
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Generate a secure random session token
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Session store for validating tokens (in production, use Redis or database)
 */
const sessionStore = new Map<string, { createdAt: number; ip: string }>();
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Create a new session
 */
export function createSession(token: string, ip: string): void {
  // Clean up expired sessions periodically
  const now = Date.now();
  for (const [key, session] of sessionStore.entries()) {
    if (now - session.createdAt > SESSION_MAX_AGE_MS) {
      sessionStore.delete(key);
    }
  }
  
  sessionStore.set(token, { createdAt: now, ip });
}

/**
 * Validate a session token
 */
export function validateSession(token: string): boolean {
  const session = sessionStore.get(token);
  if (!session) return false;
  
  const now = Date.now();
  if (now - session.createdAt > SESSION_MAX_AGE_MS) {
    sessionStore.delete(token);
    return false;
  }
  
  return true;
}

/**
 * Invalidate a session
 */
export function invalidateSession(token: string): void {
  sessionStore.delete(token);
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Generate secure cookie options
 */
export function getSecureCookieOptions(): string {
  const secure = isProduction() ? '; Secure' : '';
  return `Path=/; SameSite=Strict; HttpOnly${secure}`;
}
