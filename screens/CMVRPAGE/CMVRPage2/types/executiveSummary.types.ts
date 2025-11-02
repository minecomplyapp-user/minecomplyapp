export interface EPEPCompliance {
  safety: boolean;
  social: boolean;
  rehabilitation: boolean;
}

export interface ComplaintsManagement {
  complaintReceiving: boolean;
  caseInvestigation: boolean;
  implementationControl: boolean;
  communicationComplainant: boolean;
  complaintDocumentation: boolean;
  naForAll: boolean;
}

export interface ExecutiveSummaryData {
  epepCompliance: EPEPCompliance;
  epepRemarks: string;
  sdmpCompliance: string;
  sdmpRemarks: string;
  complaintsManagement: ComplaintsManagement;
  complaintsRemarks: string;
  accountability: string;
  accountabilityRemarks: string;
  othersSpecify: string;
  othersNA: boolean;
}

export interface ExecutiveSummaryProps {
  executiveSummary: ExecutiveSummaryData;
  updateExecutiveSummary: (field: string, value: any) => void;
  toggleEpepCompliance: (field: keyof EPEPCompliance) => void;
  toggleComplaintsManagement: (field: keyof ComplaintsManagement) => void;
}