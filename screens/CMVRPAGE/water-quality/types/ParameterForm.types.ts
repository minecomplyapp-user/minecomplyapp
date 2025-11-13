import { Parameter } from "../../types/WaterQualityScreen.types";

export type ParameterFormProps = {
  parameter: Parameter;
  index?: number;
  isMain?: boolean;
  onUpdate: (
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => void;
  onDelete?: () => void;
  mmtCurrent?: string;
  mmtPrevious?: string;
  isMMTNA?: boolean;
  onMMTInputChange?: (field: string, value: string) => void;
  onMMTNAToggle?: () => void;
  samplingDetails?: {
    dateTime?: string;
    weatherWind?: string;
    explanation?: string;
    isExplanationNA?: boolean;
  };
  onSamplingDetailsChange?: (field: string, value: string) => void;
  onExplanationNAToggle?: () => void;
};
