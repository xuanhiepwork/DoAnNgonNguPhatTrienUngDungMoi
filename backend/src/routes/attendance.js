const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance');
const { verifyToken } = require('../middlewares/is-auth');

router.post('/checkin', verifyToken, attendanceController.checkIn);
router.get('/', verifyToken, attendanceController.getAttendance);

module.exports = router;