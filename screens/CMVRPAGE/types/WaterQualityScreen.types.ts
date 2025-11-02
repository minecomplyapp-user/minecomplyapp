// WaterQualityScreen.types.ts
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
  dateTime: string;
  weatherWind: string;
  explanation: string;
  isExplanationNA: boolean;
  mmtCurrent?: string;      // Add this
  mmtPrevious?: string;     // Add this
  isMMTNA?: boolean;        // Add this
};

export type LocationState = {
  quarry: boolean;
  plant: boolean;
  quarryPlant: boolean;
};

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





