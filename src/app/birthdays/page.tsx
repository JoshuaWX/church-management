import { Navigation } from '@/components/Navigation'
import { BirthdayCalendar } from '@/components/BirthdayCalendar'

export default function BirthdaysPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Birthday Calendar</h1>
          <p className="text-gray-600 mt-2">View all member birthdays throughout the year</p>
        </div>
        <BirthdayCalendar />
      </div>
    </main>
  )
}
