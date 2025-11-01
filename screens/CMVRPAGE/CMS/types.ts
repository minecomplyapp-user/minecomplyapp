export interface SubField {
  label: string;
  specification: string;
}

export interface FormField {
  label: string;
  specification: string;
  remarks: string;
  withinSpecs: boolean | null;
  subFields?: SubField[];
}

export interface OtherComponent {
  specification: string;
  remarks: string;
  withinSpecs: boolean | null;
}

export interface FormData {
  [key: string]: FormField;
}