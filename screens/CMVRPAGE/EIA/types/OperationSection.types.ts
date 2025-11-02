import { MitigatingMeasure } from './MitigatingMeasureForm.types';

export interface OperationSection {
  title: string;
  isNA: boolean;
  measures: MitigatingMeasure[];
}

export interface OperationSectionProps {
  section: OperationSection;
  onNAToggle: () => void;
  onMeasureUpdate: (measureId: string, field: keyof MitigatingMeasure, value: any) => void;
  onAddMeasure: () => void;
  onDeleteMeasure: (measureId: string) => void;
}