
import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Avatar, Tag, Space, message, Modal, Form, Input, Select, Upload } from 'antd';
import { UserAddOutlined, UploadOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
    } catch (e) { return { role: 'user' }; }
};

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const token = localStorage.getItem('token');
    const user = token ? decodeToken(token) : { role: 'user' };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const data = await axiosClient.get('/employees');
            setEmployees(Array.isArray(data) ? data : []);
        } catch (error) {
            message.error(error.response?.data?.message || 'Loi tai danh sach nhan su');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append('full_name', values.full_name);
        formData.append('department_id', values.department_id);
        formData.append('position_id', values.position_id);
        formData.append('hometown', values.hometown || '');

        if (values.avatar?.fileList && values.avatar.fileList[0]) {
            formData.append('avatar', values.avatar.fileList[0].originFileObj);
        }

        try {
            await axiosClient.post('/employees', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            message.success('Them nhan vien thanh cong');
            setIsModalOpen(false);
            form.resetFields();
            fetchEmployees();
        } catch (error) {
            message.error(error.response?.data?.message || 'Them that bai');
        }
    };

    const columns = [
        {
            title: 'Anh the',
            dataIndex: 'avatar',
            width: 100,
            render: (url) => {
                const src = url
                    ? (url.startsWith('http') ? url : `http://localhost:8080${url}`)
                    : undefined;
                return <Avatar src={src} icon={<TeamOutlined />} size={60} style={{ border: '2px solid #1890ff' }} />;
            }
        },
        {
            title: 'Ho va Ten',
            dataIndex: 'full_name',
            render: (text) => <b style={{ color: '#1890ff' }}>{text}</b>
        },
        {
            title: 'Phong ban',
            dataIndex: 'dept_name',
            render: (dept) => <Tag color="geekblue">{dept || 'Chua xep'}</Tag>
        },
        {
            title: 'Chuc vu',
            dataIndex: 'pos_name',
            render: (pos) => <Tag color="green">{pos || 'Nhan vien'}</Tag>
        },
        {
            title: 'Que quan',
            dataIndex: 'hometown',
            render: (text) => <span><EnvironmentOutlined /> {text}</span>
        },
    ];

    return (
        <Card
            title={<span><TeamOutlined /> QUAN LY NHAN SU</span>}
            extra={
                user.role === 'admin' && (
                    <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsModalOpen(true)}>
                        Them nhan vien
                    </Button>
                )
            }
        >
            <Table columns={columns} dataSource={employees} rowKey="id" loading={loading} bordered pagination={{ pageSize: 5 }} />

            <Modal title="Ho so nhan vien moi" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} okText="Luu ho so" cancelText="Dong">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="full_name" label="Ho va Ten" rules={[{ required: true, message: 'Nhap ten nhan vien' }]}>
                        <Input placeholder="Nguyen Van A" />
                    </Form.Item>
                    <Space size="large">
                        <Form.Item name="department_id" label="Phong ban" rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]} style={{ width: 200 }}>
                            <Select allowClear placeholder="Chon phong" options={[
                                { value: 1, label: 'Ky thuat' },
                                { value: 2, label: 'Nhan su' },
                                { value: 3, label: 'Kinh doanh' }
                            ]} />
                        </Form.Item>
                        <Form.Item name="position_id" label="Chuc vu" rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]} style={{ width: 200 }}>
                            <Select allowClear placeholder="Chon chuc vu" options={[
                                { value: 1, label: 'Truong phong' },
                                { value: 2, label: 'Nhan vien' },
                                { value: 3, label: 'Thuc tap sinh' }
                            ]} />
                        </Form.Item>
                    </Space>
                    <Form.Item name="hometown" label="Que quan">
                        <Input placeholder="Ha Noi, TP.HCM..." />
                    </Form.Item>
                    <Form.Item name="avatar" label="Anh the nhan vien">
                        <Upload beforeUpload={() => false} listType="picture" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Chọn ảnh đại diện</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default EmployeeManagement;
