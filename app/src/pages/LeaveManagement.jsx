
import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Card, message, notification } from 'antd';
import { CheckOutlined, CloseOutlined, BellOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import axiosClient from '../api/axiosClient';

// const socket = io(process.env.SOCKET_IO_SERVER);
const socket = io('http://localhost:8080');

const LeaveManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await axiosClient.get('/leave/all');
            setRequests(data);
        } catch (error) { message.error('Lỗi tải danh sách nghỉ phép'); }
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
        socket.on('new_leave_request', (data) => {
            notification.open({
                message: 'CÓ ĐƠN NGHỈ PHÉP MỚI',
                description: data.message,
                icon: <BellOutlined style={{ color: '#108ee9' }} />,
            });
            fetchRequests();
        });

        return () => socket.off('new_leave_request');
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await axiosClient.put(`/leave/status/${id}`, { status });
            message.success('Đã cập nhật trạng thái đơn');
            fetchRequests();
        } catch (error) { message.error('Cập nhật thất bại'); }
    };

    const columns = [
        { title: 'Nhân viên', dataIndex: 'full_name', key: 'full_name' },
        { title: 'Từ ngày', dataIndex: 'start_date', key: 'start_date' },
        { title: 'Đến ngày', dataIndex: 'end_date', key: 'end_date' },
        { title: 'Lý do', dataIndex: 'reason', key: 'reason' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'gold'}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            render: (_, record) => record.status === 'Pending' && (
                <Space>
                    <Button type="primary" success icon={<CheckOutlined />} onClick={() => handleUpdateStatus(record.id, 'Approved')}>Duyệt</Button>
                    <Button danger icon={<CloseOutlined />} onClick={() => handleUpdateStatus(record.id, 'Rejected')}>Từ chối</Button>
                </Space>
            )
        }
    ];

    return (
        <Card title="DANH SÁCH DUYỆT NGHỈ PHÉP">
            <Table columns={columns} dataSource={requests} rowKey="id" loading={loading} />
        </Card>
    );
};

export default LeaveManagement;
