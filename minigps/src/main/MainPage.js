import React, { useState, useRef, useEffect, useCallback } from "react";
import moment from 'moment';
import MapView from "../map/core/MapView";
import MapCurrentLocation from "../map/MapCurrentLocation";
import "./MainPage.css";
import usePersistedState from "../common/util/usePersistedState";
import {
  Paper,
  Toolbar,
  IconButton,
  Button,
  OutlinedInput,
  InputAdornment,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Badge,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ListIcon from "@mui/icons-material/ViewList";
import { makeStyles } from "@mui/styles";
import TuneIcon from '@mui/icons-material/Tune';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DevicesList from './DevicesList';
import useFeatures from '../common/util/useFeatures';
import EventsDrawer from './EventsDrawer';
import StatusCard from './StatusCard';
import { useTranslation } from "../common/components/LocalizationProvider";
import BottomMenu from '../common/components/BottomMenu';
import { useNavigate } from 'react-router-dom';
import { useDeviceReadonly } from '../common/util/permissions';
import { useTheme } from '@mui/material/styles';
import MapPositions from '../map/MapPositions';
import MapDirection from '../map/MapDirection';
import MapOverlay from '../map/overlay/MapOverlay';
import MapGeocoder from '../map/geocoder/MapGeocoder';
import MapScale from '../map/MapScale';
import MapNotification from '../map/notification/MapNotification';
import MapSelectedDevice from '../map/main/MapSelectedDevice';
import MapAccuracy from '../map/main/MapAccuracy';
import MapGeofence from '../map/main/MapGeofence';
import MapLiveRoutes from '../map/main/MapLiveRoutes';
import MapDefaultCamera from '../map/main/MapDefaultCamera';
import PoiMap from '../map/main/PoiMap';
import { devicesActions } from '../store';

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 3,
    margin: theme.spacing(1.5),
    width: theme.dimensions.drawerWidthDesktop,
    bottom: theme.dimensions.bottomBarHeight,
    transition: "transform .5s ease",
    backgroundColor: "white",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      margin: 0,
    },
  },
  sidebarCollapsed: {
    transform: `translateX(-${theme.dimensions.drawerWidthDesktop})`,
    marginLeft: 0,
    [theme.breakpoints.down("md")]: {
      transform: "translateX(-100vw)",
    },
  },
  toolbarContainer: {
    zIndex: 4,
  },
  toolbar: {
    display: "flex",
    padding: theme.spacing(0, 1),
    "& > *": {
      margin: theme.spacing(0, 1),
    },
  },
  deviceList: {
    flex: 1,
  },
  statusCard: {
    position: "fixed",
    zIndex: 5,
    [theme.breakpoints.up("md")]: {
      left: `calc(50% + ${theme.dimensions.drawerWidthDesktop} / 2)`,
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.down("md")]: {
      left: "50%",
      bottom: `calc(${theme.spacing(3)} + ${
        theme.dimensions.bottomBarHeight
      }px)`,
    },
    transform: "translateX(-50%)",
  },
  sidebarToggle: {
    position: "fixed",
    left: theme.spacing(1.5),
    top: theme.spacing(3),
    borderRadius: "0px",
    minWidth: 0,
    [theme.breakpoints.down("md")]: {
      left: 0,
    },
  },
  sidebarToggleText: {
    marginLeft: theme.spacing(1),
    [theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },
  sidebarToggleBg: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  bottomMenu: {
    position: "fixed",
    left: theme.spacing(1.5),
    bottom: theme.spacing(1.5),
    zIndex: 4,
    width: theme.dimensions.drawerWidthDesktop,
  },
  filterPanel: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    width: theme.dimensions.drawerWidthTablet,
  },
}));

const MainPage = () => {
  const classes = useStyles();
  const t = useTranslation();
  const filterRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const theme = useTheme();

  const features = useFeatures();
  // const [mapOnSelect] = usePersistedState('mapOnSelect', false);

  const [mapGeofences] = usePersistedState('mapGeofences', true);
  const [mapLiveRoutes] = usePersistedState('mapLiveRoutes', false);

  const deviceReadonly = useDeviceReadonly();

  const positions = useSelector((state) => state.positions.items);
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [filterGroups, setFilterGroups] = useState([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [eventsOpen, setEventsOpen] = useState(false);

  const groups = useSelector((state) => state.groups.items);
  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  
  const selectedPosition = filteredPositions.find((position) => selectedDeviceId && position.deviceId === selectedDeviceId);
  const [filterSort, setFilterSort] = usePersistedState('filterSort', '');
  const [filterMap, setFilterMap] = usePersistedState('filterMap', false);
  
  const eventHandler = useCallback(() => setEventsOpen(true), [setEventsOpen]);
  const eventsAvailable = useSelector((state) => !!state.events.items.length);

  const handleClose = () => {
    setDevicesOpen(!devicesOpen);
  };

  const onClick = useCallback((_, deviceId) => {
    dispatch(devicesActions.select(deviceId));
  }, [dispatch]);
  

  useEffect(() => {
    const filtered = Object.values(devices)
    .filter((device) => !filterStatuses.length || filterStatuses.includes(device.status))
    .filter((device) => !filterGroups.length || filterGroups.includes(device.groupId))
    .filter((device) => `${device.name} ${device.uniqueId}`.toLowerCase().includes(filterKeyword.toLowerCase()));
    if (filterSort === 'lastUpdate') {
      filtered.sort((device1, device2) => {
        const time1 = device1.lastUpdate ? moment(device1.lastUpdate).valueOf() : 0;
        const time2 = device2.lastUpdate ? moment(device2.lastUpdate).valueOf() : 0;
        return time2 - time1;
      });
    }
    setFilteredDevices(filtered);
    setFilteredPositions(filterMap
      ? filtered.map((device) => positions[device.id]).filter(Boolean)
      : Object.values(positions));
    }, [devices, filterKeyword, filterStatuses, filterGroups, filterSort, filterMap]);

  return (
    <div className={classes.root}>
        <MapView>
        <MapOverlay />
        {mapGeofences && <MapGeofence />}
        <MapAccuracy />
        {mapLiveRoutes && <MapLiveRoutes />}
        <MapPositions positions={filteredPositions} onClick={onClick} showStatus />
        {selectedPosition && selectedPosition.course && (
          <MapDirection position={selectedPosition} />
        )}
        <MapDefaultCamera />
        <MapSelectedDevice />
        {/* <PoiMap /> */}
      </MapView>
      <MapScale />
      <MapCurrentLocation />
      <MapGeocoder />
      {!features.disableEvents && <MapNotification enabled={eventsAvailable} onClick={eventHandler} />}
      <Button
        variant="contained"
        // color={phone ? 'secondary' : 'primary'}
        classes={{ containedPrimary: classes.sidebarToggleBg }}
        className={classes.sidebarToggle}
        onClick={handleClose}
        disableElevation
      >
        <ListIcon />
        <div className={classes.sidebarToggleText}>{t('deviceTitle')}</div>
      </Button>
      <Paper
        square
        elevation={3}
        className={`${classes.sidebar} ${
          !devicesOpen && classes.sidebarCollapsed
        }`}
      >
        <Paper square elevation={3} className={classes.toolbarContainer}>
          <Toolbar className={classes.toolbar} disableGutters>
            <IconButton edge="start" sx={{ mr: 2 }} onClick={handleClose}>
              <ArrowBackIcon />
            </IconButton>
            <OutlinedInput
              ref={filterRef}
              placeholder={t('sharedSearchDevices')}
              value={filterKeyword}
              onChange={(event) => setFilterKeyword(event.target.value)}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setFilterAnchorEl(filterRef.current)}>
                    <Badge color="info" variant="dot" invisible={!filterStatuses.length && !filterGroups.length}>
                      <TuneIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                </InputAdornment>
              )}
              size="small"
              fullWidth
            />
            <Popover
              open={!!filterAnchorEl}
              anchorEl={filterAnchorEl}
              onClose={() => setFilterAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <div className={classes.filterPanel}>
                <FormControl>
                  <InputLabel>{t('deviceStatus')}</InputLabel>
                  <Select
                    label={t('deviceStatus')}
                    value={filterStatuses}
                    onChange={(e) => setFilterStatuses(e.target.value)}
                    multiple
                  >
                    <MenuItem value="online">{t('deviceStatusOnline')}</MenuItem>
                    <MenuItem value="offline">{t('deviceStatusOffline')}</MenuItem>
                    <MenuItem value="unknown">{t('deviceStatusUnknown')}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>{t('settingsGroups')}</InputLabel>
                  <Select
                    label={t('settingsGroups')}
                    value={filterGroups}
                    onChange={(e) => setFilterGroups(e.target.value)}
                    multiple
                  >
                    {Object.values(groups).map((group) => (<MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>))}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>{t('sharedSortBy')}</InputLabel>
                  <Select
                    label={t('sharedSortBy')}
                    value={filterSort}
                    onChange={(e) => setFilterSort(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">{'\u00a0'}</MenuItem>
                    <MenuItem value="lastUpdate">{t('deviceLastUpdate')}</MenuItem>
                  </Select>
                </FormControl>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={filterMap} onChange={(e) => setFilterMap(e.target.checked)} />}
                    label={t('sharedFilterMap')}
                  />
                </FormGroup>
              </div>
            </Popover>
            <IconButton
               onClick={() => navigate('/settings/device')} disabled={deviceReadonly}
               >
              <AddIcon />
            </IconButton>
            <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
          </Toolbar>
        </Paper>
        <div className={classes.deviceList}>
          <DevicesList devices={filteredDevices} />
        </div>
      </Paper>
      <div className={classes.bottomMenu}>
          <BottomMenu />
        </div>
      {!features.disableEvents && <EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />}
      {selectedDeviceId && (
        <div className={classes.statusCard}>
          <StatusCard
            deviceId={selectedDeviceId}
            onClose={() => dispatch(devicesActions.select(null))}
          />
        </div>
      )}
    </div>
  );
};

export default MainPage;
