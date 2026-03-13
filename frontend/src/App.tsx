import { useState } from "react";
import { AppLayout } from "@layout/app-layout";
import { ClientsContainer } from "@clients/clients-container";
import { CostsContainer } from "@costs/costs-container";
import type { ActiveView } from "@layout/app-layout";

export function App() {
  const [activeView, setActiveView] = useState<ActiveView>("clientes");

  return (
    <AppLayout activeView={activeView} onNavigate={setActiveView}>
      <div className="flex-1 flex flex-col p-8 h-full min-h-0">
        {activeView === "clientes" && <ClientsContainer />}
        {activeView === "costos" && <CostsContainer />}
      </div>
    </AppLayout>
  );
}
