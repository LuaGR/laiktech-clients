import { useState } from "react";
import type { ClientType, VolumeField } from "@clients/models/clients.model";
import { VOLUME_FIELDS } from "@clients/models/clients.model";
import { ClientRow } from "./client-row";
import { MarginCell } from "./margin-cell";
import { AddClientDialog } from "./add-client-dialog";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  ClipboardPenLine,
} from "lucide-react";

interface ClientTypeSectionProps {
  clientType: ClientType;
  plantId: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStageMarginChange: (
    marginConfigId: string,
    clientId: string,
    field: string,
    value: number,
  ) => void;
  onStagePriceLinkChange: (clientId: string, priceLinkType: string) => void;
  onStagePricePerColorChange: (clientId: string, pricePerColor: number) => void;
  onStageNewOverride: (clientId: string, field: string, value: number) => void;
  onStageClientTypeChange: (
    clientTypeId: string,
    change: { pricePerColor?: number; priceLinkType?: string },
  ) => void;
  getDraftClientTypeValue: (
    clientTypeId: string,
  ) => { pricePerColor?: number; priceLinkType?: string } | undefined;

  onAddClient: (
    name: string,
    pricePerColor: number,
    clientTypeId: string,
    plantId: string,
  ) => Promise<void>;
  getDraftMarginValue: (
    clientId: string,
    marginConfigId: string | undefined,
    field: string,
  ) => number | undefined;
  getDraftPriceLinkType: (clientId: string) => string | undefined;
  getDraftPricePerColor: (clientId: string) => number | undefined;
}

export function ClientTypeSection({
  clientType,
  plantId,
  isExpanded,
  onToggleExpand,
  onStageMarginChange,
  onStagePriceLinkChange,
  onStagePricePerColorChange,
  onStageNewOverride,
  onStageClientTypeChange,
  getDraftClientTypeValue,

  onAddClient,
  getDraftMarginValue,
  getDraftPriceLinkType,
  getDraftPricePerColor,
}: ClientTypeSectionProps) {
  const headerMargin = clientType.marginConfigs?.[0] ?? null;
  const clients = clientType.clients || [];
  const clientCount = clients.length;

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isTypeEditing, setIsTypeEditing] = useState(false);
  const [localPricePerColor, setLocalPricePerColor] = useState(
    String(clientType.pricePerColor),
  );

  const handleToggleTypeEditing = () => {
    if (!isTypeEditing) {
      setLocalPricePerColor(
        String(
          getDraftClientTypeValue(clientType.id)?.pricePerColor ??
            clientType.pricePerColor,
        ),
      );
    }
    setIsTypeEditing((prev) => !prev);
  };

  const handleHeaderUpdate = (field: string, value: number) => {
    if (headerMargin) {
      onStageMarginChange(headerMargin.id, clientType.id, field, value);
    }
  };

  const handleAddClient = async (name: string, pricePerColor: number) => {
    await onAddClient(name, pricePerColor, clientType.id, plantId);
    setShowAddDialog(false);
  };

  return (
    <>
      <tr className="bg-brand-50">
        <td className="p-3 font-bold text-brand-900 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {clientCount > 0 ? (
                  <button
                    onClick={onToggleExpand}
                    className="p-0.5 hover:bg-surface-300 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <span className="w-5" />
                )}
                <span>{clientType.name}</span>
              </div>
              <span className="text-xs text-brand-500 ml-6">
                {clientCount} clientes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleTypeEditing}
                className={`p-1 rounded transition-colors cursor-pointer ${isTypeEditing ? "bg-brand-600 text-white" : "hover:bg-surface-200 text-brand-400"}`}
                title="Editar tipo de cliente"
              >
                <ClipboardPenLine className="w-3 h-3" />
              </button>
              <button
                onClick={() => setShowAddDialog(true)}
                className="p-1 hover:bg-surface-200 rounded transition-colors cursor-pointer"
                title="Agregar cliente"
              >
                <Plus className="w-3 h-3 text-brand-500" />
              </button>
            </div>
          </div>
        </td>
        <td className="p-2 text-center text-sm text-brand-900 border-l border-b border-gray-300">
          {isTypeEditing ? (
            <div className="relative flex items-center w-full">
              <input
                type="number"
                value={localPricePerColor}
                onChange={(e) => setLocalPricePerColor(e.target.value)}
                onBlur={() => {
                  const num = parseFloat(localPricePerColor);
                  if (!isNaN(num)) {
                    onStageClientTypeChange(clientType.id, {
                      pricePerColor: num,
                    });
                  } else {
                    setLocalPricePerColor(
                      String(
                        getDraftClientTypeValue(clientType.id)?.pricePerColor ??
                          clientType.pricePerColor,
                      ),
                    );
                  }
                }}
                className="w-full pl-1 pr-8 py-0.5 text-center text-sm border border-brand-500 rounded bg-white outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
              <span className="absolute right-1.5 text-xs text-brand-400 pointer-events-none">
                USD
              </span>
            </div>
          ) : (
            <>
              {getDraftClientTypeValue(clientType.id)?.pricePerColor ??
                clientType.pricePerColor}{" "}
              <span className="text-xs text-brand-400">USD</span>
            </>
          )}
        </td>
        <td className="p-2 text-center border-l border-b border-gray-300">
          <select
            value={
              getDraftClientTypeValue(clientType.id)?.priceLinkType ??
              clientType.priceLinkType
            }
            disabled={!isTypeEditing}
            onChange={(e) =>
              onStageClientTypeChange(clientType.id, {
                priceLinkType: e.target.value,
              })
            }
            className="text-xs rounded px-1 py-1 bg-transparent w-full truncate"
          >
            <option value="Por estructura">Por estructura</option>
            <option value="No vincular">No vincular</option>
          </select>
        </td>
        {headerMargin ? (
          <>
            {VOLUME_FIELDS.map((field: VolumeField) => (
              <MarginCell
                key={field}
                value={
                  getDraftMarginValue(clientType.id, headerMargin.id, field) ??
                  headerMargin[field]
                }
                onUpdate={(v) => handleHeaderUpdate(field, v)}
                isEditing={isTypeEditing}
              />
            ))}
          </>
        ) : (
          <td
            colSpan={8}
            className="p-4 text-center text-brand-400 italic font-normal text-sm border-l border-b border-gray-300"
          >
            Sin configuración
          </td>
        )}
      </tr>
      {clientCount > 0 &&
        isExpanded &&
        clients.map((client) => (
          <ClientRow
            key={client.id}
            client={client}
            headerMargin={headerMargin}
            onStageMarginChange={onStageMarginChange}
            onStagePriceLinkChange={onStagePriceLinkChange}
            onStagePricePerColorChange={onStagePricePerColorChange}
            onStageNewOverride={onStageNewOverride}
            getDraftMarginValue={getDraftMarginValue}
            getDraftPriceLinkType={getDraftPriceLinkType}
            getDraftPricePerColor={getDraftPricePerColor}
          />
        ))}
      {showAddDialog && (
        <AddClientDialog
          clientTypeName={clientType.name}
          onConfirm={handleAddClient}
          onCancel={() => setShowAddDialog(false)}
        />
      )}
    </>
  );
}
