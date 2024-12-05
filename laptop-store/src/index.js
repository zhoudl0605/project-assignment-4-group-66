import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import './index.css';


const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
