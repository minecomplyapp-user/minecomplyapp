import { ChemicalSafetyData, YesNoNull } from '../../types/ChemicalSafetyScreen.types';

export interface ChemicalSafetySectionProps {
  chemicalSafety: ChemicalSafetyData;
  updateChemicalSafety: (field: keyof ChemicalSafetyData, value: YesNoNull | string | boolean) => void;
}