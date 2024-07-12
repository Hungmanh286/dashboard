import React, {useEffect, useState} from 'react'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import type {FormProps} from 'antd';
import {Alert, Button, Checkbox, Form, Input} from 'antd';
import {UserLogin, UserToken} from "../types/user.type";
import {IRoomInfo} from "../types/IRoomData.type";
import {Navigate, useNavigate} from "react-router-dom";
import {login} from "../store/authSlice";

export const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    // const [userLogin, setUserLogin] = useState<IRoomInfo>(initialRoomState);
    const [message, setMessage] = useState("");

    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

    const dispatch = useAppDispatch()

    const onFinish: FormProps<UserLogin>['onFinish'] = (userLogin: UserLogin) => {
        setLoading(true);

        dispatch(login(userLogin))
            .unwrap()
            .then((originalPromiseResult) => {
                // handle result here
                navigate("/home");
                window.location.reload();
            })
            .catch((rejectedValueOrSerializedError) => {
                // handle error here
                setMessage("Wrong user name or password")
                setLoading(false);
            })
    };

    const onFinishFailed: FormProps<UserLogin>['onFinishFailed'] = (errorInfo) => {
        // console.log('Failed:', errorInfo);
    };

    if (isLoggedIn) {
        return <Navigate to="/home"/>
    }

    return (
        <div>
            <Form
                labelCol={{span: 8}}
                wrapperCol={{span: 36}}
                style={{width: 600}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<UserLogin>
                    label="Username"
                    name="username"
                    rules={[{
                        min: 3,
                        max: 100,
                        required: true,
                        message: 'Please input your username with at least 3 characters!'
                    }]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<UserLogin>
                    label="Password"
                    name="password"
                    rules={[{
                        min: 6,
                        max: 100,
                        required: true,
                        message: 'Please input your password with at least 6 characters!'
                    }]}
                >
                    <Input.Password/>
                </Form.Item>

                {/*<Form.Item<UserLogin>*/}
                {/*    name="remember"*/}
                {/*    valuePropName="checked"*/}
                {/*    wrapperCol={{offset: 8, span: 16}}*/}
                {/*>*/}
                {/*    <Checkbox>Remember me</Checkbox>*/}
                {/*</Form.Item>*/}
                {
                    message && <Alert message={message}/>
                }

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit"
                            loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}