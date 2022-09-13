import * as React from "react";
import { useState } from "react";
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
import { useNavigate } from 'react-router-dom';

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


const RegisterPage = () => {
  const axios = require("axios").default;
  const navigate = useNavigate();
  // const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidLength, setIsValidLength] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isMatches, setIsMatches] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [failed, setFailed] = useState(false);
  const [failMsg, setFailMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "http://159.65.134.221:8082/api/users",
      headers: { "Content-Type": "application/json" },
      data: {
        name,
        email,
        password,
      },
    })
      .then(function (response) {
          alert("Register Susscess!");
          navigate('/');
        console.log(response);
      })
      .catch(function (error) {
        setFailed(true);
        setFailMsg(error.message);
        setPassword('');
        console.log(error);
      });
  };


  // const data = new FormData(event.currentTarget);
  // console.log({
  //   email: data.get("email"),
  //   password: data.get("password"),
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
            Register
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="name"
                  label="Name"
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={failed}
                  label="Email Address"
                  name="email"
                  value={email}
                  helperText={failed && failMsg}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={failed}
                  name="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (event.target.value.length >= 8) {
                      setIsValidLength(true);
                    } else {
                      setIsValidLength(false);
                    }

                    if (
                      event.target.value.match(
                        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*+=]).{3,}$/
                      ) ||
                      event.target.value.match(
                        /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*+=]).{3,}$/
                      ) ||
                      event.target.value.match(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=]).{3,}$/
                      ) ||
                      event.target.value.match(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{3,}$/
                      )
                    ) {
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
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="validPassword"
                      checked={isValidPassword}
                      color="primary"
                    />
                  }
                  label="Password must contains 3 or more of uppercase, lowercase, numbers, and symbols."
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      id="validLength"
                      checked={isValidLength}
                      color="primary"
                    />
                  }
                  label="Password must at least 8 characters."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
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
                  label="Password Matches"
                  control={<Checkbox id="matches" checked={isMatches} />}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={
                !name ||
                !/(.+)@(.+)\.(.{2,})/.test(email) ||
                !isValidPassword ||
                !isValidLength ||
                !isMatches
              }
              sx={{ mt: 1, mb: 2 }}
            >
              REGISTER
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 2 }} />
      </Container>
    </ThemeProvider>
  );
};

export default RegisterPage;
