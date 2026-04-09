const { pool } = require('../config/db');
const moment = require('moment'); // Dùng moment để tính số ngày giữa 2 khoảng thời gian dễ hơn

exports.getPayroll = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, e.full_name, d.name as dept_name 
            FROM payroll p
            JOIN employee e ON p.employee_id = e.id
            LEFT JOIN department d ON e.department_id = d.id
            ORDER BY p.year DESC, p.month DESC
        `);
        res.status(200).json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.generatePayroll = async (req, res) => {
    const { month, year } = req.body;
    const baseSalary = 15000000;
    const standardWorkDays = 22; // Tổng công chuẩn
    const dailyWage = baseSalary / standardWorkDays;

    try {
        const [employees] = await pool.query(`
            SELECT id FROM employee 
            WHERE is_deleted = FALSE 
            AND id NOT IN (SELECT employee_id FROM payroll WHERE month = ? AND year = ?)
        `, [month, year]);

        if (employees.length === 0) return res.status(400).json({ message: `Đã tạo hết lương tháng ${month}/${year}` });

        for (let emp of employees) {
            // 1. Đếm số ngày đi làm thực tế trong tháng
            const [attendance] = await pool.query(`
                SELECT COUNT(*) as presentDays FROM attendance 
                WHERE employee_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
            `, [emp.id, month, year]);
            const presentDays = attendance[0].presentDays;

            // 2. Đếm số ngày nghỉ phép ĐÃ DUYỆT (Giả sử 1 đơn = 1 ngày cho đơn giản đồ án)
            const [leaves] = await pool.query(`
                SELECT COUNT(*) as leaveDays FROM leave_request 
                WHERE employee_id = ? AND status = 'Approved' 
                AND MONTH(start_date) = ? AND YEAR(start_date) = ?
            `, [emp.id, month, year]);
            const approvedLeaveDays = leaves[0].leaveDays;

            // 3. Tính lương thực nhận (Tổng ngày công)
            // Lương = (Ngày đi làm + Ngày phép) * Lương 1 ngày
            const totalValidDays = presentDays + approvedLeaveDays;

            // Nếu đi làm lố 22 ngày thì chỉ tính max 22 ngày base (hoặc bạn có thể cho > 22 là Overtime)
            const finalDays = totalValidDays > standardWorkDays ? standardWorkDays : totalValidDays;

            // Khoản phạt/trừ = Số ngày thiếu hụt so với chuẩn
            const missingDays = standardWorkDays - finalDays;
            const deductions = missingDays > 0 ? (missingDays * dailyWage) : 0;

            await pool.query(
                'INSERT INTO payroll (employee_id, month, year, base_salary, bonus, deductions) VALUES (?, ?, ?, ?, ?, ?)',
                [emp.id, month, year, baseSalary, 0, deductions]
            );
        }

        res.status(201).json({ message: `Khởi tạo bảng lương tháng ${month}/${year} thành công!` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.paySalary = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE payroll SET status = "Paid" WHERE id = ?', [id]);
        res.status(200).json({ message: "Thanh toán thành công!" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};