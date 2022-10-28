import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddTutorial from "./components/AddTutorial";
import Tutorials from "./components/Tutorials";
import TutorialsList from "./components/TutorialsList";
import { makeStyles } from "@mui/styles";
import { AppBar, Toolbar, Typography } from "@mui/material";

const useStyles = makeStyles({
  appBar: {
    backgroundColor: "#343A40",
    height: "50px",
    "& .MuiToolbar-regular": {
      minHeight: "50px",
    },
  },
  name: {
    marginRight: "15px",
  },
  link: {
    textTransform: "unset",
    color: "#a5a5a5",
    margin: "0 20px",
    textDecoration: "unset",
  },
});

const App = () => {
  const classes = useStyles();

  return (
    <div>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <Typography className={classes.name} variant="h6">
            Duy Viet
          </Typography>
          <Link to={"/tutorials"} className={classes.link}>
            <Typography variant="body2">Tutorials</Typography>
          </Link>
          <Link to={"/add"} className={classes.link}>
            <Typography variant="body2">Add</Typography>
          </Link>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<TutorialsList/>} />
        <Route path="/tutorials" element={<TutorialsList/>} />
        <Route path="/add" element={<AddTutorial />} />
        <Route path="/tutorials/:id" element={<Tutorials />} />
      </Routes>
    </div>
  );
};

export default App;
