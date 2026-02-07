'use client'

import { useState, useEffect } from 'react'
import { format, getMonth, getDate } from 'date-fns'
import { Cake, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

// Default mock data - only used if no saved data exists
const defaultMembers = [
  { id: 1, name: 'John Smith', birthday: new Date('1990-07-12') },
  { id: 2, name: 'Sarah Johnson', birthday: new Date('1985-03-15') },
  { id: 3, name: 'Michael Brown', birthday: new Date('1992-07-12') },
  { id: 4, name: 'Emily Davis', birthday: new Date('1988-01-22') },
  { id: 5, name: 'David Wilson', birthday: new Date('1995-09-08') },
  { id: 6, name: 'Lisa Anderson', birthday: new Date('1987-05-14') },
]

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function BirthdayCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [members, setMembers] = useState<typeof defaultMembers>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load members from database on component mount
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch('/api/members')
        if (response.ok) {
          const data = await response.json()
          const membersWithDateObjects = data.map((member: any) => ({
            id: member.id,
            name: member.name,
            birthday: new Date(member.birthday)
          }))
          setMembers(membersWithDateObjects)
        } else {
          // Fallback to default members if API fails
          setMembers(defaultMembers)
        }
      } catch (error) {
        console.error('Error loading members:', error)
        // Fallback to default members on error
        setMembers(defaultMembers)
      } finally {
        setIsLoading(false)
      }
    }

    loadMembers()
  }, [])

  const getBirthdaysForMonth = (month: number) => {
    return members
      .filter(member => getMonth(member.birthday) === month)
      .sort((a, b) => getDate(a.birthday) - getDate(b.birthday))
  }

  const currentMonthBirthdays = getBirthdaysForMonth(selectedMonth)

  const nextMonth = () => {
    setSelectedMonth((prev) => (prev + 1) % 12)
  }

  const previousMonth = () => {
    setSelectedMonth((prev) => (prev - 1 + 12) % 12)
  }

  const isToday = (birthday: Date) => {
    const today = new Date()
    return getMonth(birthday) === today.getMonth() && getDate(birthday) === today.getDate()
  }

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-primary-600" />
            {months[selectedMonth]}
          </h2>
          
          <button
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Month Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {months.map((month, index) => {
            const monthBirthdays = getBirthdaysForMonth(index)
            const isSelected = index === selectedMonth
            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(index)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-primary-100 border-2 border-primary-500'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="font-medium text-gray-900">{month}</div>
                <div className="text-sm text-gray-600">
                  {monthBirthdays.length} birthday{monthBirthdays.length !== 1 ? 's' : ''}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Birthdays for Selected Month */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Cake className="h-6 w-6 text-pink-500 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">
            {months[selectedMonth]} Birthdays
          </h3>
          <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
            {currentMonthBirthdays.length}
          </span>
        </div>

        {currentMonthBirthdays.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No birthdays in {months[selectedMonth]}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentMonthBirthdays.map((member) => (
              <div
                key={member.id}
                className={`p-4 rounded-lg border-2 ${
                  isToday(member.birthday)
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-600">
                        {format(member.birthday, 'MMMM do')} • Age {new Date().getFullYear() - member.birthday.getFullYear()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {isToday(member.birthday) && (
                      <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                        🎉 Today!
                      </div>
                    )}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        {getDate(member.birthday)}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">
                        {format(member.birthday, 'MMM')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-primary-600">{members.length}</div>
          <div className="text-gray-600">Total Members</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-pink-600">
            {members.filter(member => isToday(member.birthday)).length}
          </div>
          <div className="text-gray-600">Birthdays Today</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {getBirthdaysForMonth(new Date().getMonth()).length}
          </div>
          <div className="text-gray-600">This Month</div>
        </div>
      </div>
    </div>
  )
}
