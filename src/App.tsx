import React, {useCallback, useEffect, useState} from 'react';
import {Routes, Route, Router, Link, Navigate, useNavigate, useLocation} from "react-router-dom";
import './App.css';
import {RoomList} from "./components/RoomList";
import AddRoom from "./components/AddRoom";
import {MenuProps, Breadcrumb, Layout, Menu, theme} from 'antd';
import {UserOutlined, SettingOutlined,
    ScheduleOutlined, HomeOutlined, LoginOutlined,
    LogoutOutlined} from '@ant-design/icons';
import './logo.svg';
import {useAppDispatch, useAppSelector} from "./store/hooks";
import {UserToken} from "./types/user.type";
import {Home} from "./components/Home";
import {Login} from "./components/Login";
import {logout} from "./store/authSlice";
import {useSub} from "./common/EventBus";

const {Header, Content, Footer} = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function App() {
    let [showAddRoom, setShowAddRoom] = useState(false);
    let [showSetting, setShowSetting] = useState(false);

    const location = useLocation();
    const [currentPath, setCurrentPath] = useState(location.pathname);
    const navigate = useNavigate();

    const {user: currentUser} = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (currentUser) {
            setShowAddRoom(currentUser.role.includes("admin"));
            setShowSetting(currentUser.role.includes("admin"));
        } else {
            setShowAddRoom(false);
            setShowSetting(false);
        }

        if (!currentUser && currentPath != '/login') {
            setCurrentPath("/login");
            navigate('/login');
        }
    }, [])

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrentPath(e.key);
        if (e.key == '/logout') {
            _logout();
        } else {
            navigate(e.key);
        }
    };

    if (currentUser && currentUser.role.includes("admin")) {
        showAddRoom = true;
        showSetting = true;
    } else {
        showAddRoom = false;
        showSetting = false;
    }

    const items: MenuItem[] = []

    if (!currentUser) {
        items.push({
            label: 'Login',
            key: '/login',
            icon: <LoginOutlined/>,
            disabled: false,
        })
    } else {
        items.push({
            label: 'Home',
            key: '/home',
            icon: <HomeOutlined/>,
            disabled: false,
        },)
    }

    if (showAddRoom) items.push({
        label: 'Add Room',
        key: '/add',
        icon: <ScheduleOutlined/>,
    })

    if (showSetting) items.push({
        label: 'Setting',
        key: '/setting',
        icon: <SettingOutlined/>,
        disabled: false,
    })

    if (currentUser) {
        items.push({
            label: 'Profile',
            key: 'profile',
            icon: <UserOutlined/>,
            children: [
                {
                    label: 'User',
                    key: '/user',
                },
                {
                    label: 'Logout',
                    key: '/logout',
                    icon: <LoginOutlined/>
                }
            ],
        })
    }

    const _logout = () => {
        dispatch(logout());
        setCurrentPath("/login");
        navigate("/login");
        // window.location.reload();
    }

    const logOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    useSub('logout', () => {
        logOut();
    })

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
                    selectedKeys={[currentPath]}
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
                            <Route path="/" element={<Home/>}/>
                            <Route path="/home" element={<Home/>}/>
                            <Route path="/add" element={<AddRoom/>}/>
                            <Route path="/login" element={<Login/>}/>
                        </Routes>
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Design ©{new Date().getFullYear()} Created by C5
            </Footer>

            {/*<AuthVerify logOut={logOut} />*/}
        </Layout>
    );
}

export default App;
