export enum ParameterType {
  NUMBER = "number",
  FLOAT = "float",
  STRING = "string"
};

export type ParameterRequest = {
  name: string;
  type: ParameterType;
  default: string;
  min: string;
  max: string;
  unit: string;
};