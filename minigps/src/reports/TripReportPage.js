import React, { useState } from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import ReportFilter from "./components/ReportFilter";
// import { useAttributePreference } from "../common/util/preferences";
import { useTranslation } from "../common/components/LocalizationProvider";
import useReportStyles from "./common/useReportStyles";
import usePersistedState from '../common/util/usePersistedState';
import PageLayout from "../common/components/PageLayout";
import MapView from "../map copy/core/MapView";
import MapRoutePath from "../map copy/MapRoutePath";
import MapMarkers from '../map copy/MapMarkers';
import ColumnSelect from "./components/ColumnSelect";
import TableShimmer from '../common/components/TableShimmer';
import ReportsMenu from './components/ReportsMenu';

const columnsArray = [
  ["startTime", "reportStartTime"],
  ["startOdometer", "reportStartOdometer"],
  ["startAddress", "reportStartAddress"],
  ["endTime", "reportEndTime"],
  ["endOdometer", "reportEndOdometer"],
  ["endAddress", "reportEndAddress"],
  ["distance", "sharedDistance"],
  ["averageSpeed", "reportAverageSpeed"],
  ["maxSpeed", "reportMaximumSpeed"],
  ["duration", "reportDuration"],
  ["spentFuel", "reportSpentFuel"],
  ["driverName", "sharedDriver"],
];

const columnsMap = new Map(columnsArray);

const TripReportPage = () => {
  const classes = useReportStyles();
  const t = useTranslation();

  // const distanceUnit = useAttributePreference("distanceUnit");
  // const speedUnit = useAttributePreference("speedUnit");
  // const volumeUnit = useAttributePreference("volumeUnit");

  const [columns, setColumns] = usePersistedState("tripColumns", [
    "startTime",
    "endTime",
    "distance",
    "averageSpeed",
  ]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [route, setRoute] = useState(null);

  const createMarkers = () => [
    {
      latitude: selectedItem.startLat,
      longitude: selectedItem.startLon,
      color: "negative",
    },
    {
      latitude: selectedItem.endLat,
      longitude: selectedItem.endLon,
      color: "positive",
    },
  ];
  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportTrips']}>
      <div className={classes.container}>
        {selectedItem && (
          <div className={classes.containerMap}>
            <MapView>
              {route && (
                <>
                <MapRoutePath positions={route} />
                <MapMarkers markers={createMarkers()} />
                </>
              )}
            </MapView>
          </div>
        )}
        <div className={classes.containerMain}>
          <div className={classes.header}>
            <ReportFilter>
            <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
            </ReportFilter>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.columnAction} />
                {columns.map((key) => (<TableCell key={key}>{t(columnsMap.get(key))}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
            {!loading ? items.map((item) => (
                <TableRow key={item.startPositionId}>
                  <TableCell className={classes.columnAction} padding="none">
                    {selectedItem === item ? (
                      <IconButton size="small" onClick={() => setSelectedItem(null)}>
                        <GpsFixedIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={() => setSelectedItem(item)}>
                        <LocationSearchingIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                  {columns.map((key) => (
                    <TableCell key={key}>
                      {/* {formatValue(item, key)} */}
                    </TableCell>
                  ))}
                </TableRow>
              )) : (<TableShimmer columns={columns.length + 1} startAction />)}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  )
};

export default TripReportPage;
