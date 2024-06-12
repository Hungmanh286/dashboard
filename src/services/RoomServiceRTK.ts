// Need to use the React-specific entry point to import createApi
import {BaseQueryApi, createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type { IRoomData, IRoomInfo } from '../types/IRoomData.type'
import type {ListResponse} from "../types/common.type";


// Define a service using a base URL and expected endpoints
export const roomApi = createApi({
    reducerPath: 'roomApi',
    baseQuery: fetchBaseQuery( { baseUrl: 'http://127.0.0.1:8656/api/counting/v1/' }),
    endpoints: (builder) => ({
        getListRoomInfo: builder.query<ListResponse<IRoomInfo>, number | void>({
            query: (page = 1) => `room/all?limit=10?skip=$(page)`,
            transformResponse: (response: { data: ListResponse<IRoomInfo> }, meta, arg) => response.data,
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetListRoomInfoQuery } = roomApi