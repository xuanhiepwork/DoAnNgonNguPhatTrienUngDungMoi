import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { DesktopOutlined, TeamOutlined, LogoutOutlined, FormOutlined, BellOutlined, DollarOutlined, FieldTimeOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const token = localStorage.getItem('token');
    let user = { role: 'user' };
    try {
        if (token) user = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.error("Lỗi token");
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="dark">
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', color: 'white', textAlign: 'center', lineHeight: '32px', fontWeight: 'bold' }}>
                    HRM SYSTEM
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" icon={<DesktopOutlined />}>
                        <Link to="/products">Tài sản / Thiết bị</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<TeamOutlined />}>
                        <Link to="/employees">Nhân sự</Link>
                    </Menu.Item>
                    <Menu.Item key="6" icon={<FieldTimeOutlined />}>
                        <Link to="/attendance">Chấm công</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<FormOutlined />}>
                        <Link to="/leave-request">Xin nghỉ phép</Link>
                    </Menu.Item>

                    {user.role === 'admin' && (
                        <Menu.Item key="4" icon={<BellOutlined />}>
                            <Link to="/leave-management">Duyệt nghỉ phép</Link>
                        </Menu.Item>
                    )}

                    {user.role === 'admin' && (
                        <Menu.Item key="5" icon={<DollarOutlined />}>
                            <Link to="/payroll">Thanh toán lương</Link>
                        </Menu.Item>
                    )}
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                        Đăng xuất
                    </Button>
                </Header>
                <Content style={{ margin: '16px' }}>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;