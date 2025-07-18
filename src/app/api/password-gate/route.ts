import { NextResponse } from 'next/server';

const PASSWORD = process.env.SITE_PASSWORD || 'church2025';
const COOKIE_NAME = 'site_auth';

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password === PASSWORD) {
    // Set a session cookie (expires on browser close)
    return NextResponse.json({ success: true }, {
      status: 200,
      headers: {
        // No Max-Age or Expires: session cookie, expires on browser close
        'Set-Cookie': `${COOKIE_NAME}=1; Path=/; SameSite=Lax; HttpOnly`,
      },
    });
  }
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
