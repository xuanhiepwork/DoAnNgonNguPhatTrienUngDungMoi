import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Avatar, Tag, Space, message, Modal, Form, Input, Select, Upload } from 'antd';
import { UserAddOutlined, UploadOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    // Kiểm tra token an toàn để tránh crash ứng dụng
    const token = localStorage.getItem('token');
    let user = { role: 'user' }; // Mặc định là user nếu không có token
    try {
        if (token) {
            user = JSON.parse(atob(token.split('.')[1]));
        }
    } catch (e) {
        console.error("Token không hợp lệ");
    }

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const data = await axiosClient.get('/employees');
            setEmployees(data);
        } catch (error) {
            message.error('Lỗi tải danh sách nhân sự');
        }
        setLoading(false);
    };

    useEffect(() => { fetchEmployees(); }, []);

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
            message.success('Thêm nhân viên thành công!');
            setIsModalOpen(false);
            form.resetFields();
            fetchEmployees();
        } catch (error) {
            message.error('Thêm thất bại!');
        }
    };

    const columns = [
        {
            title: 'Ảnh thẻ',
            dataIndex: 'avatar',
            width: 100,
            render: (url) => {
                const src = url && url.startsWith('http') ? url : `http://localhost:8080${url}`;
                return <Avatar src={src} icon={<TeamOutlined />} size={60} style={{ border: '2px solid #1890ff' }} />;
            }
        },
        {
            title: 'Họ và Tên',
            dataIndex: 'full_name',
            render: (text) => <b style={{ color: '#1890ff' }}>{text}</b>
        },
        {
            title: 'Phòng ban',
            dataIndex: 'dept_name',
            render: (dept) => <Tag color="geekblue">{dept || 'Chưa xếp'}</Tag>
        },
        {
            title: 'Chức vụ',
            dataIndex: 'pos_name',
            render: (pos) => <Tag color="green">{pos || 'Nhân viên'}</Tag>
        },
        {
            title: 'Quê quán',
            dataIndex: 'hometown',
            render: (text) => <span><EnvironmentOutlined /> {text}</span>
        },
    ];

    return (
        <Card
            title={<span><TeamOutlined /> QUẢN LÝ NHÂN SỰ CHUYÊN SÂU</span>}
            // ĐÃ SỬA LỖI CÚ PHÁP Ở ĐÂY
            extra={
                user.role === 'admin' && (
                    <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsModalOpen(true)}>
                        Thêm nhân viên
                    </Button>
                )
            }
        >
            <Table columns={columns} dataSource={employees} rowKey="id" loading={loading} bordered pagination={{ pageSize: 5 }} />

            <Modal title="Hồ sơ nhân viên mới" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} okText="Lưu hồ sơ" cancelText="Đóng">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="full_name" label="Họ và Tên" rules={[{ required: true, message: 'Nhập tên nhân viên!' }]}><Input placeholder="Nguyễn Văn A" /></Form.Item>
                    <Space size="large">
                        <Form.Item name="department_id" label="Phòng ban" rules={[{ required: true }]} style={{ width: 200 }}>
                            <Select placeholder="Chọn phòng" options={[{ value: 1, label: 'Kỹ thuật' }, { value: 2, label: 'Nhân sự' }, { value: 3, label: 'Kinh doanh' }]} />
                        </Form.Item>
                        <Form.Item name="position_id" label="Chức vụ" rules={[{ required: true }]} style={{ width: 200 }}>
                            <Select placeholder="Chọn chức vụ" options={[{ value: 1, label: 'Trưởng phòng' }, { value: 2, label: 'Nhân viên' }, { value: 3, label: 'Thực tập sinh' }]} />
                        </Form.Item>
                    </Space>
                    <Form.Item name="hometown" label="Quê quán"><Input placeholder="Hà Nội, TP.HCM..." /></Form.Item>
                    <Form.Item name="avatar" label="Ảnh thẻ nhân viên (Tỷ lệ 3x4)">
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