// CMVRReportScreen.types.ts
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  CMVRReport: {
    submissionId: string;
    projectName: string;
    projectId: string;
    fileName?: string;
  };
  CMVRPage2: {
    submissionId: string;
    projectName: string;
    projectId: string;
    fileName: string;
  };
};

export type CMVRReportScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CMVRReport"
>;

export type CMVRReportScreenRouteProp = RouteProp<
  RootStackParamList,
  "CMVRReport"
>;

export type GeneralInfo = {
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
};

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

export type EPEPInfo = {
  isNA: boolean;
  permitHolder: string;
  epepNumber: string;
  dateOfApproval: string;
};

export type RCFInfo = {
  isNA: boolean;
  permitHolder: string;
  savingsAccount: string;
  amountDeposited: string;
  dateUpdated: string;
};

export type MMTInfo = {
  isNA: boolean;
  contactPerson: string;
  mailingAddress: string;
  phoneNumber: string;
  emailAddress: string;
};
