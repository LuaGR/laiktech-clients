import { getPlants, getOperations, getClientTypesByPlant, updateClientType, updateClient, createClient } from "../services/client.service.js";
import { updateMargin, updateClientTypeMargins, resetClientOverride, createMarginOverride } from "../services/margin.service.js";
import type { UpdateMarginInput, UpdateClientTypeHeaderInput, UpdateClientInput, CreateClientInput, CreateMarginOverrideInput } from "../models/client.model.js";

export const clientResolvers = {
  Query: {
    plants: async () => {
      return await getPlants();
    },
    operations: async () => {
      return await getOperations();
    },
    clientTypesByPlant: async (parent: undefined, { plantId }: { plantId: string }) => {
      return await getClientTypesByPlant(plantId);
    },
  },
  Mutation: {
    createMarginOverride: async (parent: undefined, { input }: { input: CreateMarginOverrideInput }) => {
      return await createMarginOverride(input);
    },
    createClient: async (parent: undefined, { input }: { input: CreateClientInput }) => {
      return await createClient(input);
    },
    updateMargin: async (parent: undefined, { input }: { input: UpdateMarginInput }) => {
      return await updateMargin(input);
    },
    updateClientTypeMargins: async (parent: undefined, { clientTypeId, plantId, input }: { clientTypeId: string; plantId: string; input: UpdateMarginInput }) => {
      return await updateClientTypeMargins(clientTypeId, plantId, input);
    },
    resetClientOverride: async (parent: undefined, { marginConfigId }: { marginConfigId: string }) => {
      return await resetClientOverride(marginConfigId);
    },
    updateClientType: async (parent: undefined, { id, input }: { id: string; input: UpdateClientTypeHeaderInput }) => {
      return await updateClientType(id, input);
    },
    updateClient: async (parent: undefined, { id, input }: { id: string; input: UpdateClientInput }) => {
      return await updateClient(id, input);
    },
  },
};
