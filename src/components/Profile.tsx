import React, { useEffect, useState } from "react";
import { Avatar, Upload, Form, Input, Button, message } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { UserBase, UserCreate, UserLogin } from "../types/user.type";
import UserService from "../services/user.service";
import axios from "axios";
import { updateUser } from "../store/userSlice";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const Profile = () => {
    const { user: currentUser } = useAppSelector((state) => state.auth);
    const users = useAppSelector((state) => state.users.users);
    const [form] = Form.useForm<UserCreate & UserLogin>();
    const [user, setUser] = useState<UserBase>(users[0]);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const getCurrentUser = () => {
        UserService.readUserMe()
            .then(async (response: any) => {
                setUser(response.data);
                console.log("User from response.data:", response.data)
                console.log("user from response.data:", user);
            })
            .catch((e: any) => {
                console.log(e.error);
            })
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    form.setFieldsValue(user);

    const handleWatchForm = Form.useWatch((values) => {
        //console.log();
    }, form)

    // console.log(currentUser)
    // console.log("user", user);

    const onFinish = () => {
        const values = form.getFieldsValue();
        const id = values._id ? values._id : "";
        console.log("id:", id);
        console.log("form values:", values);

        UserService.updateUser(id, values)
            .then((response: any) => {
                dispatch(updateUser(values));
                message.success(`Updated user successfully.`);
                setSubmitted(true);
            })
            .catch((e: Error) => {
                if (axios.isAxiosError(e)) {
                    console.log(e);
                    message.error(`Could not update user cause ${e.request.response}`);
                    console.log(e.request.response)
                } else {
                    console.error(e);
                }
            });
    }

    const onFinishFailed = () => {
        console.log('failed')
    }

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const uploadButton = (
        <div style={{ position: "relative", width: '101px', height: '101px' }}>
            

            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
                textAlign: 'center',
                color: '#000'
            }}>
                {loading ? <LoadingOutlined /> : <Avatar
                shape="square"
                icon={<UserOutlined />}
                size={101}
            />}
            </div>
        </div>

    );

    return (
        <div className="card" style={{
            display: "flex",
            borderRadius: "8px",
            overflow: "hidden",
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div className="profile-section" style={{
                textAlign: "center",
                color: "black",
                padding: "20px",
                width: "100%",
                background: "#f5f5f5",
                height: "10%",
                display: 'block',
                marginBottom: '30px'
            }}>
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    //action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
                <p>{currentUser?.username}</p>
                <p style={{ fontSize: 12 }}>{currentUser?.role}</p>
            </div>
            <div className="info-section" style={{ display: 'block', alignItems: 'center', width: '100vh' }}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    labelCol={{
                        flex: '110px',
                        span: 16
                    }}
                    labelAlign="left"
                    labelWrap
                    wrapperCol={{
                        // flex: 1,
                        span: 16
                    }}
                    colon={false}
                    style={{
                        maxWidth: "100vh",
                    }}
                >
                    <Form.Item<UserBase>
                        label="Full name"
                        name="full_name"
                        initialValue={"guest"}
                        rules={[
                            { required: false, message: "Please enter your full name!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<UserBase>
                        label="Email"
                        name="email"
                        rules={[
                            { required: false, message: "Please enter your email!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<UserBase>
                        label="Phone number"
                        name="phone"
                        rules={[
                            { required: false, message: "Please enter your phone number!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<UserCreate>
                        label="Password"
                        name="password"
                        rules={[
                            { required: false, message: "Please enter your password!" },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<UserBase>
                        name="_id"
                    >
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
export default Profile;