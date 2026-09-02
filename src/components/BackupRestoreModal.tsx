import React, { useState, useRef } from 'react';
import {
  exportAllDataToJson,
  importDataFromJsonWithMerge,
  ImportSummary,
  getSavedInvoices,
} from '../utils/storage';
import {
  Download,
  Upload,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  X,
  RefreshCw,
  ShieldCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentCount = getSavedInvoices().length;

  const handleFileChange = (file: File) => {
    if (!file) return;
    setSelectedFileName(file.name);
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setSelectedFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.json') || file.type.includes('json'))) {
      handleFileChange(file);
    }
  };

  const handleProcessImport = async () => {
    if (!selectedFileContent) return;
    setIsProcessing(true);
    setImportSummary(null);

    try {
      // Execute intelligent deduplication & merge
      const summary = await importDataFromJsonWithMerge(selectedFileContent);
      setImportSummary(summary);
      if (summary.success) {
        onDataRestored();
      }
    } catch (err) {
      setImportSummary({
        success: false,
        totalInFile: 0,
        newAdded: 0,
        updatedMerged: 0,
        skipped: 0,
        totalAfterImport: getSavedInvoices().length,
        errorMessage: err instanceof Error ? err.message : 'Import failed.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFileName(null);
    setSelectedFileContent(null);
    setImportSummary(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-none">
                Data Backup & Restore Center
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Export and restore invoice archives safely with smart deduplication
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Cloud Banner */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700">Currently Saved Invoices:</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/60">
                {currentCount} records
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              Cloud Synchronized
            </div>
          </div>

          {/* Section 1: Export / Backup */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-600" />
                  1. Backup Invoices Data
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Download a complete JSON file containing all invoices, dates, customer info, and signatures.
                </p>
              </div>
              <button
                type="button"
                onClick={exportAllDataToJson}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-xs cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                Download Backup
              </button>
            </div>
          </div>

          {/* Section 2: Upload & Restore with Deduplication */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                2. Upload & Restore Data
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Upload a previously exported backup file to restore your invoices.
              </p>
            </div>

            {/* Smart Deduplication Guarantee Pill */}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Zero Duplicate Errors:</strong> Existing records will be automatically merged without duplicate errors or data loss.
              </span>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50'
                  : selectedFileName
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
                className="hidden"
              />

              {selectedFileName ? (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                    <FileJson className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 break-all">{selectedFileName}</p>
                  <p className="text-[11px] text-slate-500">Click to choose a different file</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-1">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Click to browse or drag & drop backup JSON file here
                  </p>
                  <p className="text-[11px] text-slate-400">Supported format: .json backup files</p>
                </div>
              )}
            </div>

            {/* Upload Action Button */}
            {selectedFileName && !importSummary && (
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcessImport}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-xs cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Restoring & Merging...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      Upload & Merge Data
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Import Summary Result Banner */}
            {importSummary && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                  importSummary.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {importSummary.success ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Backup Restored & Synced Successfully!
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Restore Failed
                    </>
                  )}
                </div>

                {importSummary.success ? (
                  <div className="space-y-1.5 pt-1 text-slate-700 text-xs">
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-white/80 rounded-lg border border-emerald-100">
                      <div>
                        <span className="text-slate-500">Total in file:</span>{' '}
                        <strong className="text-slate-800">{importSummary.totalInFile}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">New added:</span>{' '}
                        <strong className="text-emerald-700">+{importSummary.newAdded}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Merged / Updated:</span>{' '}
                        <strong className="text-blue-700">{importSummary.updatedMerged}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Total in system:</span>{' '}
                        <strong className="text-slate-900">{importSummary.totalAfterImport}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-800 pt-0.5">
                      <Cloud className="w-3 h-3 text-emerald-600" />
                      All records are saved and automatically synced to Cloud Firestore.
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-rose-700">
                    {importSummary.errorMessage || 'An error occurred while parsing the backup file.'}
                  </p>
                )}

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg transition cursor-pointer"
                  >
                    Upload Another File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Automatic cloud sync is active across all devices.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
