import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://scrapays.onrender.com/graphql',
  cache: new InMemoryCache(),
});

export { client };
