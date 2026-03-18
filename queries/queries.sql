-- ============================================================
--  SKYWAVE DATABASE — SQL QUERIES
-- ============================================================

-- ─────────────────────────────────────────────
--  TABLE CREATION
-- ─────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS skywave_db;
USE skywave_db;

CREATE TABLE IF NOT EXISTS destinations (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  country     VARCHAR(100) NOT NULL,
  description TEXT,
  image_url   VARCHAR(255),
  price_from  DECIMAL(10,2),
  featured    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flights (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  flight_number    VARCHAR(20) NOT NULL,
  origin           VARCHAR(100) NOT NULL,
  destination      VARCHAR(100) NOT NULL,
  departure_time   DATETIME NOT NULL,
  arrival_time     DATETIME NOT NULL,
  price            DECIMAL(10,2) NOT NULL,
  seats_available  INT NOT NULL,
  class            ENUM('economy','business','first') DEFAULT 'economy',
  status           ENUM('scheduled','delayed','cancelled') DEFAULT 'scheduled',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  flight_id        INT NOT NULL,
  first_name       VARCHAR(100) NOT NULL,
  last_name        VARCHAR(100) NOT NULL,
  email            VARCHAR(150) NOT NULL,
  phone            VARCHAR(30),
  passengers       INT DEFAULT 1,
  class            ENUM('economy','business','first') DEFAULT 'economy',
  total_price      DECIMAL(10,2),
  booking_ref      VARCHAR(20) UNIQUE NOT NULL,
  status           ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (flight_id) REFERENCES flights(id)
);

CREATE TABLE IF NOT EXISTS contacts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  subject    VARCHAR(255),
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletters (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(150) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ─────────────────────────────────────────────
--  SAMPLE SEED DATA
-- ─────────────────────────────────────────────

INSERT INTO destinations (name, country, description, image_url, price_from, featured) VALUES
('Paris',      'France',       'The city of light, romance, and world-class cuisine.',        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 450.00, TRUE),
('New York',   'USA',          'The city that never sleeps — iconic skyline and culture.',    'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=800', 520.00, TRUE),
('Tokyo',      'Japan',        'Ancient temples meet neon-lit streets in this vibrant city.', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 780.00, TRUE),
('Dubai',      'UAE',          'Luxury, modernity, and desert adventure all in one.',         'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 390.00, TRUE),
('Santorini',  'Greece',       'Iconic white-washed cliffs, blue domes and sunsets.',         'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', 560.00, FALSE),
('Cape Town',  'South Africa', 'Where mountains, oceans and history converge.',               'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800', 620.00, FALSE),
('Bali',       'Indonesia',    'Tropical paradise with rice terraces and spiritual culture.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 480.00, FALSE),
('London',     'UK',           'Royal history, theatre, and cosmopolitan energy.',            'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', 310.00, FALSE);

INSERT INTO flights (flight_number, origin, destination, departure_time, arrival_time, price, seats_available, class) VALUES
('SW101', 'Lagos',    'London',   '2026-04-10 08:00:00', '2026-04-10 19:30:00', 650.00,  45, 'economy'),
('SW102', 'Lagos',    'Dubai',    '2026-04-11 10:00:00', '2026-04-11 19:00:00', 390.00,  60, 'economy'),
('SW103', 'Abuja',    'Paris',    '2026-04-12 07:30:00', '2026-04-12 18:45:00', 720.00,  30, 'business'),
('SW104', 'Lagos',    'New York', '2026-04-15 22:00:00', '2026-04-16 06:30:00', 980.00,  20, 'first'),
('SW105', 'Kano',     'Tokyo',    '2026-04-18 09:00:00', '2026-04-19 07:00:00', 1100.00', 15, 'business'),
('SW106', 'Lagos',    'Bali',     '2026-04-20 14:00:00', '2026-04-21 12:00:00', 860.00,  50, 'economy'),
('SW107', 'Port Harcourt','London','2026-04-22 06:00:00','2026-04-22 17:30:00', 700.00,  55, 'economy'),
('SW108', 'Lagos',    'Cape Town','2026-04-25 11:00:00', '2026-04-25 16:00:00', 430.00,  40, 'economy');


-- ─────────────────────────────────────────────
--  APPLICATION QUERIES
-- ─────────────────────────────────────────────

-- GET all featured destinations
SELECT * FROM destinations WHERE featured = TRUE ORDER BY price_from ASC;

-- GET all destinations
SELECT * FROM destinations ORDER BY name ASC;

-- GET single destination by id
SELECT * FROM destinations WHERE id = ?;

-- SEARCH flights by origin, destination, and date
SELECT * FROM flights
WHERE origin = ? AND destination = ?
  AND DATE(departure_time) = ?
  AND seats_available >= ?
  AND status = 'scheduled'
ORDER BY price ASC;

-- GET all flights (admin / listing)
SELECT * FROM flights ORDER BY departure_time ASC;

-- GET single flight by id
SELECT * FROM flights WHERE id = ?;

-- CREATE a booking
INSERT INTO bookings (flight_id, first_name, last_name, email, phone, passengers, class, total_price, booking_ref)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

-- GET booking by reference
SELECT b.*, f.flight_number, f.origin, f.destination, f.departure_time, f.arrival_time
FROM bookings b
JOIN flights f ON b.flight_id = f.id
WHERE b.booking_ref = ?;

-- UPDATE booking status
UPDATE bookings SET status = ? WHERE booking_ref = ?;

-- REDUCE seat count after booking
UPDATE flights SET seats_available = seats_available - ? WHERE id = ?;

-- SAVE contact message
INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?);

-- SUBSCRIBE to newsletter
INSERT IGNORE INTO newsletters (email) VALUES (?);

-- GET all contacts (admin)
SELECT * FROM contacts ORDER BY created_at DESC;
