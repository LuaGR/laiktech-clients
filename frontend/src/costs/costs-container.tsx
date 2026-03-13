import { useState, useCallback } from "react";
import { useCosts } from "@costs/hooks/use-costs";
import { CostRow } from "./components/cost-row";
import { AddCostRow } from "./components/add-cost-row";
import { ActionBar } from "@shared/components/action-bar";
import { SavedToast } from "@shared/components/saved-toast";
import { Plus } from "lucide-react";

export function CostsContainer() {
  const {
    indirectCosts,
    loading,
    error,
    hasPendingChanges,
    stageCostEdit,
    getDraftAmount,
    handleDiscard,
    handleSave,
    handleAddCost,
    handleDeleteCost,
  } = useCosts();

  const [showAddRow, setShowAddRow] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await handleSave();
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2500);
    } finally {
      setIsSaving(false);
    }
  }, [handleSave]);


  if (loading && indirectCosts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-brand-500">
        Cargando costos indirectos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-8 text-red-500 bg-red-50 rounded-lg border border-red-200">
        Ocurrió un error al cargar la información: {error.message}
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col gap-4 relative">
      <SavedToast visible={showSavedToast} />

      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-brand-900">
            Costos indirectos
          </h1>
          <p className="text-sm text-brand-500 mt-0.5">
            Configuración de costos fijos por planta
          </p>
        </div>
        <button
          onClick={() => setShowAddRow(true)}
          disabled={showAddRow}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Agregar costo
        </button>
      </div>

      <div className="shrink-0">
        <div className="border border-surface-200 rounded-lg overflow-hidden bg-white w-full max-w-2xl">
          <table className="w-full table-fixed text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-black">
                <th className="px-4 py-3 text-xs font-semibold text-white w-1/2">
                  Nombre
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-white border-l border-gray-500">
                  Monto
                </th>
                <th className="px-3 py-3 w-14 border-l-0" />
              </tr>
            </thead>
            <tbody>
              {indirectCosts.length === 0 && !showAddRow ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-sm text-brand-400"
                  >
                    No hay costos indirectos registrados.
                  </td>
                </tr>
              ) : (
                indirectCosts.map((cost) => (
                  <CostRow
                    key={cost.id}
                    cost={cost}
                    draftAmount={getDraftAmount(cost.id)}
                    onStageEdit={stageCostEdit}
                    onDelete={handleDeleteCost}
                  />
                ))
              )}
              {showAddRow && (
                <AddCostRow
                  onConfirm={async (name, amount) => {
                    await handleAddCost(name, amount);
                    setShowAddRow(false);
                  }}
                  onCancel={() => setShowAddRow(false)}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ActionBar
        hasPendingChanges={hasPendingChanges}
        isSaving={isSaving}
        onSave={onSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
