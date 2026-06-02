import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import { store } from "./app/store.js";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
