import React, { useState } from 'react';

import {
  Button, TextField, Typography, IconButton, Checkbox, FormControlLabel, Dialog,
  DialogTitle, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoginLayout from './LoginLayout';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useCatch } from '../reactHelper';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.spacing(3),
    fontWeight: 500,
    marginLeft: theme.spacing(1),
    textTransform: 'uppercase',
  },
  dialog: {
    fullScreen: theme.breakpoints.down('md'),
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    height: '90%',
    bgcolor: '#999',
    border: '2px solid #000',
    boxShadow: 24,
  },
}));

const RegisterPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isValidLength, setIsValidLength] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isMatches, setIsMatches] = useState(false);

  const handleSubmit = useCatch(async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (response.ok) {
      setDialogOpen(true);
      const user = await response.json();
      const sendMailResponse = await fetch('/api/users/sendActiveCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!sendMailResponse.ok) {
        throw Error(await sendMailResponse.text());
      }
    } else {
      throw Error(await response.text());
    }
  });

  const handleClose = () => {
    navigate('/login');
  };

  return (
    <LoginLayout>
      <div className={classes.container}>
        <div className={classes.header}>
          <IconButton color="primary" onClick={() => navigate('/login')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography className={classes.title} color="primary">
            {t('loginRegister')}
          </Typography>
        </div>
        <TextField
          required
          label={t('sharedName')}
          name="name"
          value={name}
          autoFocus
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          required
          type="email"
          label={t('userEmail')}
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          required
          label={t('userPassword')}
          name="password"
          value={password}
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
            if (event.target.value.length >= 8) {
              setIsValidLength(true);
            } else {
              setIsValidLength(false);
            }

            if (event.target.value.match(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*+=]).{3,}$/)
              || event.target.value.match(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*+=]).{3,}$/)
              || event.target.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=]).{3,}$/)
              || event.target.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{3,}$/)) {
              setIsValidPassword(true);
            } else {
              setIsValidPassword(false);
            }

            if (event.target.value === password) {
              setIsMatches(true);
            } else {
              setIsMatches(false);
            }
          }}
        />
        <FormControlLabel
          label={t('passWordValidLength')}
          control={(
            <Checkbox
              id="validLength"
              checked={isValidLength}
            />
          )}
        />
        <FormControlLabel
          label={t('passWordValidation')}
          control={(
            <Checkbox
              id="validPassword"
              checked={isValidPassword}
            />
          )}
        />
        <TextField
          required
          type="password"
          label={t('userConfirmPassword')}
          name="confirmPassword"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            if (event.target.value === password) {
              setIsMatches(true);
            } else {
              setIsMatches(false);
            }
          }}
        />
        <FormControlLabel
          label={t('passWordMatches')}
          control={(
            <Checkbox
              id="matches"
              checked={isMatches}
            />
          )}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disabled={!name || !/(.+)@(.+)\.(.{2,})/.test(email) || !isValidPassword || !isValidLength || !isMatches}
          fullWidth
        >
          {t('loginRegister')}
        </Button>
      </div>
      <Dialog
        className={classes.dialog}
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {t('registerDoneTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>
              <Typography>
                {email}
              </Typography>
            </Typography>
            <Typography>
              <Typography>
                {t('activeMailSendNoti')}
              </Typography>
            </Typography>
            <Typography>
              <Typography>
                {t('avtiveLinkNoti')}
              </Typography>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>
    </LoginLayout>
  );
};

export default RegisterPage;
