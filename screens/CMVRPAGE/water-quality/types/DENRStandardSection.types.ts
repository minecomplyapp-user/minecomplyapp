export type DENRStandardSectionProps = {
  redFlag: string;
  action: string;
  limit: string;
  onInputChange: (field: 'eqplRedFlag' | 'action' | 'limit', value: string) => void;
};