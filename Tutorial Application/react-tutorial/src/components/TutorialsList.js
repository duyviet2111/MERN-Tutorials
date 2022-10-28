import { React, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { TextField, Button, Grid, ListItem } from "@mui/material";
import { Link } from "react-router-dom";
import {
  retrieveTutorials,
  findTutorialsByTitle,
  deleteAllTutorials,
} from "../store/tutorialsReducer";

const useStyles = makeStyles({
  form: {
    marginLeft: "50px",
  },
  textField: {
    margin: "30px 0",
  },
  search: {
    marginTop: "15px",
  },
  tutorial: {
    marginLeft: "25px",
  },
});
const TutorialsList = () => {
  const classes = useStyles();

  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");

  const tutorials = useSelector((state) => state.tutorials);
  const dispatch = useDispatch();

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const initFetch = useCallback(() => {
    dispatch(retrieveTutorials());
  }, [dispatch]);

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  const refreshData = () => {
    setCurrentTutorial(null);
    setCurrentIndex(-1);
  };

  const setActiveTutorial = (tutorial, index) => {
    setCurrentTutorial(tutorial);
    setCurrentIndex(index);
  };

  const removeAllTutorials = () => {
    dispatch(deleteAllTutorials())
      .then((response) => {
        refreshData();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    refreshData();
    dispatch(findTutorialsByTitle({ title: searchTitle }));
  };
  
  return (
    <div className={classes.form}>
      <Grid container>
        <Grid
          className={classes.search}
          item
          sm={12}
          xs={12}
          md={12}
          xl={12}
          lg={12}
        >
          <TextField className={classes.textField}
            label="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
            placeholder="Search by title"
          />
          <Button
            size="small"
            variant="outlined"
            className={classes.textField}
            onClick={findByTitle}
          >
            Search
          </Button>
        </Grid>
        <Grid item md={4}>
          <h2>Tutorials List</h2>
          <div className="list-group">
            {tutorials &&
              tutorials.map((tutorial, index) => (
                <ListItem
                  selected={index === currentIndex}
                  onClick={() => setActiveTutorial(tutorial, index)}
                  divider
                  key={index}
                >
                  {tutorial.title}
                </ListItem>
              ))}
          </div>

          <Button
            className={`${classes.button} ${classes.removeAll}`}
            size="small"
            color="secondary"
            variant="contained"
            onClick={removeAllTutorials}
          >
            Remove All
          </Button>
        </Grid>
        <Grid item md={8}>
          {currentTutorial ? (
            <div className={classes.tutorial}>
              <h4>Tutorial</h4>
              <div className={classes.details}>
                <label>
                  <strong>Title: </strong>
                </label>{" "}
                {currentTutorial.title}
              </div>
              <div className={classes.details}>
                <label>
                  <strong>Description: </strong>
                </label>{" "}
                {currentTutorial.description}
              </div>
              <div className={classes.details}>
                <label>
                  <strong>Status: </strong>
                </label>{" "}
                {currentTutorial.published ? "Published" : "Pending"}
              </div>

              <Link
                to={"/tutorials/" + currentTutorial.id}
                className={classes.edit}
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p className={classes.tutorial}>Please click on a Tutorial...</p>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default TutorialsList;
