import { Complaint } from '../../types/ChemicalSafetyScreen.types';

export interface ComplaintsSectionProps {
  complaints: Complaint[];
  updateComplaint: (id: string, field: keyof Omit<Complaint, 'id'>, value: string | boolean | Complaint['filedLocation']) => void;
  addComplaint: () => void;
  removeComplaint: (id: string) => void;
}