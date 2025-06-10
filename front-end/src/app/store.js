import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import rootReducer from "./redux/rootReducer";

// Configuration redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Seul auth sera persisté (token)
};

// Crée un reducer persisté
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure le store avec ce reducer persisté
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Important pour redux-persist
    }),
});

// Créé le persistor pour le Provider
export const persistor = persistStore(store);
