const { pool } = require('../config/db');

exports.createRequest = async (req, res) => {
    const { start_date, end_date, reason } = req.body;
    const employee_id = req.user.employee_id;

    if (!employee_id) return res.status(400).json({ message: "Tài khoản chưa có hồ sơ nhân sự!" });

    try {
        await pool.query(
            'INSERT INTO leave_request (employee_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)',
            [employee_id, start_date, end_date, reason || 'Không có lý do']
        );
        if (req.io) {
            req.io.emit('new_leave_request', { message: `Có đơn xin nghỉ phép mới!` });
        }
        res.status(201).json({ message: "Gửi đơn thành công!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE leave_request SET status = ? WHERE id = ?', [status, id]);
        res.status(200).json({ message: `Thành công` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT l.*, e.full_name 
            FROM leave_request l 
            JOIN employee e ON l.employee_id = e.id 
            ORDER BY l.id DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};