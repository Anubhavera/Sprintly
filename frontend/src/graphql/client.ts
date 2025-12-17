import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: '/graphql/',
  credentials: 'include',
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        projects: {
          merge(_existing: unknown, incoming: unknown) {
            return incoming;
          },
        },
        tasks: {
          merge(_existing: unknown, incoming: unknown) {
            return incoming;
          },
        },
        taskComments: {
          merge(_existing: unknown, incoming: unknown) {
            return incoming;
          },
        },
      },
    },
    Project: {
      fields: {
        tasks: {
          merge(_existing: unknown, incoming: unknown) {
            return incoming;
          },
        },
      },
    },
    Task: {
      fields: {
        comments: {
          merge(_existing: unknown, incoming: unknown) {
            return incoming;
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
