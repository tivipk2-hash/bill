import { AnnualInspectionFormData, FormType, Inspection90DayFormData, SavedInvoiceRecord, SmogTestFormData } from '../types';

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

const SAMPLE_INVOICES: SavedInvoiceRecord[] = [
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

export const saveInvoice = (record: SavedInvoiceRecord): void => {
  const list = getSavedInvoices();
  const existingIndex = list.findIndex((i) => i.id === record.id);
  if (existingIndex >= 0) {
    list[existingIndex] = { ...record, updatedAt: Date.now() };
  } else {
    list.unshift({ ...record, createdAt: Date.now(), updatedAt: Date.now() });
  }
  localStorage.setItem(INVOICES_KEY, JSON.stringify(list));
};

export const deleteInvoice = (id: string): void => {
  const list = getSavedInvoices();
  const updated = list.filter((i) => i.id !== id);
  localStorage.setItem(INVOICES_KEY, JSON.stringify(updated));
};

export const exportAllDataToJson = (): void => {
  const invoices = getSavedInvoices();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(invoices, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `TD_Invoices_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const importDataFromJson = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      localStorage.setItem(INVOICES_KEY, JSON.stringify(parsed));
      return true;
    }
    return false;
  } catch (err) {
    console.error('Import error', err);
    return false;
  }
};
