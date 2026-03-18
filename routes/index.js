import express from 'express';
import { getFeaturedDestinations, subscribeNewsletter } from '../queries/index.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows: destinations } = await getFeaturedDestinations();
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

export default router;
