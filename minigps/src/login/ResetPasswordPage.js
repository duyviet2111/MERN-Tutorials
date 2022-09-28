import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { Snackbar } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import useQuery from "../common/util/useQuery";
import { useTranslation } from "../common/components/LocalizationProvider";
import { snackBarDurationShortMs } from "../common/util/duration";
import { useCatch } from '../reactHelper';

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

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const query = useQuery();

  const token = query.get("passwordReset");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!token) {
      axios({
        method: "POST",
        url: "http://159.65.134.221:8082/api/password/reset",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data: new URLSearchParams(`email=${encodeURIComponent(email)}`),
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios({
        method: "POST",
        url: "http://159.65.134.221:8082/api/password/update",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data: new URLSearchParams(
          `token=${encodeURIComponent(token)}&password=${encodeURIComponent(
            password
          )}`
        ),
      });
    }
    setSnackbarOpen(true);
  };
  // const handleSubmit = useCatch(async (event) => {
  //   event.preventDefault();
  //   let response;
  //   if (!token) {
  //     response = await fetch('http://159.65.134.221:8082/api/password/reset', {
  //       method: 'POST',
  //       body: new URLSearchParams(`email=${encodeURIComponent(email)}`),
  //     });
  //   } else {
  //     response = await fetch('http://159.65.134.221:8082/api/password/update', {
  //       method: 'POST',
  //       body: new URLSearchParams(`token=${encodeURIComponent(token)}&password=${encodeURIComponent(password)}`),
  //     });
  //   }
  //   if (response.ok) {
  //     // setSnackbarOpen(true);
  //   } else {
  //     throw Error(await response.text());
  //   }
  // });

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
            <IconButton color="primary" onClick={() => navigate("/login")}>
              <ArrowBackIcon />
            </IconButton>
            {t("loginReset")}
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {!token ? (
              <TextField
                required
                fullWidth
                label={t("userEmail")}
                name="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            ) : (
              <TextField
                required
                fullWidth
                label={t("userPassword")}
                name="password"
                value={password}
                type="password"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!/(.+)@(.+)\.(.{2,})/.test(email) && !password}
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              {t("loginReset")}
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={snackbarOpen}
          onClose={() => navigate("/login")}
          autoHideDuration={snackBarDurationShortMs}
          message={!token ? t("loginResetSuccess") : t("loginUpdateSuccess")}
        />
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default ResetPasswordPage;
