import React, {useEffect, useState} from "react";

import {Line, LineConfig} from '@ant-design/charts';

import {ICameraData, IRoomData, IRoomInfo} from "../types/IRoomData.type";
import RoomService from "../services/RoomService";


import {
    Modal,
    Button,
    Cascader,
    message,
    Form,
    Input,
    Switch,
    InputNumber,
    Mentions,
    Select,
    TreeSelect,
    Card,
    DatePicker,
    Space,
    Checkbox
} from 'antd';
import {CloseOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import axios, {AxiosError} from "axios";

const {Option} = Select;

export const UpdateRoom = (room_: IRoomInfo) => {
    const room_id = room_._id == null ? '' : room_._id.toString();
    const room_name = room_.name
    const [open, setOpen] = useState<boolean>(false);

    const initialRoomState = {
        _id: null,
        name: '',
        capacity: 50,
        camera: Array<ICameraData>(),
        activate: true
    };

    const [form] = Form.useForm<IRoomInfo>();

    const [room, setRoom] = useState<IRoomInfo>(room_);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleWatchForm = Form.useWatch((values) => {
        setRoom(values)
    }, form)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target);
        const {name, value} = e.target;
        setRoom({...room, [name]: value});
    }

    useEffect(() => {
        form.setFieldsValue(room);
    }, []);

    const onFinish = () => {
        console.log(room);
        // const data = {
        //     room_name: room.name,
        //     capacity: room.capacity,
        //     activate: room.activate,
        // };

        // if (room.camera != undefined) {
        //     data
        // }

        // RoomService.updateRoom(room_id, room)
        //     .then((response: any) => {
        //         console.log(response);
        //         setRoom({
        //             _id: response.data._id,
        //             name: response.data.room_name,
        //             activate: response.data.activate,
        //             capacity: response.data.capacity,
        //             camera: response.data.camera,
        //         });
        //         message.success(`Created room ${response.data.room_name} successfully.`);
        //         setSubmitted(true);
        //         onReset();
        //     })
        //     .catch((e: Error) => {
        //         if (axios.isAxiosError(e)) {
        //             console.log(e);
        //             message.error(`Could not create room cause ${e.request.response}`);
        //         } else {
        //             console.error(e);
        //         }
        //     });
    };

    const onFinishFailed = () => {
        console.log('Submit failed!');
    };

    const newRoom = () => {
        setRoom(initialRoomState);
        setSubmitted(false);
    }

    const onReset = () => {
        form.resetFields();
    };

    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleOk = () => {
        setOpen(false);
    };


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
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        labelCol={{
                            flex: '110px',
                            span: 8
                        }}
                        labelAlign="left"
                        labelWrap
                        wrapperCol={{
                            // flex: 1,
                            span: 16
                        }}
                        colon={false}
                        style={{
                            maxWidth: 1000,
                        }}
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
                            name="activate"
                            rules={[
                                {
                                    required: true, message: 'Please choose status of the room!'
                                },
                            ]}
                        >
                            <Checkbox />
                        </Form.Item>

                        <Form.List name="camera">
                            {(fields, {add, remove}) => (
                                <div style={{display: 'flex', flexDirection: 'column', rowGap: 16}}>
                                    {/*<>*/}
                                    {fields.map((field) => (
                                        <Card
                                            size="small"
                                            title={`Camera ${field.name + 1}`}
                                            key={field.key}
                                            extra={
                                                <CloseOutlined
                                                    onClick={() => {
                                                        remove(field.name);
                                                    }}
                                                />
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
                                                <Input/>
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
                                <Button type="primary" htmlType="submit">
                                    Update
                                </Button>
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
