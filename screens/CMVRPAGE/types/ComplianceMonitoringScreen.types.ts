// ComplianceMonitoringScreen.types.ts
export type SubField = {
  label: string;
  specification: string;
};

export type FormField = {
  label: string;
  specification: string;
  remarks: string;
  withinSpecs: boolean | null;
  subFields?: SubField[];
};

export type FormData = {
  projectLocation: FormField;
  projectArea: FormField;
  capitalCost: FormField;
  typeOfMinerals: FormField;
  miningMethod: FormField;
  production: FormField;
  mineLife: FormField;
  mineralReserves: FormField;
  accessTransportation: FormField;
  powerSupply: FormField;
  miningEquipment: FormField;
  workForce: FormField;
  developmentSchedule: FormField;
};

export type OtherComponent = {
  specification: string;
  remarks: string;
  withinSpecs: boolean | null;
};

export type UploadedImages = {
  [key: string]: string;
};
