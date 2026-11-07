import React from 'react';
import { ViewTab, UserSession } from '../types';

interface HeaderProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  user: UserSession;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  user,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#07080c]/90 backdrop-blur-md border-b border-[rgba(212,175,55,0.25)] px-4 sm:px-8 h-16 flex items-center justify-between font-['Times_New_Roman',Times,serif]">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand Mark matching Aurum Logistics */}
        <button 
          onClick={() => onSelectTab('aurum')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-6 h-6 border-[1.5px] border-[#d4af37] rotate-45 grid place-items-center">
            <span className="w-1.5 h-1.5 bg-[#d4af37]" />
          </div>
          <span className="text-base sm:text-lg font-bold text-white tracking-tight">
            Aurum <span className="text-[#f1d572]">Logistics</span>
          </span>
        </button>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[rgba(13,15,22,0.8)] p-1 rounded-xl border border-[rgba(212,175,55,0.25)]">
          <button
            onClick={() => onSelectTab('aurum')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
              currentTab === 'aurum'
                ? 'bg-[rgba(212,175,55,0.18)] text-[#f1d572] shadow-sm'
                : 'text-[#a79f8a] hover:text-white'
            }`}
          >
            Live 3D Facility
            {currentTab === 'aurum' && (
              <span className="absolute -bottom-1 left-2.5 right-2.5 h-[2px] bg-[#d4af37] rounded-t shadow-[0_0_8px_#d4af37]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
              currentTab === 'dashboard'
                ? 'bg-[rgba(212,175,55,0.18)] text-[#f1d572] shadow-sm'
                : 'text-[#a79f8a] hover:text-white'
            }`}
          >
            Overview
            {currentTab === 'dashboard' && (
              <span className="absolute -bottom-1 left-2.5 right-2.5 h-[2px] bg-[#d4af37] rounded-t shadow-[0_0_8px_#d4af37]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('products')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
              currentTab === 'products'
                ? 'bg-[rgba(212,175,55,0.18)] text-[#f1d572] shadow-sm'
                : 'text-[#a79f8a] hover:text-white'
            }`}
          >
            Products
            {currentTab === 'products' && (
              <span className="absolute -bottom-1 left-2.5 right-2.5 h-[2px] bg-[#d4af37] rounded-t shadow-[0_0_8px_#d4af37]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative hidden md:block ${
              currentTab === 'history'
                ? 'bg-[rgba(212,175,55,0.18)] text-[#f1d572] shadow-sm'
                : 'text-[#a79f8a] hover:text-white'
            }`}
          >
            Stock History
            {currentTab === 'history' && (
              <span className="absolute -bottom-1 left-2.5 right-2.5 h-[2px] bg-[#d4af37] rounded-t shadow-[0_0_8px_#d4af37]" />
            )}
          </button>
        </nav>

        {/* Right Section: User & Sign out */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(13,15,22,0.8)] border border-[rgba(212,175,55,0.25)] text-xs font-mono text-[#f3efe4]">
            <span className="w-2 h-2 rounded-full bg-[#7fcf9a] shadow-[0_0_6px_#7fcf9a]" />
            <span className="font-semibold">{user.username || 'Abhi'}</span>
          </div>
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded-lg border border-[rgba(212,175,55,0.25)] text-[#a79f8a] hover:text-white hover:bg-[rgba(212,175,55,0.1)] text-xs font-semibold transition-all cursor-pointer"
          >
            Sign out
          </button>
        </div>

      </div>
    </header>
  );
};
