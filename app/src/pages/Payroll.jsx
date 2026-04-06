import { Table, Tag, Typography } from 'antd';

const Payroll = () => {
    const columns = [
        { title: 'Nhân viên', dataIndex: 'full_name' },
        { title: 'Tháng/Năm', render: (record) => `${record.month}/${record.year}` },
        {
            title: 'Lương cơ bản',
            dataIndex: 'base_salary',
            render: (val) => `${Number(val).toLocaleString()} đ`
        },
        {
            title: 'Thực nhận',
            dataIndex: 'net_salary',
            render: (val) => <b style={{ color: 'green' }}>{Number(val).toLocaleString()} đ</b>
        }
    ];

    return (
        <Card title="BẢNG LƯƠNG NHÂN VIÊN">
            <Table columns={columns} dataSource={payrollData} rowKey="id" />
        </Card>
    );
};