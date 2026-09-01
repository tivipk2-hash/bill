import React from 'react';
import { FormType } from '../types';
import {
  FileSpreadsheet,
  Truck,
  FileCheck,
  Search,
  KeyRound,
  LogOut,
  Shield,
  PlusCircle,
} from 'lucide-react';

export type ActiveTab = 'smog_test' | 'inspection_90day' | 'annual_inspection' | 'invoice_list';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenChangePassword: () => void;
  onLogout: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenChangePassword,
  onLogout,
  savedCount,
}) => {
  return (
    <header className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* App Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black shadow-md shadow-blue-500/20">
              T&D
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight uppercase leading-none">
                T&D Auto Invoices
              </h1>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Quản lý & Xuất Hóa Đơn Kiểm Định Xe
              </p>
            </div>
          </div>

          {/* User Settings & Logout */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenChangePassword}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition border border-slate-700 cursor-pointer"
              title="Đổi mật khẩu bảo mật"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Đổi Mật Khẩu</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 text-xs font-semibold transition border border-rose-800/50 cursor-pointer"
              title="Đăng xuất khỏi ứng dụng"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-1 border-t border-slate-800/80 pt-1 pb-2">
          <button
            type="button"
            onClick={() => onTabChange('smog_test')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'smog_test'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-300" />
            <span>Phần 1: T and D Smog Test</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('inspection_90day')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'inspection_90day'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Truck className="w-4 h-4 text-indigo-300" />
            <span>Phần 2: T and D Inspection (90 Day)</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('annual_inspection')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'annual_inspection'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileCheck className="w-4 h-4 text-teal-300" />
            <span>Phần 3: Record of Annual Inspection</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('invoice_list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ml-auto cursor-pointer ${
              activeTab === 'invoice_list'
                ? 'bg-slate-100 text-slate-900 shadow-md'
                : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>Tra Cứu & Lịch Sử Hóa Đơn</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
