import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import type {RootState, AppDispatch} from "./store"

// Define a type for the room slice state
interface RoomState {
    capacity: number
    name: number
    nPerson: number
    distribution: number
}

// Define the initial state using that type
const initialState: RoomState = {
    capacity: 0,
    name: 0,
    nPerson: 0,
    distribution: 0
} as RoomState

export const roomSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        updateRoom: (state, action: PayloadAction<RoomState>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes.
            // Also, no return statement is required from these functions.
            state = action.payload
        },
    }
})

export const {updateRoom} = roomSlice.actions

export const updateRoomAsync = (roomInfo: RoomState) => (dispatch: AppDispatch) => {
    setTimeout(() => {
        dispatch(updateRoom(roomInfo))
    })
}

export default roomSlice.reducer