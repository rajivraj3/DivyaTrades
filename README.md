# DivyaTrades

DivyaTrades is a modern stock trading and investment platform built for demo and paper-trading workflows. MongoDB is required for the backend, and user and trading state is persisted there.

## Features

- Landing page and auth flows
- Dashboard with portfolio overview and market metrics
- Searchable stock explorer and stock detail pages
- Paper trading simulation with virtual cash
- Portfolio, watchlist, orders, and transactions views
- Trade journal and learning center
- Profile and settings screens
- Dark and light mode support
- Responsive UI for desktop, tablet, and mobile
- Simulated Indian-stock quotes and user-owned MongoDB paper-trading accounts

## Tech stack

### Frontend
- React
- Vite
- JavaScript / JSX
- React Router
- Axios
- Recharts
- Lucide React

### Backend
- Node.js
- Express.js
- JWT authentication
- bcryptjs
- MongoDB with Mongoose

## Project structure

```text
DivyaTrades/
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.*
├── server/
│   ├── config/
│   ├── data/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── package.json
├── README.md
└── .gitignore
```

## Installation

```bash
npm install
cd client && npm install
cd ../server && npm install
```

## Run the app

### Frontend
```bash
cd client
npm run dev -- --host 0.0.0.0
```

### Backend
```bash
cd server
node server.js
```

### Full stack
```bash
npm run dev
```

## Demo data note

Set `MONGO_URI` in `server/.env` to your local MongoDB instance or MongoDB Atlas connection string before starting the backend. Simulated quotes are seeded into `stocks`; users, virtual cash, holdings, orders, transactions, watchlists, and journals are stored in MongoDB, with trading data scoped to each user's account. Keep the URI private and do not commit credentials.

## Paper-trading safety

Every execution is labeled as a simulated paper order. The app does not connect to a broker, place exchange orders, or process real money.
