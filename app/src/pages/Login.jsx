
import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axiosClient.post('/users/login', values);
            message.success('Đăng nhập thành công!');
            localStorage.setItem('token', response.token);

            window.location.href = '/';
        } catch (error) {
            message.error(error.response?.data?.message || 'Lỗi kết nối đến máy chủ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title="ĐĂNG NHẬP HỆ THỐNG HRM" style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Form name="login" onFinish={onFinish} layout="vertical">
                    <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Tài khoản (VD: admin1)" size="large" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Text type="secondary">Chưa có tài khoản? </Text>
                        <Link to="/register">Đăng ký ngay</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
