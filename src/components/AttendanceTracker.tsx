'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Check, X, Calendar, Users, Download } from 'lucide-react'

// Default mock data - only used if no saved data exists
const defaultMembers = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sarah Johnson' },
  { id: 3, name: 'Michael Brown' },
  { id: 4, name: 'Emily Davis' },
  { id: 5, name: 'David Wilson' },
]

type AttendanceRecord = {
  memberId: number
  memberName: string
  present: boolean
}

export function AttendanceTracker() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [members, setMembers] = useState<{ id: number; name: string }[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [savedRecords, setSavedRecords] = useState<{[date: string]: AttendanceRecord[]}>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load members from database on component mount
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch('/api/members')
        if (response.ok) {
          const data = await response.json()
          const membersData = data.map((member: any) => ({
            id: member.id,
            name: member.name
          }))
          setMembers(membersData)
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

  // Initialize attendance when members are loaded
  useEffect(() => {
    if (members.length > 0) {
      const initialAttendance = members.map(member => ({
        memberId: member.id,
        memberName: member.name,
        present: false
      }))
      setAttendance(initialAttendance)
    }
  }, [members])

  // Load saved attendance records from database and set attendance for selected date
  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await fetch('/api/attendance')
        if (response.ok) {
          const sessions = await response.json()
          // Convert array of attendance sessions to the format expected by component
          const recordsByDate: {[date: string]: AttendanceRecord[]} = {}
          sessions.forEach((session: any) => {
            const date = session.date.split('T')[0] // Extract date part
            recordsByDate[date] = session.records.map((record: any) => ({
              memberId: record.memberId,
              memberName: record.member.name,
              present: record.present
            }))
          })
          setSavedRecords(recordsByDate)
          // After loading, set attendance for selected date
          if (recordsByDate[selectedDate]) {
            setAttendance(recordsByDate[selectedDate])
          } else {
            setAttendance(
              members.map(member => ({
                memberId: member.id,
                memberName: member.name,
                present: false
              }))
            )
          }
        }
      } catch (error) {
        console.error('Error loading attendance:', error)
      }
    }
    loadAttendance()
  }, [members, selectedDate])

  // Remove the localStorage save effect since we'll save to database
  // useEffect(() => {
  //   if (Object.keys(savedRecords).length > 0) {
  //     localStorage.setItem('churchAttendance', JSON.stringify(savedRecords))
  //   }
  // }, [savedRecords])

  const toggleAttendance = (memberId: number) => {
    setAttendance(prev => 
      prev.map(record => 
        record.memberId === memberId 
          ? { ...record, present: !record.present }
          : record
      )
    )
  }

  const saveAttendance = async () => {
    // Check if attendance already exists for this date
    if (savedRecords[selectedDate]) {
      alert('Attendance has already been taken for this date. You cannot save it again.')
      return
    }

    try {
      console.log('Saving attendance:', { date: selectedDate, attendanceRecords: attendance })
      
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          attendanceRecords: attendance
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setSavedRecords(prev => ({
          ...prev,
          [selectedDate]: [...attendance]
        }))
        alert('Attendance saved successfully!')
      } else {
        console.error('Server error:', result)
        alert(`Failed to save attendance: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      alert('Error saving attendance')
    }
  }

  const loadAttendance = (date: string) => {
    const records = savedRecords[date]
    if (records) {
      setAttendance(records)
    } else {
      // Reset to default if no records for this date
      setAttendance(
        members.map(member => ({
          memberId: member.id,
          memberName: member.name,
          present: false
        }))
      )
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    // After changing date, set attendance for that date
    if (savedRecords[date]) {
      setAttendance(savedRecords[date])
    } else {
      setAttendance(
        members.map(member => ({
          memberId: member.id,
          memberName: member.name,
          present: false
        }))
      )
    }
  }

  const exportAttendance = () => {
    // Create CSV content
    const headers = ['Name', 'Status', 'Date']
    const csvContent = [
      headers.join(','),
      ...attendance.map(record => [
        `"${record.memberName}"`,
        record.present ? 'Present' : 'Absent',
        selectedDate
      ].join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `attendance-${selectedDate}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const presentCount = attendance.filter(record => record.present).length
  const totalCount = attendance.length

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Date Selection and Stats */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <div className="w-full sm:w-auto">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Select Date</h3>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
          
          <div className="w-full sm:w-auto">
            <div className="bg-primary-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary-600">{presentCount}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Present</div>
                </div>
                <div className="text-gray-300 text-lg sm:text-xl">/</div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-600">{totalCount}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={saveAttendance}
            disabled={!!savedRecords[selectedDate]}
            className={`w-full sm:w-auto px-4 py-2 rounded-md flex items-center justify-center text-sm sm:text-base ${
              savedRecords[selectedDate] 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            <Check className="h-4 w-4 mr-2" />
            {savedRecords[selectedDate] ? 'Attendance Already Taken' : 'Save Attendance'}
          </button>
          <button 
            className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center justify-center text-sm sm:text-base"
            onClick={exportAttendance}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 flex items-center">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="truncate">Mark Attendance for {format(new Date(selectedDate), 'MMM do, yyyy')}</span>
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {attendance.map((record) => (
            <div key={record.memberId} className="p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center flex-1 min-w-0">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                  <span className="text-gray-600 font-medium text-xs sm:text-sm">
                    {record.memberName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{record.memberName}</h4>
                </div>
              </div>
              
              <div className="flex items-center ml-3">
                <button
                  onClick={() => toggleAttendance(record.memberId)}
                  className={`flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                    record.present
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {record.present ? (
                    <>
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Present</span>
                      <span className="sm:hidden">✓</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Absent</span>
                      <span className="sm:hidden">✗</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Records Summary */}
      {Object.keys(savedRecords).length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Recent Attendance Records</h3>
          <div className="space-y-2">
            {Object.entries(savedRecords)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .slice(0, 5)
              .map(([date, records]) => {
                const present = records.filter(r => r.present).length
                const total = records.length
                return (
                  <div key={date} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-md">
                    <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {format(new Date(date), 'MMM do, yyyy')}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 ml-2">
                      {present}/{total} ({Math.round((present/total) * 100)}%)
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
