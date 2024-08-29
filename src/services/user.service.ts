import http from '../http-common'
import {UserCreate, UserUpdate, UserBase} from "../types/user.type";
import authHeader from "./auth-header";


const getAllUser = (sort?: string, skip?: number, limit?: number) => {
    let query = "?";
    if (sort)
        query += `&sort=${sort}`;
    if (skip)
        query += `&skip=${skip}`;
    if (limit)
        query += `&limit=${limit}`;
    return http.get<Array<UserBase>>(`/user/all${query}`, {headers: authHeader()})
}

const createUser = (data: UserCreate) => {
    return http.post<UserBase>('/user/create', data, {headers: authHeader()})
}

const updateUser = (id: string, data: UserUpdate) => {
    return http.put<UserBase>(`/user/update/${id}`, data, {headers: authHeader()})
}

const deleteUser = (id: string) => {
    return http.delete<any>(`/user/delete/${id}`, {headers: authHeader()})
}

const getUserById = (id: string) => {
    return http.get<UserBase>(`/user/${id}`, {headers: authHeader()})
}
