import { Navigation } from '@/components/Navigation'
import { BirthdayDashboard } from '@/components/BirthdayDashboard'
import { RCCGLogo } from '@/components/RCCGLogo'
import { Users, UserCheck, Calendar, BarChart3 } from 'lucide-react'
import Link from 'next/link'

const quickLinks = [
  { name: 'Members', href: '/members', icon: Users, desc: 'View & manage members', color: 'bg-primary-50 text-primary-600' },
  { name: 'Attendance', href: '/attendance', icon: UserCheck, desc: 'Record attendance', color: 'bg-green-50 text-green-600' },
  { name: 'Birthdays', href: '/birthdays', icon: Calendar, desc: 'Birthday calendar', color: 'bg-pink-50 text-pink-600' },
  { name: 'Reports', href: '/reports', icon: BarChart3, desc: 'View reports', color: 'bg-purple-50 text-purple-600' },
]

const scriptures = [
  { text: 'For where two or three gather in my name, there am I with them.', ref: 'Matthew 18:20' },
  { text: 'Your word is a lamp for my feet, a light on my path.', ref: 'Psalm 119:105' },
  { text: 'Iron sharpens iron, and one person sharpens another.', ref: 'Proverbs 27:17' },
  { text: 'Let us not neglect our meeting together, as some people do.', ref: 'Hebrews 10:25' },
  { text: 'Study to shew thyself approved unto God, a workman that needeth not to be ashamed.', ref: '2 Timothy 2:15' },
  { text: 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training.', ref: '2 Timothy 3:16' },
  { text: 'Thy word have I hid in mine heart, that I might not sin against thee.', ref: 'Psalm 119:11' },
]

function getTodayScripture() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return scriptures[dayOfYear % scriptures.length]
}

export default function Home() {
  const scripture = getTodayScripture()

  return (
    <main>
      <Navigation />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 overflow-hidden">
        {/* Watermark logo */}
        <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
          <RCCGLogo size="xl" variant="light" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="hidden sm:flex flex-shrink-0 w-14 h-14 rounded-xl bg-white/10 items-center justify-center p-1.5">
              <RCCGLogo size="md" variant="light" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Welcome to Bible-Study HUB
              </h1>
              <p className="text-white/60 text-sm mt-1 font-medium">
                RCCG Fellowship &mdash; manage your fellowship in one place
              </p>
              {/* Scripture of the Day */}
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 max-w-2xl border border-white/10">
                <p className="text-white/90 text-sm italic leading-relaxed">
                  &ldquo;{scripture.text}&rdquo;
                </p>
                <p className="text-accent-400 text-xs font-semibold mt-1.5">
                  &mdash; {scripture.ref}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 -mt-4 sm:-mt-6 relative z-10">
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
