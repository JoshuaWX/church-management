import { NextRequest, NextResponse } from 'next/server';
import { getSecureCookieOptions } from '@/lib/security';

const COOKIE_NAME = 'site_auth';

export async function POST(request: NextRequest) {
  // Clear the cookie
  const cookieOptions = getSecureCookieOptions();
  
  return NextResponse.json({ success: true }, {
    status: 200,
    headers: {
      'Set-Cookie': `${COOKIE_NAME}=; ${cookieOptions}; Max-Age=0`,
    },
  });
}
