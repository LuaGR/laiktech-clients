import { gql } from "@apollo/client";

export const GET_INDIRECT_COSTS_BY_PLANT = gql`
  query GetIndirectCostsByPlant($plantId: ID!) {
    indirectCostsByPlant(plantId: $plantId) {
      id
      plantId
      name
      amount
    }
  }
`;
