const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { verifyToken } = require('../middlewares/is-auth');

router.get('/my-stats', verifyToken, async (req, res) => {
    const empId = req.user.employee_id;
    try {
        const [att] = await pool.query('SELECT COUNT(*) as days FROM attendance WHERE employee_id = ? AND MONTH(date) = MONTH(CURDATE())', [empId]);
        const [leaves] = await pool.query('SELECT COUNT(*) as pending FROM leave_request WHERE employee_id = ? AND status="Pending"', [empId]);
        const [payroll] = await pool.query('SELECT net_salary FROM payroll WHERE employee_id = ? ORDER BY year DESC, month DESC LIMIT 1', [empId]);

        res.json({
            workingDays: att[0].days,
            pendingLeaves: leaves[0].pending,
            latestSalary: payroll.length > 0 ? payroll[0].net_salary : 0
        });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/admin-stats', verifyToken, async (req, res) => {
    try {
        const [emp] = await pool.query('SELECT COUNT(*) as total FROM employee WHERE is_deleted = 0');
        const [prod] = await pool.query('SELECT COUNT(*) as total FROM product WHERE is_deleted = 0');
        const [leave] = await pool.query('SELECT COUNT(*) as total FROM leave_request WHERE status = "Pending"');
        const [att] = await pool.query('SELECT COUNT(DISTINCT employee_id) as total FROM attendance WHERE date = CURDATE()');

        res.json({
            totalEmployees: emp[0].total,
            totalProducts: prod[0].total,
            pendingLeaves: leave[0].total,
            attendanceToday: att[0].total
        });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;