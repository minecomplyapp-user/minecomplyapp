export type ChoiceKey = "complied" | "partial" | "not";

export type CondID = string;

export type BaseCondition = {
  id: CondID;
  title: string;
  descriptions: Record<ChoiceKey, string>;
  isDefault?: boolean;
  parentId?: CondID | null;
};

export type StoredState = {
  edits: Record<CondID, Partial<BaseCondition>>;
  customs: BaseCondition[];
  selections: Record<CondID, ChoiceKey | null>;
};

export type PermitHolder = {
  id: string;
  type: "ECC" | "ISAG";
  name: string;
  permitNumber: string;
  issuanceDate: string | null;
  monitoringState: StoredState;
};

export type ConditionModalProps = {
  visible: boolean;
  mode: "add" | "edit";
  editing: BaseCondition | null;
  onChange: (c: BaseCondition) => void;
  onCancel: () => void;
  onSave: () => void;
};
