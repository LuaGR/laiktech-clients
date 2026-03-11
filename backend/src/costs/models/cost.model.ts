export interface IndirectCost {
  id: string;
  plantId: string;
  name: string;
  amount: number;
}

export interface CreateCostInput {
  plantId: string;
  name: string;
  amount: number;
}

export interface UpdateCostInput {
  id: string;
  amount: number;
}
