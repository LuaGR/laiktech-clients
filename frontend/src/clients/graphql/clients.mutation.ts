import { gql } from "@apollo/client";

export const UPDATE_CLIENT_TYPE = gql`
  mutation UpdateClientType($id: ID!, $input: UpdateClientTypeHeaderInput!) {
    updateClientType(id: $id, input: $input) {
      id
      name
      pricePerColor
      priceLinkType
    }
  }
`;

export const UPDATE_MARGIN = gql`
  mutation UpdateMargin($input: UpdateMarginInput!) {
    updateMargin(input: $input) {
      id
      vol300
      vol500
      vol1T
      vol3T
      vol5T
      vol10T
      vol20T
      vol30T
      isOverride
    }
  }
`;

export const UPDATE_CLIENT_TYPE_MARGINS = gql`
  mutation UpdateClientTypeMargins(
    $clientTypeId: ID!
    $plantId: ID!
    $input: UpdateMarginInput!
  ) {
    updateClientTypeMargins(
      clientTypeId: $clientTypeId
      plantId: $plantId
      input: $input
    ) {
      id
      isOverride
      vol300
      vol500
      vol1T
      vol3T
      vol5T
      vol10T
      vol20T
      vol30T
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      id
      name
      clientTypeId
      pricePerColor
      priceLinkType
      marginConfigs {
        id
        plantId
        vol300
        vol500
        vol1T
        vol3T
        vol5T
        vol10T
        vol20T
        vol30T
        isOverride
      }
    }
  }
`;

export const CREATE_MARGIN_OVERRIDE = gql`
  mutation CreateMarginOverride($input: CreateMarginOverrideInput!) {
    createMarginOverride(input: $input) {
      id
      plantId
      clientId
      vol300
      vol500
      vol1T
      vol3T
      vol5T
      vol10T
      vol20T
      vol30T
      isOverride
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $input: UpdateClientInput!) {
    updateClient(id: $id, input: $input) {
      id
      name
      clientTypeId
      pricePerColor
      priceLinkType
    }
  }
`;

export const RESET_CLIENT_OVERRIDE = gql`
  mutation ResetClientOverride($marginConfigId: ID!) {
    resetClientOverride(marginConfigId: $marginConfigId) {
      id
      isOverride
      vol300
      vol500
      vol1T
      vol3T
      vol5T
      vol10T
      vol20T
      vol30T
    }
  }
`;
