import { ChevronDown, MapPin } from 'lucide-react';

export interface Plant {
  id: string;
  name: string;
}

interface PlantSelectorProps {
  plants: Plant[];
  selectedPlantId: string | null;
  onSelectPlant: (id: string) => void;
  isLoading: boolean;
  error?: string;
}

export function PlantSelector({ plants, selectedPlantId, onSelectPlant, isLoading, error }: PlantSelectorProps) {
  if (error) {
    return <div className="text-sm text-red-500 p-2 border border-red-200 bg-red-50 rounded-md">Error al cargar plantas</div>;
  }

  return (
    <div className="relative group min-w-[200px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-400">
        <MapPin className="h-4 w-4" />
      </div>
      <select
        value={selectedPlantId || ''}
        onChange={(e) => onSelectPlant(e.target.value)}
        disabled={isLoading}
        className={`block w-full pl-10 pr-10 py-2 text-sm font-medium border-0 rounded-md 
          bg-white shadow-sm ring-1 ring-inset ring-brand-200 
          focus:ring-2 focus:ring-inset focus:ring-brand-500 
          text-brand-900 transition-all cursor-pointer appearance-none
          ${isLoading ? 'opacity-50' : 'hover:bg-brand-50'}
        `}
      >
        <option value="" disabled>Seleccione una planta...</option>
        {plants.map((plant) => (
          <option key={plant.id} value={plant.id}>
            {plant.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-brand-400 group-hover:text-brand-600">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}
