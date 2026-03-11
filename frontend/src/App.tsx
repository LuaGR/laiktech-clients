import { AppLayout } from './layout/app-layout';

export function App() {
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col p-8">
        <h1 className="text-2xl font-semibold text-brand-900 mb-6">Configuración de Clientes</h1>
        <div className="flex-1 bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden flex items-center justify-center text-brand-400">
          Tabla de Clientes
        </div>
      </div>
    </AppLayout>
  );
}
