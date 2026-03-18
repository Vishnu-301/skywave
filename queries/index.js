// queries/index.js — JS wrappers around all SQL queries
const db = require('../db');

// ── Destinations ──────────────────────────────────────────
const getFeaturedDestinations = () =>
  db.query('SELECT * FROM destinations WHERE featured = TRUE ORDER BY price_from ASC');

const getAllDestinations = () =>
  db.query('SELECT * FROM destinations ORDER BY name ASC');

const getDestinationById = (id) =>
  db.query('SELECT * FROM destinations WHERE id = ?', [id]);

// ── Flights ───────────────────────────────────────────────
const searchFlights = (origin, destination, date, passengers) =>
  db.query(
    `SELECT * FROM flights
     WHERE origin = ? AND destination = ?
       AND DATE(departure_time) = ?
       AND seats_available >= ?
       AND status = 'scheduled'
     ORDER BY price ASC`,
    [origin, destination, date, passengers]
  );

const getAllFlights = () =>
  db.query('SELECT * FROM flights ORDER BY departure_time ASC');

const getFlightById = (id) =>
  db.query('SELECT * FROM flights WHERE id = ?', [id]);

const reduceSeats = (flightId, count) =>
  db.query('UPDATE flights SET seats_available = seats_available - ? WHERE id = ?', [count, flightId]);

// ── Bookings ──────────────────────────────────────────────
const createBooking = (data) =>
  db.query(
    `INSERT INTO bookings (flight_id, first_name, last_name, email, phone, passengers, class, total_price, booking_ref)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.flight_id, data.first_name, data.last_name, data.email,
     data.phone, data.passengers, data.class, data.total_price, data.booking_ref]
  );

const getBookingByRef = (ref) =>
  db.query(
    `SELECT b.*, f.flight_number, f.origin, f.destination, f.departure_time, f.arrival_time
     FROM bookings b JOIN flights f ON b.flight_id = f.id
     WHERE b.booking_ref = ?`,
    [ref]
  );

const updateBookingStatus = (status, ref) =>
  db.query('UPDATE bookings SET status = ? WHERE booking_ref = ?', [status, ref]);

// ── Contact ───────────────────────────────────────────────
const saveContact = (name, email, subject, message) =>
  db.query('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject, message]);

// ── Newsletter ────────────────────────────────────────────
const subscribeNewsletter = (email) =>
  db.query('INSERT IGNORE INTO newsletters (email) VALUES (?)', [email]);

module.exports = {
  getFeaturedDestinations, getAllDestinations, getDestinationById,
  searchFlights, getAllFlights, getFlightById, reduceSeats,
  createBooking, getBookingByRef, updateBookingStatus,
  saveContact, subscribeNewsletter
};
