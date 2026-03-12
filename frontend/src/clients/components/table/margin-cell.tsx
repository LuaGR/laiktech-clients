import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface MarginCellProps {
  value: number;
  onUpdate: (val: number) => void;
  isEditing?: boolean;
  isDisabled?: boolean;
}

interface TooltipPosition {
  top: number;
  left: number;
}

export function MarginCell({
  value,
  onUpdate,
  isEditing = false,
  isDisabled,
}: MarginCellProps) {
  const [isCellEditing, setIsCellEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());
  const [tooltipPosition, setTooltipPosition] =
    useState<TooltipPosition | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

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

  const handleMouseEnter = () => {
    if (!isLowMargin || !cellRef.current) return;
    const rect = cellRef.current.getBoundingClientRect();
    setTooltipPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.right + window.scrollX,
    });
  };

  const handleMouseLeave = () => {
    setTooltipPosition(null);
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
          ref={cellRef}
          className={`flex items-center justify-center gap-0.5 rounded px-1 py-0.5 ${isEditing && !isDisabled ? "cursor-pointer hover:bg-surface-100" : ""} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleCellClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
      {isLowMargin &&
        tooltipPosition !== null &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              transform: "translateX(-100%)",
            }}
            className="z-50 px-3 py-1.5 bg-white border border-red-200 rounded-md shadow-lg text-xs text-red-600 whitespace-nowrap pointer-events-none"
          >
            <div className="absolute bottom-full right-9 w-2 h-2 bg-white border-l border-t border-red-200 rotate-45 translate-y-1" />
            El número no puede ser menor a 5%
          </div>,
          document.body,
        )}
    </td>
  );
}
