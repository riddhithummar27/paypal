# FOODLOOP 2.0 🍲⚡
### AI Surplus Intelligence & Autonomous PayPal Redistribution Network
> **Built for the Global Online Hackathon: "Build What's Next with PayPal and AI"**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16%20App%20Router-black.svg)](https://nextjs.org/)
[![PayPal](https://img.shields.io/badge/PayPal-Orders%20v2%20Sandbox-blue.svg)](https://developer.paypal.com/)
[![PayPal Agent Toolkit](https://img.shields.io/badge/PayPal-Agent%20Toolkit-0070ba.svg)](https://github.com/paypal/AI-Toolkit)
[![AG Grid](https://img.shields.io/badge/AG%20Grid-Quartz%20Dark-purple.svg)](https://www.ag-grid.com/)
[![OpenAPI](https://img.shields.io/badge/APIMatic-OpenAPI%203.1-teal.svg)](https://www.apimatic.io/)

---

## 🏆 Targeted Prize Categories & Sponsor Alignments

| Hackathon Category | Prize Track | How FOODLOOP 2.0 Delivers |
| :--- | :--- | :--- |
| **Grand Prize (1st Place)** | **$12,000** | End-to-end working platform addressing food waste and urban hunger using autonomous agents and financial rails. |
| **Best Use of PayPal + AI** | **$5,000** | Dynamic shelf-life decay pricing algorithm linked directly to PayPal Sandbox smart checkout. |
| **Best Use of Agentic Commerce** | **$5,000** | **Autonomous Rescue Agent**: AI analyzes surplus spikes, decomposes bulk batches across shelters, and coordinates payments without human bottlenecks. |
| **Best Use of AG Grid** | **$5,000 (1st)** | Enterprise logistics matrix in the NGO Dashboard with quick search, multi-column sorting, CSV data export, and status tracking. |
| **Best Use of Bryntum** | **$1,000** | Visual rapid dispatch timeline & courier scheduler coordinating urgent 30-45 minute food safety transit windows. |
| **Best Use of APIMatic** | **$1,000** | OpenAPI 3.1 specification and context plugin-ready endpoints (`/api/openapi.json`) for seamless third-party POS integration. |
| **Best Use of Render** | **$1,000 Credits** | Production `render.yaml` infrastructure-as-code for zero-friction hosted cloud deployments. |

---

## 💡 The Core Problem & Our Solution

Every evening, tons of high-quality prepared food from university dining halls, hotel buffets, catering halls, and bakeries are discarded because of **tight 30–60 minute food safety collection windows**. At the same time, regional homeless shelters and community kitchens experience acute food deficits.

Traditional food donation apps fail because they require **manual phone calls**, do not handle **bulk batch splitting**, and lack **financial rails** to subsidize urgent meal preparation.

### FOODLOOP 2.0 solves this through:
1. **Dynamic Shelf-Life Decay Pricing**: Consumer surplus meals dynamically mark down (up to 75% off) via AI as pickup deadlines approach, settled via **PayPal Sandbox Checkout**.
2. **Community "Pay-It-Forward" Meal Sponsorship**: Supporters sponsor batches of meals ($5 = 2 meals, $12.50 = 5 meals) via PayPal. Partner kitchens prepare them; local NGOs collect them.
3. **Pure Food Rescue ($0)**: Hostels and caterers donate bulk surplus with **zero transaction fees** (no awkward mock ₹0 PayPal screens).
4. **The Star Feature: FOODLOOP Autonomous Rescue Agent**: When a dining hall lists 80 meals at 8:00 PM with an 8:30 PM cutoff, the AI agent perceives the event, calculates shelter capacities, splits the 80 meals into multi-drop batches (50 to Shelter A, 30 to Shelter B), and dispatches couriers within minutes.

---

## ⚙️ System Architecture

```
                                  ┌───────────────────────────────────────────────┐
                                  │           FOODLOOP 2.0 Web Platform           │
                                  │   Next.js 16 • React 19 • Tailwind CSS        │
                                  └───────────────────────┬───────────────────────┘
                                                          │
                    ┌─────────────────────────────────────┼─────────────────────────────────────┐
                    ▼                                     ▼                                     ▼
        ┌───────────────────────┐             ┌───────────────────────┐             ┌───────────────────────┐
        │   AI Rescue Engine    │             │   PayPal Financial    │             │   Sponsor Integrations│
        ├───────────────────────┤             ├───────────────────────┤             ├───────────────────────┤
        │ • Shelf-Life Decay    │             │ • PayPal Orders API v2│             │ • AG Grid Matrix      │
        │ • Multi-Node Batching │             │ • Smart Sandbox Button│             │ • Bryntum Scheduler   │
        │ • Safety Verification │             │ • @paypal/agent-toolk.│             │ • APIMatic OpenAPI 3.1│
        └───────────────────────┘             └───────────────────────┘             └───────────────────────┘
```

---

## 🚀 Quickstart & Setup Guide for Judges

The application is configured to run out-of-the-box with pre-seeded demo records and instant sandbox payment simulations.

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** or **yarn**

### 2. Clone and Install
```bash
git clone https://github.com/riddhithummar27/paypal.git
cd paypal
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(If no custom PayPal credentials are set, the app runs in **High-Fidelity Sandbox Testing Mode**, allowing judges to test every checkout, payout, and agent workflow out-of-the-box!)*

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 3-Minute Judge Evaluation Walkthrough

Follow these steps to experience the complete platform across all 6 light-theme modules:

1. **Module 1: Home (`/`)**:
   - Inspect the live Pod #8841 rescue timer and 4 verified metrics cards.
   - Click **"Verify QR Handshake"** to simulate cryptographic custody token release via `/api/custody/verify`.
   - Click the gold **"Sponsors (5)"** button in the top navigation to view the comprehensive sponsor compliance matrix.

2. **Module 2: Explore Food**:
   - Browse the split-map and verified surplus listings stream with live countdown tickers.
   - Click any card to open the slide-over specification sheet with temperature compliance logs.
   - Click **"Pay with PayPal ($4.50)"** to trigger PayPal Orders v2 sandbox checkout and generate a digital pickup voucher.

3. **Module 3: Autonomous AI Rescue Agent**:
   - Review the v2.4 Engine status and toggle **"Manual Override"** to test operator control.
   - Click **"Run 30-Minute Rescue Challenge (80 Meals)"** to watch real-time multi-drop geo-clustering, shelter capacity balancing, and automated dispatch creation via `/api/ai/rescue-agent`.

4. **Module 4: Donor Portal**:
   - Check the live Surplus Ledger Balance ($148.20 USD) and click **"Instant PayPal Payout"** to execute `/api/paypal/payout`.
   - Click **"Download Tax Slip (PDF)"** for an IRS 501(c)(3) deduction certificate.
   - Use the **"Dispatch Surplus Batch"** form to create a new live listing via `/api/listings`.

5. **Module 5: NGO & Shelter Logistics Hub**:
   - Experience the **AG Grid Enterprise-Style Matrix** with quick search, multi-column sorting, and **"Export Dispatch CSV"**.
   - Review the **Bryntum Visual Hourly Dispatch Timeline** and live courier telematics.
   - Test the **Intake Verification Terminal** with simulated NFC / manual key scan.

6. **Module 6: Transparent Impact & ESG Scope 3**:
   - Inspect verified circular economy metrics (142,890 meals rescued, 89.4 MT CO2e avoided).
   - Export audit-grade reports via **"Export Raw CSV"** and **"Download ESG Scope 3 Report"**.
   - Test the **Community Table Meal Sponsorship** portal with $5, $25, or $100 PayPal tiers.

---

## 🛠️ API Endpoints & Developer Specs

All endpoints are documented in the **OpenAPI 3.1** specification available at `/api/openapi.json`:

* `POST /api/paypal/create-order` — Initializes a PayPal v2 Sandbox checkout order.
* `POST /api/paypal/capture-order` — Captures and verifies transaction completion.
* `POST /api/paypal/payout` — Executes batch merchant payouts to donors via PayPal Payouts API.
* `POST /api/paypal/agent-toolkit` — Inspects and executes `@paypal/agent-toolkit` tools.
* `GET /api/listings` — Retrieves all active and claimed food listings.
* `POST /api/listings` — Dispatches new surplus food lots into the system.
* `PATCH /api/listings` — Updates batch status (claim, fulfill).
* `GET /api/dispatches` — Retrieves Bryntum courier schedule slots.
* `POST /api/custody/verify` — Validates QR / NFC custody handshakes and releases escrow.
* `POST /api/ai/rescue-agent` — Computes multi-shelter batch allocation matrix.
* `POST /api/ai/pricing-engine` — Computes dynamic decay curve based on cutoff window and category.
* `GET /api/openapi.json` — OpenAPI 3.1 schema ready for APIMatic Context Plugins.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
