import React, { useState, useEffect } from 'react';
import {
  INITIAL_USER_PROFILE,
  INITIAL_BALANCES,
  INITIAL_MARKET_STATS,
  INITIAL_TRANSACTIONS,
  INITIAL_INVESTMENT_PLANS,
  INITIAL_P2P_OFFERS,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import {
  UserProfile,
  UserBalances,
  MarketStats,
  Transaction,
  InvestmentPlan,
  P2POffer,
  NotificationItem,
} from './types';

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
        return <LoginPage onNavigateTab={handleNavSelect} onLoginSuccess={() => handleNavSelect('home')} />;

      case 'signup':
        return <SignupPage onNavigateTab={handleNavSelect} onSignupSuccess={() => handleNavSelect('home')} />;

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
            onNavigate={handleNavSelect}
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
