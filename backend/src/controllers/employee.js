const { pool } = require('../config/db');

exports.getAllEmployees = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT e.*, d.name as dept_name, p.name as pos_name 
            FROM employee e
            LEFT JOIN department d ON e.department_id = d.id
            LEFT JOIN position p ON e.position_id = p.id
            WHERE e.is_deleted = FALSE
        `);
        res.status(200).json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createEmployee = async (req, res) => {
    try {
        const { full_name, dob, hometown, department_id, position_id } = req.body;
        const avatar = req.file ? `/uploads/${req.file.filename}` : null;

        await pool.query(
            'INSERT INTO employee (full_name, dob, hometown, avatar, department_id, position_id) VALUES (?, ?, ?, ?, ?, ?)',
            [full_name, dob, hometown, avatar, department_id, position_id]
        );
        res.status(201).json({ message: "Thêm nhân viên thành công" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};