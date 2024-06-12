import React, { useEffect, useState } from "react";
import {Button, DatePicker, Modal} from "antd";

import { Line, LineConfig } from '@ant-design/charts';

import {ICameraData, IRoomData, IRoomInfo} from "../types/IRoomData.type";
import RoomService from "../services/RoomService";

// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );
// import type { ChartData, ChartOptions } from 'chart.js';


const { RangePicker } = DatePicker;

export interface DataLine {
    data: any[]
    xField: string
    yField: string
    point: any
    interaction: any
    style: any
}

export interface OptionLine {
    responsive: boolean
    plugins: any
}

// interface LineProps {
//     options: ChartOptions<'line'>;
//     data: ChartData<'line'>;
// }

export const RoomChart = (room_: IRoomInfo) => {
    const room_id = room_._id == null ? '' : room_._id.toString();
    const room_name = room_.name
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [dataRoom, setDataRoom] = useState<IRoomData>();
    // const [lineConfig, setLineConfig] = useState<LineProps>

    const initialDataLine = {
        data: [],
        xField: 'time',
        yField: 'number_people',
        point: {
            shapeField: 'point',
            sizeField: 4,
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        style: {
            lineWidth: 2,
        },
    }

    // const initialDataLine = {
    //     options: {
    //         responsive: true,
    //         plugins: {
    //             legend: {
    //                 position: 'top' as const,
    //             },
    //             title: {
    //                 display: true,
    //                 text: 'Chart.js Line Chart',
    //             },
    //         },
    //     },
    //     data: {
    //         labels: [],
    //         datasets: []
    //     }
    // }

    const [data, setData] = useState<LineConfig>(initialDataLine);
    // const [data, setData] = useState<LineProps>(initialDataLine);

    const showChart = () => {
        setOpen(true);
        setLoading(true);

        retrieveData();

        setLoading(false);

    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

    const retrieveData = () => {
        RoomService.getAnalyzedRoom(room_id).then((response: any) => {
            const config:LineConfig = initialDataLine;
            config.data = response.data.data.series_data;
            setData(config);

            // console.log(response);
        })
        .catch((e: Error) => {
            console.log(e);
        });
    }

    const handleCancel = () => {
        setOpen(false);
    };

    const handleOk = () => {
        setOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showChart}>
                More
            </Button>
            <Modal
                title={<p>Room {room_name}</p>}
                loading={loading}
                open={open}
                onCancel={handleCancel}
                onOk={handleOk}
            >
                <div>
                    <Line {...data} />
                    {/*<Line data={data.data} />*/}
                </div>
            </Modal>
        </>
    );
}
