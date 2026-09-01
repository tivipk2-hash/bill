import React, { useState, useMemo, useEffect } from 'react';
import { FormType, SavedInvoiceRecord } from '../types';
import {
  getSavedInvoices,
  deleteInvoice,
  saveInvoice,
  exportAllDataToJson,
  importDataFromJson,
} from '../utils/storage';
import {
  Search,
  FileText,
  Truck,
  FileSpreadsheet,
  Download,
  Trash2,
  Edit3,
  Copy,
  Calendar,
  Phone,
  Car,
  Hash,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Plus,
} from 'lucide-react';

interface InvoiceListProps {
  onSelectInvoice: (record: SavedInvoiceRecord) => void;
  onNewInvoice: (type: FormType) => void;
  searchQueryExternal?: string;
  onSearchQueryExternalChange?: (val: string) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  onSelectInvoice,
  onNewInvoice,
  searchQueryExternal,
  onSearchQueryExternalChange,
}) => {
  const [invoices, setInvoices] = useState<SavedInvoiceRecord[]>(() => getSavedInvoices());
  const [searchQuery, setSearchQuery] = useState(searchQueryExternal || '');
  const [filterType, setFilterType] = useState<FormType | 'all'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchQueryExternal !== undefined) {
      setSearchQuery(searchQueryExternal);
    }
  }, [searchQueryExternal]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (onSearchQueryExternalChange) {
      onSearchQueryExternalChange(val);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshList = () => {
    setInvoices(getSavedInvoices());
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete invoice:\n"${title}"?`)) {
      deleteInvoice(id);
      refreshList();
      showToast('Invoice deleted successfully!');
    }
  };

  const handleDuplicate = (record: SavedInvoiceRecord) => {
    const newId = `${record.type}_${Date.now()}`;
    const duplicated: SavedInvoiceRecord = {
      ...record,
      id: newId,
      title: `${record.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data: {
        ...record.data,
      },
    };
    saveInvoice(duplicated);
    refreshList();
    showToast('Invoice duplicated successfully!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataFromJson(content);
        if (success) {
          refreshList();
          showToast('Data restored from JSON backup file successfully!');
        } else {
          alert('Invalid JSON backup file format!');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Multi-field search
  const filteredInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return invoices.filter((inv) => {
      if (filterType !== 'all' && inv.type !== filterType) {
        return false;
      }

      if (!query) return true;

      const standardMatch =
        inv.title?.toLowerCase().includes(query) ||
        inv.customerOrCarrier?.toLowerCase().includes(query) ||
        inv.licenseOrTag?.toLowerCase().includes(query) ||
        inv.phone?.toLowerCase().includes(query) ||
        inv.vin?.toLowerCase().includes(query) ||
        inv.invoiceOrFormNo?.toLowerCase().includes(query) ||
        inv.date?.toLowerCase().includes(query);

      if (standardMatch) return true;

      try {
        const dataString = JSON.stringify(inv.data).toLowerCase();
        return dataString.includes(query);
      } catch {
        return false;
      }
    });
  }, [invoices, searchQuery, filterType]);

  const stats = useMemo(() => {
    return {
      total: invoices.length,
      smog: invoices.filter((i) => i.type === 'smog_test').length,
      inspection90: invoices.filter((i) => i.type === 'inspection_90day').length,
      annual: invoices.filter((i) => i.type === 'annual_inspection').length,
    };
  }, [invoices]);

  const getTypeBadge = (type: FormType) => {
    switch (type) {
      case 'smog_test':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Smog Test
          </span>
        );
      case 'inspection_90day':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            90-Day Inspection
          </span>
        );
      case 'annual_inspection':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
            Annual Inspection
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Top Banner & Quick Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Invoice & Inspection Archive
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Search by license plate, customer name, phone, VIN, or invoice number...
          </p>
        </div>

        {/* Quick New Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNewInvoice('smog_test')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + New Smog Test
          </button>
          <button
            type="button"
            onClick={() => onNewInvoice('inspection_90day')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + New 90-Day
          </button>
          <button
            type="button"
            onClick={() => onNewInvoice('annual_inspection')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-100 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + New Annual
          </button>
        </div>
      </div>

      {/* SEARCH BAR & FILTERS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by plate, name, phone, VIN, or invoice number..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm font-medium transition"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Badges & Data Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('smog_test')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                filterType === 'smog_test'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Smog Test ({stats.smog})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('inspection_90day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                filterType === 'inspection_90day'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              90-Day Inspection ({stats.inspection90})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('annual_inspection')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                filterType === 'annual_inspection'
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
              }`}
            >
              Annual Inspection ({stats.annual})
            </button>
          </div>

          {/* Backup / Restore JSON buttons */}
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={exportAllDataToJson}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition cursor-pointer shadow-2xs"
              title="Export all records to JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Backup JSON
            </button>
            <label className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition cursor-pointer shadow-2xs">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              Restore
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* RESULTS LIST */}
      {filteredInvoices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">
            No inspection records found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {searchQuery
              ? `No results matching "${searchQuery}".`
              : 'No saved invoices found in the archive.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="group bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                {/* Header Badge & Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getTypeBadge(inv.type)}
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {inv.date}
                  </span>
                </div>

                {/* Title & Customer */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                  {inv.customerOrCarrier || inv.title}
                </h3>

                {/* Key Details Tags */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-400">License / Plate:</span>
                    <span className="font-semibold text-slate-800 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[11px]">
                      {inv.licenseOrTag || 'N/A'}
                    </span>
                  </div>

                  {inv.phone && inv.phone !== 'N/A' && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-medium text-slate-800">{inv.phone}</span>
                    </div>
                  )}

                  {inv.vin && inv.vin !== 'N/A' && (
                    <div className="flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400">VIN:</span>
                      <span className="font-mono text-[11px] text-slate-700 truncate max-w-[180px]">
                        {inv.vin}
                      </span>
                    </div>
                  )}

                  {inv.invoiceOrFormNo && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400">No:</span>
                      <span className="font-bold text-blue-600 font-mono">
                        #{inv.invoiceOrFormNo}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectInvoice(inv)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Open & Export
                </button>

                <button
                  type="button"
                  onClick={() => handleDuplicate(inv)}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition cursor-pointer border border-transparent hover:border-slate-200"
                  title="Duplicate this invoice"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(inv.id, inv.title)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer border border-transparent hover:border-rose-100"
                  title="Delete invoice"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
