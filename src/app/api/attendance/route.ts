import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')
    
    if (date) {
      // Return attendance for specific date
      const attendance = await prisma.attendanceRecord.findMany({
        where: {
          date: new Date(date)
        },
        include: {
          member: true
        }
      })
      
      return NextResponse.json(attendance)
    } else {
      // Return all attendance sessions with their records
      const sessions = await prisma.attendanceSession.findMany({
        include: {
          records: {
            include: {
              member: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      })
      
      return NextResponse.json(sessions)
    }
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)
    
    const { date, attendanceRecords } = body
    
    if (!date || !attendanceRecords || !Array.isArray(attendanceRecords)) {
      return NextResponse.json({ 
        error: 'Invalid request: date and attendanceRecords are required' 
      }, { status: 400 })
    }

    // Delete existing records for this date
    await prisma.attendanceRecord.deleteMany({
      where: {
        date: new Date(date)
      }
    })

    // Create new records
    const records = await prisma.attendanceRecord.createMany({
      data: attendanceRecords.map((record: any) => ({
        date: new Date(date),
        memberId: record.memberId,
        present: record.present
      }))
    })

    // Update or create attendance session
    const totalMembers = attendanceRecords.length
    const presentCount = attendanceRecords.filter((r: any) => r.present).length

    await prisma.attendanceSession.upsert({
      where: {
        date: new Date(date)
      },
      update: {
        totalMembers,
        presentCount
      },
      create: {
        date: new Date(date),
        totalMembers,
        presentCount
      }
    })

    return NextResponse.json({ message: 'Attendance saved successfully', count: records.count })
  } catch (error) {
    console.error('Error saving attendance:', error)
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 })
  }
}
