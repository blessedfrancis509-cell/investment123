import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const ADMIN_EMAIL = 'admin@xena.fi';

// ---------- Password hashing (Node built-in scrypt, no deps) ----------
// Password records store salt + hash only; plaintext is never persisted.
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

// ---------- Token helpers ----------
function tokenForEmail(email) {
  return (db.tokens || {})[String(email).toLowerCase()] || null;
}
function setToken(email) {
  const token = crypto.randomBytes(32).toString('hex');
  db.tokens = db.tokens || {};
  db.tokens[String(email).toLowerCase()] = token;
  saveDb();
  return token;
}
function emailForToken(token) {
  if (!token || !db.tokens) return null;
  for (const email of Object.keys(db.tokens)) {
    if (db.tokens[email] === token) return email;
  }
  return null;
}

// ---------- Account helpers ----------
function sanitizeAccount(acc) {
  if (!acc) return acc;
  const { password, salt, hash, ...rest } = acc;
  return rest;
}

function baseAccount(data) {
  const ts = Date.now().toString();
  return {
    ...data,
    id: `acc-${ts.slice(-6)}`,
    xenaId: `XN-${Math.floor(1000000 + Math.random() * 9000000)}`,
    xenaCode: `xena-${Math.floor(10000000 + Math.random() * 89999999)}`,
    kycTier: 'Tier 1 (Pending)',
    status: 'Active',
    joined: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
    twoFactorEnabled: false,
    pinSet: false,
    verifiedAccountsCount: 0,
    settings: {},
    balances: {
      totalXena: 0,
      totalBalance: 0,
      usdRate: 1,
      change24hAmount: 0,
      change24hPercent: 0,
      availableXena: 0,
      investedXena: 0,
      averageBuyPrice: 0,
      currentPrice: 2.85,
      stakedXena: 0,
      lockedInOrders: 0,
      nairaBalance: 0,
    },
    transactions: [],
    investments: [],
    notifications: [],
    redeemedBonusCodes: [],
  };
}

// ---------- Admin check ----------
function isAdminToken(token) {
  return emailForToken(token) === ADMIN_EMAIL;
}
function requireAdminToken(token) {
  if (!token || !isAdminToken(token)) return false;
  return true;
}
function requireUserToken(token) {
  return !!emailForToken(token);
}

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
  p2pOffers: [],
  p2pTrades: [],
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
  tokens: {},
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
  const publicAccounts = Array.isArray(db.accounts) ? db.accounts.map(sanitizeAccount) : db.accounts;
  res.json({ ...db, accounts: publicAccounts });
});

// Admin/global data mutations. Accounts are NEVER writable here — they only
// change through the authenticated account/login/register endpoints so that
// hashes and balances stay safe and per-user.
app.post('/api/state', (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    res.status(400).json({ ok: false, error: 'Invalid payload' });
    return;
  }
  for (const key of Object.keys(body)) {
    if (key === 'accounts' || key === 'tokens' || key === 'p2pOffers' || key === 'p2pTrades') continue;
    db[key] = body[key];
  }
  saveDb();
  res.json({ ok: true });
});

// ---------- Authentication----------- 
app.post('/api/register', (req, res) => {
  const { name, email, password, country, phone, dob, referrer } = req.body || {};
  const e = String(email || '').trim().toLowerCase();
  if (!name || !e || !password) {
    res.status(400).json({ ok: false, error: 'Missing required fields.' });
    return;
  }
  if (String(password).length < 8) {
    res.status(400).json({ ok: false, error: 'Password must be at least 8 characters long.' });
    return;
  }
  const existing = (db.accounts || []).find((a) => a.email === e);
  if (existing) {
    res.status(400).json({ ok: false, error: 'An account with this email already exists.' });
    return;
  }
  const { salt, hash } = hashPassword(String(password));
  const acc = baseAccount({ name, email: e, password: undefined, country, phone, dob, referrer });
  acc.salt = salt;
  acc.hash = hash;
  delete acc.password;
  db.accounts = [acc, ...(db.accounts || [])];
  const token = setToken(e);
  saveDb();
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, account: sanitizeAccount(acc), token });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  const e = String(email || '').trim().toLowerCase();
  if (!e || !password) {
    res.status(400).json({ ok: false, error: 'Missing email or password.' });
    return;
  }
  if (e === 'admin@xena.fi' && String(password) === 'xena-admin-demo') {
    const token = setToken(e);
    saveDb();
    res.set('Cache-Control', 'no-store');
    res.json({ ok: true, role: 'admin', token });
    return;
  }
  const acc = (db.accounts || []).find((a) => a.email === e);
  if (!acc) {
    res.status(400).json({ ok: false, error: 'No account found with that email.' });
    return;
  }
  if (!verifyPassword(String(password), acc.salt, acc.hash)) {
    res.status(400).json({ ok: false, error: 'Incorrect password. Please try again.' });
    return;
  }
  const token = tokenForEmail(e) || setToken(e);
  saveDb();
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, role: 'user', account: sanitizeAccount(acc), token });
});

// Persist the signed-in account's mutable session data (bal/transactions/...).
app.post('/api/account/save', (req, res) => {
  const { token, updates } = req.body || {};
  const email = emailForToken(token);
  if (!email) {
    res.status(401).json({ ok: false, error: 'Session invalid. Please sign in again.' });
    return;
  }
  const idx = (db.accounts || []).findIndex((a) => a.email === email);
  if (idx === -1) {
    res.status(404).json({ ok: false, error: 'Account not found.' });
    return;
  }
  db.accounts[idx] = { ...db.accounts[idx], ...(updates || {}) };
  saveDb();
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true });
});

// Change password for the signed-in account (re-hashed server-side).
app.post('/api/account/password', (req, res) => {
  const { token, currentPassword, newPassword } = req.body || {};
  const email = emailForToken(token);
  if (!email) {
    res.status(401).json({ ok: false, error: 'Session invalid. Please sign in again.' });
    return;
  }
  const acc = (db.accounts || []).find((a) => a.email === email);
  if (!acc) {
    res.status(404).json({ ok: false, error: 'Account not found.' });
    return;
  }
  if (!verifyPassword(String(currentPassword || ''), acc.salt, acc.hash)) {
    res.status(400).json({ ok: false, error: 'Current password is incorrect.' });
    return;
  }
  if (!newPassword || String(newPassword).length < 8) {
    res.status(400).json({ ok: false, error: 'New password must be at least 8 characters long.' });
    return;
  }
  const { salt, hash } = hashPassword(String(newPassword));
  acc.salt = salt;
  acc.hash = hash;
  saveDb();
  res.json({ ok: true });
});

// ---------- Admin: Adjust User Balance ----------
app.post('/api/admin/adjust-balance', (req, res) => {
  const { token, targetEmail, amount, memo } = req.body || {};
  if (!requireAdminToken(token)) {
    res.status(401).json({ ok: false, error: 'Admin access required.' });
    return;
  }
  const e = String(targetEmail || '').trim().toLowerCase();
  const adj = Number(amount) || 0;
  if (!e || !adj) {
    res.status(400).json({ ok: false, error: 'Missing target email or amount.' });
    return;
  }
  const acc = (db.accounts || []).find((a) => a.email === e);
  if (!acc) {
    res.status(404).json({ ok: false, error: 'No account found with that email.' });
    return;
  }
  acc.balances = acc.balances || {};
  acc.balances.availableXena = Math.max(0, (acc.balances.availableXena || 0) + adj);
  acc.balances.totalBalance = Math.max(0, (acc.balances.totalBalance || 0) + adj);
  acc.transactions = acc.transactions || [];
  acc.transactions.unshift({
    id: `tx-admin-${Date.now()}-${Math.floor(Math.random() * 999)}`,
    title: adj >= 0 ? `Admin Credit — ${memo || 'Balance adjustment'}` : `Admin Debit — ${memo || 'Balance adjustment'}`,
    type: adj >= 0 ? 'deposit' : 'withdrawal',
    amount: Math.abs(adj),
    unit: 'XENA',
    status: 'Completed',
    timestamp: new Date().toLocaleString(),
    counterparty: 'XENA Admin',
    paymentMethod: 'Admin Adjustment',
    fee: 0,
  });
  acc.notifications = acc.notifications || [];
  acc.notifications.unshift({
    id: `notif-admin-${Date.now()}`,
    title: adj >= 0 ? 'Balance Credited by Admin' : 'Balance Debited by Admin',
    message: adj >= 0
      ? `Admin added ${Math.abs(adj)} XENA to your balance. ${memo ? `Reason: ${memo}` : ''}`
      : `Admin removed ${Math.abs(adj)} XENA from your balance. ${memo ? `Reason: ${memo}` : ''}`,
    timestamp: 'Just now',
    read: false,
    type: 'transaction',
  });
  saveDb();
  res.json({ ok: true, newBalance: acc.balances.availableXena });
});

// ---------- P2P Listings & Payment Validation (admin approval required) ----------
app.post('/api/p2p/offer', (req, res) => {
  const { token, offer } = req.body || {};
  const email = emailForToken(token);
  if (!requireUserToken(token)) {
    res.status(401).json({ ok: false, error: 'You must be signed in to post an ad.' });
    return;
  }
  const newOffer = {
    id: offer.id || `p2p-ad-${Date.now()}`,
    merchantName: offer.merchantName || email,
    merchantTier: offer.merchantTier || 'Verified Trader',
    completionRate: offer.completionRate ?? 100,
    completedOrders: offer.completedOrders ?? 0,
    ordersCount: offer.ordersCount ?? 0,
    type: offer.type,
    pricePerXena: Number(offer.pricePerXena) || 2.85,
    currency: offer.currency || 'USD',
    minLimit: Number(offer.minLimit) || 50,
    maxLimit: Number(offer.maxLimit) || 2500,
    availableXena: Number(offer.availableXena) || 1000,
    paymentMethods: offer.paymentMethods || ['Bank Transfer'],
    paymentMethod: offer.paymentMethod || (offer.paymentMethods || []).join(', '),
    responseTimeMinutes: offer.responseTimeMinutes ?? 2,
    isOnline: true,
    status: 'pending',
    listedBy: email,
    listedAt: Date.now(),
  };
  db.p2pOffers = [newOffer, ...(db.p2pOffers || [])];
  saveDb();
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, offer: newOffer });
});

app.post('/api/p2p/offer/approve', (req, res) => {
  const { token, offerId } = req.body || {};
  if (!requireAdminToken(token)) {
    res.status(401).json({ ok: false, error: 'Admin access required.' });
    return;
  }
  const offer = (db.p2pOffers || []).find((o) => o.id === offerId);
  if (!offer) {
    res.status(404).json({ ok: false, error: 'Offer not found.' });
    return;
  }
  offer.status = 'approved';
  saveDb();
  res.json({ ok: true });
});

app.post('/api/p2p/offer/reject', (req, res) => {
  const { token, offerId } = req.body || {};
  if (!requireAdminToken(token)) {
    res.status(401).json({ ok: false, error: 'Admin access required.' });
    return;
  }
  const offer = (db.p2pOffers || []).find((o) => o.id === offerId);
  if (!offer) {
    res.status(404).json({ ok: false, error: 'Offer not found.' });
    return;
  }
  offer.status = 'rejected';
  saveDb();
  res.json({ ok: true });
});

app.post('/api/p2p/payment', (req, res) => {
  const { token, trade } = req.body || {};
  const email = emailForToken(token);
  if (!requireUserToken(token)) {
    res.status(401).json({ ok: false, error: 'You must be signed in to submit payment.' });
    return;
  }
  const newTrade = {
    id: trade.id || `p2p-tx-${Date.now()}`,
    offerId: trade.offerId,
    merchantName: trade.merchantName,
    type: trade.type || 'BUY',
    method: trade.method,
    fiatAmount: Number(trade.fiatAmount) || 0,
    currency: trade.currency || 'USD',
    xenaAmount: Number(trade.xenaAmount) || 0,
    pricePerXena: Number(trade.pricePerXena) || 2.85,
    buyerEmail: email,
    status: 'awaiting_validation',
    reference: trade.reference || `XN-${Math.floor(10000 + Math.random() * 90000)}-P2P`,
    time: 'Just now',
    submittedAt: Date.now(),
  };
  db.p2pTrades = [newTrade, ...(db.p2pTrades || [])];
  saveDb();
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, trade: newTrade });
});

app.post('/api/p2p/payment/approve', (req, res) => {
  const { token, tradeId } = req.body || {};
  if (!requireAdminToken(token)) {
    res.status(401).json({ ok: false, error: 'Admin access required.' });
    return;
  }
  const trade = (db.p2pTrades || []).find((t) => t.id === tradeId);
  if (!trade) {
    res.status(404).json({ ok: false, error: 'Trade not found.' });
    return;
  }
  trade.status = 'approved';
  let credited = false;
  const buyer = (db.accounts || []).find((a) => a.email === trade.buyerEmail);
  if (buyer) {
    buyer.balances = buyer.balances || {};
    buyer.balances.availableXena = (buyer.balances.availableXena || 0) + trade.xenaAmount;
    buyer.balances.totalBalance = (buyer.balances.totalBalance || 0) + trade.xenaAmount;
    buyer.transactions = buyer.transactions || [];
    buyer.transactions.unshift({
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 999)}`,
      title: `P2P Purchase (${trade.method})`,
      type: 'p2p_buy',
      amount: trade.xenaAmount,
      unit: 'XENA',
      status: 'Completed',
      timestamp: new Date().toLocaleString(),
      counterparty: trade.merchantName,
      paymentMethod: trade.method,
      fee: 0,
    });
    buyer.notifications = buyer.notifications || [];
    buyer.notifications.unshift({
      id: `notif-p2p-${Date.now()}`,
      title: 'P2P Payment Approved',
      message: `Admin validated your ${trade.method} payment. ${trade.xenaAmount} XENA has been released to your balance.`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
    });
    credited = true;
  }
  saveDb();
  res.json({ ok: true, credited });
});

app.post('/api/p2p/payment/reject', (req, res) => {
  const { token, tradeId } = req.body || {};
  if (!requireAdminToken(token)) {
    res.status(401).json({ ok: false, error: 'Admin access required.' });
    return;
  }
  const trade = (db.p2pTrades || []).find((t) => t.id === tradeId);
  if (!trade) {
    res.status(404).json({ ok: false, error: 'Trade not found.' });
    return;
  }
  trade.status = 'rejected';
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