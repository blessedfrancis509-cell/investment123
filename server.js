import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const SEED_STATE = {
  users: [
    { id: 'u1', name: 'Alex Morgan', email: 'alex.morgan@xena.fi', country: 'Canada', kycTier: 'Tier 2', balance: 12840, status: 'Active' },
    { id: 'u2', name: 'Fatima Abubakar', email: 'fatima.a@xena.fi', country: 'Nigeria', kycTier: 'Tier 2', balance: 4520, status: 'Active' },
    { id: 'u3', name: 'David Chen', email: 'd.chen@xena.fi', country: 'Singapore', kycTier: 'Tier 1', balance: 980, status: 'Active' },
    { id: 'u4', name: 'Grace Okafor', email: 'grace.o@xena.fi', country: 'Ghana', kycTier: 'Tier 1', balance: 1210, status: 'Frozen' },
    { id: 'u5', name: 'Omar Hassan', email: 'omar.h@xena.fi', country: 'UAE', kycTier: 'Tier 3 (Institutional)', balance: 78200, status: 'Active' },
    { id: 'u6', name: 'Lina Kowalski', email: 'lina.k@xena.fi', country: 'Poland', kycTier: 'Tier 2', balance: 3360, status: 'Active' },
    { id: 'u7', name: 'Chen Wei', email: 'chen.wei@xena.fi', country: 'China', kycTier: 'Tier 1', balance: 540, status: 'Pending KYC' },
    { id: 'u8', name: 'Sara Mensah', email: 'sara.m@xena.fi', country: 'Kenya', kycTier: 'Tier 1', balance: 720, status: 'Active' },
  ],
  txs: [
    { id: 't1', user: 'Alex Morgan', type: 'Deposit', amount: 2500, unit: 'XENA', status: 'Completed', time: '2 min ago', method: 'USDT' },
    { id: 't2', user: 'Fatima Abubakar', type: 'Withdrawal', amount: 1500, unit: 'XENA', status: 'Pending', time: '8 min ago', method: 'NGN Bank' },
    { id: 't3', user: 'Omar Hassan', type: 'P2P Sell', amount: 5000, unit: 'XENA', status: 'Completed', time: '22 min ago', method: 'Escrow' },
    { id: 't4', user: 'David Chen', type: 'Deposit', amount: 400, unit: 'XENA', status: 'Completed', time: '1 hr ago', method: 'BTC' },
    { id: 't5', user: 'Lina Kowalski', type: 'Withdrawal', amount: 800, unit: 'XENA', status: 'Pending', time: '2 hrs ago', method: 'USDT' },
    { id: 't6', user: 'Grace Okafor', type: 'P2P Buy', amount: 200, unit: 'XENA', status: 'Failed', time: '3 hrs ago', method: 'Escrow' },
    { id: 't7', user: 'Sara Mensah', type: 'Investment', amount: 50, unit: 'XENA', status: 'Completed', time: '5 hrs ago', method: 'Vault' },
    { id: 't8', user: 'Chen Wei', type: 'Withdrawal', amount: 120, unit: 'XENA', status: 'Completed', time: '8 hrs ago', method: 'SOL' },
  ],
  merchants: [
    { id: 'm1', name: 'CryptoDesk NG', owner: 'Fatima Abubakar', verified: true, orders: 1240, rating: 98.6 },
    { id: 'm2', name: 'QuickXchange', owner: 'David Chen', verified: false, orders: 312, rating: 92.1 },
    { id: 'm3', name: 'AfriTrade Hub', owner: 'Sara Mensah', verified: true, orders: 860, rating: 97.2 },
    { id: 'm4', name: 'Gulf Prime', owner: 'Omar Hassan', verified: true, orders: 2210, rating: 99.1 },
    { id: 'm5', name: 'EuroBridge', owner: 'Lina Kowalski', verified: false, orders: 145, rating: 88.4 },
  ],
  disputes: [
    { id: 'd1', offer: 'CryptoDesk NG', buyer: 'User 8842', seller: 'Fatima Abubakar', amount: 1500, reason: 'Payment not received', status: 'Open' },
    { id: 'd2', offer: 'Gulf Prime', buyer: 'User 1201', seller: 'Omar Hassan', amount: 3200, reason: 'Wrong NGN amount credited', status: 'Open' },
    { id: 'd3', offer: 'AfriTrade Hub', buyer: 'User 5530', seller: 'Sara Mensah', amount: 800, reason: 'Seller wants release without proof', status: 'Escalated' },
  ],
  tickets: [
    { id: 's1', user: 'Alex Morgan', subject: 'Withdrawal stuck on Pending', status: 'Open', priority: 'High', time: '12 min ago' },
    { id: 's2', user: 'Omar Hassan', subject: 'KYC tier upgrade request', status: 'Open', priority: 'Medium', time: '45 min ago' },
    { id: 's3', user: 'Chen Wei', subject: 'Cannot verify identity documents', status: 'Pending', priority: 'High', time: '2 hrs ago' },
    { id: 's4', user: 'Grace Okafor', subject: 'Account frozen — appeal', status: 'Resolved', priority: 'Low', time: '1 day ago' },
  ],
  promos: [
    { id: 'p1', code: 'XENA25', value: 25, unit: 'USD', used: 842, cap: 1000, active: true },
    { id: 'p2', code: 'WELCOME10', value: 10, unit: 'XENA', used: 1210, cap: 2500, active: true },
    { id: 'p3', code: 'STAKER20', value: 20, unit: 'USD', used: 320, cap: 500, active: false },
  ],
  audit: [
    { id: 'a1', action: 'Admin login', actor: 'Super Admin', detail: 'Signed in from 192.168.1.4', time: '2 min ago' },
    { id: 'a2', action: 'Wallet freeze', actor: 'admin@xena.fi', detail: 'Froze account Grace Okafor', time: '1 hr ago' },
    { id: 'a3', action: 'KYC approval', actor: 'KYC Officer', detail: 'Upgraded Chen Wei to Tier 1', time: '3 hrs ago' },
    { id: 'a4', action: 'Payout run', actor: 'System', detail: 'Auto-compounded 1,240 vaults', time: '6 hrs ago' },
    { id: 'a5', action: 'Settings change', actor: 'Super Admin', detail: 'Maintenance mode disabled', time: '1 day ago' },
  ],
  deposits: [
    { id: 'dep1', user: 'Alex Morgan', email: 'alex.morgan@xena.fi', method: 'USDT (TRC-20)', amount: 2500, unit: 'USD', xena: 8750, status: 'Completed', time: '2 min ago' },
    { id: 'dep2', user: 'Omar Hassan', email: 'omar.h@xena.fi', method: 'Bank Transfer (AED)', amount: 8000, unit: 'USD', xena: 28000, status: 'Completed', time: '22 min ago' },
    { id: 'dep3', user: 'David Chen', email: 'd.chen@xena.fi', method: 'BTC', amount: 400, unit: 'USD', xena: 1400, status: 'Completed', time: '1 hr ago' },
    { id: 'dep4', user: 'Sara Mensah', email: 'sara.m@xena.fi', method: 'M-Pesa', amount: 200, unit: 'USD', xena: 700, status: 'Pending', time: '4 hrs ago' },
    { id: 'dep5', user: 'Lina Kowalski', email: 'lina.k@xena.fi', method: 'EUR SEPA', amount: 1200, unit: 'USD', xena: 4200, status: 'Completed', time: '6 hrs ago' },
    { id: 'dep6', user: 'Fatima Abubakar', email: 'fatima.a@xena.fi', method: 'NGN Bank Transfer', amount: 900, unit: 'USD', xena: 3150, status: 'Pending', time: '9 hrs ago' },
  ],
  referrals: [
    { id: 'r1', user: 'Fatima Abubakar', refCode: 'FATIMA-X', count: 24, earned: 360 },
    { id: 'r2', user: 'Omar Hassan', refCode: 'OMAR-X', count: 41, earned: 615 },
    { id: 'r3', user: 'Alex Morgan', refCode: 'ALEX-X', count: 18, earned: 270 },
    { id: 'r4', user: 'Sara Mensah', refCode: 'SARA-X', count: 12, earned: 180 },
    { id: 'r5', user: 'David Chen', refCode: 'DAVID-X', count: 6, earned: 90 },
    { id: 'r6', user: 'Lina Kowalski', refCode: 'LINA-X', count: 9, earned: 135 },
  ],
  bonusLog: [],
  announcements: [
    {
      id: 'ann-1',
      title: 'Zero-Fee P2P Trading Carnival is Now Live!',
      date: 'May 24, 2026',
      tag: 'Promotion',
      tagColor: 'bg-emerald-50 text-[#16A34A] border-emerald-100',
      summary: 'Trade fiat-to-XENA with 0% maker and taker fees through our verified peer-to-peer network. Over 40 fiat payment channels supported with instant smart escrow protection.',
      actionText: 'Start P2P Trading',
      actionId: 'p2p',
    },
    {
      id: 'ann-2',
      title: 'New High-Yield 180-Day Institutional Staking Vault (52.0% APY)',
      date: 'May 20, 2026',
      tag: 'Staking',
      tagColor: 'bg-purple-50 text-[#6D28D9] border-purple-100',
      summary: 'We have expanded our decentralized validator delegation pools. Lock your XENA tokens to earn up to 52% APY with daily compounded payouts and automated slashing protection.',
      actionText: 'View Staking Vaults',
      actionId: 'staking',
    },
    {
      id: 'ann-3',
      title: 'XENA Network Upgrades to Mainnet v2.4 (Sub-Second Finality)',
      date: 'May 15, 2026',
      tag: 'System Upgrade',
      tagColor: 'bg-blue-50 text-blue-600 border-blue-100',
      summary: 'The XENA blockchain layer has successfully transitioned to consensus v2.4, achieving sub-second block finality and gas fee reductions of over 70% across all decentralized transactions.',
      actionText: 'Explore System Details',
    },
    {
      id: 'ann-4',
      title: 'CertiK Complete Security Audit & Proof-of-Reserves Verification',
      date: 'May 10, 2026',
      tag: 'Security',
      tagColor: 'bg-purple-50 text-[#6D28D9] border-purple-100',
      summary: 'CertiK has completed its formal verification of all XENA smart contracts with a 99/100 security score. Proof-of-Reserves merkle trees are now updated live on-chain every 6 hours.',
      actionText: 'View Security Audit',
    },
  ],
  settings: { maintenanceMode: false, p2pZeroFee: true, withdrawApproval: true },
  accounts: [],
};

function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (err) {
    console.error('Failed to read data/db.json, re-seeding.', err);
  }
  return JSON.parse(JSON.stringify(SEED_STATE));
}

let db = loadDb();

function saveDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = DB_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tmp, DB_FILE);
  } catch (err) {
    console.error('Failed to persist data/db.json.', err);
  }
}

const app = express();
app.use(express.json({ limit: '2mb' }));

app.get('/api/state', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(db);
});

app.post('/api/state', (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    res.status(400).json({ ok: false, error: 'Invalid payload' });
    return;
  }
  for (const key of Object.keys(body)) {
    db[key] = body[key];
  }
  saveDb();
  res.json({ ok: true });
});

const DIST_DIR = path.join(__dirname, 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(INDEX_HTML, (err) => {
      if (err) res.status(404).end();
    });
  });
} else {
  app.get('/', (req, res) => {
    res.type('text/plain').send('XENA Exchange API is running. Build the client with `npm run build` first.');
  });
}

app.listen(PORT, () => {
  console.log(`XENA Exchange server listening on port ${PORT}`);
});