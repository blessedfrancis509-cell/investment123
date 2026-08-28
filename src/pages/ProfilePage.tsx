import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Wallet,
  Lock,
  Smartphone,
  Key,
  Globe,
  LogOut,
  Plus,
  Trash2,
  Check,
  Copy,
  QrCode,
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  Shield,
  Bell,
  RefreshCw,
  Eye,
  EyeOff,
  Sliders,
  DollarSign,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRightLeft,
  Share2,
  Users,
  Award,
  Download,
  FileText,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Edit3,
  BadgePercent,
  TrendingUp,
  CreditCard,
  KeyRound,
  Power,
  Wrench,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, UserBalances } from '../types';
import { XenaTokenBadge } from '../components/XenaLogo';

interface ProfilePageProps {
  user: UserProfile;
  balances: UserBalances;
  onUpdateSecurity: (settings: { twoFactor: boolean; pinSet: boolean }) => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenSend: () => void;
  onOpenReceive: () => void;
  onSelectTab: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  balances,
  onUpdateSecurity,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenSend,
  onOpenReceive,
  onSelectTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'security' | 'api' | 'wallet' | 'kyc' | 'referrals' | 'statements' | 'preferences'
  >('overview');

  // Profile Edit State
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [avatarGradient, setAvatarGradient] = useState<string>('from-[#5B21B6] via-[#7C3AED] to-[#A855F7]');

  // Security Sub-states
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [pinSet, setPinSet] = useState(user.pinSet);
  const [antiPhishingCode, setAntiPhishingCode] = useState('XENA-SECURE-99');
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [strictWhitelistOnly, setStrictWhitelistOnly] = useState(true);
  const [isEmergencyLocked, setIsEmergencyLocked] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Active Sessions
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Chrome on macOS (Current Device)', ip: '192.168.1.42', location: 'San Francisco, US', current: true },
    { id: '2', device: 'XENA Mobile App on iPhone 15 Pro', ip: '172.56.21.9', location: 'San Francisco, US', current: false },
    { id: '3', device: 'Firefox on Linux', ip: '104.28.19.88', location: 'London, UK', current: false },
  ]);

  // Wallet Sub-states & Address Book
  const [whitelistAddresses, setWhitelistAddresses] = useState([
    { id: '1', label: 'Hardware Ledger Nano X', address: '0x8A79c45b736b47D93bC8419D7bF892', network: 'XENA Network' },
    { id: '2', label: 'Cold Storage Vault (Trezor)', address: '0x4F129aE785C04921F38491c6eA31d4', network: 'Ethereum (ERC-20)' },
    { id: '3', label: 'Phantom Solana Vault', address: '8xK19yM...qP9L', network: 'Solana Native' },
  ]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNetwork, setNewNetwork] = useState('XENA Network');
  const [copiedAddressId, setCopiedAddressId] = useState<string | null>(null);

  // Connected Web3 Wallets
  const [connectedWallets, setConnectedWallets] = useState([
    { id: 'metamask', name: 'MetaMask', address: '0x71c8...c741', status: 'Connected', icon: '🦊' },
    { id: 'phantom', name: 'Phantom', address: '4jK9...88aQ', status: 'Connected', icon: '👻' },
    { id: 'ledger', name: 'Ledger Hardware', address: '0x39a1...10eB', status: 'Standby', icon: '🛡️' },
  ]);

  // API Keys & Trading Bots
  const [apiKeys, setApiKeys] = useState([
    {
      id: 'api-1',
      name: 'Spot Trading Bot',
      accessKey: 'XN-8F2K9Q1Z',
      secret: 'xn9fK2qZ8vB4rT7wL1pM6cD3sH5',
      permissions: ['Read', 'Spot Trade'],
      ipWhitelist: '192.168.1.0/24',
      enabled: true,
      createdAt: 'Jan 12, 2026',
      lastUsed: '2 min ago',
    },
    {
      id: 'api-2',
      name: 'Yield Monitor (Read-Only)',
      accessKey: 'XN-1A7M3BS9',
      secret: 'xn1a7m3bS9kR4tQ2wZ6eF8gH0j',
      permissions: ['Read'],
      ipWhitelist: 'All IPs',
      enabled: true,
      createdAt: 'Mar 3, 2026',
      lastUsed: '1 hour ago',
    },
  ]);
  const [showCreateApiModal, setShowCreateApiModal] = useState(false);
  const [apiName, setApiName] = useState('');
  const [apiPermissions, setApiPermissions] = useState<Record<string, boolean>>({
    Read: true,
    'Spot Trade': false,
    P2P: false,
    Withdrawals: false,
  });
  const [apiIpWhitelist, setApiIpWhitelist] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<{ name: string; accessKey: string; secret: string } | null>(null);
  const [revealedSecretId, setRevealedSecretId] = useState<string | null>(null);

  // Selected Network for Deposit QR
  const [selectedDepositNetwork, setSelectedDepositNetwork] = useState<'XENA' | 'USDT' | 'BTC' | 'ETH' | 'SOL'>('XENA');
  const [showDepositQrModal, setShowDepositQrModal] = useState(false);

  // KYC Tier Upgrade State
  const [currentKycTier, setCurrentKycTier] = useState<'Tier 1' | 'Tier 2' | 'Tier 3 (Institutional)'>(
    user.kycTier === 'Tier 2' ? 'Tier 2' : 'Tier 1'
  );
  const [kycUpgradePending, setKycUpgradePending] = useState(false);
  const [showKycUpgradeModal, setShowKycUpgradeModal] = useState(false);

  // Referral State
  const referralCode = 'XENA-VIP-8829';
  const referralLink = `https://xena.network/join?ref=${referralCode}`;
  const [referralStats, setReferralStats] = useState({
    totalInvited: 18,
    activeStakers: 12,
    totalEarnedXena: 145.8,
    unclaimedXena: 34.2,
    tier: 'Gold Ambassador (20% Commission)',
  });
  const [referralsList] = useState([
    { id: '1', user: 'CryptoK***@gmail.com', joined: '2 days ago', staked: '$2,400 USD', reward: '+18.4 XENA', status: 'Active' },
    { id: '2', user: 'Alex.T***@outlook.com', joined: '5 days ago', staked: '$5,000 USD', reward: '+38.5 XENA', status: 'Active' },
    { id: '3', user: '0x8892...f7a1', joined: '1 week ago', staked: '$1,200 USD', reward: '+9.2 XENA', status: 'Active' },
    { id: '4', user: 'Elena_V***@proton.me', joined: '2 weeks ago', staked: '$800 USD', reward: '+6.1 XENA', status: 'Active' },
  ]);

  // Tax & Statement Exporter State
  const [statementYear, setStatementYear] = useState('2026');
  const [statementMonth, setStatementMonth] = useState('All Year');
  const [statementFormat, setStatementFormat] = useState<'CSV' | 'PDF'>('PDF');
  const [statementDownloaded, setStatementDownloaded] = useState(false);

  // Preferences
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [tradeNotifications, setTradeNotifications] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);

  const totalXenaAmount = balances.totalXena ?? balances.totalBalance ?? (balances.availableXena + balances.investedXena);
  const totalFiat = totalXenaAmount * balances.usdRate;
  const spotFiat = balances.availableXena * balances.usdRate;
  const investedFiat = balances.investedXena * balances.usdRate;

  // Account Completion Checklist
  const completionItems = [
    { label: 'Email address verified', done: true, tab: 'security' as const, icon: Mail },
    { label: 'Phone number verified', done: true, tab: 'security' as const, icon: Smartphone },
    { label: 'Two-Factor Authentication enabled', done: twoFactor, tab: 'security' as const, icon: ShieldCheck },
    { label: 'Security PIN configured', done: pinSet, tab: 'security' as const, icon: Lock },
    { label: 'Withdrawal address whitelisted', done: whitelistAddresses.length > 0, tab: 'wallet' as const, icon: Wallet },
    { label: 'Identity verified (KYC Level 2+)', done: currentKycTier !== 'Tier 1', tab: 'kyc' as const, icon: Shield },
    { label: 'API key created for automation', done: apiKeys.length > 0, tab: 'api' as const, icon: KeyRound },
  ];
  const completionPct = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  const cryptoAssets = [
    {
      symbol: 'XENA',
      name: 'Xena Token',
      network: 'XENA Network',
      balance: balances.availableXena,
      price: balances.currentPrice,
      value: spotFiat,
      depositAddress: '0x71c89f92d7a224a51e6074de30e0ef18d9b1c741',
      change: '+12.4%',
      isNative: true,
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      network: 'TRC-20 / ERC-20',
      balance: 1450.00,
      price: 1.00,
      value: 1450.00,
      depositAddress: 'TXn87wK9...3bL20',
      change: '+0.01%',
      isNative: false,
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      network: 'Native SegWit',
      balance: 0.1245,
      price: 94800.00,
      value: 11802.60,
      depositAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      change: '+3.2%',
      isNative: false,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      network: 'ERC-20',
      balance: 1.45,
      price: 3450.00,
      value: 5002.50,
      depositAddress: '0x8A79c45b736b47D93bC8419D7bF892A847',
      change: '+4.8%',
      isNative: false,
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      network: 'Solana Native',
      balance: 14.8,
      price: 188.40,
      value: 2788.32,
      depositAddress: '8xK19yMQp9L...zR38w',
      change: '+8.1%',
      isNative: false,
    },
  ];

  const handleToggle2FA = () => {
    const next = !twoFactor;
    setTwoFactor(next);
    onUpdateSecurity({ twoFactor: next, pinSet });
    setSavedNotice(next ? 'Two-Factor Authentication (2FA) is now enabled.' : '2FA has been disabled.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleTogglePIN = () => {
    const next = !pinSet;
    setPinSet(next);
    onUpdateSecurity({ twoFactor, pinSet: next });
    setSavedNotice(next ? '6-Digit Security PIN protection enabled.' : 'Security PIN removed.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleSaveAntiPhishing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    setAntiPhishingCode(newCode);
    setIsEditingCode(false);
    setNewCode('');
    setSavedNotice('Anti-phishing security phrase updated.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setSavedNotice('Session revoked and logged out successfully.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleAddWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newAddress) return;
    setWhitelistAddresses((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        label: newLabel,
        address: newAddress,
        network: newNetwork,
      },
    ]);
    setNewLabel('');
    setNewAddress('');
    setShowAddAddress(false);
    setSavedNotice('New withdrawal whitelist destination saved securely.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleDeleteWhitelist = (id: string) => {
    setWhitelistAddresses((prev) => prev.filter((a) => a.id !== id));
    setSavedNotice('Whitelist entry deleted.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddressId(id);
    setTimeout(() => setCopiedAddressId(null), 2000);
  };

  const handleToggleWalletConnect = (id: string) => {
    setConnectedWallets((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === 'Connected' ? 'Disconnected' : 'Connected' }
          : w
      )
    );
    setSavedNotice('Web3 wallet connection status updated.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiName.trim()) return;
    const perms = Object.keys(apiPermissions).filter((p) => apiPermissions[p]);
    if (perms.length === 0) {
      setSavedNotice('Select at least one permission for your API key.');
      setTimeout(() => setSavedNotice(null), 3000);
      return;
    }
    const accessKey = `XN-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const secret = `xn${Math.random().toString(36).slice(2, 12)}${Math.random().toString(36).slice(2, 8)}`;
    const newKey = {
      id: `api-${Date.now()}`,
      name: apiName.trim(),
      accessKey,
      secret,
      permissions: perms,
      ipWhitelist: apiIpWhitelist.trim() || 'All IPs',
      enabled: true,
      createdAt: 'Just now',
      lastUsed: 'Never',
    };
    setApiKeys((prev) => [newKey, ...prev]);
    setShowCreateApiModal(false);
    setApiName('');
    setApiPermissions({ Read: true, 'Spot Trade': false, P2P: false, Withdrawals: false });
    setApiIpWhitelist('');
    setNewlyCreatedKey({ name: newKey.name, accessKey: newKey.accessKey, secret: newKey.secret });
  };

  const handleToggleApiKey = (id: string) => {
    setApiKeys((prev) =>
      prev.map((k) =>
        k.id === id ? { ...k, enabled: !k.enabled, lastUsed: !k.enabled ? 'Just now' : k.lastUsed } : k
      )
    );
    setSavedNotice('API key status updated.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    setSavedNotice('API key revoked and deleted permanently.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleClaimReferralRewards = () => {
    if (referralStats.unclaimedXena <= 0) return;
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#A855F7', '#10B981'],
      });
    } catch {}
    setReferralStats((prev) => ({
      ...prev,
      totalEarnedXena: +(prev.totalEarnedXena + prev.unclaimedXena).toFixed(2),
      unclaimedXena: 0,
    }));
    setSavedNotice('Successfully claimed affiliate commissions directly to spot balance!');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleDownloadStatement = () => {
    setStatementDownloaded(true);
    setSavedNotice(`Generating and downloading ${statementFormat} official account statement for ${statementMonth} ${statementYear}...`);
    setTimeout(() => {
      setStatementDownloaded(false);
      setSavedNotice(null);
    }, 4000);
  };

  const handleSimulateKycUpgrade = () => {
    setKycUpgradePending(true);
    setTimeout(() => {
      setKycUpgradePending(false);
      setCurrentKycTier('Tier 3 (Institutional)');
      setShowKycUpgradeModal(false);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#7C3AED', '#10B981', '#3B82F6'],
        });
      } catch {}
      setSavedNotice('Congratulations! Your Tier 3 Institutional Verification is now active with unlimited withdrawal limits.');
      setTimeout(() => setSavedNotice(null), 4000);
    }, 2000);
  };

  const handleEmergencyLockdown = () => {
    setIsEmergencyLocked(true);
    setShowFreezeModal(false);
    setSavedNotice('EMERGENCY LOCKDOWN ACTIVATED: All withdrawals and API keys are frozen until identity re-verification.');
    setTimeout(() => setSavedNotice(null), 5000);
  };

  const handleUnlockAccount = () => {
    setIsEmergencyLocked(false);
    setSavedNotice('Security lockdown lifted. Account restored to normal operation.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-8 animate-fade-in" id="profile-page-view">
      {/* Emergency Freeze Banner if Active */}
      {isEmergencyLocked && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-red-950">Account Emergency Lockdown Active</h4>
              <p className="text-xs text-red-700">Withdrawals, transfers, and API keys are temporarily suspended for protection.</p>
            </div>
          </div>
          <button
            onClick={handleUnlockAccount}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Unlock with 2FA Passcode
          </button>
        </div>
      )}

      {/* 1. Profile Header Hero Card */}
      <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* User Identity Info */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative group">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${avatarGradient} text-white flex items-center justify-center font-extrabold text-2xl shadow-md transition-transform group-hover:scale-105`}>
                {userName.split(' ').map((n) => n[0]).join('')}
              </div>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="absolute -bottom-1 -right-1 p-1.5 bg-[#6D28D9] text-white rounded-full ring-4 ring-white shadow-xs hover:bg-[#5B21B6] transition-colors cursor-pointer"
                title="Edit Profile & Avatar"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717]">
                  {userName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-bold border border-emerald-100 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {currentKycTier}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6D28D9] text-xs font-bold border border-purple-100 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Gold Partner
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                <span>Email: <strong className="text-[#171717]">{userEmail}</strong></span>
                <span>•</span>
                <span>User ID: <strong className="text-[#6D28D9] font-mono">{user.xenaId}</strong></span>
                <span>•</span>
                <span>Affiliate Ref: <strong className="text-[#171717] font-mono">{referralCode}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Balance & Security Rating Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3.5 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE] text-left">
              <span className="text-[10px] uppercase font-bold text-[#6B7280] block">Total Portfolio</span>
              <span className="text-base font-extrabold text-[#171717] font-mono">
                ${totalFiat.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </span>
              <span className="text-[10px] text-[#6D28D9] block font-bold">
                {totalXenaAmount.toLocaleString()} XENA
              </span>
            </div>

            <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-[#7C3AED] flex items-center justify-center text-[#7C3AED] font-extrabold text-xs font-mono shadow-xs">
                98%
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6B7280] block">Security Score</span>
                <span className="text-xs font-bold text-[#16A34A] block">SOC-2 Shielded</span>
              </div>
            </div>

            <button
              onClick={() => setShowFreezeModal(true)}
              className="p-3.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Emergency 1-Click Lockdown"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency Freeze</span>
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-[#16A34A] flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{savedNotice}</span>
          </div>
        )}
      </div>

      {/* 2. Navigation Tabs for Profile Sections */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#EDE9FE]">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'security', label: 'Security & Auth', icon: ShieldCheck },
          { id: 'api', label: 'API Keys', icon: KeyRound },
          { id: 'wallet', label: 'Wallet & Addresses', icon: Wallet },
          { id: 'kyc', label: 'KYC & Limits', icon: Shield },
          { id: 'referrals', label: 'Affiliate & Referrals', icon: Users },
          { id: 'statements', label: 'Tax & Statements', icon: FileText },
          { id: 'preferences', label: 'Preferences', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#6D28D9] text-white shadow-xs'
                  : 'bg-white text-[#6B7280] hover:text-[#171717] border border-[#EDE9FE]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB A: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* KYC & Identity Limits Card */}
            <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6D28D9] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#171717]">Identity & KYC Level</h3>
                </div>
                <button
                  onClick={() => setActiveSubTab('kyc')}
                  className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-bold border border-emerald-100 hover:bg-emerald-100 cursor-pointer"
                >
                  {currentKycTier}
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Daily Withdrawal Limit:</span>
                  <span className="font-bold text-[#171717] font-mono">
                    {currentKycTier === 'Tier 3 (Institutional)' ? 'Unlimited USD / 24h' : '$100,000 USD / 24h'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Crypto Deposit Limits:</span>
                  <span className="font-bold text-[#16A34A]">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">P2P Trading Access:</span>
                  <span className="font-bold text-[#16A34A]">Active & Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Government ID Status:</span>
                  <span className="font-bold text-[#171717]">Passport & Liveness (Approved)</span>
                </div>
              </div>
            </div>

            {/* Quick Balance Breakdown Card */}
            <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6D28D9] flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#171717]">Balance Distribution</h3>
                </div>
                <button
                  onClick={() => setActiveSubTab('wallet')}
                  className="text-xs font-bold text-[#6D28D9] hover:underline cursor-pointer"
                >
                  Manage
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Spot Liquid Funds:</span>
                  <span className="font-bold text-[#171717] font-mono">${spotFiat.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Staked In Yield Vaults:</span>
                  <span className="font-bold text-[#6D28D9] font-mono">${investedFiat.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Active Staking Plans:</span>
                  <span className="font-bold text-[#16A34A]">4 Plans Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">XENA Unit Price:</span>
                  <span className="font-bold text-[#171717] font-mono">${balances.currentPrice.toFixed(4)}</span>
                </div>
              </div>
            </div>

            {/* Account Quick Actions */}
            <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#171717] mb-1">Quick Shortcuts</h3>
                <p className="text-xs text-[#6B7280] mb-3">Instant access to primary account operations</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onOpenDeposit}
                    className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6D28D9] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>Deposit</span>
                  </button>
                  <button
                    onClick={onOpenWithdraw}
                    className="py-2.5 px-3 rounded-xl bg-[#F8F7FC] hover:bg-[#EDE9FE] text-[#171717] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Withdraw</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab('referrals')}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 col-span-2 cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Invite Friends & Earn 20%</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Completion & Security Checklist */}
          <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE9FE]">
              <div>
                <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#6D28D9]" /> Account Completion & Security Checklist
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Strengthen your account to unlock higher limits and faster withdrawals</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-11 h-11 rounded-full bg-purple-50 border-2 border-[#7C3AED] flex items-center justify-center text-[#6D28D9] font-extrabold text-xs font-mono">
                  {completionPct}%
                </div>
                <div className="w-28">
                  <div className="h-1.5 bg-[#F8F7FC] rounded-full overflow-hidden border border-[#EDE9FE]">
                    <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-full transition-all" style={{ width: `${completionPct}%` }} />
                  </div>
                  <span className="text-[10px] text-[#6B7280] font-semibold">
                    {completionItems.filter((i) => i.done).length}/{completionItems.length} completed
                  </span>
                </div>
                {completionPct < 100 && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                    {completionItems.length - completionItems.filter((i) => i.done).length} to go
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-4">
              {completionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveSubTab(item.tab)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      item.done
                        ? 'bg-[#F8F7FC] border-[#EDE9FE] hover:border-emerald-200'
                        : 'bg-amber-50/40 border-dashed border-amber-300/70 hover:bg-amber-50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      item.done ? 'bg-emerald-50 text-[#16A34A] border border-emerald-100' : 'bg-white text-amber-500 border border-amber-200'
                    }`}>
                      {item.done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
                    </span>
                    <span className={`text-[11px] font-bold flex-1 ${item.done ? 'text-[#6B7280] line-through decoration-[#9CA3AF]/50' : 'text-[#171717]'}`}>
                      {item.label}
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#9CA3AF]" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB B: SECURITY MENU */}
      {activeSubTab === 'security' && (
        <div className="space-y-6 animate-fade-in">
          {/* Security Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 2FA Authenticator */}
            <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#171717]">Two-Factor Authentication (2FA)</h3>
                      <p className="text-xs text-[#6B7280]">Google Authenticator / Authy / TOTP App</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      twoFactor ? 'bg-emerald-50 text-[#16A34A] border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}
                  >
                    {twoFactor ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Mandatory for all crypto withdrawals, P2P release confirmations, and sensitive account modifications.
                </p>
              </div>

              <div className="pt-3 border-t border-[#EDE9FE] flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">Protection Status: {twoFactor ? 'Enforced' : 'Off'}</span>
                <button
                  onClick={handleToggle2FA}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    twoFactor
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white hover:opacity-90 shadow-xs'
                  }`}
                >
                  {twoFactor ? 'Disable 2FA' : 'Enable 2FA Protection'}
                </button>
              </div>
            </div>

            {/* 6-Digit PIN */}
            <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#171717]">Quick Trading & Withdrawal PIN</h3>
                      <p className="text-xs text-[#6B7280]">Biometric & 6-digit cryptographic passcode</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      pinSet ? 'bg-emerald-50 text-[#16A34A] border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}
                  >
                    {pinSet ? 'Configured' : 'Not Set'}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Used for rapid authorization on mobile devices without requiring repetitive email OTP codes.
                </p>
              </div>

              <div className="pt-3 border-t border-[#EDE9FE] flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">Hardware PIN: {pinSet ? 'Active' : 'Unset'}</span>
                <button
                  onClick={handleTogglePIN}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F8F7FC] hover:bg-[#EDE9FE] text-[#171717] border border-[#EDE9FE] transition-colors cursor-pointer"
                >
                  {pinSet ? 'Change PIN' : 'Setup 6-Digit PIN'}
                </button>
              </div>
            </div>

            {/* Anti-Phishing Security Phrase */}
            <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#171717]">Anti-Phishing Anti-Spoof Code</h3>
                    <p className="text-xs text-[#6B7280]">Embedded in all official XENA system emails</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#6B7280]">
                Current Anti-Phishing Code: <strong className="text-[#6D28D9] font-mono bg-purple-50 px-2 py-0.5 rounded border border-purple-100">{antiPhishingCode}</strong>
              </p>

              {isEditingCode ? (
                <form onSubmit={handleSaveAntiPhishing} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter new code..."
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="flex-1 bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-1.5 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#6D28D9] text-white text-xs font-bold cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingCode(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsEditingCode(true)}
                  className="px-4 py-2 rounded-xl bg-[#F8F7FC] hover:bg-[#EDE9FE] text-[#171717] text-xs font-bold border border-[#EDE9FE] cursor-pointer"
                >
                  Update Phrase
                </button>
              )}
            </div>

            {/* Strict Whitelist Only Policy */}
            <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#171717]">Strict Address Whitelist Mode</h3>
                      <p className="text-xs text-[#6B7280]">Block withdrawals to unregistered addresses</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={strictWhitelistOnly}
                    onChange={(e) => setStrictWhitelistOnly(e.target.checked)}
                    className="w-5 h-5 accent-[#6D28D9] cursor-pointer"
                  />
                </div>
                <p className="text-xs text-[#6B7280]">
                  When active, withdrawals can ONLY be dispatched to addresses previously saved and locked in your Address Book.
                </p>
              </div>

              <div className="pt-3 border-t border-[#EDE9FE] text-xs text-[#16A34A] font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>24-hour cooling period enforced for new addresses</span>
              </div>
            </div>
          </div>

          {/* Active Logged-in Devices & Sessions */}
          <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div>
                <h3 className="text-sm font-bold text-[#171717]">Active Login Sessions & Devices</h3>
                <p className="text-xs text-[#6B7280]">Devices currently authorized to access your XENA account</p>
              </div>
              <button
                onClick={() => {
                  setSessions((prev) => prev.filter((s) => s.current));
                  setSavedNotice('All other background sessions have been logged out.');
                  setTimeout(() => setSavedNotice(null), 3000);
                }}
                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Revoke All Others
              </button>
            </div>

            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE] gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white text-[#6D28D9] border border-[#EDE9FE] flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#171717]">{session.device}</span>
                        {session.current && (
                          <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-100">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        IP: {session.ip} • Location: {session.location}
                      </div>
                    </div>
                  </div>

                  {!session.current && (
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      className="self-end sm:self-auto px-3 py-1 rounded-lg text-xs font-bold text-red-600 bg-white hover:bg-red-50 border border-red-100 transition-colors cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB C: API KEYS & TRADING BOTS */}
      {activeSubTab === 'api' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white flex items-center justify-center shadow-sm">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#171717]">API Key Management</h3>
                <p className="text-xs text-[#6B7280]">Connect trading bots, portfolio trackers, and institutional systems securely.</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateApiModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-xs hover:shadow-[0_4px_16px_rgba(109,40,217,0.3)] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Create API Key
            </button>
          </div>

          {/* API Keys List */}
          <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div>
                <h3 className="text-sm font-bold text-[#171717]">Your API Keys</h3>
                <p className="text-xs text-[#6B7280]">{apiKeys.length} active key{apiKeys.length !== 1 ? 's' : ''} registered</p>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" /> 2FA Required for Creation
              </span>
            </div>

            {apiKeys.length === 0 && (
              <div className="p-8 text-center text-xs text-[#6B7280] bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE]">
                <KeyRound className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                No API keys yet. Create your first key to automate trading or sync your portfolio.
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="p-4 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${key.enabled ? 'bg-purple-50 text-[#6D28D9]' : 'bg-slate-100 text-slate-400'} flex items-center justify-center border ${key.enabled ? 'border-purple-100' : 'border-[#EDE9FE]'}`}>
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#171717]">{key.name}</span>
                          <span className={`px-2 py-0.3 rounded-full text-[10px] font-bold ${
                            key.enabled ? 'bg-emerald-50 text-[#16A34A] border border-emerald-100' : 'bg-slate-100 text-[#6B7280] border border-[#EDE9FE]'
                          }`}>
                            {key.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#6B7280] font-mono">Access Key: <strong className="text-[#171717]">{key.accessKey}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          if (revealedSecretId === key.id) {
                            setRevealedSecretId(null);
                          } else {
                            setRevealedSecretId(key.id);
                            setSavedNotice('API secret revealed. Never share this value with anyone.');
                            setTimeout(() => setSavedNotice(null), 3000);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                          revealedSecretId === key.id
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-white text-[#6B7280] border border-[#EDE9FE] hover:text-[#171717]'
                        }`}
                      >
                        {revealedSecretId === key.id ? 'Hide Secret' : 'View Secret'}
                      </button>
                      <button
                        onClick={() => handleCopyText(key.accessKey, `key-${key.id}`)}
                        className="p-2 rounded-lg bg-white text-[#6D28D9] border border-[#EDE9FE] hover:bg-purple-50 transition-colors cursor-pointer"
                        title="Copy Access Key"
                      >
                        {copiedAddressId === `key-${key.id}` ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleToggleApiKey(key.id)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          key.enabled
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-[#16A34A] border border-emerald-100 hover:bg-emerald-100'
                        }`}
                      >
                        <Power className="w-3 h-3" /> {key.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDeleteApiKey(key.id)}
                        className="p-2 rounded-lg bg-white text-red-600 border border-red-100 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete API Key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {revealedSecretId === key.id && (
                    <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between gap-2 text-[11px] animate-fade-in">
                      <code className="font-mono font-bold text-amber-800 truncate">{key.secret}</code>
                      <button
                        onClick={() => handleCopyText(key.secret, `secret-${key.id}`)}
                        className="p-1.5 rounded-lg bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedAddressId === `secret-${key.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#6B7280]">
                    {key.permissions.map((perm) => (
                      <span key={perm} className={`px-2 py-0.5 rounded-full font-bold border ${
                        perm === 'Withdrawals' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-purple-50 text-[#6D28D9] border-purple-100'
                      }`}>
                        {perm}
                      </span>
                    ))}
                    <span className="ml-auto flex items-center gap-3">
                      <span>IP: <strong className="text-[#171717] font-mono">{key.ipWhitelist}</strong></span>
                      <span>Created: <strong className="text-[#171717]">{key.createdAt}</strong></span>
                      <span>Last used: <strong className="text-[#171717]">{key.lastUsed}</strong></span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-white border border-[#EDE9FE] rounded-[24px] shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              <strong className="text-[#171717]">API secrets are shown only once at creation and can never be recovered.</strong>{' '}
              Attach an IP whitelist to restrict use to your servers. Withdrawal permissions are blocked by default and require
              a separate 2FA confirmation for every withdrawal request.
            </p>
          </div>
        </div>
      )}

      {/* TAB D: WALLET & ADDRESSES */}
      {activeSubTab === 'wallet' && (
        <div className="space-y-6 animate-fade-in">
          {/* Multi-Chain Asset Balances Table */}
          <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDE9FE]">
              <div>
                <h3 className="text-sm font-bold text-[#171717]">Multi-Chain Crypto Assets</h3>
                <p className="text-xs text-[#6B7280]">Balances across native Xena chain and cross-chain bridges</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDepositQrModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6D28D9] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Receive Address QR</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cryptoAssets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="p-4 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE] flex flex-col justify-between gap-3 hover:border-purple-200 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-white border border-[#EDE9FE] flex items-center justify-center font-extrabold text-xs text-[#6D28D9]">
                          {asset.symbol[0]}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-[#171717]">{asset.symbol}</span>
                          <span className="text-[10px] text-[#6B7280] block">{asset.name}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#16A34A]">{asset.change}</span>
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="text-base font-extrabold text-[#171717] font-mono">
                        {asset.balance.toLocaleString()} {asset.symbol}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        ≈ ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EDE9FE] flex items-center justify-between">
                    <button
                      onClick={() => handleCopyText(asset.depositAddress, asset.symbol)}
                      className="text-[11px] font-bold text-[#6D28D9] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedAddressId === asset.symbol ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAddressId === asset.symbol ? 'Copied' : 'Copy Address'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedDepositNetwork(asset.symbol as any);
                        setShowDepositQrModal(true);
                      }}
                      className="text-[11px] font-bold text-[#6B7280] hover:text-[#171717] flex items-center gap-1 cursor-pointer"
                    >
                      <QrCode className="w-3 h-3" />
                      <span>QR Code</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Web3 External Wallets */}
          <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div>
                <h3 className="text-sm font-bold text-[#171717]">Connected Web3 Wallets</h3>
                <p className="text-xs text-[#6B7280]">Authorize decentralized dApps and hardware signers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {connectedWallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="p-4 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{wallet.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#171717]">{wallet.name}</h4>
                      <p className="text-[10px] text-[#6B7280] font-mono">{wallet.address}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleWalletConnect(wallet.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      wallet.status === 'Connected'
                        ? 'bg-emerald-50 text-[#16A34A] border border-emerald-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100'
                        : 'bg-white text-[#6B7280] border border-[#EDE9FE] hover:text-[#171717]'
                    }`}
                  >
                    {wallet.status === 'Connected' ? 'Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Withdrawal Whitelist Addresses */}
          <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div>
                <h3 className="text-sm font-bold text-[#171717]">Saved Withdrawal Whitelist</h3>
                <p className="text-xs text-[#6B7280]">Approved destination addresses for fast & secure transfers</p>
              </div>

              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="px-3 py-1.5 rounded-xl bg-[#6D28D9] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#5B21B6] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {showAddAddress && (
              <form onSubmit={handleAddWhitelist} className="p-4 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE] space-y-3 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#6B7280] block mb-1">Label / Device Name</label>
                    <input
                      type="text"
                      placeholder="e.g. My Ledger Cold Storage"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      required
                      className="w-full bg-white border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#6B7280] block mb-1">Network</label>
                    <select
                      value={newNetwork}
                      onChange={(e) => setNewNetwork(e.target.value)}
                      className="w-full bg-white border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    >
                      <option value="XENA Network">XENA Network (Native)</option>
                      <option value="Ethereum (ERC-20)">Ethereum (ERC-20)</option>
                      <option value="TRC-20 (Tron)">TRC-20 (Tron)</option>
                      <option value="Solana Native">Solana Native</option>
                      <option value="Bitcoin Native">Bitcoin Native</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#6B7280] block mb-1">Recipient Address</label>
                    <input
                      type="text"
                      placeholder="0x... or bc1..."
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      required
                      className="w-full bg-white border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs text-[#171717] font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-4 py-1.5 rounded-xl bg-white border border-[#EDE9FE] text-xs font-bold text-[#6B7280] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#6D28D9] text-white text-xs font-bold cursor-pointer"
                  >
                    Save to Whitelist
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {whitelistAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3.5 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#171717]">{addr.label}</span>
                      <span className="text-[10px] text-[#6D28D9] bg-purple-50 px-2 py-0.2 rounded-full border border-purple-100 font-bold">
                        {addr.network}
                      </span>
                    </div>
                    <span className="text-xs text-[#6B7280] font-mono mt-0.5 block truncate max-w-md">
                      {addr.address}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleCopyText(addr.address, addr.id)}
                      className="p-1.5 rounded-lg bg-white hover:bg-[#EDE9FE] text-[#6D28D9] border border-[#EDE9FE] cursor-pointer"
                      title="Copy Address"
                    >
                      {copiedAddressId === addr.id ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteWhitelist(addr.id)}
                      className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-red-100 cursor-pointer"
                      title="Delete Whitelist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB D: KYC & LIMITS HUB */}
      {activeSubTab === 'kyc' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-bold border border-emerald-100">
                  Current: {currentKycTier}
                </span>
                <span className="text-xs text-[#6B7280]">ID & Biometrics Verified</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#171717] mt-1">Identity & Limits Tier Matrix</h3>
              <p className="text-xs text-[#6B7280]">Unlock higher daily withdrawal limits, OTC desk access, and priority settlement.</p>
            </div>

            {currentKycTier !== 'Tier 3 (Institutional)' && (
              <button
                onClick={() => setShowKycUpgradeModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-xs hover:opacity-95 transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>Upgrade to Tier 3</span>
              </button>
            )}
          </div>

          {/* Tier Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tier 1 */}
            <div className="p-5 rounded-[22px] bg-[#F8F7FC] border border-[#EDE9FE] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                <h4 className="font-extrabold text-sm text-[#171717]">Tier 1 (Basic)</h4>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Completed</span>
              </div>
              <ul className="space-y-2 text-xs text-[#4B5563]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Email & Phone verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Daily limit: $2,000 USD</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>P2P Trading Access</span>
                </li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="p-5 rounded-[22px] bg-purple-50/40 border border-purple-200 space-y-4 relative">
              <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-[#6D28D9] text-white text-[10px] font-bold rounded-full shadow-2xs">
                Active Tier
              </span>
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <h4 className="font-extrabold text-sm text-[#6D28D9]">Tier 2 (Verified Standard)</h4>
                <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Current</span>
              </div>
              <ul className="space-y-2 text-xs text-[#171717]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Government Photo ID + Facial Liveness</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Daily limit: <strong>$100,000 USD / 24h</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Staking & Yield Vaults unlocked</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Full P2P Merchant privileges</span>
                </li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="p-5 rounded-[22px] bg-gradient-to-b from-purple-50/60 to-white border border-purple-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                <h4 className="font-extrabold text-sm text-[#171717] flex items-center gap-1.5">
                  <span>Tier 3 (Institutional)</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </h4>
                {currentKycTier === 'Tier 3 (Institutional)' ? (
                  <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                ) : (
                  <span className="text-[10px] font-bold text-[#6D28D9] bg-purple-100 px-2 py-0.5 rounded-full">Available</span>
                )}
              </div>
              <ul className="space-y-2 text-xs text-[#4B5563]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <span>Proof of Address & Source of Funds</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <span><strong>Unlimited Daily Withdrawals</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <span>Dedicated OTC Institutional Concierge</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <span>Zero Maker Trading Fee Discount</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB E: AFFILIATE & REFERRALS HUB */}
      {activeSubTab === 'referrals' && (
        <div className="space-y-6 animate-fade-in">
          {/* Hero Banner & Rewards Claim */}
          <div className="bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#A855F7] text-white rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold backdrop-blur-xs">
                  {referralStats.tier}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Earn 20% Lifetime Staking & Trade Commissions
                </h2>
                <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
                  Share your exclusive partner link. Whenever friends stake in yield vaults or trade on P2P, earn instant XENA rewards deposited straight to your wallet.
                </p>
              </div>

              {/* Unclaimed Rewards Box */}
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center sm:text-right shrink-0">
                <span className="text-[11px] text-purple-200 uppercase font-bold block">Unclaimed Commission</span>
                <div className="text-2xl font-black text-white font-mono my-1">
                  {referralStats.unclaimedXena} XENA
                </div>
                <button
                  onClick={handleClaimReferralRewards}
                  disabled={referralStats.unclaimedXena <= 0}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-white text-[#6D28D9] font-extrabold text-xs hover:bg-purple-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                >
                  Claim to Spot Wallet
                </button>
              </div>
            </div>

            {/* Referral Link & Code Share Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/15">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-purple-200">Your Referral Link</span>
                <div className="flex items-center bg-black/25 backdrop-blur-sm rounded-xl p-2 border border-white/15 text-xs font-mono">
                  <span className="truncate flex-1 text-white pr-2">{referralLink}</span>
                  <button
                    onClick={() => handleCopyText(referralLink, 'ref-link')}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  >
                    {copiedAddressId === 'ref-link' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-purple-200">Referral Code</span>
                <div className="flex items-center bg-black/25 backdrop-blur-sm rounded-xl p-2 border border-white/15 text-xs font-mono">
                  <span className="flex-1 font-bold text-white tracking-wider">{referralCode}</span>
                  <button
                    onClick={() => handleCopyText(referralCode, 'ref-code')}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  >
                    {copiedAddressId === 'ref-code' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#6B7280] block">Invited Friends</span>
              <span className="text-lg font-extrabold text-[#171717]">{referralStats.totalInvited} Traders</span>
            </div>
            <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#6B7280] block">Active Stakers</span>
              <span className="text-lg font-extrabold text-[#16A34A]">{referralStats.activeStakers} Active</span>
            </div>
            <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#6B7280] block">Total Commission Earned</span>
              <span className="text-lg font-extrabold text-[#6D28D9] font-mono">{referralStats.totalEarnedXena} XENA</span>
            </div>
            <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#6B7280] block">Commission Rate</span>
              <span className="text-lg font-extrabold text-[#171717]">20% Tier</span>
            </div>
          </div>

          {/* Invited Friends Ledger */}
          <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <h3 className="text-sm font-bold text-[#171717]">Recent Friend Activity & Payouts</h3>
              <span className="text-xs text-[#6B7280]">Auto-settled to spot wallet</span>
            </div>

            <div className="divide-y divide-[#EDE9FE]">
              {referralsList.map((ref) => (
                <div key={ref.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-[#6D28D9] font-bold flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-[#171717] block">{ref.user}</span>
                      <span className="text-[10px] text-[#6B7280]">Joined {ref.joined} • Staked: {ref.staked}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-[#16A34A] block">{ref.reward}</span>
                    <span className="text-[10px] text-[#6D28D9] font-semibold">{ref.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB F: TAX & ACCOUNT STATEMENTS */}
      {activeSubTab === 'statements' && (
        <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 sm:p-6 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h3 className="text-sm font-bold text-[#171717]">Financial & Tax Statements Exporter</h3>
            <p className="text-xs text-[#6B7280]">Generate official stamped trade history, staking yield records, and audit proofs for accounting.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE]">
            <div>
              <label className="text-[11px] font-bold text-[#6B7280] block mb-1">Fiscal Year</label>
              <select
                value={statementYear}
                onChange={(e) => setStatementYear(e.target.value)}
                className="w-full bg-white border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs font-bold text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              >
                <option value="2026">2026 (Current Fiscal Year)</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#6B7280] block mb-1">Period Range</label>
              <select
                value={statementMonth}
                onChange={(e) => setStatementMonth(e.target.value)}
                className="w-full bg-white border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs font-bold text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              >
                <option value="All Year">Entire Fiscal Year (12 Months)</option>
                <option value="Q1">Q1 (Jan - Mar)</option>
                <option value="Q2">Q2 (Apr - Jun)</option>
                <option value="Q3">Q3 (Jul - Sep)</option>
                <option value="Q4">Q4 (Oct - Dec)</option>
                <option value="Last 30 Days">Last 30 Days</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#6B7280] block mb-1">Document Format</label>
              <div className="flex bg-white rounded-xl border border-[#EDE9FE] p-1">
                {(['PDF', 'CSV'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setStatementFormat(fmt)}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                      statementFormat === fmt ? 'bg-[#6D28D9] text-white' : 'text-[#6B7280] hover:text-[#171717]'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-[#6B7280]">
              <span>Includes: Staking Yields, P2P Order Invoices, Spot Swaps, and Deposit/Withdrawal Hashes.</span>
            </div>

            <button
              onClick={handleDownloadStatement}
              disabled={statementDownloaded}
              className="px-5 py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{statementDownloaded ? 'Downloading...' : `Download ${statementFormat} Statement`}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB G: PREFERENCES */}
      {activeSubTab === 'preferences' && (
        <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 sm:p-6 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h3 className="text-sm font-bold text-[#171717]">Account Settings & Preferences</h3>
            <p className="text-xs text-[#6B7280]">Customize notifications, default display currency, and settlement alerts</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE]">
              <div>
                <h4 className="text-xs font-bold text-[#171717]">Display Currency</h4>
                <p className="text-[11px] text-[#6B7280]">All fiat approximations and portfolio values</p>
              </div>
              <div className="flex bg-white rounded-xl border border-[#EDE9FE] p-1">
                {(['USD', 'EUR', 'GBP'] as const).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => {
                      setCurrency(cur);
                      setSavedNotice(`Currency set to ${cur}`);
                      setTimeout(() => setSavedNotice(null), 2000);
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                      currency === cur ? 'bg-[#6D28D9] text-white' : 'text-[#6B7280] hover:text-[#171717]'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE]">
              <div>
                <h4 className="text-xs font-bold text-[#171717]">Email Security Alerts</h4>
                <p className="text-[11px] text-[#6B7280]">Receive instant email notices upon login or password change</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 accent-[#6D28D9] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE]">
              <div>
                <h4 className="text-xs font-bold text-[#171717]">Trade & Staking Yield Notifications</h4>
                <p className="text-[11px] text-[#6B7280]">Daily summary of staking yields earned from active vaults</p>
              </div>
              <input
                type="checkbox"
                checked={tradeNotifications}
                onChange={(e) => setTradeNotifications(e.target.checked)}
                className="w-5 h-5 accent-[#6D28D9] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE]">
              <div>
                <h4 className="text-xs font-bold text-[#171717]">Marketing & Ecosystem Announcements</h4>
                <p className="text-[11px] text-[#6B7280]">Receive new yield vault releases and market insights</p>
              </div>
              <input
                type="checkbox"
                checked={marketingUpdates}
                onChange={(e) => setMarketingUpdates(e.target.checked)}
                className="w-5 h-5 accent-[#6D28D9] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#EDE9FE] animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <h3 className="text-sm font-bold text-[#171717]">Edit Profile & Avatar</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="w-7 h-7 rounded-full bg-[#F8F7FC] hover:bg-[#EDE9FE] text-[#6B7280] font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#6B7280] block mb-1">Display Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs font-bold text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B7280] block mb-1">Contact Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs font-bold text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B7280] block mb-1.5">Avatar Style / Gradient</label>
                <div className="flex gap-2">
                  {[
                    'from-[#5B21B6] via-[#7C3AED] to-[#A855F7]',
                    'from-blue-600 via-indigo-600 to-purple-600',
                    'from-emerald-600 via-teal-600 to-cyan-600',
                    'from-amber-500 via-orange-600 to-rose-600',
                  ].map((grad) => (
                    <button
                      key={grad}
                      type="button"
                      onClick={() => setAvatarGradient(grad)}
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} cursor-pointer transition-transform ${
                        avatarGradient === grad ? 'ring-2 ring-[#6D28D9] scale-110' : 'opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#EDE9FE]">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsEditingProfile(false);
                  setSavedNotice('Profile updated successfully.');
                  setTimeout(() => setSavedNotice(null), 3000);
                }}
                className="px-5 py-2 rounded-xl bg-[#6D28D9] text-white font-bold text-xs hover:bg-[#5B21B6] transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Tier Upgrade Simulation Modal */}
      {showKycUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#EDE9FE] animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6D28D9]" />
                <h3 className="text-sm font-bold text-[#171717]">Upgrade to Tier 3 (Institutional)</h3>
              </div>
              <button
                onClick={() => setShowKycUpgradeModal(false)}
                className="w-7 h-7 rounded-full bg-[#F8F7FC] hover:bg-[#EDE9FE] text-[#6B7280] font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#6B7280]">
              Institutional Tier provides unlimited 24h withdrawals, OTC block trading access, and personalized account management.
            </p>

            <div className="space-y-2.5 p-3.5 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE] text-xs">
              <div className="flex items-center justify-between">
                <span>Proof of Residential Address:</span>
                <span className="text-[#16A34A] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Ready for Upload
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Source of Wealth Declaration:</span>
                <span className="text-[#16A34A] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Auto-Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Corporate/Entity Registration (Optional):</span>
                <span className="text-slate-500 font-semibold">Individual Track</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSimulateKycUpgrade}
                disabled={kycUpgradePending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-extrabold text-xs hover:opacity-95 transition-all shadow-xs cursor-pointer"
              >
                {kycUpgradePending ? 'Verifying Documents on Ledger...' : 'Submit & Activate Tier 3 Instantly'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Freeze Confirmation Modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-4 shadow-2xl border border-red-200 animate-scale-up">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-red-950">Confirm Emergency Lockdown?</h3>
                <p className="text-xs text-red-700">Immediate security containment</p>
              </div>
            </div>

            <p className="text-xs text-[#4B5563] leading-relaxed">
              If your device or email is compromised, activating Emergency Lockdown will immediately invalidate all active sessions, block pending crypto withdrawals, and freeze trading until you verify your credentials with 2FA.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#EDE9FE]">
              <button
                onClick={() => setShowFreezeModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyLockdown}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Lock Down Account Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit QR Modal */}
      {showDepositQrModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-5 shadow-2xl border border-[#EDE9FE] animate-scale-up text-center">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#6D28D9]" />
                <h3 className="text-sm font-bold text-[#171717]">Deposit {selectedDepositNetwork}</h3>
              </div>
              <button
                onClick={() => setShowDepositQrModal(false)}
                className="w-7 h-7 rounded-full bg-[#F8F7FC] hover:bg-[#EDE9FE] text-[#6B7280] font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Network Selector Buttons */}
            <div className="flex justify-center gap-1.5">
              {(['XENA', 'USDT', 'BTC', 'ETH', 'SOL'] as const).map((net) => (
                <button
                  key={net}
                  onClick={() => setSelectedDepositNetwork(net)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedDepositNetwork === net
                      ? 'bg-[#6D28D9] text-white shadow-xs'
                      : 'bg-[#F8F7FC] text-[#6B7280] border border-[#EDE9FE]'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>

            {/* Mock QR SVG Display */}
            <div className="p-4 bg-[#F8F7FC] rounded-2xl border border-[#EDE9FE] inline-block mx-auto">
              <div className="w-44 h-44 bg-white rounded-xl p-3 border border-[#EDE9FE] flex flex-col items-center justify-center shadow-inner">
                <QrCode className="w-36 h-36 text-[#171717]" />
              </div>
              <p className="text-[11px] text-[#6B7280] mt-2 font-medium">Scan with your mobile crypto wallet</p>
            </div>

            {/* Deposit Address Box */}
            <div className="text-left space-y-1.5">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase">Deposit Address ({selectedDepositNetwork})</span>
              <div className="p-2.5 bg-[#F8F7FC] rounded-xl border border-[#EDE9FE] flex items-center justify-between text-xs font-mono">
                <span className="truncate max-w-[280px] text-[#171717]">
                  {cryptoAssets.find((a) => a.symbol === selectedDepositNetwork)?.depositAddress || '0x71c8...c741'}
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      cryptoAssets.find((a) => a.symbol === selectedDepositNetwork)?.depositAddress || '',
                      'modal-copy'
                    )
                  }
                  className="text-[#6D28D9] font-bold p-1 cursor-pointer"
                >
                  {copiedAddressId === 'modal-copy' ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowDepositQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#6D28D9] text-white font-bold text-xs hover:bg-[#5B21B6] transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Create API Key Modal */}
      {showCreateApiModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#EDE9FE] animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#6D28D9]" />
                <h3 className="text-sm font-bold text-[#171717]">Create New API Key</h3>
              </div>
              <button
                onClick={() => setShowCreateApiModal(false)}
                className="w-7 h-7 rounded-full bg-[#F8F7FC] hover:bg-[#EDE9FE] text-[#6B7280] font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApiKey} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#171717] block mb-1">Key Name</label>
                <input
                  type="text"
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                  placeholder="e.g. Grid Trading Bot"
                  required
                  className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs font-semibold text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#171717] block mb-1.5">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: 'Read', desc: 'View balances & orders' },
                    { id: 'Spot Trade', desc: 'Place market/limit orders' },
                    { id: 'P2P', desc: 'Automate P2P order flow' },
                    { id: 'Withdrawals', desc: 'Authorize withdrawals (risky)' },
                  ] as const).map((perm) => (
                    <button
                      key={perm.id}
                      type="button"
                      onClick={() =>
                        setApiPermissions((prev) => ({
                          ...prev,
                          [perm.id]: !prev[perm.id],
                        }))
                      }
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        apiPermissions[perm.id]
                          ? perm.id === 'Withdrawals'
                            ? 'border-red-300 bg-red-50/60'
                            : 'border-[#7C3AED] bg-purple-50/60 ring-1 ring-[#7C3AED]'
                          : 'border-[#EDE9FE] bg-[#F8F7FC]'
                      }`}
                    >
                      <span className={`text-xs font-bold block ${apiPermissions[perm.id] ? 'text-[#171717]' : 'text-[#6B7280]'}`}>
                        {perm.id}
                      </span>
                      <span className="text-[10px] text-[#6B7280]">{perm.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#171717] block mb-1">
                  IP Whitelist <span className="text-[9px] font-semibold text-[#9CA3AF]">(recommended)</span>
                </label>
                <input
                  type="text"
                  value={apiIpWhitelist}
                  onChange={(e) => setApiIpWhitelist(e.target.value)}
                  placeholder="e.g. 203.0.113.10 (leave empty for All IPs)"
                  className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>The secret will be shown once after creation. Store it in a password manager immediately.</span>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreateApiModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6D28D9] text-white font-bold text-xs hover:bg-[#5B21B6] transition-colors cursor-pointer"
                >
                  Create API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Newly Created API Key (Secret Shown Once) Modal */}
      {newlyCreatedKey && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 space-y-4 shadow-2xl border border-emerald-200 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#171717]">API Key Created Successfully</h3>
                <p className="text-xs text-[#6B7280]">{newlyCreatedKey.name}</p>
              </div>
            </div>

            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Copy your secret now. It will not be shown again and cannot be recovered.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between bg-[#F8F7FC] rounded-xl border border-[#EDE9FE] p-2.5 pl-3">
                <div>
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Access Key</span>
                  <code className="text-xs font-mono font-bold text-[#171717]">{newlyCreatedKey.accessKey}</code>
                </div>
                <button
                  onClick={() => handleCopyText(newlyCreatedKey.accessKey, 'new-access')}
                  className="p-2 rounded-lg bg-white border border-[#EDE9FE] text-[#6D28D9] hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  {copiedAddressId === 'new-access' ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#F8F7FC] rounded-xl border border-[#EDE9FE] p-2.5 pl-3">
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-amber-700 uppercase block">Secret Key</span>
                  <code className="text-xs font-mono font-bold text-[#171717] break-all">{newlyCreatedKey.secret}</code>
                </div>
                <button
                  onClick={() => handleCopyText(newlyCreatedKey.secret, 'new-secret')}
                  className="ml-2 p-2 rounded-lg bg-white border border-[#EDE9FE] text-[#6D28D9] hover:bg-purple-50 transition-colors cursor-pointer shrink-0"
                >
                  {copiedAddressId === 'new-secret' ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              onClick={() => setNewlyCreatedKey(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-xs hover:shadow-[0_4px_16px_rgba(109,40,217,0.3)] transition-all cursor-pointer"
            >
              I've Securely Stored My Secret
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
