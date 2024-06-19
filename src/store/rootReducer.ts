import { combineReducers } from '@reduxjs/toolkit'

import roomReducer from "./roomSlice"

const rootReducer = combineReducers({
    rooms:  roomReducer
})

export default rootReducer