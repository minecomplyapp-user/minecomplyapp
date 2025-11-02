export interface MitigatingMeasure {
  id: string;
  planned: string;
  actualObservation: string;
  isEffective: 'yes' | 'no' | null;
  recommendations: string;
}

export interface MitigatingMeasureFormProps {
  measure: MitigatingMeasure;
  index: number;
  onUpdate: (field: keyof MitigatingMeasure, value: any) => void;
  disabled?: boolean;
}