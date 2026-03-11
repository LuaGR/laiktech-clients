import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { GET_PLANTS } from './graphql/plant.query';
import { PlantSelector, Plant } from './components/plant-selector';
import { usePlantStore } from '@shared/store';

interface GetPlantsResponse {
  plants: Plant[];
}

export function PlantContainer() {
  const { data, loading, error } = useQuery<GetPlantsResponse>(GET_PLANTS);
  const { selectedPlantId, setPlantId } = usePlantStore(
    useShallow((state) => ({ 
      selectedPlantId: state.selectedPlantId, 
      setPlantId: state.setPlantId 
    }))
  );

  useEffect(() => {
    if (data?.plants?.length && !selectedPlantId) {
      setPlantId(data.plants[0].id);
    }
  }, [data, selectedPlantId, setPlantId]);

  return (
    <PlantSelector
      plants={data?.plants || []}
      selectedPlantId={selectedPlantId}
      onSelectPlant={setPlantId}
      isLoading={loading}
      error={error?.message}
    />
  );
}
