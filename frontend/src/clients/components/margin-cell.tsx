import { useState, useEffect, useRef } from "react";

interface MarginCellProps {
  value: number;
  onUpdate: (val: number) => void;
  isEditing?: boolean;
  isDisabled?: boolean;
}

export function MarginCell({
  value,
  onUpdate,
  isEditing = false,
  isDisabled,
}: MarginCellProps) {
  const [isCellEditing, setIsCellEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  useEffect(() => {
    if (isCellEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isCellEditing]);

  useEffect(() => {
    if (!isEditing) {
      setIsCellEditing(false);
      setLocalValue(value.toString());
    }
  }, [isEditing, value]);

  const handleBlur = () => {
    setIsCellEditing(false);
    const num = parseFloat(localValue);
    if (!isNaN(num) && num !== value) {
      onUpdate(num);
    } else {
      setLocalValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === "Escape") {
      setLocalValue(value.toString());
      setIsCellEditing(false);
    }
  };

  const handleCellClick = () => {
    if (isEditing && !isDisabled) {
      setIsCellEditing(true);
    }
  };

  const isLowMargin = value <= 5 && value > 0;

  return (
    <td
      className={`px-2 py-2.5 text-center border-l border-b border-gray-300 relative ${isLowMargin ? "bg-red-50" : ""}`}
    >
      {isCellEditing ? (
        <input
          ref={inputRef}
          type="number"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          className="w-full px-1 py-0.5 text-center text-sm border border-brand-500 rounded bg-white outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
        />
      ) : (
        <div
          className={`flex items-center justify-center gap-0.5 rounded px-1 py-0.5 ${isEditing && !isDisabled ? "cursor-pointer hover:bg-surface-100" : ""} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleCellClick}
          onMouseEnter={() => isLowMargin && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <span
            className={`text-sm ${isLowMargin ? "text-red-600 font-medium" : "text-brand-700"}`}
          >
            {value}
          </span>
          <span
            className={`text-xs ${isLowMargin ? "text-red-400" : "text-brand-400"}`}
          >
            %
          </span>
        </div>
      )}
      {isLowMargin && showTooltip && (
        <div className="absolute z-50 bottom-full right-0 mb-2 px-3 py-1.5 bg-white border border-red-200 rounded-md shadow-lg text-xs text-red-600 whitespace-nowrap">
          El número no puede ser menor a 5%
          <div className="absolute top-full right-4 w-2 h-2 bg-white border-r border-b border-red-200 rotate-45 -mt-1" />
        </div>
      )}
    </td>
  );
}
