# FOODLOOP 🍲⚡
### Autonomous AI Food Surplus Intelligence & PayPal Redistribution Platform
> **Production Full-Stack Web Application • Built with PayPal Sandbox, Next.js 16, Supabase PostgreSQL, and AI Multi-Drop Heuristics**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16%20App%20Router-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2018%20Tables-3ecf8e.svg)](https://supabase.com/)
[![PayPal](https://img.shields.io/badge/PayPal-Orders%20v2%20Sandbox-003087.svg)](https://developer.paypal.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203D%20PayPal%20Aesthetic-38bdf8.svg)](https://tailwindcss.com/)

---

## 🌟 Executive Summary

**FOODLOOP** transforms urban food surplus into immediate community relief through an automated, full-stack redistribution architecture. Every evening, millions of portions of high-quality prepared food from hotels, universities, and commercial kitchens are discarded due to narrow **30–60 minute safe collection windows**. FOODLOOP bridges donors, recipients, and certified NGOs through:

1. **4 Dedicated Role-Based Dashboards**: Tailored experiences for Food Sellers/Donors, Food Buyers/Recipients, NGO Logistics Dispatchers, and Administrators/AI Operators.
2. **Autonomous AI Rescue Agent**: Solves emergency surplus spikes (e.g., 80-portion hostel challenges) via multi-destination clustering and carrier assignment.
3. **PayPal Sandbox REST API Integration**: Automated consumer checkout, duplicate payment protection, donor merchant payouts, and pay-it-forward community meal sponsorships.
4. **18-Table Supabase PostgreSQL Database**: Institutional-grade schema with primary/foreign keys, indexes, Row-Level Security (RLS) policies, and high-reliability offline fallback.
5. **Cryptographic QR Custody Handshakes**: Prevents duplicate claims, validates handovers at the service dock, and credits donor reward points.
6. **Live Google Maps & GPS Permissions**: Interactive map embeds, live routing, and browser geolocation coordinates.

---

## 🧱 Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Next.js 16 App Router | Ultra-responsive UI, server/client hybrid components |
| **Styling & 3D** | Tailwind CSS, Google Material Symbols, Plus Jakarta Sans | PayPal-inspired minimal aesthetic, 3D elements, light/dark themes |
| **State & Auth** | React Context (`AuthContext`), persistent session cookies | Role-Based Access Control (Donor, Recipient, NGO, Admin) |
| **Backend API** | Node.js, Next.js Route Handlers (TypeScript) | 16+ RESTful microservices for full CRUD, payments, & AI |
| **Database** | Supabase PostgreSQL + Migration Scripts | 18 tables, atomic reservations, audit logs, RLS policies |
| **Payments** | PayPal Developer Sandbox REST API v2 | Orders API, Captures API, Payouts API, Escrow ledgers |
| **AI Engine** | AI Multi-Drop Logistics Solver + Route Optimizer | 80-meal decomposition, carrier clustering, vehicle selection |
| **Maps & Location** | Google Maps Embed API & HTML5 Geolocation | Dynamic interactive maps, direction routing, GPS verification |
| **Deployment** | Vercel (Frontend/Edge) & Render (`render.yaml`) | Production-ready infrastructure-as-code |

---

## 🗄️ Database Architecture (18 PostgreSQL Tables)

The database schema is defined in `supabase/migrations/20261104_init_foodloop.sql` and includes primary keys, foreign keys, timestamps, indexes, and RLS policies:

```
profiles ──────────────┬─── food_listings ─────── reservations ─────── collection_records
                       │        │                      │
                       │   food_categories             └── payments
                       │
                       ├─── ngos ─────── ngo_verifications
                       │
                       ├─── sponsorships
                       ├─── reward_points ─────── reward_transactions ─────── coupons
                       ├─── notifications
                       ├─── ai_recommendations
                       ├─── rescue_operations ─────── rescue_allocations
                       ├─── reports
                       └─── audit_logs
```

### Table Dictionary:
1. `profiles`: User accounts, hashed passwords, roles (`donor`, `recipient`, `ngo`, `admin`), phone, verified status, active flag.
2. `food_categories`: Standardized categories (Bakery, Prepared Meals, Fresh Produce, Dairy).
3. `food_listings`: Surplus food listings, quantities, allergens, GPS coordinates, storage temperature profiles, pricing, and deadlines.
4. `reservations`: Atomic portion reservations, collection tokens (`FLP-xxx`), payment link, and status transitions.
5. `ngos`: Registered non-profits, daily meal capacities, tax exemption registrations (80G, 12A, 501(c)(3)).
6. `ngo_verifications`: Submitted verification documents, certification numbers, review logs, and admin approval states.
7. `collection_records`: Cryptographic pickup handshakes, timestamped verification hashes, and verifier IDs.
8. `payments`: PayPal sandbox orders, capture transaction IDs, amounts, currencies, and escrow status.
9. `sponsorships`: Community pay-it-forward campaigns with funded vs. target meal metrics.
10. `reward_points`: Accumulated donor and volunteer incentive point balances.
11. `reward_transactions`: Ledger of earned and redeemed point actions.
12. `coupons`: Redeemable partner vouchers (e.g., Whole Foods, Sweetgreen, Blue Apron).
13. `notifications`: In-app notification center alerts with unread states and deep routes.
14. `ai_recommendations`: ML-driven shelf-life decay pricing and routing recommendations.
15. `rescue_operations`: AI emergency batch operations and urgency classifications.
16. `rescue_allocations`: Multi-drop decomposition routes, destination shelters, and carrier assignments.
17. `reports`: Trust & Safety incident reports and moderation statuses.
18. `audit_logs`: Immutable security audit trail recording actors, actions, timestamps, and metadata.

*Note: `src/lib/db.ts` provides a unified database abstraction that uses Supabase PostgreSQL when credentials are provided and automatically uses in-memory persistence when executing offline.*

---

## 🔐 User Authentication & Role-Based Access Control (RBAC)

The system enforces strict permission boundaries across 4 distinct roles:

* **1. Food Seller / Donor**: Publishes listings, manages pickup locations with GPS, tracks incoming reservation requests, executes instant PayPal merchant payouts, and views tax deduction slips.
* **2. Food Buyer / Consumer**: Explores nearby food via Google Maps, filters by category/price, claims meals via PayPal checkout or free rescue, and receives digital collection QR tokens.
* **3. NGO Logistics Hub**: Claims high-volume bulk batches, coordinates fleet vehicles (Vans, Cargo Bikes), submits 80G/12A/501(c)(3) verification documents, and verifies custody at docks.
* **4. Admin & AI Agent**: Operates the AI Emergency Rescue Engine, manages user accounts and roles, approves/rejects NGO registrations, inspects PayPal transaction ledgers, resolves community reports, and reviews immutable security audit logs.

> **Security Rule**: Administrator accounts cannot be created via public registration. Public signup is strictly limited to `donor`, `recipient`, and `ngo`.

---

## 🧭 The 4 Dedicated Dashboards

### Dashboard 1: Food Seller / Donor Portal
* **Listing Creator**: Create Free, Discounted, or Sponsored food listings with preparation time, expiration window, allergens, and storage temperature.
* **GPS Kitchen Detection**: HTML5 Geolocation with live interactive Google Map embed.
* **Incoming Claims Management**: Review real-time buyer reservations with instant **Accept** or **Reject** actions.
* **Listing Management**: View active listings with 1-click **Delete** (`DELETE /api/listings/[id]`).
* **Handshake Verification**: Generate lot verification QR codes for courier handovers.
* **PayPal Merchant Payout**: One-click settlement to linked PayPal merchant wallet.

### Dashboard 2: Food Buyer / Consumer Marketplace
* **Surplus Radar**: Split view with Google Maps pins and distance recalculation based on current user location.
* **Category & Pricing Filters**: Filter by Bakery, Meals, Produce, or Free vs. Discounted.
* **Atomic Checkout**: Direct integration with PayPal Orders v2 Sandbox. Prevents overbooking by atomically deducting remaining portions before issuing collection vouchers.
* **Digital Collection Voucher**: Generates unique collection token (`FLP-xxx`) synced to user profile.

### Dashboard 3: NGO & Shelter Logistics Hub
* **Bulk Surplus Intake**: AG Grid-styled logistics matrix of high-volume batches.
* **Telemetry & Dispatch Scheduler**: Monitor cold-chain holding temperatures and dispatch transit units.
* **80G / 12A / 501(c)(3) Verification**: Submit government registration numbers and document links directly to the compliance queue (`POST /api/ngos/verify`).
* **Google Maps Route Viewer**: Real-time directions and transit ETAs to destination food banks.

### Dashboard 4: Admin & Autonomous AI Agent Console
* **Sub-Tab 1 — AI Rescue Solver**: Decomposes urgent 80-meal surplus events into multi-drop routes (e.g., 50 portions to Shelter Hope via Van, 30 portions to St. Jude via Cargo E-Bike) with live countdown timers and override toggles.
* **Sub-Tab 2 — User Management**: Searchable directory with live role promotion (Donor, Recipient, NGO, Admin), verification badge toggles, and account suspension switches (`PATCH /api/admin/users`).
* **Sub-Tab 3 — NGO Tax Review**: Inspect submitted 80G/12A tax exemption documents with one-click **Approve** and **Reject** compliance actions (`PATCH /api/admin/ngos`).
* **Sub-Tab 4 — PayPal Sandbox Ledger**: Financial transparency dashboard displaying total volume ($USD), captured order IDs, customer names, and 100% instant settlement rates (`GET /api/admin/transactions`).
* **Sub-Tab 5 — Moderation & Reports**: Trust & Safety queue to investigate flagged listings and resolve community incidents (`PATCH /api/admin/reports`).
* **Sub-Tab 6 — Security Audit Trail**: Immutable system log recording user IDs, IP addresses, entity types, actions, and timestamps (`GET /api/admin/audit-logs`).

---

## 💳 PayPal Sandbox Integration Details

FOODLOOP integrates PayPal REST API v2 endpoints:

* **Create Order** (`POST /api/paypal/create-order`): Creates an authorized checkout order with intent `CAPTURE`.
* **Capture Order** (`POST /api/paypal/capture-order`): Captures funds, records payment in the database, and prevents duplicate captures.
* **Merchant Payout** (`POST /api/paypal/payout`): Dispatches funds directly to donor merchant wallets.
* **Agent Toolkit** (`POST /api/paypal/agent-toolkit`): Connects to PayPal Agent Toolkit actions.

### Environment Configuration (`.env.local`):
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=BAAckGii1x5mY3w...
PAYPAL_CLIENT_SECRET=EMosSnQpWw...
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com

# Supabase PostgreSQL (Optional - In-Memory Fallback Available Out-Of-The-Box)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

---

## ⚡ Local Setup & Execution Guide

### 1. Prerequisites
* **Node.js** v18+ (tested on Node v20/v24)
* **npm** or **pnpm**

### 2. Installation
```bash
git clone https://github.com/riddhithummar27/paypal.git
cd paypal
npm install
```

### 3. Run the Supabase SQL Migration (If using cloud Supabase)
Execute the SQL statements in your Supabase SQL Editor:
```bash
# File located at:
supabase/migrations/20261104_init_foodloop.sql
```

### 4. Start the Application
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Typecheck & Build Verification
```bash
npx tsc --noEmit
npm run build
```

---

## ☁️ Cloud Deployment

### Deploy to Vercel (Frontend & Serverless API)
1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Add the environment variables (`NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, etc.).
4. Deploy!

### Deploy to Render (Node.js Full-Stack Web Service)
This repository includes a production `render.yaml` specification:
```yaml
services:
  - type: web
    name: foodloop-app
    env: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
```
Simply connect your GitHub repository to Render as a Blueprint.

---

## 📜 License
FOODLOOP is open-source software licensed under the **[MIT License](LICENSE)**.
