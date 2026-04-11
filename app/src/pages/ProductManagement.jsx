
import React, { useState, useEffect } from 'react';
import { Table, Input, Card, Space, Tooltip, message, Button, Modal, Form, InputNumber, Popconfirm, Row, Col, Statistic } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileExcelOutlined, LaptopOutlined, DollarOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ProductManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
            total: 0,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20']
        },
        sortField: 'id',
        sortOrder: 'ASC'
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/products', {
                params: {
                    page: tableParams.pagination.current,
                    limit: tableParams.pagination.pageSize,
                    search: searchText,
                    sortBy: tableParams.sortField,
                    sortOrder: tableParams.sortOrder
                }
            });
            setData(response.data);
            setTableParams({ ...tableParams, pagination: { ...tableParams.pagination, total: response.pagination.totalItems } });
        } catch (error) { message.error('Lỗi tải dữ liệu!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [tableParams.pagination.current, tableParams.pagination.pageSize, tableParams.sortField, tableParams.sortOrder, searchText]);

    const handleAddEdit = async (values) => {
        try {
            if (editingProduct) {
                await axiosClient.put(`/products/${editingProduct.id}`, values);
                message.success('Cập nhật thành công!');
            } else {
                await axiosClient.post('/products', values);
                message.success('Thêm thiết bị thành công!');
            }
            setIsModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error) { message.error('Thao tác thất bại!'); }
    };

    const handleDelete = async (id) => {
        try {
            await axiosClient.delete(`/products/${id}`);
            message.success('Đã chuyển vào thùng rác!');
            fetchData();
        } catch (error) { message.error('Không thể xóa thiết bị này!'); }
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Danh sách thiết bị');
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Tên thiết bị', key: 'title', width: 30 },
            { header: 'Giá (VND)', key: 'price', width: 20 },
            { header: 'Mô tả', key: 'description', width: 50 },
        ];
        worksheet.addRows(data);
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Bao_Cao_Thiet_Bi_${Date.now()}.xlsx`);
        message.success('Đã tải xuống báo cáo Excel!');
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', width: '5%' },
        { title: 'Tên thiết bị', dataIndex: 'title', sorter: true, width: '25%' },
        {
            title: 'Giá (VND)', dataIndex: 'price', sorter: true, width: '15%',
            render: (v) => <b style={{ color: '#cf1322' }}>{Number(v).toLocaleString()} đ</b>
        },
        {
            title: 'Mô tả', dataIndex: 'description', width: '35%',
            render: (text) => (
                <Tooltip title={text}><div style={{ color: 'transparent', transition: '0.3s' }} onMouseEnter={e => e.target.style.color = '#555'} onMouseLeave={e => e.target.style.color = 'transparent'}>
                    {text || 'Trống'}
                </div></Tooltip>
            )
        },
        {
            title: 'Hành động', width: '20%',
            render: (_, record) => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => { setEditingProduct(record); form.setFieldsValue(record); setIsModalOpen(true); }} />
                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <Statistic title="Tổng thiết bị quản lý" value={tableParams.pagination.total} prefix={<LaptopOutlined />} valueStyle={{ color: '#3f51b5' }} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <Statistic title="Tổng giá trị tài sản" value={data.reduce((sum, item) => sum + Number(item.price), 0)} precision={0} prefix={<DollarOutlined />} suffix="đ" valueStyle={{ color: '#cf1322' }} />
                    </Card>
                </Col>
            </Row>

            <Card title="DANH SÁCH THIẾT BỊ VĂN PHÒNG" extra={
                <Space>
                    <Input placeholder="Tìm nhanh..." prefix={<SearchOutlined />} onChange={e => setSearchText(e.target.value)} style={{ width: 250 }} allowClear />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingProduct(null); form.resetFields(); setIsModalOpen(true); }}>Thêm mới</Button>
                    <Button icon={<FileExcelOutlined />} onClick={exportToExcel} style={{ background: '#217346', color: '#fff' }}>Xuất Excel</Button>
                </Space>
            }>
                <Table columns={columns} dataSource={data} rowKey="id" pagination={tableParams.pagination} loading={loading} onChange={(p, f, s) => setTableParams({ pagination: p, sortField: s.field || 'id', sortOrder: s.order === 'descend' ? 'DESC' : 'ASC' })} bordered />
            </Card>

            <Modal title={editingProduct ? "Cập nhật thiết bị" : "Thêm thiết bị mới"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} okText="Xác nhận" cancelText="Hủy">
                <Form form={form} layout="vertical" onFinish={handleAddEdit}>
                    <Form.Item name="title" label="Tên thiết bị" rules={[{ required: true, message: 'Không được bỏ trống!' }]}><Input placeholder="VD: MacBook Pro 2024" /></Form.Item>
                    <Form.Item name="price" label="Giá trị (VND)" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v.replace(/\$\s?|(,*)/g, '')} /></Form.Item>
                    <Form.Item name="description" label="Ghi chú chi tiết"><Input.TextArea rows={3} /></Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManagement;
