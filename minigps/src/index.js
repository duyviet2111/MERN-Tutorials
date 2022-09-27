import React from "react";
import 'typeface-roboto';
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material';
import store from './store';
import { LocalizationProvider } from './common/components/LocalizationProvider';
import ErrorHandler from './common/components/ErrorHandler';
import reportWebVitals from "./reportWebVitals";
import theme from './common/theme';
import Navigation from './Navigation';
// import preloadImages from './map/core/preloadImages';
import ServerProvider from './ServerProvider';
import MainPage from './main/MainPage'
import PreferencesPage from './settings/PreferencesPage'
import NotificationsPage from './settings/NotificationsPage'
import BottomMenu2 from './common/components/BottomMenu2'
import UserPage from './settings/UserPage'
import RegisterPage from './login/RegisterPage'
import ResetPasswordPage from './login/ResetPasswordPage'
import RouteReportPage from './reports/RouteReportPage'
import EventReportPage from './reports/EventReportPage'
import TripReportPage from "./reports/TripReportPage";
import StopReportPage from "./reports/StopReportPage";
import SummaryReportPage from "./reports/SummaryReportPage";
import ChartReportPage from "./reports/ChartReportPage";
import StatisticsPage from "./reports/StatisticsPage";
import LoginPage from "./login/LoginPage";
// import LoginPage from './login/LoginPage'


// preloadImages();
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
                {/* <MainPage /> */}
                {/* <LoginPage /> */}
                {/* <RegisterPage /> */}
                {/* <BottomMenu2 /> */}
                {/* <PreferencesPage /> */}
                {/* <NotificationsPage /> */}
                {/* <UserPage /> */}
                {/* <ResetPasswordPage /> */}
                {/* <RouteReportPage /> */}
                {/* <EventReportPage /> */}
                {/* <TripReportPage /> */}
                {/* <StopReportPage /> */}
                {/* <SummaryReportPage /> */}
                {/* <ChartReportPage /> */}
                {/* <StatisticsPage /> */}
              </BrowserRouter>
            </ServerProvider>
            <ErrorHandler />
          </ThemeProvider>
        </StyledEngineProvider>
      </LocalizationProvider>
    </Provider>
);
reportWebVitals();
