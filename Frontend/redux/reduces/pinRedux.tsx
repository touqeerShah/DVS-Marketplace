import { PinState } from "../../config"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

export const initialState: PinState = {
    status: false,
    toSavePin: false,
}



export const pinSlice = createSlice({
    initialState,
    reducers: {
        changeState: (state: PinState, action: PayloadAction<PinState>) => {
            const _state = action.payload;
            console.log("_state", _state);

            state.status = _state.status;
            state.toSavePin = _state.toSavePin;
        },
        getState: (state: PinState) => {
            return state;
        }
    },
    name: "PinState"
})

// actions
export const { changeState, getState } = pinSlice.actions

// selectors
export const pinStateReducerState = (state: RootState) => state.pinState

export default pinSlice.reducer