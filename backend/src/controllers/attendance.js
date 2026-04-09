const { pool } = require('../config/db');

exports.checkIn = async (req, res) => {
    const employee_id = req.user.employee_id;
    if (!employee_id)
        return res.status(400).json({ message: "Tài khoản chưa có hồ sơ nhân sự!" });
    try {
        const [existing] = await pool.query('SELECT * FROM attendance WHERE employee_id = ? AND date = CURDATE()', [employee_id]);
        if (existing.length > 0)
            return res.status(400).json({ message: "Hôm nay đã chấm công rồi!" });
        await pool.query('INSERT INTO attendance (employee_id, date, time_in) VALUES (?, CURDATE(), CURTIME())', [employee_id]);
        res.status(201).json({ message: "Check-in thành công!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAttendance = async (req, res) => {
    const { role, employee_id } = req.user;
    try {
        let query = `
            SELECT a.*, e.full_name 
            FROM attendance a
            JOIN employee e ON a.employee_id = e.id
        `;
        const params = [];
        if (role !== 'admin') {
            query += ` WHERE a.employee_id = ?`;
            params.push(employee_id);
        }
        query += ` ORDER BY a.date DESC, a.time_in DESC`;

        const [rows] = await pool.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};