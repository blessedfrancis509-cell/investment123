import React from 'react';
import { ArrowRight, TrendingUp, ShieldCheck, Users, PiggyBank, Clock3, Wallet, Sparkles, Plus, Check } from 'lucide-react';
import { UserProfile, UserBalances, MarketStats, InvestmentPlan, Transaction, P2POffer } from '../types';
import { WelcomeSection } from '../components/WelcomeSection';
import { MainBalanceCard } from '../components/MainBalanceCard';
import { QuickActions } from '../components/QuickActions';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { BonusCodeSection } from '../components/BonusCodeSection';
import { XenaTokenBadge } from '../components/XenaLogo';

interface HomePageProps {
  user: UserProfile;
  balances: UserBalances;
  marketStats: MarketStats;
  investments: InvestmentPlan[];
  transactions: Transaction[];
  p2pOffers: P2POffer[];
  redeemedBonusCodes?: string[];
  onRedeemBonus?: (code: string, amount: number, title: string) => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onQuickAction: (action: 'buy' | 'sell' | 'deposit' | 'withdraw' | 'send' | 'receive' | 'p2p' | 'invest') => void;
  onNavigateTab: (tab: string) => void;
  onSelectPlan: (plan: InvestmentPlan) => void;
  onSelectP2POffer: (offer: P2POffer, initialPaymentMethod?: string) => void;
  onOpenSecurity: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  balances,
  marketStats,
  investments,
  transactions,
  p2pOffers,
  redeemedBonusCodes = [],
  onRedeemBonus = () => {},
  onOpenDeposit,
  onOpenWithdraw,
  onQuickAction,
  onNavigateTab,
  onSelectPlan,
  onSelectP2POffer,
  onOpenSecurity,
}) => {
  const topInvestment = investments[0];
  const recentThreeTx = transactions.slice(0, 3);
  const featuredP2POffers = p2pOffers.slice(0, 2);

  return (
    <div className="space-y-4 sm:space-y-8 animate-fade-in" id="home-page-view">
      {/* 1. Welcome Section */}
      <WelcomeSection user={user} livePrice={marketStats.price} />

      {/* 2. Main Balance Card */}
      <MainBalanceCard
        balances={balances}
        onOpenDeposit={onOpenDeposit}
        onOpenWithdraw={onOpenWithdraw}
      />

      {/* 3. Quick Actions */}
      <QuickActions onActionClick={onQuickAction} />

      {/* 4. Bonus Code Redemption Section (Prominent on Home Screen) */}
      <BonusCodeSection
        onRedeemBonus={onRedeemBonus}
        redeemedCodes={redeemedBonusCodes}
      />

      {/* 5. Announcement Highlight */}
      <AnnouncementCard onExploreP2P={() => onNavigateTab('p2p')} />

      {/* 6. Home Dashboard Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Market & Staking Snapshot */}
        <div className="lg:col-span-7 space-y-6">
          {/* Market Snapshot Card */}
          <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-2.5">
                <XenaTokenBadge size={32} />
                <div>
                  <h3 className="text-sm font-bold text-[#171717]">XENA / USD Market</h3>
                  <p className="text-[11px] text-[#6B7280]">Spot Exchange Rate</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-[#171717] font-mono block">
                  ${marketStats.price.toFixed(4)}
                </span>
                <span className="text-xs font-bold text-[#16A34A] flex items-center justify-end gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{marketStats.change24h}%</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 my-3">
              <div className="p-2.5 bg-[#F8F7FC] rounded-xl border border-[#EDE9FE] text-center">
                <span className="text-[10px] text-[#6B7280] block">24h High</span>
                <span className="text-xs font-bold text-[#171717] font-mono">${marketStats.high24h.toFixed(2)}</span>
              </div>
              <div className="p-2.5 bg-[#F8F7FC] rounded-xl border border-[#EDE9FE] text-center">
                <span className="text-[10px] text-[#6B7280] block">24h Low</span>
                <span className="text-xs font-bold text-[#171717] font-mono">${marketStats.low24h.toFixed(2)}</span>
              </div>
              <div className="p-2.5 bg-[#F8F7FC] rounded-xl border border-[#EDE9FE] text-center">
                <span className="text-[10px] text-[#6B7280] block">24h Volume</span>
                <span className="text-xs font-bold text-[#171717] font-mono">${(marketStats.volume24hUsdt / 1_000_000).toFixed(1)}M</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('market')}
              className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-gradient-to-r hover:from-[#7C3AED] hover:to-[#A855F7] text-[#6D28D9] hover:text-white font-bold text-xs border border-purple-100 hover:border-transparent transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Live Market & Chart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Staking Snippet */}
          {topInvestment && (
            <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#16A34A] border border-emerald-100 flex items-center justify-center">
                    <PiggyBank className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#171717]">Top Staking Position</h3>
                    <p className="text-[11px] text-[#6B7280]">{topInvestment.name} · {topInvestment.category}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  +{topInvestment.projectedReturnPercent}% APY
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#6B7280]">
                    Progress ({topInvestment.totalDays ? topInvestment.totalDays - topInvestment.daysRemaining : 45}/{topInvestment.totalDays || 90} Days)
                  </span>
                  <span className="text-[#6D28D9] font-bold">{topInvestment.progressPercent}%</span>
                </div>
                <div className="w-full bg-[#F8F7FC] h-2 rounded-full overflow-hidden border border-[#EDE9FE]">
                  <div
                    className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] h-full rounded-full"
                    style={{ width: `${topInvestment.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#EDE9FE] text-xs">
                <div>
                  <span className="text-[#6B7280] block text-[10px]">Total Invested</span>
                  <span className="font-bold text-[#171717]">{topInvestment.investedAmount.toLocaleString()} XENA</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px]">Accrued Yield</span>
                  <span className="font-bold text-[#6D28D9]">+{topInvestment.earnedAmount.toFixed(2)} XENA</span>
                </div>
                <button
                  onClick={() => onNavigateTab('investments')}
                  className="px-3 py-1.5 rounded-lg bg-[#F8F7FC] hover:bg-purple-50 text-[#6D28D9] font-bold text-xs border border-[#EDE9FE] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>All Earn Plans</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recent Activity Snippet & P2P Quick Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Activity Card */}
          <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-[#7C3AED]" />
                <h3 className="text-sm font-bold text-[#171717]">Recent Activity</h3>
              </div>
              <button
                onClick={() => onNavigateTab('transactions')}
                className="text-xs font-bold text-[#6D28D9] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-[#EDE9FE] py-1">
              {recentThreeTx.map((tx) => {
                const isPositive = tx.amount > 0;
                return (
                  <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <span className="font-bold text-[#171717] block truncate">{tx.title}</span>
                      <span className="text-[10px] text-[#6B7280] block">{tx.timestamp}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`font-bold font-mono ${isPositive ? 'text-[#16A34A]' : 'text-[#171717]'}`}>
                        {isPositive ? `+${tx.amount}` : tx.amount} {tx.unit}
                      </span>
                      <span className="text-[9px] text-[#6B7280] block">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigateTab('transactions')}
              className="w-full mt-2 py-2 rounded-xl bg-[#F8F7FC] hover:bg-purple-50 text-[#6D28D9] font-bold text-xs border border-[#EDE9FE] transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Full Transaction History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* P2P Quick Spotlight */}
          <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7C3AED]" />
                <h3 className="text-sm font-bold text-[#171717]">P2P Trading Spotlight</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#6D28D9] border border-purple-100">
                0% Fees
              </span>
            </div>

            <div className="space-y-2 py-2">
              {featuredP2POffers.map((offer) => {
                const methods = offer.paymentMethods || (offer.paymentMethod ? [offer.paymentMethod] : ['Bank Transfer']);
                return (
                  <div
                    key={offer.id}
                    onClick={() => onSelectP2POffer(offer, methods[0])}
                    className="p-3 rounded-xl bg-[#F8F7FC] border border-[#EDE9FE] hover:border-purple-200 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#171717]">{offer.merchantName}</span>
                        <span className="text-[9px] text-[#16A34A] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                          {offer.completionRate}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {methods.slice(0, 2).map((m) => (
                          <span
                            key={m}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectP2POffer(offer, m);
                            }}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-[#6D28D9] border border-purple-100 hover:bg-purple-100"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#6D28D9] font-mono block">
                        ${offer.pricePerXena.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-[#6B7280]">per XENA</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigateTab('p2p')}
              className="w-full mt-1 py-2 rounded-xl bg-purple-50 hover:bg-gradient-to-r hover:from-[#7C3AED] hover:to-[#A855F7] text-[#6D28D9] hover:text-white font-bold text-xs border border-purple-100 hover:border-transparent transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Explore P2P Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 7. Security Center Banner */}
      <div className="bg-[#F8F7FC] border border-[#EDE9FE] rounded-[24px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-[#171717]">Institutional Cryptographic Security</h4>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#6D28D9] text-[9px] font-bold border border-purple-100">
                SOC-2 Type II
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] mt-0.5">
              2FA, hardware address whitelisting, and automated anomaly detection active.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSecurity}
          className="px-4 py-2 rounded-xl bg-white hover:bg-purple-50 text-[#6D28D9] font-bold text-xs border border-[#EDE9FE] shrink-0 cursor-pointer flex items-center gap-1.5 transition-colors"
        >
          <span>Security Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
