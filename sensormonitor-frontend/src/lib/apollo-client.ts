import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

// HTTP link for queries and mutations
const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:8080/graphql',
  retryAttempts: Infinity, // retry indefinitely
  lazy: true, // connect on first subscription
  keepAlive: 10000, // send ping every 10 seconds
  on: {
    connected: () => console.log('WebSocket connected'),
    closed: (event) => console.log('WebSocket closed', event),
    error: (error) => console.error('WebSocket error', error),
  }
}));

// Split link to route requests based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});