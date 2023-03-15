
import { configureStore } from "@reduxjs/toolkit"
import web3ProviderReducer from "./reduces/web3ProviderRedux"
import pinState from "./reduces/pinRedux"
import pinHash from "./reduces/pinhashRedux"

import { getDefaultMiddleware } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        // reference reducers here
        web3ProviderReducer, pinState, pinHash
    }, middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),

})

// create types for state and dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch