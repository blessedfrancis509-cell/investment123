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

The app runs as a single Node process: `server.js` (Express) serves the built SPA from `dist/` **and** a JSON-file-backed REST API at `/api/state` that persists accounts and all admin-managed data to `data/db.json`. This makes admin changes (users, deposits, referrals, announcements, promos, settings, etc.) shared across every device.

### smarterasp.net (GitHub auto-deploy)

1. Push this repo to GitHub.
2. In the smarterasp panel create a **Node.js / React** site and connect it to the GitHub repo (Build & Deploy).
3. Build command: `npm install && npm run build`
4. Start / run command: `npm start` (server listens on `process.env.PORT`).
5. The runtime-written file `data/db.json` is git-ignored so it persists on the server only — never commit it.

> Note: `server.js` uses ESM (`"type": "module"`) and Express 4. Node 18+ required.

### Static hosting (Netlify / others)

Without a Node runtime the app runs in pure demo mode: `netlify.toml` (Node 22, build `npm run build`, publish `dist`) works for a static build, but admin/account changes will **not** persist or sync across devices — use the Node deployment above for full server-backed behaviour.