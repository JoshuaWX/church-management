import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import PasswordGate from '@/components/PasswordGate';
import LogoutButton from '@/components/LogoutButton';
import './globals.css';
import { cookies } from 'next/headers';

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
  const isAuthed = cookieStore.get('site_auth')?.value === '1';
  return (
    <html lang="en">
      <body className={inter.className}>
        {!isAuthed ? (
          <PasswordGate />
        ) : (
          <>
            <div className="relative pb-16 sm:pb-0 min-h-screen">
              <div className="absolute top-4 right-4 z-50">
                <LogoutButton />
              </div>
              {children}
            </div>
            <MobileBottomNav />
          </>
        )}
      </body>
    </html>
  );
}
