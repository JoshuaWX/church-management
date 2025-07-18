import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MobileBottomNav } from '@/components/MobileBottomNav'
import './globals.css'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bible-Study HUB',
  description: 'Manage church members, birthdays, and attendance',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
}

function PasswordGate() {
  const [error, setError] = useState('');
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <form
            onSubmit={async e => {
              e.preventDefault();
              setError('');
              const pw = (document.getElementById('site_pw') as HTMLInputElement).value;
              const res = await fetch('/api/password-gate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pw })
              });
              if (res.ok) {
                window.location.reload();
              } else {
                setError('Incorrect password');
              }
            }}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
          >
            <h2 className="text-xl font-bold mb-4 text-primary-600">Enter Site Password</h2>
            <input
              id="site_pw"
              type="password"
              className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Password"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700">Login</button>
          </form>
        </div>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthed = typeof window !== 'undefined' ? document.cookie.includes('site_auth=1') : false;
  if (typeof window !== 'undefined' && !isAuthed) {
    return <PasswordGate />;
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="pb-16 sm:pb-0">
          {children}
        </div>
        <MobileBottomNav />
      </body>
    </html>
  );
}
