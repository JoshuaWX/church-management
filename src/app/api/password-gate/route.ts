import { NextResponse } from 'next/server';

const PASSWORD = process.env.SITE_PASSWORD || 'church2025';
const COOKIE_NAME = 'site_auth';

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password === PASSWORD) {
    // Set a secure cookie for 1 day
    return NextResponse.json({ success: true }, {
      status: 200,
      headers: {
        'Set-Cookie': `${COOKIE_NAME}=1; Path=/; Max-Age=86400; SameSite=Lax; HttpOnly`,
      },
    });
  }
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
