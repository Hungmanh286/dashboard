import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { ICameraData, IFrameData, IRoomInfo } from "../../types/IRoomData.type";
import RoomService from "../../services/room.service";
import { usePub } from "../../common/EventBus";
import "../Table/Table.css";


const getGradient = (people: number, total: number): string => {
  const percentage = (people / total) * 100;
  return `linear-gradient(to right, ${getColor(percentage)} ${percentage}%, #f2f2f2 ${percentage}%)`;
};


const getColor = (percentage: number): string => {
  if (percentage >= 66.6) return '#41d762';
  if (percentage >= 33.3) return '#f7f700';
  if (percentage > 0) return '#fa2727';
  return '#f2f2f2';
};

const getDotColor = (total:number):string => {
  if (total === 0) return 'red';
  return 'green';
};

export function Table1({ roomData }: { roomData: IRoomInfo }) {
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const _id = roomData._id ?? '';
  const name = roomData.name;
  const capacity: number = roomData.capacity;
  const camera: Array<ICameraData> = roomData.camera ?? [];
  const activate: boolean = roomData.active;

  const [series, setSeries] = useState<Array<IFrameData>>([]);

  const publish = usePub();

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = () => {
    RoomService.getLastAnalyzedRooms(_id)
      .then((response: any) => {
        setSeries(response.data);
      })
      .catch((e: any) => {
        console.log(e);
        if (e.response && e.response.status === 401) {
          publish('logout', {});
        }
      });
  };

  const lastEntry = series[series.length - 1];
  const numberPeople = lastEntry ? lastEntry.number_people : 0;
  const distribution = lastEntry ? lastEntry.distribution : 0;

  return (
    <tr>
      <td className="room-cell">
        <span className={`dot ${getDotColor(numberPeople)}`}></span>{name}
      </td>
      <td style={{ background: getGradient(numberPeople, capacity) }}>{numberPeople}/{capacity}</td>
      <td style={{ backgroundColor: getColor(distribution) }}>{distribution}</td>
    </tr>
  );
}
