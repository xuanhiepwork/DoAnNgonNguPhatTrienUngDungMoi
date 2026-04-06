const { pool } = require('../config/db');

// Nhân viên gửi đơn
exports.createRequest = async (req, res) => {
    const { employee_id, start_date, end_date, reason } = req.body;
    try {
        await pool.query(
            'INSERT INTO leave_request (employee_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)',
            [employee_id, start_date, end_date, reason]
        );
        res.status(201).json({ message: "Gửi đơn nghỉ phép thành công!" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Admin duyệt đơn
exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'Approved' hoặc 'Rejected'
    try {
        await pool.query('UPDATE leave_request SET status = ? WHERE id = ?', [status, id]);
        res.status(200).json({ message: `Đã ${status === 'Approved' ? 'Duyệt' : 'Từ chối'} đơn.` });
    } catch (error) { res.status(500).json({ error: error.message }); }
};