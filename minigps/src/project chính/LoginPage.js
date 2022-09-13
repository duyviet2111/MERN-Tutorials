/* eslint-disable no-undef */
import React, { useState } from 'react';
import {
  useMediaQuery, InputLabel, Select, MenuItem, FormControl, Button, TextField, IconButton, Tooltip,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionActions } from '../store';
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
import LoginLayout from './LoginLayout';
import usePersistedState from '../common/util/usePersistedState';
import logoSvg from '../resources/images/logo.svg';
import { nativePostMessage } from '../common/components/NativeInterface';

const useStyles = makeStyles((theme) => ({
  options: {
    position: 'fixed',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  logoContainer: {
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  extraContainer: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  registerButton: {
    minWidth: 'unset',
  },
  resetPassword: {
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const { languages, language, setLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({ code: values[0], name: values[1].name }));

  const [failed, setFailed] = useState(false);
  const [failMsg, setFailMsg] = useState('');
  const [email, setEmail] = usePersistedState('loginEmail', '');
  const [password, setPassword] = useState('');

  const registrationEnabled = useSelector((state) => state.session.server.registration);
  const languageEnabled = useSelector((state) => !state.session.server.attributes['ui.disableLoginLanguage']);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams(`email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`),
      });
      if (response.ok) {
        const user = await response.json();
        dispatch(sessionActions.updateUser(user));
        nativePostMessage('login');
        navigate('/');
      } else {
        if (response.status === 400) {
          throw Error(t('disabled'));
        }
        throw Error(t('invalid'));
      }
    } catch (error) {
      setFailed(true);
      setFailMsg(error.message);
      setPassword('');
    }
  };

  const handleSpecialKey = (e) => {
    if (e.keyCode === 13 && email && password) {
      handleSubmit(e);
    }
  };

  return (
    <LoginLayout>
      <div className={classes.options}>
        {(window.appInterface || (window.webkit && window.webkit.messageHandlers.appInterface)) && (
          <Tooltip title={t('settingsServer')}>
            <IconButton onClick={() => navigate('/change-server')}>
              <LockOpenIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div className={classes.container}>
        {useMediaQuery(theme.breakpoints.down('lg')) && (
          <div className={classes.logoContainer}>
            <svg height="64" width="240">
              <use xlinkHref={`${logoSvg}#img`} />
            </svg>
          </div>
        )}
        <TextField
          required
          error={failed}
          label={t('userEmail')}
          name="email"
          value={email}
          autoComplete="email"
          autoFocus={!email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyUp={handleSpecialKey}
          helperText={failed && failMsg}
        />
        <TextField
          required
          error={failed}
          label={t('userPassword')}
          name="password"
          value={password}
          type="password"
          autoComplete="current-password"
          autoFocus={!!email}
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={handleSpecialKey}
        />
        {languageEnabled && (
          <FormControl fullWidth>
            <InputLabel>{t('loginLanguage')}</InputLabel>
            <Select label={t('loginLanguage')} value={language} onChange={(e) => setLanguage(e.target.value)}>
              {languageList.map((it) => <MenuItem key={it.code} value={it.code}>{it.name}</MenuItem>)}
            </Select>
          </FormControl>
        )}
        <Button
          onClick={handleSubmit}
          onKeyUp={handleSpecialKey}
          variant="contained"
          color="secondary"
          disabled={!email || !password}
        >
          {t('loginLogin')}
        </Button>
        <div className={classes.extraContainer}>
          <Button
            className={classes.registerButton}
            onClick={() => navigate('/register')}
            disabled={!registrationEnabled}
            color="secondary"
          >
            {t('loginRegister')}
          </Button>
          <Button
            onClick={() => navigate('/reset-password')}
            className={classes.registerButton}
            color="secondary"
          >
            {t('loginReset')}
          </Button>
        </div>
      </div>
    </LoginLayout>
  );
};

export default LoginPage;
