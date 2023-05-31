import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import client from "../utils/graphql";

const GET_HYPERCERT_BALANCE = `
  query GetHypercertBalance($wallet: ID!) {
    account(id: $wallet) {
        ERC1155balances {
          token {
            identifier
            balances(where: {account: $wallet}) {
              valueExact
            }
          }
        }
      }
  }
`;

export async function fetchHypercertBalance(wallet: string) {
  try {
    const { data } = await client.query({
      query: gql(GET_HYPERCERT_BALANCE),
      variables: { wallet },
    });

    // Process the retrieved data
    return data;
  } catch (error) {
    // Handle any errors that occurred during the request
    console.error("Error fetching Hypercert balance:", error);
    throw error;
  }
}
