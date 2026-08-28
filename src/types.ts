export interface UserProfile {
  name: string;
  email: string;
  kycTier: string;
  avatarUrl?: string;
  xenaId: string;
  xenaCode: string;
  twoFactorEnabled: boolean;
  pinSet: boolean;
  verifiedAccountsCount: number;
}

export interface UserBalances {
  totalXena: number;
  totalBalance?: number;
  usdRate: number;
  change24hAmount: number;
  change24hPercent: number;
  availableXena: number;
  investedXena: number;
  averageBuyPrice: number;
  currentPrice: number;
  stakedXena: number;
  lockedInOrders: number;
  nairaBalance: number;
  xenaNgnRate: number;
}

export interface MarketStats {
  pair: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24hXena: number;
  volume24hUsdt: number;
}

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'investment'
  | 'p2p_buy'
  | 'p2p_sell'
  | 'buy'
  | 'sell'
  | 'staking_reward'
  | 'yield'
  | 'send'
  | 'receive'
  | 'p2p'
  | string;

export type TransactionStatus =
  | 'Completed'
  | 'Pending'
  | 'Failed'
  | 'Processing'
  | 'completed'
  | 'pending'
  | 'processing'
  | string;

export interface Transaction {
  id: string;
  title: string;
  type: TransactionType;
  amount: number;
  unit: string;
  status: TransactionStatus;
  timestamp: string;
  txHash?: string;
  counterparty?: string;
  fee?: number;
  paymentMethod?: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  category: 'Growth' | 'Staking' | 'Flexible' | 'Fixed Term' | string;
  investedAmount: number;
  projectedReturnPercent: number;
  earnedAmount: number;
  progressPercent: number;
  daysRemaining: number;
  totalDays?: number;
  startDate?: string;
  endDate?: string;
  status?: 'Active' | 'Matured' | 'Pending' | string;
  dailyYieldXena?: number;
}

export interface P2POffer {
  id: string;
  merchantName: string;
  merchantTier?: 'Pro Merchant' | 'Verified Trader' | 'VIP Merchant' | string;
  completionRate: number;
  completedOrders?: number;
  ordersCount?: number;
  type?: 'BUY' | 'SELL';
  pricePerXena: number;
  currency?: string;
  minLimit: number;
  maxLimit: number;
  availableXena: number;
  paymentMethods?: string[];
  paymentMethod?: string;
  responseTimeMinutes?: number;
  isOnline?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'security' | 'transaction' | 'system' | 'market';
}

export interface MarketNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  category: 'Ecosystem' | 'Market' | 'DeFi' | 'Technology' | 'Regulation';
  sentiment: 'Bullish' | 'Neutral' | 'Bearish';
  readTime: string;
  url?: string;
  isHot?: boolean;
}
