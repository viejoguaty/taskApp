import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { BrandingProvider } from './context/BrandingContext';
import './styles/main.scss';
import "./index.css"; // opcional

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <BrandingProvider>
        <App />
      </BrandingProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
