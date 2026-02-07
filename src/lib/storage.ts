// Utility functions for managing localStorage data

export interface Member {
  id: number
  name: string
  birthday: Date
  picture: string
  email?: string
  phone?: string
}

export interface AttendanceRecord {
  memberId: number
  memberName: string
  present: boolean
}

const STORAGE_KEYS = {
  MEMBERS: 'churchMembers',
  ATTENDANCE: 'churchAttendance'
} as const

export const storageUtils = {
  // Members
  getMembers: (): Member[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS)
      if (saved) {
        return JSON.parse(saved).map((member: any) => ({
          ...member,
          birthday: new Date(member.birthday)
        }))
      }
      return []
    } catch (error) {
      console.error('Error loading members:', error)
      return []
    }
  },

  saveMembers: (members: Member[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members))
    } catch (error) {
      console.error('Error saving members:', error)
    }
  },

  // Attendance
  getAttendanceRecords: (): { [date: string]: AttendanceRecord[] } => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE)
      return saved ? JSON.parse(saved) : {}
    } catch (error) {
      console.error('Error loading attendance:', error)
      return {}
    }
  },

  saveAttendanceRecords: (records: { [date: string]: AttendanceRecord[] }) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records))
    } catch (error) {
      console.error('Error saving attendance:', error)
    }
  },

  // Clear all data
  clearAllData: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.MEMBERS)
      localStorage.removeItem(STORAGE_KEYS.ATTENDANCE)
    } catch (error) {
      console.error('Error clearing data:', error)
    }
  }
}
