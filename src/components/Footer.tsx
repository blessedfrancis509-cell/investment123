import React from 'react';
import { ShieldCheck, Heart, ExternalLink, Globe, Lock } from 'lucide-react';
import { XenaLogo } from './XenaLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#EDE9FE] mt-8 py-8 pb-24 md:pb-8" id="xena-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#EDE9FE]">
          <div className="flex items-center gap-3">
            <XenaLogo size="sm" />
            <span className="text-xs text-[#6B7280]">
              Decentralized Fintech Exchange & Yield Management
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#6B7280]">
            <a href="#main-balance-card" className="hover:text-[#6D28D9] transition-colors">Portfolio</a>
            <a href="#xena-market-card-section" className="hover:text-[#6D28D9] transition-colors">Market</a>
            <a href="#active-investments-section" className="hover:text-[#6D28D9] transition-colors">Yield</a>
            <a href="#p2p-preview-section" className="hover:text-[#6D28D9] transition-colors">P2P</a>
            <a href="#security-section" className="hover:text-[#6D28D9] transition-colors">Security</a>
          </div>
        </div>

        {/* Bottom copyright & notes */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
          <div>
            © {new Date().getFullYear()} XENA Exchange. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#16A34A] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> Systems Operational
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#6D28D9]" /> 256-Bit SSL Secured
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
