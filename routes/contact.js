const express = require('express');
const router = express.Router();
const { saveContact } = require('../queries');

router.get('/', (req, res) => {
  res.render('contact', {
    title: 'Contact Us | SkyWave',
    success: null
  });
});

router.post('/', async (req, res, next) => {
  const { name, email, subject, message } = req.body;
  try {
    await saveContact(name, email, subject, message);
    res.render('contact', {
      title: 'Contact Us | SkyWave',
      success: 'Your message has been sent! We will get back to you shortly.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
