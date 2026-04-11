
import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Tag, message, Space, Typography, Modal, Form, InputNumber } from 'antd';
import { DollarOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const { Text } = Typography;

const Payroll = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const fetchPayroll = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/payroll');
            setData(res);
        } catch (error) { message.error('Lỗi tải bảng lương'); }
        setLoading(false);
    };

    useEffect(() => { fetchPayroll(); }, []);

    const handlePay = async (id) => {
        try {
            await axiosClient.put(`/payroll/pay/${id}`);
            message.success('Đã xác nhận thanh toán!');
            fetchPayroll();
        } catch (error) { message.error('Thanh toán thất bại'); }
    };

    const handleGenerate = async (values) => {
        try {
            await axiosClient.post('/payroll/generate', values);
            message.success(`Đã tạo bảng lương tháng ${values.month}/${values.year}`);
            setIsModalOpen(false);
            fetchPayroll();
        } catch (error) {
            message.error(error.response?.data?.message || 'Khởi tạo thất bại');
        }
    };

    const columns = [
        { title: 'Nhân viên', dataIndex: 'full_name', key: 'full_name' },
        { title: 'Phòng ban', dataIndex: 'dept_name', key: 'dept_name' },
        { title: 'Kỳ lương', render: (record) => <Tag color="blue">{record.month}/{record.year}</Tag> },
        {
            title: 'Lương cơ bản',
            dataIndex: 'base_salary',
            render: (val) => `${Number(val).toLocaleString()} đ`
        },
        {
            title: 'Trừ (Nghỉ phép)',
            dataIndex: 'deductions',
            render: (val) => <Text type="danger">-{Number(val).toLocaleString()} đ</Text>
        },
        {
            title: 'Thực nhận',
            dataIndex: 'net_salary',
            render: (val) => <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>{Number(val).toLocaleString()} đ</Text>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={status === 'Paid' ? 'green' : 'orange'}>
                    {status === 'Paid' ? 'ĐÃ TRẢ' : 'CHỜ CHI'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            render: (_, record) => record.status === 'Pending' && (
                <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handlePay(record.id)}>
                    Trả lương
                </Button>
            )
        }
    ];

    return (
        <Card
            title={<span><DollarOutlined /> QUẢN LÝ CHI TRẢ LƯƠNG</span>}
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    Tạo bảng lương tháng mới
                </Button>
            }
        >
            <Table columns={columns} dataSource={data} rowKey="id" loading={loading} bordered />

            <Modal
                title="Khởi tạo bảng lương"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                okText="Tạo bảng lương"
            >
                <Form form={form} layout="vertical" onFinish={handleGenerate}>
                    <Space size="large">
                        <Form.Item name="month" label="Tháng" rules={[{ required: true }]}>
                            <InputNumber min={1} max={12} placeholder="Tháng (1-12)" />
                        </Form.Item>
                        <Form.Item name="year" label="Năm" rules={[{ required: true }]}>
                            <InputNumber min={2020} max={2100} placeholder="Năm (VD: 2024)" />
                        </Form.Item>
                    </Space>
                </Form>
            </Modal>
        </Card>
    );
};

export default Payroll;
