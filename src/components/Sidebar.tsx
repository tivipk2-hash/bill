import React from 'react';
import { ActiveTab } from '../App';
import { FormType } from '../types';
import {
  Search,
  KeyRound,
  LogOut,
  X,
  FileSpreadsheet,
  Truck,
  FileCheck,
  Database,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenChangePassword: () => void;
  onOpenBackupRestore?: () => void;
  onLogout: () => void;
  savedCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenChangePassword,
  onOpenBackupRestore,
  onLogout,
  savedCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-blue-600">
              T&D Inspection
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
              Management Hub
            </p>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          {/* Create New Section */}
          <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-2 tracking-wider">
            Create New
          </div>

          {/* Form 1: Smog Test */}
          <button
            type="button"
            onClick={() => handleSelectTab('smog_test')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm flex items-center transition-colors cursor-pointer ${
              activeTab === 'smog_test'
                ? 'bg-blue-50 text-blue-700 font-medium border border-blue-100'
                : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-3 shrink-0 ${
                activeTab === 'smog_test' ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            />
            <span className="truncate">T&D Smog Test</span>
          </button>

          {/* Form 2: 90 Day */}
          <button
            type="button"
            onClick={() => handleSelectTab('inspection_90day')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm flex items-center transition-colors cursor-pointer ${
              activeTab === 'inspection_90day'
                ? 'bg-blue-50 text-blue-700 font-medium border border-blue-100'
                : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-3 shrink-0 ${
                activeTab === 'inspection_90day' ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            />
            <span className="truncate">T&D Inspection (90 Day)</span>
          </button>

          {/* Form 3: Annual */}
          <button
            type="button"
            onClick={() => handleSelectTab('annual_inspection')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm flex items-center transition-colors cursor-pointer ${
              activeTab === 'annual_inspection'
                ? 'bg-blue-50 text-blue-700 font-medium border border-blue-100'
                : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-3 shrink-0 ${
                activeTab === 'annual_inspection' ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            />
            <span className="truncate">Record of Annual</span>
          </button>

          {/* Records Section */}
          <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-2 mt-6 tracking-wider">
            Records
          </div>

          <button
            type="button"
            onClick={() => handleSelectTab('invoice_list')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'invoice_list'
                ? 'bg-blue-50 text-blue-700 font-medium border border-blue-100'
                : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center truncate">
              <Search className="w-4 h-4 mr-3 shrink-0 text-slate-400" />
              <span className="truncate">Search History</span>
            </div>
            {savedCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {savedCount}
              </span>
            )}
          </button>

          {onOpenBackupRestore && (
            <button
              type="button"
              onClick={() => {
                onOpenBackupRestore();
                onCloseMobile();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm flex items-center transition-colors cursor-pointer hover:bg-slate-50 text-slate-600 group"
            >
              <Database className="w-4 h-4 mr-3 shrink-0 text-slate-400 group-hover:text-blue-600" />
              <span className="truncate">Backup & Restore</span>
            </button>
          )}
        </nav>

        {/* User Profile & Admin Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenChangePassword}
              className="flex items-center text-left text-slate-700 hover:text-blue-600 transition-colors group cursor-pointer"
              title="Click to change password"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 mr-3 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                AD
              </div>
              <div>
                <div className="font-medium text-xs text-slate-900 leading-none">
                  Admin User
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 group-hover:text-blue-600">
                  <KeyRound className="w-3 h-3" />
                  Change Password
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
