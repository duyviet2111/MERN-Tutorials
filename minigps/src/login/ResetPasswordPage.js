import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
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
  const query = useQuery();
  const token = query.get("passwordReset");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

    // const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get("email"),
    //   password: data.get("password"),
    // });
  };
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
            <IconButton color="primary" onClick={() => navigate("/")}>
              <ArrowBackIcon />
            </IconButton>
            Reset Password
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
          >
            {!token ? (
              <TextField
                required
                fullWidth
                label="User Email"
                name="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            ) : (
              <TextField
                required
                fullWidth
                label="userPassword"
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
              RESET PASSWORD
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default ResetPasswordPage;
