import React from 'react';
import { Bell, Sparkles, ShieldCheck, Tag, ArrowRight, ExternalLink, Calendar } from 'lucide-react';

interface AnnouncementsPageProps {
  onExploreP2P: () => void;
  onExploreStaking: () => void;
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({
  onExploreP2P,
  onExploreStaking,
}) => {
  const announcements = [
    {
      id: 'ann-1',
      title: 'Zero-Fee P2P Trading Carnival is Now Live!',
      date: 'May 24, 2026',
      tag: 'Promotion',
      tagColor: 'bg-emerald-50 text-[#16A34A] border-emerald-100',
      summary:
        'Trade fiat-to-XENA with 0% maker and taker fees through our verified peer-to-peer network. Over 40 fiat payment channels supported with instant smart escrow protection.',
      actionText: 'Start P2P Trading',
      onAction: onExploreP2P,
    },
    {
      id: 'ann-2',
      title: 'New High-Yield 180-Day Institutional Staking Vault (52.0% APY)',
      date: 'May 20, 2026',
      tag: 'Staking',
      tagColor: 'bg-purple-50 text-[#6D28D9] border-purple-100',
      summary:
        'We have expanded our decentralized validator delegation pools. Lock your XENA tokens to earn up to 52% APY with daily compounded payouts and automated slashing protection.',
      actionText: 'View Staking Vaults',
      onAction: onExploreStaking,
    },
    {
      id: 'ann-3',
      title: 'XENA Network Upgrades to Mainnet v2.4 (Sub-Second Finality)',
      date: 'May 15, 2026',
      tag: 'System Upgrade',
      tagColor: 'bg-blue-50 text-blue-600 border-blue-100',
      summary:
        'The XENA blockchain layer has successfully transitioned to consensus v2.4, achieving sub-second block finality and gas fee reductions of over 70% across all decentralized transactions.',
      actionText: 'Explore System Details',
      onAction: () => {},
    },
    {
      id: 'ann-4',
      title: 'CertiK Complete Security Audit & Proof-of-Reserves Verification',
      date: 'May 10, 2026',
      tag: 'Security',
      tagColor: 'bg-purple-50 text-[#6D28D9] border-purple-100',
      summary:
        'CertiK has completed its formal verification of all XENA smart contracts with a 99/100 security score. Proof-of-Reserves merkle trees are now updated live on-chain every 6 hours.',
      actionText: 'View Security Audit',
      onAction: () => {},
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-8 animate-fade-in" id="announcements-page-view">
      {/* Header */}
      <div className="bg-white border border-[#EDE9FE] rounded-[24px] p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6D28D9] text-xs font-bold border border-purple-100 mb-2">
          <Bell className="w-3.5 h-3.5" />
          <span>Official Announcements & System Updates</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
          News, Events & Protocol Updates
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Stay informed about the latest platform campaigns, token listings, staking reward expansions, and technical upgrades.
        </p>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="bg-white border border-[#EDE9FE] rounded-[24px] p-6 shadow-sm hover:border-purple-200 transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${ann.tagColor}`}>
                  {ann.tag}
                </span>
                <span className="text-xs text-[#6B7280] flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {ann.date}
                </span>
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-[#171717]">
              {ann.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              {ann.summary}
            </p>

            <div className="pt-2">
              <button
                onClick={ann.onAction}
                className="px-4 py-2 rounded-xl bg-[#F8F7FC] hover:bg-purple-50 text-[#6D28D9] font-bold text-xs border border-[#EDE9FE] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{ann.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
