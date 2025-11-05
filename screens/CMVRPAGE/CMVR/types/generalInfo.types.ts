export interface GeneralInfoProps {
  fileName: string;
  companyName: string;
  projectName: string;
  location: string;
  region: string;
  province: string;
  municipality: string;
  quarter: string;
  year: string;
  dateOfCompliance: string;
  monitoringPeriod: string;
  dateOfCMRSubmission: string;
  onChange: (field: string, value: string) => void;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
