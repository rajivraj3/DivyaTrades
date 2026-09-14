<div align="center">

# 📈 Divya Trades

### _A Full-Stack Stock Trading & Investment Platform_

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18/v19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-v4-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![Material UI](https://img.shields.io/badge/MUI-v5-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-v5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

<br />

**Divya Trades** is a modern, full-stack stock trading and investment web application inspired by leading Indian discount brokerages. It features a **customer-facing marketing website**, a **real-time trading dashboard**, and a **robust REST API backend** — all working together to deliver a seamless trading experience.

<br />

[✨ Features](#-features) · [🏗️ Architecture](#️-architecture) · [🚀 Getting Started](#-getting-started) · [📡 API Reference](#-api-reference) · [🖼️ Screenshots](#️-project-structure) · [🤝 Contributing](#-contributing)

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [📡 API Reference](#-api-reference)
- [🗃️ Database Models](#️-database-models)
- [🎨 Frontend (Marketing Website)](#-frontend-marketing-website)
- [📊 Dashboard (Trading Terminal)](#-dashboard-trading-terminal)
- [⚙️ Backend (REST API Server)](#️-backend-rest-api-server)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🌐 Customer-Facing Website (Frontend)
| Feature | Description |
|:--------|:------------|
| **Landing Page** | High-impact hero banner with investment CTA, trust badges, and broker statistics |
| **Product Showcase** | Detailed pages for Kite, Console, Coin, Kite Connect API, and Varsity platforms |
| **Pricing Transparency** | Clear fee breakdown — ₹0 equity delivery, ₹20 flat intraday & F&O trades |
| **User Registration** | Full signup flow with form validation, duplicate email detection, and success feedback |
| **Support Portal** | Live debounced search (250ms) across a backend knowledge base with featured articles |
| **Support Ticket System** | Categorized ticket creation grid (Account Opening, Charges, 3-in-1 accounts, etc.) |
| **About & Team** | Founding story, CEO profile, SEBI advisory memberships, and social links |
| **Education Hub** | Varsity & TradingQ&A community showcase for market education |
| **Responsive Design** | Fully responsive with Bootstrap 5 grid, CSS `clamp()` fluid typography, and mobile hamburger nav |
| **404 Error Page** | Custom "Not Found" fallback for unregistered routes |
| **Regulatory Compliance** | Footer with full SEBI, NSE, BSE, CDSL, MCX registration details and SCORES portal info |

### 📊 Trading Dashboard (Admin Panel)
| Feature | Description |
|:--------|:------------|
| **Live Watchlist** | Track 9+ stocks with real-time price changes, green/red indicators, and hover action buttons |
| **Buy Order Execution** | Draggable modal window for placing BUY orders with quantity, price inputs, and margin calculation |
| **Portfolio Holdings** | Dynamic holdings table fetched from MongoDB with P&L calculation, current value, and net change |
| **Holdings Bar Chart** | Interactive Chart.js vertical bar graph visualizing stock prices across your portfolio |
| **Watchlist Doughnut Chart** | Asset distribution pie chart for tracked stocks using Chart.js |
| **Open Positions** | Positions table showing Product type, Instrument, Qty, Avg, LTP, P&L, and Net Change |
| **Funds Management** | Full equity margin breakdown with interactive Add Funds / Withdraw Funds dialogs and validation |
| **Market Indices** | Top bar displaying NIFTY 50 and SENSEX index values |
| **Orders Page** | Order book with empty-state UI and quick-start CTA |
| **Summary Dashboard** | User greeting, equity summary (Available margin, Margins used, Opening balance), and Holdings P&L |
| **Profile Menu** | User avatar with dropdown toggle and active tab highlighting |

### ⚙️ Backend API Server
| Feature | Description |
|:--------|:------------|
| **RESTful API** | Clean Express 5 REST endpoints for holdings, positions, orders, and user management |
| **MongoDB Integration** | Mongoose 9 ODM with clean schema-model separation pattern |
| **User Registration** | Signup endpoint with field validation, password confirmation, and duplicate email checking |
| **Dynamic CORS** | Whitelist-based CORS with support for frontend, dashboard, and localhost origins |
| **Support Search Engine** | In-memory knowledge base with full-text substring search across titles, descriptions, and tags |
| **Database Startup Guard** | Validates MongoDB connection string on boot — exits gracefully if missing |
| **Seed Data Scripts** | Commented-out seeding endpoints for 13 stock holdings and 2 trading positions |
| **Environment Configuration** | Dotenv-powered config for MongoDB URI, server port, and allowed origins |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                                                                 │
│  ┌──────────────────────┐      ┌──────────────────────────┐     │
│  │   Frontend (React 19)│      │   Dashboard (React 18)   │     │
│  │   Port: 3000         │      │   Port: 3001             │     │
│  │                      │      │                          │     │
│  │  • Marketing Website │      │  • Trading Terminal      │     │
│  │  • User Signup       │      │  • Watchlist & Charts    │     │
│  │  • Support Portal    │      │  • Order Execution       │     │
│  │  • Product Showcase  │      │  • Portfolio & Funds     │     │
│  │  • Bootstrap 5 UI    │      │  • Material UI + ChartJS │     │
│  └──────────┬───────────┘      └────────────┬─────────────┘     │
│             │ axios                          │ axios             │
└─────────────┼────────────────────────────────┼──────────────────┘
              │          HTTP REST API         │
              ▼                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Backend (Express 5 + Node.js)               │   │
│  │              Port: 3002                                  │   │
│  │                                                          │   │
│  │  Routes: /allHoldings · /allPositions · /newOrder        │   │
│  │          /signup · /support/search                       │   │
│  │                                                          │   │
│  │  Middleware: CORS (dynamic whitelist) · body-parser      │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │ Mongoose ODM                      │
└─────────────────────────────┼───────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              MongoDB Atlas (Cloud Database)              │   │
│  │                                                          │   │
│  │  Collections: holdings · positions · orders · users      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend (Marketing Website)
| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| React | 19.2 | UI component library |
| React Router DOM | 7.18 | Client-side routing |
| Axios | 1.20 | HTTP client for API calls |
| Bootstrap | 5.3.8 | Responsive CSS framework |
| Font Awesome | 4.x | Icon library |
| React Scripts (CRA) | 5.0.1 | Build toolchain & dev server |

### Dashboard (Trading Terminal)
| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| React | 18.2 | UI component library |
| React Router DOM | 6.22 | Client-side routing |
| Axios | 1.20 | HTTP client for API calls |
| Chart.js | 4.5 | Canvas-rendered financial charts |
| React-ChartJS-2 | 5.3 | React wrapper for Chart.js |
| Material UI (MUI) | 5.15 | Tooltips, transitions, and icons |
| Emotion | 11.11 | CSS-in-JS styling engine for MUI |
| React Scripts (CRA) | 5.0.1 | Build toolchain & dev server |

### Backend (API Server)
| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| Node.js | 18+ | JavaScript runtime |
| Express | 5.2 | Web framework for REST APIs |
| Mongoose | 9.10 | MongoDB ODM |
| body-parser | 2.3 | JSON request body parsing |
| cors | 2.8 | Cross-origin resource sharing |
| dotenv | 17.4 | Environment variable management |
| Passport.js | 0.7 | Authentication middleware (installed) |
| Nodemon | 3.1 | Auto-restart dev server |

### Database
| Technology | Purpose |
|:-----------|:--------|
| MongoDB Atlas | Cloud-hosted NoSQL database |

---

## 📂 Project Structure

```
Divya Trades/
│
├── 🌐 frontend/                    # Customer-facing marketing website
│   ├── public/
│   │   ├── index.html               # HTML template (Bootstrap & Font Awesome CDN)
│   │   └── media images/            # 25+ static assets (logos, illustrations, photos)
│   ├── src/
│   │   ├── index.js                 # App entry — BrowserRouter, Routes, Navbar, Footer
│   │   ├── index.css                # Global styles, support portal CSS, responsive breakpoints
│   │   ├── landing_page/
│   │   │   ├── Navbar.js            # Global responsive navigation bar
│   │   │   ├── Footer.js            # Footer with regulatory compliance info
│   │   │   ├── NotFound.js          # 404 error page
│   │   │   ├── OpenAccount.js       # Reusable signup CTA component
│   │   │   ├── home/                # Home page (Hero, Awards, Stats, Pricing, Education)
│   │   │   ├── about/               # About page (Founding story, Team/CEO profile)
│   │   │   ├── products/            # Products page (Kite, Console, Coin, API, Varsity)
│   │   │   ├── pricing/             # Pricing page (Fee breakdown, Brokerage calculator)
│   │   │   ├── support/             # Support page (Live search, Ticket creation)
│   │   │   └── signup/              # Signup page (Registration form with validation)
│   │   └── test/                    # Unit tests (Hero component test)
│   ├── package.json
│   └── .env.example
│
├── 📊 dashboard/                    # Admin trading terminal (Kite-style)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js                 # App entry — BrowserRouter with Home route
│   │   ├── index.css                # 847-line Kite trading terminal theme
│   │   ├── components/
│   │   │   ├── Home.js              # Root view (TopBar + Dashboard)
│   │   │   ├── TopBar.js            # Market indices bar (NIFTY 50, SENSEX)
│   │   │   ├── Menu.js              # Navigation tabs + profile avatar
│   │   │   ├── Dashboard.js         # 2-column layout (Watchlist | Content)
│   │   │   ├── GeneralContext.js    # React Context for buy modal state
│   │   │   ├── WatchList.js         # Stock watchlist with search & action buttons
│   │   │   ├── BuyActionWindow.js   # Draggable buy order modal
│   │   │   ├── BuyActionWindow.css  # Order window styles
│   │   │   ├── Summary.js           # Dashboard summary (margins, P&L)
│   │   │   ├── Holdings.js          # Dynamic portfolio holdings table
│   │   │   ├── Positions.js         # Open trading positions table
│   │   │   ├── Orders.js            # Order book (empty state)
│   │   │   ├── Funds.js             # Fund management (deposit/withdraw)
│   │   │   ├── Apps.js              # Apps placeholder
│   │   │   ├── VerticalGraph.js     # Chart.js bar chart for holdings
│   │   │   └── DoughnoutChart.js    # Chart.js doughnut chart for watchlist
│   │   └── data/
│   │       └── data.js              # Static dataset (watchlist, holdings, positions)
│   ├── package.json
│   └── .env.example
│
├── ⚙️ Backend/                      # Express REST API server
│   ├── index.js                     # Server entry — routes, middleware, DB connection
│   ├── schemas/
│   │   ├── HoldingsSchema.js        # Holdings Mongoose schema
│   │   ├── PositionsSchema.js       # Positions Mongoose schema
│   │   ├── OrdersSchema.js          # Orders Mongoose schema
│   │   └── UserSchema.js            # Users Mongoose schema
│   ├── model/
│   │   ├── HoldingsModels.js        # Holdings model
│   │   ├── PositionsModel.js        # Positions model
│   │   ├── OrdersModel.js           # Orders model
│   │   └── UsersModel.js            # Users model
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md                        # 📖 You are here!
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** (v18 or higher)
- **[npm](https://www.npmjs.com/)** (comes with Node.js)
- **[MongoDB Atlas Account](https://www.mongodb.com/atlas)** (or a local MongoDB instance)
- **[Git](https://git-scm.com/)**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajivraj3/DivyaTrades.git
   cd DivyaTrades
   ```

2. **Install Backend dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Install Dashboard dependencies**
   ```bash
   cd ../dashboard
   npm install
   ```

### Environment Variables

Create `.env` files in each module by copying the provided examples:

#### Backend (`Backend/.env`)
```env
PORT=3002
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
FRONTEND_URL=http://localhost:3000
DASHBOARD_URL=http://localhost:3001
```

#### Frontend (`frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:3002
```

#### Dashboard (`dashboard/.env`)
```env
REACT_APP_API_URL=http://localhost:3002
```

### Running the Application

Open **three separate terminal windows** and run:

#### Terminal 1 — Backend Server
```bash
cd Backend
npm run dev
```
> 🟢 Server starts on `http://localhost:3002`

#### Terminal 2 — Frontend Website
```bash
cd frontend
npm start
```
> 🟢 Opens on `http://localhost:3000`

#### Terminal 3 — Trading Dashboard
```bash
cd dashboard
npm start
```
> 🟢 Opens on `http://localhost:3001`

---

## 📡 API Reference

### Base URL
```
http://localhost:3002
```

### Endpoints

#### 📦 Holdings

<table>
<tr><td><b>GET</b></td><td><code>/allHoldings</code></td><td>Fetch all portfolio holdings</td></tr>
</table>

**Response** `200 OK`
```json
[
  {
    "name": "RELIANCE",
    "qty": 2,
    "avg": 2417.0,
    "price": 2437.0,
    "net": "+0.58%",
    "day": "+2.99%",
    "isLoss": false
  }
]
```

---

#### 📈 Positions

<table>
<tr><td><b>GET</b></td><td><code>/allPositions</code></td><td>Fetch all open trading positions</td></tr>
</table>

**Response** `200 OK`
```json
[
  {
    "product": "CNC",
    "name": "EVEREADY",
    "qty": 2,
    "avg": 316.27,
    "price": 312.35,
    "net": "+0.58%",
    "day": "-1.24%",
    "isLoss": true
  }
]
```

---

#### 🛒 Orders

<table>
<tr><td><b>POST</b></td><td><code>/newOrder</code></td><td>Place a new buy/sell order</td></tr>
</table>

**Request Body**
```json
{
  "name": "INFY",
  "qty": 5,
  "price": 1800.50,
  "mode": "BUY"
}
```

**Response** `200 OK`
```
Order saved!
```

---

#### 👤 User Registration

<table>
<tr><td><b>POST</b></td><td><code>/signup</code></td><td>Register a new user account</td></tr>
</table>

**Request Body**
```json
{
  "fullName": "Rajiv Raj",
  "email": "rajiv@example.com",
  "phone": "9876543210",
  "password": "securePass123",
  "confirmPassword": "securePass123"
}
```

**Response** `201 Created`
```json
{
  "message": "Account created successfully.",
  "user": {
    "fullName": "Rajiv Raj",
    "email": "rajiv@example.com",
    "phone": "9876543210"
  }
}
```

**Error Responses**
| Status | Condition |
|:-------|:----------|
| `400` | Missing required fields or passwords don't match |
| `409` | Email already registered |
| `500` | Internal server error |

---

#### 🔍 Support Search

<table>
<tr><td><b>GET</b></td><td><code>/support/search?q={query}</code></td><td>Search support knowledge base</td></tr>
</table>

**Response** `200 OK`
```json
{
  "results": [
    { "title": "Track account opening", "description": "...", "tags": [...] }
  ],
  "featured": [
    { "title": "Current Takeovers and Delisting", "description": "..." }
  ],
  "query": "account"
}
```

---

## 🗃️ Database Models

### Holdings Collection
| Field | Type | Description |
|:------|:-----|:------------|
| `name` | String | Stock ticker symbol (e.g., "RELIANCE") |
| `qty` | Number | Quantity of shares held |
| `avg` | Number | Average purchase price |
| `price` | Number | Current market price |
| `net` | String | Net percentage gain/loss (e.g., "+0.58%") |
| `day` | String | Daily percentage change (e.g., "+2.99%") |
| `isLoss` | Boolean | Whether the holding is at a loss |

### Positions Collection
| Field | Type | Description |
|:------|:-----|:------------|
| `product` | String | Product type — CNC, MIS, or NRML |
| `name` | String | Stock ticker symbol |
| `qty` | Number | Position quantity |
| `avg` | Number | Average buy price |
| `price` | Number | Current market price |
| `net` | String | Net return percentage |
| `day` | String | Daily return percentage |
| `isLoss` | Boolean | Whether the position is at a loss |

### Orders Collection
| Field | Type | Description |
|:------|:-----|:------------|
| `name` | String | Stock name |
| `qty` | Number | Order quantity |
| `price` | Number | Order price |
| `mode` | String | Order mode — "BUY" or "SELL" |

### Users Collection
| Field | Type | Description |
|:------|:-----|:------------|
| `fullName` | String | User's full name (required, trimmed) |
| `email` | String | Email address (required, unique, lowercase) |
| `phone` | String | Phone number (required, trimmed) |
| `password` | String | Account password (required) |
| `createdAt` | Date | Account creation timestamp (auto-generated) |

---

## 🎨 Frontend (Marketing Website)

The customer-facing frontend is a multi-page marketing website built with **React 19** and **Bootstrap 5**.

### 📄 Pages

| Route | Page | Description |
|:------|:-----|:------------|
| `/` | **Home** | Hero banner, broker statistics, trading segments, fee cards, education hub, and signup CTA |
| `/about` | **About** | Founding story (Est. Aug 15, 2016), CEO Rajiv Raj's profile with bio and advisory roles |
| `/product` | **Products** | Showcase of Kite, Console, Coin, Kite Connect API, and Varsity with app store badges |
| `/pricing` | **Pricing** | Three-card pricing breakdown, brokerage calculator link, and detailed fee disclosures |
| `/support` | **Support** | Live search portal with debounced API queries and categorized ticket creation grid |
| `/signup` | **Signup** | Registration form with client-side validation, loading states, and error/success banners |
| `/*` | **404** | Custom "Not Found" fallback page |

### 🎯 Key UI Features
- **Responsive Bootstrap Grid** — Mobile-first layout with hamburger navigation
- **Fluid Typography** — CSS `clamp()` for headings that scale smoothly across viewports
- **Debounced Live Search** — 250ms debounce on support search to reduce API calls
- **Reusable Components** — `OpenAccount` CTA, `LeftSection`/`RightSection` product showcases
- **Regulatory Footer** — Full SEBI, NSE, BSE, CDSL, MCX registration and compliance details

---

## 📊 Dashboard (Trading Terminal)

The admin dashboard is a **Zerodha Kite-inspired** trading terminal built with **React 18**, **Material UI**, and **Chart.js**.

### 📄 Pages

| Route | Page | Description |
|:------|:-----|:------------|
| `/` | **Summary** | Dashboard home — user greeting, equity metrics, and holdings P&L overview |
| `/orders` | **Orders** | Order book with empty-state design and "Get started" CTA |
| `/holdings` | **Holdings** | Live portfolio table from MongoDB + interactive bar chart visualization |
| `/positions` | **Positions** | Open positions table with product type, P&L, and net change |
| `/funds` | **Funds** | Fund management — deposit/withdraw dialogs with validation and balance recalculation |
| `/apps` | **Apps** | Placeholder for future integrations |

### 🎯 Key UI Features
- **Split-Panel Layout** — 32% watchlist sidebar + 68% content area (Kite desktop style)
- **Interactive Watchlist** — Search bar, item counter (x/50), hover-reveal action buttons (Buy, Sell, Analytics, More)
- **Draggable Buy Modal** — Order execution window with quantity/price inputs and margin calculation
- **Real-Time P&L** — Automatic profit/loss calculations with color-coded indicators (green/red)
- **Financial Charts** — Bar chart for holdings prices + Doughnut chart for asset distribution
- **Market Indices Bar** — NIFTY 50 and SENSEX values displayed in the top navigation
- **MUI Tooltips** — Smooth `Grow` transition animations on watchlist action buttons
- **React Context** — Global state management for buy modal visibility and stock selection

### 📊 Charts & Visualizations
| Chart | Type | Library | Location |
|:------|:-----|:--------|:---------|
| Holdings Price Graph | Vertical Bar | Chart.js + react-chartjs-2 | Holdings page |
| Watchlist Distribution | Doughnut | Chart.js + react-chartjs-2 | Watchlist sidebar |

---

## ⚙️ Backend (REST API Server)

The backend is built with **Express 5** and **Mongoose 9**, following a clean **schema-model separation** pattern.

### 🔒 Middleware Stack
| Middleware | Purpose |
|:-----------|:--------|
| `dotenv` | Loads environment variables from `.env` |
| `cors` | Dynamic origin whitelist (frontend + dashboard URLs) with credentials support |
| `body-parser` | Parses incoming JSON request bodies |

### 🛡️ CORS Configuration
The backend uses a dynamic CORS whitelist that allows requests from:
- `FRONTEND_URL` (from `.env`)
- `DASHBOARD_URL` (from `.env`)
- `http://localhost:3000` (frontend dev)
- `http://localhost:3001` (dashboard dev)

Server-to-server requests (no `origin` header) are also permitted. All other origins are rejected.

### 📚 Support Knowledge Base
The backend includes an **in-memory support system** with 6 articles (4 standard + 2 featured):
- Track account opening
- Track segment activation
- Intraday margins
- Kite user manual
- Current Takeovers and Delisting
- Latest Intraday leverages

The `/support/search` endpoint performs full-text substring matching across titles, descriptions, and tags.

### 🔐 Authentication
- User registration via `/signup` with field validation and duplicate email checking
- Passport.js, passport-local, and passport-local-mongoose are **installed** for future authentication enhancements

### 🗄️ Database Architecture
```
schemas/                     model/
├── HoldingsSchema.js   ──►  ├── HoldingsModels.js
├── PositionsSchema.js  ──►  ├── PositionsModel.js
├── OrdersSchema.js     ──►  ├── OrdersModel.js
└── UserSchema.js       ──►  └── UsersModel.js
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push** to your branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available for educational and personal use.

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

**Built with ❤️ by [Rajiv Raj](https://github.com/rajivraj3)**

</div>

