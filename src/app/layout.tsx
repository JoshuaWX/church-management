import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MobileBottomNav } from '@/components/MobileBottomNav'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bible-Study HUB',
  description: 'Manage church members, birthdays, and attendance',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="pb-16 sm:pb-0">
          {children}
        </div>
        <MobileBottomNav />
      </body>
    </html>
  )
}
