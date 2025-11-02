export interface ProjectImpactsProps {
  preConstruction: 'yes' | 'no' | null;
  construction: 'yes' | 'no' | null;
  onPreConstructionChange: (value: 'yes' | 'no' | null) => void;
  onConstructionChange: (value: 'yes' | 'no' | null) => void;
}