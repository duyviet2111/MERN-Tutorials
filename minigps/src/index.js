import React from "react";
import 'typeface-roboto';
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material';
import store from './store';
import { LocalizationProvider } from './common/components/LocalizationProvider';
import ErrorHandler from './common/components/ErrorHandler';
import theme from './common/theme';
import Navigation from './Navigation';
import preloadImages from './map/core/preloadImages';
import ServerProvider from './ServerProvider';

preloadImages();
const base = window.location.href.indexOf('modern') >= 0 ? '/modern' : '/';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
      <LocalizationProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ServerProvider>
              <BrowserRouter basename={base}>
                <Navigation />
              </BrowserRouter>
            </ServerProvider>
            <ErrorHandler />
          </ThemeProvider>
        </StyledEngineProvider>
      </LocalizationProvider>
    </Provider>
);

