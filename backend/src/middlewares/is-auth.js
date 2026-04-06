const jwt = require('jsonwebtoken');
const JWT_SECRET = 'chuoi_bao_mat_hrm_cua_ban';

// Middleware 1: Kiểm tra xem người dùng đã đăng nhập (có Token) chưa
exports.verifyToken = (req, res, next) => {
    // Lấy token từ header: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Bạn chưa đăng nhập! Vui lòng cung cấp Token." });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn." });

        req.user = decoded; // Lưu thông tin user (id, username, role) vào req để các controller sau dùng
        next(); // Cho phép đi tiếp vào Controller
    });
};

// Middleware 2: Kiểm tra Quyền (Role)
exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // req.user.role đã được gán từ hàm verifyToken ở trên
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Truy cập bị từ chối! Yêu cầu quyền: ${allowedRoles.join(' hoặc ')}`
            });
        }
        next();
    };
};