import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_USER_PROFILE,
  INITIAL_BALANCES,
  INITIAL_MARKET_STATS,
  INITIAL_TRANSACTIONS,
  INITIAL_INVESTMENT_PLANS,
  INITIAL_P2P_OFFERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
} from './data/initialData';
import {
  UserProfile,
  UserBalances,
  MarketStats,
  Transaction,
  InvestmentPlan,
  P2POffer,
  NotificationItem,
  Account,
  RegisteredUserRecord,
} from './types';
import {
  SEED_USERS,
  SEED_TXS,
  SEED_MERCHANTS,
  SEED_DISPUTES,
  SEED_TICKETS,
  SEED_PROMOS,
  SEED_AUDIT,
  SEED_DEPOSITS,
  SEED_REFERRALS,
} from './pages/AdminPanel';
import { getState, saveState } from './lib/api';

// Layout Components
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';

// Individual Dedicated Pages
import { HomePage } from './pages/HomePage';
import { MarketPage } from './pages/MarketPage';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { P2PPage } from './pages/P2PPage';
import { WalletPage } from './pages/WalletPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { SecurityPage } from './pages/SecurityPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminPanel } from './pages/AdminPanel';

// Modals
import { DepositWithdrawModal } from './components/modals/DepositWithdrawModal';
import { BuySellModal } from './components/modals/BuySellModal';
import { SendReceiveModal } from './components/modals/SendReceiveModal';
import { P2PTradeModal } from './components/modals/P2PTradeModal';
import { InvestmentDetailModal } from './components/modals/InvestmentDetailModal';
import { SecurityModal } from './components/modals/SecurityModal';
import { SearchModal } from './components/SearchModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';

export default function App() {
  // App Global State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [balances, setBalances] = useState<UserBalances>(INITIAL_BALANCES);
  const [marketStats, setMarketStats] = useState<MarketStats>(INITIAL_MARKET_STATS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [investments, setInvestments] = useState<InvestmentPlan[]>(INITIAL_INVESTMENT_PLANS);
  const [p2pOffers, setP2POffers] = useState<P2POffer[]>(INITIAL_P2P_OFFERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Active View / Page Routing
  const [activeTab, setActiveTab] = useState<string>('home');

  // Persisted accounts (registered users) + admin-managed data (server-backed)
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState(SEED_USERS);
  const [txs, setTxs] = useState(SEED_TXS);
  const [merchants, setMerchants] = useState(SEED_MERCHANTS);
  const [disputes, setDisputes] = useState(SEED_DISPUTES);
  const [tickets, setTickets] = useState(SEED_TICKETS);
  const [promos, setPromos] = useState(SEED_PROMOS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS as any[]);
  const [audit, setAudit] = useState(SEED_AUDIT);
  const [deposits, setDeposits] = useState(SEED_DEPOSITS);
  const [referrals, setReferrals] = useState(SEED_REFERRALS);
  const [bonusLog, setBonusLog] = useState<{ id: string; code: string; name: string; xena: number; time: string }[]>([]);
  const [adminSettings, setAdminSettings] = useState({ maintenanceMode: false, p2pZeroFee: true, withdrawApproval: true });
  const [booted, setBooted] = useState(false);

  const registeredUsers = useMemo(
    () => accounts.map((a) => ({ name: a.name, email: a.email, country: a.country, phone: a.phone, dob: a.dob, referrer: a.referrer })),
    [accounts]
  );

  // Modal States
  const [depositWithdrawOpen, setDepositWithdrawOpen] = useState(false);
  const [depositWithdrawTab, setDepositWithdrawTab] = useState<'deposit' | 'withdraw'>('deposit');

  const [buySellOpen, setBuySellOpen] = useState(false);
  const [buySellMode, setBuySellMode] = useState<'buy' | 'sell'>('buy');

  const [sendReceiveOpen, setSendReceiveOpen] = useState(false);
  const [sendReceiveMode, setSendReceiveMode] = useState<'send' | 'receive'>('send');

  const [selectedP2POffer, setSelectedP2POffer] = useState<P2POffer | null>(null);
  const [selectedP2PPaymentMethod, setSelectedP2PPaymentMethod] = useState<string | undefined>(undefined);
  const [p2pModalOpen, setP2PModalOpen] = useState(false);
  const [redeemedBonusCodes, setRedeemedBonusCodes] = useState<string[]>([]);

  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false);

  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Live Price Ticker Simulation (Subtle micro-variations)
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 0.005;
      setMarketStats((prev) => {
        const newPrice = Math.max(2.4, +(prev.price + delta).toFixed(4));
        return {
          ...prev,
          price: newPrice,
          high24h: Math.max(prev.high24h, newPrice),
          low24h: Math.min(prev.low24h, newPrice),
        };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Boot: load persisted server state once on mount (fall back to seeds offline)
  useEffect(() => {
    (async () => {
      try {
        const state = await getState();
        if (state) {
          if (state.users) setUsers(state.users);
          if (state.txs) setTxs(state.txs);
          if (state.merchants) setMerchants(state.merchants);
          if (state.disputes) setDisputes(state.disputes);
          if (state.tickets) setTickets(state.tickets);
          if (state.promos) setPromos(state.promos);
          if (state.announcements) setAnnouncements(state.announcements);
          if (state.audit) setAudit(state.audit);
          if (state.deposits) setDeposits(state.deposits);
          if (state.referrals) setReferrals(state.referrals);
          if (state.bonusLog) setBonusLog(state.bonusLog);
          if (state.settings) setAdminSettings(state.settings);
          if (state.accounts) setAccounts(state.accounts);
        }
      } catch {
        // offline — keep seed defaults
      }
      setBooted(true);
    })();
  }, []);

  // Persist: push the full shared server state whenever any admin/account data changes
  const persistedSnapshot = useMemo(
    () =>
      JSON.stringify({
        users,
        txs,
        deposits,
        referrals,
        bonusLog,
        merchants,
        disputes,
        tickets,
        promos,
        announcements,
        audit,
        settings: adminSettings,
        accounts,
      }),
    [users, txs, deposits, referrals, bonusLog, merchants, disputes, tickets, promos, announcements, audit, adminSettings, accounts]
  );

  useEffect(() => {
    if (!booted) return;
    const t = setTimeout(() => {
      saveState(persistedSnapshot).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [persistedSnapshot, booted]);

  // Sync: keep the logged-in account's live session data persisted
  useEffect(() => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.email.toLowerCase() === user.email.toLowerCase()
          ? {
              ...a,
              name: user.name,
              kycTier: user.kycTier,
              twoFactorEnabled: user.twoFactorEnabled,
              pinSet: user.pinSet,
              verifiedAccountsCount: user.verifiedAccountsCount,
              balances,
              transactions,
              investments,
              notifications,
              redeemedBonusCodes,
            }
          : a
      )
    );
  }, [user, balances, transactions, investments, notifications, redeemedBonusCodes]);

  // Handlers for state updates
  const handleBalanceChange = (amountDelta: number, newTx: Transaction) => {
    setBalances((prev) => {
      const newAvailable = Math.max(0, prev.availableXena + amountDelta);
      const newTotal = prev.investedXena + newAvailable;
      return {
        ...prev,
        availableXena: newAvailable,
        totalBalance: newTotal,
      };
    });
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleClaimYield = (planId: string, amount: number, newTx: Transaction) => {
    setInvestments((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, earnedAmount: 0 } : p))
    );
    setBalances((prev) => ({
      ...prev,
      availableXena: prev.availableXena + amount,
      totalBalance: prev.totalBalance + amount,
    }));
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleP2PTradeComplete = (xenaAmount: number, newTx: Transaction) => {
    setBalances((prev) => ({
      ...prev,
      availableXena: prev.availableXena + xenaAmount,
      totalBalance: prev.totalBalance + xenaAmount,
    }));
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleAddP2POffer = (newOffer: P2POffer) => {
    setP2POffers((prev) => [newOffer, ...prev]);
  };

  const handleStakeNewPlan = (plan: InvestmentPlan): boolean => {
    if (balances.availableXena < plan.investedAmount) {
      alert(`Insufficient available XENA to stake this plan. Minimum required: ${plan.investedAmount} XENA`);
      return false;
    }
    const newTx: Transaction = {
      id: `TX-${Date.now().toString().slice(-6)}`,
      type: 'yield',
      title: `Staked in ${plan.name}`,
      amount: -plan.investedAmount,
      unit: 'XENA',
      timestamp: 'Just now',
      status: 'completed',
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    };

    setInvestments((prev) => [
      {
        ...plan,
        id: `plan-${Date.now()}`,
      },
      ...prev,
    ]);

    setBalances((prev) => ({
      ...prev,
      availableXena: prev.availableXena - plan.investedAmount,
      investedXena: prev.investedXena + plan.investedAmount,
    }));

    setTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  const handleInternalTransfer = (amount: number, from: string, to: string) => {
    const newTx: Transaction = {
      id: `TX-${Date.now().toString().slice(-6)}`,
      type: 'send',
      title: `Internal Transfer: ${from} → ${to}`,
      amount: amount,
      unit: 'XENA',
      timestamp: 'Just now',
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleQuickAction = (action: 'buy' | 'sell' | 'send' | 'receive' | 'p2p' | 'invest') => {
    switch (action) {
      case 'buy':
        setBuySellMode('buy');
        setBuySellOpen(true);
        break;
      case 'sell':
        setBuySellMode('sell');
        setBuySellOpen(true);
        break;
      case 'send':
        setSendReceiveMode('send');
        setSendReceiveOpen(true);
        break;
      case 'receive':
        setSendReceiveMode('receive');
        setSendReceiveOpen(true);
        break;
      case 'p2p':
        handleNavSelect('p2p');
        break;
      case 'invest':
        handleNavSelect('investments');
        break;
    }
  };

  const handleOpenDeposit = () => {
    setDepositWithdrawTab('deposit');
    setDepositWithdrawOpen(true);
  };

  const handleOpenWithdraw = () => {
    setDepositWithdrawTab('withdraw');
    setDepositWithdrawOpen(true);
  };

  const handleSelectP2POffer = (offer: P2POffer, initialPaymentMethod?: string) => {
    setSelectedP2POffer(offer);
    setSelectedP2PPaymentMethod(initialPaymentMethod);
    setP2PModalOpen(true);
  };

  const handleRedeemBonus = (code: string, amount: number, title: string) => {
    setBalances((prev) => {
      const newAvailable = prev.availableXena + amount;
      const newTotal = (prev.totalBalance || prev.totalXena) + amount;
      return {
        ...prev,
        availableXena: newAvailable,
        totalBalance: newTotal,
        totalXena: prev.totalXena + amount,
      };
    });

    const newTx: Transaction = {
      id: `TX-BONUS-${Date.now().toString().slice(-4)}`,
      title: title || `Bonus Code Claimed (${code})`,
      type: 'yield',
      amount: amount,
      unit: 'XENA',
      timestamp: 'Just now',
      status: 'Completed',
      counterparty: 'XENA Community Reward Desk',
      fee: 0,
    };
    setTransactions((prev) => [newTx, ...prev]);

    const newNotification: NotificationItem = {
      id: `notif-bonus-${Date.now()}`,
      title: '🎁 Bonus Voucher Claimed!',
      message: `+${amount.toFixed(2)} XENA has been credited to your available balance via promo code ${code}.`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
    };
    setNotifications((prev) => [newNotification, ...prev]);

    setRedeemedBonusCodes((prev) => (prev.includes(code) ? prev : [...prev, code]));
  };

  const handleSelectPlan = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setInvestmentModalOpen(true);
  };

  const handleUpdateSecurity = (settings: { twoFactor: boolean; pinSet: boolean }) => {
    setUser((prev) => ({
      ...prev,
      twoFactorEnabled: settings.twoFactor,
      pinSet: settings.pinSet,
    }));
  };

  const handleUpdateProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNavSelect = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyAccount = (acc: Account) => {
    setUser({
      name: acc.name,
      email: acc.email,
      kycTier: acc.kycTier,
      xenaId: acc.xenaId,
      xenaCode: acc.xenaCode,
      twoFactorEnabled: acc.twoFactorEnabled,
      pinSet: acc.pinSet,
      verifiedAccountsCount: acc.verifiedAccountsCount,
      role: 'user',
    });
    setBalances({ ...INITIAL_BALANCES, ...acc.balances });
    setTransactions(acc.transactions || []);
    setInvestments(acc.investments || []);
    setNotifications(acc.notifications || []);
    setRedeemedBonusCodes(acc.redeemedBonusCodes || []);
  };

  const resetDemoSession = () => {
    setUser(INITIAL_USER_PROFILE);
    setBalances(INITIAL_BALANCES);
    setTransactions(INITIAL_TRANSACTIONS);
    setInvestments(INITIAL_INVESTMENT_PLANS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setRedeemedBonusCodes([]);
  };

  const makeAccount = (data: RegisteredUserRecord): Account => {
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
      balances: {
        ...INITIAL_BALANCES,
        totalXena: 0,
        totalBalance: 0,
        change24hAmount: 0,
        change24hPercent: 0,
        availableXena: 0,
        investedXena: 0,
        averageBuyPrice: 0,
        stakedXena: 0,
        lockedInOrders: 0,
        nairaBalance: 0,
      },
      transactions: [],
      investments: [],
      notifications: [],
      redeemedBonusCodes: [],
    };
  };

  const handleLogin = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    const e = email.trim().toLowerCase();
    if (e === 'admin@xena.fi' && password === 'xena-admin-demo') {
      setUser((prev) => ({ ...prev, role: 'admin', name: 'Administrator', email: 'admin@xena.fi', kycTier: 'Staff', xenaId: 'XN-ADMIN-01', xenaCode: 'xena-admin' }));
      handleNavSelect('admin');
      return { ok: true };
    }
    const acc = accounts.find((a) => a.email.toLowerCase() === e);
    if (acc) {
      if (acc.password !== password) {
        return { ok: false, error: 'Incorrect password. Please try again.' };
      }
      applyAccount(acc);
      handleNavSelect('home');
      return { ok: true };
    }
    if (e === 'alex.morgan@xena.fi' && password === 'xena-user-demo') {
      resetDemoSession();
      handleNavSelect('home');
      return { ok: true };
    }
    return { ok: false, error: 'No account found with that email. Please create an account first.' };
  };

  const handleRegister = async (data: RegisteredUserRecord): Promise<{ ok: boolean; error?: string }> => {
    const e = data.email.trim().toLowerCase();
    if (accounts.some((a) => a.email.toLowerCase() === e)) {
      return { ok: false, error: 'An account with this email already exists. Please sign in instead.' };
    }
    const newAcc = makeAccount(data);
    setAccounts((prev) => [newAcc, ...prev]);
    applyAccount(newAcc);
    return { ok: true };
  };

  // Render the current active dedicated page
  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            user={user}
            balances={balances}
            marketStats={marketStats}
            transactions={transactions}
            investments={investments}
            p2pOffers={p2pOffers}
            redeemedBonusCodes={redeemedBonusCodes}
            onRedeemBonus={handleRedeemBonus}
            onOpenDeposit={handleOpenDeposit}
            onOpenWithdraw={handleOpenWithdraw}
            onQuickAction={handleQuickAction}
            onNavigateTab={handleNavSelect}
            onSelectPlan={handleSelectPlan}
            onSelectP2POffer={handleSelectP2POffer}
            onOpenSecurity={() => handleNavSelect('security')}
            announcements={announcements}
          />
        );

      case 'market':
        return (
          <MarketPage
            marketStats={marketStats}
            balances={balances}
            onBuyXena={() => {
              setBuySellMode('buy');
              setBuySellOpen(true);
            }}
            onSellXena={() => {
              setBuySellMode('sell');
              setBuySellOpen(true);
            }}
            onTradeSuccess={(amount, type) => {
              const delta = type === 'buy' ? amount : -amount;
              const tx: Transaction = {
                id: `TX-${Date.now().toString().slice(-4)}`,
                title: type === 'buy' ? `Purchased XENA` : `Sold XENA`,
                type: type === 'buy' ? 'deposit' : 'withdraw',
                amount,
                unit: 'XENA',
                timestamp: 'Just now',
                status: 'Completed',
                counterparty: 'Decentralized Spot Liquidity Pool',
                fee: +(amount * 0.001).toFixed(4),
              };
              handleBalanceChange(delta, tx);
            }}
          />
        );

      case 'investments':
        return (
          <InvestmentsPage
            plans={investments}
            balances={balances}
            onSelectPlan={handleSelectPlan}
            onStakeNewPlan={handleStakeNewPlan}
          />
        );

      case 'p2p':
        return (
          <P2PPage
            offers={p2pOffers}
            onSelectOffer={handleSelectP2POffer}
            onAddOffer={handleAddP2POffer}
          />
        );

      case 'wallet':
        return (
          <WalletPage
            balances={balances}
            onOpenDeposit={handleOpenDeposit}
            onOpenWithdraw={handleOpenWithdraw}
            onOpenSend={() => {
              setSendReceiveMode('send');
              setSendReceiveOpen(true);
            }}
            onOpenReceive={() => {
              setSendReceiveMode('receive');
              setSendReceiveOpen(true);
            }}
            onTrade={() => handleNavSelect('market')}
            onInternalTransfer={handleInternalTransfer}
          />
        );

      case 'profile':
        return (
          <ProfilePage
            user={user}
            balances={balances}
            onUpdateSecurity={handleUpdateSecurity}
            onOpenDeposit={handleOpenDeposit}
            onOpenWithdraw={handleOpenWithdraw}
            onOpenSend={() => {
              setSendReceiveMode('send');
              setSendReceiveOpen(true);
            }}
            onOpenReceive={() => {
              setSendReceiveMode('receive');
              setSendReceiveOpen(true);
            }}
            onSelectTab={handleNavSelect}
          />
        );

      case 'transactions':
        return (
          <TransactionsPage
            transactions={transactions}
          />
        );

      case 'security':
        return (
          <ProfilePage
            user={user}
            balances={balances}
            onUpdateSecurity={handleUpdateSecurity}
            onOpenDeposit={handleOpenDeposit}
            onOpenWithdraw={handleOpenWithdraw}
            onOpenSend={() => {
              setSendReceiveMode('send');
              setSendReceiveOpen(true);
            }}
            onOpenReceive={() => {
              setSendReceiveMode('receive');
              setSendReceiveOpen(true);
            }}
            onSelectTab={handleNavSelect}
          />
        );

      case 'announcements':
        return (
          <AnnouncementsPage
            announcements={announcements}
            onExploreP2P={() => handleNavSelect('p2p')}
            onExploreStaking={() => handleNavSelect('investments')}
          />
        );

      case 'settings':
        return (
          <SettingsPage
            user={user}
            onUpdateSecurity={handleUpdateSecurity}
            onUpdateProfile={handleUpdateProfile}
            onSelectTab={handleNavSelect}
          />
        );

      case 'login':
        return (
          <LoginPage
            onNavigateTab={handleNavSelect}
            onLogin={handleLogin}
            onLoginSuccess={() => handleNavSelect('home')}
            onAdminLogin={() => {
              setUser((prev) => ({ ...prev, role: 'admin', name: 'Administrator', email: 'admin@xena.fi' }));
              handleNavSelect('admin');
            }}
          />
        );

      case 'signup':
        return (
          <SignupPage
            onNavigateTab={handleNavSelect}
            onSignupSuccess={() => handleNavSelect('home')}
            onRegister={handleRegister}
          />
        );

      case 'admin':
        return (
          <AdminPanel
            onNavigateTab={handleNavSelect}
            registeredUsers={registeredUsers}
            users={users}
            setUsers={setUsers}
            txs={txs}
            setTxs={setTxs}
            merchants={merchants}
            setMerchants={setMerchants}
            disputes={disputes}
            setDisputes={setDisputes}
            tickets={tickets}
            setTickets={setTickets}
            promos={promos}
            setPromos={setPromos}
            announcements={announcements}
            setAnnouncements={setAnnouncements}
            audit={audit}
            setAudit={setAudit}
            deposits={deposits}
            setDeposits={setDeposits}
            referrals={referrals}
            setReferrals={setReferrals}
            bonusLog={bonusLog}
            setBonusLog={setBonusLog}
            settings={adminSettings}
            setSettings={setAdminSettings}
          />
        );

      default:
        return (
          <HomePage
            user={user}
            balances={balances}
            marketStats={marketStats}
            transactions={transactions}
            investments={investments}
            p2pOffers={p2pOffers}
            onOpenDeposit={handleOpenDeposit}
            onOpenWithdraw={handleOpenWithdraw}
            onQuickAction={handleQuickAction}
            onNavigateTab={handleNavSelect}
            onSelectP2POffer={handleSelectP2POffer}
            onSelectPlan={handleSelectPlan}
            onOpenSecuritySettings={() => handleNavSelect('security')}
            onBuyXena={() => {
              setBuySellMode('buy');
              setBuySellOpen(true);
            }}
            onSellXena={() => {
              setBuySellMode('sell');
              setBuySellOpen(true);
            }}
            referralCode={`XENA-${user.name.split(' ')[0].toUpperCase()}`}
            referralCount={registeredUsers.filter((ru) => ru.referrer && ru.referrer.toUpperCase() === `XENA-${user.name.split(' ')[0].toUpperCase()}`).length}
            announcements={announcements}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FAF7FF] to-[#F3EFFF] text-[#171717] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-20 md:pb-0">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleNavSelect}
        user={user}
        notifications={notifications}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenSecurity={() => handleNavSelect('security')}
      />

      {/* Main Page Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
        {renderCurrentPage()}
      </main>

      {/* Mobile-Optimized Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleNavSelect}
      />

      {/* Interactive Global Modals */}
      <DepositWithdrawModal
        isOpen={depositWithdrawOpen}
        onClose={() => setDepositWithdrawOpen(false)}
        initialTab={depositWithdrawTab}
        availableXena={balances.availableXena}
        nairaBalance={balances.nairaBalance}
        xenaNgnRate={balances.xenaNgnRate}
        xenaUsdPrice={marketStats.price}
        onSuccess={handleBalanceChange}
      />

      <BuySellModal
        isOpen={buySellOpen}
        onClose={() => setBuySellOpen(false)}
        initialMode={buySellMode}
        currentPrice={marketStats.price}
        availableXena={balances.availableXena}
        onSuccess={handleBalanceChange}
      />

      <SendReceiveModal
        isOpen={sendReceiveOpen}
        onClose={() => setSendReceiveOpen(false)}
        initialMode={sendReceiveMode}
        availableXena={balances.availableXena}
        myXenaCode={user.xenaCode}
        onSuccess={handleBalanceChange}
      />

      <P2PTradeModal
        isOpen={p2pModalOpen}
        onClose={() => setP2PModalOpen(false)}
        offer={selectedP2POffer}
        initialPaymentMethod={selectedP2PPaymentMethod}
        onTradeComplete={handleP2PTradeComplete}
      />

      <InvestmentDetailModal
        isOpen={investmentModalOpen}
        onClose={() => setInvestmentModalOpen(false)}
        plan={selectedPlan}
        availableXena={balances.availableXena}
        onClaimYield={handleClaimYield}
      />

      <SecurityModal
        isOpen={securityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
        twoFactorEnabled={user.twoFactorEnabled}
        pinSet={user.pinSet}
        onUpdateSecurity={handleUpdateSecurity}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={handleNavSelect}
        onActionClick={(action) => {
          setSearchModalOpen(false);
          if (action === 'buy' || action === 'sell') {
            setBuySellMode(action);
            setBuySellOpen(true);
          } else if (action === 'deposit' || action === 'withdraw') {
            setDepositWithdrawTab(action);
            setDepositWithdrawOpen(true);
          } else if (action === 'security') {
            handleNavSelect('security');
          }
        }}
      />

      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onClearAll={handleClearAllNotifications}
      />
    </div>
  );
}
