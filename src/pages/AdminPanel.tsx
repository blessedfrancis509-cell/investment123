import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users as UsersIcon,
  ArrowLeftRight,
  Handshake,
  PiggyBank,
  Newspaper,
  LifeBuoy,
  BadgePercent,
  Settings,
  ShieldCheck,
  Search,
  Check,
  X,
  Plus,
  Trash2,
  TrendingUp,
  Eye,
  EyeOff,
  Activity,
  Zap,
  ArrowDownRight,
  ArrowUpRight,
  Mail,
  FileText,
  ChevronRight,
  Lock,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  ClipboardList,
  Timer,
} from 'lucide-react';
import { INITIAL_ANNOUNCEMENTS } from '../data/initialData';

interface Props {
  onNavigateTab: (tab: string) => void;
}

const SEED_USERS = [
  { id: 'u1', name: 'Alex Morgan', email: 'alex.morgan@xena.fi', country: 'Canada', kycTier: 'Tier 2', balance: 12840, status: 'Active' },
  { id: 'u2', name: 'Fatima Abubakar', email: 'fatima.a@xena.fi', country: 'Nigeria', kycTier: 'Tier 2', balance: 4520, status: 'Active' },
  { id: 'u3', name: 'David Chen', email: 'd.chen@xena.fi', country: 'Singapore', kycTier: 'Tier 1', balance: 980, status: 'Active' },
  { id: 'u4', name: 'Grace Okafor', email: 'grace.o@xena.fi', country: 'Ghana', kycTier: 'Tier 1', balance: 1210, status: 'Frozen' },
  { id: 'u5', name: 'Omar Hassan', email: 'omar.h@xena.fi', country: 'UAE', kycTier: 'Tier 3 (Institutional)', balance: 78200, status: 'Active' },
  { id: 'u6', name: 'Lina Kowalski', email: 'lina.k@xena.fi', country: 'Poland', kycTier: 'Tier 2', balance: 3360, status: 'Active' },
  { id: 'u7', name: 'Chen Wei', email: 'chen.wei@xena.fi', country: 'China', kycTier: 'Tier 1', balance: 540, status: 'Pending KYC' },
  { id: 'u8', name: 'Sara Mensah', email: 'sara.m@xena.fi', country: 'Kenya', kycTier: 'Tier 1', balance: 720, status: 'Active' },
];

const SEED_TXS = [
  { id: 't1', user: 'Alex Morgan', type: 'Deposit', amount: 2500, unit: 'XENA', status: 'Completed', time: '2 min ago', method: 'USDT' },
  { id: 't2', user: 'Fatima Abubakar', type: 'Withdrawal', amount: 1500, unit: 'XENA', status: 'Pending', time: '8 min ago', method: 'NGN Bank' },
  { id: 't3', user: 'Omar Hassan', type: 'P2P Sell', amount: 5000, unit: 'XENA', status: 'Completed', time: '22 min ago', method: 'Escrow' },
  { id: 't4', user: 'David Chen', type: 'Deposit', amount: 400, unit: 'XENA', status: 'Completed', time: '1 hr ago', method: 'BTC' },
  { id: 't5', user: 'Lina Kowalski', type: 'Withdrawal', amount: 800, unit: 'XENA', status: 'Pending', time: '2 hrs ago', method: 'USDT' },
  { id: 't6', user: 'Grace Okafor', type: 'P2P Buy', amount: 200, unit: 'XENA', status: 'Failed', time: '3 hrs ago', method: 'Escrow' },
  { id: 't7', user: 'Sara Mensah', type: 'Investment', amount: 50, unit: 'XENA', status: 'Completed', time: '5 hrs ago', method: 'Vault' },
  { id: 't8', user: 'Chen Wei', type: 'Withdrawal', amount: 120, unit: 'XENA', status: 'Completed', time: '8 hrs ago', method: 'SOL' },
];

const SEED_MERCHANTS = [
  { id: 'm1', name: 'CryptoDesk NG', owner: 'Fatima Abubakar', verified: true, orders: 1240, rating: 98.6 },
  { id: 'm2', name: 'QuickXchange', owner: 'David Chen', verified: false, orders: 312, rating: 92.1 },
  { id: 'm3', name: 'AfriTrade Hub', owner: 'Sara Mensah', verified: true, orders: 860, rating: 97.2 },
  { id: 'm4', name: 'Gulf Prime', owner: 'Omar Hassan', verified: true, orders: 2210, rating: 99.1 },
  { id: 'm5', name: 'EuroBridge', owner: 'Lina Kowalski', verified: false, orders: 145, rating: 88.4 },
];

const SEED_DISPUTES = [
  { id: 'd1', offer: 'CryptoDesk NG', buyer: 'User 8842', seller: 'Fatima Abubakar', amount: 1500, reason: 'Payment not received', status: 'Open' },
  { id: 'd2', offer: 'Gulf Prime', buyer: 'User 1201', seller: 'Omar Hassan', amount: 3200, reason: 'Wrong NGN amount credited', status: 'Open' },
  { id: 'd3', offer: 'AfriTrade Hub', buyer: 'User 5530', seller: 'Sara Mensah', amount: 800, reason: 'Seller wants release without proof', status: 'Escalated' },
];

const SEED_TICKETS = [
  { id: 's1', user: 'Alex Morgan', subject: 'Withdrawal stuck on Pending', status: 'Open', priority: 'High', time: '12 min ago' },
  { id: 's2', user: 'Omar Hassan', subject: 'KYC tier upgrade request', status: 'Open', priority: 'Medium', time: '45 min ago' },
  { id: 's3', user: 'Chen Wei', subject: 'Cannot verify identity documents', status: 'Pending', priority: 'High', time: '2 hrs ago' },
  { id: 's4', user: 'Grace Okafor', subject: 'Account frozen — appeal', status: 'Resolved', priority: 'Low', time: '1 day ago' },
];

const SEED_PROMOS = [
  { id: 'p1', code: 'XENA25', value: 25, unit: 'USD', used: 842, cap: 1000, active: true },
  { id: 'p2', code: 'WELCOME10', value: 10, unit: 'XENA', used: 1210, cap: 2500, active: true },
  { id: 'p3', code: 'STAKER20', value: 20, unit: 'USD', used: 320, cap: 500, active: false },
];

const SEED_AUDIT = [
  { id: 'a1', action: 'Admin login', actor: 'Super Admin', detail: 'Signed in from 192.168.1.4', time: '2 min ago' },
  { id: 'a2', action: 'Wallet freeze', actor: 'admin@xena.fi', detail: 'Froze account Grace Okafor', time: '1 hr ago' },
  { id: 'a3', action: 'KYC approval', actor: 'KYC Officer', detail: 'Upgraded Chen Wei to Tier 1', time: '3 hrs ago' },
  { id: 'a4', action: 'Payout run', actor: 'System', detail: 'Auto-compounded 1,240 vaults', time: '6 hrs ago' },
  { id: 'a5', action: 'Settings change', actor: 'Super Admin', detail: 'Maintenance mode disabled', time: '1 day ago' },
];

const VAULTS = [
  { category: 'Flexible', apy: 12.0, staked: 82000, plans: 412 },
  { category: '2-Week (14D)', apy: 20.0, staked: 134000, plans: 980 },
  { category: 'Fixed Term (30D)', apy: 28.0, staked: 61000, plans: 355 },
  { category: 'VIP Tier', apy: 42.0, staked: 188000, plans: 210 },
  { category: 'Institutional', apy: 52.0, staked: 420000, plans: 64 },
];

const TxStatusTone: Record<string, string> = {
  Completed: 'bg-emerald-50 text-[#16A34A] border-emerald-100',
  Pending: 'bg-amber-50 text-amber-600 border-amber-100',
  Failed: 'bg-red-50 text-red-600 border-red-100',
};

export const AdminPanel: React.FC<Props> = ({ onNavigateTab }) => {
  const [section, setSection] = useState<string>('dashboard');
  const [notice, setNotice] = useState<string | null>(null);

  const [users, setUsers] = useState(SEED_USERS);
  const [txs, setTxs] = useState(SEED_TXS);
  const [merchants, setMerchants] = useState(SEED_MERCHANTS);
  const [disputes, setDisputes] = useState(SEED_DISPUTES);
  const [tickets, setTickets] = useState(SEED_TICKETS);
  const [promos, setPromos] = useState(SEED_PROMOS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS as any[]);
  const [audit, setAudit] = useState(SEED_AUDIT);

  const [userQuery, setUserQuery] = useState('');
  const [txFilter, setTxFilter] = useState('All');
  const [ticketQuery, setTicketQuery] = useState('');

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [p2pZeroFee, setP2pZeroFee] = useState(true);
  const [withdrawApproval, setWithdrawApproval] = useState(true);

  const [showNewAnn, setShowNewAnn] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnTag, setNewAnnTag] = useState('');
  const [newAnnSummary, setNewAnnSummary] = useState('');

  const notify = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(userQuery.toLowerCase()) || u.email.toLowerCase().includes(userQuery.toLowerCase()) || u.country.toLowerCase().includes(userQuery.toLowerCase())
  );
  const filteredTxs = txs.filter((t) => txFilter === 'All' || t.status === txFilter);
  const filteredTickets = tickets.filter(
    (t) => t.subject.toLowerCase().includes(ticketQuery.toLowerCase()) || t.user.toLowerCase().includes(ticketQuery.toLowerCase())
  );

  const kpi = {
    totalUsers: '48,203',
    activeUsers: '12,840',
    volume24h: '$8.4M',
    xenaCirculation: '250M',
    totalStaked: '885K',
    pendingPayouts: 3,
  };

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'p2p', label: 'P2P Marketplace', icon: Handshake },
    { id: 'investments', label: 'Investments & Staking', icon: PiggyBank },
    { id: 'announcements', label: 'Announcements', icon: Newspaper },
    { id: 'support', label: 'Support Tickets', icon: LifeBuoy },
    { id: 'promos', label: 'Promo Codes', icon: BadgePercent },
    { id: 'system', label: 'System & Audit', icon: Settings },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in" id="admin-panel-view">
      {/* Admin Header */}
      <div className="bg-gradient-to-br from-[#1E1B4B] via-[#7C3AED] to-[#DB2777] rounded-[22px] p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">Admin Control Center</h1>
                <span className="px-2 py-0.5 rounded-md bg-white/15 border border-white/25 text-[9px] font-extrabold uppercase tracking-wide">Staff</span>
              </div>
              <p className="text-[11px] text-purple-100">Manage users, markets, staking, announcements and support</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('home')}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer backdrop-blur self-start sm:self-auto"
          >
            <X className="w-3.5 h-3.5" /> Exit Admin
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-[#16A34A] flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Sidebar */}
        <div className="md:col-span-3 bg-white border border-[#EDE9FE] rounded-[20px] p-2 shadow-sm md:sticky md:top-20">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {nav.map(({ id, label, icon: Icon }) => {
              const isActive = section === id;
              return (
                <button
                  key={id}
                  onClick={() => setSection(id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-1 md:flex-none ${
                    isActive ? 'bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white shadow-md shadow-fuchsia-200/50' : 'text-[#6B7280] hover:text-[#171717] hover:bg-[#F8F7FC]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{label}</span>
                  {isActive && <span className="ml-auto hidden md:block w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-9 space-y-4">
          {/* ============ DASHBOARD ============ */}
          {section === 'dashboard' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Total Users', value: kpi.totalUsers, icon: UsersIcon, tone: 'bg-purple-50 text-[#7C3AED]' },
                  { label: 'Active Users', value: kpi.activeUsers, icon: Activity, tone: 'bg-emerald-50 text-emerald-600' },
                  { label: '24h Volume', value: kpi.volume24h, icon: TrendingUp, tone: 'bg-sky-50 text-sky-600' },
                  { label: 'XENA in Circulation', value: kpi.xenaCirculation, icon: Zap, tone: 'bg-amber-50 text-amber-600' },
                  { label: 'Total Staked', value: kpi.totalStaked, icon: PiggyBank, tone: 'bg-fuchsia-50 text-fuchsia-600' },
                  { label: 'Pending Payouts', value: kpi.pendingPayouts, icon: Timer, tone: 'bg-red-50 text-red-500' },
                ].map(({ label, value, icon: Icon, tone }) => (
                  <div key={label} className="bg-white border border-[#EDE9FE] rounded-2xl p-3.5 shadow-sm">
                    <span className={`w-8 h-8 rounded-lg ${tone} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="block text-lg font-extrabold text-[#171717] font-mono mt-2">{value}</span>
                    <span className="block text-[10px] text-[#6B7280] font-semibold mt-0.5">{label}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                  <h3 className="text-sm font-bold text-[#171717]">Platform Health</h3>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">All systems operational</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {[
                    { label: 'API Uptime', value: '99.98%', bar: 99 },
                    { label: 'Escrow Protection', value: '100%', bar: 100 },
                    { label: 'KYC Throughput', value: '94%', bar: 94 },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <span className="block text-base font-extrabold text-[#171717] font-mono">{s.value}</span>
                      <span className="block text-[9px] text-[#6B7280] mt-0.5 mb-1.5">{s.label}</span>
                      <div className="h-1.5 bg-[#EDE9FE] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-full" style={{ width: `${s.bar}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setSection('transactions')} className="w-full flex items-center justify-between bg-white border border-[#EDE9FE] rounded-2xl p-4 hover:border-purple-200 transition-colors cursor-pointer shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><AlertTriangle className="w-4 h-4" /></span>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-[#171717]">{kpi.pendingPayouts} withdrawals awaiting approval</span>
                    <span className="block text-[10px] text-[#6B7280]">Review pending payouts now</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B7280]" />
              </button>

              <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                  <h3 className="text-sm font-bold text-[#171717]">Recent Admin Activity</h3>
                  <button onClick={() => setSection('system')} className="text-[10px] font-bold text-[#6D28D9] hover:underline cursor-pointer">View all</button>
                </div>
                <div className="divide-y divide-[#EDE9FE]">
                  {audit.map((a) => (
                    <div key={a.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <span className="font-bold text-[#171717] block">{a.action}</span>
                        <span className="text-[10px] text-[#6B7280] block truncate">{a.detail}</span>
                      </div>
                      <span className="text-[9px] text-[#9CA3AF] shrink-0">{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============ USERS ============ */}
          {section === 'users' && (
            <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EDE9FE]">
                <h3 className="text-sm font-bold text-[#171717]">User Management</h3>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder="Search name, email, country..." className="w-full sm:w-64 pl-9 pr-3 py-2 bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#7C3AED] transition-all" />
                </div>
              </div>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs min-w-[560px]">
                  <thead>
                    <tr className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-bold border-b border-[#EDE9FE]">
                      <th className="py-2 pr-3">User</th>
                      <th className="py-2 pr-3">Country</th>
                      <th className="py-2 pr-3">KYC</th>
                      <th className="py-2 pr-3 text-right">Balance (XENA)</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE9FE]">
                    {filteredUsers.map((u) => {
                      const frozen = u.status === 'Frozen';
                      return (
                        <tr key={u.id} className="hover:bg-[#F8F7FC]">
                          <td className="py-2.5 pr-3">
                            <span className="block font-bold text-[#171717]">{u.name}</span>
                            <span className="block text-[10px] text-[#6B7280]">{u.email}</span>
                          </td>
                          <td className="py-2.5 pr-3 text-[#6B7280]">{u.country}</td>
                          <td className="py-2.5 pr-3"><span className="text-[10px] font-bold text-[#6D28D9] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">{u.kycTier}</span></td>
                          <td className="py-2.5 pr-3 text-right font-mono font-bold text-[#171717]">{u.balance.toLocaleString()}</td>
                          <td className="py-2.5 pr-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${frozen ? 'bg-red-50 text-red-600 border-red-100' : u.status === 'Pending KYC' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-[#16A34A] border-emerald-100'}`}>{u.status}</span>
                          </td>
                          <td className="py-2.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: frozen ? 'Active' : 'Frozen' } : x));
                                notify(`${u.name} ${frozen ? 'unfrozen' : 'frozen'}`);
                              }}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${frozen ? 'bg-emerald-50 text-[#16A34A] border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}
                            >
                              {frozen ? 'Unfreeze' : 'Freeze'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && <p className="text-center text-xs text-[#9CA3AF] py-6">No users match your search.</p>}
              </div>
            </div>
          )}

          {/* ============ TRANSACTIONS ============ */}
          {section === 'transactions' && (
            <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                <h3 className="text-sm font-bold text-[#171717]">Transaction Monitoring</h3>
                <div className="flex bg-[#F8F7FC] p-0.5 rounded-lg border border-[#EDE9FE] text-[10px] font-bold">
                  {['All', 'Completed', 'Pending', 'Failed'].map((s) => (
                    <button key={s} onClick={() => setTxFilter(s)} className={`px-2.5 py-1 rounded-md cursor-pointer transition-all ${txFilter === s ? 'bg-[#6D28D9] text-white' : 'text-[#6B7280] hover:text-[#171717]'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs min-w-[560px]">
                  <thead>
                    <tr className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-bold border-b border-[#EDE9FE]">
                      <th className="py-2 pr-3">User</th>
                      <th className="py-2 pr-3">Type</th>
                      <th className="py-2 pr-3 text-right">Amount</th>
                      <th className="py-2 pr-3">Method</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE9FE]">
                    {filteredTxs.map((t) => (
                      <tr key={t.id} className="hover:bg-[#F8F7FC]">
                        <td className="py-2.5 pr-3 font-bold text-[#171717]">{t.user}</td>
                        <td className="py-2.5 pr-3 text-[#6B7280]">{t.type}</td>
                        <td className="py-2.5 pr-3 text-right font-mono font-bold text-[#171717]">{t.amount.toLocaleString()} {t.unit}</td>
                        <td className="py-2.5 pr-3 text-[#6B7280]">{t.method}</td>
                        <td className="py-2.5 pr-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TxStatusTone[t.status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>{t.status}</span></td>
                        <td className="py-2.5">
                          {t.status === 'Pending' ? (
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => { setTxs((prev) => prev.map((x) => x.id === t.id ? { ...x, status: 'Completed' } : x)); notify('Withdrawal approved'); }} className="px-2 py-1 rounded-lg bg-emerald-50 text-[#16A34A] text-[10px] font-bold border border-emerald-100 cursor-pointer">Approve</button>
                              <button onClick={() => { setTxs((prev) => prev.map((x) => x.id === t.id ? { ...x, status: 'Failed' } : x)); notify('Withdrawal rejected'); }} className="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 cursor-pointer">Reject</button>
                            </div>
                          ) : (
                            <span className="text-[9px] text-[#9CA3AF]">{t.time}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ P2P ============ */}
          {section === 'p2p' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#171717] pb-3 border-b border-[#EDE9FE]">Merchant Verification</h3>
                <div className="divide-y divide-[#EDE9FE]">
                  {merchants.map((m) => (
                    <div key={m.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-[#171717]">{m.name}</span>
                        <span className="block text-[10px] text-[#6B7280]">{m.owner} · {m.orders.toLocaleString()} orders · {m.rating}%</span>
                      </div>
                      <button
                        onClick={() => { setMerchants((prev) => prev.map((x) => x.id === m.id ? { ...x, verified: !x.verified } : x)); notify(`${m.name} ${m.verified ? 'unverified' : 'verified'}`); }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer shrink-0 ${m.verified ? 'bg-emerald-50 text-[#16A34A] border-emerald-100' : 'bg-[#F8F7FC] text-[#6B7280] border-[#EDE9FE]'}`}
                      >
                        {m.verified ? <><Check className="w-3 h-3 inline mr-1" />Verified</> : <><EyeOff className="w-3 h-3 inline mr-1" />Unverified</>}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#171717] pb-3 border-b border-[#EDE9FE]">Escrow Disputes</h3>
                <div className="divide-y divide-[#EDE9FE]">
                  {disputes.map((d) => (
                    <div key={d.id} className="py-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#171717]">{d.offer} · {d.amount.toLocaleString()} XENA</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${d.status === 'Escalated' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{d.status}</span>
                      </div>
                      <span className="block text-[10px] text-[#6B7280] mt-0.5">Buyer {d.buyer} vs Seller {d.seller} — {d.reason}</span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <button onClick={() => { setDisputes((prev) => prev.filter((x) => x.id !== d.id)); notify('Resolved in favor of buyer'); }} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#16A34A] text-[10px] font-bold border border-emerald-100 cursor-pointer">For Buyer</button>
                        <button onClick={() => { setDisputes((prev) => prev.filter((x) => x.id !== d.id)); notify('Resolved in favor of seller'); }} className="px-2.5 py-1 rounded-lg bg-purple-50 text-[#6D28D9] text-[10px] font-bold border border-purple-100 cursor-pointer">For Seller</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============ INVESTMENTS ============ */}
          {section === 'investments' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{ l: 'Total Staked', v: '885K XENA' }, { l: 'Active Vaults', v: '2,021' }, { l: 'Avg APY', v: '30.8%' }, { l: 'Daily Compounding', v: '1,240' }].map((s) => (
                  <div key={s.l} className="bg-white border border-[#EDE9FE] rounded-2xl p-3.5 shadow-sm">
                    <span className="block text-lg font-extrabold text-[#171717] font-mono">{s.v}</span>
                    <span className="block text-[10px] text-[#6B7280] font-semibold mt-0.5">{s.l}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#171717] pb-3 border-b border-[#EDE9FE]">Vault Categories & APY</h3>
                <div className="divide-y divide-[#EDE9FE]">
                  {VAULTS.map((v) => (
                    <div key={v.category} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-[#171717]">{v.category}</span>
                        <span className="block text-[10px] text-[#6B7280]">{v.staked.toLocaleString()} XENA staked · {v.plans} plans</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => notify(`${v.category} APY adjusted`) } className="px-2.5 py-1 rounded-lg bg-[#F8F7FC] text-[#6B7280] text-[10px] font-bold border border-[#EDE9FE] cursor-pointer">-</button>
                        <span className="text-xs font-extrabold text-[#6D28D9] font-mono w-12 text-center">{v.apy.toFixed(1)}%</span>
                        <button onClick={() => notify(`${v.category} APY adjusted`) } className="px-2.5 py-1 rounded-lg bg-[#F8F7FC] text-[#6B7280] text-[10px] font-bold border border-[#EDE9FE] cursor-pointer">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#EDE9FE]">
                  <button onClick={() => notify('Manual payout run triggered')} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-[10px] font-bold cursor-pointer">Run Manual Payout</button>
                  <button onClick={() => notify('Payout schedule saved')} className="px-3 py-1.5 rounded-lg bg-[#F8F7FC] border border-[#EDE9FE] text-[#6B7280] text-[10px] font-bold cursor-pointer">Edit Schedule</button>
                </div>
              </div>
            </div>
          )}

          {/* ============ ANNOUNCEMENTS ============ */}
          {section === 'announcements' && (
            <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                <h3 className="text-sm font-bold text-[#171717]">Announcements &amp; News</h3>
                <button onClick={() => setShowNewAnn(!showNewAnn)} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"><Plus className="w-3 h-3" /> New</button>
              </div>

              {showNewAnn && (
                <div className="mt-3 p-3 bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl space-y-2">
                  <input value={newAnnTitle} onChange={(e) => setNewAnnTitle(e.target.value)} placeholder="Announcement title" className="w-full px-3 py-2 bg-white border border-[#EDE9FE] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#7C3AED]" />
                  <div className="flex gap-2">
                    <input value={newAnnTag} onChange={(e) => setNewAnnTag(e.target.value)} placeholder="Tag (e.g. Promotion)" className="w-1/3 px-3 py-2 bg-white border border-[#EDE9FE] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#7C3AED]" />
                    <input value={newAnnSummary} onChange={(e) => setNewAnnSummary(e.target.value)} placeholder="Summary" className="flex-1 px-3 py-2 bg-white border border-[#EDE9FE] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#7C3AED]" />
                  </div>
                  <button
                    onClick={() => {
                      if (!newAnnTitle.trim()) return;
                      setAnnouncements((prev) => [{ id: `ann-${Date.now()}`, title: newAnnTitle, date: 'Just now', tag: newAnnTag || 'Update', tagColor: 'bg-purple-50 text-[#6D28D9] border-purple-100', summary: newAnnSummary || 'New announcement published.', actionText: 'Read More' }, ...prev]);
                      setNewAnnTitle(''); setNewAnnTag(''); setNewAnnSummary(''); setShowNewAnn(false);
                      notify('Announcement published');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#6D28D9] text-white text-[10px] font-bold cursor-pointer"
                  >
                    Publish
                  </button>
                </div>
              )}

              <div className="divide-y divide-[#EDE9FE] mt-2">
                {announcements.map((ann) => (
                  <div key={ann.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${ann.tagColor || 'bg-purple-50 text-[#6D28D9] border-purple-100'}`}>{ann.tag || 'Update'}</span>
                        <span className="text-[9px] text-[#9CA3AF]">{ann.date}</span>
                      </div>
                      <span className="block text-xs font-bold text-[#171717] mt-1">{ann.title}</span>
                      <span className="block text-[10px] text-[#6B7280] mt-0.5 line-clamp-1">{ann.summary}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => { setAnnouncements((prev) => prev.map((x) => x.id === ann.id ? { ...x, publishedAt: Date.now(), tagColor: ann.tagColor || 'bg-purple-50 text-[#6D28D9] border-purple-100' } : x)); notify('Updated'); }} className="px-2 py-1 rounded-lg bg-[#F8F7FC] text-[#6B7280] text-[10px] font-bold border border-[#EDE9FE] cursor-pointer">Edit</button>
                      <button onClick={() => { setAnnouncements((prev) => prev.filter((x) => x.id !== ann.id)); notify('Announcement deleted'); }} className="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ SUPPORT ============ */}
          {section === 'support' && (
            <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EDE9FE]">
                <h3 className="text-sm font-bold text-[#171717]">Support Tickets</h3>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input value={ticketQuery} onChange={(e) => setTicketQuery(e.target.value)} placeholder="Search tickets..." className="w-full sm:w-56 pl-9 pr-3 py-2 bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#7C3AED] transition-all" />
                </div>
              </div>
              <div className="divide-y divide-[#EDE9FE] mt-2">
                {filteredTickets.map((t) => (
                  <div key={t.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#171717]">{t.subject}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${t.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : t.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>{t.priority}</span>
                      </div>
                      <span className="block text-[10px] text-[#6B7280] mt-0.5">{t.user} · {t.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${t.status === 'Resolved' ? 'bg-emerald-50 text-[#16A34A] border-emerald-100' : t.status === 'Open' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-sky-50 text-sky-600 border-sky-100'}`}>{t.status}</span>
                      <button onClick={() => { setTickets((prev) => prev.map((x) => x.id === t.id ? { ...x, status: 'Resolved' } : x)); notify('Ticket marked resolved'); }} className="px-2 py-1 rounded-lg bg-emerald-50 text-[#16A34A] text-[10px] font-bold border border-emerald-100 cursor-pointer"><Check className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ PROMOS ============ */}
          {section === 'promos' && (
            <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-[#171717] pb-3 border-b border-[#EDE9FE]">Bonus &amp; Promo Codes</h3>
              <div className="divide-y divide-[#EDE9FE]">
                {promos.map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="inline-block text-[11px] font-bold text-[#6D28D9] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 font-mono">{p.code}</span>
                      <span className="block text-[10px] text-[#6B7280] mt-1">{p.value} {p.unit} · {p.used.toLocaleString()}/{p.cap.toLocaleString()} used</span>
                      <div className="h-1.5 bg-[#EDE9FE] rounded-full overflow-hidden mt-1 max-w-xs">
                        <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-full" style={{ width: `${Math.min(100, (p.used / p.cap) * 100)}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => { setPromos((prev) => prev.map((x) => x.id === p.id ? { ...x, active: !x.active } : x)); notify(`${p.code} ${p.active ? 'deactivated' : 'activated'}`); }} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${p.active ? 'bg-emerald-50 text-[#16A34A] border-emerald-100' : 'bg-[#F8F7FC] text-[#6B7280] border-[#EDE9FE]'}`}>{p.active ? 'Active' : 'Off'}</button>
                      <button onClick={() => { setPromos((prev) => prev.filter((x) => x.id !== p.id)); notify(`${p.code} deleted`); }} className="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => notify('Promo code created')} className="mt-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"><Plus className="w-3 h-3" /> Create Code</button>
            </div>
          )}

          {/* ============ SYSTEM ============ */}
          {section === 'system' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#171717] pb-3 border-b border-[#EDE9FE]">Platform Settings</h3>
                <div className="space-y-3 mt-3">
                  {[
                    { id: 'maintenance', label: 'Maintenance Mode', desc: 'Temporarily block logins & trading', value: maintenanceMode, setter: setMaintenanceMode },
                    { id: 'p2p', label: 'P2P 0% Fee Promotion', desc: 'Keep maker & taker fees at zero', value: p2pZeroFee, setter: setP2pZeroFee },
                    { id: 'withdraw', label: 'Manual Withdrawal Approval', desc: 'Require admin approval for payouts', value: withdrawApproval, setter: setWithdrawApproval },
                  ].map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 bg-[#F8F7FC] rounded-xl border border-[#EDE9FE]">
                      <div>
                        <span className="block text-xs font-bold text-[#171717]">{t.label}</span>
                        <span className="block text-[10px] text-[#6B7280]">{t.desc}</span>
                      </div>
                      <button
                        role="switch"
                        aria-checked={t.value}
                        onClick={() => { t.setter(!t.value); notify(`${t.label} ${!t.value ? 'enabled' : 'disabled'}`); }}
                        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${t.value ? 'bg-[#7C3AED]' : 'bg-slate-200'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${t.value ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#EDE9FE] rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#171717] pb-3 border-b border-[#EDE9FE]">Audit Log</h3>
                <div className="divide-y divide-[#EDE9FE]">
                  {audit.map((a) => (
                    <div key={a.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <ClipboardList className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="font-bold text-[#171717] block">{a.action}</span>
                          <span className="text-[10px] text-[#6B7280] block">{a.detail}</span>
                        </div>
                      </div>
                      <span className="text-[9px] text-[#9CA3AF] shrink-0">{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
