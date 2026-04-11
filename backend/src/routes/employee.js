
const express = require('express');
const router = express.Router();
const empController = require('../controllers/employee');
const { verifyToken, checkRole } = require('../middlewares/is-auth');

const upload = require('../middlewares/upload');

router.get('/', verifyToken, empController.getAllEmployees);
router.post('/', verifyToken, checkRole(['admin']), upload.single('avatar'), empController.createEmployee);

module.exports = router;
