import React from 'react';
import { ShoppingCart, ArrowDownCircle, Send, QrCode, Users, TrendingUp, Sparkles } from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (action: 'buy' | 'sell' | 'send' | 'receive' | 'p2p' | 'invest') => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions = [
    {
      id: 'buy',
      title: 'Buy XENA',
      subtitle: 'Instant card / USDT',
      icon: ShoppingCart,
      gradient: 'from-[#7C3AED] to-[#A855F7]',
      badge: '0% Fee',
    },
    {
      id: 'sell',
      title: 'Sell XENA',
      subtitle: 'Direct cash settlement',
      icon: ArrowDownCircle,
      gradient: 'from-[#6D28D9] to-[#8B5CF6]',
    },
    {
      id: 'send',
      title: 'Send',
      subtitle: 'Instant network transfer',
      icon: Send,
      gradient: 'from-[#5B21B6] to-[#7C3AED]',
    },
    {
      id: 'receive',
      title: 'Receive',
      subtitle: 'QR & wallet address',
      icon: QrCode,
      gradient: 'from-[#7C3AED] to-[#C084FC]',
    },
    {
      id: 'p2p',
      title: 'P2P',
      subtitle: 'Trade with verified peers',
      icon: Users,
      gradient: 'from-[#6D28D9] to-[#A855F7]',
      badge: 'Hot',
    },
    {
      id: 'invest',
      title: 'Invest',
      subtitle: 'Earn up to 16.5% APY',
      icon: TrendingUp,
      gradient: 'from-[#5B21B6] to-[#8B5CF6]',
      badge: '12% APY',
    },
  ];

  return (
    <section className="py-2" id="quick-actions-section">
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onActionClick(action.id as any)}
              className="bg-white p-3 sm:p-4 rounded-2xl border border-[#EDE9FE] shadow-sm hover:shadow-purple-100 hover:-translate-y-0.5 active:scale-95 transition-all group flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center cursor-pointer relative min-h-[82px] sm:min-h-[96px]"
            >
              {action.badge && (
                <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-[#6D28D9] border border-[#EDE9FE]">
                  {action.badge}
                </span>
              )}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white shadow-md shadow-purple-200/50 group-hover:scale-105 transition-transform shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[11px] sm:text-xs font-bold text-[#171717] group-hover:text-[#6D28D9] transition-colors block truncate">
                  {action.title}
                </span>
                <span className="text-[10px] text-[#6B7280] block mt-0.5 hidden sm:block truncate">
                  {action.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
