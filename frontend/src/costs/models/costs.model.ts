import { z } from "zod";

export const indirectCostSchema = z.object({
  id: z.string(),
  plantId: z.string(),
  name: z.string(),
  amount: z.number(),
});

export type IndirectCost = z.infer<typeof indirectCostSchema>;



export interface DraftCostEdit {
  amount: number;
}

export interface DraftCosts {
  edits: Record<string, DraftCostEdit>;
}

export const EMPTY_DRAFT_COSTS: DraftCosts = {
  edits: {},
};
