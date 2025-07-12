'use client'

import { useState, useEffect } from 'react'
import { format, isToday } from 'date-fns'
import { Cake, Calendar } from 'lucide-react'

// Default mock data - only used if no saved data exists
const defaultMembers = [
  {
    id: 1,
    name: 'John Smith',
    birthday: new Date('1990-07-12'),
    picture: '/placeholder-avatar.jpg'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    birthday: new Date('1985-03-15'),
    picture: '/placeholder-avatar.jpg'
  },
  {
    id: 3,
    name: 'Michael Brown',
    birthday: new Date('1992-07-12'),
    picture: '/placeholder-avatar.jpg'
  }
]

export function BirthdayDashboard() {
  const [members, setMembers] = useState<typeof defaultMembers>([])
  const [todaysBirthdays, setTodaysBirthdays] = useState<typeof defaultMembers>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load members from database on component mount
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch('/api/members')
        if (response.ok) {
          const data = await response.json()
          const membersWithDateObjects = data.map((member: any) => ({
            ...member,
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

  useEffect(() => {
    // Filter members who have birthdays today
    const birthdays = members.filter(member => {
      const today = new Date()
      const birthday = new Date(member.birthday)
      return (
        birthday.getMonth() === today.getMonth() &&
        birthday.getDate() === today.getDate()
      )
    })
    setTodaysBirthdays(birthdays)
  }, [members])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Cake className="h-6 w-6 text-pink-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Today&apos;s Birthdays</h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading birthdays...</p>
        </div>
      </div>
    )
  }

  if (todaysBirthdays.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Cake className="h-6 w-6 text-pink-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Today&apos;s Birthdays</h2>
        </div>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No birthdays today</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <Cake className="h-6 w-6 text-pink-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Today&apos;s Birthdays</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {todaysBirthdays.map((member) => (
          <div key={member.id} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-lg font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">
                  🎉 Happy Birthday! 🎂
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(member.birthday, 'MMMM do')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
