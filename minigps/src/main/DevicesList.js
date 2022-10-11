import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import {
  IconButton, Tooltip, Avatar, List, ListItemAvatar, ListItemText, ListItemButton, Box,
} from '@mui/material';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FlashOffIcon from '@mui/icons-material/FlashOff';
import ErrorIcon from '@mui/icons-material/Error';
import SettingsIcon from '@mui/icons-material/Settings';
import RouteIcon from '@mui/icons-material/Route';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { devicesActions } from '../store';
import { useEffectAsync } from '../reactHelper';
import {
  formatAlarm, formatBoolean, formatPercentage, formatStatus, getStatusColor,
} from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { mapIconKey, mapIcons } from '../map/core/preloadImages';
import { useAdministrator } from '../common/util/permissions';


const useStyles = makeStyles((theme) => ({
  list: {
    maxHeight: '100%',
  },
  listInner: {
    position: 'relative',
    margin: theme.spacing(1.5, 0),
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
  listItem: {
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white',
    },
  },
  batteryText: {
    fontSize: '0.75rem',
    fontWeight: 'normal',
    lineHeight: '0.875rem',
  },
  positive: {
    color: theme.palette.colors.positive,
  },
  medium: {
    color: theme.palette.colors.medium,
  },
  negative: {
    color: theme.palette.colors.negative,
  },
  neutral: {
    color: theme.palette.colors.neutral,
  },
}));

const DeviceRow = ({ data, index, style }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();
  const navigate = useNavigate();

  const admin = useAdministrator();

  const { items } = data;
  // console.log('items: ', typeof items, {items});
  const item = items[index];
  // console.log('item: ', typeof item, item);
  const position = useSelector((state) => state.positions.items[item.id]);
  // console.log('vvv', position)

  const secondaryText = () => {
    if (item.status === 'online' || !item.lastUpdate) {
      return formatStatus(item.status, t);
    }
    return moment(item.lastUpdate).fromNow();
  };
  
  return (
    <div style={style}>
      <Box>
        <ListItemButton
          key={item.id}
          className={classes.listItem}
          onClick={() => dispatch(devicesActions.select(item.id))}
          disabled={!admin && item.disabled}
        >
          <ListItemAvatar>
            <Avatar>
              <img className={classes.icon} src={mapIcons[mapIconKey(item.category)]} alt="" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.name}
            primaryTypographyProps={{ noWrap: true }}
            secondary={secondaryText()}
            secondaryTypographyProps={{ noWrap: true }}
            classes={{ secondary: classes[getStatusColor(item.status)] }}
          />
          <Tooltip title={t('settingsTitle')}>
            <IconButton
              size="small"
              onClick={() => navigate(`/settings/device/${item.id}`)}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('playSound')}>
            <IconButton size="small">
              <VolumeUpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('reportReplay')}>
            <IconButton
              size="small"
              onClick={() => navigate('/replay')}
              disabled={!position}
            >
              <RouteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {position && (
            <>
              {position.attributes.hasOwnProperty('alarm') && (
                <Tooltip title={`${t('eventAlarm')}: ${formatAlarm(position.attributes.alarm, t)}`}>
                  <IconButton size="small">
                    <ErrorIcon fontSize="small" className={classes.negative} />
                  </IconButton>
                </Tooltip>
              )}
              {position.attributes.hasOwnProperty('ignition') && (
                <Tooltip title={`${t('positionIgnition')}: ${formatBoolean(position.attributes.ignition, t)}`}>
                  <IconButton size="small">
                    {position.attributes.ignition ? (
                      <FlashOnIcon fontSize="small" className={classes.positive} />
                    ) : (
                      <FlashOffIcon fontSize="small" className={classes.neutral} />
                    )}
                  </IconButton>
                </Tooltip>
              )}
              {position.attributes.hasOwnProperty('batteryLevel') && (
                <Tooltip title={`${t('positionBatteryLevel')}: ${formatPercentage(position.attributes.batteryLevel)}`}>
                  <IconButton size="small">
                    {position.attributes.batteryLevel > 70 ? (
                      position.attributes.charge
                        ? (<BatteryChargingFullIcon fontSize="small" className={classes.positive} />)
                        : (<BatteryFullIcon fontSize="small" className={classes.positive} />)
                    ) : position.attributes.batteryLevel > 30 ? (
                      position.attributes.charge
                        ? (<BatteryCharging60Icon fontSize="small" className={classes.medium} />)
                        : (<Battery60Icon fontSize="small" className={classes.medium} />)
                    ) : (
                      position.attributes.charge
                        ? (<BatteryCharging20Icon fontSize="small" className={classes.negative} />)
                        : (<Battery20Icon fontSize="small" className={classes.negative} />)
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </ListItemButton>
      </Box>
    </div>
  );
};

const DevicesList = ({ devices }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const listInnerEl = useRef(null);

  if (listInnerEl.current) {
    listInnerEl.current.className = classes.listInner;
  }

  const [, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffectAsync(async () => {
    const response = await fetch('/api/devices?userId=1');
    if (response.ok) {
      dispatch(devicesActions.refresh(await response.json()));
    } else {
      throw Error(await response.text());
    }
  }, []);

  return (
    <AutoSizer className={classes.list}>
      {({ height, width }) => (
        <List disablePadding>
          <FixedSizeList
            width={width}
            height={height}
            itemCount={devices.length}
            itemData={{ items: devices }}
            itemSize={72}
            overscanCount={10}
            innerRef={listInnerEl}
          >
            {DeviceRow}
          </FixedSizeList>
        </List>
      )}
    </AutoSizer>
  );
};

export default DevicesList;
