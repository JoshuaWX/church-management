'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { User, Calendar, BarChart3, TrendingUp } from 'lucide-react'

interface Member {
  id: number
  name: string
  email?: string
  phone?: string
  birthday: string
}

interface AttendanceRecord {
  id: number
  date: string
  present: boolean
  member: Member
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

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load members
      const membersResponse = await fetch('/api/members')
      const membersData = await membersResponse.json()
      setMembers(membersData)

      // Load all attendance records
      const attendanceResponse = await fetch('/api/attendance')
      const attendanceData = await attendanceResponse.json()

      // Calculate stats for each member
      const stats: AttendanceStats[] = membersData.map((member: Member) => {
        const memberRecords: { date: string; present: boolean }[] = []
        
        // Get all attendance records for this member
        attendanceData.forEach((session: any) => {
          const memberRecord = session.records.find((r: any) => r.memberId === member.id)
          if (memberRecord) {
            memberRecords.push({
              date: session.date,
              present: memberRecord.present
            })
          }
        })

        const totalSessions = memberRecords.length
        const presentCount = memberRecords.filter(r => r.present).length
        const attendanceRate = totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0

        return {
          memberId: member.id,
          memberName: member.name,
          totalSessions,
          presentCount,
          attendanceRate,
          recentAttendance: memberRecords
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10) // Last 10 sessions
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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading attendance reports...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Attendance Reports
          </h1>
          <p className="text-gray-600">
            Track individual member attendance and participation rates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Members
                </h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {attendanceStats.map((stat) => (
                  <div
                    key={stat.memberId}
                    onClick={() => setSelectedMember(stat.memberId)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedMember === stat.memberId ? 'bg-primary-50 border-primary-200' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{stat.memberName}</h3>
                        <p className="text-sm text-gray-600">
                          {stat.presentCount}/{stat.totalSessions} sessions
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          stat.attendanceRate >= 80 ? 'text-green-600' :
                          stat.attendanceRate >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {stat.attendanceRate.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed View */}
          <div className="lg:col-span-2">
            {selectedMemberStats ? (
              <div className="space-y-6">
                {/* Member Stats Overview */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <User className="h-6 w-6 text-primary-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedMemberStats.memberName}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-900">Total Sessions</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 mt-1">
                        {selectedMemberStats.totalSessions}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-900">Present</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {selectedMemberStats.presentCount}
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-purple-900">Attendance Rate</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600 mt-1">
                        {selectedMemberStats.attendanceRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Attendance History */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      Recent Attendance History
                    </h3>
                  </div>
                  <div className="p-4">
                    {selectedMemberStats.recentAttendance.length > 0 ? (
                      <div className="space-y-2">
                        {selectedMemberStats.recentAttendance.map((record, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">
                              {format(new Date(record.date), 'MMM do, yyyy')}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              record.present 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {record.present ? 'Present' : 'Absent'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No attendance records found for this member
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Member
                  </h3>
                  <p className="text-gray-600">
                    Choose a member from the list to view their detailed attendance report
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Overall Church Attendance Statistics
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-1">Total Members</h3>
              <p className="text-2xl font-bold text-blue-600">{members.length}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-900 mb-1">High Attendance (80%+)</h3>
              <p className="text-2xl font-bold text-green-600">
                {attendanceStats.filter(s => s.attendanceRate >= 80).length}
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-900 mb-1">Medium Attendance (60-79%)</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {attendanceStats.filter(s => s.attendanceRate >= 60 && s.attendanceRate < 80).length}
              </p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-900 mb-1">Low Attendance (&lt;60%)</h3>
              <p className="text-2xl font-bold text-red-600">
                {attendanceStats.filter(s => s.attendanceRate < 60).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
