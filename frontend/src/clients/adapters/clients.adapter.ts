import { clientTypeSchema } from "@clients/models/clients.model";
import type { ClientType } from "@clients/models/clients.model";
import { z } from "zod";

const responseSchema = z.object({
  clientTypesByPlant: z.array(clientTypeSchema).optional().nullable(),
});

export const adaptClientTypesResponse = (data: unknown): ClientType[] => {
  const parsed = responseSchema.safeParse(data);

  if (!parsed.success || !parsed.data?.clientTypesByPlant) {
    return [];
  }

  return parsed.data.clientTypesByPlant;
};
