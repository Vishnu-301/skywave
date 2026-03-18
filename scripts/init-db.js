#!/usr/bin/env node
/**
 * Database initialization script for SkyWave
 * Creates tables and seeds initial data on first deployment.
 * Usage: npm run init-db  (or: npm run build on Render)
 */

import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const db = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'skywave_db',
      }
);

const initDatabase = async () => {
  console.log('🚀 Initializing SkyWave database...');
  const client = await db.connect();

  try {
    // ── Tables ──────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        country     VARCHAR(100) NOT NULL DEFAULT '',
        description TEXT,
        image_url   VARCHAR(255),
        price_from  DECIMAL(10,2),
        featured    BOOLEAN DEFAULT FALSE,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ destinations table ready');

    await client.query(`
      CREATE TABLE IF NOT EXISTS flights (
        id               SERIAL PRIMARY KEY,
        flight_number    VARCHAR(20) UNIQUE NOT NULL,
        origin           VARCHAR(100),
        destination      VARCHAR(100),
        departure_time   TIMESTAMP,
        arrival_time     TIMESTAMP,
        price            DECIMAL(10,2),
        seats_available  INT DEFAULT 100,
        class            VARCHAR(20) DEFAULT 'economy',
        status           VARCHAR(20) DEFAULT 'scheduled',
        created_at       TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ flights table ready');

    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id          SERIAL PRIMARY KEY,
        flight_id   INT REFERENCES flights(id) ON DELETE CASCADE,
        first_name  VARCHAR(50),
        last_name   VARCHAR(50),
        email       VARCHAR(100),
        phone       VARCHAR(20),
        passengers  INT,
        class       VARCHAR(20),
        total_price DECIMAL(10,2),
        booking_ref VARCHAR(20) UNIQUE,
        status      VARCHAR(20) DEFAULT 'confirmed',
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ bookings table ready');

    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(100),
        email      VARCHAR(100),
        subject    VARCHAR(200),
        message    TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ contacts table ready');

    await client.query(`
      CREATE TABLE IF NOT EXISTS newsletters (
        id           SERIAL PRIMARY KEY,
        email        VARCHAR(100) UNIQUE,
        subscribed_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ newsletters table ready');

    // ── Indexes ─────────────────────────────────────────────
    await client.query(`CREATE INDEX IF NOT EXISTS idx_flights_origin_destination ON flights(origin, destination);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_bookings_booking_ref ON bookings(booking_ref);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);`);
    console.log('✓ indexes ready');

    // ── Seed data (only if tables are empty) ────────────────
    const { rows } = await client.query('SELECT COUNT(*) FROM destinations');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO destinations (name, country, description, image_url, price_from, featured) VALUES
        ('Paris',         'France',        'The city of light, romance, and world-class cuisine.',         'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 450.00, TRUE),
        ('New York',      'USA',           'The city that never sleeps — iconic skyline and culture.',     'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=800', 520.00, TRUE),
        ('Tokyo',         'Japan',         'Ancient temples meet neon-lit streets in this vibrant city.',  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 780.00, TRUE),
        ('Dubai',         'UAE',           'Luxury, modernity, and desert adventure all in one.',          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 390.00, TRUE),
        ('Santorini',     'Greece',        'Iconic white-washed cliffs, blue domes and sunsets.',          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', 560.00, FALSE),
        ('Cape Town',     'South Africa',  'Where mountains, oceans and history converge.',                'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800', 620.00, FALSE),
        ('Bali',          'Indonesia',     'Tropical paradise with rice terraces and spiritual culture.',  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 480.00, FALSE),
        ('London',        'UK',            'Royal history, theatre, and cosmopolitan energy.',             'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', 310.00, FALSE);
      `);

      await client.query(`
        INSERT INTO flights (flight_number, origin, destination, departure_time, arrival_time, price, seats_available, class) VALUES
        ('SW101', 'Lagos',         'London',    '2026-04-10 08:00:00', '2026-04-10 19:30:00',  650.00, 45, 'economy'),
        ('SW102', 'Lagos',         'Dubai',     '2026-04-11 10:00:00', '2026-04-11 19:00:00',  390.00, 60, 'economy'),
        ('SW103', 'Abuja',         'Paris',     '2026-04-12 07:30:00', '2026-04-12 18:45:00',  720.00, 30, 'business'),
        ('SW104', 'Lagos',         'New York',  '2026-04-15 22:00:00', '2026-04-16 06:30:00',  980.00, 20, 'first'),
        ('SW105', 'Kano',          'Tokyo',     '2026-04-18 09:00:00', '2026-04-19 07:00:00', 1100.00, 15, 'business'),
        ('SW106', 'Lagos',         'Bali',      '2026-04-20 14:00:00', '2026-04-21 12:00:00',  860.00, 50, 'economy'),
        ('SW107', 'Port Harcourt', 'London',    '2026-04-22 06:00:00', '2026-04-22 17:30:00',  700.00, 55, 'economy'),
        ('SW108', 'Lagos',         'Cape Town', '2026-04-25 11:00:00', '2026-04-25 16:00:00',  430.00, 40, 'economy');
      `);

      console.log('✓ seed data inserted');
    } else {
      console.log('✓ seed data already present — skipped');
    }

    console.log('\n✅ Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await db.end();
  }
};

initDatabase().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
