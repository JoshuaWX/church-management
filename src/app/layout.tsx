import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import PasswordGate from '@/components/PasswordGate';
import './globals.css';
import { cookies } from 'next/headers';
import { validateSignedToken } from '@/lib/security';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bible-Study HUB',
  description: 'Manage church members, birthdays, and attendance',
};

export const viewport = 'width=device-width, initial-scale=1';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('site_auth')?.value;
  
  const isAuthed = sessionToken ? await validateSignedToken(sessionToken) : false;
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        {!isAuthed ? (
          <PasswordGate />
        ) : (
          <>
            <div className="min-h-screen pb-16 sm:pb-0">
              {children}
            </div>
            <MobileBottomNav />
          </>
        )}
      </body>
    </html>
  );
}
