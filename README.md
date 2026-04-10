# 💹 StockMeter V1.0: Tactical Quantitative Terminal

A high-performance, real-time stock analytics dashboard built for professional-grade market monitoring. Designed with a sleek, low-latency interface that mimics institutional quantitative terminals.

![Dashboard Preview](./public/screenshots/dashboard.png)

## 🚀 Core Features

- **Real-Time Market Sync**: Live quote updates every 5 seconds without UI flickering.
- **Dynamic Currency Engine**: On-the-fly conversion of all financial metrics between USD, INR, EUR, and GBP.
- **Institutional Conviction Meter**: Visualized analyst recommendation trends and signal strength scores.
- **Tactical Price Charts**: Interactive historical trends with multiple time ranges (1D to 1Y) and volume tracking.
- **Corporate Intelligence**: Comprehensive asset profiles including sector analysis and executive leadership info.
- **Transition Skeletons**: Intelligent filter-sync logic that provides instant visual feedback during asset or currency switching.

## 🛠 Tech Stack & Dependencies

| Category | Package | Use Case |
| :--- | :--- | :--- |
| **Framework** | `next` (v16) | React framework for SSR, optimized routing, and API handling. |
| **State Management** | `@reduxjs/toolkit` | Manages global stock data, currency rates, and user filters. |
| **Data Fetching** | `yahoo-finance2` | The primary engine for retrieving real-time market data and historical charts. |
| **Visualization** | `recharts` | Used for drawing high-fidelity price gradients and performance lines. |
| **Iconography** | `lucide-react` | Provides sharp, semantic terminal-themed icons. |
| **Utilities** | `date-fns` | Handles precise timestamp formatting for financial charts. |
| **Performance** | `axios` | Robust HTTP client for internal API communication. |
| **Validation** | `zod` | Ensures type safety and strict schema validation for external data. |

## 🛡 Security Architecture

We have implemented several layers of protection to ensure the terminal is production-ready:

1. **Strict Headers**: Configured `next.config.ts` with:
   - `X-Frame-Options: DENY`: Blocks Clickjacking.
   - `X-Content-Type-Options: nosniff`: prevents MIME-type sniffing.
   - `X-XSS-Protection: 1; mode=block`: Basic injection mitigation.
   - `Referrer-Policy: strict-origin-when-cross-origin`: Minimizes data leakage.
2. **Rate-Limit Mitigation**: Background polling is strictly regulated (5s interval) to prevent IP blocking from third-party data providers.
3. **Optimized Package Imports**: Experimental `optimizePackageImports` is enabled for `lucide-react` and `recharts` to minimize the JS bundle size and reduce the attack surface.

## 🧠 Knowledge Transfer (KT) - Core Functions

### 1. Filter Sync Logic (`isFilterLoading`)
Located in `stockSlice.ts`, this flag distinguishes between **background polling** (silent update) and **manual filter changes** (Asset/Currency). When a user changes a filter, this flag triggers the full-section skeleton loaders, ensuring the user isn't looking at stale converted data while the new rates arrive.

### 2. Live Polling Mechanism
Managed in `app/page.tsx` via `useEffect`. It initializes a `setInterval` for quote fetching every 5s. The reducer logic in `stockSlice.ts` intelligently decides *not* to clear existing data during these polls to maintain a smooth, "no-flash" UI experience.

### 3. Currency Conversion Engine
We use a centralized `exchangeRate` in Redux. Most components do not store hardcoded values; they use the `formatCurrency` utility and the live `exchangeRate` from the state to compute display values in real-time.

## 📥 Setup and Installation

1. **Clone and Install**:
```bash
npm install
```

2. **Environment Configuration**:
   Create a `.env.local` file (refer to `.env.example`).

3. **Development Mode**:
```bash
npm run dev
```

4. **Production Build**:
```bash
npm run build
npm run start
```
