import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import RoomService from "../../services/room.service";
import { IRoomInfo } from "../../types/IRoomData.type";
import { initRooms } from "../../store/roomSlice";
import { usePub } from "../../common/EventBus";
import { Table1 } from './Row';
import "../Table/Table.css";

const Dashboard = () => {
  const rooms: Array<IRoomInfo> = useAppSelector((state) => state.rooms.rooms);
  const dispatch = useAppDispatch();
  const publish = usePub();

  useEffect(() => {
    retrieveRooms();
  }, []);

  const retrieveRooms = () => {
    RoomService.getAllRoom()
      .then((response: any) => {
        dispatch(initRooms(response.data));
      })
      .catch((e: any) => {
        console.log(e);
        if (e.response && e.response.status === 401) {
          publish('logout', {});
        }
      });
  };

  return (
    <div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Room</th>
            <th>Total</th>
            <th>Distribution</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room: IRoomInfo) => (
            <Table1 key={room._id} roomData={room} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
