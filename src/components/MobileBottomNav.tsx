'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Calendar, UserCheck, BarChart3 } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Birthdays', href: '/birthdays', icon: Calendar },
  { name: 'Attendance', href: '/attendance', icon: UserCheck },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 sm:hidden z-50"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-400 active:text-primary-500'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] font-medium truncate ${isActive ? 'font-semibold' : ''}`}>
                {item.name}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-b" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
