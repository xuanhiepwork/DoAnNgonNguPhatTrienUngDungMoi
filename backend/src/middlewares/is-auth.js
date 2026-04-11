
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'chuoi_bao_mat_hrm_cua_ban';

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(401).json({ message: "Bạn chưa đăng nhập! Vui lòng cung cấp Token." });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
        req.user = decoded;
        next();
    });
};

exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Truy cập bị từ chối! Yêu cầu quyền: ${allowedRoles.join(' hoặc ')}`
            });
        }
        next();
    };
};
