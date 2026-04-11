import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Card, Row, Col, Statistic } from 'antd';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';

import {
    DesktopOutlined, TeamOutlined, LogoutOutlined, FormOutlined,
    BellOutlined, DollarOutlined, FieldTimeOutlined, BankOutlined,
    WalletOutlined, LaptopOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const { Header, Content, Sider } = Layout;

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
    } catch (e) { return null; }
};

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [stats, setStats] = useState({ workingDays: 0, pendingLeaves: 0, latestSalary: 0 });
    const [adminStats, setAdminStats] = useState({ totalEmployees: 0, totalProducts: 0, pendingLeaves: 0, attendanceToday: 0 });

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const token = localStorage.getItem('token');
    const user = token ? decodeToken(token) : { role: 'user' };
    const selectedMenuKey = (() => {
        if (location.pathname === '/') return 'home';
        if (location.pathname.startsWith('/products')) return '1';
        if (location.pathname.startsWith('/employees')) return '2';
        if (location.pathname.startsWith('/leave-request')) return '3';
        if (location.pathname.startsWith('/leave-management')) return '4';
        if (location.pathname.startsWith('/payroll')) return '5';
        if (location.pathname.startsWith('/attendance')) return '6';
        return 'home';
    })();

    useEffect(() => {
        if (location.pathname === '/') {
            if (user?.role === 'user') {
                axiosClient.get('/dashboard/my-stats')
                    .then(res => setStats(res))
                    .catch(e => console.log("Lỗi tải thống kê nhân viên"));
            } else if (user?.role === 'admin') {
                axiosClient.get('/dashboard/admin-stats')
                    .then(res => setAdminStats(res))
                    .catch(e => console.log("Lỗi tải thống kê admin"));
            }
        }
    }, [location.pathname, user?.role]);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="dark">
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', color: 'white', textAlign: 'center', lineHeight: '32px', fontWeight: 'bold' }}>HRM SYSTEM</div>
                <Menu theme="dark" selectedKeys={[selectedMenuKey]} mode="inline">
                    <Menu.Item key="home" icon={<BankOutlined />}><Link to="/">Trang chủ</Link></Menu.Item>
                    <Menu.Item key="1" icon={<DesktopOutlined />}><Link to="/products">Tài sản / Thiết bị</Link></Menu.Item>
                    <Menu.Item key="2" icon={<TeamOutlined />}><Link to="/employees">Nhân sự</Link></Menu.Item>
                    <Menu.Item key="6" icon={<FieldTimeOutlined />}><Link to="/attendance">Chấm công</Link></Menu.Item>
                    <Menu.Item key="3" icon={<FormOutlined />}><Link to="/leave-request">Xin nghỉ phép</Link></Menu.Item>
                    {user?.role === 'admin' && <Menu.Item key="4" icon={<BellOutlined />}><Link to="/leave-management">Duyệt nghỉ phép</Link></Menu.Item>}
                    {user?.role === 'admin' && <Menu.Item key="5" icon={<DollarOutlined />}><Link to="/payroll">Thanh toán lương</Link></Menu.Item>}
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
                </Header>
                <Content style={{ margin: '16px' }}>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
                        {location.pathname === '/' ? (
                            <div>
                                <h2 style={{ marginBottom: 30, textAlign: 'center', fontWeight: 'bold', color: '#1890ff' }}>
                                    CHÀO MỪNG BẠN ĐẾN VỚI HỆ THỐNG
                                </h2>

                                {user?.role === 'user' && (
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Card bordered={false} style={{ background: '#e6f7ff' }}>
                                                <Statistic title="Ngày công tháng này" value={stats.workingDays} suffix="/ 22" prefix={<FieldTimeOutlined />} valueStyle={{ color: '#1890ff' }} />
                                            </Card>
                                        </Col>
                                        <Col span={8}>
                                            <Card bordered={false} style={{ background: '#fffb8f' }}>
                                                <Statistic title="Đơn nghỉ phép chờ duyệt" value={stats.pendingLeaves} prefix={<FormOutlined />} valueStyle={{ color: '#faad14' }} />
                                            </Card>
                                        </Col>
                                        <Col span={8}>
                                            <Card bordered={false} style={{ background: '#f6ffed' }}>
                                                <Statistic title="Lương thực nhận gần nhất" value={stats.latestSalary} suffix="VNĐ" prefix={<WalletOutlined />} valueStyle={{ color: '#52c41a' }} />
                                            </Card>
                                        </Col>
                                    </Row>
                                )}

                                {user?.role === 'admin' && (
                                    <Row gutter={[16, 16]}>
                                        <Col span={6}>
                                            <Card bordered={false} style={{ background: '#e6f7ff' }}>
                                                <Statistic
                                                    title="Tổng Nhân sự"
                                                    value={adminStats.totalEmployees}
                                                    prefix={<TeamOutlined />}
                                                    valueStyle={{ color: '#1890ff' }}
                                                />
                                            </Card>
                                        </Col>
                                        <Col span={6}>
                                            <Card bordered={false} style={{ background: '#f6ffed' }}>
                                                <Statistic
                                                    title="Đi làm hôm nay"
                                                    value={adminStats.attendanceToday}
                                                    prefix={<CheckCircleOutlined />}
                                                    valueStyle={{ color: '#52c41a' }}
                                                />
                                            </Card>
                                        </Col>
                                        <Col span={6}>
                                            <Card bordered={false} style={{ background: '#fffb8f' }}>
                                                <Statistic
                                                    title="Đơn phép cần duyệt"
                                                    value={adminStats.pendingLeaves}
                                                    prefix={<BellOutlined />}
                                                    valueStyle={{ color: '#faad14' }}
                                                />
                                            </Card>
                                        </Col>
                                        <Col span={6}>
                                            <Card bordered={false} style={{ background: '#fff0f6' }}>
                                                <Statistic
                                                    title="Tổng Tài sản/Thiết bị"
                                                    value={adminStats.totalProducts}
                                                    prefix={<LaptopOutlined />}
                                                    valueStyle={{ color: '#eb2f96' }}
                                                />
                                            </Card>
                                        </Col>
                                    </Row>
                                )}
                            </div>
                        ) : (
                            <Outlet />
                        )}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;