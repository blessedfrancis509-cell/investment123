import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  UserRound,
  Mail,
  Phone,
  Lock,
  Bell,
  Globe2,
  Palette,
  ShieldCheck,
  Smartphone,
  KeyRound,
  Check,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  Download,
  Compass,
  Moon,
  Monitor,
  Clock,
  Package,
  FileDown,
  Shield,
  Info,
  Languages,
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateSecurity: (settings: { twoFactor: boolean; pinSet: boolean }) => void;
  onSelectTab: (tab: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUpdateSecurity, onSelectTab }) => {
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'appearance' | 'security'>('account');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Account
  const [displayName, setDisplayName] = useState(user.name);
  const [emailAddr, setEmailAddr] = useState(user.email);
  const [phone, setPhone] = useState('+1 (415) 555-0198');
  const [country, setCountry] = useState('United States');
  const [language, setLanguage] = useState('English (US)');
  const [tz, setTz] = useState('(GMT-08:00) Pacific Time');

  // Password
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);

  // Security toggles
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [pinSet, setPinSet] = useState(user.pinSet);
  const [withdrawalConfirmation, setWithdrawalConfirmation] = useState(true);
  const [sessionTracking, setSessionTracking] = useState(true);

  // Notifications
  const [notifPrefs, setNotifPrefs] = useState({
    security: true,
    price: true,
    yields: true,
    trades: true,
    p2p: true,
    marketAnnouncements: false,
    promotions: false,
  });
  const notifChannels = ['Email', 'Push', 'SMS'];

  // Appearance
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [accent, setAccent] = useState('purple');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const notify = (msg: string, ms = 2600) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), ms);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    notify('Account information saved successfully.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) {
      notify('New password must be at least 8 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      notify('New passwords do not match.');
      return;
    }
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    notify('Password changed successfully. All sessions will be refreshed.');
  };

  const handleToggle2FA = () => {
    const next = !twoFactor;
    setTwoFactor(next);
    onUpdateSecurity({ twoFactor: next, pinSet });
    notify(next ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.');
  };

  const handleTogglePIN = () => {
    const next = !pinSet;
    setPinSet(next);
    onUpdateSecurity({ twoFactor, pinSet: next });
    notify(next ? '6-digit security PIN enabled.' : 'Security PIN removed.');
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: UserRound },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Language & Appearance', icon: Palette },
    { id: 'security', label: 'Security & Privacy', icon: ShieldCheck },
  ] as const;

  const card = 'bg-white border border-[#EDE9FE] rounded-[20px] p-5 sm:p-6 shadow-sm';

  const rowCard = (title: string, desc: string, checked: boolean, onChange: () => void) => (
    <div className="flex items-center justify-between p-3.5 bg-[#F8F7FC] rounded-xl border border-[#EDE9FE]">
      <div>
        <h4 className="text-xs font-bold text-[#171717]">{title}</h4>
        <p className="text-[11px] text-[#6B7280] mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${checked ? 'bg-[#7C3AED]' : 'bg-slate-200'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in" id="settings-page-view">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5B21B6] via-[#6D28D9] to-[#7C3AED] rounded-[22px] p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 backdrop-blur flex items-center justify-center">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">Account Settings</h1>
              <p className="text-xs text-purple-100">Manage your account, notifications, appearance, and privacy.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold">
            <span className="px-3 py-1.5 rounded-full bg-white/15 border border-white/25 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Security Score 98%
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/15 border border-white/25">{user.kycTier}</span>
          </div>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-[#16A34A] flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Sub-tab Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#EDE9FE]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive ? 'bg-[#6D28D9] text-white shadow-xs' : 'bg-white text-[#6B7280] hover:text-[#171717] border border-[#EDE9FE]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============ ACCOUNT ============ */}
      {activeTab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Personal Information */}
          <form onSubmit={handleSaveAccount} className={`${card} space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                <UserRound className="w-4 h-4 text-[#6D28D9]" /> Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#171717] block mb-1">Display Name</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#171717] block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailAddr}
                    onChange={(e) => setEmailAddr(e.target.value)}
                    className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2 pl-8 text-xs font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] focus:bg-white"
                  />
                  <Mail className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#171717] block mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2 pl-8 text-xs font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] focus:bg-white"
                  />
                  <Phone className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#16A34A] bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                    VERIFIED
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#171717] block mb-1">Country / Region</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                >
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>France</option>
                  <option>Japan</option>
                  <option>Singapore</option>
                  <option>United Arab Emirates</option>
                  <option>Canada</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#EDE9FE] text-[11px] text-[#6B7280] flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-[#6D28D9] shrink-0 mt-0.5" />
              <span>
                Your identity verification (KYC Level 2) locks your legal name and date of birth. Contact our
                <button onClick={() => onSelectTab('announcements')} className="text-[#6D28D9] font-bold mx-1 hover:underline cursor-pointer">support desk</button>
                to correct document-bound details.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-xs hover:shadow-[0_4px_16px_rgba(109,40,217,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </form>

          {/* Change Password */}
          <form onSubmit={handleChangePassword} className={`${card} space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#6D28D9]" /> Password & Sign-In
              </h3>
              <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Last changed 38 days ago
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#171717] block mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    required
                    className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2 pr-9 text-xs font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6D28D9] cursor-pointer">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#171717] block mb-1">New Password</label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    required
                    className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#171717] block mb-1">Confirm New</label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    required
                    className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2 text-xs font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
                  />
                </div>
              </div>
              <p className="text-[10px] text-[#6B7280]">
                Password requirements: minimum 8 characters, one uppercase letter, one number, and one symbol.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" /> Update Password
            </button>
          </form>
        </div>
      )}

      {/* ============ NOTIFICATIONS ============ */}
      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <div className={`${card} space-y-3`}>
            <div className="pb-3 border-b border-[#EDE9FE]">
              <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#6D28D9]" /> Alert Categories
              </h3>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Choose which events send you alerts</p>
            </div>
            {rowCard('Security Alerts', 'Login attempts, withdrawals, and 2FA changes', notifPrefs.security, () =>
              setNotifPrefs((p) => ({ ...p, security: !p.security }))
            )}
            {rowCard('Price Alerts', 'XENA market price movements & threshold triggers', notifPrefs.price, () =>
              setNotifPrefs((p) => ({ ...p, price: !p.price }))
            )}
            {rowCard('Yield & Staking Rewards', 'Daily yields, maturity notices, and claim reminders', notifPrefs.yields, () =>
              setNotifPrefs((p) => ({ ...p, yields: !p.yields }))
            )}
            {rowCard('Trade Executions', 'Filled spot orders and instant swap confirmations', notifPrefs.trades, () =>
              setNotifPrefs((p) => ({ ...p, trades: !p.trades }))
            )}
            {rowCard('P2P Orders & Chat', 'New P2P orders, releases, and merchant messages', notifPrefs.p2p, () =>
              setNotifPrefs((p) => ({ ...p, p2p: !p.p2p }))
            )}
            {rowCard('Market Announcements', 'New yield vaults and ecosystem updates', notifPrefs.marketAnnouncements, () =>
              setNotifPrefs((p) => ({ ...p, marketAnnouncements: !p.marketAnnouncements }))
            )}
            {rowCard('Promotions & Bonuses', 'Exclusive offers, fee discounts, and airdrops', notifPrefs.promotions, () =>
              setNotifPrefs((p) => ({ ...p, promotions: !p.promotions }))
            )}
            <button
              onClick={() => notify('Notification preferences saved.')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-xs hover:shadow-[0_4px_16px_rgba(109,40,217,0.3)] transition-all cursor-pointer"
            >
              Save Notification Preferences
            </button>
          </div>

          <div className="space-y-6">
            <div className={`${card} space-y-3`}>
              <div className="pb-3 border-b border-[#EDE9FE]">
                <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#6D28D9]" /> Delivery Channels
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Where you receive your alerts</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {notifChannels.map((ch) => (
                  <div key={ch} className="p-3 bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl text-center">
                    <span className="text-lg font-extrabold text-[#6D28D9] block">{ch[0]}</span>
                    <span className="text-[11px] font-bold text-[#171717]">{ch}</span>
                    <span className="text-[9px] text-[#16A34A] font-bold block">Active</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-[11px] text-[#6B7280] flex items-start gap-2">
                <Bell className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                <span>Push notifications sync with the XENA mobile app. SMS charges may apply based on your operator.</span>
              </div>
            </div>

            {rowCard(
              'Quiet Hours',
              'Pause non-security alerts between 10:00 PM – 8:00 AM (local time)',
              false,
              () => notify('Quiet hours will respect your device timezone.')
            )}
            <div className="flex items-center justify-between p-3.5 bg-[#F8F7FC] rounded-xl border border-[#EDE9FE]">
              <div>
                <h4 className="text-xs font-bold text-[#171717]">Email Summary Digest</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Weekly recap of portfolio & yield performance</p>
              </div>
              <select className="bg-white border border-[#EDE9FE] rounded-lg px-2 py-1.5 text-[11px] font-bold text-[#171717] focus:outline-none cursor-pointer">
                <option>Weekly (Sunday)</option>
                <option>Daily</option>
                <option>Monthly</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ============ LANGUAGE & APPEARANCE ============ */}
      {activeTab === 'appearance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <div className={`${card} space-y-4`}>
            <div className="pb-3 border-b border-[#EDE9FE]">
              <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#6D28D9]" /> Language & Region
              </h3>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#171717] block mb-1">Interface Language</label>
              <div className="relative">
                <Languages className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 cursor-pointer"
                >
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Español</option>
                  <option>Deutsch</option>
                  <option>Français</option>
                  <option>日本語</option>
                  <option>한국어</option>
                  <option>中文 (简体)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#171717] block mb-1">Time Zone</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={tz}
                  onChange={(e) => setTz(e.target.value)}
                  className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 cursor-pointer"
                >
                  <option>(GMT-08:00) Pacific Time</option>
                  <option>(GMT-05:00) Eastern Time</option>
                  <option>(GMT+00:00) London</option>
                  <option>(GMT+01:00) Berlin</option>
                  <option>(GMT+09:00) Tokyo</option>
                  <option>(GMT+08:00) Singapore</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#171717] block mb-1">Display Currency</label>
              <div className="flex bg-[#F8F7FC] rounded-xl border border-[#EDE9FE] p-1">
                {(['USD', 'EUR', 'GBP'] as const).map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setCurrency(cur)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                      currency === cur ? 'bg-[#6D28D9] text-white' : 'text-[#6B7280] hover:text-[#171717]'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-[#F8F7FC] rounded-xl border border-[#EDE9FE]">
              <div>
                <h4 className="text-xs font-bold text-[#171717]">24-Hour Time Format</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Display timestamps in 24h / military time</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-[#6D28D9] cursor-pointer" />
            </div>
            <button
              onClick={() => notify('Regional preferences saved.')}
              className="w-full py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Save Regional Preferences
            </button>
          </div>

          <div className="space-y-6">
            <div className={`${card} space-y-4`}>
              <div className="pb-3 border-b border-[#EDE9FE]">
                <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#6D28D9]" /> Appearance
                </h3>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#171717] block mb-1">Interface Density</label>
                <div className="flex gap-2">
                  {([
                    { id: 'comfortable', label: 'Comfortable', icon: Monitor },
                    { id: 'compact', label: 'Compact', icon: Compass },
                  ] as const).map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDensity(opt.id)}
                        className={`flex-1 p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          density === opt.id
                            ? 'border-[#7C3AED] bg-purple-50 text-[#6D28D9] ring-1 ring-[#7C3AED]'
                            : 'border-[#EDE9FE] bg-[#F8F7FC] text-[#6B7280] hover:border-purple-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#171717] block mb-1">Accent Color</label>
                <div className="flex gap-2">
                  {[
                    { id: 'purple', cls: 'from-[#7C3AED] to-[#A855F7]', label: 'XENA Purple' },
                    { id: 'blue', cls: 'from-blue-500 to-indigo-500', label: 'Ocean Blue' },
                    { id: 'emerald', cls: 'from-emerald-500 to-teal-500', label: 'Emerald' },
                    { id: 'dark', cls: 'from-slate-800 to-black', label: 'Onyx' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      title={opt.label}
                      onClick={() => setAccent(opt.id)}
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opt.cls} cursor-pointer transition-transform ${
                        accent === opt.id ? 'ring-2 ring-[#171717] ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => notify('Theme set to Light mode.')}
                  className="flex-1 py-2.5 rounded-xl bg-[#F8F7FC] border border-[#EDE9FE] text-xs font-bold text-[#171717] hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Moon className="w-3.5 h-3.5" /> Light
                </button>
                <button
                  onClick={() => notify('Dark mode is previewing in the XENA mobile beta.')}
                  className="flex-1 py-2.5 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#6B7280] hover:text-[#171717] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Monitor className="w-3.5 h-3.5" /> System (Beta)
                </button>
              </div>
            </div>

            <div className={`${card} space-y-3`}>
              <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2 pb-3 border-b border-[#EDE9FE]">
                <Package className="w-4 h-4 text-[#6D28D9]" /> Data & Export
              </h3>
              <button
                onClick={() => notify('Preparing your account data export archive...')}
                className="w-full py-2.5 rounded-xl bg-[#F8F7FC] hover:bg-white border border-[#EDE9FE] text-xs font-bold text-[#171717] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#6D28D9]" /> Export Full Account Data
              </button>
              <button
                onClick={() => onSelectTab('profile')}
                className="w-full py-2.5 rounded-xl bg-[#F8F7FC] hover:bg-white border border-[#EDE9FE] text-xs font-bold text-[#171717] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-[#6D28D9]" /> Tax Statements & Reports
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ SECURITY & PRIVACY ============ */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${card} space-y-3`}>
              <div className="pb-3 border-b border-[#EDE9FE]">
                <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#6D28D9]" /> Authentication
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Core login & transaction protections</p>
              </div>
              {rowCard('Two-Factor Authentication (2FA)', 'Required for withdrawals & P2P releases', twoFactor, handleToggle2FA)}
              {rowCard('Transaction Security PIN', 'Instant biometric ring for fast trades', pinSet, handleTogglePIN)}
              {rowCard('Withdrawal Address Confirmation', 'Re-authenticate when a new address is used', withdrawalConfirmation, () => {
                setWithdrawalConfirmation(!withdrawalConfirmation);
                notify('Withdrawal confirmation setting updated.');
              })}
              {rowCard('Login Session Tracking', 'Monitor active devices & locations', sessionTracking, () => {
                setSessionTracking(!sessionTracking);
                notify('Session tracking preference updated.');
              })}

              <button
                onClick={() => onSelectTab('profile')}
                className="w-full py-2.5 rounded-xl bg-[#F8F7FC] hover:bg-white border border-[#EDE9FE] text-xs font-bold text-[#171717] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                Manage Devices, Whitelists & Anti-Phishing <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#171717] via-[#2A1B4E] to-[#171717] rounded-[22px] p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">Account Security Score</span>
                    <div className="text-4xl font-black font-mono mt-1">
                      98<span className="text-lg text-purple-300">/100</span>
                    </div>
                    <p className="text-[11px] text-purple-200 mt-1">Top 1% secure accounts on XENA</p>
                  </div>
                  <div className="w-20 h-20 rounded-full bg-white/10 border-4 border-[#A855F7] flex items-center justify-center">
                    <Lock className="w-8 h-8 text-[#D8B4FE]" />
                  </div>
                </div>
                <div className="relative z-10 mt-4 grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-lg bg-white/10 border border-white/10">
                    <span className="block font-extrabold text-emerald-400">3 / 3</span>
                    <span className="text-purple-200">Auth Factors</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/10 border border-white/10">
                    <span className="block font-extrabold text-emerald-400">2</span>
                    <span className="text-purple-200">Active Sessions</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/10 border border-white/10">
                    <span className="block font-extrabold text-emerald-400">0</span>
                    <span className="text-purple-200">Risk Events</span>
                  </div>
                </div>
              </div>

              <div className={`${card} space-y-3`}>
                <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2 pb-3 border-b border-[#EDE9FE]">
                  <Shield className="w-4 h-4 text-[#6D28D9]" /> Privacy Controls
                </h3>
                {rowCard('Share anonymous usage analytics', 'Helps improve XENA products', true, () => notify('Analytics preference updated.'))}
                {rowCard('Two-step delete protection', 'Require PIN + email OTP for account deletion', true, () => notify('Delete protection updated.'))}

                <div className="pt-2">
                  <button
                    onClick={() => notify('This demo account cannot be deleted. This is a simulated action.')}
                    className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Deactivate / Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

