
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