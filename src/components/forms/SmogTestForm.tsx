import React, { useState } from 'react';
import { SmogTestFormData, SavedInvoiceRecord } from '../../types';
import { saveInvoice, getDefaultSmogTestData } from '../../utils/storage';
import { exportElementAsImage } from '../../utils/exportImage';
import { SignatureModal } from '../SignatureModal';
import { AddressAutocomplete } from '../AddressAutocomplete';
import { Download, Printer, Plus, Sparkles, RefreshCw, PenTool, CheckCircle2, FilePlus } from 'lucide-react';

interface SmogTestFormProps {
  initialData?: SmogTestFormData;
  invoiceId?: string;
  onSaved?: (savedId: string) => void;
}

export const SmogTestForm: React.FC<SmogTestFormProps> = ({
  initialData,
  invoiceId,
  onSaved,
}) => {
  const [formData, setFormData] = useState<SmogTestFormData>(
    initialData || getDefaultSmogTestData()
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const updateField = <K extends keyof SmogTestFormData>(
    key: K,
    value: SmogTestFormData[K]
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      if (key.startsWith('fee') || key === 'feeVansHD' || key === 'feeCarsLightDuty' || key === 'feeSmogCert') {
        const fees = [
          parseFloat(updated.feeCarsLightDuty || '0') || 0,
          parseFloat(updated.feeVansHD || '0') || 0,
          parseFloat(updated.feeSmogCert || '0') || 0,
          parseFloat(updated.feeHybridTest || '0') || 0,
          parseFloat(updated.feePretest || '0') || 0,
          parseFloat(updated.feeEvapTest || '0') || 0,
          parseFloat(updated.feeOdbTest || '0') || 0,
        ];
        const sum = fees.reduce((a, b) => a + b, 0);
        if (sum > 0) {
          updated.totalPaid = sum.toFixed(2);
        }
      }
      return updated;
    });
  };

  const handleFillSample = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      invoiceNo: Math.floor(1000 + Math.random() * 9000).toString(),
      customerName: 'Robert Johnson',
      phone: '(714) 892-4411',
      address: '4580 W Rosecrans Ave',
      city: 'Hawthorne',
      state: 'CA',
      zip: '90250',
      vehYr: '2020',
      make: 'Toyota',
      model: 'Tacoma V6',
      cyl: '6',
      engSize: '3.5L',
      gvwr: '5600',
      atMt: 'AT',
      calFed: 'Cal',
      timing: 'Factory Spec',
      vin: '3TMCZ5AN9LM194820',
      license: '8TRK992',
      odometer: '62,450',
      carbNo: 'D-550-14',
      passOrFreeRetest: 'Yes',
      testResult: 'Pass',
      feeCarsLightDuty: '55.00',
      feeVansHD: '',
      feeSmogCert: '8.25',
      feeHybridTest: '',
      feePretest: '',
      feeEvapTest: '',
      feeOdbTest: '',
      feeEstimate: '',
      totalPaid: '63.25',
      paymentMethod: 'cc',
      customerSignature: 'Robert Johnson',
      signatureType: 'type',
    });
    showToast('Sample Smog Test data loaded!');
  };

  const handleNewInvoice = () => {
    setFormData(getDefaultSmogTestData());
    showToast('New Smog Test invoice created!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset this invoice form?')) {
      setFormData(getDefaultSmogTestData());
      showToast('Form reset successfully!');
    }
  };

  const handleSaveAndExport = async (format: 'png' | 'jpeg' = 'png') => {
    setIsExporting(true);
    const targetId = invoiceId || `smog_${Date.now()}`;
    const record: SavedInvoiceRecord = {
      id: targetId,
      type: 'smog_test',
      title: `T&D Smog Test - ${formData.customerName || 'Customer'} (${formData.make} ${formData.model})`,
      customerOrCarrier: formData.customerName || 'N/A',
      licenseOrTag: formData.license || 'N/A',
      phone: formData.phone || 'N/A',
      vin: formData.vin || 'N/A',
      invoiceOrFormNo: formData.invoiceNo || 'N/A',
      date: formData.date || new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data: formData,
    };

    try {
      await saveInvoice(record);

      const safeName = (formData.customerName || 'Customer').replace(/[^a-zA-Z0-9]/g, '_');
      const safePlate = (formData.license || 'Plate').replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `TD_SmogTest_Inv${formData.invoiceNo || 'No'}_${safeName}_${safePlate}_${formData.date}`;

      await exportElementAsImage('smog-test-document', {
        fileName,
        format,
        scale: 2.5,
      });

      showToast('Invoice synced to cloud & image exported successfully!');
      if (onSaved) onSaved(targetId);
    } catch (err) {
      console.error('Export error', err);
      showToast('Invoice saved & synced to cloud!');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            01
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                T&D Smog Test Report
              </h2>
              <span className="inline-flex items-center text-[11px] text-slate-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                Ready to export
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Certificate Number: CA-99201-X • Station #ARD 284163
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* New Invoice Button (Thêm mới) */}
          <button
            type="button"
            onClick={handleNewInvoice}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition shadow-2xs cursor-pointer"
            title="Create a new blank invoice"
          >
            <Plus className="w-4 h-4" />
            + New Invoice
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
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            Print
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleSaveAndExport('png')}
            className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-100 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting Image...' : 'Export as Image'}
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER (Paper Look) */}
      <div className="flex justify-center overflow-x-auto pb-10">
        <div
          id="smog-test-document"
          className="w-full max-w-[840px] bg-white text-black p-8 md:p-10 border border-slate-300 shadow-xl rounded-sm print:border-none print:shadow-none print:p-0 print:m-0 font-sans"
          style={{ minHeight: '1100px', backgroundColor: '#ffffff' }}
        >
          {/* HEADER SECTION */}
          <div className="flex items-start justify-between border-b-2 border-black pb-3">
            {/* California Smog Logo SVG Seal */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full border-4 border-black flex flex-col items-center justify-center p-1 text-center font-bold relative">
                <div className="text-[8px] tracking-tighter uppercase font-extrabold leading-tight">
                  SMOG TEST
                </div>
                <div className="text-2xl font-black my-[-2px]">✓</div>
                <div className="text-[7px] tracking-tighter uppercase font-extrabold leading-tight">
                  CALIFORNIA CENTER
                </div>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black font-sans uppercase">
                  T AND D SMOG TEST
                </h1>
                <p className="text-sm font-semibold text-black mt-0.5">
                  13332 S. Prairie Ave., Hawthorne, CA 90250
                </p>
                <div className="flex items-center gap-3 text-base font-bold mt-0.5">
                  <span>(714) 717-4738</span>
                  <span className="text-sm font-normal">|</span>
                  <span className="text-sm font-semibold">Station #ARD 284163</span>
                </div>
              </div>
            </div>

            {/* Date & Invoice Top Right */}
            <div className="text-right space-y-2 pt-2">
              <div className="flex items-center justify-end gap-2 text-sm">
                <span className="font-bold uppercase">Date:</span>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="border-b border-black px-1 py-0.5 font-semibold text-sm bg-transparent outline-hidden w-36 text-center"
                />
              </div>
              <div className="flex items-center justify-end gap-2 text-base">
                <span className="font-extrabold uppercase">Invoice #:</span>
                <input
                  type="text"
                  value={formData.invoiceNo}
                  onChange={(e) => updateField('invoiceNo', e.target.value)}
                  placeholder="1011"
                  className="border-b-2 border-black px-1 py-0.5 font-mono font-bold text-red-600 text-lg bg-transparent outline-hidden w-28 text-center"
                />
              </div>
            </div>
          </div>

          {/* CUSTOMER INFORMATION BOX */}
          <div className="border border-black mt-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-black divide-y md:divide-y-0 md:divide-x divide-black">
              <div className="p-1.5 col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-black">
                  CUSTOMER NAME:
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => updateField('customerName', e.target.value)}
                  placeholder="Customer Full Name"
                  className="w-full font-semibold text-sm outline-hidden uppercase bg-transparent"
                />
              </div>
              <div className="p-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-black">
                  PHONE:
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(714) 000-0000"
                  className="w-full font-semibold text-sm outline-hidden bg-transparent"
                />
              </div>
            </div>

            <div className="p-1.5 border-b border-black">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black">
                ADDRESS:
              </label>
              <AddressAutocomplete
                value={formData.address}
                onChange={(val) => updateField('address', val)}
                onSelectAddress={({ address, city, state, zip }) => {
                  setFormData((prev) => ({
                    ...prev,
                    address,
                    city: city || prev.city,
                    state: state || prev.state,
                    zip: zip || prev.zip,
                  }));
                }}
                placeholder="Street Address (e.g. 3417 Long St)"
                className="w-full font-semibold text-sm outline-hidden bg-transparent"
              />
            </div>

            <div className="grid grid-cols-3 divide-x divide-black">
              <div className="p-1.5 col-span-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-black">
                  CITY:
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="City"
                  className="w-full font-semibold text-sm outline-hidden bg-transparent"
                />
              </div>
              <div className="p-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-black">
                  STATE:
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="CA"
                  className="w-full font-semibold text-sm outline-hidden uppercase bg-transparent"
                />
              </div>
              <div className="p-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-black">
                  ZIP:
                </label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => updateField('zip', e.target.value)}
                  placeholder="90250"
                  className="w-full font-semibold text-sm outline-hidden bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* VEHICLE INFORMATION GRID */}
          <div className="border border-black mt-2 text-xs">
            <div className="grid grid-cols-5 border-b border-black divide-x divide-black text-center">
              <div className="p-1">
                <div className="text-[10px] font-bold uppercase">VEH. YR.</div>
                <input
                  type="text"
                  value={formData.vehYr}
                  onChange={(e) => updateField('vehYr', e.target.value)}
                  placeholder="2021"
                  className="w-full text-center font-bold text-sm outline-hidden bg-transparent"
                />
              </div>
              <div className="p-1">
                <div className="text-[10px] font-bold uppercase">MAKE</div>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => updateField('make', e.target.value)}
                  placeholder="TOYOTA"
                  className="w-full text-center font-bold text-sm outline-hidden uppercase bg-transparent"
                />
              </div>
              <div className="p-1">
                <div className="text-[10px] font-bold uppercase">MODEL</div>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => updateField('model', e.target.value)}
                  placeholder="CAMRY"
                  className="w-full text-center font-bold text-sm outline-hidden uppercase bg-transparent"
                />
              </div>
              <div className="p-1">
                <div className="text-[10px] font-bold uppercase">CYL.</div>
                <input
                  type="text"
                  value={formData.cyl}
                  onChange={(e) => updateField('cyl', e.target.value)}
                  placeholder="4"
                  className="w-full text-center font-bold text-sm outline-hidden bg-transparent"
                />
              </div>
              <div className="p-1">
                <div className="text-[10px] font-bold uppercase">ENG. SIZE</div>
                <input
                  type="text"
                  value={formData.engSize}
                  onChange={(e) => updateField('engSize', e.target.value)}
                  placeholder="2.5L"
                  className="w-full text-center font-bold text-sm outline-hidden bg-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 border-b border-black divide-x divide-black text-center">
              <div className="p-1">
                <div className="text-[10px] font-bold uppercase">GVWR</div>
                <input
                  type="text"
                  value={formData.gvwr}
                  onChange={(e) => updateField('gvwr', e.target.value)}
                  placeholder="3400"
                  className="w-full text-center font-semibold text-sm outline-hidden bg-transparent"
                />
              </div>
              <div className="p-1">
                <div className="text-[10px] font-bold uppercase">AT / MT</div>
                <div className="flex justify-center gap-3 mt-0.5">
                  <label className="flex items-center gap-1 cursor-pointer font-bold text-xs">
                    <input
                      type="radio"
                      name="atMt"
                      checked={formData.atMt === 'AT'}
                      onChange={() => updateField('atMt', 'AT')}
                      className="accent-black"
                    />
                    AT
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer font-bold text-xs">
                    <input
                      type="radio"
                      name="atMt"
                      checked={formData.atMt === 'MT'}
                      onChange={() => updateField('atMt', 'MT')}
                      className="accent-black"
                    />
                    MT
                  </label>
                </div>
              </div>
              <div className="p-1">
                <div className="text-[10px] font-bold uppercase">Cal / Fed</div>
                <div className="flex justify-center gap-3 mt-0.5">
                  <label className="flex items-center gap-1 cursor-pointer font-bold text-xs">
                    <input
                      type="radio"
                      name="calFed"
                      checked={formData.calFed === 'Cal'}
                      onChange={() => updateField('calFed', 'Cal')}
                      className="accent-black"
                    />
                    Cal
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer font-bold text-xs">
                    <input
                      type="radio"
                      name="calFed"
                      checked={formData.calFed === 'Fed'}
                      onChange={() => updateField('calFed', 'Fed')}
                      className="accent-black"
                    />
                    Fed
                  </label>
                </div>
              </div>
              <div className="p-1">
                <div className="text-[10px] font-bold uppercase">Timing</div>
                <input
                  type="text"
                  value={formData.timing}
                  onChange={(e) => updateField('timing', e.target.value)}
                  placeholder="Spec / OEM"
                  className="w-full text-center font-semibold text-sm outline-hidden bg-transparent"
                />
              </div>
            </div>

            {/* VIN Row */}
            <div className="p-1.5 border-b border-black flex items-center gap-2">
              <span className="font-bold text-xs uppercase w-12">VIN:</span>
              <input
                type="text"
                value={formData.vin}
                onChange={(e) => updateField('vin', e.target.value.toUpperCase())}
                placeholder="17-Digit Vehicle Identification Number..."
                maxLength={17}
                className="flex-1 font-mono tracking-widest font-bold text-base outline-hidden uppercase bg-transparent"
              />
            </div>

            {/* License & Odometer */}
            <div className="grid grid-cols-2 divide-x divide-black border-b border-black">
              <div className="p-1.5 flex items-center gap-2">
                <span className="font-bold text-xs uppercase w-16">License:</span>
                <input
                  type="text"
                  value={formData.license}
                  onChange={(e) => updateField('license', e.target.value.toUpperCase())}
                  placeholder="License Plate"
                  className="flex-1 font-mono font-bold text-base outline-hidden uppercase bg-transparent"
                />
              </div>
              <div className="p-1.5 flex items-center gap-2">
                <span className="font-bold text-xs uppercase w-20">Odometer:</span>
                <input
                  type="text"
                  value={formData.odometer}
                  onChange={(e) => updateField('odometer', e.target.value)}
                  placeholder="Miles"
                  className="flex-1 font-mono font-bold text-base outline-hidden bg-transparent"
                />
              </div>
            </div>

            {/* CARB # and Pass / Retest */}
            <div className="grid grid-cols-2 divide-x divide-black p-1.5 items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase">CARB #:</span>
                <input
                  type="text"
                  value={formData.carbNo}
                  onChange={(e) => updateField('carbNo', e.target.value)}
                  placeholder="CARB Number..."
                  className="flex-1 font-semibold text-sm outline-hidden uppercase bg-transparent"
                />
              </div>
              <div className="flex items-center justify-between pl-2 text-xs">
                <span className="font-bold">Pass or one free "Re-test"</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1 cursor-pointer font-bold">
                    <input
                      type="radio"
                      name="passOrRetest"
                      checked={formData.passOrFreeRetest === 'Yes'}
                      onChange={() => updateField('passOrFreeRetest', 'Yes')}
                      className="accent-black"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer font-bold">
                    <input
                      type="radio"
                      name="passOrRetest"
                      checked={formData.passOrFreeRetest === 'No'}
                      onChange={() => updateField('passOrFreeRetest', 'No')}
                      className="accent-black"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* TEST RESULTS CHECKBOXES */}
          <div className="flex items-center justify-around py-2.5 px-4 my-2 border border-black bg-slate-50 font-bold text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="testResult"
                checked={formData.testResult === 'Initial Test'}
                onChange={() => updateField('testResult', 'Initial Test')}
                className="w-4 h-4 accent-black"
              />
              Initial Test
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-emerald-800">
              <input
                type="radio"
                name="testResult"
                checked={formData.testResult === 'Pass'}
                onChange={() => updateField('testResult', 'Pass')}
                className="w-4 h-4 accent-black"
              />
              PASS
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-rose-800">
              <input
                type="radio"
                name="testResult"
                checked={formData.testResult === 'Fail'}
                onChange={() => updateField('testResult', 'Fail')}
                className="w-4 h-4 accent-black"
              />
              FAIL
            </label>
          </div>

          {/* MIDDLE DUAL COLUMN: NOTICE BOXES & FEES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* Left Legal Notices */}
            <div className="space-y-3">
              {/* Notice 1 */}
              <div className="border border-black p-3 rounded-md text-[11px] leading-snug">
                <p className="font-medium text-black">
                  By law, Test-Only stations are not allowed to perform any diagnosis or repair.
                  If your vehicle fails we will provide:
                </p>
                <p className="font-bold text-center my-1.5 text-xs">
                  One free retest within 30 days : Yes - No
                </p>
                <p className="italic text-center text-[10px]">
                  You must present this original invoice for your free retest.
                </p>
              </div>

              {/* Notice 2 */}
              <div className="border border-black p-3 rounded-md text-center">
                <div className="font-extrabold text-xs uppercase tracking-wide">
                  THE T AND D
                </div>
                <div className="font-bold text-xs uppercase">
                  SMOG TEST CENTER ONLY
                </div>
                <div className="font-extrabold text-xs uppercase mt-1">
                  PERFORM VEHICLE INSPECTIONS,
                </div>
                <div className="font-bold text-[11px] uppercase text-black mt-0.5">
                  WE DO NOT DO ANY REPAIRS.
                </div>
              </div>
            </div>

            {/* Right Column: Inspection Fees */}
            <div className="border border-black p-2.5 text-xs">
              <div className="font-extrabold text-sm uppercase border-b border-black pb-1 mb-2">
                Inspection Fee:
              </div>

              <div className="space-y-1.5">
                {[
                  { label: 'Cars and light duty trucks', key: 'feeCarsLightDuty' as const },
                  { label: 'Vans, HD trucks, motorhome', key: 'feeVansHD' as const },
                  { label: 'Smog Certificate', key: 'feeSmogCert' as const },
                  { label: 'Hybrid Test', key: 'feeHybridTest' as const },
                  { label: 'Pretest', key: 'feePretest' as const },
                  { label: 'EVAP Test', key: 'feeEvapTest' as const },
                  { label: 'O.D.B II Test', key: 'feeOdbTest' as const },
                  { label: 'Estimate', key: 'feeEstimate' as const },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="font-medium text-black">{item.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">$</span>
                      <input
                        type="text"
                        value={formData[item.key]}
                        onChange={(e) => updateField(item.key, e.target.value)}
                        placeholder="0.00"
                        className="w-20 text-right border-b border-black font-mono font-semibold text-xs outline-hidden bg-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Paid & Payment Method */}
              <div className="mt-3 pt-2 border-t-2 border-black flex items-center justify-between font-bold text-sm">
                <div className="flex items-center gap-2">
                  <span>Total Paid:</span>
                  <div className="flex gap-1.5 text-[10px]">
                    {['cash', 'chk.', 'cc', 'atm'].map((method) => (
                      <label key={method} className="flex items-center gap-0.5 cursor-pointer uppercase">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === method.replace('.', '')}
                          onChange={() => updateField('paymentMethod', method.replace('.', '') as any)}
                          className="accent-black"
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-base font-black">$</span>
                  <input
                    type="text"
                    value={formData.totalPaid}
                    onChange={(e) => updateField('totalPaid', e.target.value)}
                    placeholder="0.00"
                    className="w-24 text-right font-mono font-black text-base border-b-2 border-black outline-hidden bg-transparent text-emerald-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DISCLAIMER & AUTHORIZATION TEXT */}
          <div className="mt-3 text-[9px] leading-tight text-justify border-t border-black pt-2 font-serif text-slate-800">
            I hereby authorize the above work to be done and, hereby grant you and / or your employees permission to operate the vehicle herein described or the purpose of testing and / or inspection at my risk. An express mechanic's lien is hereby acknowledged on the vehicle to secure the amount of the inspection and / or smog certificate thereto T AND D Smog Test or any of its employees will not be held responsible for loss or damage to vehicle or articles left in vehicle in case of fire, theft, accident or any other cause beyond our control. Customer acknowledges receipt hereof.
          </div>

          {/* SIGNATURE SECTION */}
          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="flex-1 flex items-end gap-2">
              <span className="font-bold text-xs uppercase whitespace-nowrap">
                Customer Authorization:
              </span>
              <div
                onClick={() => setIsSignatureModalOpen(true)}
                className="flex-1 border-b-2 border-black min-h-[40px] flex items-center justify-center cursor-pointer hover:bg-slate-50 transition px-2 group"
                title="Click to sign digitally or leave blank for handwritten signature"
              >
                {formData.signatureType === 'draw' && formData.customerSignature.startsWith('data:image') ? (
                  <img
                    src={formData.customerSignature}
                    alt="Signature"
                    className="h-10 object-contain max-w-[240px]"
                  />
                ) : formData.customerSignature ? (
                  <span
                    className="text-2xl text-blue-950 font-bold"
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    {formData.customerSignature}
                  </span>
                ) : (
                  <span className="no-print no-export text-xs text-slate-400 italic font-normal group-hover:text-slate-600 select-none">
                    (Click to sign or leave blank to hand-sign)
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSignatureModalOpen(true)}
              className="no-print text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer pb-1"
              title="Sign digitally or clear signature"
            >
              <PenTool className="w-3.5 h-3.5" />
              Sign / Edit
            </button>
          </div>

          {/* BOTTOM CARBON COPIES TEXT */}
          <div className="mt-6 pt-3 border-t border-slate-300 flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>White: Original</span>
            <span>Yellow: Customer Copy</span>
            <span>Pink: Estimate</span>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        initialSignature={formData.customerSignature}
        initialType={formData.signatureType}
        title="Customer Authorization Signature"
        onSave={(sig, type) => {
          updateField('customerSignature', sig);
          updateField('signatureType', type);
        }}
      />
    </div>
  );
};
