import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Copy, Check, ShieldCheck, AlertCircle, Sparkles, QrCode, Landmark, Banknote, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Transaction } from '../../types';

interface DepositWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'deposit' | 'withdraw';
  availableXena: number;
  nairaBalance: number;
  xenaNgnRate: number;
  onSuccess: (amountChange: number, newTx: Transaction) => void;
}

const NGN_BANKS = ['GTBank', 'Zenith Bank', 'Access Bank', 'UBA', 'First Bank', 'Providus Bank', 'Kuda', 'OPay', 'Moniepoint'];
const ESCROW_BANK = {
  bank: 'Providus Bank',
  accountName: 'XENA Nigeria Escrow Ltd',
  accountNumber: '30-8821-4490',
  sortCode: '101',
};
const NGN_TRANSFER_FEE = 500;

export const DepositWithdrawModal: React.FC<DepositWithdrawModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'deposit',
  availableXena,
  nairaBalance,
  xenaNgnRate,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>(initialTab);
  const [depositMethod, setDepositMethod] = useState<'ngn' | 'crypto' | 'card'>('ngn');
  const [withdrawMethod, setWithdrawMethod] = useState<'ngn' | 'xena'>('ngn');
  const [amount, setAmount] = useState<string>('500');
  const [ngnAmount, setNgnAmount] = useState<string>('200000');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('0x71C...84B29A');
  const [ngnBank, setNgnBank] = useState('GTBank');
  const [ngnAccountNumber, setNgnAccountNumber] = useState('0123456789');
  const [ngnAccountName, setNgnAccountName] = useState('Alex Morgan');
  const [escrowRef, setEscrowRef] = useState<string>(() => `XEN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
  const [copied, setCopied] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const rate = Math.max(1, xenaNgnRate);
  const depositAddress = '0x8F4b5C9217E6B2349a1d48cEF918a36284b39A1';
  const xenaFromNgn = (ngn: number) => Math.round((ngn / rate) * 10000) / 10000;
  const fmtNgn = (n: number) => `₦${Math.round(n).toLocaleString('en-US')}`;
  const ngnFromXena = (x: number) => Math.round(x * rate);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const regenerateRef = () => setEscrowRef(`XEN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let xena = 0;
    let payMethod = '';
    let headline = '';
    let details = '';

    if (depositMethod === 'ngn') {
      const ngn = parseFloat(ngnAmount);
      if (isNaN(ngn) || ngn <= 0) return;
      xena = xenaFromNgn(ngn);
      payMethod = 'NGN Bank Deposit · Nigerian Escrow';
      headline = `${fmtNgn(ngn)} Escrow Deposit Confirmed`;
      details = `+${xena.toLocaleString()} XENA credited after escrow verification of reference ${escrowRef}.`;
    } else {
      const num = parseFloat(amount);
      if (isNaN(num) || num <= 0) return;
      xena = num;
      payMethod = depositMethod === 'crypto' ? 'XENA Mainnet Transfer' : 'Debit Card (Instant Buy)';
      headline = `Successfully deposited +${xena.toLocaleString()} XENA to your account!`;
      details = 'Funds are available for trading, staking, and withdrawals.';
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } });
      } catch {}

      const newTx: Transaction = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        title: depositMethod === 'ngn' ? 'Naira Deposit (Escrow)' : 'Deposit',
        type: 'deposit',
        amount: xena,
        unit: 'XENA',
        status: 'Completed',
        timestamp: 'Just now',
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        paymentMethod: payMethod,
        fee: 0.00,
      };

      onSuccess(xena, newTx);
      setSuccessMessage(`${headline} ${details}`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1800);
    }, 800);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let xena = 0;
    let payMethod = '';
    let cparty = '';
    let fee = 0;
    let headline = '';

    if (withdrawMethod === 'ngn') {
      const ngn = parseFloat(ngnAmount);
      if (isNaN(ngn) || ngn <= 0) return;
      xena = xenaFromNgn(ngn);
      if (xena > availableXena) return;
      fee = NGN_TRANSFER_FEE;
      payMethod = 'NGN Bank Transfer (Escrow-Protected)';
      cparty = `${ngnBank} • ${ngnAccountName} • ${ngnAccountNumber.slice(-4)}`;
      headline = `${fmtNgn(ngn - NGN_TRANSFER_FEE)} sent to ${ngnBank} (${ngnAccountNumber.slice(-4)})`;
    } else {
      const num = parseFloat(amount);
      if (isNaN(num) || num <= 0 || num > availableXena) return;
      xena = num;
      payMethod = 'XENA Mainnet Transfer';
      cparty = withdrawAddress;
      fee = 1.50;
      headline = `Withdrawal request of ${xena.toLocaleString()} XENA submitted securely.`;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}

      const newTx: Transaction = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        title: withdrawMethod === 'ngn' ? 'Naira Withdrawal' : 'Withdrawal',
        type: 'withdrawal',
        amount: -xena,
        unit: 'XENA',
        status: 'Pending',
        timestamp: 'Just now',
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        counterparty: cparty,
        paymentMethod: payMethod,
        fee,
      };

      onSuccess(-xena, newTx);
      setSuccessMessage(`${headline} Your payout is escrow-verified.`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1800);
    }, 900);
  };

  const ngnDeposit = Math.max(0, parseFloat(ngnAmount) || 0);
  const ngnWithdraw = Math.max(0, parseFloat(ngnAmount) || 0);
  const availableNgn = ngnFromXena(availableXena);
  const ngnPayout = Math.max(0, ngnWithdraw - NGN_TRANSFER_FEE);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" id="deposit-withdraw-modal">
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border border-[#EDE9FE] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Mobile drag handle bar */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto sm:hidden mt-3 mb-1 shrink-0" />

        {/* Header bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-[#EDE9FE] bg-[#F8F7FC] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white">
              {activeTab === 'deposit' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-[#171717] text-base sm:text-lg leading-tight">
                {activeTab === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
              </h3>
              <p className="text-[10px] text-[#6B7280]">{activeTab === 'deposit' ? 'Naira escrow & crypto deposits' : 'Withdraw in NGN or XENA'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#6B7280] hover:text-[#171717] hover:bg-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#EDE9FE] p-1.5 bg-[#F8F7FC]/70 mx-4 sm:mx-6 mt-3 sm:mt-4 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[38px] ${
              activeTab === 'deposit'
                ? 'bg-white text-[#6D28D9] shadow-sm font-bold'
                : 'text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Deposit Funds
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[38px] ${
              activeTab === 'withdraw'
                ? 'bg-white text-[#6D28D9] shadow-sm font-bold'
                : 'text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Withdraw Funds
          </button>
        </div>

        {/* Modal content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {successMessage ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-200">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-[#171717]">Transaction Processed</h4>
              <p className="text-sm text-[#6B7280] max-w-xs mx-auto">{successMessage}</p>
            </div>
          ) : activeTab === 'deposit' ? (
            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">
                  Select Deposit Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ngn', label: '₦ Naira (Escrow)', desc: '0% fee · Instant' },
                    { id: 'crypto', label: 'XENA Network', desc: '0% fee · Instant' },
                    { id: 'card', label: 'Debit Card', desc: 'Instant buy' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setDepositMethod(m.id as any)}
                      className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                        depositMethod === m.id
                          ? 'border-[#7C3AED] bg-purple-50/50 text-[#6D28D9] ring-1 ring-[#7C3AED]'
                          : 'border-[#EDE9FE] bg-white text-[#6B7280] hover:border-purple-200'
                      }`}
                    >
                      <span className="font-bold block text-[#171717]">{m.label}</span>
                      <span className="text-[10px] text-[#6B7280]">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {depositMethod === 'ngn' && (
                <>
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white border border-purple-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold">Nigerian Escrow Vault</p>
                          <p className="text-[9px] text-purple-100">CBN-licensed custody · escrow-protected</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white/15 border border-white/25 text-[9px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-300" /> 100% Protected
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                      <div className="flex items-center justify-between bg-white/10 rounded-lg px-2.5 py-1.5 border border-white/10">
                        <span className="text-purple-100">Bank</span>
                        <span className="font-bold flex items-center gap-1.5">
                          {ESCROW_BANK.bank}
                          <button type="button" onClick={() => handleCopy(ESCROW_BANK.bank, 'bank')} className="text-white hover:text-black cursor-pointer">
                            {copied === 'bank' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-white/10 rounded-lg px-2.5 py-1.5 border border-white/10">
                        <span className="text-purple-100">Account Name</span>
                        <span className="font-bold">{ESCROW_BANK.accountName}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 bg-white/10 rounded-lg px-2.5 py-1.5 border border-white/10">
                        <span className="text-purple-100">Account No.</span>
                        <span className="font-bold font-mono flex items-center gap-1.5">
                          {ESCROW_BANK.accountNumber}
                          <button type="button" onClick={() => handleCopy(ESCROW_BANK.accountNumber, 'acct')} className="text-white hover:text-black cursor-pointer">
                            {copied === 'acct' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 bg-white/10 rounded-lg px-2.5 py-1.5 border border-white/10">
                        <span className="text-purple-100">Your Reference</span>
                        <span className="font-bold font-mono text-[10px] flex items-center gap-1.5">
                          {escrowRef}
                          <button type="button" onClick={() => handleCopy(escrowRef, 'ref')} className="text-white hover:text-black cursor-pointer">
                            {copied === 'ref' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </button>
                          <button type="button" onClick={regenerateRef} className="text-white hover:text-black cursor-pointer" title="New reference">
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        </span>
                      </div>
                    </div>
                    <p className="text-[9px] text-purple-100 leading-relaxed">
                      Send from your verified Nigerian bank account and include the reference. XENA is credited within seconds once escrow confirms your transfer.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                      Amount to Deposit (₦ Naira)
                    </label>
                    <div className="relative">
                      <Banknote className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        value={ngnAmount}
                        onChange={(e) => setNgnAmount(e.target.value)}
                        min="100"
                        step="any"
                        required
                        className="w-full px-4 pl-9 py-2.5 text-base font-semibold text-[#171717] bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all pr-16"
                        placeholder="0.00"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-[#6D28D9]">
                        ₦
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1.5">
                      <span className="text-[#6B7280]">Escrow rate</span>
                      <span className="font-semibold text-[#6D28D9]">1 XENA ≈ ₦{rate.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#171717] bg-emerald-50 border border-emerald-100 rounded-lg p-2 mt-1.5">
                      <span>You receive</span>
                      <span className="text-emerald-600">{ngnDeposit > 0 ? `+${xenaFromNgn(ngnDeposit).toLocaleString()} XENA` : '— XENA'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6B7280] pt-1">
                    <span>Escrow Service Fee</span>
                    <span className="font-semibold text-emerald-600">0.00 XENA (0% · Zero Fee)</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:shadow-[0_4px_16px_rgba(109,40,217,0.3)] hover:scale-[1.01] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Confirming Escrow Deposit...' : `Deposit ${fmtNgn(ngnDeposit) || '₦0'} via Escrow → +${xenaFromNgn(ngnDeposit).toLocaleString()} XENA`}
                  </button>
                </>
              )}

              {depositMethod === 'crypto' && (
                <>
                  <div className="p-4 rounded-xl bg-[#F8F7FC] border border-[#EDE9FE] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#6B7280]">Your Deposit Address (XENA Chain)</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white rounded-lg border border-[#EDE9FE] text-[#6D28D9]">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <code className="flex-1 text-xs font-mono text-[#171717] bg-white p-2 rounded-lg border border-[#EDE9FE] truncate select-all">
                        {depositAddress}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(depositAddress, 'addr')}
                        className="px-3 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-xs font-medium rounded-lg hover:opacity-90 flex items-center gap-1 shadow-sm"
                      >
                        {copied === 'addr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied === 'addr' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                      Amount to Deposit (XENA)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        step="any"
                        required
                        className="w-full px-4 py-2.5 text-base font-semibold text-[#171717] bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all pr-16"
                        placeholder="0.00"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-[#6D28D9]">
                        XENA
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6B7280] pt-1">
                    <span>Estimated Network Fee</span>
                    <span className="font-semibold text-emerald-600">0.00 XENA (Zero Fee)</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:shadow-[0_4px_16px_rgba(109,40,217,0.3)] hover:scale-[1.01] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Confirming Deposit...' : `Deposit ${amount || 0} XENA Now`}
                  </button>
                </>
              )}

              {depositMethod === 'card' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                      Amount to Buy (XENA)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        step="any"
                        required
                        className="w-full px-4 py-2.5 text-base font-semibold text-[#171717] bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all pr-16"
                        placeholder="0.00"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-[#6D28D9]">
                        XENA
                      </span>
                    </div>
                    <p className="text-[10px] text-[#6B7280] mt-1">Charged in Naira at live escrow rate ≈ {fmtNgn(ngnFromXena(Math.max(0, parseFloat(amount) || 0)))}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6B7280] pt-1">
                    <span>Card Processing Fee</span>
                    <span className="font-semibold text-emerald-600">1.5% (Instant Settle)</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:shadow-[0_4px_16px_rgba(109,40,217,0.3)] hover:scale-[1.01] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Confirming Purchase...' : `Buy XENA Now`}
                  </button>
                </>
              )}
            </form>
          ) : (
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">Available for Withdrawal</span>
                  <span className="text-sm font-bold text-[#6D28D9] text-right font-mono">
                    {availableXena.toLocaleString()} XENA
                    <span className="block text-[10px] font-semibold text-[#6B7280]">≈ {fmtNgn(availableNgn)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#6B7280] border-t border-purple-100 pt-1.5">
                  <span>Naira Wallet Balance</span>
                  <span className="font-bold text-[#171717] font-mono">{fmtNgn(nairaBalance)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">
                  Withdraw As
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'ngn', label: '₦ Naira (Bank)', desc: 'To Nigerian account' },
                      { id: 'xena', label: 'XENA (Network)', desc: 'To crypto wallet' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setWithdrawMethod(m.id)}
                      className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                        withdrawMethod === m.id
                          ? 'border-[#7C3AED] bg-purple-50/50 text-[#6D28D9] ring-1 ring-[#7C3AED]'
                          : 'border-[#EDE9FE] bg-white text-[#6B7280] hover:border-purple-200'
                      }`}
                    >
                      <span className="font-bold block text-[#171717]">{m.label}</span>
                      <span className="text-[10px] text-[#6B7280]">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {withdrawMethod === 'ngn' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#171717] mb-1.5">Beneficiary Bank</label>
                      <select
                        value={ngnBank}
                        onChange={(e) => setNgnBank(e.target.value)}
                        className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2.5 text-xs font-bold text-[#171717] focus:outline-none focus:border-[#7C3AED] cursor-pointer"
                      >
                        {NGN_BANKS.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#171717] mb-1.5">Account Number</label>
                      <input
                        type="text"
                        value={ngnAccountNumber}
                        onChange={(e) => setNgnAccountNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                        required
                        placeholder="0123456789"
                        className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-[#171717] focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1.5">Account Name</label>
                    <input
                      type="text"
                      value={ngnAccountName}
                      onChange={(e) => setNgnAccountName(e.target.value)}
                      required
                      placeholder="Full Name"
                      className="w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3 py-2.5 text-xs font-bold text-[#171717] focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#171717]">Withdraw Amount (₦)</label>
                      <div className="flex gap-1.5">
                        {[0.25, 0.5, 0.75, 1].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setNgnAmount(Math.max(100, Math.round(availableNgn * pct)).toString())}
                            className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-[#7C3AED] hover:bg-purple-100 transition-colors"
                          >
                            {pct === 1 ? 'MAX' : `${pct * 100}%`}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <Banknote className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        value={ngnAmount}
                        onChange={(e) => setNgnAmount(e.target.value)}
                        max={availableNgn}
                        min="100"
                        step="any"
                        required
                        className="w-full px-4 pl-9 py-2.5 text-base font-semibold text-[#171717] bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all pr-16"
                        placeholder="0.00"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-[#6D28D9]">
                        ₦
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1.5">
                      <span className="text-[#6B7280]">Debits</span>
                      <span className="font-semibold text-[#6D28D9]">≈ {xenaFromNgn(ngnWithdraw).toLocaleString()} XENA @ ₦{rate.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-[#6B7280] bg-[#F8F7FC] p-3 rounded-xl border border-[#EDE9FE]">
                    <div className="flex justify-between">
                      <span>NGN Transfer Fee:</span>
                      <span className="font-medium text-[#171717]">{fmtNgn(NGN_TRANSFER_FEE)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[#171717]">
                      <span>You receive (after fee):</span>
                      <span className="text-[#6D28D9]">
                        {fmtNgn(ngnPayout)} <span className="text-[10px] font-bold text-[#6B7280]">≈ {xenaFromNgn(ngnPayout).toLocaleString()} XENA</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Nigerian escrow release: funds settle via NIBSS Instant Transfer on confirmation.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || xenaFromNgn(ngnWithdraw) > availableXena}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#8B5CF6] hover:shadow-[0_4px_16px_rgba(109,40,217,0.3)] hover:scale-[1.01] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing Bank Transfer...' : `Withdraw ${fmtNgn(ngnWithdraw) || '₦0'} to ${ngnBank}`}
                  </button>
                </>
              )}

              {withdrawMethod === 'xena' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                      Destination Wallet / Address
                    </label>
                    <input
                      type="text"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      required
                      placeholder="0x... or XENA Address"
                      className="w-full px-4 py-2.5 text-xs font-mono text-[#171717] bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#171717]">Withdraw Amount</label>
                      <div className="flex gap-1.5">
                        {[0.25, 0.5, 0.75, 1].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setAmount((availableXena * pct).toFixed(2))}
                            className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-[#7C3AED] hover:bg-purple-100 transition-colors"
                          >
                            {pct === 1 ? 'MAX' : `${pct * 100}%`}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        max={availableXena}
                        min="1"
                        step="any"
                        required
                        className="w-full px-4 py-2.5 text-base font-semibold text-[#171717] bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all pr-16"
                        placeholder="0.00"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-[#6D28D9]">
                        XENA
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-[#6B7280] bg-[#F8F7FC] p-3 rounded-xl border border-[#EDE9FE]">
                    <div className="flex justify-between">
                      <span>Network Fee:</span>
                      <span className="font-medium text-[#171717]">1.50 XENA</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[#171717]">
                      <span>You will receive:</span>
                      <span className="text-[#6D28D9]">
                        {Math.max(0, (parseFloat(amount) || 0) - 1.5).toFixed(2)} XENA
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Protected by 2FA & XENA Cold Vault Verification.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || parseFloat(amount) > availableXena}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#8B5CF6] hover:shadow-[0_4px_16px_rgba(109,40,217,0.3)] hover:scale-[1.01] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Authorizing Withdrawal...' : 'Confirm Withdrawal'}
                  </button>
                </>
              )}

              {withdrawMethod === 'ngn' && ngnWithdraw > 0 && xenaFromNgn(ngnWithdraw) > availableXena && (
                <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Insufficient XENA. You need at least {xenaFromNgn(ngnWithdraw).toFixed(2)} XENA (available: {availableXena.toFixed(2)}).</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};