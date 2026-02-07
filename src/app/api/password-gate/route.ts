import { NextResponse } from 'next/server';
import {
  hashPassword,
  timingSafeEqual,
  isRateLimited,
  recordFailedAttempt,
  clearRateLimit,
  createSignedToken,
  getClientIP,
  getSecureCookieOptions,
} from '@/lib/security';

const COOKIE_NAME = 'site_auth';

// Pre-compute the expected password hash at startup
let expectedPasswordHash: string | null = null;

async function getExpectedHash(): Promise<string | null> {
  const envPassword = process.env.SITE_PASSWORD;
  
  // SECURITY: Require password to be set via environment variable
  if (!envPassword) {
    console.error('SECURITY ERROR: SITE_PASSWORD environment variable is not set!');
    return null;
  }
  
  if (!expectedPasswordHash) {
    expectedPasswordHash = await hashPassword(envPassword);
  }
  return expectedPasswordHash;
}

export async function POST(request: Request) {
  const clientIP = getClientIP(request);
  
  // Check rate limiting
  const rateLimit = isRateLimited(clientIP);
  if (rateLimit.limited) {
    const retryAfterSeconds = Math.ceil(rateLimit.resetInMs / 1000);
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': retryAfterSeconds.toString(),
        }
      }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    // Validate input
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Get expected hash (requires env variable to be set)
    const expectedHash = await getExpectedHash();
    if (!expectedHash) {
      // Don't reveal that password isn't configured
      recordFailedAttempt(clientIP);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Hash the provided password and compare
    const providedHash = await hashPassword(password);
    
    // Use timing-safe comparison to prevent timing attacks
    if (timingSafeEqual(providedHash, expectedHash)) {
      // Clear rate limit on successful login
      clearRateLimit(clientIP);
      
      // Generate signed session token (stateless, works on serverless)
      const sessionToken = await createSignedToken();
      
      // Set secure cookie
      const cookieOptions = getSecureCookieOptions();
      
      return NextResponse.json({ success: true }, {
        status: 200,
        headers: {
          'Set-Cookie': `${COOKIE_NAME}=${sessionToken}; ${cookieOptions}; Max-Age=86400`,
        },
      });
    }

    // Record failed attempt
    recordFailedAttempt(clientIP);
    
    // Generic error message (don't reveal if password exists)
    return NextResponse.json(
      { 
        error: 'Authentication failed',
        remainingAttempts: rateLimit.remainingAttempts - 1
      }, 
      { status: 401 }
    );
  } catch (error) {
    // Don't expose error details
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
