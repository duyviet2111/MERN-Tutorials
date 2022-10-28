import { React, useState } from "react";
import { TextField, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDispatch } from 'react-redux'
import {createTutorial} from "../store/tutorialsReducer"

const useStyles = makeStyles({
  form: {
    marginLeft: "50px",
  },
  textField: {
    margin: "15px 0",
  },
  button: {
    marginRight: "15px",
    color: "white",
    fontSize: "13px",
    textTransform: "none",
    height: "25px",
  },
});
const AddTutorial = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false,
  };

  const [tutorial, setTutorial] = useState(initialTutorialState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTutorial({ ...tutorial, [name]: value });
  };

  const saveTutorial = () => {
    const { title, description } = tutorial;

    dispatch(createTutorial({ title, description }))
    .unwrap()
    .then(data => {
      console.log(data);
      setTutorial({
        id: data.id,
        title: data.title,
        description: data.description,
        published: data.published
      });
      setSubmitted(true);
    })
    .catch(e => {
      console.log(e);
    });
  };

  const newTutorial = () => {
    setTutorial(initialTutorialState);
    setSubmitted(false);
  };

  return (
    <div>
      {submitted ? (
        <div className={classes.form}>
          <h4>You submitted successfully!</h4>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={newTutorial}
          >
            Add
          </Button>
        </div>
      ) : (
        <div className={classes.form}>
          <div className={classes.textField}>
            <TextField 
            label="Title" 
            name="title" 
            required 
            value={tutorial.title || ""}
            onChange={handleInputChange}
            />
          </div>
          <div className={classes.textField}>
            <TextField
              label="Description"
              name="description"
              value={tutorial.description || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={saveTutorial}
          >
            Submit
          </Button>
        </div>
      )}
      ;
    </div>
  );
};

export default AddTutorial;
