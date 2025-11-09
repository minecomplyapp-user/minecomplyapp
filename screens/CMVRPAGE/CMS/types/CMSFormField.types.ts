export interface SubField {
  label: string;
  specification: string;
}

export interface CMSFormFieldProps {
  label: string;
  specification: string;
  remarks: string;
  withinSpecs: boolean | null;
  subFields?: SubField[];
  showUploadImage?: boolean;
  uploadedImage?: string;
  isUploadingImage?: boolean;
  onSpecificationChange: (text: string) => void;
  onRemarksChange: (text: string) => void;
  onWithinSpecsChange: (value: boolean) => void;
  onSubFieldChange?: (index: number, value: string) => void;
  onUploadImage?: () => void | Promise<void>;
  onRemoveImage?: () => void | Promise<void>;
}
