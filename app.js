const express = require('express');
const path = require('path');
const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const indexRouter = require('./routes/index');
const flightsRouter = require('./routes/flights');
const bookingRouter = require('./routes/booking');
const destinationsRouter = require('./routes/destinations');
const contactRouter = require('./routes/contact');

app.use('/', indexRouter);
app.use('/flights', flightsRouter);
app.use('/booking', bookingRouter);
app.use('/destinations', destinationsRouter);
app.use('/contact', contactRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found | SkyWave' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { title: 'Error | SkyWave', error: err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SkyWave running on http://localhost:${PORT}`);
});

module.exports = app;
