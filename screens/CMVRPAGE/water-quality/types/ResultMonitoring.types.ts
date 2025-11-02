export type TSSItem = {
  id: string;
  name: string;
  current: string;
  previous: string;
  isChecked: boolean;
};

export type ResultMonitoringProps = {
  resultType: string;
  tssCurrent: string;
  tssPrevious: string;
  onResultTypeChange: (value: string) => void;
  onTSSChange: (field: 'tssCurrent' | 'tssPrevious', value: string) => void;
};