import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import {
  formatDistance,
  formatHours,
  formatSpeed,
  formatVolume,
  formatTime,
} from "../common/util/formatter";
import ReportFilter from "./components/ReportFilter";
import { useAttributePreference } from '../common/util/preferences';
import { useTranslation } from "../common/components/LocalizationProvider";
import PageLayout from "../common/components/PageLayout";
import ReportsMenu from "./components/ReportsMenu";
import usePersistedState from "../common/util/usePersistedState";
import ColumnSelect from "./components/ColumnSelect";
import { useCatch } from "../reactHelper";
import useReportStyles from "./common/useReportStyles";
import TableShimmer from "../common/components/TableShimmer";

let base64 = require('base-64');

const columnsArray = [
  ["deviceId", "sharedDevice"],
  ["startTime", "reportStartDate"],
  ["distance", "sharedDistance"],
  ["startOdometer", "reportStartOdometer"],
  ["endOdometer", "reportEndOdometer"],
  ["averageSpeed", "reportAverageSpeed"],
  ["maxSpeed", "reportMaximumSpeed"],
  ["engineHours", "reportEngineHours"],
  ["spentFuel", "reportSpentFuel"],
];
const columnsMap = new Map(columnsArray);

const SummaryReportPage = () => {
  const classes = useReportStyles();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);

  const [columns, setColumns] = usePersistedState("summaryColumns", [
    "deviceId",
    "startTime",
    "distance",
    "averageSpeed",
  ]);
  const [daily, setDaily] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  const handleSubmit = useCatch(async ({ deviceIds, groupIds, from, to, type }) => {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode("admin:admin"  ));
    const query = new URLSearchParams({ from, to, daily });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    groupIds.forEach((groupId) => query.append('groupId', groupId));
    if (type === 'export') {
      window.location.assign(`/api/reports/summary/xlsx?${query.toString()}`);
    } else if (type === 'mail') {
      const response = await fetch(`http://159.65.134.221:8082/api/reports/summary/mail?${query.toString()}`);
      if (!response.ok) {
        throw Error(await response.text());
      }
    } else {
      setLoading(true);
      try {
        const response = await fetch(`http://159.65.134.221:8082/api/reports/summary?${query.toString()}`, {
          headers: headers,
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

  const formatValue = (item, key) => {
    switch (key) {
      case 'deviceId':
        return devices[item[key]].name;
      case 'startTime':
        return item[key] ? formatTime(item[key], 'YYYY-MM-DD') : null;
      case 'startOdometer':
      case 'endOdometer':
      case 'distance':
        return formatDistance(item[key], distanceUnit, t);
      case 'averageSpeed':
      case 'maxSpeed':
        return formatSpeed(item[key], speedUnit, t);
      case 'engineHours':
        return formatHours(item[key]);
      case 'spentFuel':
        return formatVolume(item[key], volumeUnit, t);
      default:
        return item[key];
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportSummary']}>
      <div className={classes.header}>
        <ReportFilter 
        handleSubmit={handleSubmit} 
        multiDevice>
          <div className={classes.filterItem}>
            <FormControl fullWidth>
              <InputLabel>{t('sharedType')}</InputLabel>
              <Select label={t('sharedType')} value={daily} onChange={(e) => setDaily(e.target.value)}>
                <MenuItem value={false}>{t('reportSummary')}</MenuItem>
                <MenuItem value>{t('reportDaily')}</MenuItem>
              </Select>
            </FormControl>
          </div>
          <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
        </ReportFilter>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((key) => (<TableCell key={key}>{t(columnsMap.get(key))}</TableCell>))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? items.map((item) => (
            <TableRow key={(`${item.deviceId}_${Date.parse(item.startTime)}`)}>
              {columns.map((key) => (
                <TableCell key={key}>
                  {formatValue(item, key)}
                </TableCell>
              ))}
            </TableRow>
          )) : (<TableShimmer columns={columns.length} />)}
        </TableBody>
      </Table>
    </PageLayout>
  );
};

export default SummaryReportPage;
