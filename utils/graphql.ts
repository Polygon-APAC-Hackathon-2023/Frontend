import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://indexooooor-9760.gke-singapore.settlemint.com/subgraphs/name/reignite-9b6d",
  cache: new InMemoryCache(),
  headers: {
    "x-auth-token": "bpaas-1243117E4eF3d8f636a5196571edD086A44fced3",
  },
});

export default client;
