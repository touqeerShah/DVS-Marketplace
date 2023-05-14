import { StateType } from "../../config"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./../store"
import { IChainData } from '../../lib/types'

export const initialState: StateType = {
    library: undefined,
    account: undefined,
    chainId: undefined,
    active: false
}



export const web3ProviderSlice = createSlice({
    initialState,
    reducers: {
        connectState: (state: StateType, action: PayloadAction<any>) => {
            const _state = action.payload;
            console.log("_state", _state);

            state.library = _state.library;
            state.account = _state.account;
            state.chainId = _state.chainId;
            state.active = _state.active;


        },
        disconnectState: (state: StateType, action: PayloadAction) => {

            state.library = undefined;
            state.account = undefined;
            state.chainId = undefined;
            state.active = false;
        },
        changeAddress: (state: StateType, action: PayloadAction<string>) => {
            const _state = action.payload;

            state.account = _state;
        }
        ,
        changeChain: (state: StateType, action: PayloadAction<number>) => {
            const _state = action.payload;

            state.chainId = _state;
        }
    },
    name: "web3Provider"
})

// actions
export const { connectState, disconnectState, changeAddress, changeChain } = web3ProviderSlice.actions

// selectors
export const web3ProviderReduxState = (state: RootState) => state.web3ProviderReducer

export default web3ProviderSlice.reducer