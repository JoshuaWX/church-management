import { Navigation } from '@/components/Navigation'
import { BirthdayDashboard } from '@/components/BirthdayDashboard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Manage members, birthdays, and attendance
          </p>
        </div>
        <BirthdayDashboard />
      </div>
    </main>
  )
}
