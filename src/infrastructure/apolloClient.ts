/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const uploadLink = createUploadLink({
  uri: 'http://localhost:3030/graphql',
  credentials: 'include',
});

const authLink = setContext((_, { headers }: any) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }: any) => {
      if (extensions?.code === 'UNAUTHENTICATED') {
        console.warn('Unauthorized! Login failed.');
        throw new Error('Invalid credentials. Please try again.');
      } else {
        throw new Error(message);
      }
    });
  }

  if (networkError) {
    throw new Error(`[Network error]: ${networkError.message}`);
  }
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        listings: {
          keyArgs: false,
          merge(existing = [], incoming: any) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, uploadLink]),
  cache,
  connectToDevTools: true,
});

export default apolloClient;
