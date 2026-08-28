import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Zap, Sparkles, Check, Loader2, User, Gift, Loader2 as Spinner } from 'lucide-react';

interface SignupPageProps {
  onNavigateTab: (tab: string) => void;
  onSignupSuccess?: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigateTab, onSignupSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [referral, setReferral] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputCls =
    'w-full bg-[#F8F7FC] border border-[#EDE9FE] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] focus:bg-white transition-all placeholder:text-[#9CA3AF]';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please complete all required fields to create your account.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    if (!accepted) {
      setError('You must accept the Terms of Service and Privacy Policy.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => {
        onSignupSuccess ? onSignupSuccess() : onNavigateTab('home');
      }, 1400);
    }, 900);
  };

  const StrengthBar = ({ value }: { value: string }) => {
    const score = [value.length >= 8, /[A-Z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
    const colors = ['bg-[#D1D5DB]', 'bg-[#F59E0B]', 'bg-[#0EA5E9]', 'bg-[#16A34A]', 'bg-[#6D28D9]'];
    return (
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score] : 'bg-[#EDE9FE]'}`} />
        ))}
        <span className="ml-1.5 text-[10px] font-bold text-[#6B7280]">
          {score === 0 ? 'Too weak' : score <= 2 ? 'Weak' : score === 3 ? 'Good' : 'Strong'}
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-10rem)] rounded-[24px] overflow-hidden border border-[#EDE9FE] shadow-lg animate-fade-in" id="signup-page-view">
      {/* LEFT: Brand Panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#1E1B4B] via-[#7C3AED] to-[#DB2777] p-10 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">X</span>
          </div>
          <span className="font-bold text-xl tracking-tight">XENA Exchange</span>
        </div>

        <div className="relative z-10 space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
            Create your account.<br />Start earning <span className="text-purple-200">up to 52% APY.</span>
          </h1>
          <p className="text-sm text-purple-100 leading-relaxed">
            Join 2.4M+ verified users trading and staking securely. Full setup takes under 2 minutes.
          </p>

          <div className="space-y-2 pt-2">
            {[
              { icon: ShieldCheck, text: 'Bank-grade KYC & 2FA in under 2 minutes' },
              { icon: Zap, text: 'Instant, 0% fee P2P trading powered by escrow' },
              { icon: Gift, text: '$25 XENA bonus + 0.5% trading rebate on signup' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-xs text-purple-50">
                <span className="w-6 h-6 rounded-lg bg-white/10 border border-white/25 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-purple-100">
          ≤ 2.1 min avg release · 99/100 CertiK audit · Trusted in 188 countries
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="bg-white p-6 sm:p-10 flex flex-col justify-center overflow-y-auto">
        <div className="lg:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#DB2777] flex items-center justify-center mb-4">
          <span className="text-white font-bold text-lg leading-none">X</span>
        </div>

        <div className="max-w-sm w-full mx-auto space-y-4">
          {done ? (
            <div className="flex flex-col items-center justify-center text-center space-y-3 py-10 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
              </div>
              <h2 className="text-lg font-extrabold text-[#171717]">Account created!</h2>
              <p className="text-xs text-[#6B7280]">Welcome aboard. Loading your secure dashboard…</p>
              <Spinner className="w-5 h-5 text-[#7C3AED] animate-spin" />
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#171717] tracking-tight">Create your account</h2>
                <p className="text-xs text-[#6B7280] mt-1">Free forever. No card required to get started.</p>
              </div>

              <div className="grid grid-cols-2 gap-2 py-1.5 px-3 rounded-xl bg-purple-50/80 border border-purple-100">
                <div className="text-center">
                  <p className="text-[13px] font-extrabold text-[#171717]">$25 Bonus</p>
                  <p className="text-[10px] font-semibold text-[#6B7280]">On first deposit</p>
                </div>
                <div className="text-center border-l border-purple-100">
                  <p className="text-[13px] font-extrabold text-[#171717]">0% Fees</p>
                  <p className="text-[10px] font-semibold text-[#6B7280]">First 30 days</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-[#171717] block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" className={`${inputCls} pl-9`} />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#171717] block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={`${inputCls} pl-9`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#171717] block mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`${inputCls} pl-9 pr-8`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6D28D9] cursor-pointer">
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#171717] block mb-1">Confirm</label>
                    <input type={showPassword ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter" className={inputCls} />
                  </div>
                </div>

                {password && <StrengthBar value={password} />}

                <div>
                  <label className="text-[11px] font-bold text-[#171717] block mb-1">Referral Code <span className="text-[9px] font-semibold text-[#9CA3AF]">(optional)</span></label>
                  <div className="relative">
                    <Gift className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input value={referral} onChange={(e) => setReferral(e.target.value)} placeholder="XENA-REF" className={`${inputCls} pl-9`} />
                  </div>
                </div>

                <label className="flex items-start gap-2 text-[11px] text-[#6B7280] font-semibold cursor-pointer select-none">
                  <button
                    type="button"
                    onClick={() => setAccepted(!accepted)}
                    className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition-all cursor-pointer ${accepted ? 'bg-[#6D28D9] border-[#6D28D9]' : 'bg-white border-[#D1D5DB]'}`}
                  >
                    {accepted && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span>
                    I agree to XENA's <span className="text-[#6D28D9] font-bold">Terms of Service</span> and <span className="text-[#6D28D9] font-bold">Privacy Policy</span>, and confirm I am 18+.
                  </span>
                </label>

                {error && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-[11px] font-semibold text-red-600 animate-fade-in">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-xs shadow-md hover:shadow-[0_4px_16px_rgba(109,40,217,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating secure account...</>
                  ) : (
                    <>Claim $25 Bonus & Create Account <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="text-center text-[11px] text-[#6B7280]">
                Already have an account?{' '}
                <button onClick={() => onNavigateTab('login')} className="font-bold text-[#6D28D9] hover:underline cursor-pointer">
                  Sign in here
                </button>
              </p>

              <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-[#6B7280]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                Your data is encrypted & protected by 2FA
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};