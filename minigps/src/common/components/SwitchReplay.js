import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Switch,
  IconButton,
  Paper,
  Slider,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "../components/LocalizationProvider";
import { useNavigate } from "react-router-dom";
import { useCatch } from "../../reactHelper";
// import MapRoutePath from "../../map/MapRoutePath";
// import ReportFilter from "../../reports/components/ReportFilter";
// import MapView from "../../map/core/MapView";
// import MapPositions from "../../map/MapPositions";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import TuneIcon from "@mui/icons-material/Tune";
// import DownloadIcon from "@mui/icons-material/Download";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import PauseIcon from "@mui/icons-material/Pause";
// import FastForwardIcon from "@mui/icons-material/FastForward";
// import FastRewindIcon from "@mui/icons-material/FastRewind";
// import { formatTime } from "../util/formatter";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    zIndex: 3,
    left: 0,
    top: 0,
    margin: theme.spacing(1.5),
    width: theme.dimensions.drawerWidthDesktop,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      margin: 0,
    },
  },
  title: {
    flexGrow: 1,
  },
  slider: {
    width: "100%",
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formControlLabel: {
    height: "100%",
    width: "100%",
    paddingRight: theme.spacing(1),
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(1),
    },
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(1),
    },
  },
  switchReplay: {
    position: "absolute",
    right: "0px",
    padding: "10px",
    display: "flex",
    top: theme.spacing(32),
  },
}));

const SwitchReplay = () => {
  const t = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const timerRef = useRef();

  const defaultDeviceId = useSelector((state) => state.devices.selectedId);
  
  const [checked, setChecked] = useState(false);
  const [positions, setPositions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedDeviceId, setSelectedDeviceId] = useState(defaultDeviceId);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [expanded, setExpanded] = useState(true);
  const [playing, setPlaying] = useState(false);

  
  
  const deviceName = useSelector((state) => {
    if (selectedDeviceId) {
      const device = state.devices.items[selectedDeviceId];
      if (device) {
        return device.name;
      }
    }
    return null;
  });
  
  const onClick = useCallback(
    (positionId) => {
      if (positionId) {
        navigate(`/position/${positionId}`);
      }
    },
    [navigate]
    );
    const handleSubmit = useCatch(async ({ deviceId, from, to }) => {
      setSelectedDeviceId(deviceId);
      setFrom(from);
      setTo(to);
      const query = new URLSearchParams({ deviceId, from, to });
      const response = await fetch(`/api/positions?${query.toString()}`);
      if (response.ok) {
        setIndex(0);
        const positions = await response.json();
        setPositions(positions);
        if (positions.length) {
          setExpanded(false);
        } else {
          throw Error(t('sharedNoData'));
        }
      } else {
        throw Error(await response.text());
      }
    });

  const handleChange = (e)=> {
      setChecked(e.target.checked);
      console.log('abcccc')
  };

  return (
    <div className={classes.root}>
      <Switch
        className={classes.switchReplay}
        color="warning"
        defaultchecked={checked}
        onChange={handleChange}
      >
      </Switch>
    </div>
  );
};

export default SwitchReplay;
