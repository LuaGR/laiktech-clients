import { useState } from "react";
import type { Client, MarginConfig } from "@clients/models/clients.model";
import { VOLUME_FIELDS } from "@clients/models/clients.model";
import { MarginCell } from "./margin-cell";
import { ClipboardPenLine } from "lucide-react";

interface ClientRowProps {
  client: Client;
  headerMargin: MarginConfig | null;
  onStageMarginChange: (
    marginConfigId: string,
    clientId: string,
    field: string,
    value: number,
  ) => void;
  onStagePriceLinkChange: (clientId: string, priceLinkType: string) => void;
  onStagePricePerColorChange: (clientId: string, pricePerColor: number) => void;
  onStageNewOverride: (clientId: string, field: string, value: number) => void;
  getDraftMarginValue: (
    clientId: string,
    marginConfigId: string | undefined,
    field: string,
  ) => number | undefined;
  getDraftPriceLinkType: (clientId: string) => string | undefined;
  getDraftPricePerColor: (clientId: string) => number | undefined;
}

export function ClientRow({
  client,
  headerMargin,
  onStageMarginChange,
  onStagePriceLinkChange,
  onStagePricePerColorChange,
  onStageNewOverride,
  getDraftMarginValue,
  getDraftPriceLinkType,
  getDraftPricePerColor,
}: ClientRowProps) {
  const [isRowEditing, setIsRowEditing] = useState(false);
  const marginConfig = client.marginConfigs?.[0];
  const effectiveMargin = marginConfig ?? headerMargin;

  const displayedPriceLinkType =
    getDraftPriceLinkType(client.id) ?? client.priceLinkType;

  const displayedPricePerColor =
    getDraftPricePerColor(client.id) ?? client.pricePerColor;

  const getDisplayedMarginValue = (field: string): number => {
    const draftValue = getDraftMarginValue(client.id, marginConfig?.id, field);
    if (draftValue !== undefined) return draftValue;
    return effectiveMargin
      ? (effectiveMargin[field as keyof typeof effectiveMargin] as number)
      : 0;
  };

  const handleMarginUpdate = (field: string, value: number) => {
    if (marginConfig) {
      onStageMarginChange(marginConfig.id, client.id, field, value);
      return;
    }
    onStageNewOverride(client.id, field, value);
  };

  const handlePriceLinkChange = (newValue: string) => {
    onStagePriceLinkChange(client.id, newValue);
  };

  const handlePricePerColorChange = (newValue: number) => {
    onStagePricePerColorChange(client.id, newValue);
  };

  return (
    <tr className="hover:bg-surface-50 transition-colors bg-white">
      <td className="p-3 font-medium text-brand-900 pl-8 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <span>{client.name}</span>
          <button
            onClick={() => setIsRowEditing((prev) => !prev)}
            className={`p-1 rounded transition-colors cursor-pointer ${isRowEditing ? "bg-brand-600 text-white" : "hover:bg-surface-100 text-brand-400"}`}
            title="Editar cliente"
          >
            <ClipboardPenLine className="w-3 h-3" />
          </button>
        </div>
      </td>
      <td className="p-2 text-center text-sm text-brand-700 border-l border-b border-gray-300">
        {isRowEditing ? (
          <div className="relative flex items-center w-full">
            <input
              type="number"
              value={displayedPricePerColor}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                if (!isNaN(num)) handlePricePerColorChange(num);
              }}
              className="w-full pl-1 pr-8 py-0.5 text-center text-sm border border-brand-500 rounded bg-white outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
            <span className="absolute right-1.5 text-xs text-brand-400 pointer-events-none">
              USD
            </span>
          </div>
        ) : (
          <>
            {displayedPricePerColor}{" "}
            <span className="text-xs text-brand-400">USD</span>
          </>
        )}
      </td>
      <td className="p-2 text-center border-l border-b border-gray-300">
        <select
          value={displayedPriceLinkType}
          disabled={!isRowEditing}
          onChange={(e) => handlePriceLinkChange(e.target.value)}
          className="text-xs rounded px-1 py-1 bg-transparent w-full truncate"
        >
          <option value="Por estructura">Por estructura</option>
          <option value="No vincular">No vincular</option>
        </select>
      </td>
      {effectiveMargin
        ? VOLUME_FIELDS.map((field) => (
            <MarginCell
              key={field}
              value={getDisplayedMarginValue(field)}
              onUpdate={(v) => handleMarginUpdate(field, v)}
              isEditing={isRowEditing}
            />
          ))
        : VOLUME_FIELDS.map((field) => (
            <td
              key={field}
              className="p-2 text-center text-sm text-brand-300 border-l border-b border-gray-300"
            >
              —
            </td>
          ))}
    </tr>
  );
}
