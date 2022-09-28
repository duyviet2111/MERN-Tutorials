import React from 'react';
import Button from '@mui/material/Button';
import { Snackbar } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from './LocalizationProvider';
import { useCatch } from '../../reactHelper';
import { snackBarDurationLongMs } from '../util/duration';

let base64 = require('base-64');

const useStyles = makeStyles((theme) => ({
  button: {
    height: 'auto',
    marginTop: 0,
    marginBottom: 0,
    color: theme.palette.colors.negative,
  },
}));

const RemoveDialog = ({
  open, endpoint, itemId, onResult,
}) => {
  const classes = useStyles();
  const t = useTranslation();

  const handleRemove = useCatch(async () => {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode("admin:admin"  ));
    const response = await fetch(`http://159.65.134.221:8082/api/${endpoint}/${itemId}`, { method: 'DELETE' , headers: headers});
    if (response.ok) {
      onResult(true);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <Snackbar
      open={open}
      autoHideDuration={snackBarDurationLongMs}
      onClose={() => onResult(false)}
      message={t('sharedRemoveConfirm')}
      action={(
        <Button size="small" className={classes.button} onClick={handleRemove}>
          {t('sharedRemove')}
        </Button>
      )}
    />
  );
};

export default RemoveDialog;
