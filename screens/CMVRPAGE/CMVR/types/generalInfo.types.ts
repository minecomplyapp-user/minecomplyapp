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

