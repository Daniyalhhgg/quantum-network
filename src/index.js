import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { MiningProvider } from "./context/MiningContext";
import { CircleProvider } from "./context/CircleContext"; // ✅ Add TrustCircle context if you have it
import "./styles/main.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MiningProvider>
          <CircleProvider>
            <App />
          </CircleProvider>
        </MiningProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
