export type ECCInfo = {
  isNA: boolean;
  permitHolder: string;
  eccNumber: string;
  dateOfIssuance: string;
};

export type ECCAdditionalForm = {
  permitHolder: string;
  eccNumber: string;
  dateOfIssuance: string;
};

export type ISAGInfo = {
  isNA: boolean;
  permitHolder: string;
  isagNumber: string;
  dateOfIssuance: string;
  currentName: string;
  nameInECC: string;
  projectStatus: string;
  gpsX: string;
  gpsY: string;
  proponentName: string;
  proponentContact: string;
  proponentAddress: string;
  proponentPhone: string;
  proponentEmail: string;
};

export type ISAGAdditionalForm = {
  permitHolder: string;
  isagNumber: string;
  dateOfIssuance: string;
};

export type CombinedSectionProps = {
  eccInfo: ECCInfo;
  setEccInfo: React.Dispatch<React.SetStateAction<ECCInfo>>;
  eccAdditionalForms: ECCAdditionalForm[];
  setEccAdditionalForms: React.Dispatch<React.SetStateAction<ECCAdditionalForm[]>>;
  isagInfo: ISAGInfo;
  setIsagInfo: React.Dispatch<React.SetStateAction<ISAGInfo>>;
  isagAdditionalForms: ISAGAdditionalForm[];
  setIsagAdditionalForms: React.Dispatch<React.SetStateAction<ISAGAdditionalForm[]>>;
  permitHolderList: string[];
  setPermitHolderList: React.Dispatch<React.SetStateAction<string[]>>;

};