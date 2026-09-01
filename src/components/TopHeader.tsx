import React, { useState, useEffect } from 'react';
import { Search, Menu, Cloud } from 'lucide-react';
import { ActiveTab } from '../App';

interface TopHeaderProps {
  onSearchFocus?: () => void;
  onSearchChange?: (val: string) => void;
  searchQuery?: string;
  onOpenMobileMenu: () => void;
  activeTabTitle: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onSearchFocus,
  onSearchChange,
  searchQuery = '',
  onOpenMobileMenu,
  activeTabTitle,
}) => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const date = now.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
      setTimeString(`${time} • ${date}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 no-print">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-60 sm:w-80 md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            onFocus={onSearchFocus}
            placeholder="Search by plate, name, or phone..."
            className="w-full bg-slate-100 border-none rounded-full py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-hidden font-medium"
          />
        </div>
      </div>

      {/* Date & Status Indicator */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold" title="Data is saved in Cloud Firestore and synced in real-time across all computers and networks">
          <Cloud className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Cloud Synced</span>
        </div>
        <div className="hidden md:flex items-center text-xs text-slate-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shrink-0 animate-pulse" />
          {timeString || 'Online'}
        </div>
      </div>
    </header>
  );
};
