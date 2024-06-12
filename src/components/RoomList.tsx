import {useAppSelector} from "../store/hooks";
import {useState, useEffect} from "react";
import RoomService from "../services/RoomService";
import {IRoomInfo, IRoomData} from "../types/IRoomData.type";
import {Room} from "./Room"
import {Card} from "antd";


export function RoomList() {
    const [rooms, setRooms] = useState<Array<IRoomInfo>>([]);

    useEffect(() => {
        retrieveRooms();
    }, []);

    const retrieveRooms = () => {
        RoomService.getAllRoom()
            .then((response: any) => {
                setRooms(response.data.data);
                console.log(response);
            })
            .catch((e: Error) => {
                console.log(e);
            });

    }
    console.log(rooms);
    const listItem = rooms.map((room: IRoomInfo) => {
        return (
            <div key={room._id}>
                <Room
                    _id={room._id}
                    name={room.name}
                    camera={room.camera}
                    capacity={room.capacity}
                    activate={room.activate}
                />
            </div>
        );
    });

    return (
        <div>
            {listItem}
        </div>
    )
}