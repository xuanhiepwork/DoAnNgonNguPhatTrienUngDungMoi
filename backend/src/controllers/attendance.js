const { pool } = require('../config/db');

// Nhân viên tự Check-in hôm nay
exports.checkIn = async (req, res) => {
    const employee_id = req.user.id; // Lấy ID từ token đăng nhập
    try {
        // Kiểm tra xem hôm nay đã chấm công chưa
        const [existing] = await pool.query(
            'SELECT * FROM attendance WHERE employee_id = ? AND date = CURDATE()',
            [employee_id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ message: "Hôm nay bạn đã chấm công rồi!" });
        }

        await pool.query(
            'INSERT INTO attendance (employee_id, date, time_in) VALUES (?, CURDATE(), CURTIME())',
            [employee_id]
        );
        res.status(201).json({ message: "Check-in thành công!" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Lấy danh sách chấm công (Admin xem tất cả, User xem của mình)
exports.getAttendance = async (req, res) => {
    const { role, id } = req.user;
    try {
        let query = `
            SELECT a.*, e.full_name 
            FROM attendance a
            JOIN employee e ON a.employee_id = e.id
        `;
        const params = [];

        // Nếu là nhân viên thường, chỉ lấy dữ liệu của chính họ
        if (role !== 'admin') {
            query += ` WHERE a.employee_id = ?`;
            params.push(id);
        }
        query += ` ORDER BY a.date DESC, a.time_in DESC`;

        const [rows] = await pool.query(query, params);
        res.status(200).json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
};