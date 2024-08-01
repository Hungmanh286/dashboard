import {RoomList} from "./Card/RoomList";
import {useAppSelector} from "../store/hooks";
import {Navigate, useNavigate} from "react-router-dom";
import Dashboard from "./Table/Table";
import React, {useState} from "react";
import {Divider, Radio} from 'antd';
import type { RadioChangeEvent } from 'antd';


const tabList = [
    {
        key: 'card',
        label: 'card',
    },
    {
        key: 'table',
        label: 'table',
    }
];

const contentList: Record<string, React.ReactNode> = {
    card: <div><RoomList/></div>,
    table: <div><Dashboard/></div>,
};


export function Home() {
    const {user: currentUser} = useAppSelector((state) => state.auth);

    const [activeTabKey, setActiveTabKey] = useState<string>('card');

    const onTabChange = (e: RadioChangeEvent) => {
        setActiveTabKey(e.target.value);
    };

    if (!currentUser) {
        return <Navigate to="/login"/>;
    }


    return (
        <div>
            <Divider orientation="left" style={{fontWeight: 'bold', fontSize: 'large'}}>Dashboard</Divider>

            <div style={{
                padding: '0 25px'
            }}>
                <Radio.Group onChange={onTabChange} value={activeTabKey} size="large">
                    <Radio.Button value="card">Card</Radio.Button>
                    <Radio.Button value="table">Table</Radio.Button>
                </Radio.Group>
            </div>
            <div style={{
                padding: '25px'
            }}>
                {contentList[activeTabKey]}
            </div>
        </div>
    );
}