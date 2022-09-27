import React, { useState } from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "../common/components/LocalizationProvider";
import useReportStyles from "../reports/common/useReportStyles";
import MapView from "../map copy/core/MapView";
import MapRoutePath from "../map copy/MapRoutePath";
import MapPositions from "../map copy/MapPositions";
import ReportFilter from "./components/ReportFilter";
import usePersistedState from "../common/util/usePersistedState";
import usePositionAttributes from "../common/attributes/usePositionAttributes";
import ColumnSelect from "./components/ColumnSelect";
import PositionValue from '../common/components/PositionValue';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import TableShimmer from '../common/components/TableShimmer';
import { useCatch } from '../reactHelper';
import ReportsMenu from './components/ReportsMenu';
import PageLayout from '../common/components/PageLayout'

const RouteReportPage = () => {
  const classes = useReportStyles();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const [columns, setColumns] = usePersistedState("routeColumns", [
    "fixTime",
    "latitude",
    "longitude",
    "speed",
    "address",
  ]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSubmit = useCatch(async ({ deviceId, from, to, type }) => {
    const query = new URLSearchParams({ deviceId, from, to });
    if (type === 'export') {
      window.location.assign(`/api/reports/route/xlsx?${query.toString()}`);
    } else if (type === 'mail') {
      const response = await fetch(`/api/reports/route/mail?${query.toString()}`);
      if (!response.ok) {
        throw Error(await response.text());
      }
    } else {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports/route?${query.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          setItems(await response.json());
        } else {
          throw Error(await response.text());
        }
      } finally {
        setLoading(false);
      }
    }
  });
  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportRoute']}>
<div className={classes.container}>
      {selectedItem && (
        <div className={classes.containerMap}>
          <MapView>
            <MapRoutePath positions={items} />
            <MapPositions positions={[selectedItem]} />
          </MapView>
        </div>
      )}
      <div className={classes.containerMain}>
        <div className={classes.header}>
          <ReportFilter handleSubmit={handleSubmit}>
            <ColumnSelect
              columns={columns}
              setColumns={setColumns}
              columnsObject={positionAttributes}
            />
          </ReportFilter>
        </div>
        <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.columnAction} />
                {columns.map((key) => (<TableCell key={key}>{positionAttributes[key].name}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? items.map((item) => (
                <TableRow key={item.id}>
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
                      <PositionValue
                        position={item}
                        property={item.hasOwnProperty(key) ? key : null}
                        attribute={item.hasOwnProperty(key) ? null : key}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              )) : (<TableShimmer columns={columns.length + 1} startAction />)}
            </TableBody>
          </Table>
      </div>
    </div>
    </PageLayout>
  );
};

export default RouteReportPage;
