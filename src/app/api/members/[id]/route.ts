import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const numericId = parseInt(id)
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const numericId = parseInt(id)
    const { name, email, phone, birthday } = await request.json()
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
