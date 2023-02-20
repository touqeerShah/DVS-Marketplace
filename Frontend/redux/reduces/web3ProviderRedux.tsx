import { StateType } from "../../config"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./../store"
import { IChainData } from '../../lib/types'

const initialState: StateType = {
    provider: null,
    web3Provider: null,
    address: undefined,
    chainId: undefined,
    chainData: undefined
}



export const web3ProviderSlice = createSlice({
    initialState,
    reducers: {
        connectState: (state: StateType, action: PayloadAction<any>) => {
            const _state = action.payload;
            console.log("_state", _state);

            state.provider = _state.provider;
            state.web3Provider = _state.web3Provider;
            state.address = _state.address;
            state.chainId = _state.chainId;
            state.chainData = _state.chainData;


        },
        disconnectState: (state: StateType, action: PayloadAction) => {
            state = initialState
        },
        changeAddress: (state: StateType, action: PayloadAction<any>) => {
            const _state = action.payload;

            state.web3Provider = _state;
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