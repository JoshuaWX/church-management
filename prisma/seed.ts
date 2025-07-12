import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.attendanceRecord.deleteMany({})
  await prisma.attendanceSession.deleteMany({})
  await prisma.member.deleteMany({})

  // Seed members
  await prisma.member.createMany({
    data: [
      {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        birthday: new Date('1990-07-12'),
        picture: '/placeholder-avatar.jpg'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '(555) 987-6543',
        birthday: new Date('1985-03-15'),
        picture: '/placeholder-avatar.jpg'
      },
      {
        name: 'Michael Brown',
        email: 'michael@example.com',
        phone: '(555) 456-7890',
        birthday: new Date('1992-07-12'),
        picture: '/placeholder-avatar.jpg'
      },
      {
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '(555) 234-5678',
        birthday: new Date('1988-01-22'),
        picture: '/placeholder-avatar.jpg'
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        phone: '(555) 345-6789',
        birthday: new Date('1995-09-08'),
        picture: '/placeholder-avatar.jpg'
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
