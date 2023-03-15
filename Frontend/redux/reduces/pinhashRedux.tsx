import { PinHash } from "../../config"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

export const initialState: PinHash = {

    pinhash: ""
}



export const pinHashSlice = createSlice({
    initialState,
    reducers: {
        setHash: (state: PinHash, action: PayloadAction<PinHash>) => {
            const _state = action.payload;
            console.log("_state", _state);

            state.pinhash = _state.pinhash;
        }
    },
    name: "PinState"
})

// actions
export const { setHash } = pinHashSlice.actions

// selectors
export const pinHashReducerState = (state: RootState) => state.pinHash

export default pinHashSlice.reducer