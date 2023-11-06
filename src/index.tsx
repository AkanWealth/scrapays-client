import { ColorModeScript } from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import { Auth0Provider } from '@auth0/auth0-react';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <ChakraProvider>
      <Auth0Provider
        domain="dev-p7l7thbjct0j8yd4.us.auth0.com"
        clientId="nGRNKr7AFy3woR1u2d2hvRSjuVvjMW5S"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "this is Scrapays api identifier",
          scope:"openid profile email"
        }}
      >
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </Auth0Provider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
