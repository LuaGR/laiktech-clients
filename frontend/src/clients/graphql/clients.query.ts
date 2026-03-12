import { gql } from "@apollo/client";

export const GET_CLIENT_TYPES_BY_PLANT = gql`
  query GetClientTypesByPlant($plantId: ID!) {
    clientTypesByPlant(plantId: $plantId) {
      id
      name
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
      clients {
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
  }
`;
