import { prisma } from '@shared/prisma.js';
import type { Prisma } from '@prisma/client';
import type { IndirectCost, CreateCostInput, UpdateCostInput } from '@costs/models/cost.model.js';

type IndirectCostPayload = Prisma.IndirectCostGetPayload<{}>;

const mapCostToDomain = (cost: IndirectCostPayload): IndirectCost => ({
  id: cost.id,
  plantId: cost.plantId,
  name: cost.name,
  amount: Number(cost.amount),
});

export async function getCostsByPlant(plantId: string): Promise<IndirectCost[]> {
  const costs = await prisma.indirectCost.findMany({
    where: { plantId },
    orderBy: { name: 'asc' },
  });

  return costs.map(mapCostToDomain);
}

export async function createCost(input: CreateCostInput): Promise<IndirectCost> {
  const cost = await prisma.indirectCost.create({
    data: {
      plantId: input.plantId,
      name: input.name,
      amount: input.amount,
    },
  });

  return mapCostToDomain(cost);
}

export async function updateCost(input: UpdateCostInput): Promise<IndirectCost> {
  const cost = await prisma.indirectCost.update({
    where: { id: input.id },
    data: {
      amount: input.amount,
    },
  });

  return mapCostToDomain(cost);
}

export async function deleteCost(id: string): Promise<IndirectCost> {
  const cost = await prisma.indirectCost.delete({
    where: { id },
  });

  return mapCostToDomain(cost);
}
