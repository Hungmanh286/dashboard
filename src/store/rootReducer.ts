import { combineReducers } from '@reduxjs/toolkit'

import roomReducer from "./roomSlice"
import authReducer from "./authSlice";
import userReducer from "./userSlice";

const rootReducer = combineReducers({
    rooms:  roomReducer,
    auth: authReducer,
    users: userReducer
})

export default rootReducer