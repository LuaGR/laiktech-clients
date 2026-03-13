import { z } from "zod";
import { indirectCostSchema } from "@costs/models/costs.model";
import type { IndirectCost } from "@costs/models/costs.model";

const responseSchema = z.object({
  indirectCostsByPlant: z.array(indirectCostSchema).optional().nullable(),
});

export const adaptIndirectCostsResponse = (data: unknown): IndirectCost[] => {
  const parsed = responseSchema.safeParse(data);

  if (!parsed.success || !parsed.data?.indirectCostsByPlant) {
    return [];
  }

  return parsed.data.indirectCostsByPlant;
};
