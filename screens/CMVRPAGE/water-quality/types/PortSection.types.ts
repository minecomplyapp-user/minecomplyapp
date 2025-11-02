import { Parameter, PortData } from "../../types/WaterQualityScreen.types";

export type PortSectionProps = {
  port: PortData;
  index: number;
  onUpdate: (portId: string, field: string, value: any) => void;
  onDelete: (portId: string) => void;
  onAddParameter: (portId: string) => void;
  onUpdateParameter: (portId: string, parameterId: string, field: keyof Omit<Parameter, 'id'>, value: string | boolean) => void;
  onDeleteParameter: (portId: string, parameterIndex: number) => void;
};