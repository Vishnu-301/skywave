import express from 'express';
import { searchFlights, getAllFlights, getFlightById } from '../queries/index.js';

const router = express.Router();

// Flight search results
router.get('/search', async (req, res, next) => {
  const { origin, destination, date, passengers = 1 } = req.query;
  try {
    let flights = [];
    if (origin && destination && date) {
      ({ rows: flights } = await searchFlights(origin, destination, date, passengers));
    }
    res.render('flights/search', {
      title: 'Search Flights | SkyWave',
      flights,
      query: req.query
    });
  } catch (err) {
    next(err);
  }
});

// All flights listing
router.get('/', async (req, res, next) => {
  try {
    const { rows: flights } = await getAllFlights();
    res.render('flights/index', {
      title: 'All Flights | SkyWave',
      flights
    });
  } catch (err) {
    next(err);
  }
});

// Single flight detail
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await getFlightById(req.params.id);
    if (!rows.length) return res.status(404).render('404', { title: '404 | SkyWave' });
    res.render('flights/detail', {
      title: `Flight ${rows[0].flight_number} | SkyWave`,
      flight: rows[0]
    });
  } catch (err) {
    next(err);
  }
});

export default router;
