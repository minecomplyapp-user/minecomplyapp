export interface OtherComponent {
  specification: string;
  remarks: string;
  withinSpecs: boolean | null;
}

export interface CMSOtherComponentsProps {
  components: OtherComponent[];
  onComponentChange: (index: number, field: 'specification' | 'remarks', value: string) => void;
  onWithinSpecsChange: (index: number, value: boolean) => void;
  onAddComponent: () => void;
  onDeleteComponent: (index: number) => void;
}