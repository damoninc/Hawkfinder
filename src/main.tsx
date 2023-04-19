import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

/**
 * This gives us our basic theme. We can choose our primary, secondary, status, and other colors to our MUI properties.
 */
export const screecherTheme = createTheme({
  palette: {
    primary: {
      main: "#1ed5db",
      light: "#acedee",
      dark: "#006461",
    },
    secondary: {
      main: "#db241e",
      light: "#ed6f6a",
      dark: "#79000e",
    },
    mode: "light",
  },
});

// The theme provider will add this theme to our whole app.
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={screecherTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
