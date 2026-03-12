import { useMemo, useState, useCallback } from "react";
import { ActionBar } from "./components/controls/action-bar";
import { useClients } from "@clients/hooks/use-clients";
import { ClientTypeSection } from "./components/table/client-type-section";
import { TableColGroup } from "./components/table/table-col-group";
import { ClientsTableHeader } from "./components/table/clients-table-header";
import { OverridesToggle } from "./components/controls/overrides-toggle";
import { SavedToast } from "./components/controls/saved-toast";

export function ClientsContainer() {
  const {
    clientTypes,
    loading,
    error,
    selectedPlantId,
    hasPendingChanges,
    stageMarginChange,
    stagePriceLinkChange,
    stagePricePerColorChange,
    stageNewOverride,
    stageClientTypeChange,
    getDraftClientTypeValue,
    handleAddClient,
    handleDiscard,
    handleSave,
    getDraftMarginValue,
    getDraftPriceLinkType,
    getDraftPricePerColor,
  } = useClients();

  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showOnlyOverrides, setShowOnlyOverrides] = useState(false);

  const sortedClientTypes = useMemo(() => {
    return [...clientTypes].sort((a, b) => {
      if (a.name === "Sin tipo de cliente") return 1;
      if (b.name === "Sin tipo de cliente") return -1;
      return a.name.localeCompare(b.name);
    });
  }, [clientTypes]);

  const filteredClientTypes = useMemo(() => {
    if (!showOnlyOverrides) return sortedClientTypes;
    return sortedClientTypes
      .map((clientType) => ({
        ...clientType,
        clients: clientType.clients.filter((client) =>
          client.marginConfigs.some((mc) => mc.isOverride),
        ),
      }))
      .filter((clientType) => clientType.clients.length > 0);
  }, [sortedClientTypes, showOnlyOverrides]);

  const toggleExpanded = (clientTypeId: string) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(clientTypeId)) {
        next.delete(clientTypeId);
      } else {
        next.add(clientTypeId);
      }
      return next;
    });
  };

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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-brand-500">
        Cargando configuración de clientes...
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

  if (sortedClientTypes.length === 0) {
    return (
      <div className="h-full flex flex-col gap-4">
        <div className="flex-1 flex items-center justify-center p-8 text-brand-500 bg-surface-50 rounded-lg border border-surface-200">
          No hay clientes registrados.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col gap-4 relative">
      <SavedToast visible={showSavedToast} />

      <div className="flex items-center justify-end shrink-0">
        <OverridesToggle
          checked={showOnlyOverrides}
          onChange={setShowOnlyOverrides}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2 pr-1">
          <ClientsTableHeader />

          {filteredClientTypes.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-brand-500 bg-surface-50 rounded-lg border border-surface-200">
              No hay empresas con datos sobre-escritos.
            </div>
          ) : (
            filteredClientTypes.map((clientType) => (
              <div
                key={clientType.id}
                className="border border-surface-200 rounded-lg overflow-hidden bg-white"
              >
                <table className="w-full table-fixed text-left border-separate border-spacing-0">
                  <TableColGroup />
                  <tbody>
                    <ClientTypeSection
                      clientType={clientType}
                      plantId={selectedPlantId!}
                      isExpanded={expandedTypes.has(clientType.id)}
                      onToggleExpand={() => toggleExpanded(clientType.id)}
                      onStageMarginChange={stageMarginChange}
                      onStagePriceLinkChange={stagePriceLinkChange}
                      onStagePricePerColorChange={stagePricePerColorChange}
                      onStageNewOverride={stageNewOverride}
                      onStageClientTypeChange={stageClientTypeChange}
                      getDraftClientTypeValue={getDraftClientTypeValue}
                      onAddClient={handleAddClient}
                      getDraftMarginValue={getDraftMarginValue}
                      getDraftPriceLinkType={getDraftPriceLinkType}
                      getDraftPricePerColor={getDraftPricePerColor}
                    />
                  </tbody>
                </table>
              </div>
            ))
          )}
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
