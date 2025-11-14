// AirQualityScreen.types.ts
export type AirQualityParameter = {
  id: string;
  parameter: string; // Changed from 'name' to match backend
  currentSMR: string; // Changed from 'inSMR'
  previousSMR: string;
  currentMMT: string; // Changed from 'mmtConfirmatorySampling'
  previousMMT: string;
  eqplRedFlag: string; // Changed from 'redFlag'
  action: string;
  limitPM25: string; // Changed from 'limit'
  remarks: string;
};

export type LocationState = {
  quarry: boolean;
  plant: boolean;
  quarryPlant: boolean; // Changed from 'quarryAndPlant'
  port: boolean;
};

// Unified air quality monitoring data
export type AirQualityData = {
  // Main parameter (first row)
  parameter: string;
  currentSMR: string;
  previousSMR: string;
  currentMMT: string;
  previousMMT: string;
  eqplRedFlag: string;
  action: string;
  limitPM25: string;
  remarks: string;

  // Additional parameters
  parameters: AirQualityParameter[];

  // Monitoring metadata
  dateTime: string; // Changed from 'samplingDate'
  weatherWind: string; // Changed from 'weatherAndWind'
  explanation: string; // Changed from 'explanationForConfirmatorySampling'
  overallCompliance: string; // Changed from 'overallAssessment'
};

export const createEmptyAirQualityData = (): AirQualityData => ({
  parameter: "",
  currentSMR: "",
  previousSMR: "",
  currentMMT: "",
  previousMMT: "",
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

// Old structure for backward compatibility
export type AirQualityLocationData = {
  locationInput: string;
  samplingDate: string;
  weatherAndWind: string;
  explanationForConfirmatorySampling: string;
  overallAssessment: string;
  parameters: AirQualityParameter[];
};

export const createEmptyAirQualityLocationData =
  (): AirQualityLocationData => ({
    locationInput: "",
    samplingDate: "",
    weatherAndWind: "",
    explanationForConfirmatorySampling: "",
    overallAssessment: "",
    parameters: [],
  });
