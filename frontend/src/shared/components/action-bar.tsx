interface ActionBarProps {
  hasPendingChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export function ActionBar({
  hasPendingChanges,
  isSaving,
  onSave,
  onDiscard,
}: ActionBarProps) {
  return (
    <div className="flex justify-end gap-3 shrink-0">
      <button
        onClick={onDiscard}
        disabled={!hasPendingChanges}
        className="px-4 py-2 text-sm font-medium text-brand-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Descartar cambios
      </button>
      <button
        onClick={onSave}
        disabled={isSaving || !hasPendingChanges}
        className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        {isSaving ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
}
