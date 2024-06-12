import http from '../http-common'
import {IRoomData, IRoomInfo, IFrameData} from "../types/IRoomData.type";


const getAllRoom = () => {
    return http.get<Array<IRoomInfo>>('/room/all')
}

const getRoomById = (id: string) => {
    return http.get<IRoomData>(`/room/${id}`)
}

const createRoom = (data: IRoomInfo) => {
    return http.post<IRoomInfo>('/room/create', data)
}

const updateRoom = (id: string, data: IRoomInfo) => {
    return http.put<IRoomInfo>(`/room/${id}`, data)
}

const deleteRoom = (id: string) => {
    return http.delete<any>(`/room/delete/${id}`)
}

const getAnalyzedRooms = () => {
    return http.post<IRoomData[]>('/room/analyzed')
}

const getAnalyzedRoom = (id: string) => {
    return http.get<IFrameData[]>(`/room/analyzed/${id}`)
}

const getImageRoom = async (id: string, cam_id: string)=> {
    return await http.get<string>(`/room/image/${id}?camera_id=${cam_id}`, {
        headers: {
            "Content-Type": "image/jpeg",
        },
        responseType: "blob"
    })
}

const RoomService = {
    getAllRoom,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    getAnalyzedRooms,
    getImageRoom,
    getAnalyzedRoom
}

export default RoomService;