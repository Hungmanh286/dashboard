import {Col, Divider, Row, Flex} from 'antd';

import {useAppDispatch, useAppSelector} from "../store/hooks";
import {useState, useEffect} from "react";
import RoomService from "../services/RoomService";
import {IRoomInfo, IRoomData} from "../types/IRoomData.type";
import {Room} from "./Room"
import {initRooms} from "../store/roomSlice";


export function RoomList() {
    const rooms: Array<IRoomInfo> = useAppSelector((state) => state.rooms.rooms)
    const dispatch = useAppDispatch()

    useEffect(() => {
        retrieveRooms();
    }, []);

    const retrieveRooms = () => {
        RoomService.getAllRoom()
            .then((response: any) => {
                console.log(response);

                dispatch(initRooms(response.data.data))
            })
            .catch((e: Error) => {
                console.log(e);
            });

    }

    const listItem = rooms.map((room: IRoomInfo, index) => {
        console.log(room);
        return (
            <div key={room._id}>
                <Room
                    _id={room._id}
                    name={room.name}
                    camera={room.camera}
                    capacity={room.capacity}
                    active={room.active}
                />
            </div>
        );
    });

    return (
        <div style={{
            padding: '25px'
        }}>
            <Divider orientation="left">Dashboard</Divider>

            <Flex wrap gap="small">
                {listItem}
            </Flex>
        </div>
    )
}