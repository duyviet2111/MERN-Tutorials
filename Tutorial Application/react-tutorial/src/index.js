import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddTutorial from "./components/AddTutorial";
import Tutorials from "./components/Tutorials";
import TutorialsList from "./components/TutorialsList";
import { Provider } from "react-redux";
import store from "./store/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
  <BrowserRouter>
    <App />
    {/* <TutorialsList /> */}
  </BrowserRouter>
  </Provider>
);
