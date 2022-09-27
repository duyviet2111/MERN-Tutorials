import React, { useState } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import PageLayout from "../common/components/PageLayout";
import SettingsMenu from "./components/SettingsMenu";
import CollectionFab from "./components/CollectionFab";
import CollectionActions from "./components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";

let base64 = require('base-64');

const useStyles = makeStyles((theme) => ({
  columnAction: {
    width: "1%",
    paddingRight: theme.spacing(1),
  },
}));

const GroupsPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffectAsync(async () => {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode("admin:admin"  ));
    setLoading(true);
    try {
      const response = await fetch('http://159.65.134.221:8082/api/groups', {headers: headers});
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  return (
    <PageLayout
      menu={<SettingsMenu />}
      breadcrumbs={["settingsTitle", "settingsGroups"]}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedName')}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
            {!loading ? items.map((item) => (
                <TableRow key = {item.id}>
                    <TableCell className={classes.columnAction} padding="none">
                    <CollectionActions itemId={item.id} editPath="/settings/group" endpoint="groups" setTimestamp={setTimestamp} /> 
                    </TableCell>
                </TableRow>
            )) : (<TableShimmer columns={2} endAction />)}
        </TableBody>
        <CollectionFab editPath="/settings/group" />
      </Table>
    </PageLayout>
  );
};

export default GroupsPage;
