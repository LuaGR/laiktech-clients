import {
  Building2,
  Calculator,
  CircleDollarSign,
  Factory,
  PackageCheck,
  PackageOpen,
  Settings,
  TrendingUp,
  Users
} from 'lucide-react';
import { PlantContainer } from '@plant/plant-container';
import { Sidebar } from './components/sidebar';
import { SidebarItem } from './components/sidebar-item';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-surface-50 overflow-hidden">
      <Sidebar>
        <div className="p-4 border-b border-surface-200 bg-brand-50/30">
          <div className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2 px-1">Planta Activa</div>
          <PlantContainer />
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <SidebarItem icon={Calculator} label="Precios Base" isDisabled />
          <SidebarItem icon={Factory} label="Waste" isDisabled />
          <SidebarItem icon={Building2} label="Costos indirectos" />
          <SidebarItem icon={Users} label="Clientes" isActive />
          <SidebarItem icon={CircleDollarSign} label="Comisiones" isDisabled />
          <SidebarItem icon={TrendingUp} label="Tipos de cambio" isDisabled />
          <SidebarItem icon={Settings} label="Tasa financiera anual" isDisabled />
          <SidebarItem icon={PackageCheck} label="Logística" isDisabled />
          <SidebarItem icon={PackageOpen} label="Embalaje especial" isDisabled />
        </nav>
      </Sidebar>

      <main className="flex-1 flex flex-col h-full min-w-0 bg-surface-50">
        {children}
      </main>
    </div>
  );
}
