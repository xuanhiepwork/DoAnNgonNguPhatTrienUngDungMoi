const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'chuoi_bao_mat_hrm_cua_ban';

exports.register = async (req, res) => {
    try {
        const { username, email, password, full_name } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: "Thiếu thông tin!" });

        const [existing] = await pool.query('SELECT * FROM `user` WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0)
            return res.status(400).json({ message: "Tên đăng nhập hoặc Email đã tồn tại!" });

        const [empResult] = await pool.query('INSERT INTO `employee` (full_name) VALUES (?)', [full_name || username]);
        const newEmployeeId = empResult.insertId;

        await pool.query(
            'INSERT INTO `user` (username, email, password, role_id, employee_id) VALUES (?, ?, ?, 3, ?)',
            [username, email, password, newEmployeeId]
        );
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [users] = await pool.query(`
            SELECT u.*, r.name as role_name FROM \`user\` u 
            LEFT JOIN \`role\` r ON u.role_id = r.id WHERE u.username = ? AND u.is_deleted = 0
        `, [username]);

        if (users.length === 0)
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        const user = users[0];

        if (password !== user.password)
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        if (!user.status)
            return res.status(403).json({ message: "Tài khoản bị vô hiệu hóa!" });

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role_name,
                employee_id: user.employee_id
            },
            JWT_SECRET, { expiresIn: '1d' }
        );
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const [users] = await pool.query('SELECT * FROM `user` WHERE id = ?', [userId]);
        const user = users[0];

        if (oldPassword !== user.password)
            return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
        await pool.query('UPDATE `user` SET password = ? WHERE id = ?', [newPassword, userId]);

        res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.enableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        const [result] = await pool.query(
            'UPDATE `user` SET status = 1 WHERE email = ? AND username = ?',
            [email, username]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Không tìm thấy User" });
        res.status(200).json({ message: "Đã kích hoạt tài khoản thành công", status: true });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.disableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        const [result] = await pool.query(
            'UPDATE `user` SET status = 0 WHERE email = ? AND username = ?',
            [email, username]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Không tìm thấy User" });
        res.status(200).json({ message: "Đã vô hiệu hóa tài khoản thành công", status: false });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};