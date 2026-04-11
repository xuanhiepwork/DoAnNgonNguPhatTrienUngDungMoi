
const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payroll');
const { verifyToken, checkRole } = require('../middlewares/is-auth');

router.get('/', verifyToken, payrollController.getPayroll);
router.post('/generate', verifyToken, checkRole(['admin']), payrollController.generatePayroll);
router.put('/pay/:id', verifyToken, checkRole(['admin']), payrollController.paySalary);

module.exports = router;
