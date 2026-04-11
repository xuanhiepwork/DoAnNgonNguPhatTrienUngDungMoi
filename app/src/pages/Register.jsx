
import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Text } = Typography;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axiosClient.post('/users/register', values);
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login');
        } catch (error) {
            message.error(error.response?.data?.message || 'Tên tài khoản hoặc Email đã tồn tại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title="ĐĂNG KÝ TÀI KHOẢN MỚI" style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="full_name" label="Họ và Tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                        <Input prefix={<IdcardOutlined />} placeholder="Ví dụ: Trần Xuân Hiệp" />
                    </Form.Item>

                    <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Ví dụ: hiep_dev" />
                    </Form.Item>

                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
                        <Input prefix={<MailOutlined />} placeholder="email@congty.com" />
                    </Form.Item>

                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu ít nhất 6 ký tự" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                            Đăng ký tài khoản
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Text type="secondary">Đã có tài khoản? </Text>
                        <Link to="/login">Đăng nhập</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;
