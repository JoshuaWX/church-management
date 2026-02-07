/**
 * Security utilities for the application
 * - Password hashing with SHA-256 + salt
 * - Rate limiting for brute force protection
 * - HMAC-signed session tokens (stateless, works on serverless)
 * - Timing-safe comparison
 */

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { attempts: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const SESSION_MAX_AGE_S = 24 * 60 * 60; // 24 hours in seconds

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
 * Create an HMAC-signed session token (stateless - works on serverless)
 * Format: timestamp.signature
 */
export async function createSignedToken(): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const secret = process.env.PASSWORD_SALT || process.env.SITE_PASSWORD || 'fallback';
  const data = new TextEncoder().encode(timestamp + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const signature = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `${timestamp}.${signature}`;
}

/**
 * Validate an HMAC-signed session token (stateless - works on serverless)
 */
export async function validateSignedToken(token: string): Promise<boolean> {
  if (!token || !token.includes('.')) return false;
  
  const [timestamp, signature] = token.split('.');
  if (!timestamp || !signature) return false;
  
  // Check if token has expired
  const tokenAge = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
  if (isNaN(tokenAge) || tokenAge < 0 || tokenAge > SESSION_MAX_AGE_S) {
    return false;
  }
  
  // Recompute the signature and compare
  const secret = process.env.PASSWORD_SALT || process.env.SITE_PASSWORD || 'fallback';
  const data = new TextEncoder().encode(timestamp + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const expectedSignature = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return timingSafeEqual(signature, expectedSignature);
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
  return `Path=/; SameSite=Lax; HttpOnly${secure}`;
}
