'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Cake, Calendar, PartyPopper } from 'lucide-react'

interface Member {
  id: number
  name: string
  birthday: Date
  picture?: string
}

export function BirthdayDashboard() {
  const [todaysBirthdays, setTodaysBirthdays] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch('/api/members')
        if (response.ok) {
          const data = await response.json()
          const today = new Date()
          const birthdays = data
            .map((m: any) => ({ ...m, birthday: new Date(m.birthday) }))
            .filter((m: Member) =>
              m.birthday.getMonth() === today.getMonth() &&
              m.birthday.getDate() === today.getDate()
            )
          setTodaysBirthdays(birthdays)
        }
      } catch (error) {
        console.error('Error loading members:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadMembers()
  }, [])

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Cake className="h-5 w-5 text-pink-500" />
          <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Birthdays</h2>
        </div>
        <div className="flex flex-col items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600 mb-3" />
          <p className="text-sm text-gray-500">Loading birthdays...</p>
        </div>
      </div>
    )
  }

  if (todaysBirthdays.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Cake className="h-5 w-5 text-pink-500" />
          <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Birthdays</h2>
        </div>
        <div className="flex flex-col items-center py-8">
          <Calendar className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No birthdays today</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Header with accent bar */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3.5">
        <div className="flex items-center gap-2 text-white">
          <PartyPopper className="h-5 w-5" />
          <h2 className="font-semibold">
            Today&apos;s Birthdays
            <span className="ml-2 bg-white/20 text-xs px-2 py-0.5 rounded-full">
              {todaysBirthdays.length}
            </span>
          </h2>
        </div>
      </div>

      <div className="p-4 sm:p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {todaysBirthdays.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100"
          >
            <div className="flex-shrink-0 h-11 w-11 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="text-pink-600 font-semibold text-sm">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-gray-900 text-sm truncate">{member.name}</h3>
              <p className="text-xs text-gray-500">{format(member.birthday, 'MMMM do')}</p>
            </div>
            <span className="text-lg flex-shrink-0">🎂</span>
          </div>
        ))}
      </div>
    </div>
  )
}
