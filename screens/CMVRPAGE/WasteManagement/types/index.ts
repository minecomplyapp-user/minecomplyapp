export type WasteEntry = {
  id: string;
  handling: string;
  storage: string;
  disposal: string;
};

export type QuarrySectionData = {
  noSignificantImpact: boolean;
  generateTable: boolean;
  N_A: boolean;
};

export type PlantSectionData = {
  noSignificantImpact: boolean;
  generateTable: boolean;
  N_A: boolean;
};

export type PortSectionData = {
  noSignificantImpact: boolean;
  generateTable: boolean;
  N_A: boolean;
};

export type PlantPortSectionData = {
  typeOfWaste: string;
  eccEpepCommitments: WasteEntry[];
  isAdequate: 'YES' | 'NO' | null;
  previousRecord: string;
  currentQuarterWaste: string;
};

export interface QuarrySectionProps {
  data: QuarrySectionData;
  onUpdate: (field: keyof QuarrySectionData, value: boolean) => void;
}

export interface PlantSectionProps {
  data: PlantSectionData;
  onUpdate: (field: keyof PlantSectionData, value: boolean) => void;
}

export interface PortSectionProps {
  data: PortSectionData;
  onUpdate: (field: keyof PortSectionData, value: boolean) => void;
}

export interface PlantPortSectionProps {
  title: string;
  icon: any;
  data: PlantPortSectionData;
  selectedQuarter: string;
  onUpdateData: (field: keyof PlantPortSectionData, value: any) => void;
  onAddWaste: () => void;
  onUpdateWaste: (
    id: string,
    field: keyof Omit<WasteEntry, 'id'>,
    value: string
  ) => void;
  onRemoveWaste: (id: string) => void;
}

export interface WasteEntryCardProps {
  entry: WasteEntry;
  index: number;
  canDelete: boolean;
  onUpdate: (
    id: string,
    field: keyof Omit<WasteEntry, 'id'>,
    value: string
  ) => void;
  onDelete: (id: string) => void;
}