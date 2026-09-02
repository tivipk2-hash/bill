import React, { useState, useEffect } from 'react';
import {
  FormType,
  SavedInvoiceRecord,
  SmogTestFormData,
  Inspection90DayFormData,
  AnnualInspectionFormData,
} from './types';
import {
  getSavedInvoices,
  syncCloudInvoicesToLocal,
  getDefaultSmogTestData,
  getDefaultInspection90DayData,
  getDefaultAnnualInspectionData,
} from './utils/storage';
import { subscribeToCloudInvoices } from './utils/firebase';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LoginScreen } from './components/LoginScreen';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { SmogTestForm } from './components/forms/SmogTestForm';
import { Inspection90DayForm } from './components/forms/Inspection90DayForm';
import { AnnualInspectionForm } from './components/forms/AnnualInspectionForm';
import { InvoiceList } from './components/InvoiceList';
import { CheckCircle2 } from 'lucide-react';

export type ActiveTab = 'smog_test' | 'inspection_90day' | 'annual_inspection' | 'invoice_list';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('td_auth_session') === 'true';
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('smog_test');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isBackupRestoreOpen, setIsBackupRestoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active form editing session data
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | undefined>(undefined);
  const [editingSmogData, setEditingSmogData] = useState<SmogTestFormData | undefined>(undefined);
  const [editing90DayData, setEditing90DayData] = useState<Inspection90DayFormData | undefined>(undefined);
  const [editingAnnualData, setEditingAnnualData] = useState<AnnualInspectionFormData | undefined>(undefined);

  const [savedCount, setSavedCount] = useState<number>(() => getSavedInvoices().length);

  // Subscribe to real-time Firestore database updates across all networks/devices
  useEffect(() => {
    const unsubscribe = subscribeToCloudInvoices(
      (cloudInvoices) => {
        if (cloudInvoices && cloudInvoices.length > 0) {
          syncCloudInvoicesToLocal(cloudInvoices);
          setSavedCount(cloudInvoices.length);
        }
      },
      (err) => {
        console.warn('Firestore real-time subscription error:', err);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const updateSavedCount = () => {
    setSavedCount(getSavedInvoices().length);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('td_auth_session', 'true');
    showToast('Signed in successfully!');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      setIsAuthenticated(false);
      sessionStorage.removeItem('td_auth_session');
    }
  };

  const handleSelectInvoiceFromList = (record: SavedInvoiceRecord) => {
    setCurrentInvoiceId(record.id);

    if (record.type === 'smog_test') {
      setEditingSmogData(record.data as SmogTestFormData);
      setActiveTab('smog_test');
    } else if (record.type === 'inspection_90day') {
      setEditing90DayData(record.data as Inspection90DayFormData);
      setActiveTab('inspection_90day');
    } else if (record.type === 'annual_inspection') {
      setEditingAnnualData(record.data as AnnualInspectionFormData);
      setActiveTab('annual_inspection');
    }

    showToast(`Loaded invoice #${record.invoiceOrFormNo || ''} (${record.customerOrCarrier || ''})`);
  };

  const handleNewInvoice = (type: FormType) => {
    setCurrentInvoiceId(undefined);
    if (type === 'smog_test') {
      setEditingSmogData(getDefaultSmogTestData());
      setActiveTab('smog_test');
    } else if (type === 'inspection_90day') {
      setEditing90DayData(getDefaultInspection90DayData());
      setActiveTab('inspection_90day');
    } else if (type === 'annual_inspection') {
      setEditingAnnualData(getDefaultAnnualInspectionData());
      setActiveTab('annual_inspection');
    }
  };

  const handleTopSearchFocus = () => {
    if (activeTab !== 'invoice_list') {
      setActiveTab('invoice_list');
    }
  };

  const handleTopSearchChange = (val: string) => {
    setGlobalSearchQuery(val);
    if (activeTab !== 'invoice_list') {
      setActiveTab('invoice_list');
    }
  };

  // If user is not authenticated, show Clean Minimalism login screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const getTabTitle = () => {
    switch (activeTab) {
      case 'smog_test':
        return 'T&D Smog Test Report';
      case 'inspection_90day':
        return 'T&D Inspection (90 Day)';
      case 'annual_inspection':
        return 'Record of Annual Inspection';
      case 'invoice_list':
        return 'Search History & Records';
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] text-[#1a1a1a] font-sans overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'invoice_list') {
            updateSavedCount();
          }
        }}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        onOpenBackupRestore={() => setIsBackupRestoreOpen(true)}
        onLogout={handleLogout}
        savedCount={savedCount}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopHeader
          activeTabTitle={getTabTitle()}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onSearchFocus={handleTopSearchFocus}
          onSearchChange={handleTopSearchChange}
          searchQuery={globalSearchQuery}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'smog_test' && (
            <SmogTestForm
              key={currentInvoiceId || 'new-smog'}
              initialData={editingSmogData}
              invoiceId={currentInvoiceId}
              onSaved={() => {
                updateSavedCount();
              }}
            />
          )}

          {activeTab === 'inspection_90day' && (
            <Inspection90DayForm
              key={currentInvoiceId || 'new-90day'}
              initialData={editing90DayData}
              invoiceId={currentInvoiceId}
              onSaved={() => {
                updateSavedCount();
              }}
            />
          )}

          {activeTab === 'annual_inspection' && (
            <AnnualInspectionForm
              key={currentInvoiceId || 'new-annual'}
              initialData={editingAnnualData}
              invoiceId={currentInvoiceId}
              onSaved={() => {
                updateSavedCount();
              }}
            />
          )}

          {activeTab === 'invoice_list' && (
            <InvoiceList
              searchQueryExternal={globalSearchQuery}
              onSearchQueryExternalChange={setGlobalSearchQuery}
              onSelectInvoice={handleSelectInvoiceFromList}
              onNewInvoice={handleNewInvoice}
            />
          )}
        </main>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* Global Backup & Restore Center Modal */}
      <BackupRestoreModal
        isOpen={isBackupRestoreOpen}
        onClose={() => setIsBackupRestoreOpen(false)}
        onDataRestored={() => {
          updateSavedCount();
          showToast('Invoices backup successfully restored and synced to cloud!');
        }}
      />
    </div>
  );
}
