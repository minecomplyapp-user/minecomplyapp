export type FundInfo = {
  isNA: boolean;
  permitHolder: string;
  savingsAccount: string;
  amountDeposited: string;
  dateUpdated: string;
};

export type FundAdditionalForm = {
  permitHolder: string;
  savingsAccount: string;
  amountDeposited: string;
  dateUpdated: string;
};

export type RCFSectionProps = {
  rcfInfo: FundInfo;
  setRcfInfo: React.Dispatch<React.SetStateAction<FundInfo>>;
  rcfAdditionalForms: FundAdditionalForm[];
  setRcfAdditionalForms: React.Dispatch<React.SetStateAction<FundAdditionalForm[]>>;
  mtfInfo: FundInfo;
  setMtfInfo: React.Dispatch<React.SetStateAction<FundInfo>>;
  mtfAdditionalForms: FundAdditionalForm[];
  setMtfAdditionalForms: React.Dispatch<React.SetStateAction<FundAdditionalForm[]>>;
  fmrdfInfo: FundInfo;
  setFmrdfInfo: React.Dispatch<React.SetStateAction<FundInfo>>;
  fmrdfAdditionalForms: FundAdditionalForm[];
  setFmrdfAdditionalForms: React.Dispatch<React.SetStateAction<FundAdditionalForm[]>>;
};