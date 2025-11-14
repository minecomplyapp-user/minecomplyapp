export type EPEPInfo = {
  isNA: boolean;
  permitHolder: string;
  epepNumber: string;
  dateOfApproval: string;
};

export type EPEPAdditionalForm = {
  permitHolder: string;
  epepNumber: string;
  dateOfApproval: string;
};

export type EPEPSectionProps = {
  epepInfo: EPEPInfo;
  setEpepInfo: React.Dispatch<React.SetStateAction<EPEPInfo>>;
  epepAdditionalForms: EPEPAdditionalForm[];
  setEpepAdditionalForms: React.Dispatch<React.SetStateAction<EPEPAdditionalForm[]>>;
};