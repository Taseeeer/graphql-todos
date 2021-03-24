import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import {ApolloProvider, gql} from "@apollo/client";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// const client = new ApolloClient({
//   uri: "https://suitable-anteater-16.hasura.app/v1/graphql",
// });
// client.query({
//   query: gql`
//     query getTodos {
//       todos {
//         done
//         id
//         text
//       }
//     }
//   `
// }).then(data => console.log(data));

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "https://suitable-anteater-16.hasura.app/v1/graphql", 
    headers: {
      'x-hasura-admin-secret': `65pQcKVpTcpCOnDy32irRZUd7QtOVaj0BwgvTue10BH6N0BsGsI6CCmMwNUJ673i`
   }
  }),
});

client.query({
  query: gql`
  query getTodos {
          todos {
            done
            id
            text
          }
        }
  `,
}).then(data =>  console.log(data));

ReactDOM.render(
  <React.StrictMode>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
