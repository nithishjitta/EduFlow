import { ColorModeScript, ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux/store';

const theme = extendTheme({
  fonts: {
    heading: `'Syne', sans-serif`,
    body: `'DM Sans', sans-serif`,
  },
  colors: {
    brand: {
      50: '#fff3ef',
      100: '#ffd9ce',
      200: '#ffb8a3',
      300: '#ff8f74',
      400: '#ff7055',
      500: '#ff5f3a',
      600: '#e04a27',
      700: '#c03618',
      800: '#9a260e',
      900: '#741807',
    },
    violet: {
      50: '#f0eeff',
      100: '#d5cfff',
      200: '#b5aaff',
      300: '#9080ff',
      400: '#8066ff',
      500: '#7c5cfc',
      600: '#6344e0',
      700: '#4c2ec4',
      800: '#371ba0',
      900: '#240e7a',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#f7f7f9',
        color: '#0a0a0f',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: `'Syne', sans-serif`,
        fontWeight: '600',
        borderRadius: '10px',
        letterSpacing: '0.02em',
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: `'Syne', sans-serif`,
        letterSpacing: '-0.02em',
      },
    },
  },
});

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <ReduxProvider store={store}>
    <ChakraProvider theme={theme}>
      <ColorModeScript />
      <App />
    </ChakraProvider>
  </ReduxProvider>
);