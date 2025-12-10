export interface Location {
  id: string;
  name: string;
  markup: number;
  createdAt: string;
  updatedAt: string;
}

// Model types
export interface Model {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  exteriors?: Exterior[];
}

export interface ModelFormData {
  name: string;
  description?: string;
}

// Exterior types
export interface Exterior {
  id: string;
  name: string;
  modelId: string;
  createdAt: string;
  updatedAt: string;
  model?: Model;
  options?: Option[];
}

export interface ExteriorFormData {
  name: string;
  modelId: string;
}

// Option types
export interface Option {
  id: string;
  name: string;
  exteriorId: string;
  createdAt: string;
  updatedAt: string;
  exterior?: Exterior;
  costItems?: CostItem[];
}

export interface OptionFormData {
  name: string;
  exteriorId: string;
}

// CostItem types
export interface CostItem {
  id: string;
  btName: string;
  costGroup: boolean;
  isDefault: boolean;
  optionId: string;
  createdAt: string;
  updatedAt: string;
  option?: Option;
}

export interface CostItemFormData {
  btName: string;
  costGroup: boolean;
  isDefault: boolean;
  optionId: string;
}
