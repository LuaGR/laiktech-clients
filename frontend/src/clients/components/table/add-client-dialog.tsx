import { useState } from "react";
import { X } from "lucide-react";

interface AddClientDialogProps {
  clientTypeName: string;
  onConfirm: (name: string, pricePerColor: number) => Promise<void>;
  onCancel: () => void;
}

export function AddClientDialog({
  clientTypeName,
  onConfirm,
  onCancel,
}: AddClientDialogProps) {
  const [name, setName] = useState("");
  const [pricePerColorInput, setPricePerColorInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("El nombre es obligatorio");
      return;
    }
    const parsedPrice = parseFloat(pricePerColorInput);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("El precio debe ser un número mayor o igual a 0");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await onConfirm(trimmed, parsedPrice);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear cliente");
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <tr>
      <td colSpan={11}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200">
              <h3 className="text-sm font-semibold text-brand-900">
                Agregar cliente a {clientTypeName}
              </h3>
              <button
                onClick={onCancel}
                className="p-1 hover:bg-surface-100 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-brand-400" />
              </button>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-brand-600">
                  Nombre del cliente
                </label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ej: ACME CORP"
                  className="w-full px-3 py-2 text-sm border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-brand-900 placeholder:text-brand-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-brand-600">
                  Clase x color (USD)
                </label>
                <input
                  type="number"
                  value={pricePerColorInput}
                  onChange={(e) => setPricePerColorInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ej: 250"
                  className="w-full px-3 py-2 text-sm border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-brand-900 placeholder:text-brand-300 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
              </div>
              {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-surface-200">
              <button
                onClick={onCancel}
                className="px-3 py-1.5 text-xs font-medium text-brand-700 bg-white border border-surface-300 rounded-md hover:bg-surface-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-3 py-1.5 text-xs font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Creando..." : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
