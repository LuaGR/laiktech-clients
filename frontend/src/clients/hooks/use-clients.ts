import { useQuery, useMutation } from "@apollo/client/react";
import { useCallback, useState } from "react";
import { usePlantStore } from "@shared/store";
import { GET_CLIENT_TYPES_BY_PLANT } from "@clients/graphql/clients.query";
import {
  UPDATE_MARGIN,
  UPDATE_CLIENT_TYPE,
  UPDATE_CLIENT_TYPE_MARGINS,
  RESET_CLIENT_OVERRIDE,
  CREATE_CLIENT,
  CREATE_MARGIN_OVERRIDE,
  UPDATE_CLIENT,
} from "@clients/graphql/clients.mutation";
import { adaptClientTypesResponse } from "@clients/adapters/clients.adapter";
import type {
  UpdateMarginInput,
  DraftChanges,
  DraftClientTypeChange,
} from "@clients/models/clients.model";
import { EMPTY_DRAFT } from "@clients/models/clients.model";

export function useClients() {
  const selectedPlantId = usePlantStore((state) => state.selectedPlantId);
  const [draft, setDraft] = useState<DraftChanges>({ ...EMPTY_DRAFT });

  const { data, loading, error, refetch } = useQuery(
    GET_CLIENT_TYPES_BY_PLANT,
    {
      variables: { plantId: selectedPlantId },
      skip: !selectedPlantId,
    },
  );

  const [updateClientTypeMutation] = useMutation(UPDATE_CLIENT_TYPE);
  const [updateMarginMutation] = useMutation(UPDATE_MARGIN);
  const [updateClientTypeMarginsMutation] = useMutation(
    UPDATE_CLIENT_TYPE_MARGINS,
  );
  const [resetClientOverrideMutation] = useMutation(RESET_CLIENT_OVERRIDE);
  const [createClientMutation] = useMutation(CREATE_CLIENT);
  const [createMarginOverrideMutation] = useMutation(CREATE_MARGIN_OVERRIDE);
  const [updateClientMutation] = useMutation(UPDATE_CLIENT);

  const clientTypes = adaptClientTypesResponse(data);

  const hasPendingChanges =
    Object.keys(draft.clientEdits).length > 0 ||
    Object.keys(draft.clientTypeEdits).length > 0 ||
    Object.keys(draft.newOverrides).length > 0;

  const stageMarginChange = useCallback(
    (
      marginConfigId: string,
      clientId: string,
      field: string,
      value: number,
    ) => {
      setDraft((prev) => {
        const existing = prev.clientEdits[clientId] ?? {};
        const existingMargins = existing.margins ?? {};
        return {
          ...prev,
          clientEdits: {
            ...prev.clientEdits,
            [clientId]: {
              ...existing,
              margins: { ...existingMargins, [field]: value },
              _marginConfigId: marginConfigId,
            },
          },
        };
      });
    },
    [],
  );

  const stagePriceLinkChange = useCallback(
    (clientId: string, priceLinkType: string) => {
      setDraft((prev) => {
        const existing = prev.clientEdits[clientId] ?? {};
        return {
          ...prev,
          clientEdits: {
            ...prev.clientEdits,
            [clientId]: { ...existing, priceLinkType },
          },
        };
      });
    },
    [],
  );

  const stagePricePerColorChange = useCallback(
    (clientId: string, pricePerColor: number) => {
      setDraft((prev) => {
        const existing = prev.clientEdits[clientId] ?? {};
        return {
          ...prev,
          clientEdits: {
            ...prev.clientEdits,
            [clientId]: { ...existing, pricePerColor },
          },
        };
      });
    },
    [],
  );

  const stageNewOverride = useCallback(
    (clientId: string, field: string, value: number) => {
      setDraft((prev) => {
        const existing = prev.newOverrides[clientId];
        const existingFields = existing?.fields ?? {};
        return {
          ...prev,
          newOverrides: {
            ...prev.newOverrides,
            [clientId]: {
              clientId,
              fields: { ...existingFields, [field]: value },
            },
          },
        };
      });
    },
    [],
  );

  const stageClientTypeChange = useCallback(
    (clientTypeId: string, change: DraftClientTypeChange) => {
      setDraft((prev) => {
        const existing = prev.clientTypeEdits[clientTypeId] ?? {};
        return {
          ...prev,
          clientTypeEdits: {
            ...prev.clientTypeEdits,
            [clientTypeId]: { ...existing, ...change },
          },
        };
      });
    },
    [],
  );

  const handleUpdateClientTypeMargins = useCallback(
    async (clientTypeId: string, plantId: string, input: UpdateMarginInput) => {
      await updateClientTypeMarginsMutation({
        variables: { clientTypeId, plantId, input },
        refetchQueries: [GET_CLIENT_TYPES_BY_PLANT],
      });
    },
    [updateClientTypeMarginsMutation],
  );

  const handleResetOverride = useCallback(
    async (marginConfigId: string) => {
      await resetClientOverrideMutation({
        variables: { marginConfigId },
        refetchQueries: [GET_CLIENT_TYPES_BY_PLANT],
      });
    },
    [resetClientOverrideMutation],
  );

  const handleAddClient = useCallback(
    async (
      name: string,
      pricePerColor: number,
      clientTypeId: string,
      plantId: string,
    ) => {
      await createClientMutation({
        variables: { input: { name, pricePerColor, clientTypeId, plantId } },
        refetchQueries: [GET_CLIENT_TYPES_BY_PLANT],
      });
    },
    [createClientMutation],
  );

  const handleDiscard = useCallback(() => {
    setDraft({ ...EMPTY_DRAFT });
  }, []);

  const handleSave = useCallback(async () => {
    const promises: Promise<unknown>[] = [];

    for (const [clientTypeId, edit] of Object.entries(draft.clientTypeEdits)) {
      const input: DraftClientTypeChange = {};
      if (edit.priceLinkType !== undefined) input.priceLinkType = edit.priceLinkType;
      if (edit.pricePerColor !== undefined) input.pricePerColor = edit.pricePerColor;
      if (Object.keys(input).length > 0) {
        promises.push(
          updateClientTypeMutation({ variables: { id: clientTypeId, input } }),
        );
      }
    }

    for (const [clientId, edit] of Object.entries(draft.clientEdits)) {
      if (edit.margins && edit._marginConfigId) {
        const marginInput: UpdateMarginInput = {
          id: edit._marginConfigId,
          ...edit.margins,
        };
        promises.push(
          updateMarginMutation({ variables: { input: marginInput } }),
        );
      }

      const clientInput: DraftClientTypeChange = {};
      if (edit.priceLinkType !== undefined) clientInput.priceLinkType = edit.priceLinkType;
      if (edit.pricePerColor !== undefined) clientInput.pricePerColor = edit.pricePerColor;
      if (Object.keys(clientInput).length > 0) {
        promises.push(
          updateClientMutation({ variables: { id: clientId, input: clientInput } }),
        );
      }
    }

    if (selectedPlantId) {
      for (const override of Object.values(draft.newOverrides)) {
        const fieldEntries = Object.entries(override.fields);
        if (fieldEntries.length === 0) continue;

        const [firstField, firstValue] = fieldEntries[0];
        const remainingEntries = fieldEntries.slice(1);

        const overridePromise = createMarginOverrideMutation({
          variables: {
            input: {
              plantId: selectedPlantId,
              clientId: override.clientId,
              field: firstField,
              value: firstValue,
            },
          },
        }).then(async (result) => {
          if (remainingEntries.length === 0) return;
          const createdId = (
            result.data as { createMarginOverride?: { id: string } } | null
          )?.createMarginOverride?.id;
          if (!createdId) return;
          const remainingFields = Object.fromEntries(remainingEntries);
          await updateMarginMutation({
            variables: { input: { id: createdId, ...remainingFields } },
          });
        });

        promises.push(overridePromise);
      }
    }

    await Promise.all(promises);
    setDraft({ ...EMPTY_DRAFT });
    await refetch();
  }, [
    draft,
    selectedPlantId,
    updateClientTypeMutation,
    updateMarginMutation,
    updateClientMutation,
    createMarginOverrideMutation,
    refetch,
  ]);

  const getDraftMarginValue = (
    clientId: string,
    marginConfigId: string | undefined,
    field: string,
  ): number | undefined => {
    const clientEdit = draft.clientEdits[clientId];
    if (
      clientEdit?.margins?.[field] !== undefined &&
      clientEdit._marginConfigId === marginConfigId
    ) {
      return clientEdit.margins[field];
    }
    return draft.newOverrides[clientId]?.fields[field];
  };

  const getDraftPriceLinkType = (clientId: string): string | undefined =>
    draft.clientEdits[clientId]?.priceLinkType;

  const getDraftPricePerColor = (clientId: string): number | undefined =>
    draft.clientEdits[clientId]?.pricePerColor;

  const getDraftClientTypeValue = (
    clientTypeId: string,
  ): DraftClientTypeChange | undefined => draft.clientTypeEdits[clientTypeId];

  return {
    clientTypes,
    loading,
    error,
    selectedPlantId,
    refetch,
    hasPendingChanges,
    stageMarginChange,
    stagePriceLinkChange,
    stagePricePerColorChange,
    stageNewOverride,
    stageClientTypeChange,
    getDraftClientTypeValue,
    handleUpdateClientTypeMargins,
    handleResetOverride,
    handleAddClient,
    handleDiscard,
    handleSave,
    getDraftMarginValue,
    getDraftPriceLinkType,
    getDraftPricePerColor,
  };
}
