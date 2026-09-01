import React, { useState } from 'react';
import { AnnualInspectionFormData, SavedInvoiceRecord } from '../../types';
import { saveInvoice, getDefaultAnnualInspectionData, ANNUAL_INSPECTION_ITEMS } from '../../utils/storage';
import { exportElementAsImage } from '../../utils/exportImage';
import { SignatureModal } from '../SignatureModal';
import { Download, Printer, Sparkles, RefreshCw, PenTool, CheckCircle2, CheckSquare, Phone, Plus } from 'lucide-react';

interface AnnualInspectionFormProps {
  initialData?: AnnualInspectionFormData;
  invoiceId?: string;
  onSaved?: (savedId: string) => void;
}

export const AnnualInspectionForm: React.FC<AnnualInspectionFormProps> = ({
  initialData,
  invoiceId,
  onSaved,
}) => {
  const [formData, setFormData] = useState<AnnualInspectionFormData>(
    initialData || getDefaultAnnualInspectionData()
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const updateField = <K extends keyof AnnualInspectionFormData>(
    key: K,
    value: AnnualInspectionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleVehicleType = (type: keyof AnnualInspectionFormData['vehicleTypes']) => {
    setFormData((prev) => ({
      ...prev,
      vehicleTypes: {
        ...prev.vehicleTypes,
        [type]: !prev.vehicleTypes[type],
      },
    }));
  };

  const updateCondition = (key: string, val: 'OK' | 'Repair') => {
    setFormData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [key]: prev.conditions[key] === val ? '' : val,
      },
    }));
  };

  const handleSetAllOK = () => {
    const updated: Record<string, 'OK' | 'Repair' | ''> = {};
    ANNUAL_INSPECTION_ITEMS.forEach((item) => {
      updated[item.key] = 'OK';
    });
    setFormData((prev) => ({ ...prev, conditions: updated }));
    showToast('All inspection items marked: OK');
  };

  const handleNewInvoice = () => {
    setFormData(getDefaultAnnualInspectionData());
    showToast('New Annual Inspection invoice created!');
  };

  const handleFillSample = () => {
    const today = new Date().toISOString().split('T')[0];
    const updated: Record<string, 'OK' | 'Repair' | ''> = {};
    ANNUAL_INSPECTION_ITEMS.forEach((item) => {
      updated[item.key] = 'OK';
    });

    setFormData({
      isAnnual: true,
      formNo: '0001',
      vehicleTypes: {
        truck: false,
        tractor: true,
        trailer: false,
        converterDolly: false,
      },
      year: '2023',
      make: 'Kenworth',
      model: 'T680 NextGen',
      vehicleIdNo: '1XKDDB9X1NJ294810',
      tagNoState: '7XYZ456 CA',
      carrierName: 'California West Coast Express',
      date: today,
      inspectionLocation: '13332 S. Prairie Ave, Hawthorne, CA',
      unitNo: 'UNIT-88',
      conditions: updated,
      remarks: 'ALL CRITICAL MOTOR VEHICLE SAFETY SYSTEMS INSPECTED AND APPROVED UNDER 49 CFR 396.17-23.',
      inspectorSignature: 'David Tran (Cert #CA-8891)',
      signatureType: 'type',
      inspectorDate: today,
    });
    showToast('Sample Annual Inspection data loaded!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset this annual inspection report?')) {
      setFormData(getDefaultAnnualInspectionData());
      showToast('Form reset successfully!');
    }
  };

  const handleSaveAndExport = async (format: 'png' | 'jpeg' = 'png') => {
    setIsExporting(true);
    const targetId = invoiceId || `annual_${Date.now()}`;
    const record: SavedInvoiceRecord = {
      id: targetId,
      type: 'annual_inspection',
      title: `Annual Inspection - ${formData.carrierName || 'Carrier'} (${formData.make} ${formData.model})`,
      customerOrCarrier: formData.carrierName || 'N/A',
      licenseOrTag: formData.tagNoState || 'N/A',
      phone: '(714) 717-4738',
      vin: formData.vehicleIdNo || 'N/A',
      invoiceOrFormNo: formData.formNo || 'N/A',
      date: formData.date || new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data: formData,
    };

    try {
      saveInvoice(record);

      const safeCarrier = (formData.carrierName || 'Carrier').replace(/[^a-zA-Z0-9]/g, '_');
      const safeTag = (formData.tagNoState || 'Tag').replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `TD_AnnualInspection_No${formData.formNo || 'No'}_${safeCarrier}_${safeTag}_${formData.date}`;

      await exportElementAsImage('annual-inspection-document', {
        fileName,
        format,
        scale: 2.5,
      });

      showToast('Invoice saved & image exported successfully!');
      if (onSaved) onSaved(targetId);
    } catch (err) {
      console.error('Export error', err);
      showToast('Invoice saved. Direct image export note.');
    } finally {
      setIsExporting(false);
    }
  };

  // Group items into 3 columns matching original document
  const col1Items = ANNUAL_INSPECTION_ITEMS.filter((i) =>
    ['BRAKES', 'COUPLERS', 'EXHAUST'].includes(i.category)
  );
  const col2Items = ANNUAL_INSPECTION_ITEMS.filter((i) =>
    ['LIGHTING', 'CAB/BODY', 'STEERING'].includes(i.category)
  );
  const col3Items = ANNUAL_INSPECTION_ITEMS.filter((i) =>
    ['FUEL SYSTEM', 'SUSPENSION', 'FRAME', 'TIRES', 'WHEELS/RIMS', 'WINDSHIELD', 'WINDSHIELD WIPERS', 'MIRRORS'].includes(i.category)
  );

  const renderColumn = (items: typeof ANNUAL_INSPECTION_ITEMS) => {
    let currentCategory = '';
    return items.map((item) => {
      const isNewCategory = item.category !== currentCategory;
      if (isNewCategory) currentCategory = item.category;

      return (
        <React.Fragment key={item.key}>
          {isNewCategory && (
            <div className="bg-slate-200 font-extrabold text-[10px] px-1 py-0.5 border-y border-black uppercase tracking-wider text-black">
              {item.category}
            </div>
          )}
          <div className="grid grid-cols-12 text-[10px] py-0.5 border-b border-slate-200 items-center px-1">
            <span className="col-span-8 truncate font-medium text-black">
              {item.label}
            </span>
            <div className="col-span-2 flex justify-center">
              <button
                type="button"
                onClick={() => updateCondition(item.key, 'OK')}
                className={`w-4 h-4 border border-black flex items-center justify-center font-bold text-[9px] cursor-pointer transition ${
                  formData.conditions[item.key] === 'OK'
                    ? 'bg-black text-white'
                    : 'bg-white text-transparent hover:bg-slate-100'
                }`}
              >
                ✓
              </button>
            </div>
            <div className="col-span-2 flex justify-center">
              <button
                type="button"
                onClick={() => updateCondition(item.key, 'Repair')}
                className={`w-4 h-4 border border-black flex items-center justify-center font-bold text-[9px] cursor-pointer transition ${
                  formData.conditions[item.key] === 'Repair'
                    ? 'bg-rose-600 text-white border-rose-700'
                    : 'bg-white text-transparent hover:bg-rose-50'
                }`}
              >
                X
              </button>
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Top Action Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm">
            03
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Record of Annual Inspection
              </h2>
              <span className="inline-flex items-center text-[11px] text-slate-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                Ready to export
              </span>
            </div>
            <p className="text-xs text-slate-500">
              49 CFR, 396.17-23 • Periodic Safety Inspection Report
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* New Invoice Button (Thêm mới) */}
          <button
            type="button"
            onClick={handleNewInvoice}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition shadow-2xs cursor-pointer"
            title="Create a new blank invoice"
          >
            <Plus className="w-4 h-4" />
            + New Invoice
          </button>
          <button
            type="button"
            onClick={handleSetAllOK}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition shadow-2xs cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Check All OK
          </button>
          <button
            type="button"
            onClick={handleFillSample}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Fill Sample
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            Print
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleSaveAndExport('png')}
            className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm shadow-teal-100 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting Image...' : 'Export as Image'}
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div className="flex justify-center overflow-x-auto pb-10">
        <div
          id="annual-inspection-document"
          className="w-full max-w-[840px] bg-white text-black p-6 md:p-8 border border-slate-300 shadow-xl rounded-sm print:border-none print:shadow-none print:p-0 print:m-0 font-sans"
          style={{ minHeight: '1100px', backgroundColor: '#ffffff' }}
        >
          {/* HEADER SECTION */}
          <div className="grid grid-cols-12 items-start border-b border-black pb-2 gap-2">
            {/* Left Phone / Logo */}
            <div className="col-span-3 text-xs">
              <div className="font-extrabold uppercase text-xs">T AND D</div>
              <div className="text-[9px] uppercase font-bold text-slate-700">INSPECTION</div>
              <div className="mt-1 space-y-0.5 font-bold text-[11px]">
                <div>(626) 494-3403</div>
                <div>(714) 717-4738</div>
              </div>
            </div>

            {/* Center Main Title */}
            <div className="col-span-6 text-center">
              <h1 className="text-base md:text-lg font-black tracking-tight uppercase leading-tight">
                RECORD OF ANNUAL INSPECTION
              </h1>
              <div className="font-bold text-xs mt-0.5 text-black">
                (49CFR, 396.17-23)
              </div>
              <p className="text-[10px] italic text-slate-700 mt-0.5">
                Prepare Separate Reports For Each Vehicle Inspected
              </p>
            </div>

            {/* Right Form # and Annual Checkbox */}
            <div className="col-span-3 text-right">
              <div className="flex items-center justify-end gap-2 text-xs font-bold mb-1">
                <input
                  type="checkbox"
                  checked={formData.isAnnual}
                  onChange={(e) => updateField('isAnnual', e.target.checked)}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
                <span>Annual</span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <span className="font-serif font-black text-lg">№</span>
                <input
                  type="text"
                  value={formData.formNo}
                  onChange={(e) => updateField('formNo', e.target.value)}
                  placeholder="0001"
                  className="w-20 text-right font-mono font-bold text-red-600 text-lg outline-hidden bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* VEHICLE TYPE SELECTOR */}
          <div className="py-2 border-b border-black">
            <div className="flex items-center justify-center gap-6 text-xs font-bold uppercase tracking-wider">
              <span className="text-black font-extrabold">VEHICLE TYPE:</span>
              {(['truck', 'tractor', 'trailer', 'converterDolly'] as const).map((vt) => (
                <label key={vt} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.vehicleTypes[vt]}
                    onChange={() => toggleVehicleType(vt)}
                    className="w-4 h-4 accent-black"
                  />
                  <span>
                    {vt === 'converterDolly'
                      ? 'CONVERTER DOLLY'
                      : vt.toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* VEHICLE & CARRIER DETAILS */}
          <div className="border-b border-black py-2 text-xs space-y-2">
            {/* Row 1: Year, Make, Model */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3 flex items-baseline gap-2">
                <span className="font-bold uppercase whitespace-nowrap text-[11px]">Year:</span>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => updateField('year', e.target.value)}
                  placeholder="2023"
                  className="w-full border-b border-black font-bold outline-hidden bg-transparent"
                />
              </div>
              <div className="col-span-4 flex items-baseline gap-2">
                <span className="font-bold uppercase whitespace-nowrap text-[11px]">Make:</span>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => updateField('make', e.target.value)}
                  placeholder="Kenworth"
                  className="w-full border-b border-black font-bold outline-hidden bg-transparent"
                />
              </div>
              <div className="col-span-5 flex items-baseline gap-2">
                <span className="font-bold uppercase whitespace-nowrap text-[11px]">Model:</span>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => updateField('model', e.target.value)}
                  placeholder="T680"
                  className="w-full border-b border-black font-bold outline-hidden bg-transparent"
                />
              </div>
            </div>

            {/* Row 2: Vehicle ID # & Tag # / State */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 flex items-baseline gap-2">
                <span className="font-bold uppercase whitespace-nowrap text-[11px]">Vehicle ID #:</span>
                <input
                  type="text"
                  value={formData.vehicleIdNo}
                  onChange={(e) => updateField('vehicleIdNo', e.target.value.toUpperCase())}
                  placeholder="VIN Number..."
                  className="w-full border-b border-black font-mono font-bold outline-hidden uppercase bg-transparent"
                />
              </div>
              <div className="col-span-6 flex items-baseline gap-2">
                <span className="font-bold uppercase whitespace-nowrap text-[11px]">Tag # / State:</span>
                <input
                  type="text"
                  value={formData.tagNoState}
                  onChange={(e) => updateField('tagNoState', e.target.value.toUpperCase())}
                  placeholder="7XYZ456 CA"
                  className="w-full border-b border-black font-bold outline-hidden uppercase bg-transparent"
                />
              </div>
            </div>

            {/* Row 3: Carrier Name & Date */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8 flex items-baseline gap-2">
                <span className="font-bold uppercase whitespace-nowrap text-[11px]">Carrier Name:</span>
                <input
                  type="text"
                  value={formData.carrierName}
                  onChange={(e) => updateField('carrierName', e.target.value)}
                  placeholder="Carrier / Company Name"
                  className="w-full border-b border-black font-bold text-sm outline-hidden uppercase bg-transparent"
                />
              </div>
              <div className="col-span-4 flex items-baseline gap-2">
                <span className="font-bold uppercase whitespace-nowrap text-[11px]">Date:</span>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full border-b border-black font-bold outline-hidden bg-transparent text-center"
                />
              </div>
            </div>

            {/* Row 4: Inspection Location */}
            <div className="flex items-baseline gap-2">
              <span className="font-bold uppercase whitespace-nowrap text-[11px]">Inspection Location:</span>
              <input
                type="text"
                value={formData.inspectionLocation}
                onChange={(e) => updateField('inspectionLocation', e.target.value)}
                placeholder="Inspection Location (e.g. Hawthorne, CA)"
                className="w-full border-b border-black font-medium outline-hidden bg-transparent"
              />
            </div>

            {/* Row 5: Unit # */}
            <div className="flex items-baseline gap-2">
              <span className="font-bold uppercase whitespace-nowrap text-[11px]">Unit #:</span>
              <input
                type="text"
                value={formData.unitNo}
                onChange={(e) => updateField('unitNo', e.target.value)}
                placeholder="UNIT-88"
                className="w-full border-b border-black font-bold outline-hidden bg-transparent"
              />
            </div>
          </div>

          {/* REPORT OF CONDITION BANNER */}
          <div className="bg-slate-300 border-x border-b border-black py-1 text-center font-black text-xs uppercase tracking-widest text-black">
            REPORT OF CONDITION
          </div>

          {/* 3-COLUMN TABLE */}
          <div className="grid grid-cols-3 border-x border-b border-black divide-x divide-black">
            {/* Column 1 */}
            <div>
              <div className="grid grid-cols-12 bg-slate-100 font-extrabold text-[9px] py-1 px-1 border-b border-black text-center">
                <span className="col-span-8 text-left">ITEM</span>
                <span className="col-span-2">OK</span>
                <span className="col-span-2 text-rose-700">Repair</span>
              </div>
              <div>{renderColumn(col1Items)}</div>
            </div>

            {/* Column 2 */}
            <div>
              <div className="grid grid-cols-12 bg-slate-100 font-extrabold text-[9px] py-1 px-1 border-b border-black text-center">
                <span className="col-span-8 text-left">ITEM</span>
                <span className="col-span-2">OK</span>
                <span className="col-span-2 text-rose-700">Repair</span>
              </div>
              <div>{renderColumn(col2Items)}</div>
            </div>

            {/* Column 3 */}
            <div>
              <div className="grid grid-cols-12 bg-slate-100 font-extrabold text-[9px] py-1 px-1 border-b border-black text-center">
                <span className="col-span-8 text-left">ITEM</span>
                <span className="col-span-2">OK</span>
                <span className="col-span-2 text-rose-700">Repair</span>
              </div>
              <div>{renderColumn(col3Items)}</div>
            </div>
          </div>

          {/* REMARKS SECTION */}
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-xs uppercase whitespace-nowrap">Remarks:</span>
              <input
                type="text"
                value={formData.remarks}
                onChange={(e) => updateField('remarks', e.target.value)}
                placeholder="Additional inspection notes..."
                className="w-full border-b border-black font-serif text-xs outline-hidden bg-transparent"
              />
            </div>
          </div>

          {/* COMPLIANCE STATEMENT */}
          <div className="mt-2 text-[10px] font-semibold text-center italic text-black">
            This vehicle has been inspected and repaired as needed to comply with 49 part 396. Appendix G.
          </div>

          {/* FOOTER SIGNATURE & DATE */}
          <div className="mt-3 pt-3 border-t-2 border-black flex flex-wrap items-end justify-between gap-4">
            <div className="flex-1 flex items-end gap-2">
              <span className="font-bold text-[11px] uppercase whitespace-nowrap">
                QUALIFIED INSPECTOR'S SIGNATURE:
              </span>
              <div
                onClick={() => setIsSignatureModalOpen(true)}
                className="flex-1 border-b-2 border-black min-h-[36px] flex items-center justify-center cursor-pointer hover:bg-slate-50 transition px-2 group"
                title="Click to sign digitally or leave blank for handwritten signature"
              >
                {formData.signatureType === 'draw' && formData.inspectorSignature.startsWith('data:image') ? (
                  <img
                    src={formData.inspectorSignature}
                    alt="Signature"
                    className="h-9 object-contain max-w-[240px]"
                  />
                ) : formData.inspectorSignature ? (
                  <span
                    className="text-2xl text-blue-950 font-bold"
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    {formData.inspectorSignature}
                  </span>
                ) : (
                  <span className="no-print no-export text-[11px] text-slate-400 italic font-normal group-hover:text-slate-600 select-none">
                    (Click to sign or leave blank to hand-sign)
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsSignatureModalOpen(true)}
                className="no-print text-xs text-teal-600 hover:text-teal-800 font-semibold cursor-pointer pb-1"
                title="Sign digitally or clear signature"
              >
                <PenTool className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-end gap-2 w-48">
              <span className="font-bold text-[11px] uppercase">DATE:</span>
              <input
                type="date"
                value={formData.inspectorDate}
                onChange={(e) => updateField('inspectorDate', e.target.value)}
                className="flex-1 font-bold text-xs border-b-2 border-black px-1 outline-hidden bg-transparent text-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        initialSignature={formData.inspectorSignature}
        initialType={formData.signatureType}
        title="Qualified Inspector Signature"
        onSave={(sig, type) => {
          updateField('inspectorSignature', sig);
          updateField('signatureType', type);
        }}
      />
    </div>
  );
};
