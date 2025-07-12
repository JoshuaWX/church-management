# Setup Instructions for Production Database

## Option 1: Vercel Postgres (Recommended)
1. Go to https://vercel.com/dashboard
2. Click on your `church-management` project
3. Go to "Storage" tab
4. Click "Create Database" → "Postgres"
5. Copy the connection string
6. Go to "Settings" → "Environment Variables"
7. Add `DATABASE_URL` with the connection string

## Option 2: Neon Database (Free)
1. Go to https://neon.tech
2. Sign up with your GitHub account
3. Create a new database
4. Copy the connection string
5. Add it to Vercel environment variables

## Option 3: Supabase (Free)
1. Go to https://supabase.com
2. Sign up with your GitHub account
3. Create a new project
4. Go to Settings → Database
5. Copy the connection string
6. Add it to Vercel environment variables

## After setting up the database:
1. Run `vercel env pull` to get the environment variables locally
2. Run `npx prisma db push` to create the database schema
3. Run `npm run db:seed` to add sample data
4. Deploy with `vercel --prod`
