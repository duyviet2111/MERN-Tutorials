import * as React from "react";
import {
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
  TextField,
  Card,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePersistedState from "../common/util/usePersistedState";
import {
  useLocalization,
  useTranslation,
} from "../common/components/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import { sessionActions } from "../store";

// thử nghiệm particiles
import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import { particiles } from "./particiles";
// import makeStyles from '@mui/styles/makeStyles';

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://tksvietnam.com/">
        TKS
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const theme = createTheme();

const LoginPage = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const classes = useStyles();

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);
  const particlesLoaded = useCallback(async (container) => {}, []);

  const { languages, language, setLanguage } = useLocalization();
  // hàm object.entries trả về một array thuộc tính [key, value]
  const languageList = Object.entries(languages).map((values) => ({
    code: values[0],
    name: values[1].name,
  }));
  const languageEnabled = useSelector(
    (state) => !state.session.server.attributes["ui.disableLoginLanguage"]
  );
  // console.log("languageList check: ", languageList,  languages);
  const [email, setEmail] = usePersistedState("loginEmail", "");
  const [failed, setFailed] = useState(false);
  const [failMsg, setFailMsg] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        body: new URLSearchParams(
          `email=${encodeURIComponent(email)}&password=${encodeURIComponent(
            password
          )}`
        ),
      });
      if (response.ok) {
        const user = await response.json();
        dispatch(sessionActions.updateUser(user));
        navigate("/");
      } else {
        if (response.status === 400) {
          throw Error(t("disabled"));
        }
        throw Error(t("invalid"));
      }
    } catch (error) {
      setFailed(true);
      setFailMsg(error.message);
      setPassword("");
    }
  };
  const handleSpecialKey = (e) => {
    if (e.keyCode === 13 && email && password) {
      handleSubmit(e);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particiles}
      />
      <Container component="main" maxWidth="xs">
        <Card position="relative">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                required
                error={failed}
                helperText={failed && failMsg}
                variant="filled"
                color="success"
                focused
                margin="normal"
                label={t("userEmail")}
                fullWidth
                value={email}
                autoComplete="email"
                name="email"
                autoFocus={!email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyUp={handleSpecialKey}
              />
              <TextField
                margin="normal"
                variant="filled"
                required
                color="success"
                focused
                fullWidth
                error={failed}
                value={password}
                label={t("userPassword")}
                name="password"
                autoComplete="current-password"
                autoFocus={!!email}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleSpecialKey}
              />
              {languageEnabled && (
                <FormControl
                  fullWidth
                  margin="normal"
                  variant="filled"
                  color="success"
                  focused
                >
                  <InputLabel>{t("loginLanguage")}</InputLabel>
                  <Select
                    label={t("loginLanguage")}
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    {languageList.map((it) => (
                      <MenuItem key={it.code} value={it.code}>
                        {it.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                border="none"
                outline="none"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
                onKeyUp={handleSpecialKey}
              >
                {t("loginLogin")}
              </Button>
              <Grid container>
                <Grid item xs variant="contained">
                  <Button
                    // color="secondary"
                    variant="contained"
                    href="/register"
                  >
                    {t("loginRegister")}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    // color="secondary"
                    variant="contained"
                    href="/reset-password"
                  >
                    {t("loginReset")}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Box>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
