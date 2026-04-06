import React from 'react';
import { Form, DatePicker, Input, Button, Card, message } from 'antd';
import axiosClient from '../api/axiosClient';

const LeaveRequest = () => {
    const [form] = Form.useForm();
    const user = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));

    const onFinish = async (values) => {
        const data = {
            employee_id: user.id,
            full_name: user.username, // Lấy từ token
            start_date: values.range[0].format('YYYY-MM-DD'),
            end_date: values.range[1].format('YYYY-MM-DD'),
            reason: values.reason
        };

        try {
            await axiosClient.post('/leave/create', data);
            message.success('Đã gửi đơn, chờ sếp duyệt nhé!');
            form.resetFields();
        } catch (error) { message.error('Gửi đơn thất bại!'); }
    };

    return (
        <Card title="XIN NGHỈ PHÉP">
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="range" label="Thời gian nghỉ" rules={[{ required: true }]}>
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="reason" label="Lý do nghỉ" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} placeholder="Ghi rõ lý do (VD: Đi cưới người yêu cũ...)" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>Gửi đơn ngay</Button>
            </Form>
        </Card>
    );
};