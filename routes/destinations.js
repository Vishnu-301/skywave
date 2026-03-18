const express = require('express');
const router = express.Router();
const { getAllDestinations, getDestinationById } = require('../queries');

router.get('/', async (req, res, next) => {
  try {
    const [destinations] = await getAllDestinations();
    res.render('destinations/index', {
      title: 'Destinations | SkyWave',
      destinations
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await getDestinationById(req.params.id);
    if (!rows.length) return res.status(404).render('404', { title: '404 | SkyWave' });
    res.render('destinations/detail', {
      title: `${rows[0].name} | SkyWave`,
      destination: rows[0]
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
