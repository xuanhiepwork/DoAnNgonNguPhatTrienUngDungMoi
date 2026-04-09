const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { verifyToken } = require('../middlewares/is-auth');

router.get('/my-stats', verifyToken, async (req, res) => {
    const empId = req.user.employee_id;
    try {
        // 1. Đếm số ngày đi làm tháng hiện tại
        const [att] = await pool.query('SELECT COUNT(*) as days FROM attendance WHERE employee_id = ? AND MONTH(date) = MONTH(CURDATE())', [empId]);

        // 2. Đếm số đơn nghỉ phép chờ duyệt
        const [leaves] = await pool.query('SELECT COUNT(*) as pending FROM leave_request WHERE employee_id = ? AND status="Pending"', [empId]);

        // 3. Tính tổng thực nhận của tháng gần nhất
        const [payroll] = await pool.query('SELECT net_salary FROM payroll WHERE employee_id = ? ORDER BY year DESC, month DESC LIMIT 1', [empId]);

        res.json({
            workingDays: att[0].days,
            pendingLeaves: leaves[0].pending,
            latestSalary: payroll.length > 0 ? payroll[0].net_salary : 0
        });
    } catch (error) { res.status(500).json({ error: error.message }); }
});
module.exports = router;