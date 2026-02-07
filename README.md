# Church Management System

A modern web application for managing church members, birthdays, and attendance built with Next.js, TypeScript, and Tailwind CSS. (AI Generated)

## Features

### 🏠 Dashboard
- Overview of church management system
- Today's birthday celebrations with wishes
- Quick access to all features

### 👥 Member Management
- Add new church members with contact information
- Store member names, birthdays, email, and phone numbers
- Edit and delete member records
- Profile pictures (placeholder support)

### 🎂 Birthday Tracking
- Automatic detection of today's birthdays
- Monthly birthday calendar view
- Beautiful birthday wishes display
- Age calculation and birthday statistics

### 📊 Attendance Tracking
- Record attendance by date
- Mark members as present/absent
- View attendance statistics and history
- Export attendance records
- Attendance percentage calculations

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Utilities**: clsx, tailwind-merge

## Database Setup

The application now uses a **SQLite database** with **Prisma ORM** for data persistence:

- **Database File**: `prisma/dev.db`
- **Schema**: `prisma/schema.prisma`
- **Migrations**: Automatic with `prisma db push`
- **Admin Panel**: Prisma Studio at `http://localhost:5555`

### Database Commands:
```bash
npm run db:push      # Apply schema changes
npm run db:seed      # Add sample data
npm run db:reset     # Reset and reseed database
npm run db:studio    # Open Prisma Studio
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd church-management
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   ├── members/           # Member management
│   ├── birthdays/         # Birthday calendar
│   └── attendance/        # Attendance tracking
├── components/            # React components
│   ├── Navigation.tsx     # Main navigation
│   ├── BirthdayDashboard.tsx
│   ├── MembersList.tsx
│   ├── AttendanceTracker.tsx
│   └── BirthdayCalendar.tsx
└── globals.css           # Global styles
```

## Current Implementation

The application now uses a **SQLite database with Prisma ORM** for data persistence:

✅ **Real Database**: SQLite database file (`prisma/dev.db`) stores all data permanently
✅ **API Routes**: RESTful API endpoints for all CRUD operations
✅ **Data Migration**: Tool to transfer localStorage data to database
✅ **Automatic Relationships**: Database handles member-attendance relationships
✅ **Admin Panel**: Prisma Studio for database management
✅ **Seed Data**: Initial sample data for testing

### Database Features:
- **Members Table**: Stores member information with proper data types
- **Attendance Records**: Linked to members with date-based tracking
- **Attendance Sessions**: Summary statistics for each service date
- **Data Integrity**: Foreign key relationships and constraints
- **Backup Ready**: Database file can be easily backed up and restored

## Future Enhancements

### Database Integration
- [ ] Set up Prisma with PostgreSQL
- [ ] Create database schema for members and attendance
- [ ] Replace mock data with real database queries

### Advanced Features
- [ ] Photo upload for member profiles
- [ ] User authentication and roles
- [ ] Email/SMS birthday reminders
- [ ] Advanced reporting and analytics
- [ ] Data export (CSV, PDF)
- [ ] Member groups and categories

### UI/UX Improvements
- [ ] Mobile responsiveness optimization
- [ ] Dark mode support
- [ ] Print-friendly views
- [ ] Bulk operations for members

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
