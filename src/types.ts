export type FormType = 'smog_test' | 'inspection_90day' | 'annual_inspection';

export interface SmogTestFormData {
  date: string;
  invoiceNo: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  vehYr: string;
  make: string;
  model: string;
  cyl: string;
  engSize: string;
  gvwr: string;
  atMt: 'AT' | 'MT' | '';
  calFed: 'Cal' | 'Fed' | '';
  timing: string;
  vin: string;
  license: string;
  odometer: string;
  carbNo: string;
  passOrFreeRetest: 'Yes' | 'No' | '';
  testResult: 'Initial Test' | 'Pass' | 'Fail' | '';
  feeCarsLightDuty: string;
  feeVansHD: string;
  feeSmogCert: string;
  feeHybridTest: string;
  feePretest: string;
  feeEvapTest: string;
  feeOdbTest: string;
  feeEstimate: string;
  totalPaid: string;
  paymentMethod: 'cash' | 'chk' | 'cc' | 'atm' | '';
  customerSignature: string;
  signatureType: 'draw' | 'type';
}

export interface Inspection90DayFormData {
  inspectionDate: string;
  carrierName: string;
  unitNo: string;
  year: string;
  vin: string;
  licenseNo: string;
  formNo: string;
  checklist: {
    brakeComponents: 'OK' | 'NR' | '';
    steeringComponents: 'OK' | 'NR' | '';
    frameSuspension: 'OK' | 'NR' | '';
    tiresWheels: 'OK' | 'NR' | '';
    couplingDevices: 'OK' | 'NR' | '';
    lightsReflectors: 'OK' | 'NR' | '';
    fuelExhaust: 'OK' | 'NR' | '';
    other: 'OK' | 'NR' | '';
  };
  repairsNeeded: string;
  inspectorSignature: string;
  signatureType: 'draw' | 'type';
  inspectorDate: string;
}

export interface AnnualInspectionFormData {
  isAnnual: boolean;
  formNo: string;
  vehicleTypes: {
    truck: boolean;
    tractor: boolean;
    trailer: boolean;
    converterDolly: boolean;
  };
  year: string;
  make: string;
  model: string;
  vehicleIdNo: string;
  tagNoState: string;
  carrierName: string;
  date: string;
  inspectionLocation: string;
  unitNo: string;
  conditions: Record<string, 'OK' | 'Repair' | ''>;
  remarks: string;
  inspectorSignature: string;
  signatureType: 'draw' | 'type';
  inspectorDate: string;
}

export interface SavedInvoiceRecord {
  id: string;
  type: FormType;
  title: string;
  customerOrCarrier: string;
  licenseOrTag: string;
  phone: string;
  vin: string;
  invoiceOrFormNo: string;
  date: string;
  createdAt: number;
  updatedAt: number;
  data: SmogTestFormData | Inspection90DayFormData | AnnualInspectionFormData;
}
