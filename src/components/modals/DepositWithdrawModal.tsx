import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Copy, Check, ShieldCheck, AlertCircle, Sparkles, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Transaction } from '../../types';

interface DepositWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'deposit' | 'withdraw';
  availableXena: number;
  onSuccess: (amountChange: number, newTx: Transaction) => void;
}

export const DepositWithdrawModal: React.FC<DepositWithdrawModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'deposit',
  availableXena,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>(initialTab);
  const [depositMethod, setDepositMethod] = useState<'crypto' | 'bank' | 'card'>('crypto');
  const [amount, setAmount] = useState<string>('500');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('0x71C...84B29A');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const depositAddress = '0x8F4b5C9217E6B2349a1d48cEF918a36284b39A1';

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } });
      } catch {}

      const newTx: Transaction = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        title: 'Deposit',
        type: 'deposit',
        amount: num,
        unit: 'XENA',
        status: 'Completed',
        timestamp: 'Just now',
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        paymentMethod: depositMethod === 'crypto' ? 'XENA Mainnet Transfer' : 'Instant Bank Transfer',
        fee: 0.00,
      };

      onSuccess(num, newTx);
      setSuccessMessage(`Successfully deposited +${num.toLocaleString()} XENA to your account!`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1800);
    }, 800);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || num > availableXena) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}

      const newTx: Transaction = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        title: 'Withdrawal',
        type: 'withdrawal',
        amount: -num,
        unit: 'XENA',
        status: 'Pending',
        timestamp: 'Just now',
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        counterparty: withdrawAddress,
        fee: 1.50,
      };

      onSuccess(-num, newTx);
      setSuccessMessage(`Withdrawal request of ${num.toLocaleString()} XENA submitted securely.`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1800);
    }, 900);
  };

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
            <h3 className="font-bold text-[#171717] text-base sm:text-lg">
              {activeTab === 'deposit' ? 'Deposit XENA' : 'Withdraw XENA'}
            </h3>
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
                    { id: 'crypto', label: 'XENA Network', desc: '0% fee · Instant' },
                    { id: 'bank', label: 'Bank SEPA', desc: '0% fee · Fast' },
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

              {depositMethod === 'crypto' && (
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
                      onClick={handleCopy}
                      className="px-3 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-xs font-medium rounded-lg hover:opacity-90 flex items-center gap-1 shadow-sm"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

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
            </form>
          ) : (
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 border border-purple-100">
                <span className="text-xs text-[#6B7280]">Available for Withdrawal</span>
                <span className="text-sm font-bold text-[#6D28D9]">{availableXena.toLocaleString()} XENA</span>
              </div>

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
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
