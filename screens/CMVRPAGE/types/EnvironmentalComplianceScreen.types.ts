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
