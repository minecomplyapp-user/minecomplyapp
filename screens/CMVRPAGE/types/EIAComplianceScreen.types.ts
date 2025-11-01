// EIAComplianceScreen.types.ts
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  EIACompliance: undefined;
  EnvironmentalCompliance: undefined;
};

export type EIAComplianceScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EIACompliance"
>;

export type YesNoNull = "yes" | "no" | null;

export type MitigatingMeasure = {
  id: string;
  planned: string;
  actualObservation: string;
  isEffective: "yes" | "no" | null;
  recommendations: string;
};

export type OperationSection = {
  title: string;
  isNA: boolean;
  measures: MitigatingMeasure[];
};
