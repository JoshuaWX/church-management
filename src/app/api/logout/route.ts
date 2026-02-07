import { NextRequest, NextResponse } from 'next/server';
import { invalidateSession, getSecureCookieOptions } from '@/lib/security';

const COOKIE_NAME = 'site_auth';

export async function POST(request: NextRequest) {
  // Get the session token from cookies
  const sessionToken = request.cookies.get(COOKIE_NAME)?.value;
  
  // Invalidate the session if it exists
  if (sessionToken) {
    invalidateSession(sessionToken);
  }
  
  // Clear the cookie by setting it to expire in the past
  const cookieOptions = getSecureCookieOptions();
  
  return NextResponse.json({ success: true }, {
    status: 200,
    headers: {
      'Set-Cookie': `${COOKIE_NAME}=; ${cookieOptions}; Max-Age=0`,
    },
  });
}
