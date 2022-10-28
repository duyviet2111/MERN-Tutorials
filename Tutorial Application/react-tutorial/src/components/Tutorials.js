import { React, useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { TextField, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import TutorialDataService from "../services/TutorialService";
import { useDispatch } from "react-redux";
import { updateTutorial, deleteTutorial } from "../store/tutorialsReducer";

const useStyles = makeStyles({
  form: {
    marginLeft: "50px",
  },
  textField: {
    margin: "15px 0",
  },
  buttonWrapper: {
    marginTop: "20px",
  },
  button: {
    marginRight: "15px",
    color: "white",
    fontSize: "13px",
    textTransform: "none",
    height: "25px",
  },
  publish: {
    backgroundColor: "#0062cc",
    "&:hover": {
      backgroundColor: "#0062cc",
      opacity: 0.8,
    },
  },
});

const Tutorials = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false,
  };

  const [currentTutorial, setCurrentTutorial] = useState(true);
  const [message, setMessage] = useState("");

  const getTutorial = (id) => {
    TutorialDataService.get(id)
      .then((response) => {
        setCurrentTutorial(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (id) {
      getTutorial(id);
    }
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentTutorial({ ...currentTutorial, [name]: value });
  };

  const updateStatus = (status) => {
    const data = {
      id: currentTutorial.id,
      title: currentTutorial.title,
      description: currentTutorial.description,
      published: status,
    };
    dispatch(updateTutorial({ id: currentTutorial.id, data }))
    .unwrap()
    .then(response => {
      console.log(response);
      setCurrentTutorial({ ...currentTutorial, published: status });
      setMessage("The status was updated successfully!");
    })
    .catch(e => {
      console.log(e);
    });
  };

  const updateContent = () => {
    dispatch(updateTutorial({ id: currentTutorial.id, data: currentTutorial }))
      .unwrap()
      .then(response => {
        console.log(response);
        setMessage("The tutorial was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const removeTutorial = () => {
    dispatch(deleteTutorial({ id: currentTutorial.id }))
      .unwrap()
      .then(() => {
        navigate("/tutorials");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentTutorial ? (
        <div className={classes.form}>
          <h2>Tutorial</h2>
          <form>
            <div>
              <TextField
                className={classes.textfield}
                label="title"
                name="title"
                required
                onChange={handleInputChange}
              />
            </div>
            <div>
              <TextField
                className={classes.textfield}
                label="Description"
                name="Description"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                <strong>Status: </strong>
              </label>
              {currentTutorial.published ? "Published" : "Pending"}
            </div>
          </form>
          <div className={classes.buttonWrapper}>
            {currentTutorial.published ? (
              <Button
                className={`${classes.publish} ${classes.buttonWrapper}`}
                onClick={() => updateStatus(false)}
              >
                UnPublish
              </Button>
            ) : (
              <Button
                className={`${classes.publish} ${classes.button}`}
                onClick={() => updateStatus(true)}
              >
                Publish
              </Button>
            )}
            <Button
              className={`${classes.delete} ${classes.button}`}
              onClick = {removeTutorial}
            >
              Delete
            </Button>
            <Button
              type="submit"
              className={`${classes.update} ${classes.button}`}
              onClick={updateContent}
            >
              Update
            </Button>
          </div>
          <p> {message} </p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Tutorial...</p>
        </div>
      )}
    </div>
  );
};

export default Tutorials;
