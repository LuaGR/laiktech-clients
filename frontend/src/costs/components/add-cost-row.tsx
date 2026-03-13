import { useState } from "react";
import { parseCostAmount } from "@costs/services/costs.service";
import { Check, X } from "lucide-react";

interface AddCostRowProps {
  onConfirm: (name: string, amount: number) => Promise<void>;
  onCancel: () => void;
}

export function AddCostRow({ onConfirm, onCancel }: AddCostRowProps) {
  const [name, setName] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("El nombre es obligatorio");
      return;
    }
    const parsed = parseCostAmount(amountInput);
    if (parsed === null) {
      setError("El monto debe ser un número mayor o igual a 0");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await onConfirm(trimmedName, parsed);
    } catch {
      setError("Error al crear el costo");
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onCancel();
  };

  return (
    <tr className="bg-brand-50">
      <td className="px-4 py-2 border-b border-gray-300">
        <div className="flex flex-col gap-1">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nombre del costo (ej: Alquiler)"
            className="w-full px-2 py-1 text-sm border border-surface-300 rounded bg-white outline-none focus:border-brand-500 text-brand-900 placeholder:text-brand-300"
          />
          {error && (
            <span className="text-xs text-red-500">{error}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-2 border-b border-l border-gray-300">
        <div className="relative flex items-center justify-end">
          <input
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0"
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
      <td className="px-1 py-2 border-b border-gray-300 text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="p-1.5 rounded text-white bg-brand-600 hover:bg-brand-700 transition-colors disabled:opacity-50 cursor-pointer"
            title="Confirmar"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onCancel}
            className="p-1.5 rounded text-brand-400 hover:text-brand-700 hover:bg-surface-100 transition-colors cursor-pointer"
            title="Cancelar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
