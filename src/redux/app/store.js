import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {apiSlice} from "./api"

import authReducer from "../auth/authSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";

const persistConfig = {
    key: "Team Monitor",
    version: 1,
    storage,
};

const authPersistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]:apiSlice.reducer,
        company: authPersistedReducer,
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
              },
        }).concat(apiSlice.middleware),
    devTools: true,
})
export let persistor = persistStore(store);
