import { Navigation } from '@/components/Navigation'
import { BirthdayDashboard } from '@/components/BirthdayDashboard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Church Management Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage members, birthdays, and attendance</p>
        </div>
        <BirthdayDashboard />
      </div>
    </main>
  )
}
