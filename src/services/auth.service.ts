import axios from "axios";
import {UserToken} from "../types/user.type";
import {UserLogin} from "../types/user.type";

const API_URL = "http://localhost:8656/api/counting/v1/auth/";

export const register = (username: string, email: string, password: string) => {
    return axios.post(API_URL + "signup", {
        username,
        email,
        password,
    });
};

export const login = (username: string, password: string) => {
    const userLogin: UserLogin = {
        username: username,
        password: password
    };
    return axios
        .post<UserToken>(API_URL + "login", userLogin)
        .then((response) => {
            console.log(response);
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data as UserToken;
        });
};

export const logout = () => {
    localStorage.removeItem("user");
};

export const getCurrentUser = (): UserToken | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr) as UserToken;

    return null;
};


const authService = {
    register,
    login,
    logout,
};

export default authService;