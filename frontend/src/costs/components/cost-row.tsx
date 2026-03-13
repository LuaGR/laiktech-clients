import { useState } from "react";
import type { IndirectCost } from "@costs/models/costs.model";
import { parseCostAmount } from "@costs/services/costs.service";
import { Trash2 } from "lucide-react";

interface CostRowProps {
  cost: IndirectCost;
  draftAmount: number | undefined;
  onStageEdit: (costId: string, amount: number) => void;
  onDelete: (costId: string) => void;
}

export function CostRow({
  cost,
  draftAmount,
  onStageEdit,
  onDelete,
}: CostRowProps) {
  const displayedAmount = draftAmount ?? cost.amount;
  const [localValue, setLocalValue] = useState(String(displayedAmount));
  const isDirty = draftAmount !== undefined;

  const handleBlur = () => {
    const parsed = parseCostAmount(localValue);
    if (parsed === null) {
      setLocalValue(String(displayedAmount));
      return;
    }
    if (parsed !== cost.amount) {
      onStageEdit(cost.id, parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setLocalValue(String(cost.amount));
    }
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <tr className={`group transition-colors ${isDirty ? "bg-brand-50" : "bg-white hover:bg-surface-50"}`}>
      <td className="px-4 py-2.5 text-sm font-medium text-brand-900 border-b border-gray-300">
        {cost.name}
      </td>
      <td className="px-4 py-2.5 border-b border-l border-gray-300">
        <div className="relative flex items-center justify-end">
          <input
            type="number"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-28 pl-2 pr-12 py-1 text-sm text-right bg-transparent border-none outline-none
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
              [-moz-appearance:textfield]"
          />
          <span className="absolute right-3.5 text-xs text-brand-400 pointer-events-none">
            USD
          </span>
        </div>
      </td>
      <td className="px-1 py-2.5 border-b border-gray-300 text-center">
        <button
          onClick={() => onDelete(cost.id)}
          className="p-1 rounded text-brand-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          title="Eliminar costo"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}
