'use client'

import { useState } from 'react'
import { Database, Upload, Download, Trash2 } from 'lucide-react'

export function DataMigration() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const migrateFromLocalStorage = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      // Get data from localStorage
      const membersData = localStorage.getItem('churchMembers')
      const attendanceData = localStorage.getItem('churchAttendance')

      if (!membersData) {
        setMessage('No member data found in localStorage')
        return
      }

      const members = JSON.parse(membersData)
      
      // Migrate members
      for (const member of members) {
        await fetch('/api/members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: member.name,
            email: member.email,
            phone: member.phone,
            birthday: member.birthday
          })
        })
      }

      // Migrate attendance if exists
      if (attendanceData) {
        const attendance = JSON.parse(attendanceData)
        
        for (const [date, records] of Object.entries(attendance)) {
          await fetch('/api/attendance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              date,
              attendanceRecords: records
            })
          })
        }
      }

      setMessage('✅ Data migration completed successfully!')
    } catch (error) {
      console.error('Migration error:', error)
      setMessage('❌ Migration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const clearLocalStorage = () => {
    if (confirm('Are you sure you want to clear all localStorage data? This cannot be undone.')) {
      localStorage.removeItem('churchMembers')
      localStorage.removeItem('churchAttendance')
      setMessage('✅ localStorage cleared successfully!')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center mb-4">
        <Database className="h-6 w-6 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Database Migration</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">🔄 Migrate to Database</h4>
          <p className="text-sm text-blue-700 mb-3">
            Transfer your localStorage data to the new database for better persistence and sharing.
          </p>
          <button
            onClick={migrateFromLocalStorage}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Migrating...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Migrate Data
              </>
            )}
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-2">🗑️ Clear localStorage</h4>
          <p className="text-sm text-red-700 mb-3">
            Clear old localStorage data after successful migration.
          </p>
          <button
            onClick={clearLocalStorage}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear localStorage
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded-md">
            <p className="text-sm text-gray-800">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
