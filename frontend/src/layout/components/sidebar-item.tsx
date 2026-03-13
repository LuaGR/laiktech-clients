import { ElementType } from 'react';

export interface SidebarItemProps {
  icon: ElementType;
  label: string;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ icon: Icon, label, isActive, isDisabled, onClick }: SidebarItemProps) {
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${isDisabled
        ? 'opacity-40 cursor-not-allowed text-brand-400'
        : isActive
          ? 'bg-brand-50 text-brand-900 shadow-sm cursor-pointer'
          : 'text-brand-600 hover:bg-brand-50/50 hover:text-brand-900 cursor-pointer'
        }`}
    >
      <Icon className="w-5 h-5 opacity-70" />
      {label}
    </button>
  );
}
