import { combineReducers } from '@reduxjs/toolkit'

import counterReducer from "./counterSlice"
import roomReducer from "./roomSlice"

const rootReducer = combineReducers({
    counter: counterReducer,
    room:  roomReducer
})

export default rootReducer