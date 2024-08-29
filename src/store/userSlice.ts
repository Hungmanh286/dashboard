import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {UserCreate, UserUpdate, UserBase} from "../types/user.type";


// Define type fo the user slice state
interface UserState {
    users: UserBase[]
}

// Define the initial state using that type
const initialState: UserState = {
    users: [],
} as UserState

export const usersSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<UserBase>) => {
            state.users.push(action.payload);
        },
        removeUser: (state, action: PayloadAction<UserBase>) => {
            let index = state.users.findIndex((user) => {
                return user._id === action.payload._id;
            });

            state.users.splice(index, 1);
        },
        initUsers: (state, action: PayloadAction<UserBase[]>) => {
            state.users = action.payload;
        },
        updateUser: (state, action: PayloadAction<UserBase>) => {
            let index = state.users.findIndex((user) => {
                return user._id === action.payload._id;
            });

            state.users[index] = action.payload;
        }
    }
})

export const {addUser, removeUser, initUsers, updateUser} = usersSlice.actions;

export default usersSlice.reducer;