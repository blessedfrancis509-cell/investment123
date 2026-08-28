import React, { useState } from 'react';
import { X, Send, QrCode, Copy, Check, Users, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Transaction } from '../../types';

interface SendReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'send' | 'receive';
  availableXena: number;
  onSuccess: (amountChange: number, newTx: Transaction) => void;
}

export const SendReceiveModal: React.FC<SendReceiveModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'send',
  availableXena,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'send' | 'receive'>(initialMode);
  const [recipient, setRecipient] = useState<string>('0x9a82...e74b');
  const [amount, setAmount] = useState<string>('150');
  const [note, setNote] = useState<string>('Payment for services');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const myXenaAddress = '0x8F4b5C9217E6B2349a1d48cEF918a36284b39A1';

  const handleCopy = () => {
    navigator.clipboard.writeText(myXenaAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || num > availableXena) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}

      const newTx: Transaction = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        title: 'Transfer Sent',
        type: 'withdrawal',
        amount: -num,
        unit: 'XENA',
        status: 'Completed',
        timestamp: 'Just now',
        counterparty: recipient,
        fee: 0.00,
      };

      onSuccess(-num, newTx);
      setSuccessMsg(`Sent ${num} XENA to ${recipient.slice(0, 10)}... successfully!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1600);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" id="send-receive-modal">
      <div className="relative w-full max-w-md bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border border-[#EDE9FE] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Mobile drag handle bar */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto sm:hidden mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-[#EDE9FE] bg-[#F8F7FC] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white">
              {mode === 'send' ? <Send className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
            </div>
            <h3 className="font-bold text-[#171717] text-base">
              {mode === 'send' ? 'Send XENA Instantly' : 'Receive XENA'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-[#6B7280] hover:text-[#171717] hover:bg-white transition-colors cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switch */}
        <div className="flex p-1.5 bg-[#F8F7FC] mx-4 sm:mx-6 mt-3 sm:mt-4 rounded-xl border border-[#EDE9FE] shrink-0">
          <button
            type="button"
            onClick={() => setMode('send')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all min-h-[38px] ${
              mode === 'send'
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Send XENA
          </button>
          <button
            type="button"
            onClick={() => setMode('receive')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all min-h-[38px] ${
              mode === 'receive'
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Receive XENA
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {successMsg ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-purple-50 text-[#6D28D9] flex items-center justify-center border border-purple-200">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-[#171717]">Transfer Complete</h4>
              <p className="text-xs text-[#6B7280] max-w-xs mx-auto">{successMsg}</p>
            </div>
          ) : mode === 'send' ? (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Recipient Address or XENA ID
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x... or XN-ID"
                  required
                  className="w-full px-4 py-2.5 text-xs font-mono text-[#171717] bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#171717] mb-1.5">
                  <span>Amount to Send</span>
                  <span className="text-[#6B7280]">
                    Available: <span className="text-[#6D28D9] font-bold">{availableXena} XENA</span>
                  </span>
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
                    className="w-full px-4 py-2.5 text-base font-semibold text-[#171717] bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white pr-16"
                    placeholder="0.00"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-[#6D28D9]">
                    XENA
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">Transfer Memo (Optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Invoice #204"
                  className="w-full px-4 py-2 text-xs text-[#171717] bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#6B7280] bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                <span>Internal XENA Network Fee:</span>
                <span className="font-bold text-emerald-600">FREE (0.00 XENA)</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing || parseFloat(amount) > availableXena}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:shadow-[0_4px_16px_rgba(109,40,217,0.3)] hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Dispatching Transfer...' : `Send ${amount || 0} XENA`}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              {/* QR Code placeholder representation */}
              <div className="p-4 bg-[#F8F7FC] border border-[#EDE9FE] rounded-2xl inline-block mx-auto shadow-inner">
                <div className="w-40 h-40 bg-white rounded-xl p-3 border border-[#EDE9FE] flex flex-col items-center justify-center relative shadow-sm">
                  {/* Stylized QR Matrix */}
                  <div className="grid grid-cols-5 gap-1.5 w-full h-full p-1 opacity-80">
                    <div className="bg-[#6D28D9] rounded-sm col-span-2 row-span-2"></div>
                    <div className="bg-[#EDE9FE] rounded-sm"></div>
                    <div className="bg-[#6D28D9] rounded-sm col-span-2 row-span-2"></div>
                    <div className="bg-[#6D28D9] rounded-sm"></div>
                    <div className="bg-[#A855F7] rounded-sm"></div>
                    <div className="bg-[#7C3AED] rounded-sm col-span-2"></div>
                    <div className="bg-[#EDE9FE] rounded-sm"></div>
                    <div className="bg-[#6D28D9] rounded-sm"></div>
                    <div className="bg-[#6D28D9] rounded-sm col-span-2 row-span-2"></div>
                    <div className="bg-[#EDE9FE] rounded-sm"></div>
                    <div className="bg-[#A855F7] rounded-sm col-span-2 row-span-2"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#5B21B6] to-[#8B5CF6] text-white flex items-center justify-center shadow-md border-2 border-white">
                      <span className="font-extrabold text-xs">X</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#6B7280] block mb-1">Your Personal XENA Deposit Address</span>
                <code className="text-xs font-mono text-[#171717] bg-[#F8F7FC] p-2 rounded-xl border border-[#EDE9FE] block select-all truncate">
                  {myXenaAddress}
                </code>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-xs font-bold rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Address Copied to Clipboard' : 'Copy Wallet Address'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
