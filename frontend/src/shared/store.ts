import { create } from 'zustand';

interface PlantStore {
  selectedPlantId: string | null;
  setPlantId: (id: string) => void;
}

export const usePlantStore = create<PlantStore>((set) => ({
  selectedPlantId: null,
  setPlantId: (id) => set({ selectedPlantId: id }),
}));
