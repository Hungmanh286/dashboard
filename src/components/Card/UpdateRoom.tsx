import React, {useEffect, useState} from "react";

import {ICameraData, IRoomInfo} from "../../types/IRoomData.type";
import RoomService from "../../services/room.service";


import {
    Modal,
    Button,
    message,
    Form,
    Input,
    Switch,
    InputNumber,
    Select,
    Card,
    Space, Popconfirm, PopconfirmProps,
    Descriptions
} from 'antd';
import {CloseOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {updateRoom} from "../../store/roomSlice";
import DrawLine from "./DrawLine";

const {Option} = Select;

type Point = {
    x: number;
    y: number;
}

export const UpdateRoom = (room_: IRoomInfo) => {
    const dispatch = useAppDispatch();

    const {user: currentUser} = useAppSelector((state) => state.auth);

    const room_id = room_._id == null ? '' : room_._id.toString();
    const room_name = room_.name;
    let [allowedUpdate, setAllowedUpdate] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const [room, setRoom] = useState<IRoomInfo>(room_);

    const [canvasOpen, setCanvasOpen] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [coordinates, setCoordinates] = useState<{start: Point, end: Point}>({
        start: {x: 0, y: 0},
        end: {x: 0, y: 0},
    });
    const [messageApi, contextHolder] = message.useMessage();
    const [na, setNa] = useState<boolean>(false);
    const [start, setStart] = useState<Point>({x: 0, y: 0})
    const [end, setEnd] = useState<Point>({x: 0, y: 0})
    let cameraIds: string[] = []
    if (room_.camera !== undefined) {
        cameraIds = room_.camera.map((cam: ICameraData) => {
            return cam.camera_id;
        })
    }

    const item = [
        {
            key: '1',
            label: "Start",
            children: `[${(coordinates.start.x/1000).toFixed(2)}, ${(coordinates.start.y/500).toFixed(2)}]`
        },
        {
            key: '2',
            label: 'End',
            children: `[${(coordinates.end.x/1000).toFixed(2)}, ${(coordinates.end.y/500).toFixed(2)}]`
        }
    ]
    const handleLineDraw = (start:Point, end: Point) => {
        setCoordinates({start, end});
    }

    const [form] = Form.useForm<IRoomInfo>();

    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleWatchForm = Form.useWatch((values) => {
        setRoom(values)
    }, form);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target);
        const {name, value} = e.target;
        setRoom({...room, [name]: value});
    }

    if (currentUser && currentUser.role.includes("admin")) {
        allowedUpdate = true;
    }

    useEffect(() => {
        form.setFieldsValue(room);
        getImage();
    }, []);

    const cancel: PopconfirmProps['onCancel'] = (e) => {
    };

    const onFinish = () => {
        RoomService.updateRoom(room_id, room)
            .then((response: any) => {
                if (room._id == null) room._id = room_id;
                dispatch(updateRoom(room));
                message.success(`Updated room ${room.name} successfully.`);
                setSubmitted(true);
            })
            .catch((e: Error) => {
                if (axios.isAxiosError(e)) {
                    console.log(e);
                    message.error(`Could not create room cause ${e.request.response}`);
                } else {
                    console.error(e);
                }
            });
    };

    const getImage = () => {
        RoomService.getImageRoom(room_id, cameraIds[0])
        .then((response: any) => {
            console.log(response);
            const imageObjectURL = URL.createObjectURL(response.data)
            setUrl(imageObjectURL)
        })
        .catch((e: any) => {
            console.log(e);
            console.log(e.response.status);
            if (e.response && e.response.status === 401) {
                console.log(e.response.data)
            }
        })
    }

    const onFinishFailed = () => {
        // console.log('Submit failed!');
    };

    const onReset = () => {
        form.setFieldsValue(room_);
    };

    const showModal = () => {
        let lineEndpoints: number[][][] = []
        if (room_.camera !== undefined) {
            lineEndpoints = room_.camera.map((cam: ICameraData) => {
                return cam.split_line;
            })
        }
        if (lineEndpoints[0][0] === undefined){
            setNa(true);
            console.log('nan')
        }else{
            setStart({x: lineEndpoints[0][0][0], y:lineEndpoints[0][0][1]})
            setEnd({x:lineEndpoints[0][1][0], y:lineEndpoints[0][1][1]})
        }
        setOpen(true);
    };

    const error = () => {
        messageApi.open({
            type:'error',
            content:"Two endpoints can't be similar!",
        });
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const showCanvas = () => {
        let s = {x: start.x * 1000, y: start.y * 500};
        let e = {x: end.x * 1000, y: end.y * 500};
        setCoordinates({start: s, end: e})
        setCanvasOpen(true);
    }

    const canvasOk = () => {
        setStart({x: Number((coordinates.start.x /1000).toFixed(2)), y: Number((coordinates.start.y /500).toFixed(2))})
        setEnd({x: Number((coordinates.end.x / 1000).toFixed(2)), y: Number((coordinates.end. y /500).toFixed(2))})
        setNa(false);
        setCanvasOpen(false);
        console.log('coordinate', coordinates)
        console.log('start, end', start, end)
    }

    const canvasCancel = () => {
        setCanvasOpen(false);
    }


    return (
        <>
            <EditOutlined key="edit" onClick={showModal}/>
            <Modal
                title={<p>Room {room_name}</p>}
                open={open}
                onCancel={handleCancel}
                onOk={handleOk}
                centered
            >
                <Card>
                    <Form
                        disabled={!allowedUpdate}
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        labelCol={{
                            // flex: '110px',
                            span: 8
                        }}
                        labelAlign="left"
                        labelWrap
                        wrapperCol={{
                            // flex: 1,
                            span: 24
                        }}
                        colon={false}
                        style={{
                            maxWidth: 1000,
                        }}
                        // layout="vertical"
                    >
                        <Form.Item<IRoomInfo>
                            label="Room name"
                            name="name"
                            rules={[
                                {
                                    required: true, message: 'Please enter a room name!'
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item<IRoomInfo>
                            label="Capacity"
                            name="capacity"
                            rules={[
                                {
                                    required: true, message: 'Please enter capacity of the room!'
                                },
                            ]}
                        >
                            <InputNumber/>
                        </Form.Item>

                        <Form.Item<IRoomInfo>
                            label="Active"
                            name="active"
                            valuePropName="checked"
                            initialValue={room.active}
                            rules={[
                                {
                                    required: true, message: 'Please choose status of the room!'
                                },
                            ]}
                        >
                            <Switch checkedChildren="Yes" unCheckedChildren="No"/>
                        </Form.Item>

                        <Form.List name="camera">
                            {(fields, {add, remove}) => (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    flexDirection: 'row',
                                    rowGap: 16,
                                    columnGap: 16
                                }}>
                                    {fields.map((field, index) => (
                                        <Card
                                            size="small"
                                            title={`Camera ${field.name + 1}`}
                                            key={field.key}
                                            extra={
                                                <Button disabled={!allowedUpdate}
                                                        onClick={() => {
                                                            remove(field.name);
                                                        }}
                                                >
                                                    <CloseOutlined

                                                    />
                                                </Button>
                                            }
                                        >
                                            <Form.Item
                                                label="Camera id"
                                                name={[field.name, 'camera_id']}
                                                rules={[
                                                    {
                                                        required: true, message: 'Please enter a camera id!'
                                                    },
                                                ]}
                                            >
                                                <Input disabled={index < room_.camera!.length ?
                                                    cameraIds.includes(room_.camera![index].camera_id) : false}/>
                                            </Form.Item>

                                            <Form.Item
                                                label="Camera ip"
                                                name={[field.name, 'camera_ip']}
                                                rules={[
                                                    {
                                                        required: true, message: 'Please enter a camera id!'
                                                    },
                                                ]}
                                            >
                                                <Input/>
                                            </Form.Item>

                                            <Form.Item
                                                label="Video source"
                                                name={[field.name, 'video_source']}
                                                rules={[
                                                    {
                                                        required: true, message: 'Please enter a camera id!'
                                                    },
                                                ]}
                                            >
                                                <Input/>
                                            </Form.Item>

                                            <Form.Item
                                                label="Encode"
                                                name={[field.name, 'encode']}
                                                rules={[
                                                    {
                                                        required: true, message: 'Please enter the encode type!'
                                                    },
                                                ]}
                                            >
                                                <Select>
                                                    <Option value="h264">H264</Option>
                                                    <Option value="h265">H265</Option>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                label="Width"
                                                name={[field.name, 'camera_width']}
                                                rules={[
                                                    {
                                                        required: false, message: 'Please enter the encode type!'
                                                    },
                                                ]}
                                            >
                                                <InputNumber/>
                                            </Form.Item>

                                            <Form.Item
                                                label="Height"
                                                name={[field.name, 'camera_height']}
                                                rules={[
                                                    {
                                                        required: false, message: 'Please enter the encode type!'
                                                    },
                                                ]}
                                            >
                                                <InputNumber/>
                                            </Form.Item>

                                            <Form.Item
                                                label="Split line"
                                                name={[field.name, 'split_line']}
                                                rules={[
                                                    {
                                                        required: false, message: "Please enter the normalized coordinate of two point!"
                                                    }
                                                ]}
                                            >
                                                <Input value={`[${!na ? start.x:''}, ${!na ? start.y: ''}], [${!na ? end.x: ''}, ${!na ? end.y: ''}]`}/>
                                                <Button
                                                type="primary"
                                                onClick={showCanvas}>
                                                    Edit
                                                </Button>
                                                <Modal
                                                title={<p>Room {room_name}</p>}
                                                open={canvasOpen}
                                                onCancel={canvasCancel}
                                                onOk={(coordinates.start.x === coordinates.end.x && coordinates.start.y === coordinates.end.y) ? error : canvasOk}
                                                style={{top:0, left:0}}
                                                centered
                                                width={1920}>
                                                    <div>
                                                        <div
                                                        style={{display: 'inline-block'}}>
                                                            {contextHolder}
                                                            <DrawLine onLineDraw={handleLineDraw} url={url} init={{start: coordinates.start, end: coordinates.end}}/>
                                                        </div>
                                                        <div
                                                        style={{display:'inline-block'}}>
                                                            <Descriptions title="Coordinate of two endpoints" items={item}/>
                                                        </div>
                                                    </div>
                                                </Modal>
                                            </Form.Item>
                                        </Card>
                                    ))}
                                    <Form.Item>

                                        <Button type="dashed"
                                                onClick={() => add()}
                                                style={{width: '100%'}}
                                                block
                                                icon={<PlusOutlined/>}
                                        >
                                            Add Camera
                                        </Button>
                                    </Form.Item>
                                </div>
                            )}
                        </Form.List>

                        <Form.Item>
                            <Space>
                                <Popconfirm
                                    title="Update the room"
                                    description="Are you sure to update this room?"
                                    onConfirm={() => {
                                        form.submit();
                                    }}
                                    onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="primary">
                                        Update
                                    </Button>
                                </Popconfirm>
                                <Button htmlType="button" onClick={onReset}>
                                    Reset
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </Modal>
        </>
    )
}
