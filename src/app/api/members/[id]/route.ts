import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitizeMemberInput, isPositiveInteger } from '@/lib/validation'

function parseAndValidateId(id: string): number | null {
  const numericId = parseInt(id, 10)
  if (isNaN(numericId) || numericId <= 0) {
    return null
  }
  return numericId
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const { id } = params
    const numericId = parseAndValidateId(id)
    
    if (numericId === null) {
      return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 })
    }
    
    // Check if member exists first
    const existingMember = await prisma.member.findUnique({
      where: { id: numericId }
    })
    
    if (!existingMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }
    
    await prisma.member.delete({
      where: { id: numericId }
    })
    
    return NextResponse.json({ message: 'Member deleted successfully' })
  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const { id } = params
    const numericId = parseAndValidateId(id)
    
    if (numericId === null) {
      return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 })
    }
    
    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id: numericId }
    })
    
    if (!existingMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }
    
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
    
    // Check for duplicate email if changed
    if (email && email !== existingMember.email) {
      const duplicateMember = await prisma.member.findFirst({
        where: { 
          email: email,
          NOT: { id: numericId }
        }
      })
      if (duplicateMember) {
        return NextResponse.json(
          { error: 'A member with this email already exists' },
          { status: 409 }
        )
      }
    }
    
    const member = await prisma.member.update({
      where: { id: numericId },
      data: {
        name,
        email,
        phone,
        birthday: new Date(birthday)
      }
    })
    
    return NextResponse.json(member)
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
  }
}
