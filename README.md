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
git clone https://github.com/your-username/foodloop-paypal-ai.git
cd foodloop-paypal-ai
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(If no custom PayPal credentials are set, the app runs in **High-Fidelity Sandbox Testing Mode**, allowing judges to test every checkout and agent workflow without typing credentials!)*

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 3-Minute Judge Evaluation Walkthrough

Follow these steps to experience the complete platform in under 3 minutes:

1. **Test AI Dynamic Pricing & PayPal Checkout**:
   - Navigate to **"Surplus Deals"**.
   - Review the dynamic decay discount on bakery and meal items.
   - Click **"Pay with PayPal"** $\rightarrow$ Click **"Pay with PayPal Sandbox"** in the modal.
   - Observe the instant generation of the **Digital QR Pickup Voucher** with verified pickup passcode.
2. **Test Agentic "Pay-It-Forward" Sponsorship**:
   - Navigate to **"Sponsor Meals"**.
   - Select an urgent night shelter campaign (e.g. *St. Jude Community Mission*).
   - Select **5 Meals ($12.50)** $\rightarrow$ Click **"Confirm & Pay via PayPal Sandbox"**.
   - Notice the live progress bar and total meals sponsored counter update in real time!
3. **Experience the AG Grid Matrix**:
   - Navigate to **"NGO Logistics"**.
   - Test full-text search, column sorting, and category filters.
   - Click **"Export to CSV"** to generate an instant logistics dispatch manifest.
   - Click **"Claim Batch"** on any available batch to dispatch couriers.
4. **Trigger the 30-Minute Rescue Challenge**:
   - Navigate to **"Rescue Agent"**.
   - Click **"Run 30-Minute Rescue Challenge (80 Meals)"**.
   - Watch the autonomous agent logs stream in real-time as the 80 mess portions are geo-clustered, batch-split across shelters, and dispatched to couriers.
   - Try typing a custom prompt: *"Sponsor 10 meals for the youth shelter via PayPal"*.

---

## 🛠️ API Endpoints & Developer Specs

All endpoints are documented in the **OpenAPI 3.1** specification available at `/api/openapi.json`:

* `POST /api/paypal/create-order` — Initializes a PayPal v2 Sandbox checkout order.
* `POST /api/paypal/capture-order` — Captures and verifies transaction completion.
* `POST /api/ai/pricing-engine` — Computes dynamic decay curve based on cutoff window and food category.
* `POST /api/ai/rescue-agent` — Computes multi-shelter batch allocation matrix.
* `POST /api/ai/agent-chat` — Natural language function calling via the `@paypal/agent-toolkit`.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
