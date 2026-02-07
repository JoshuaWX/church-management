'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { User, Calendar, BarChart3, TrendingUp, Users } from 'lucide-react'
import { Navigation } from '@/components/Navigation'

interface Member {
  id: number
  name: string
  email?: string
  phone?: string
  birthday: string
}

interface AttendanceStats {
  memberId: number
  memberName: string
  totalSessions: number
  presentCount: number
  attendanceRate: number
  recentAttendance: { date: string; present: boolean }[]
}

export default function AttendanceReports() {
  const [members, setMembers] = useState<Member[]>([])
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<number | null>(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const membersResponse = await fetch('/api/members')
      const membersData = await membersResponse.json()
      setMembers(membersData)

      const attendanceResponse = await fetch('/api/attendance')
      const attendanceData = await attendanceResponse.json()

      const stats: AttendanceStats[] = membersData.map((member: Member) => {
        const memberRecords: { date: string; present: boolean }[] = []
        attendanceData.forEach((session: any) => {
          const r = session.records.find((r: any) => r.memberId === member.id)
          if (r) memberRecords.push({ date: session.date, present: r.present })
        })
        const totalSessions = memberRecords.length
        const presentCount = memberRecords.filter(r => r.present).length
        return {
          memberId: member.id,
          memberName: member.name,
          totalSessions,
          presentCount,
          attendanceRate: totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0,
          recentAttendance: memberRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)
        }
      })
      setAttendanceStats(stats.sort((a, b) => b.attendanceRate - a.attendanceRate))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedMemberStats = selectedMember
    ? attendanceStats.find(s => s.memberId === selectedMember)
    : null

  if (isLoading) {
    return (
      <main>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600 mb-3" />
            <p className="text-sm text-gray-500">Loading attendance reports...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="page-title">Attendance Reports</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Track individual member attendance and participation rates
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary-500" />
              <span className="text-xs font-medium text-gray-500">Total</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">{members.length}</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-gray-500">80%+</span>
            </div>
            <span className="text-2xl font-bold text-green-600">
              {attendanceStats.filter(s => s.attendanceRate >= 80).length}
            </span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-gray-500">60-79%</span>
            </div>
            <span className="text-2xl font-bold text-amber-600">
              {attendanceStats.filter(s => s.attendanceRate >= 60 && s.attendanceRate < 80).length}
            </span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-red-500" />
              <span className="text-xs font-medium text-gray-500">&lt;60%</span>
            </div>
            <span className="text-2xl font-bold text-red-600">
              {attendanceStats.filter(s => s.attendanceRate < 60).length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Members List */}
          <div className="lg:col-span-1">
            <div className="card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  Members
                </h2>
              </div>
              <div className="max-h-[28rem] overflow-y-auto">
                {attendanceStats.map((stat) => (
                  <button
                    key={stat.memberId}
                    onClick={() => setSelectedMember(stat.memberId)}
                    className={`w-full p-3.5 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${
                      selectedMember === stat.memberId ? 'bg-primary-50/70 border-l-2 border-l-primary-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{stat.memberName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {stat.presentCount}/{stat.totalSessions} sessions
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        stat.attendanceRate >= 80 ? 'bg-green-100 text-green-700' :
                        stat.attendanceRate >= 60 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {stat.attendanceRate.toFixed(0)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detail View */}
          <div className="lg:col-span-2">
            {selectedMemberStats ? (
              <div className="space-y-4">
                {/* Member Header */}
                <div className="card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-bold text-sm">
                        {selectedMemberStats.memberName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedMemberStats.memberName}</h2>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <Calendar className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-xl font-bold text-blue-600">{selectedMemberStats.totalSessions}</p>
                      <p className="text-[10px] text-blue-800 uppercase tracking-wider font-medium">Sessions</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="text-xl font-bold text-green-600">{selectedMemberStats.presentCount}</p>
                      <p className="text-[10px] text-green-800 uppercase tracking-wider font-medium">Present</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                      <BarChart3 className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                      <p className="text-xl font-bold text-purple-600">{selectedMemberStats.attendanceRate.toFixed(0)}%</p>
                      <p className="text-[10px] text-purple-800 uppercase tracking-wider font-medium">Rate</p>
                    </div>
                  </div>
                </div>

                {/* History */}
                <div className="card overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 text-sm">Recent History</h3>
                  </div>
                  {selectedMemberStats.recentAttendance.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {selectedMemberStats.recentAttendance.map((record, index) => (
                        <div key={index} className="px-5 py-3 flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {format(new Date(record.date), 'MMM do, yyyy')}
                          </span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            record.present
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {record.present ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-10">
                      <Calendar className="h-8 w-8 text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">No records found</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card p-8 flex flex-col items-center justify-center text-center min-h-[20rem]">
                <User className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Select a Member</h3>
                <p className="text-sm text-gray-500">Choose from the list to view their detailed report</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
