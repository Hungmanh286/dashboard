export interface IFrameData {
    time: number
    number_people: number
    rate: number
}

export interface ICameraData {
    camera_ip: string
    camera_id: string
    video_source: string
    camera_width: number
    camera_height: number
    encode: string
}

export interface IRoomInfo {
    _id?: string | null
    name: string
    camera?: Array<ICameraData>
    capacity: number
    active: boolean
}

export interface IRoomData extends IRoomInfo {
    series_data: Array<IFrameData>
}

