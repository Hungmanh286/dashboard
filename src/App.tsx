import React, {useState} from 'react';
import {Routes, Route, Link, useNavigate, useLocation} from "react-router-dom";
import './App.css';
import {RoomList} from "./components/RoomList";
import AddRoom from "./components/AddRoom";
import {MenuProps, Breadcrumb, Layout, Menu, theme} from 'antd';
import {SettingOutlined, ScheduleOutlined, HomeOutlined} from '@ant-design/icons';
import './logo.svg';

const {Header, Content, Footer} = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function App() {
    const location = useLocation();
    const [current, setCurrent] = useState(location.pathname);
    const navigate = useNavigate()
    const items: MenuItem[] = [
        {
            label: 'Home',
            key: '/home',
            icon: <HomeOutlined/>,
        },
        {
            label: 'Add Room',
            key: '/add',
            icon: <ScheduleOutlined/>,
            disabled: false,
        },
        {
            label: 'Setting',
            key: '/setting',
            icon: <SettingOutlined/>,
            disabled: false,
        },
    ]

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
        navigate(e.key);
    };

    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 'calc(10px + 2vmin)',
                }}
            >
                {/*<div className="logo.svg"/>*/}
                <Menu
                    theme="dark"
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="horizontal"
                    items={items}
                    style={{flex: 1, minWidth: 0}}
                />
            </Header>

            <Content
                style={{
                    padding: '30px 40px 0 48px',
                    // margin: '16px 0'
                }}
            >
                <div className="App-body">
                    <Routes>
                        <Route path="/" element={<RoomList/>}/>
                        <Route path="/home" element={<RoomList/>}/>
                        <Route path="/add" element={<AddRoom/>}/>
                    </Routes>
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                VTX Design ©{new Date().getFullYear()} Created by C5
            </Footer>
        </Layout>
    );
}

export default App;
