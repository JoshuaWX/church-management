import { NextResponse } from 'next/server';

const COOKIE_NAME = 'site_auth';

export async function POST() {
  // Clear the cookie by setting it to expire in the past
  return NextResponse.json({ success: true }, {
    status: 200,
    headers: {
      'Set-Cookie': `${COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; HttpOnly`,
    },
  });
}
