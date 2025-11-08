// WaterQualityScreen.types.ts
// Parameter type should NOT have metadata fields (dateTime, weatherWind, explanation, isExplanationNA)
// These belong to the parent location (WaterQualityData or PortData)
export type Parameter = {
  id: string;
  parameter: string;
  resultType: string;
  tssCurrent: string;
  tssPrevious: string;
  eqplRedFlag: string;
  action: string;
  limit: string;
  remarks: string;
  mmtCurrent?: string;
  mmtPrevious?: string;
  isMMTNA?: boolean;
};

export type LocationState = {
  quarry: boolean;
  plant: boolean;
  quarryPlant: boolean;
};

// Individual location data structure
export type LocationData = {
  locationInput: string;
  parameter: string;
  resultType: string;
  tssCurrent: string;
  tssPrevious: string;
  mmtCurrent: string;
  mmtPrevious: string;
  isMMTNA: boolean;
  eqplRedFlag: string;
  action: string;
  limit: string;
  remarks: string;
  dateTime: string;
  weatherWind: string;
  explanation: string;
  isExplanationNA: boolean;
  overallCompliance: string;
  parameters: Parameter[];
};

const createEmptyLocationData = (): LocationData => ({
  locationInput: "",
  parameter: "",
  resultType: "Month",
  tssCurrent: "",
  tssPrevious: "",
  mmtCurrent: "",
  mmtPrevious: "",
  isMMTNA: false,
  eqplRedFlag: "",
  action: "",
  limit: "",
  remarks: "",
  dateTime: "",
  weatherWind: "",
  explanation: "",
  isExplanationNA: false,
  overallCompliance: "",
  parameters: [],
});

export { createEmptyLocationData };

// Legacy type for backward compatibility (will be removed after migration)
export type WaterQualityData = {
  quarryInput: string;
  plantInput: string;
  quarryPlantInput: string;
  parameter: string;
  resultType: string;
  tssCurrent: string;
  tssPrevious: string;
  mmtCurrent: string;
  mmtPrevious: string;
  isMMTNA: boolean;
  eqplRedFlag: string;
  action: string;
  limit: string;
  remarks: string;
  dateTime: string;
  weatherWind: string;
  explanation: string;
  isExplanationNA: boolean;
  overallCompliance: string;
};

export type PortData = {
  id: string;
  portName: string;
  parameter: string;
  resultType: string;
  tssCurrent: string;
  tssPrevious: string;
  mmtCurrent: string;
  mmtPrevious: string;
  isMMTNA: boolean;
  eqplRedFlag: string;
  action: string;
  limit: string;
  remarks: string;
  dateTime: string;
  weatherWind: string;
  explanation: string;
  isExplanationNA: boolean;
  additionalParameters: Parameter[];
};
