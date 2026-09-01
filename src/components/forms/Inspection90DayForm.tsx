import React, { useState } from 'react';
import { Inspection90DayFormData, SavedInvoiceRecord } from '../../types';
import { saveInvoice, getDefaultInspection90DayData } from '../../utils/storage';
import { exportElementAsImage } from '../../utils/exportImage';
import { SignatureModal } from '../SignatureModal';
import { Download, Printer, Sparkles, RefreshCw, PenTool, CheckCircle2, Phone, CheckSquare, Plus } from 'lucide-react';

interface Inspection90DayFormProps {
  initialData?: Inspection90DayFormData;
  invoiceId?: string;
  onSaved?: (savedId: string) => void;
}

export const Inspection90DayForm: React.FC<Inspection90DayFormProps> = ({
  initialData,
  invoiceId,
  onSaved,
}) => {
  const [formData, setFormData] = useState<Inspection90DayFormData>(
    initialData || getDefaultInspection90DayData()
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const updateField = <K extends keyof Inspection90DayFormData>(
    key: K,
    value: Inspection90DayFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateChecklist = (
    key: keyof Inspection90DayFormData['checklist'],
    val: 'OK' | 'NR'
  ) => {
    setFormData((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [key]: prev.checklist[key] === val ? '' : val,
      },
    }));
  };

  const handleSetAllOK = () => {
    setFormData((prev) => ({
      ...prev,
      checklist: {
        brakeComponents: 'OK',
        steeringComponents: 'OK',
        frameSuspension: 'OK',
        tiresWheels: 'OK',
        couplingDevices: 'OK',
        lightsReflectors: 'OK',
        fuelExhaust: 'OK',
        other: 'OK',
      },
    }));
    showToast('All checklist items marked: OK');
  };

  const handleNewInvoice = () => {
    setFormData(getDefaultInspection90DayData());
    showToast('New 90-Day Inspection invoice created!');
  };

  const handleFillSample = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      inspectionDate: today,
      carrierName: 'Golden State Express Inc',
      unitNo: 'TK-889',
      year: '2023',
      vin: '1FUJGVD07PL092817',
      licenseNo: '9TRK301',
      formNo: Math.floor(1000 + Math.random() * 9000).toString(),
      checklist: {
        brakeComponents: 'OK',
        steeringComponents: 'OK',
        frameSuspension: 'OK',
        tiresWheels: 'OK',
        couplingDevices: 'OK',
        lightsReflectors: 'OK',
        fuelExhaust: 'OK',
        other: 'OK',
      },
      repairsNeeded: 'NONE. All safety mechanisms, air pressure, kingpin, tires and lights pass 90-day certification.',
      inspectorSignature: 'Mark Nguyen (Inspector #4402)',
      signatureType: 'type',
      inspectorDate: today,
    });
    showToast('Sample 90-Day Inspection data loaded!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset this inspection form?')) {
      setFormData(getDefaultInspection90DayData());
      showToast('Form reset successfully!');
    }
  };

  const handleSaveAndExport = async (format: 'png' | 'jpeg' = 'png') => {
    setIsExporting(true);
    const targetId = invoiceId || `inspection90_${Date.now()}`;
    const record: SavedInvoiceRecord = {
      id: targetId,
      type: 'inspection_90day',
      title: `T&D 90-Day - ${formData.carrierName || 'Carrier'} (Unit #${formData.unitNo || 'N/A'})`,
      customerOrCarrier: formData.carrierName || 'N/A',
      licenseOrTag: formData.licenseNo || 'N/A',
      phone: '(626) 494-3403',
      vin: formData.vin || 'N/A',
      invoiceOrFormNo: formData.formNo || 'N/A',
      date: formData.inspectionDate || new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data: formData,
    };

    try {
      saveInvoice(record);

      const safeCarrier = (formData.carrierName || 'Carrier').replace(/[^a-zA-Z0-9]/g, '_');
      const safeUnit = (formData.unitNo || 'Unit').replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `TD_90DayInspection_No${formData.formNo || 'No'}_${safeCarrier}_${safeUnit}_${formData.inspectionDate}`;

      await exportElementAsImage('inspection-90day-document', {
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

  const checklistItems = [
    {
      key: 'brakeComponents' as const,
      title: 'Brake components and leaks:',
      details: 'includes: low air warning, valves, air loss, chambers, etc.',
    },
    {
      key: 'steeringComponents' as const,
      title: 'Steering components:',
      details: 'includes: ball joints, free play, steering box, etc.',
    },
    {
      key: 'frameSuspension' as const,
      title: 'Frame and suspension:',
      details: 'includes: springs, shackles, hangers, "U" bolts, air bags, etc.',
    },
    {
      key: 'tiresWheels' as const,
      title: 'Tires and wheels:',
      details: 'includes: flats, worn tread, seal leaks, hub leaks, damaged tires, etc.',
    },
    {
      key: 'couplingDevices' as const,
      title: 'Coupling/connection devices:',
      details: 'includes: 5th wheel pivot pins & bushing, slider, etc.',
    },
    {
      key: 'lightsReflectors' as const,
      title: 'Lights and reflectors:',
      details: 'includes: all lights, ID lights, clearance lights, brakes, signal lights, etc.',
    },
    {
      key: 'fuelExhaust' as const,
      title: 'Fuel and exhaust:',
      details: 'includes: fuel leaks, exhaust leaks, etc',
    },
    {
      key: 'other' as const,
      title: 'Other:',
      details: 'includes: windshield crack, wipers, Drive shaft, yoke, mirrors, excessive oil leaks, etc.',
    },
  ];

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
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
            02
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                T&D Inspection (90 Day Report)
              </h2>
              <span className="inline-flex items-center text-[11px] text-slate-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                Ready to export
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Truck / Tractor Vehicle Inspection Report • Periodic 90-Day
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* New Invoice Button (Thêm mới) */}
          <button
            type="button"
            onClick={handleNewInvoice}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition shadow-2xs cursor-pointer"
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
            className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm shadow-indigo-100 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting Image...' : 'Export as Image'}
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div className="flex justify-center overflow-x-auto pb-10">
        <div
          id="inspection-90day-document"
          className="w-full max-w-[840px] bg-white text-black p-8 md:p-10 border border-slate-300 shadow-xl rounded-sm print:border-none print:shadow-none print:p-0 print:m-0 font-sans"
          style={{ minHeight: '1100px', backgroundColor: '#ffffff' }}
        >
          {/* HEADER SECTION */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black font-sans uppercase">
                T AND D INSPECTION
              </h1>
              <div className="flex items-center gap-4 text-sm font-bold mt-1 text-black">
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4 fill-black" /> (626) 494-3403
                </span>
                <span>(714) 717-4738</span>
              </div>
            </div>

            {/* Right Logos / Emblem */}
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-2">
                <div className="text-center font-bold">
                  <div className="text-xs tracking-wider uppercase font-black">T AND D</div>
                  <div className="text-[10px] uppercase font-bold text-slate-700">INSPECTION</div>
                  <div className="text-[8px] uppercase tracking-tighter">TRUCK AND MECHANIC SERVICE</div>
                </div>
                <div className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center font-black text-xs">
                  VIE
                </div>
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <div className="mt-4 font-bold text-base md:text-lg uppercase tracking-wide border-b-2 border-black pb-1">
            TRUCK/TRACTOR VEHICLE INSPECTION REPORT
          </div>

          {/* Inspection Date & 90 DAY Badge Box */}
          <div className="grid grid-cols-12 gap-0 border border-black mt-2">
            <div className="col-span-8 p-2 border-r border-black flex items-center gap-2">
              <span className="font-bold text-xs uppercase">INSPECTION DATE:</span>
              <input
                type="date"
                value={formData.inspectionDate}
                onChange={(e) => updateField('inspectionDate', e.target.value)}
                className="font-bold text-base outline-hidden bg-transparent border-b border-black px-1"
              />
            </div>
            <div className="col-span-4 p-2 bg-slate-100 flex items-center justify-center border-l-2 border-black">
              <span className="text-2xl md:text-3xl font-black tracking-widest uppercase">
                90 DAY
              </span>
            </div>
          </div>

          {/* Carrier & Vehicle Info Grid */}
          <div className="border-x border-b border-black text-xs">
            {/* Row 1: Carrier & Unit */}
            <div className="grid grid-cols-12 border-b border-black divide-x divide-black">
              <div className="col-span-8 p-1.5 flex items-center gap-2">
                <span className="font-bold uppercase text-[11px] whitespace-nowrap">
                  CARRIER NAME:
                </span>
                <input
                  type="text"
                  value={formData.carrierName}
                  onChange={(e) => updateField('carrierName', e.target.value)}
                  placeholder="Carrier / Company Name"
                  className="w-full font-bold text-sm outline-hidden uppercase bg-transparent"
                />
              </div>
              <div className="col-span-4 p-1.5 flex items-center gap-2">
                <span className="font-bold uppercase text-[11px] whitespace-nowrap">
                  UNIT#:
                </span>
                <input
                  type="text"
                  value={formData.unitNo}
                  onChange={(e) => updateField('unitNo', e.target.value)}
                  placeholder="TRK-101"
                  className="w-full font-bold text-sm outline-hidden uppercase bg-transparent"
                />
              </div>
            </div>

            {/* Row 2: Year, VIN, License#, Nº */}
            <div className="grid grid-cols-12 divide-x divide-black">
              <div className="col-span-2 p-1.5">
                <span className="font-bold uppercase text-[10px] block">YEAR:</span>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => updateField('year', e.target.value)}
                  placeholder="2022"
                  className="w-full font-bold text-sm outline-hidden bg-transparent"
                />
              </div>
              <div className="col-span-4 p-1.5">
                <span className="font-bold uppercase text-[10px] block">VIN:</span>
                <input
                  type="text"
                  value={formData.vin}
                  onChange={(e) => updateField('vin', e.target.value.toUpperCase())}
                  placeholder="17-Digit VIN Number"
                  className="w-full font-mono font-bold text-xs outline-hidden uppercase bg-transparent"
                />
              </div>
              <div className="col-span-3 p-1.5">
                <span className="font-bold uppercase text-[10px] block">LICENSE#:</span>
                <input
                  type="text"
                  value={formData.licenseNo}
                  onChange={(e) => updateField('licenseNo', e.target.value.toUpperCase())}
                  placeholder="License Plate"
                  className="w-full font-bold text-sm outline-hidden uppercase bg-transparent"
                />
              </div>
              <div className="col-span-3 p-1.5 flex items-center justify-between">
                <span className="font-serif font-black text-lg">№</span>
                <input
                  type="text"
                  value={formData.formNo}
                  onChange={(e) => updateField('formNo', e.target.value)}
                  placeholder="1011"
                  className="w-20 text-right font-mono font-bold text-red-600 text-lg outline-hidden bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* CHECKLIST TABLE */}
          <div className="mt-4">
            <div className="flex justify-end gap-5 pr-4 pb-1 text-xs font-black uppercase tracking-wider">
              <span className="w-8 text-center">OK</span>
              <span className="w-8 text-center text-rose-700">NR</span>
            </div>

            <div className="space-y-2 border-t border-black pt-2 text-xs">
              {checklistItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between py-1 border-b border-dotted border-slate-300 hover:bg-slate-50 transition"
                >
                  <div className="pr-4 leading-relaxed">
                    <span className="font-bold text-black">{item.title}</span>{' '}
                    <span className="text-slate-800">{item.details}</span>
                  </div>

                  <div className="flex items-center gap-5 shrink-0 pt-0.5">
                    {/* OK Box */}
                    <button
                      type="button"
                      onClick={() => updateChecklist(item.key, 'OK')}
                      className={`w-7 h-7 border-2 border-black flex items-center justify-center font-black text-sm transition cursor-pointer ${
                        formData.checklist[item.key] === 'OK'
                          ? 'bg-black text-white'
                          : 'bg-white text-transparent hover:bg-slate-100'
                      }`}
                    >
                      ✓
                    </button>

                    {/* NR (Needs Repair) Box */}
                    <button
                      type="button"
                      onClick={() => updateChecklist(item.key, 'NR')}
                      className={`w-7 h-7 border-2 border-black flex items-center justify-center font-black text-sm transition cursor-pointer ${
                        formData.checklist[item.key] === 'NR'
                          ? 'bg-rose-600 text-white border-rose-700'
                          : 'bg-white text-transparent hover:bg-rose-50'
                      }`}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REPAIRS NEEDED MULTI-LINE SECTION */}
          <div className="mt-6">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-bold text-sm uppercase">Repairs needed</span>
              <div className="flex-1 border-b border-black" />
            </div>

            <div className="space-y-5 mt-3">
              <textarea
                value={formData.repairsNeeded}
                onChange={(e) => updateField('repairsNeeded', e.target.value)}
                placeholder="List repairs needed (or write 'NONE' if all items pass inspection)..."
                rows={4}
                className="w-full font-serif text-sm leading-relaxed p-2 border-b-2 border-black border-t-0 border-x-0 outline-hidden resize-none bg-transparent"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #000 24px)',
                  lineHeight: '24px',
                  paddingTop: '2px',
                }}
              />
            </div>
          </div>

          {/* FOOTER SIGNATURE & DATE */}
          <div className="mt-10 pt-4 border-t-2 border-black flex flex-wrap items-end justify-between gap-6">
            <div className="flex-1 flex items-end gap-2">
              <span className="font-bold text-xs uppercase whitespace-nowrap">
                INSPECTOR SIGNATURE:
              </span>
              <div
                onClick={() => setIsSignatureModalOpen(true)}
                className="flex-1 border-b-2 border-black min-h-[40px] flex items-center justify-center cursor-pointer hover:bg-slate-50 transition px-2 group"
                title="Click to sign digitally or leave blank for handwritten signature"
              >
                {formData.signatureType === 'draw' && formData.inspectorSignature.startsWith('data:image') ? (
                  <img
                    src={formData.inspectorSignature}
                    alt="Inspector Signature"
                    className="h-10 object-contain max-w-[240px]"
                  />
                ) : formData.inspectorSignature ? (
                  <span
                    className="text-2xl text-blue-950 font-bold"
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    {formData.inspectorSignature}
                  </span>
                ) : (
                  <span className="no-print no-export text-xs text-slate-400 italic font-normal group-hover:text-slate-600 select-none">
                    (Click to sign or leave blank to hand-sign)
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsSignatureModalOpen(true)}
                className="no-print text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer pb-1"
                title="Sign digitally or clear signature"
              >
                <PenTool className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-end gap-2 w-56">
              <span className="font-bold text-xs uppercase">DATE:</span>
              <input
                type="date"
                value={formData.inspectorDate}
                onChange={(e) => updateField('inspectorDate', e.target.value)}
                className="flex-1 font-bold text-sm border-b-2 border-black px-1 outline-hidden bg-transparent text-center"
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
        title="Inspector Signature"
        onSave={(sig, type) => {
          updateField('inspectorSignature', sig);
          updateField('signatureType', type);
        }}
      />
    </div>
  );
};
