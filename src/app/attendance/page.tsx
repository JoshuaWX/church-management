import { Navigation } from '@/components/Navigation'
import { AttendanceTracker } from '@/components/AttendanceTracker'

export default function AttendancePage() {
  return (
    <main>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="page-title">Attendance Tracking</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Record and manage attendance for each session</p>
        </div>
        <AttendanceTracker />
      </div>
    </main>
  )
}
