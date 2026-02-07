import { Navigation } from '@/components/Navigation'
import { MembersList } from '@/components/MembersList'

export default function MembersPage() {
  return (
    <main>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="page-title">Bible Study Members</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage member information and birthdays</p>
        </div>
        <MembersList />
      </div>
    </main>
  )
}
