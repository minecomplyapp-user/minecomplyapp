// AirQualityScreen.types.ts
export type AirQualityParameter = {
  id: string;
  name: string;
  inSMR: string;
  mmtConfirmatorySampling: string;
  redFlag: string;
  action: string;
  limit: string;
  remarks: string;
};

export type LocationState = {
  quarry: boolean;
  plant: boolean;
  quarryAndPlant: boolean;
  port: boolean;
};

// Individual location data structure
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
