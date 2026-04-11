
import React from 'react';
import { Form, DatePicker, Input, Button, Card, message } from 'antd';
import axiosClient from '../api/axiosClient';

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
    } catch (e) { return {}; }
};

const LeaveRequest = () => {
    const [form] = Form.useForm();
    const token = localStorage.getItem('token');
    const user = token ? decodeToken(token) : {};

    const onFinish = async (values) => {
        const data = {
            employee_id: user.employee_id,
            full_name: user.username,
            start_date: values.range[0].format('YYYY-MM-DD'),
            end_date: values.range[1].format('YYYY-MM-DD'),
            reason: values.reason
        };

        try {
            await axiosClient.post('/leave/create', data);
            message.success('Đã gửi đơn, chờ sếp duyệt nhé!');
            form.resetFields();
        } catch (error) { message.error(error.response?.data?.message || 'Gửi đơn thất bại!'); }
    };

    return (
        <Card title="XIN NGHỈ PHÉP">
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="range" label="Thời gian nghỉ" rules={[{ required: true }]}>
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="reason" label="Lý do nghỉ" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} placeholder="Ghi rõ lý do (Đi cưới người yêu cũ=(( huhu))...)" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>Gửi</Button>
            </Form>
        </Card>
    );
};

export default LeaveRequest;
