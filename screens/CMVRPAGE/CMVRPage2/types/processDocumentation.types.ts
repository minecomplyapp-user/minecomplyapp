export interface ProcessDocumentationData {
  dateConducted: string;
  sameDateForAll: boolean;
  eccMmtMembers: string;
  epepMmtMembers: string;
  ocularMmtMembers: string;
  ocularNA: boolean;
  methodologyRemarks: string;
  siteValidationApplicable: string;
  samplingDateConducted: string;
  samplingMmtMembers: string;
  samplingMethodologyRemarks: string;
}

export interface ProcessDocumentationProps {
  processDoc: ProcessDocumentationData;
  updateProcessDoc: (field: string, value: any) => void;
  eccMmtAdditional: string[];
  epepMmtAdditional: string[];
  ocularMmtAdditional: string[];
  
  addEccMmtMember: () => void;
  addEpepMmtMember: () => void;
  addOcularMmtMember: () => void;
  updateEccMmtAdditional: (index: number, value: string) => void;
  updateEpepMmtAdditional: (index: number, value: string) => void;
  updateOcularMmtAdditional: (index: number, value: string) => void;
  removeEccMmtAdditional: (index: number) => void;
  removeEpepMmtAdditional: (index: number) => void;
  removeOcularMmtAdditional: (index: number) => void;
}