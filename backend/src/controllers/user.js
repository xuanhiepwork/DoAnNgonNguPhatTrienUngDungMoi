const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'chuoi_bao_mat_hrm_cua_ban'; // Đáng lẽ nên để trong file .env

// 1. Đăng ký User mới (Để bạn tự tạo tài khoản test)
exports.register = async (req, res) => {
    try {
        const { username, email, password, role_id } = req.body;

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO `user` (username, email, password, role_id) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role_id || 3] // Mặc định role 3 (user)
        );

        res.status(201).json({ message: "Đăng ký thành công!", userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 2. Đăng nhập
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Tìm user kết hợp JOIN với bảng role để lấy tên quyền (admin, mod...)
        const [users] = await pool.query(`
            SELECT u.*, r.name as role_name 
            FROM \`user\` u 
            LEFT JOIN \`role\` r ON u.role_id = r.id 
            WHERE u.username = ? AND u.is_deleted = FALSE
        `, [username]);

        if (users.length === 0) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

        const user = users[0];

        // Kiểm tra xem tài khoản có bị disable không
        if (!user.status) return res.status(403).json({ message: "Tài khoản của bạn đã bị vô hiệu hóa" });

        // So sánh mật khẩu
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

        // Tạo JWT Token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role_name },
            JWT_SECRET,
            { expiresIn: '1d' } // Token có hạn 1 ngày
        );

        res.status(200).json({ message: "Đăng nhập thành công", token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 3. Đổi mật khẩu
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id; // Lấy từ token sau khi đăng nhập

        const [users] = await pool.query('SELECT * FROM `user` WHERE id = ?', [userId]);
        const user = users[0];

        // Kiểm tra mật khẩu cũ
        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) return res.status(400).json({ message: "Mật khẩu cũ không đúng" });

        // Mã hóa mật khẩu mới và lưu
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE `user` SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

        res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 4. Enable User (Yêu cầu: truyền email và username)
exports.enableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        const [result] = await pool.query(
            'UPDATE `user` SET status = TRUE WHERE email = ? AND username = ?',
            [email, username]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy User khớp với email và username" });
        res.status(200).json({ message: "Đã kích hoạt (Enable) tài khoản thành công", status: true });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 5. Disable User (Yêu cầu: truyền email và username)
exports.disableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        const [result] = await pool.query(
            'UPDATE `user` SET status = FALSE WHERE email = ? AND username = ?',
            [email, username]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy User khớp với email và username" });
        res.status(200).json({ message: "Đã vô hiệu hóa (Disable) tài khoản thành công", status: false });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};