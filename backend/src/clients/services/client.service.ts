import { prisma } from '@shared/prisma.js';
import type { Prisma } from '@prisma/client';
import type { Plant, Operation, ClientType, Client, UpdateClientTypeHeaderInput, UpdateClientInput, CreateClientInput } from '@clients/models/client.model.js';

type MarginConfigPayload = Prisma.MarginConfigGetPayload<{}>;
type ClientPayload = Prisma.ClientGetPayload<{}> & { marginConfigs?: MarginConfigPayload[] };
type ClientTypePayload = Prisma.ClientTypeGetPayload<{}> & { marginConfigs?: MarginConfigPayload[]; clients?: ClientPayload[] };
type PlantPayload = Prisma.PlantGetPayload<{}>;
type OperationPayload = Prisma.OperationGetPayload<{}>;

const mapPlantToDomain = (plant: PlantPayload): Plant => ({
  id: plant.id,
  name: plant.name,
});

const mapOperationToDomain = (operation: OperationPayload): Operation => ({
  id: operation.id,
  name: operation.name,
  order: operation.order,
});

const mapMarginToDomain = (margin: MarginConfigPayload) => ({
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

const mapClientToDomain = (client: ClientPayload): Client => ({
  id: client.id,
  name: client.name,
  clientTypeId: client.clientTypeId,
  pricePerColor: Number(client.pricePerColor),
  priceLinkType: client.priceLinkType,
  marginConfigs: client.marginConfigs?.map(mapMarginToDomain),
});

const mapClientTypeToDomain = (clientType: ClientTypePayload): ClientType => ({
  id: clientType.id,
  name: clientType.name,
  pricePerColor: Number(clientType.pricePerColor),
  priceLinkType: clientType.priceLinkType,
  marginConfigs: clientType.marginConfigs?.map(mapMarginToDomain),
  clients: clientType.clients?.map(mapClientToDomain),
});

export async function getPlants(): Promise<Plant[]> {
  const plants = await prisma.plant.findMany({
    orderBy: { name: 'asc' },
  });

  return plants.map(mapPlantToDomain);
}

export async function getOperations(): Promise<Operation[]> {
  const ops = await prisma.operation.findMany({
    orderBy: { order: 'asc' },
  });

  return ops.map(mapOperationToDomain);
}

export async function getClientTypesByPlant(plantId: string): Promise<ClientType[]> {
  const types = await prisma.clientType.findMany({
    orderBy: { name: 'asc' },
    include: {
      marginConfigs: {
        where: { plantId },
      },
      clients: {
        orderBy: { name: 'asc' },
        include: {
          marginConfigs: {
            where: { plantId },
          },
        },
      },
    },
  });

  return types.map(mapClientTypeToDomain);
}

export async function updateClientType(id: string, input: UpdateClientTypeHeaderInput): Promise<ClientType> {
  const updated = await prisma.clientType.update({
    where: { id },
    data: {
      pricePerColor: input.pricePerColor,
      priceLinkType: input.priceLinkType,
    },
  });

  return mapClientTypeToDomain(updated);
}

export async function updateClient(id: string, input: UpdateClientInput): Promise<Client> {
  const updated = await prisma.client.update({
    where: { id },
    data: {
      pricePerColor: input.pricePerColor,
      priceLinkType: input.priceLinkType,
    },
  });

  return mapClientToDomain(updated);
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  const clientType = await prisma.clientType.findUnique({
    where: { id: input.clientTypeId },
  });

  if (!clientType) {
    throw new Error('ClientType not found');
  }

  const headerMargin = await prisma.marginConfig.findFirst({
    where: {
      plantId: input.plantId,
      clientTypeId: input.clientTypeId,
      clientId: null,
    },
  });

  const client = await prisma.client.create({
    data: {
      name: input.name,
      clientTypeId: input.clientTypeId,
      pricePerColor: input.pricePerColor ?? clientType.pricePerColor,
      priceLinkType: clientType.priceLinkType,
    },
  });

  await prisma.marginConfig.create({
    data: {
      plantId: input.plantId,
      clientId: client.id,
      vol300: headerMargin?.vol300 ?? 0,
      vol500: headerMargin?.vol500 ?? 0,
      vol1T: headerMargin?.vol1T ?? 0,
      vol3T: headerMargin?.vol3T ?? 0,
      vol5T: headerMargin?.vol5T ?? 0,
      vol10T: headerMargin?.vol10T ?? 0,
      vol20T: headerMargin?.vol20T ?? 0,
      vol30T: headerMargin?.vol30T ?? 0,
      isOverride: false,
    },
  });

  const created = await prisma.client.findUniqueOrThrow({
    where: { id: client.id },
    include: {
      marginConfigs: {
        where: { plantId: input.plantId },
      },
    },
  });

  return mapClientToDomain(created);
}
