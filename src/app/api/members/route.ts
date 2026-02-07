import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitizeMemberInput } from '@/lib/validation'

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthday: true,
        picture: true,
        createdAt: true,
        // Exclude sensitive fields if any were added
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
    const body = await request.json()
    
    // Validate and sanitize input
    const validation = sanitizeMemberInput(body)
    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors }, 
        { status: 400 }
      )
    }
    
    const { name, email, phone, birthday } = validation.data
    
    // Check for duplicate email if provided
    if (email) {
      const existingMember = await prisma.member.findFirst({
        where: { email: email }
      })
      if (existingMember) {
        return NextResponse.json(
          { error: 'A member with this email already exists' },
          { status: 409 }
        )
      }
    }
    
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
