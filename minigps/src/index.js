import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import RegisterPage from "./login/RegisterPage";
import ResetPasswordPage from "./login/ResetPasswordPage";
import MainPage from "./main/MainPage";
// import i18n from "../src/locales/translation/i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <I18nextProvider i18n={i18n}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/rspassword" element={<ResetPasswordPage />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  // </I18nextProvider>
);
reportWebVitals();
