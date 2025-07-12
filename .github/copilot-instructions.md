<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Church Management System

This is a Next.js application for managing church members, birthdays, and attendance.

## Project Structure
- `/src/app/` - Next.js App Router pages
- `/src/components/` - React components
- Uses TypeScript and Tailwind CSS for styling
- Lucide React for icons

## Key Features
1. **Dashboard** - Overview with today's birthdays
2. **Member Management** - Add, edit, and manage church members with names, photos, birthdays, and contact info
3. **Birthday Dashboard** - Display birthday wishes for members celebrating today
4. **Attendance Tracking** - Record and manage church attendance by date

## Code Style Guidelines
- Use TypeScript for all components
- Use 'use client' directive for client components
- Use Tailwind CSS for styling with the custom primary color theme
- Follow Next.js App Router conventions
- Use Lucide React icons
- Format dates with date-fns library

## Current State
- Mock data is used throughout - this should be replaced with a real database (Prisma + PostgreSQL)
- All components are functional and display properly
- The application supports adding new members and tracking attendance
- Birthday functionality automatically detects today's birthdays

## Future Enhancements
- Add database integration with Prisma
- Add photo upload functionality
- Add user authentication
- Add reporting and analytics
- Add email/SMS birthday reminders
