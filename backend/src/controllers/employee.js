
const { pool } = require('../config/db');

exports.getAllEmployees = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT e.*, d.name as dept_name, p.name as pos_name 
            FROM employee e
            LEFT JOIN department d ON e.department_id = d.id
            LEFT JOIN position p ON e.position_id = p.id
            WHERE e.is_deleted = 0 ORDER BY e.id DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const { full_name, hometown, department_id, position_id } = req.body;
        const avatar = req.file ? `/uploads/${req.file.filename}` : null;

        const deptId = (department_id && department_id !== 'undefined' && department_id !== 'null') ? Number(department_id) : null;
        const posId = (position_id && position_id !== 'undefined' && position_id !== 'null') ? Number(position_id) : null;

        if (!full_name) {
            return res.status(400).json({ message: "Vui lòng nhập tên nhân viên" });
        }

        await pool.query(
            'INSERT INTO employee (full_name, hometown, avatar, department_id, position_id) VALUES (?, ?, ?, ?, ?)',
            [full_name, hometown || null, avatar, deptId, posId]
        );
        res.status(201).json({ message: "Thêm nhân viên thành công" });
    } catch (error) {
        console.error("Lỗi khi thêm nhân viên:", error);
        res.status(500).json({ message: "Lỗi Server, vui lòng kiểm tra kết nối CSDL", error: error.message });
    }
};
