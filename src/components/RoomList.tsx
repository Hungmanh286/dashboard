import {Col, Divider, Row} from 'antd';

import {useAppDispatch, useAppSelector} from "../store/hooks";
import {useState, useEffect} from "react";
import RoomService from "../services/RoomService";
import {IRoomInfo, IRoomData} from "../types/IRoomData.type";
import {Room} from "./Room"
import {initRooms} from "../store/roomSlice";


export function RoomList() {
    // const [rooms, setRooms] = useState<Array<IRoomInfo>>([]);
    const rooms: Array<IRoomInfo> = useAppSelector((state) => state.rooms.rooms)
    const dispatch = useAppDispatch()

    useEffect(() => {
        retrieveRooms();
    }, []);

    const retrieveRooms = () => {
        RoomService.getAllRoom()
            .then((response: any) => {
                // setRooms(response.data.data);
                dispatch(initRooms(response.data.data))
            })
            .catch((e: Error) => {
                console.log(e);
            });

    }

    // const listItem = rooms.map((room: IRoomInfo, index) => {
    //     return (
    //         <div key={room._id}>
    //             <Room
    //                 _id={room._id}
    //                 name={room.name}
    //                 camera={room.camera}
    //                 capacity={room.capacity}
    //                 activate={room.activate}
    //             />
    //         </div>
    //     );
    // });


    // let nCols = Math.min(3, rooms.length);
    let nCols = 3;

    const cols = []

    for (let i= 0; i < rooms.length; i++) {
        cols.push(
            <Col key={(i).toString()} span={24 / nCols}>
                <Room
                    _id={rooms[i]._id}
                    name={rooms[i].name}
                    camera={rooms[i].camera}
                    capacity={rooms[i].capacity}
                    activate={rooms[i].activate}
                />
            </Col>)
    }

    return (
        <>
            <Divider orientation="left">Dashboard</Divider>
            <div style={{
                padding: '20px'
            }}>
                <Row gutter={[16, 16]}>
                    {cols}
                </Row>
            </div>
        </>
    )
}