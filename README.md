# XENA Exchange

Premium fintech demo: spot trading, P2P marketplace with escrow, yield/investment vaults, wallet, transactions, announcements, profile, and settings — built with [React 19](https://react.dev), [Vite 6](https://vite.dev), and [Tailwind CSS v4](https://tailwindcss.com).

## Features

- Spot market with 0% fee simulated execution
- P2P desk (buy/sell with smart-contract escrow simulation)
- Yield investments with tiered APY packages
- Wallet, multi-chain deposit addresses, withdrawals
- Profile (KYC, API keys, referrals, statements, preferences), Settings (account, notifications, appearance, security)
- Login/Signup pages with one-click demo access
- Fully responsive (desktop header + mobile bottom nav)
- Installable PWA (web app manifest + service worker)

## Run Locally

**Prerequisites:** Node.js 18+ (Node 22 recommended)

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm run preview
```

## Type Check

```bash
npm run lint
```

## Deploy

The repo includes a `netlify.toml` (Node 22, build `npm run build`, publish `dist`). Connect it to Netlify or use Netlify Drop with the `dist/` folder.