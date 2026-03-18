const express = require('express');
const router = express.Router();
const { getFeaturedDestinations, subscribeNewsletter } = require('../queries');

router.get('/', async (req, res) => {
  try {
    const [destinations] = await getFeaturedDestinations();
    res.render('index', {
      title: 'SkyWave — Fly Beyond Horizons',
      destinations
    });
  } catch (err) {
    next(err);
  }
});

// Newsletter subscribe
router.post('/newsletter', async (req, res) => {
  const { email } = req.body;
  try {
    await subscribeNewsletter(email);
    res.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    res.json({ success: false, message: 'Subscription failed.' });
  }
});

module.exports = router;
