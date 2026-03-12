import { AppLayout } from "@layout/app-layout";
import { ClientsContainer } from "@clients/clients-container";

export function App() {
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col p-8 h-full min-h-0">
        <ClientsContainer />
      </div>
    </AppLayout>
  );
}
