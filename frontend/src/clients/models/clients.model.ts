import { z } from "zod";

export const marginConfigSchema = z.object({
  id: z.string(),
  plantId: z.string(),
  clientTypeId: z.string().optional().nullable(),
  clientId: z.string().optional().nullable(),
  vol300: z.number(),
  vol500: z.number(),
  vol1T: z.number(),
  vol3T: z.number(),
  vol5T: z.number(),
  vol10T: z.number(),
  vol20T: z.number(),
  vol30T: z.number(),
  isOverride: z.boolean(),
});

export type MarginConfig = z.infer<typeof marginConfigSchema>;

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  clientTypeId: z.string(),
  pricePerColor: z.number(),
  priceLinkType: z.string(),
  marginConfigs: z.array(marginConfigSchema),
});

export type Client = z.infer<typeof clientSchema>;

export const clientTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  pricePerColor: z.number(),
  priceLinkType: z.string(),
  clients: z.array(clientSchema),
  marginConfigs: z.array(marginConfigSchema),
});

export type ClientType = z.infer<typeof clientTypeSchema>;

export const updateMarginInputSchema = z.object({
  id: z.string(),
  vol300: z.number().optional().nullable(),
  vol500: z.number().optional().nullable(),
  vol1T: z.number().optional().nullable(),
  vol3T: z.number().optional().nullable(),
  vol5T: z.number().optional().nullable(),
  vol10T: z.number().optional().nullable(),
  vol20T: z.number().optional().nullable(),
  vol30T: z.number().optional().nullable(),
});

export type UpdateMarginInput = z.infer<typeof updateMarginInputSchema>;

export interface DraftMarginChange {
  [field: string]: number;
}

export interface DraftClientChange {
  priceLinkType?: string;
  pricePerColor?: number;
  margins?: DraftMarginChange;
  _marginConfigId?: string;
}

export interface DraftClientTypeChange {
  priceLinkType?: string;
  pricePerColor?: number;
}

export interface DraftNewOverride {
  clientId: string;
  fields: DraftMarginChange;
}

export interface DraftChanges {
  clientEdits: Record<string, DraftClientChange>;
  clientTypeEdits: Record<string, DraftClientTypeChange>;
  newOverrides: Record<string, DraftNewOverride>;
}

export const EMPTY_DRAFT: DraftChanges = {
  clientEdits: {},
  clientTypeEdits: {},
  newOverrides: {},
};
