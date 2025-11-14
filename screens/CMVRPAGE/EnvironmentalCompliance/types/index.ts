export type ParameterData = {
  parameter: string;
  currentSMR: string;
  previousSMR: string;
  currentMMT: string;
  previousMMT: string;
  thirdPartyTesting: string;
  eqplRedFlag: string;
  action: string;
  limitPM25: string;
  remarks: string;
};

export type ParameterFormProps = {
  data: ParameterData;
  onUpdate: (field: keyof ParameterData, value: string) => void;
  showNA?: boolean;
  naChecked?: boolean;
  onNAChange?: () => void;
  showDelete?: boolean;
  onDelete?: () => void;
  index?: number;
  showAdditionalFields?: boolean;
  dateTime?: string;
  weatherWind?: string;
  explanation?: string;
  onDateTimeChange?: (text: string) => void;
  onWeatherWindChange?: (text: string) => void;
  onExplanationChange?: (text: string) => void;
};

export type LocationCheckboxRowProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  isSelected: boolean;
  onCheckboxPress: () => void;
};

export type CheckboxFieldProps = {
  checked: boolean;
  onPress: () => void;
  label: string;
  size?: number;
};

export type FormInputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  subLabel?: string;
} & Omit<import('react-native').TextInputProps, 'value' | 'onChangeText'>;

export type SectionHeaderProps = {
  number: string;
  title: string;
  backgroundColor?: string;
};