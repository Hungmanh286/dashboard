import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import RoomService from "../../services/room.service";
import { IRoomInfo } from "../../types/IRoomData.type";
import { initRooms } from "../../store/roomSlice";
import { usePub } from "../../common/EventBus";
import { Table, Input, Space } from 'antd';
import { Table1 } from './Row';

const { Search } = Input;

const Dashboard = () => {
  const [seriesData, setSeriesData] = useState<Array<{ roomId: string, series: Array<{ number_people: number; distribution: number }> }>>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredRooms, setFilteredRooms] = useState<IRoomInfo[]>([]);
  const rooms: Array<IRoomInfo> = useAppSelector((state) => state.rooms.rooms);
  const dispatch = useAppDispatch();
  const publish = usePub();

  useEffect(() => {
    retrieveRooms();
  }, []);

  useEffect(() => {
    // Filter rooms based on search text
    const filtered = rooms.filter(room => room.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredRooms(filtered);
  }, [searchText, rooms]);

  const retrieveRooms = () => {
    RoomService.getAllRoom()
      .then(async (response: any) => {
        dispatch(initRooms(response.data));
        const seriesResponses = await Promise.all(
          response.data.map((room: IRoomInfo) =>
            RoomService.getLastAnalyzedRooms(room._id ?? "").then((res: any) => ({
              roomId: room._id,
              series: res.data
            }))
          )
        );
        setSeriesData(seriesResponses);
      })
      .catch((e: any) => {
        console.log(e);
        if (e.response && e.response.status === 401) {
          publish('logout', {});
        }
      });
  };

  const columns = [
    {
      title: 'Room',
      dataIndex: 'name',
      key: 'name',
      width : 150,
      render: (_: any, room: IRoomInfo) => {
        const series = seriesData.find(data => data.roomId === room._id)?.series || [];
        const tableData = Table1({ roomData: room, series });
        return tableData.name;
      },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 200,
      render: (_: any, room: IRoomInfo) => {
        const series = seriesData.find(data => data.roomId === room._id)?.series || [];
        const tableData = Table1({ roomData: room, series });
        return tableData.total;
      },
    },
    {
      title: 'Distribution',
      dataIndex: 'distribution',
      key: 'distribution',
      width : 200,
      render: (_: any, room: IRoomInfo) => {
        const series = seriesData.find(data => data.roomId === room._id)?.series || [];
        const tableData = Table1({ roomData: room, series });
        return tableData.distribution;
      },
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search rooms"
          onSearch={(value) => setSearchText(value)}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredRooms}
        rowKey="_id"
        pagination={false}
      />
    </div>
  );
};

export default Dashboard;
