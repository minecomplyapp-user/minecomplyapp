export type YesNoNull = 'YES' | 'NO' | null;

export type ChemicalCategory = 'PCL' | 'COO' | 'Others' | null;

export type ChemicalSafetyData = {
  isNA: boolean;
  riskManagement: YesNoNull;
  training: YesNoNull;
  handling: YesNoNull;
  emergencyPreparedness: YesNoNull;
  remarks: string;
  chemicalCategory: ChemicalCategory;
  othersSpecify: string;
};

export type Complaint = {
  id: string;
  isNA: boolean;
  dateFiled: string;
  filedLocation: 'DENR' | 'Company' | 'MMT' | 'Others' | null;
  othersSpecify: string;
  nature: string;
  resolutions: string;
};