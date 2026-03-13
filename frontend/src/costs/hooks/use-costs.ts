import { useQuery, useMutation } from "@apollo/client/react";
import { useCallback, useState } from "react";
import { usePlantStore } from "@shared/store";
import { GET_INDIRECT_COSTS_BY_PLANT } from "@costs/graphql/costs.query";
import {
  CREATE_INDIRECT_COST,
  UPDATE_INDIRECT_COST,
  DELETE_INDIRECT_COST,
} from "@costs/graphql/costs.mutation";
import { adaptIndirectCostsResponse } from "@costs/adapters/costs.adapter";
import type { DraftCosts } from "@costs/models/costs.model";
import { EMPTY_DRAFT_COSTS } from "@costs/models/costs.model";

export function useCosts() {
  const selectedPlantId = usePlantStore((state) => state.selectedPlantId);
  const [draft, setDraft] = useState<DraftCosts>({ ...EMPTY_DRAFT_COSTS });

  const { data, loading, error, refetch } = useQuery(
    GET_INDIRECT_COSTS_BY_PLANT,
    {
      variables: { plantId: selectedPlantId },
      skip: !selectedPlantId,
    },
  );

  const [createIndirectCostMutation] = useMutation(CREATE_INDIRECT_COST);
  const [updateIndirectCostMutation] = useMutation(UPDATE_INDIRECT_COST);
  const [deleteIndirectCostMutation] = useMutation(DELETE_INDIRECT_COST);

  const indirectCosts = adaptIndirectCostsResponse(data);

  const hasPendingChanges = Object.keys(draft.edits).length > 0;

  const stageCostEdit = useCallback((costId: string, amount: number) => {
    setDraft((prev) => ({
      ...prev,
      edits: {
        ...prev.edits,
        [costId]: { amount },
      },
    }));
  }, []);

  const getDraftAmount = (costId: string): number | undefined =>
    draft.edits[costId]?.amount;

  const handleDiscard = useCallback(() => {
    setDraft({ ...EMPTY_DRAFT_COSTS });
  }, []);

  const handleSave = useCallback(async () => {
    const promises: Promise<unknown>[] = [];

    for (const [costId, edit] of Object.entries(draft.edits)) {
      promises.push(
        updateIndirectCostMutation({
          variables: { input: { id: costId, amount: edit.amount } },
        }),
      );
    }

    await Promise.all(promises);
    setDraft({ ...EMPTY_DRAFT_COSTS });
    await refetch();
  }, [draft, updateIndirectCostMutation, refetch]);

  const handleAddCost = useCallback(
    async (name: string, amount: number) => {
      if (!selectedPlantId) return;
      await createIndirectCostMutation({
        variables: { input: { plantId: selectedPlantId, name, amount } },
        refetchQueries: [GET_INDIRECT_COSTS_BY_PLANT],
      });
    },
    [selectedPlantId, createIndirectCostMutation],
  );

  const handleDeleteCost = useCallback(
    async (costId: string) => {
      setDraft((prev) => {
        const next = { ...prev.edits };
        delete next[costId];
        return { ...prev, edits: next };
      });
      await deleteIndirectCostMutation({
        variables: { id: costId },
        refetchQueries: [GET_INDIRECT_COSTS_BY_PLANT],
      });
    },
    [deleteIndirectCostMutation],
  );

  return {
    indirectCosts,
    loading,
    error,
    selectedPlantId,
    hasPendingChanges,
    stageCostEdit,
    getDraftAmount,
    handleDiscard,
    handleSave,
    handleAddCost,
    handleDeleteCost,
  };
}
