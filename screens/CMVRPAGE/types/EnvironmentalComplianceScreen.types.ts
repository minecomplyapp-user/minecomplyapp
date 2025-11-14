// EnvironmentalComplianceScreen.types.ts
export type ParameterData = {
  id: string;
  parameter: string;
  currentSMR: string;
  previousSMR: string;
  currentMMT: string;
  previousMMT: string;
  thirdPartyTesting: string;
  eqplRedFlag: string;
  action: string;
  limitPM25: string;
  remarks: string;
};

export type LocationState = {
  quarry: boolean;
  plant: boolean;
  port: boolean;
  quarryPlant: boolean;
};

// Individual location data structure
export type LocationData = {
  locationInput: string;
  parameter: string;
  currentSMR: string;
  previousSMR: string;
  currentMMT: string;
  previousMMT: string;
  thirdPartyTesting: string;
  eqplRedFlag: string;
  action: string;
  limitPM25: string;
  remarks: string;
  parameters: ParameterData[];
  dateTime: string;
  weatherWind: string;
  explanation: string;
  overallCompliance: string;
};

export const createEmptyLocationData = (): LocationData => ({
  locationInput: "",
  parameter: "",
  currentSMR: "",
  previousSMR: "",
  currentMMT: "",
  previousMMT: "",
  thirdPartyTesting: "",
  eqplRedFlag: "",
  action: "",
  limitPM25: "",
  remarks: "",
  parameters: [],
  dateTime: "",
  weatherWind: "",
  explanation: "",
  overallCompliance: "",
});

export type ComplianceData = {
  eccConditions: string;
  quarry: string;
  plant: string;
  port: string;
  quarryPlant: string;
  parameter: string;
  currentSMR: string;
  previousSMR: string;
  currentMMT: string;
  previousMMT: string;
  thirdPartyTesting: string;
  eqplRedFlag: string;
  action: string;
  limitPM25: string;
  remarks: string;
  parameters: ParameterData[];
  dateTime: string;
  weatherWind: string;
  explanation: string;
  overallCompliance: string;
};
