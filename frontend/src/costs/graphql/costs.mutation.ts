import { gql } from "@apollo/client";

export const CREATE_INDIRECT_COST = gql`
  mutation CreateIndirectCost($input: CreateCostInput!) {
    createIndirectCost(input: $input) {
      id
      plantId
      name
      amount
    }
  }
`;

export const UPDATE_INDIRECT_COST = gql`
  mutation UpdateIndirectCost($input: UpdateCostInput!) {
    updateIndirectCost(input: $input) {
      id
      plantId
      name
      amount
    }
  }
`;

export const DELETE_INDIRECT_COST = gql`
  mutation DeleteIndirectCost($id: ID!) {
    deleteIndirectCost(id: $id) {
      id
    }
  }
`;
