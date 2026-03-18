# Render Deployment Guide for SkyWave

This guide explains how to deploy your SkyWave Flight Agency app on Render.

## Prerequisites

1. A GitHub account with your project pushed to a repository
2. A [Render account](https://render.com) (free tier available)
3. Basic familiarity with Render's dashboard

## Step 1: Connect Your GitHub Repository

1. Go to [render.com](https://render.com) and sign in with your GitHub account
2. Click **"New +"** in the dashboard
3. Select **"GitHub"** to authenticate (or skip if you used GitHub login)
4. Find and connect your SkyWave repository
5. Authorize Render to access your GitHub repo

## Step 2: Create a PostgreSQL Database on Render

1. In your Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in the details:
   - **Name**: `skywave-db` (or your preference)
   - **Database**: `skywave_db`
   - **User**: `postgres` (default, change if desired)
   - **Region**: Choose your region (e.g., Oregon, US East)
   - **Plan**: Free (sufficient for testing)
3. Click **"Create Database"**
4. Wait for the database to be created (~2-3 minutes)
5. Copy the **External Database URL** - you'll need this later

## Step 3: Set Up the Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your connected GitHub repository
3. Fill in the configuration:
   - **Name**: `skywave` (or any name)
   - **Environment**: `Node`
   - **Region**: Same as your database
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install && npm run build` (automatically initializes your database!)
   - **Start Command**: `npm start`
   - **Plan**: Free (or Pro for better uptime)
4. Click **"Create Web Service"**

**Note:** The build command includes `npm run build` which runs the database initialization script automatically during deployment.

## Step 4: Configure Environment Variables

1. Once the web service is created, go to its dashboard
2. Scroll down to **"Environment"** section
3. Click **"Add Environment Variable"** and add these variables:
   - **NODE_ENV**: `production`
   - **DATABASE_URL**: (Paste the PostgreSQL URL from Step 2)
     - Format: `postgresql://user:password@host:5432/database_name`
     - This is shown in your Render PostgreSQL dashboard

4. Click **"Save"** to apply changes

## Step 5: Initialize the Database

Your app now has an **automated database setup script** that runs during deployment! You have two options:

### Option A: Automatic Setup (Recommended) ✅

The database initializes automatically during the Render build process:

1. When you deploy, Render runs: `npm install && npm run build`
2. The `build` script executes `scripts/init-db.js`
3. All tables are created automatically
4. Your app starts normally

**No manual SQL needed!** This approach is:

- ✅ Automatic on every deployment
- ✅ Idempotent (safe to run multiple times)
- ✅ Works on first deploy and re-deploys
- ✅ Creates indexes for better performance

### Option B: Manual Setup via SQL Dashboard

If you prefer to manage the database manually:

1. Go to your PostgreSQL database in Render
2. Click **"Query"** to open the SQL editor
3. Run the initialization script (see below)

**Note:** If using Option A, skip this step as tables are created automatically.

#### Database Schema (Reference)

```sql
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  price_from DECIMAL(10, 2),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flights (
  id SERIAL PRIMARY KEY,
  flight_number VARCHAR(10) UNIQUE NOT NULL,
  origin VARCHAR(50),
  destination VARCHAR(50),
  departure_time TIMESTAMP,
  arrival_time TIMESTAMP,
  price DECIMAL(10, 2),
  seats_available INT DEFAULT 100,
  status VARCHAR(20) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  flight_id INT REFERENCES flights(id) ON DELETE CASCADE,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  phone VARCHAR(20),
  passengers INT,
  class VARCHAR(20),
  total_price DECIMAL(10, 2),
  booking_ref VARCHAR(20) UNIQUE,
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  subject VARCHAR(200),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  subscribed_at TIMESTAMP DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_flights_origin_destination ON flights(origin, destination);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_ref ON bookings(booking_ref);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
```

## Step 6: Deploy Your App

1. Once environment variables are set, Render will automatically start building
2. The build process will:
   - Run `npm install` to install dependencies
   - Run `npm run build` which executes the database initialization script
   - Create all necessary tables automatically
3. Check the **"Logs"** tab to see build progress and database initialization output
4. If there are errors, debug using the logs and push fixes to GitHub
5. Render will redeploy automatically on new commits (if auto-deploy is enabled)

## Step 7: Monitor Your Deployment

1. Go to your web service dashboard
2. Check the **"Logs"** for any runtime errors
3. Visit your deployed URL (shown at the top of the dashboard)
4. Example: `https://skywave.onrender.com`

## Testing Database Initialization Locally (Optional)

Before deploying to Render, test the database initialization script locally:

```bash
# Make sure your local PostgreSQL is running
# Update .env with your local database credentials

# Run the initialization script
npm run init-db
```

You should see output like:

```
🚀 Initializing SkyWave database...
✓ Created destinations table
✓ Created flights table
✓ Created bookings table
✓ Created contacts table
✓ Created newsletters table
✓ Created database indexes

✅ Database initialization completed successfully!
```

If you see errors:

- Check that your PostgreSQL server is running
- Verify database credentials in `.env`
- Ensure the database exists (PostgreSQL can create it automatically)

## Troubleshooting

### Build Failed

- Check the **"Logs"** tab for error messages
- If the build fails at `npm run build`, check that the database initialization script ran
- Ensure `package.json` has correct scripts: `"build": "node scripts/init-db.js"`
- Verify all dependencies are listed in `package.json`

### Database Initialization Failed

- Check the build logs for error messages from `init-db.js`
- Verify `DATABASE_URL` environment variable is set correctly
- Ensure the PostgreSQL database is created: `postgresql://user:password@host:5432/database_name`
- Check that the database user has permissions to create tables
- Retry deployment after fixing the database connection

### Database Connection Error

- Verify `DATABASE_URL` is correctly set in Environment
- Check that your PostgreSQL database is running
- Test the URL format: `postgresql://user:password@host:port/database`

### Website Not Loading

- Check if the web service is in an "active" state (green checkmark)
- Review application logs for runtime errors
- Ensure all required environment variables are set

### Database Tables Not Found

- If tables are missing, check the build logs for initialization errors
- The `npm run build` command should display database creation messages
- Manually run the initialization via Render's PostgreSQL Query dashboard
- See [Step 5](#step-5-initialize-the-database) for the schema

## Enable Auto-Deploy (Optional)

1. Go to your web service settings
2. Under **"Deploy"**, toggle **"Auto-deploy"** to ON
3. Now every push to your branch automatically redeploys

## Upgrade from Free Tier (Optional)

When ready for production:

1. Upgrade your web service from "Free" to **"Standard"** plan
2. Upgrade database from "Free" to **"Standard"** plan
3. This ensures better reliability and uptime (SLA included)

## Cost Summary

- **Free Tier**: $0/month (great for testing, limited resources)
- **Pro Web Service**: $7/month (always on)
- **Standard PostgreSQL**: $15/month (better performance)

## Next Steps

1. Set up your domain name (Render provides a default `onrender.com` subdomain)
2. Configure SSL/TLS (automatically provided by Render)
3. Set up monitoring and alerts
4. Regular backups of your PostgreSQL database

For more help, visit [Render Documentation](https://render.com/docs)
