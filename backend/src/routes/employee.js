const express = require('express');
const router = express.Router();
const empController = require('../controllers/employee');
const { verifyToken } = require('../middlewares/is-auth');
const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ ảnh đại diện
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Route lấy danh sách và thêm mới
router.get('/', verifyToken, empController.getAllEmployees);
router.post('/', verifyToken, upload.single('avatar'), empController.createEmployee);

module.exports = router;