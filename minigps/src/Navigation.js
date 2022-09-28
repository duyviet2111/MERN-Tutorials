import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LinearProgress } from "@mui/material";
import MainPage from "./main/MainPage";
import LoginPage from "./login/LoginPage";
import RegisterPage from "./login/RegisterPage";
import ResetPasswordPage from "./login/ResetPasswordPage";
import { useEffectAsync } from "./reactHelper";
import { devicesActions } from "./store";
import useQuery from "./common/util/useQuery";
import App from "./App";
import NotificationsPage from "./settings/NotificationsPage";
import PreferencesPage from "./settings/PreferencesPage";
import UserPage from "./settings/UserPage";
import DevicePage from "./settings/DevicePage";
import UsersPage from "./settings/UsersPage";
import CalendarsPage from "./settings/CalendarsPage";
import CalendarPage from "./settings/CalendarPage";
import ChartReportPage from "./reports/ChartReportPage";
import EventReportPage from "./reports/EventReportPage";
import RouteReportPage from "./reports/RouteReportPage";
import StatisticsPage from "./reports/StatisticsPage";
import StopReportPage from "./reports/StopReportPage";
import SummaryReportPage from "./reports/SummaryReportPage";
import TripReportPage from "./reports/TripReportPage";
import ReplayPage from "./others/ReplayPage";
import GroupsPage from "./settings/GroupsPage";
import GroupPage from "./settings/GroupPage";
import ServerPage from "./settings/ServerPage";
import NotificationPage from "./settings/NotificationPage";
import GeofencesPage from "./others/GeofencesPage";
import PositionPage from "./others/PositionPage";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query = useQuery();

  const [redirectsHandled, setRedirectsHandled] = useState(false);

  useEffectAsync(async () => {
    if (query.get("token")) {
      const token = query.get("token");
      await fetch(
        `/api/session?token=${encodeURIComponent(
          token
        )}`
      );
      navigate("/");
    } else if (query.get("deviceId")) {
      const deviceId = query.get("deviceId");
      const response = await fetch(
        `/api/devices?uniqueId=${deviceId}`
      );
      if (response.ok) {
        const items = await response.json();
        if (items.length > 0) {
          dispatch(devicesActions.select(items[0].id));
        }
      } else {
        throw Error(await response.text());
      }
      navigate("/");
    }
     else if (query.get('eventId')) {
      const eventId = parseInt(query.get('eventId'), 10);
      navigate(`/event/${eventId}`);
    }
    else {
      setRedirectsHandled(true);
    }
  }, [query]);
  if (!redirectsHandled) {
    return <LinearProgress />;
  }
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/" element={<App />}>
        <Route index element={<MainPage />} />

        <Route path="position/:id" element={<PositionPage />} />
        {/* <Route path="network/:positionId" element={<NetworkPage />} />
        <Route path="event/:id" element={<EventPage />} /> */}
        <Route path="replay" element={<ReplayPage />} />
        <Route path="geofences" element={<GeofencesPage />} />

        <Route path="settings">
        {/* <Route path="accumulators/:deviceId" element={<AccumulatorsPage />} /> */}
          <Route path="calendars" element={<CalendarsPage />} />
          <Route path="calendar/:id" element={<CalendarPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          {/* <Route path="attributes" element={<ComputedAttributesPage />} /> */}
          {/* <Route path="attribute/:id" element={<ComputedAttributePage />} /> */}
          {/* <Route path="attribute" element={<ComputedAttributePage />} /> */}
          <Route path="device/:id" element={<DevicePage />} />
          <Route path="device" element={<DevicePage />} />
          {/* <Route path="drivers" element={<DriversPage />} /> */}
          {/* <Route path="driver/:id" element={<DriverPage />} /> */}
          {/* <Route path="driver" element={<DriverPage />} /> */}
          {/* <Route path="geofence/:id" element={<GeofencePage />} /> */}
          {/* <Route path="geofence" element={<GeofencePage />} /> */}
          <Route path="groups" element={<GroupsPage />} />
          <Route path="group/:id" element={<GroupPage />} />
          <Route path="group" element={<GroupPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="notification/:id" element={<NotificationPage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="preferences" element={<PreferencesPage />} />
          <Route path="server" element={<ServerPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="user/:id" element={<UserPage />} />
          <Route path="user" element={<UserPage />} />
        </Route>

        <Route path="reports">
          <Route path="chart" element={<ChartReportPage />} />
          <Route path="event" element={<EventReportPage />} />
          <Route path="route" element={<RouteReportPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="stop" element={<StopReportPage />} />
          <Route path="summary" element={<SummaryReportPage />} />
          <Route path="trip" element={<TripReportPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Navigation;
