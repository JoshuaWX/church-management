'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Check, X, Calendar, Users, Download, Save } from 'lucide-react'

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
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Load members
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch('/api/members')
        if (response.ok) {
          const data = await response.json()
          setMembers(data.map((m: any) => ({ id: m.id, name: m.name })))
        }
      } catch (error) {
        console.error('Error loading members:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadMembers()
  }, [])

  // Initialize attendance when members load
  useEffect(() => {
    if (members.length > 0) {
      setAttendance(members.map(m => ({ memberId: m.id, memberName: m.name, present: false })))
    }
  }, [members])

  // Load saved attendance
  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await fetch('/api/attendance')
        if (response.ok) {
          const sessions = await response.json()
          const recordsByDate: {[date: string]: AttendanceRecord[]} = {}
          sessions.forEach((session: any) => {
            const date = session.date.split('T')[0]
            recordsByDate[date] = session.records.map((r: any) => ({
              memberId: r.memberId,
              memberName: r.member.name,
              present: r.present
            }))
          })
          setSavedRecords(recordsByDate)
          if (recordsByDate[selectedDate]) {
            setAttendance(recordsByDate[selectedDate])
          } else {
            setAttendance(members.map(m => ({ memberId: m.id, memberName: m.name, present: false })))
          }
        }
      } catch (error) {
        console.error('Error loading attendance:', error)
      }
    }
    if (members.length > 0) loadAttendance()
  }, [members, selectedDate])

  const toggleAttendance = (memberId: number) => {
    setAttendance(prev =>
      prev.map(r => r.memberId === memberId ? { ...r, present: !r.present } : r)
    )
  }

  const saveAttendance = async () => {
    if (savedRecords[selectedDate]) {
      showNotification('error', 'Attendance already taken for this date.')
      return
    }
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, attendanceRecords: attendance })
      })
      if (response.ok) {
        setSavedRecords(prev => ({ ...prev, [selectedDate]: [...attendance] }))
        showNotification('success', 'Attendance saved!')
      } else {
        const result = await response.json()
        showNotification('error', result.error || 'Failed to save')
      }
    } catch {
      showNotification('error', 'Error saving attendance')
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    if (savedRecords[date]) {
      setAttendance(savedRecords[date])
    } else {
      setAttendance(members.map(m => ({ memberId: m.id, memberName: m.name, present: false })))
    }
  }

  const exportAttendance = () => {
    const headers = ['Name', 'Status', 'Date']
    const csvContent = [
      headers.join(','),
      ...attendance.map(r => [`"${r.memberName}"`, r.present ? 'Present' : 'Absent', selectedDate].join(','))
    ].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.setAttribute('href', URL.createObjectURL(blob))
    link.setAttribute('download', `attendance-${selectedDate}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const presentCount = attendance.filter(r => r.present).length
  const totalCount = attendance.length
  const isSaved = !!savedRecords[selectedDate]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600 mb-3" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Date + Stats Bar */}
      <div className="card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Session Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="input pl-9 w-full sm:w-auto"
              />
            </div>
          </div>

          {/* Stats Pill */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-5 py-3">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{presentCount}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Present</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="text-xl font-bold text-gray-400">{totalCount - presentCount}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Absent</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="text-xl font-bold text-primary-600">
                {totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Rate</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={saveAttendance}
            disabled={isSaved}
            className={`btn flex-1 sm:flex-none justify-center ${
              isSaved ? 'btn-secondary opacity-60 cursor-not-allowed' : 'btn-primary'
            }`}
          >
            {isSaved ? (
              <><Check className="h-4 w-4" /> Already Saved</>
            ) : (
              <><Save className="h-4 w-4" /> Save Attendance</>
            )}
          </button>
          <button onClick={exportAttendance} className="btn btn-secondary justify-center">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Attendance List */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <h3 className="font-semibold text-gray-900 text-sm">
            {format(new Date(selectedDate + 'T00:00:00'), 'EEEE, MMMM do, yyyy')}
          </h3>
          {isSaved && <span className="badge-green ml-auto">Saved</span>}
        </div>

        <div className="divide-y divide-gray-100">
          {attendance.map((record) => (
            <div key={record.memberId} className="p-3 sm:px-5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
              {/* Avatar */}
              <div className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold ${
                record.present
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {record.memberName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate block">{record.memberName}</span>
              </div>

              {/* Toggle */}
              <button
                onClick={() => toggleAttendance(record.memberId)}
                disabled={isSaved}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  record.present
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                } ${isSaved ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-sm active:scale-95'}`}
                aria-label={`Mark ${record.memberName} as ${record.present ? 'absent' : 'present'}`}
              >
                {record.present ? (
                  <><Check className="h-3.5 w-3.5" /> Present</>
                ) : (
                  <><X className="h-3.5 w-3.5" /> Absent</>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Records */}
      {Object.keys(savedRecords).length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Recent Sessions</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {Object.entries(savedRecords)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .slice(0, 5)
              .map(([date, records]) => {
                const present = records.filter(r => r.present).length
                const total = records.length
                const pct = total > 0 ? Math.round((present / total) * 100) : 0
                return (
                  <button
                    key={date}
                    onClick={() => handleDateChange(date)}
                    className={`w-full px-5 py-3 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors ${
                      date === selectedDate ? 'bg-primary-50/50' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {format(new Date(date + 'T00:00:00'), 'MMM do, yyyy')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{present}/{total}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        pct >= 80 ? 'bg-green-100 text-green-700' :
                        pct >= 60 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {pct}%
                      </span>
                    </div>
                  </button>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
