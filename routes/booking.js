import express from 'express';
import { getFlightById, createBooking, getBookingByRef, reduceSeats } from '../queries/index.js';

const router = express.Router();

// Booking form
router.get('/:flightId', async (req, res, next) => {
  try {
    const [rows] = await getFlightById(req.params.flightId);
    if (!rows.length) return res.status(404).render('404', { title: '404 | SkyWave' });
    res.render('booking/form', {
      title: 'Book Flight | SkyWave',
      flight: rows[0]
    });
  } catch (err) {
    next(err);
  }
});

// Process booking
router.post('/:flightId', async (req, res, next) => {
  const { first_name, last_name, email, phone, passengers, class: flightClass } = req.body;
  const flightId = req.params.flightId;

  try {
    const [rows] = await getFlightById(flightId);
    if (!rows.length) return res.status(404).render('404', { title: '404 | SkyWave' });

    const flight = rows[0];
    const totalPrice = (flight.price * parseInt(passengers)).toFixed(2);
    const bookingRef = 'SW' + Date.now().toString().slice(-8).toUpperCase();

    await createBooking({
      flight_id: flightId,
      first_name, last_name, email, phone,
      passengers: parseInt(passengers),
      class: flightClass,
      total_price: totalPrice,
      booking_ref: bookingRef
    });

    await reduceSeats(flightId, parseInt(passengers));

    res.redirect(`/booking/confirmation/${bookingRef}`);
  } catch (err) {
    next(err);
  }
});

// Booking confirmation
router.get('/confirmation/:ref', async (req, res, next) => {
  try {
    const [rows] = await getBookingByRef(req.params.ref);
    if (!rows.length) return res.status(404).render('404', { title: '404 | SkyWave' });
    res.render('booking/confirmation', {
      title: 'Booking Confirmed | SkyWave',
      booking: rows[0]
    });
  } catch (err) {
    next(err);
  }
});

export default router;
