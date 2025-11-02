export type MMTInfo = {
  isNA: boolean;
  contactPerson: string;
  mailingAddress: string;
  phoneNumber: string;
  emailAddress: string;
};

export type MMTSectionProps = {
  mmtInfo: MMTInfo;
  setMmtInfo: React.Dispatch<React.SetStateAction<MMTInfo>>;
};