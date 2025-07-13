import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date } = body
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }
    // Delete all attendance records for the given date
    await prisma.attendanceRecord.deleteMany({
      where: { date: new Date(date) }
    })
    // Optionally, delete the attendance session for that date
    await prisma.attendanceSession.deleteMany({
      where: { date: new Date(date) }
    })
    return NextResponse.json({ message: 'Attendance reset successfully' })
  } catch (error) {
    console.error('Error resetting attendance:', error)
    return NextResponse.json({ error: 'Failed to reset attendance' }, { status: 500 })
  }
}
