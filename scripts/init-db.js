#!/usr/bin/env node
/**
 * Database initialization script for SkyWave
 * Runs on first deployment to create all necessary tables
 * Usage: npm run init-db
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

// Create connection pool
const db = new Pool(
    process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        }
        : {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'skywave_db'
        }
);

const initDatabase = async () => {
    console.log('🚀 Initializing SkyWave database...');

    try {
        const client = await db.connect();

        // Create destinations table
        await client.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        price_from DECIMAL(10, 2),
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
        console.log('✓ Created destinations table');

        // Create flights table
        await client.query(`
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
    `);
        console.log('✓ Created flights table');

        // Create bookings table
        await client.query(`
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
    `);
        console.log('✓ Created bookings table');

        // Create contacts table
        await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        subject VARCHAR(200),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
        console.log('✓ Created contacts table');

        // Create newsletters table
        await client.query(`
      CREATE TABLE IF NOT EXISTS newsletters (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE,
        subscribed_at TIMESTAMP DEFAULT NOW()
      );
    `);
        console.log('✓ Created newsletters table');

        // Create indexes for better query performance
        await client.query(`CREATE INDEX IF NOT EXISTS idx_flights_origin_destination ON flights(origin, destination);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_bookings_booking_ref ON bookings(booking_ref);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);`);
        console.log('✓ Created database indexes');

        client.release();

        console.log('\n✅ Database initialization completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        console.error(error);
        process.exit(1);
    }
};

// Run initialization
initDatabase().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
