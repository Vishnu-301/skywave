# ✈ SkyWave — Flight Agency Website

A full-featured flight agency web application built with **Express.js**, **EJS**, and **MySQL**.

---

## 📁 Folder Structure

```
skywave/
├── app.js                        ← Express entry point
├── db.js                         ← Database connection (configure this)
├── package.json
├── .env.example                  ← Copy to .env and fill in credentials
│
├── routes/
│   ├── index.js                  ← Home + newsletter
│   ├── flights.js                ← Flight search & listing
│   ├── booking.js                ← Booking form & confirmation
│   ├── destinations.js           ← Destination pages
│   └── contact.js                ← Contact form
│
├── queries/
│   ├── queries.sql               ← All SQL (CREATE TABLE + seed + queries)
│   └── index.js                  ← JS query wrappers (use in routes)
│
├── views/
│   ├── index.ejs                 ← Homepage
│   ├── contact.ejs               ← Contact page
│   ├── 404.ejs                   ← Not Found page
│   ├── error.ejs                 ← Server Error page
│   ├── partials/
│   │   ├── head.ejs              ← HTML head + CSS links
│   │   ├── navbar.ejs            ← Navigation bar
│   │   └── footer.ejs            ← Footer + newsletter
│   ├── flights/
│   │   ├── index.ejs             ← All flights listing
│   │   ├── search.ejs            ← Search results
│   │   └── detail.ejs            ← Single flight (optional)
│   ├── booking/
│   │   ├── form.ejs              ← Booking form
│   │   └── confirmation.ejs      ← Booking confirmed
│   └── destinations/
│       ├── index.ejs             ← All destinations
│       └── detail.ejs            ← Single destination
│
└── public/
    ├── css/
    │   └── style.css             ← Full stylesheet
    └── js/
        └── main.js               ← Frontend JavaScript
```

---

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your DB credentials
```

### 3. Set Up Database
Open MySQL and run the contents of `queries/queries.sql`:
```bash
mysql -u root -p < queries/queries.sql
```
This will:
- Create the `skywave_db` database
- Create all tables (destinations, flights, bookings, contacts, newsletters)
- Seed sample destinations and flights

### 4. Connect the Database
Edit `db.js` if you need a different DB adapter (default is MySQL2).

### 5. Run the App
```bash
# Production
npm start

# Development (auto-restart)
npm run dev
```

Open http://localhost:3000

---

## 🗄️ Database Tables

| Table         | Purpose                              |
|---------------|--------------------------------------|
| destinations  | Travel destinations with images      |
| flights       | Flight routes, times, pricing        |
| bookings      | Customer bookings with references    |
| contacts      | Contact form submissions             |
| newsletters   | Newsletter subscribers               |

---

## 🌐 Routes

| Method | Path                        | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /                           | Homepage                 |
| POST   | /newsletter                 | Subscribe to newsletter  |
| GET    | /flights                    | All flights              |
| GET    | /flights/search             | Search flights           |
| GET    | /flights/:id                | Flight detail            |
| GET    | /booking/:flightId          | Booking form             |
| POST   | /booking/:flightId          | Process booking          |
| GET    | /booking/confirmation/:ref  | Booking confirmed        |
| GET    | /destinations               | All destinations         |
| GET    | /destinations/:id           | Destination detail       |
| GET    | /contact                    | Contact page             |
| POST   | /contact                    | Submit contact form      |
# skywave
