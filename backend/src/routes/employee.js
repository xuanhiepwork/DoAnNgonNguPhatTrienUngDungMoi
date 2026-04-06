const express = require('express');
const router = express.Router();
const empController = require('../controllers/employee');
const { verifyToken } = require('../middlewares/is-auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

router.get('/', verifyToken, empController.getAllEmployees);
router.post('/', verifyToken, upload.single('avatar'), empController.createEmployee);
router.post('/', verifyToken, checkRole(['admin']), upload.single('avatar'), empController.createEmployee);

module.exports = router;