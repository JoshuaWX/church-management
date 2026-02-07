import { Navigation } from '@/components/Navigation'
import { BirthdayDashboard } from '@/components/BirthdayDashboard'
import { Users, UserCheck, Calendar, BarChart3 } from 'lucide-react'
import Link from 'next/link'

const quickLinks = [
  { name: 'Members', href: '/members', icon: Users, desc: 'View & manage members', color: 'bg-primary-50 text-primary-600' },
  { name: 'Attendance', href: '/attendance', icon: UserCheck, desc: 'Record attendance', color: 'bg-green-50 text-green-600' },
  { name: 'Birthdays', href: '/birthdays', icon: Calendar, desc: 'Birthday calendar', color: 'bg-pink-50 text-pink-600' },
  { name: 'Reports', href: '/reports', icon: BarChart3, desc: 'View reports', color: 'bg-purple-50 text-purple-600' },
]

export default function Home() {
  return (
    <main>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="page-title">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Welcome to Bible-Study HUB &mdash; manage your fellowship in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                className="card hover:shadow-md transition-shadow p-4 flex flex-col items-center text-center group"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${link.color} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className="text-sm font-semibold text-gray-900">{link.name}</span>
                <span className="text-xs text-gray-500 mt-0.5 hidden sm:block">{link.desc}</span>
              </Link>
            )
          })}
        </div>

        {/* Birthday Section */}
        <BirthdayDashboard />
      </div>
    </main>
  )
}
