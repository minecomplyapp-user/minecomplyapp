// Types for ECC Monitoring
// Types for ECC Monitoring used by the ECC monitoring screen and defaults
export type ConditionOption = {
  value: string;
  label: string;
  remark?: string;
  color?: string;
};

export type Condition = {
  id: number | string;
  title: string;
  options: ConditionOption[];
  selected?: string | null;
};

export type PermitHolder = {
  id: string;
  type: string;
  name: string;
  monitoringConditions: Condition[];
  complianceConditions: Condition[];
  customConditions: Condition[];
};

export type GPSLocation = {
  latitude: number;
  longitude: number;
};

export type ECCFormData = {
  companyName: string;
  location: string;
  gpsLocation: GPSLocation | null;
  status: string;
  date: Date;
  permitType: string;
  eccPermitHolder: string;
  eccNumber: string;
  eccIssuanceDate: Date;
  isagPermitHolder: string;
  isagNumber: string;
  isagIssuanceDate: Date;
  contactPerson: string;
  position: string;
  mailingAddress: string;
  telephoneNo: string;
  faxNo: string;
  emailAddress: string;
};

export type ShowDatePickerState = {
  show: boolean;
  field: string | null;
};

export type EditingCondition = {
  section: string;
  id: string | number;
  holderId?: string | null;
} | null;
// (end of ECC types)

