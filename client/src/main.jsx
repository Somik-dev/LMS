import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import { appStore, persistor } from "./app/store";
import Custom from "./Custom";
import { Toaster } from "./components/ui/sonner";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <PersistGate loading={null} persistor={persistor}>
        <Custom>
          <App />
          <Toaster />
        </Custom>
      </PersistGate>
    </Provider>
  </StrictMode>
);

