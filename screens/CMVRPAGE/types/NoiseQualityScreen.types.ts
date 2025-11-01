// NoiseQualityScreen.types.ts
import * as DocumentPicker from 'expo-document-picker';

export type UploadedFile = DocumentPicker.DocumentPickerAsset;

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

export type NoiseParameter = {
  id: string;
  parameter: string;
  isParameterNA: boolean;
  currentInSABR: string;
  previousInSABR: string;
  mmtCurrent: string;
  mmtPrevious: string;
  redFlag: string;
  isRedFlagChecked: boolean;
  action: string;
  isActionChecked: boolean;
  limit: string;
  isLimitChecked: boolean;
};
