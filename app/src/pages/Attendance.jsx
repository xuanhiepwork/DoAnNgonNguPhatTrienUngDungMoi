import React, { useEffect, useState } from 'react';
import { Card, Button, Table, message, Typography } from 'antd';
import { CheckCircleOutlined, FieldTimeOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const { Title } = Typography;

const Attendance = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');
    let user = {};

    try {
        user = token ? JSON.parse(atob(token.split('.')[1])) : {};
    } catch (error) {
        console.error('Token khong hop le', error);
    }

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/attendance');
            setData(Array.isArray(res) ? res : []);
        } catch (error) {
            message.error(error.response?.data?.message || 'Loi tai du lieu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const handleCheckIn = async () => {
        try {
            await axiosClient.post('/attendance/checkin');
            message.success('Cham cong thanh cong');
            fetchAttendance();
        } catch (error) {
            message.error(error.response?.data?.message || 'Cham cong that bai');
        }
    };

    const columns = [
        { title: 'Nhan vien', dataIndex: 'full_name', key: 'full_name' },
        { title: 'Ngay', dataIndex: 'date', render: (val) => new Date(val).toLocaleDateString('vi-VN') },
        { title: 'Gio vao', dataIndex: 'time_in', render: (val) => <b style={{ color: '#1890ff' }}>{val}</b> },
    ];

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {user.role !== 'admin' && (
                <Card style={{ textAlign: 'center', marginBottom: 20, background: '#e6f7ff' }}>
                    <Title level={4}>CHAM CONG HANG NGAY</Title>
                    <Button type="primary" size="large" icon={<CheckCircleOutlined />} onClick={handleCheckIn}>
                        Nhan de check-in hom nay
                    </Button>
                </Card>
            )}

            <Card title={<span><FieldTimeOutlined /> LICH SU CHAM CONG</span>}>
                <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />
            </Card>
        </div>
    );
};

export default Attendance;
