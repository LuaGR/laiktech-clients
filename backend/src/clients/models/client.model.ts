export interface Plant {
  id: string;
  name: string;
}

export interface Operation {
  id: string;
  name: string;
  order: number;
}

export interface ClientType {
  id: string;
  name: string;
  pricePerColor: number;
  priceLinkType: string;
  clients?: Client[];
  marginConfigs?: MarginConfig[];
}

export interface Client {
  id: string;
  name: string;
  clientTypeId: string;
  clientType?: ClientType;
  pricePerColor: number;
  priceLinkType: string;
  marginConfigs?: MarginConfig[];
}

export interface MarginConfig {
  id: string;
  plantId: string;
  clientTypeId?: string;
  clientId?: string;
  vol300: number;
  vol500: number;
  vol1T: number;
  vol3T: number;
  vol5T: number;
  vol10T: number;
  vol20T: number;
  vol30T: number;
  isOverride: boolean;
}

export interface UpdateMarginInput {
  id: string;
  vol300?: number;
  vol500?: number;
  vol1T?: number;
  vol3T?: number;
  vol5T?: number;
  vol10T?: number;
  vol20T?: number;
  vol30T?: number;
}

export interface UpdateClientTypeHeaderInput {
  pricePerColor?: number;
  priceLinkType?: string;
}

export interface UpdateClientInput {
  pricePerColor?: number;
  priceLinkType?: string;
}

export interface CreateClientInput {
  name: string;
  clientTypeId: string;
  plantId: string;
  pricePerColor?: number;
}

export interface CreateMarginOverrideInput {
  clientId: string;
  plantId: string;
  field: string;
  value: number;
}
