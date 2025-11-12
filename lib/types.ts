export interface LocationMarkupInput {
  name: string;
  markup: number;
}

export interface IFPMappingFormData {
  ifpKey: string;
  btName: string;
  costGroup: boolean;
  locationMarkups: LocationMarkupInput[];
}

export interface IFPMappingResponse {
  id: string;
  ifpKey: string;
  btName: string;
  costGroup: boolean;
  locationMarkups: LocationMarkupInput & { id: string };
  createdAt: string;
  updatedAt: string;
}
