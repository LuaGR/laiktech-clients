import { prisma } from '@shared/prisma.js';
import type { Prisma } from '@prisma/client';
import type { MarginConfig, UpdateMarginInput } from '@clients/models/client.model.js';

type MarginConfigPayload = Prisma.MarginConfigGetPayload<{}>;

const mapMarginToDomain = (margin: MarginConfigPayload): MarginConfig => ({
  id: margin.id,
  plantId: margin.plantId,
  clientTypeId: margin.clientTypeId || undefined,
  clientId: margin.clientId || undefined,
  vol300: Number(margin.vol300),
  vol500: Number(margin.vol500),
  vol1T: Number(margin.vol1T),
  vol3T: Number(margin.vol3T),
  vol5T: Number(margin.vol5T),
  vol10T: Number(margin.vol10T),
  vol20T: Number(margin.vol20T),
  vol30T: Number(margin.vol30T),
  isOverride: margin.isOverride,
});

export async function updateMargin(input: UpdateMarginInput): Promise<MarginConfig> {
  const currentMargin = await prisma.marginConfig.findUnique({
    where: { id: input.id },
  });

  if (!currentMargin) {
    throw new Error('MarginConfig not found');
  }

  const isOverride = currentMargin.clientId ? true : currentMargin.isOverride;

  const margin = await prisma.marginConfig.update({
    where: { id: input.id },
    data: {
      vol300: input.vol300,
      vol500: input.vol500,
      vol1T: input.vol1T,
      vol3T: input.vol3T,
      vol5T: input.vol5T,
      vol10T: input.vol10T,
      vol20T: input.vol20T,
      vol30T: input.vol30T,
      isOverride,
    },
  });

  return mapMarginToDomain(margin);
}

export async function updateClientTypeMargins(
  clientTypeId: string,
  plantId: string,
  input: UpdateMarginInput
): Promise<MarginConfig[]> {
  await prisma.marginConfig.update({
    where: { id: input.id },
    data: {
      vol300: input.vol300,
      vol500: input.vol500,
      vol1T: input.vol1T,
      vol3T: input.vol3T,
      vol5T: input.vol5T,
      vol10T: input.vol10T,
      vol20T: input.vol20T,
      vol30T: input.vol30T,
      isOverride: false,
    },
  });

  const clients = await prisma.client.findMany({
    where: { clientTypeId },
    select: { id: true },
  });

  const clientIds = clients.map(client => client.id);

  if (clientIds.length > 0) {
    await prisma.marginConfig.updateMany({
      where: {
        plantId,
        clientId: { in: clientIds },
        isOverride: false,
      },
      data: {
        vol300: input.vol300,
        vol500: input.vol500,
        vol1T: input.vol1T,
        vol3T: input.vol3T,
        vol5T: input.vol5T,
        vol10T: input.vol10T,
        vol20T: input.vol20T,
        vol30T: input.vol30T,
      },
    });
  }

  const updatedMargins = await prisma.marginConfig.findMany({
    where: {
      plantId,
      OR: [
        { clientTypeId },
        { clientId: { in: clientIds } },
      ],
    },
  });

  return updatedMargins.map(mapMarginToDomain);
}

export async function resetClientOverride(marginConfigId: string): Promise<MarginConfig> {
  const margin = await prisma.marginConfig.findUnique({
    where: { id: marginConfigId },
    include: { client: true },
  });

  if (!margin || !margin.clientId || !margin.client?.clientTypeId) {
    throw new Error('MarginConfig not associated with a specific client override.');
  }

  const headerMargin = await prisma.marginConfig.findFirst({
    where: {
      plantId: margin.plantId,
      clientTypeId: margin.client.clientTypeId,
    },
  });

  if (!headerMargin) {
    throw new Error('Header MarginConfig not found for this client type.');
  }

  const resetMargin = await prisma.marginConfig.update({
    where: { id: marginConfigId },
    data: {
      vol300: headerMargin.vol300,
      vol500: headerMargin.vol500,
      vol1T: headerMargin.vol1T,
      vol3T: headerMargin.vol3T,
      vol5T: headerMargin.vol5T,
      vol10T: headerMargin.vol10T,
      vol20T: headerMargin.vol20T,
      vol30T: headerMargin.vol30T,
      isOverride: false,
    },
  });

  return mapMarginToDomain(resetMargin);
}
