// WasteManagementScreen.types.ts
export type WasteEntry = {
  id: string;
  handling: string;
  storage: string;
  disposal: string;
};

export type PlantPortSectionData = {
  typeOfWaste: string;
  eccEpepCommitments: WasteEntry[];
  isAdequate: 'YES' | 'NO' | null;
  previousRecord: string;
  q22025GeneratedHazardWastes: string;
};

export type QuarrySectionData = {
  noSignificantImpact: boolean;
  generateTable: boolean;
};

export type PortSectionData = {
  noSignificantImpact: boolean;
  generateTable: boolean;
  N_A: boolean;
};
