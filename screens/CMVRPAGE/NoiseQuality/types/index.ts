import * as DocumentPicker from "expo-document-picker";

export type UploadedFile = DocumentPicker.DocumentPickerAsset & {
  storagePath?: string; // Supabase storage path after upload
};

export type FileUploadSectionProps = {
  uploadedFiles: UploadedFile[];
  uploadingFiles: Record<string, boolean>;
  onFilesChange: (files: UploadedFile[]) => void;
};

export type NoiseParameter = {
  id: string;
  parameter: string;
  isParameterNA: boolean;
  currentInSMR: string;
  previousInSMR: string;
  mmtCurrent: string;
  mmtPrevious: string;
  redFlag: string;
  isRedFlagChecked: boolean;
  action: string;
  isActionChecked: boolean;
  limit: string;
  isLimitChecked: boolean;
};

export type NoiseParameterCardProps = {
  parameter: NoiseParameter;
  index: number;
  canDelete: boolean;
  onUpdate: (
    id: string,
    field: keyof Omit<NoiseParameter, "id">,
    value: string | boolean
  ) => void;
  onDelete: (id: string) => void;
};

export type QuarterData = {
  first: string;
  isFirstChecked: boolean;
  second: string;
  isSecondChecked: boolean;
  third: string;
  isThirdChecked: boolean;
  fourth: string;
  isFourthChecked: boolean;
};

export type QuarrySectionData = {
  noSignificantImpact: boolean;
  generateTable: boolean;
};

export type QuarrySectionProps = {
  data: QuarrySectionData;
  onUpdate: (field: keyof QuarrySectionData, value: boolean) => void;
};
