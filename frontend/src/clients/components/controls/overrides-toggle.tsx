interface OverridesToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function OverridesToggle({ checked, onChange }: OverridesToggleProps) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <span className="text-sm text-brand-600 font-medium whitespace-nowrap">
        Ver solo empresas con datos sobre-escritos
      </span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? "bg-brand-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-4.5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
