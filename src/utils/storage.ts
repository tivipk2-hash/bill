import { AnnualInspectionFormData, FormType, Inspection90DayFormData, SavedInvoiceRecord, SmogTestFormData } from '../types';
import { saveInvoiceToCloud, deleteInvoiceFromCloud, batchSaveInvoicesToCloud } from './firebase';

const PASSWORD_KEY = 'td_app_password';
const INVOICES_KEY = 'td_saved_invoices';
const DEFAULT_PASSWORD = 'admin';
export const MASTER_BACKUP_CODE = '0112143';

export const getStoredPassword = (): string => {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
};

export const setStoredPassword = (newPassword: string): void => {
  localStorage.setItem(PASSWORD_KEY, newPassword);
};

export const verifyPasswordOrMasterCode = (inputPass: string): boolean => {
  const current = getStoredPassword();
  return inputPass === current || inputPass === MASTER_BACKUP_CODE || inputPass === 'admin' || inputPass === '123456';
};

export const resetPasswordWithMasterCode = (code: string, newPass: string): boolean => {
  if (code === MASTER_BACKUP_CODE) {
    setStoredPassword(newPass);
    return true;
  }
  return false;
};

export const getDefaultSmogTestData = (): SmogTestFormData => {
  const today = new Date().toISOString().split('T')[0];
  const randomNo = Math.floor(1000 + Math.random() * 9000).toString();
  return {
    date: today,
    invoiceNo: randomNo,
    customerName: '',
    phone: '',
    address: '',
    city: '',
    state: 'CA',
    zip: '',
    vehYr: '',
    make: '',
    model: '',
    cyl: '',
    engSize: '',
    gvwr: '',
    atMt: 'AT',
    calFed: 'Cal',
    timing: '',
    vin: '',
    license: '',
    odometer: '',
    carbNo: '',
    passOrFreeRetest: 'Yes',
    testResult: 'Pass',
    feeCarsLightDuty: '50.00',
    feeVansHD: '',
    feeSmogCert: '8.25',
    feeHybridTest: '',
    feePretest: '',
    feeEvapTest: '',
    feeOdbTest: '',
    feeEstimate: '',
    totalPaid: '58.25',
    paymentMethod: 'cash',
    customerSignature: '',
    signatureType: 'type',
  };
};

export const getDefaultInspection90DayData = (): Inspection90DayFormData => {
  const today = new Date().toISOString().split('T')[0];
  const randomNo = Math.floor(1000 + Math.random() * 9000).toString();
  return {
    inspectionDate: today,
    carrierName: '',
    unitNo: '',
    year: '',
    vin: '',
    licenseNo: '',
    formNo: randomNo,
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
    repairsNeeded: 'NONE - ALL COMPONENTS INSPECTED AND PASSED 90-DAY STANDARDS.',
    inspectorSignature: '',
    signatureType: 'type',
    inspectorDate: today,
  };
};

export const ANNUAL_INSPECTION_ITEMS = [
  // Column 1 - BRAKES
  { category: 'BRAKES', key: 'brakes_adj', label: 'Adjustment' },
  { category: 'BRAKES', key: 'brakes_mech', label: 'Mechanical Components' },
  { category: 'BRAKES', key: 'brakes_drum', label: 'Drum/Rotor' },
  { category: 'BRAKES', key: 'brakes_hose', label: 'Hose/Tubing' },
  { category: 'BRAKES', key: 'brakes_lining', label: 'Lining' },
  { category: 'BRAKES', key: 'brakes_abs', label: 'Anti-lock Systems' },
  { category: 'BRAKES', key: 'brakes_auto', label: 'Automatic Adjusters' },
  { category: 'BRAKES', key: 'brakes_low_air', label: 'Low Air Warning' },
  { category: 'BRAKES', key: 'brakes_trailer_air', label: 'Trailer Air Supply' },
  { category: 'BRAKES', key: 'brakes_compressor', label: 'Compressor' },
  { category: 'BRAKES', key: 'brakes_parking', label: 'Parking Brakes' },
  { category: 'BRAKES', key: 'brakes_other', label: 'Other' },
  // Column 1 - COUPLERS
  { category: 'COUPLERS', key: 'couplers_5th', label: 'Fifth-Wheel & Mount' },
  { category: 'COUPLERS', key: 'couplers_pin', label: 'Pin/Upper Plate' },
  { category: 'COUPLERS', key: 'couplers_pintle', label: 'Pintle-Hook/Eye' },
  { category: 'COUPLERS', key: 'couplers_chain', label: 'Safety Chain (s)' },
  // Column 1 - EXHAUST
  { category: 'EXHAUST', key: 'exhaust_leaks', label: 'Leaks' },
  { category: 'EXHAUST', key: 'exhaust_placement', label: 'Placement' },
  { category: 'EXHAUST', key: 'exhaust_hubs', label: 'Hubs' },
  { category: 'EXHAUST', key: 'exhaust_wheel_seals', label: 'Wheel Seals' },

  // Column 2 - LIGHTING
  { category: 'LIGHTING', key: 'light_head', label: 'Headlights' },
  { category: 'LIGHTING', key: 'light_tail', label: 'Tail/Stop' },
  { category: 'LIGHTING', key: 'light_clearance', label: 'Clearance/Marker' },
  { category: 'LIGHTING', key: 'light_id', label: 'Identification' },
  { category: 'LIGHTING', key: 'light_reflectors', label: 'Reflectors' },
  { category: 'LIGHTING', key: 'light_other', label: 'Other' },
  // Column 2 - CAB/BODY
  { category: 'CAB/BODY', key: 'cab_access', label: 'Access' },
  { category: 'CAB/BODY', key: 'cab_eqpt', label: 'Eqpt./load Secure' },
  { category: 'CAB/BODY', key: 'cab_tiedowns', label: 'Tie - Downs' },
  { category: 'CAB/BODY', key: 'cab_headerboard', label: 'Headerboard' },
  { category: 'CAB/BODY', key: 'cab_seats', label: 'Motorcoach seats' },
  { category: 'CAB/BODY', key: 'cab_other', label: 'Other' },
  // Column 2 - STEERING
  { category: 'STEERING', key: 'steer_adj', label: 'Adjustment' },
  { category: 'STEERING', key: 'steer_column', label: 'Column/Gear' },
  { category: 'STEERING', key: 'steer_axle', label: 'Axle' },
  { category: 'STEERING', key: 'steer_linkage', label: 'Linkage' },
  { category: 'STEERING', key: 'steer_power', label: 'Power Steering' },
  { category: 'STEERING', key: 'steer_other', label: 'Other' },

  // Column 3 - FUEL SYSTEM
  { category: 'FUEL SYSTEM', key: 'fuel_tanks', label: 'Tank (s)' },
  { category: 'FUEL SYSTEM', key: 'fuel_lines', label: 'Lines' },
  // Column 3 - SUSPENSION
  { category: 'SUSPENSION', key: 'susp_springs', label: 'Springs' },
  { category: 'SUSPENSION', key: 'susp_attach', label: 'Attachments' },
  { category: 'SUSPENSION', key: 'susp_sliders', label: 'Sliders' },
  // Column 3 - FRAME
  { category: 'FRAME', key: 'frame_members', label: 'Members' },
  { category: 'FRAME', key: 'frame_clearance', label: 'Clearance' },
  // Column 3 - TIRES
  { category: 'TIRES', key: 'tires_tread', label: 'Tread' },
  { category: 'TIRES', key: 'tires_inflation', label: 'Inflation' },
  { category: 'TIRES', key: 'tires_damage', label: 'Damage' },
  { category: 'TIRES', key: 'tires_speed', label: 'Speed Restrictions' },
  { category: 'TIRES', key: 'tires_other', label: 'Other' },
  // Column 3 - WHEELS/RIMS
  { category: 'WHEELS/RIMS', key: 'wheels_fasteners', label: 'Fasteners' },
  { category: 'WHEELS/RIMS', key: 'wheels_disc', label: 'Disc./Spoke' },
  // Column 3 - OTHER
  { category: 'WINDSHIELD', key: 'windshield_main', label: 'Windshield' },
  { category: 'WINDSHIELD WIPERS', key: 'windshield_wipers', label: 'Windshield Wipers' },
  { category: 'MIRRORS', key: 'mirrors_main', label: 'Mirrors' },
];

export const getDefaultAnnualInspectionData = (): AnnualInspectionFormData => {
  const today = new Date().toISOString().split('T')[0];
  const randomNo = Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0');
  const conditions: Record<string, 'OK' | 'Repair' | ''> = {};
  ANNUAL_INSPECTION_ITEMS.forEach((item) => {
    conditions[item.key] = 'OK';
  });

  return {
    isAnnual: true,
    formNo: randomNo,
    vehicleTypes: {
      truck: true,
      tractor: false,
      trailer: false,
      converterDolly: false,
    },
    year: '',
    make: '',
    model: '',
    vehicleIdNo: '',
    tagNoState: '',
    carrierName: '',
    date: today,
    inspectionLocation: 'Hawthorne, CA',
    unitNo: '',
    conditions,
    remarks: 'PASSED ANNUAL 49 CFR 396.17-23 INSPECTION. SAFE FOR SERVICE.',
    inspectorSignature: '',
    signatureType: 'type',
    inspectorDate: today,
  };
};

export const SAMPLE_INVOICES: SavedInvoiceRecord[] = [
  {
    id: 'sample-smog-1',
    type: 'smog_test',
    title: 'T&D Smog Test - John Doe (Honda Civic)',
    customerOrCarrier: 'John Doe',
    licenseOrTag: '8XYZ789',
    phone: '(714) 555-0199',
    vin: '1HGBH41JXMN109283',
    invoiceOrFormNo: '1011',
    date: '2026-08-25',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
    data: {
      date: '2026-08-25',
      invoiceNo: '1011',
      customerName: 'John Doe',
      phone: '(714) 555-0199',
      address: '1234 Main Street',
      city: 'Hawthorne',
      state: 'CA',
      zip: '90250',
      vehYr: '2021',
      make: 'Honda',
      model: 'Civic',
      cyl: '4',
      engSize: '2.0L',
      gvwr: '3000',
      atMt: 'AT',
      calFed: 'Cal',
      timing: '10 BTDC',
      vin: '1HGBH41JXMN109283',
      license: '8XYZ789',
      odometer: '45,210',
      carbNo: 'CA-98124',
      passOrFreeRetest: 'Yes',
      testResult: 'Pass',
      feeCarsLightDuty: '50.00',
      feeVansHD: '',
      feeSmogCert: '8.25',
      feeHybridTest: '',
      feePretest: '',
      feeEvapTest: '',
      feeOdbTest: '',
      feeEstimate: '',
      totalPaid: '58.25',
      paymentMethod: 'cc',
      customerSignature: 'John Doe',
      signatureType: 'type',
    },
  },
  {
    id: 'sample-90day-1',
    type: 'inspection_90day',
    title: '90-Day Inspection - Pacific Freight LLC (Freightliner Cascadia)',
    customerOrCarrier: 'Pacific Freight LLC',
    licenseOrTag: '9ABC123',
    phone: '(626) 494-3403',
    vin: '1FUJGLDR9EL102938',
    invoiceOrFormNo: '1012',
    date: '2026-08-28',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    data: {
      inspectionDate: '2026-08-28',
      carrierName: 'Pacific Freight LLC',
      unitNo: 'TRK-402',
      year: '2022',
      vin: '1FUJGLDR9EL102938',
      licenseNo: '9ABC123',
      formNo: '1012',
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
      repairsNeeded: 'All lights verified, brakes checked within legal spec, zero air loss detected.',
      inspectorSignature: 'T&D Inspector Mark',
      signatureType: 'type',
      inspectorDate: '2026-08-28',
    },
  },
  {
    id: 'sample-annual-1',
    type: 'annual_inspection',
    title: 'Annual Inspection 49CFR - California Logistics (Kenworth T680)',
    customerOrCarrier: 'California Logistics Corp',
    licenseOrTag: '7XYZ456 CA',
    phone: '(714) 717-4738',
    vin: '1XKDDB9X1NJ294810',
    invoiceOrFormNo: '0001',
    date: '2026-08-30',
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
    data: (() => {
      const conditions: Record<string, 'OK' | 'Repair' | ''> = {};
      ANNUAL_INSPECTION_ITEMS.forEach((item) => {
        conditions[item.key] = 'OK';
      });
      return {
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
        model: 'T680',
        vehicleIdNo: '1XKDDB9X1NJ294810',
        tagNoState: '7XYZ456 CA',
        carrierName: 'California Logistics Corp',
        date: '2026-08-30',
        inspectionLocation: 'Hawthorne, CA Station #ARD 284163',
        unitNo: 'UNIT-88',
        conditions,
        remarks: 'Vehicle inspected and in full compliance with 49 CFR Part 396 Appendix G.',
        inspectorSignature: 'David Tran (Cert #CA-8891)',
        signatureType: 'type',
        inspectorDate: '2026-08-30',
      };
    })(),
  },
];

export const getSavedInvoices = (): SavedInvoiceRecord[] => {
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    if (!raw) {
      localStorage.setItem(INVOICES_KEY, JSON.stringify(SAMPLE_INVOICES));
      return SAMPLE_INVOICES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved invoices', err);
    return SAMPLE_INVOICES;
  }
};

export const syncCloudInvoicesToLocal = (records: SavedInvoiceRecord[]): void => {
  try {
    if (records && records.length > 0) {
      localStorage.setItem(INVOICES_KEY, JSON.stringify(records));
    }
  } catch (err) {
    console.error('Failed to sync cloud invoices to local cache:', err);
  }
};

export const saveInvoice = async (record: SavedInvoiceRecord): Promise<void> => {
  const list = getSavedInvoices();
  const existingIndex = list.findIndex((i) => i.id === record.id);
  const updatedRecord: SavedInvoiceRecord = {
    ...record,
    createdAt: record.createdAt || Date.now(),
    updatedAt: Date.now(),
  };

  if (existingIndex >= 0) {
    list[existingIndex] = updatedRecord;
  } else {
    list.unshift(updatedRecord);
  }
  localStorage.setItem(INVOICES_KEY, JSON.stringify(list));

  // Sync to Firestore Cloud Database in the background so all workstations get it
  try {
    await saveInvoiceToCloud(updatedRecord);
  } catch (err) {
    console.error('Firestore cloud save failed (saved locally):', err);
  }
};

export const deleteInvoice = async (id: string): Promise<void> => {
  const list = getSavedInvoices();
  const updated = list.filter((i) => i.id !== id);
  localStorage.setItem(INVOICES_KEY, JSON.stringify(updated));

  // Delete from Firestore Cloud Database
  try {
    await deleteInvoiceFromCloud(id);
  } catch (err) {
    console.error('Firestore cloud delete failed (deleted locally):', err);
  }
};

export interface ImportSummary {
  success: boolean;
  totalInFile: number;
  newAdded: number;
  updatedMerged: number;
  skipped: number;
  totalAfterImport: number;
  errorMessage?: string;
}

export const exportAllDataToJson = (): void => {
  const invoices = getSavedInvoices();
  const backupPayload = {
    appName: 'T&D Inspection Management Hub',
    version: 1.2,
    exportedAt: new Date().toISOString(),
    totalRecords: invoices.length,
    invoices,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `TD_Invoices_Backup_${dateStr}_(${invoices.length}_records).json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Intelligent JSON import with robust deduplication & seamless merge.
 * Duplicates are safely merged without throwing errors or corrupting data.
 * Merged results are saved locally and synced to Firestore Cloud Database.
 */
export const importDataFromJsonWithMerge = async (jsonString: string): Promise<ImportSummary> => {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return {
        success: false,
        totalInFile: 0,
        newAdded: 0,
        updatedMerged: 0,
        skipped: 0,
        totalAfterImport: getSavedInvoices().length,
        errorMessage: 'Empty or invalid JSON content provided.',
      };
    }

    const parsed = JSON.parse(jsonString);
    let candidateList: unknown[] = [];

    if (Array.isArray(parsed)) {
      candidateList = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray((parsed as { invoices?: unknown[] }).invoices)) {
        candidateList = (parsed as { invoices: unknown[] }).invoices;
      } else if (Array.isArray((parsed as { data?: unknown[] }).data)) {
        candidateList = (parsed as { data: unknown[] }).data;
      } else if ('type' in parsed || 'customerOrCarrier' in parsed || 'data' in parsed) {
        // Single invoice JSON
        candidateList = [parsed];
      }
    }

    if (candidateList.length === 0) {
      return {
        success: false,
        totalInFile: 0,
        newAdded: 0,
        updatedMerged: 0,
        skipped: 0,
        totalAfterImport: getSavedInvoices().length,
        errorMessage: 'No valid invoice records found in uploaded file.',
      };
    }

    const currentList = getSavedInvoices();
    // Use a map keyed by ID for O(1) deduplication and fast merging
    const recordsMap = new Map<string, SavedInvoiceRecord>();
    for (const record of currentList) {
      if (record.id) {
        recordsMap.set(record.id, record);
      }
    }

    let newAddedCount = 0;
    let updatedMergedCount = 0;
    let skippedCount = 0;
    const recordsToSyncCloud: SavedInvoiceRecord[] = [];

    for (const rawItem of candidateList) {
      if (!rawItem || typeof rawItem !== 'object') {
        skippedCount++;
        continue;
      }

      const item = rawItem as Partial<SavedInvoiceRecord> & { [key: string]: unknown };
      const formType: FormType =
        item.type === 'inspection_90day' || item.type === 'annual_inspection' || item.type === 'smog_test'
          ? item.type
          : 'smog_test';

      const customerOrCarrier = String(
        item.customerOrCarrier ||
          (item.data && typeof item.data === 'object' && ('customerName' in item.data ? item.data.customerName : '')) ||
          (item.data && typeof item.data === 'object' && ('carrierName' in item.data ? item.data.carrierName : '')) ||
          'Unnamed Customer'
      );

      const licenseOrTag = String(
        item.licenseOrTag ||
          (item.data && typeof item.data === 'object' && ('license' in item.data ? item.data.license : '')) ||
          (item.data && typeof item.data === 'object' && ('tagNoState' in item.data ? item.data.tagNoState : '')) ||
          ''
      );

      const invoiceOrFormNo = String(
        item.invoiceOrFormNo ||
          (item.data && typeof item.data === 'object' && ('invoiceNo' in item.data ? item.data.invoiceNo : '')) ||
          (item.data && typeof item.data === 'object' && ('formNo' in item.data ? item.data.formNo : '')) ||
          ''
      );

      const vin = String(
        item.vin ||
          (item.data && typeof item.data === 'object' && ('vin' in item.data ? item.data.vin : '')) ||
          ''
      );

      const phone = String(
        item.phone ||
          (item.data && typeof item.data === 'object' && ('phone' in item.data ? item.data.phone : '')) ||
          ''
      );

      const date = String(
        item.date ||
          (item.data && typeof item.data === 'object' && ('date' in item.data ? item.data.date : '')) ||
          new Date().toISOString().split('T')[0]
      );

      const title = String(
        item.title ||
          `${formType === 'smog_test' ? 'Smog Test' : formType === 'inspection_90day' ? '90-Day Inspection' : 'Annual Inspection'} - ${customerOrCarrier}`
      );

      const validFormData = (item.data && typeof item.data === 'object' ? item.data : item) as
        | SmogTestFormData
        | Inspection90DayFormData
        | AnnualInspectionFormData;

      // Check for exact ID match first
      let existingRecord: SavedInvoiceRecord | undefined;
      if (item.id && recordsMap.has(item.id)) {
        existingRecord = recordsMap.get(item.id);
      } else {
        // Look for business key duplicate: same type + same invoice number + matching VIN / Plate
        for (const existing of recordsMap.values()) {
          if (existing.type === formType) {
            const hasSameInvoiceNo =
              invoiceOrFormNo && existing.invoiceOrFormNo && invoiceOrFormNo === existing.invoiceOrFormNo;
            const hasSameVinOrPlate =
              (vin && existing.vin && vin === existing.vin) ||
              (licenseOrTag && existing.licenseOrTag && licenseOrTag.toLowerCase() === existing.licenseOrTag.toLowerCase());

            if (hasSameInvoiceNo || (hasSameVinOrPlate && customerOrCarrier === existing.customerOrCarrier)) {
              existingRecord = existing;
              break;
            }
          }
        }
      }

      if (existingRecord) {
        // DUPLICATE FOUND: Merge safely without errors
        const mergedData = { ...existingRecord.data, ...validFormData };
        const mergedRecord: SavedInvoiceRecord = {
          ...existingRecord,
          title: title || existingRecord.title,
          customerOrCarrier: customerOrCarrier || existingRecord.customerOrCarrier,
          licenseOrTag: licenseOrTag || existingRecord.licenseOrTag,
          phone: phone || existingRecord.phone,
          vin: vin || existingRecord.vin,
          invoiceOrFormNo: invoiceOrFormNo || existingRecord.invoiceOrFormNo,
          date: date || existingRecord.date,
          updatedAt: Math.max(existingRecord.updatedAt || 0, item.updatedAt ? Number(item.updatedAt) : Date.now()),
          createdAt: existingRecord.createdAt || (item.createdAt ? Number(item.createdAt) : Date.now()),
          data: mergedData,
        };

        recordsMap.set(existingRecord.id, mergedRecord);
        recordsToSyncCloud.push(mergedRecord);
        updatedMergedCount++;
      } else {
        // NEW RECORD: Insert safely
        const newId = item.id ? String(item.id) : `${formType}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const newRecord: SavedInvoiceRecord = {
          id: newId,
          type: formType,
          title,
          customerOrCarrier,
          licenseOrTag,
          phone,
          vin,
          invoiceOrFormNo,
          date,
          createdAt: item.createdAt ? Number(item.createdAt) : Date.now(),
          updatedAt: item.updatedAt ? Number(item.updatedAt) : Date.now(),
          data: validFormData,
        };

        recordsMap.set(newId, newRecord);
        recordsToSyncCloud.push(newRecord);
        newAddedCount++;
      }
    }

    // Sort by updatedAt descending
    const mergedFinalList = Array.from(recordsMap.values()).sort(
      (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)
    );

    // Save locally
    localStorage.setItem(INVOICES_KEY, JSON.stringify(mergedFinalList));

    // Batch upload to Firestore Cloud Database in background
    if (recordsToSyncCloud.length > 0) {
      batchSaveInvoicesToCloud(recordsToSyncCloud).catch((err) => {
        console.warn('Firestore cloud batch sync note:', err);
      });
    }

    return {
      success: true,
      totalInFile: candidateList.length,
      newAdded: newAddedCount,
      updatedMerged: updatedMergedCount,
      skipped: skippedCount,
      totalAfterImport: mergedFinalList.length,
    };
  } catch (err) {
    console.error('Failed to import backup JSON:', err);
    return {
      success: false,
      totalInFile: 0,
      newAdded: 0,
      updatedMerged: 0,
      skipped: 0,
      totalAfterImport: getSavedInvoices().length,
      errorMessage: err instanceof Error ? err.message : 'Invalid JSON file format.',
    };
  }
};

/**
 * Legacy import wrapper for backwards compatibility
 */
export const importDataFromJson = async (jsonString: string): Promise<boolean> => {
  const result = await importDataFromJsonWithMerge(jsonString);
  return result.success;
};
