export type MMTSectionProps = {
  mmtCurrent: string;
  mmtPrevious: string;
  isMMTNA: boolean;
  onInputChange: (field: string, value: string) => void;
  onNAToggle: () => void;
};
