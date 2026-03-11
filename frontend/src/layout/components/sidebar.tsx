import { ReactNode } from 'react';

export function Sidebar({ children }: { children: ReactNode }) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-surface-200 bg-white flex flex-col h-full">
      <div className="h-16 flex items-center justify-between px-6 border-b border-surface-200">
        <div className="flex items-center gap-2 font-bold text-lg text-brand-900 tracking-tight">
          <div className="w-6 h-6 rounded bg-brand-900 text-white flex items-center justify-center text-xs">
            L
          </div>
          Laiktech
        </div>
      </div>
      {children}
    </aside>
  );
}
