'use client'

import { useState, useEffect } from 'react'
import { format, getMonth, getDate } from 'date-fns'
import { Cake, Calendar, ChevronLeft, ChevronRight, Users, PartyPopper } from 'lucide-react'

interface Member {
  id: number
  name: string
  birthday: Date
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function BirthdayCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch('/api/members')
        if (response.ok) {
          const data = await response.json()
          setMembers(data.map((m: any) => ({ id: m.id, name: m.name, birthday: new Date(m.birthday) })))
        }
      } catch (error) {
        console.error('Error loading members:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadMembers()
  }, [])

  const getBirthdaysForMonth = (month: number) =>
    members
      .filter(m => getMonth(m.birthday) === month)
      .sort((a, b) => getDate(a.birthday) - getDate(b.birthday))

  const currentMonthBirthdays = getBirthdaysForMonth(selectedMonth)

  const isToday = (birthday: Date) => {
    const today = new Date()
    return getMonth(birthday) === today.getMonth() && getDate(birthday) === today.getDate()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Month Navigation */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setSelectedMonth((p) => (p - 1 + 12) % 12)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-600" />
            {months[selectedMonth]}
          </h2>
          <button
            onClick={() => setSelectedMonth((p) => (p + 1) % 12)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {months.map((month, index) => {
            const count = getBirthdaysForMonth(index).length
            const isSelected = index === selectedMonth
            const isCurrent = index === new Date().getMonth()
            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(index)}
                className={`relative p-2.5 rounded-xl text-left transition-all text-sm ${
                  isSelected
                    ? 'bg-primary-500 text-white shadow-sm'
                    : isCurrent
                      ? 'bg-primary-50 border border-primary-200 hover:bg-primary-100'
                      : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                }`}
              >
                <div className={`font-medium truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {month.slice(0, 3)}
                </div>
                <div className={`text-xs mt-0.5 ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                  {count} {count === 1 ? 'bday' : 'bdays'}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Birthdays List */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cake className="h-5 w-5 text-pink-500" />
            <h3 className="font-semibold text-gray-900">{months[selectedMonth]} Birthdays</h3>
          </div>
          <span className="badge-primary">{currentMonthBirthdays.length}</span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-10">
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-primary-200 border-t-primary-600 mb-3" />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        ) : currentMonthBirthdays.length === 0 ? (
          <div className="flex flex-col items-center py-10">
            <Calendar className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No birthdays in {months[selectedMonth]}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {currentMonthBirthdays.map((member) => {
              const today = isToday(member.birthday)
              return (
                <div
                  key={member.id}
                  className={`p-4 sm:px-5 flex items-center gap-3 transition-colors ${
                    today ? 'bg-pink-50/50' : 'hover:bg-gray-50/50'
                  }`}
                >
                  {/* Day Badge */}
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex flex-col items-center justify-center text-xs font-bold ${
                    today
                      ? 'bg-pink-500 text-white'
                      : 'bg-primary-100 text-primary-700'
                  }`}>
                    <span className="text-base leading-none">{getDate(member.birthday)}</span>
                    <span className="text-[9px] uppercase opacity-70">{format(member.birthday, 'MMM')}</span>
                  </div>

                  {/* Name & Age */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{member.name}</h4>
                    <p className="text-xs text-gray-500">
                      {format(member.birthday, 'MMMM do')} &bull; Age {new Date().getFullYear() - member.birthday.getFullYear()}
                    </p>
                  </div>

                  {today && (
                    <span className="flex-shrink-0 badge-pink flex items-center gap-1">
                      <PartyPopper className="h-3 w-3" />
                      Today!
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-primary-500" />
            <span className="text-xs font-medium text-gray-500">Total</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{members.length}</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <PartyPopper className="h-4 w-4 text-pink-500" />
            <span className="text-xs font-medium text-gray-500">Today</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {members.filter(m => isToday(m.birthday)).length}
          </span>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <Cake className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-medium text-gray-500">This Month</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {getBirthdaysForMonth(new Date().getMonth()).length}
          </span>
        </div>
      </div>
    </div>
  )
}
