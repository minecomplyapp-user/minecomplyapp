// ChemicalSafetyScreen.types.ts
export type YesNoNull = 'YES' | 'NO' | null;

export type ChemicalSafetyData = {
  isNA: boolean;
  riskManagement: YesNoNull;
  training: YesNoNull;
  handling: YesNoNull;
  emergencyPreparedness: YesNoNull;
  remarks: string;
};

export type ComplaintFiledLocation = "Others" | "DENR" | "Company" | "MMT" | null;

export type Complaint = {
  id: string;
  isNA: boolean;
  dateFiled: string;
  filedLocation: ComplaintFiledLocation;
  othersSpecify: string;
  nature: string;
  resolutions: string;
};
