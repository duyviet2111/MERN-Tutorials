import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePersistedState from "../common/util/usePersistedState";
import axios from "axios";

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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = usePersistedState("loginEmail", "");
  const [failed, setFailed] = useState(false);
  const [failMsg, setFailMsg] = useState("");
  const [password, setPassword] = useState("");
  

  
  useEffect(() => {
    const connect = () => {
      axios
        .get("http://159.65.134.221:8082/api/server")
        .then(function (response) {
          console.log(response.data);
          
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    connect();
  }, []);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "http://159.65.134.221:8082/api/session",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      data: new URLSearchParams(`email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`),
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  
  // const handleSpecialKey = (e) => {
  //   if (e.keyCode === 13 && email && password) {
  //     handleSubmit(e);
  //   }
  // };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              error={failed}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              helperText={failed && failMsg}
              onChange={(e) => setEmail(e.target.value)}
              // onKeyUp={handleSpecialKey}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              error={failed}
              id="password"
              label="Password"
              name="password"
              autoComplete="current-password"
              autoFocus
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              // onKeyUp={handleSpecialKey}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember Me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
              // onKeyUp={handleSpecialKey}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/register" variant="body2">
                  REGISTER
                </Link>
              </Grid>
              <Grid item>
                <Link href="/rspassword" variant="body2">
                  RESET PASSWORD
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
