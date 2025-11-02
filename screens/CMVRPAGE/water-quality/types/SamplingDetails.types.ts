export type SamplingDetailsProps = {
  remarks: string;
  dateTime: string;
  weatherWind: string;
  explanation: string;
  isExplanationNA: boolean;
  onInputChange: (field: string, value: string) => void;
  onExplanationNAToggle: () => void;
};