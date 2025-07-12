import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, birthday } = await request.json()
    
    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone,
        birthday: new Date(birthday),
        picture: '/placeholder-avatar.jpg'
      }
    })
    
    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 })
  }
}
