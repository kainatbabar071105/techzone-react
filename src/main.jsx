import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { StoreProvider } from "./context/StoreContext";
ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
  <BrowserRouter>
   <AuthProvider>
  <StoreProvider>
    <App />
  </StoreProvider>
</AuthProvider>
  </BrowserRouter>
  </React.StrictMode>
);