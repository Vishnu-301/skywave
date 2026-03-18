// db.js — Configure your database connection here
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'psotgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'skywave_db',
  waitForConnections: true,
  queueLimit: 0
});

export default db;
