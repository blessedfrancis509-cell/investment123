import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Plus, Sparkles, Check, Clock, Calculator, Headphones, LifeBuoy, MessageCircle, Mail, ChevronRight, Info, Layers, RefreshCw } from 'lucide-react';
import { InvestmentPlan, UserBalances } from '../types';

interface InvestmentsPageProps {
  plans: InvestmentPlan[];
  balances: UserBalances;
  onSelectPlan: (plan: InvestmentPlan) => void;
  onStakeNewPlan: (plan: InvestmentPlan) => void;
}

const CATEGORY_META: Record<string, { label: string; accent: string }> = {
  '2-Week (14D)': { label: '⚡ 2-Week (14D) Package', accent: 'bg-purple-50 text-[#6D28D9] border-purple-100' },
  'Flexible': { label: 'Flexible Vault', accent: 'bg-emerald-50 text-[#16A34A] border-emerald-100' },
  'Fixed Term': { label: 'Fixed Term', accent: 'bg-blue-50 text-blue-600 border-blue-100' },
  'VIP Tier': { label: 'VIP Tier', accent: 'bg-amber-50 text-amber-700 border-amber-100' },
  'Liquidity': { label: 'Liquidity Pools', accent: 'bg-rose-50 text-rose-600 border-rose-100' },
  'Institutional': { label: 'Institutional', accent: 'bg-slate-100 text-slate-700 border-slate-200' },
  'Growth': { label: 'Growth Plans', accent: 'bg-purple-50 text-[#6D28D9] border-purple-100' },
  'Staking': { label: 'Staking', accent: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  'Calculated': { label: 'Custom Vault', accent: 'bg-teal-50 text-teal-600 border-teal-100' },
};

const defaultMeta = { label: 'Investment Plan', accent: 'bg-purple-50 text-[#6D28D9] border-purple-100' };

const catalogPlans = [
  {
    id: 'cat-2wk-sprint',
    name: '2-Week Fast-Track Sprint Vault',
    category: '2-Week (14D)',
    apy: 26.5,
    duration: '2-Week Lock',
    days: 14,
    minDeposit: 50,
    badge: '⚡ 2-Week',
    risk: 'Audited Contract',
    description: 'Rapid 14-day lockup with accelerated validator yield and withdrawal at maturity.',
  },
  {
    id: 'cat-2wk-surge',
    name: '2-Week Validator Surge Pool',
    category: '2-Week (14D)',
    apy: 28.4,
    duration: '2-Week Lock',
    days: 14,
    minDeposit: 100,
    badge: 'High Yield',
    risk: 'Protected Principal',
    description: 'Proof-of-stake delegation with 14-day epoch compounding and payout on maturity.',
  },
  {
    id: 'cat-2wk-arbitrage',
    name: '2-Week DeFi Arbitrage Matrix',
    category: '2-Week (14D)',
    apy: 31.5,
    duration: '2-Week Lock',
    days: 14,
    minDeposit: 200,
    badge: 'Trending',
    risk: 'Algorithmic Hedge',
    description: 'Cross-DEX spread capture locked for a 2-week window with payout at day 14.',
  },
  {
    id: 'cat-2wk-bridge',
    name: '2-Week Multi-Chain Bridge Vault',
    category: '2-Week (14D)',
    apy: 24.8,
    duration: '2-Week Lock',
    days: 14,
    minDeposit: 25,
    badge: 'Low Min',
    risk: 'Insured Pool',
    description: 'Short-term liquidity for cross-chain bridge relays with no impermanent loss.',
  },
  {
    id: 'cat-flex',
    name: 'Flexible Staking Vault',
    category: 'Flexible',
    apy: 18.5,
    duration: 'Flexible',
    days: 0,
    minDeposit: 10,
    badge: 'Instant Redeem',
    risk: 'Low Risk',
    description: 'Deposit and withdraw anytime. Yield accrues block-by-block, compounding daily.',
  },
  {
    id: 'cat-30d',
    name: '30-Day Growth Vault',
    category: 'Fixed Term',
    apy: 24.2,
    duration: '30-Day Lock',
    days: 30,
    minDeposit: 50,
    badge: 'Popular',
    risk: 'Audited Strategy',
    description: 'Automated market maker routing delivering amplified monthly yield.',
  },
  {
    id: 'cat-90d',
    name: '90-Day VIP Vault',
    category: 'VIP Tier',
    apy: 32.0,
    duration: '90-Day Lock',
    days: 90,
    minDeposit: 250,
    badge: 'High APY',
    risk: 'Protected',
    description: 'Exclusive tier with institutional revenue share and governance multipliers.',
  },
  {
    id: 'cat-lp',
    name: 'XENA-USDT Liquidity Farm',
    category: 'Liquidity',
    apy: 45.5,
    duration: '60-Day Lock',
    days: 60,
    minDeposit: 500,
    badge: 'Max Yield',
    risk: 'Auto Rebalance',
    description: 'Dual-asset liquidity provision with automated impermanent loss mitigation.',
  },
  {
    id: 'cat-180d',
    name: '180-Day Institutional Vault',
    category: 'Institutional',
    apy: 52.0,
    duration: '180-Day Lock',
    days: 180,
    minDeposit: 1000,
    badge: 'Whale Tier',
    risk: 'Insured Pool',
    description: 'Validator delegation with slashing insurance and validator rewards.',
  },
];

export const InvestmentsPage: React.FC<InvestmentsPageProps> = ({
  plans,
  balances,
  onSelectPlan,
  onStakeNewPlan,
}) => {
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [calcDuration, setCalcDuration] = useState<number>(14);
  const [calcApy, setCalcApy] = useState<number>(26.5);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);

  const totalInvested = plans.reduce((acc, p) => acc + p.investedAmount, 0);
  const totalEarned = plans.reduce((acc, p) => acc + p.earnedAmount, 0);
  const avgApy = (plans.reduce((acc, p) => acc + p.projectedReturnPercent, 0) / (plans.length || 1)).toFixed(1);

  // Group active plans strictly by their package category — a plan bought
  // from a package only ever appears under that package's header.
  const grouped = plans.reduce<Record<string, InvestmentPlan[]>>((acc, plan) => {
    const key = plan.category || 'Other';
    (acc[key] = acc[key] || []).push(plan);
    return acc;
  }, {});

  const filteredCatalog = activeCategory === 'all'
    ? catalogPlans
    : catalogPlans.filter((p) => p.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const calculatedReturn = (calcAmount * (calcApy / 100) * (calcDuration / 365));
  const dailyReturn = calculatedReturn / calcDuration;

  const handleClaimAll = () => {
    setClaimedNotice(`Successfully claimed ${totalEarned.toFixed(2)} XENA rewards to your Spot Wallet!`);
    setTimeout(() => setClaimedNotice(null), 4000);
  };

  return (
    <div className="space-y-3 animate-fade-in" id="investments-page-view">
      {/* ===== 1. HEADER ===== */}
      <div className="bg-gradient-to-br from-[#5B21B6] via-[#6D28D9] to-[#7C3AED] rounded-[20px] px-4 sm:px-6 py-4 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">Invest & Earn</h1>
                <span className="px-2 py-0.5 rounded-md bg-white/15 border border-white/25 text-[9px] font-bold uppercase tracking-wide backdrop-blur">Institutional Staking</span>
              </div>
              <p className="text-[11px] text-purple-100">Lock XENA into validator vaults & liquidity pools with daily compounding.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20 min-w-[260px]">
            <div>
              <span className="text-[8px] text-purple-200 uppercase font-bold block leading-none">Staked</span>
              <span className="text-sm font-bold font-mono block leading-none mt-0.5">{totalInvested.toLocaleString()} XENA</span>
              <span className="text-[9px] text-purple-200">≈ ${(totalInvested * balances.usdRate).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[8px] text-purple-200 uppercase font-bold block leading-none">Earned</span>
              <span className="text-sm font-bold text-green-300 font-mono block leading-none mt-0.5">+{totalEarned.toFixed(2)}</span>
              <span className="text-[9px] text-green-200">+${(totalEarned * balances.usdRate).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[8px] text-purple-200 uppercase font-bold block leading-none">Avg APY</span>
              <span className="text-sm font-bold font-mono block leading-none mt-0.5">{avgApy}%</span>
              <span className="text-[9px] text-purple-200">Daily Payout</span>
            </div>
          </div>
        </div>

        {claimedNotice && (
          <div className="relative z-10 mt-3 p-2.5 rounded-lg bg-white/15 border border-white/25 text-white text-[11px] font-bold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-green-300" />
              <span>{claimedNotice}</span>
            </div>
          </div>
        )}
      </div>

      {/* ===== 2. MY ACTIVE POSITIONS (grouped by package header) ===== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#171717]">My Active Positions</h2>
            <p className="text-[10px] text-[#6B7280]">Grouped by purchased package · daily rewards compounding</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSupportModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F8F7FC] hover:bg-purple-50 border border-[#EDE9FE] text-[#6B7280] hover:text-[#6D28D9] font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CS Support</span>
              <span className="sm:hidden">CS</span>
            </button>
            <button onClick={handleClaimAll} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-[11px] flex items-center gap-1 shadow-xs hover:opacity-95 transition-all cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" />
              Claim All +{totalEarned.toFixed(2)}
            </button>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="bg-white border border-[#EDE9FE] rounded-[20px] p-6 text-center space-y-1.5">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-[#7C3AED] mx-auto flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#171717]">No Active Positions</h4>
            <p className="text-xs text-[#6B7280]">Pick a vault below to start earning passive rewards.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, catPlans]) => {
            const meta = CATEGORY_META[category] || defaultMeta;
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${meta.accent}`}>{meta.label}</span>
                    <span className="text-[10px] font-bold text-[#6B7280]">{catPlans.length} {catPlans.length === 1 ? 'position' : 'positions'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {catPlans.map((plan) => (
                    <div key={plan.id} className="bg-white border border-[#EDE9FE] rounded-[16px] p-3.5 flex flex-col justify-between gap-3 shadow-xs hover:border-purple-300 hover:shadow-md transition-all">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className="text-xs font-bold text-[#171717] leading-snug">{plan.name}</h3>
                          <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100 font-mono shrink-0">+{plan.projectedReturnPercent}%</span>
                        </div>
                        <p className="text-[10px] text-[#6B7280] mb-2">{category}</p>

                        <div className="mb-2">
                          <div className="flex justify-between text-[10px] font-semibold mb-1">
                            <span className="text-[#6B7280]">{(plan.totalDays === 14 ? '2-Week Lock' : `${plan.totalDays || 30}-Day Term`)} · Day {(plan.totalDays || 30) - plan.daysRemaining}/{plan.totalDays || 30}</span>
                            <span className="text-[#6D28D9] font-bold">{plan.progressPercent}%</span>
                          </div>
                          <div className="w-full bg-[#F8F7FC] h-1.5 rounded-full overflow-hidden border border-[#EDE9FE]">
                            <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] h-full rounded-full transition-all duration-500" style={{ width: `${plan.progressPercent}%` }} />
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-[#6B7280] mt-0.5">
                            <span className="flex items-center gap-1 text-purple-700 font-bold"><Clock className="w-2.5 h-2.5" /> {plan.daysRemaining}d left</span>
                            <span>Ends {plan.endDate || 'Maturity'}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-[#EDE9FE] text-[11px]">
                          <div>
                            <p className="text-[#6B7280] text-[9px]">Staked</p>
                            <p className="font-bold text-[#171717] font-mono">{plan.investedAmount.toLocaleString()} XENA</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[#6B7280] text-[9px]">Earned</p>
                            <p className="font-bold text-[#6D28D9] font-mono">+{plan.earnedAmount.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => onSelectPlan(plan)} className="w-full py-2 rounded-lg text-[11px] font-bold text-[#6D28D9] bg-[#F8F7FC] hover:bg-gradient-to-r hover:from-[#7C3AED] hover:to-[#A855F7] hover:text-white border border-[#EDE9FE] hover:border-transparent transition-all flex items-center justify-center gap-1 cursor-pointer">
                        <RefreshCw className="w-3 h-3" /> Manage & Compounding
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ===== 3. CATALOG ===== */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#171717]">Explore Vault Packages</h2>
            <p className="text-[10px] text-[#6B7280]">Buy a package — it appears under that package in My Positions</p>
          </div>
          <div className="flex flex-wrap bg-[#F8F7FC] p-0.5 rounded-lg border border-[#EDE9FE] self-start sm:self-auto gap-0.5">
            {[
              { id: 'all', label: 'All' },
              { id: '2-week', label: '⚡ 2-Week' },
              { id: 'flexible', label: 'Flexible' },
              { id: 'fixed', label: 'Fixed' },
              { id: 'vip', label: 'VIP' },
              { id: 'liquidity', label: 'Liquidity' },
            ].map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${activeCategory === cat.id ? 'bg-white text-[#6D28D9] shadow-xs' : 'text-[#6B7280] hover:text-[#171717]'}`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredCatalog.map((plan) => {
            const meta = CATEGORY_META[plan.category] || defaultMeta;
            // Prevent buying a package that is already active (dedupe by name)
            const alreadyActive = plans.some((p) => p.name === plan.name);
            return (
              <div key={plan.id} className="bg-white border border-[#EDE9FE] rounded-[16px] p-3.5 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div>
                      <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${meta.accent}`}>{plan.category}</span>
                      <h3 className="text-xs font-bold text-[#171717] mt-1.5 leading-snug">{plan.name}</h3>
                    </div>
                    <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100 font-mono shrink-0">+{plan.apy}%</span>
                  </div>

                  <p className="text-[10px] text-[#6B7280] leading-relaxed mb-2">{plan.description}</p>

                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    <div className="p-1.5 bg-[#F8F7FC] rounded-lg border border-[#EDE9FE] text-center">
                      <span className="text-[8px] text-[#6B7280] block font-medium leading-none">Lock</span>
                      <span className="font-bold text-[#171717] text-[10px]">{plan.duration}</span>
                    </div>
                    <div className="p-1.5 bg-[#F8F7FC] rounded-lg border border-[#EDE9FE] text-center">
                      <span className="text-[8px] text-[#6B7280] block font-medium leading-none">Min</span>
                      <span className="font-bold text-[#171717] text-[10px]">{plan.minDeposit} XENA</span>
                    </div>
                    <div className="p-1.5 bg-[#F8F7FC] rounded-lg border border-[#EDE9FE] text-center">
                      <span className="text-[8px] text-[#6B7280] block font-medium leading-none">Risk</span>
                      <span className="font-bold text-[#171717] text-[10px]">{plan.risk}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2 py-1 rounded-md bg-emerald-50/60 border border-emerald-100 mb-1">
                    <span className="text-[9px] text-emerald-800 font-bold">APY Badge</span>
                    <span className="text-[9px] font-bold text-[#6D28D9]">{plan.badge}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onStakeNewPlan({
                      id: plan.id,
                      name: plan.name,
                      category: plan.category,
                      investedAmount: Math.max(plan.minDeposit, 100),
                      earnedAmount: 0,
                      projectedReturnPercent: plan.apy,
                      daysRemaining: plan.days,
                      totalDays: plan.days,
                      progressPercent: 0,
                    });
                  }}
                  disabled={alreadyActive}
                  className={`w-full py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${alreadyActive ? 'bg-[#F8F7FC] text-[#6B7280] border border-[#EDE9FE] cursor-not-allowed' : 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-md shadow-purple-200/50 hover:opacity-95'}`}
                >
                  {alreadyActive ? (
                    <><Check className="w-3 h-3" /> Already Active</>
                  ) : (
                    <><Plus className="w-3.5 h-3.5" /> Stake Now ({plan.duration})</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== 4. CALCULATOR ===== */}
      <div className="bg-white border border-[#EDE9FE] rounded-[20px] p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#EDE9FE]">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#171717]">Yield Calculator</h3>
            <p className="text-[10px] text-[#6B7280]">Project your passive rewards before staking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div>
              <div className="flex justify-between text-[10px] text-[#6B7280] mb-1 font-semibold">
                <span>Deposit Amount</span>
                <span>{calcAmount.toLocaleString()} XENA ≈ ${(calcAmount * balances.usdRate).toLocaleString()}</span>
              </div>
              <input type="range" min="50" max="50000" step="50" value={calcAmount} onChange={(e) => setCalcAmount(parseFloat(e.target.value))} className="w-full accent-[#7C3AED] cursor-pointer" />
            </div>

            <div>
              <span className="text-[10px] text-[#6B7280] block mb-1.5 font-semibold">Lockup Horizon</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { days: 14, apy: 26.5, label: '2 Weeks', highlight: 'Popular' },
                  { days: 30, apy: 24.2, label: '30 Days', highlight: null },
                  { days: 90, apy: 32.0, label: '90 Days', highlight: null },
                  { days: 180, apy: 52.0, label: '180 Days', highlight: null },
                ].map((item) => (
                  <button key={item.days} type="button"
                    onClick={() => { setCalcDuration(item.days); setCalcApy(item.apy); }}
                    className={`py-1.5 px-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer relative ${calcDuration === item.days ? 'bg-purple-50 text-[#6D28D9] border-purple-200 shadow-xs' : 'bg-[#F8F7FC] text-[#6B7280] border-[#EDE9FE] hover:text-[#171717] hover:bg-white'}`}>
                    {item.highlight && (
                      <span className="absolute -top-1.5 right-1.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-[8px] font-extrabold px-1 py-0.5 rounded-full">{item.highlight}</span>
                    )}
                    <div>{item.label}</div>
                    <div className="text-[9px] text-[#16A34A]">+{item.apy}%</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-3.5 bg-[#F8F7FC] rounded-xl border border-[#EDE9FE] space-y-2">
            <div className="text-[9px] text-[#6B7280] font-bold uppercase tracking-wider">Projected Earnings</div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Daily Rewards</span>
                <span className="font-bold text-[#16A34A] font-mono">+{dailyReturn.toFixed(3)} XENA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Period Earnings</span>
                <span className="font-bold text-[#7C3AED] font-mono">+{calculatedReturn.toFixed(2)} XENA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Fiat at Maturity</span>
                <span className="font-bold text-[#171717] font-mono">${((calcAmount + calculatedReturn) * balances.usdRate).toFixed(2)}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#EDE9FE] flex items-center justify-between">
              <div>
                <span className="text-[9px] text-[#6B7280] block">Total Payout</span>
                <span className="text-sm font-extrabold text-[#171717] font-mono">{(calcAmount + calculatedReturn).toFixed(2)} XENA</span>
              </div>
              <button
                onClick={() => {
                  onStakeNewPlan({
                    id: 'calc-custom',
                    name: `${calcDuration}-Day Custom Vault`,
                    category: 'Calculated',
                    investedAmount: calcAmount,
                    earnedAmount: 0,
                    projectedReturnPercent: calcApy,
                    daysRemaining: calcDuration,
                    totalDays: calcDuration,
                    progressPercent: 0,
                  });
                }}
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-[11px] hover:opacity-95 shadow-xs cursor-pointer">
                Stake {calcAmount.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 5. CS SUPPORT MODAL ===== */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-[20px] shadow-2xl border border-[#EDE9FE] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EDE9FE] bg-[#F8F7FC]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white flex items-center justify-center">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#171717] text-sm">Customer Support</h3>
                  <p className="text-[10px] text-[#6B7280]">24/7 live human assistance for staking</p>
                </div>
              </div>
              <button onClick={() => setShowSupportModal(false)} className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#171717] hover:bg-white transition-colors cursor-pointer">
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-2.5 overflow-y-auto">
              {[
                { icon: MessageCircle, title: 'Live Chat', desc: 'Avg. response 30 seconds', accent: 'bg-purple-50 text-[#7C3AED]' },
                { icon: Mail, title: 'Support Email', desc: 'staking@xena.exchange', accent: 'bg-blue-50 text-blue-600' },
                { icon: ShieldCheck, title: 'Principal Protection Claim', desc: 'File a guarantee claim on any vault', accent: 'bg-emerald-50 text-emerald-600' },
                { icon: Headphones, title: 'Yield Advisors', desc: 'Speak to a vault strategist', accent: 'bg-amber-50 text-amber-600' },
              ].map(({ icon: Icon, title, desc, accent }) => (
                <button key={title} className="w-full flex items-center gap-3 p-3 bg-[#F8F7FC] hover:bg-white border border-[#EDE9FE] hover:border-purple-200 rounded-xl transition-all text-left cursor-pointer group">
                  <span className={`w-9 h-9 rounded-lg ${accent} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-[#171717]">{title}</span>
                    <span className="block text-[10px] text-[#6B7280] truncate">{desc}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#6D28D9] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}

              <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl text-[11px] text-[#6B7280] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                <p>All staking vaults are principal-protected by the XENA Treasury. Rewards are auto-compounded daily.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};