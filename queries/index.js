// queries/index.js — JS wrappers around all SQL queries
import db from '../db.js';

// ── Destinations ──────────────────────────────────────────
const getFeaturedDestinations = () =>
  db.query('SELECT * FROM destinations WHERE featured = TRUE ORDER BY price_from ASC');

const getAllDestinations = () =>
  db.query('SELECT * FROM destinations ORDER BY name ASC');

const getDestinationById = (id) =>
  db.query('SELECT * FROM destinations WHERE id = $1', [id]);

// ── Flights ───────────────────────────────────────────────
const searchFlights = (origin, destination, date, passengers) =>
  db.query(
    `SELECT * FROM flights
     WHERE origin = $1 AND destination = $2
       AND DATE(departure_time) = $3
       AND seats_available >= $4
       AND status = 'scheduled'
     ORDER BY price ASC`,
    [origin, destination, date, passengers]
  );

const getAllFlights = () =>
  db.query('SELECT * FROM flights ORDER BY departure_time ASC');

const getFlightById = (id) =>
  db.query('SELECT * FROM flights WHERE id = $1', [id]);

const reduceSeats = (flightId, count) =>
  db.query('UPDATE flights SET seats_available = seats_available - $1 WHERE id = $2', [count, flightId]);

// ── Bookings ──────────────────────────────────────────────
const createBooking = (data) =>
  db.query(
    `INSERT INTO bookings (flight_id, first_name, last_name, email, phone, passengers, class, total_price, booking_ref)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [data.flight_id, data.first_name, data.last_name, data.email,
    data.phone, data.passengers, data.class, data.total_price, data.booking_ref]
  );

const getBookingByRef = (ref) =>
  db.query(
    `SELECT b.*, f.flight_number, f.origin, f.destination, f.departure_time, f.arrival_time
     FROM bookings b JOIN flights f ON b.flight_id = f.id
     WHERE b.booking_ref = $1`,
    [ref]
  );

const updateBookingStatus = (status, ref) =>
  db.query('UPDATE bookings SET status = $1 WHERE booking_ref = $2', [status, ref]);

// ── Contact ───────────────────────────────────────────────
const saveContact = (name, email, subject, message) =>
  db.query('INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4)',
    [name, email, subject, message]);

// ── Newsletter ────────────────────────────────────────────
const subscribeNewsletter = (email) =>
  db.query('INSERT INTO newsletters (email) VALUES ($1) ON CONFLICT DO NOTHING', [email]);

export { getFeaturedDestinations, getAllDestinations, getDestinationById, searchFlights, getAllFlights, getFlightById, reduceSeats, createBooking, getBookingByRef, updateBookingStatus, saveContact, subscribeNewsletter };
