import { getCostsByPlant, createCost, updateCost, deleteCost } from '../services/cost.service.js';
import type { CreateCostInput, UpdateCostInput } from '../models/cost.model.js';

export const costResolvers = {
  Query: {
    indirectCostsByPlant: async (parent: undefined, { plantId }: { plantId: string }) => {
      return await getCostsByPlant(plantId);
    },
  },
  Mutation: {
    createIndirectCost: async (parent: undefined, { input }: { input: CreateCostInput }) => {
      return await createCost(input);
    },
    updateIndirectCost: async (parent: undefined, { input }: { input: UpdateCostInput }) => {
      return await updateCost(input);
    },
    deleteIndirectCost: async (parent: undefined, { id }: { id: string }) => {
      return await deleteCost(id);
    },
  },
};
