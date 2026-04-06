const { pool } = require('../config/db');

// Lấy danh sách (Có phân trang, tìm kiếm, sắp xếp)
exports.getAllProducts = async (req, res) => {
    try {
        // Lấy query từ URL, gán giá trị mặc định nếu không có
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'id'; // Sắp xếp theo id, price hoặc title
        const sortOrder = req.query.sortOrder && req.query.sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const offset = (page - 1) * limit;

        // Câu query cơ bản (chỉ lấy dữ liệu chưa xóa mềm)
        let query = `SELECT * FROM product WHERE is_deleted = FALSE`;
        const queryParams = [];

        // Thêm logic tìm kiếm theo Title
        if (search) {
            query += ` AND title LIKE ?`;
            queryParams.push(`%${search}%`);
        }

        // Thêm logic sắp xếp (Tránh SQL Injection bằng cách kiểm tra cột hợp lệ)
        const allowedSortColumns = ['id', 'title', 'price'];
        const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'id';
        query += ` ORDER BY ${safeSortBy} ${sortOrder}`;

        // Thêm logic phân trang
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        // Đếm tổng số bản ghi để Frontend làm thanh chuyển trang
        let countQuery = `SELECT COUNT(*) as total FROM product WHERE is_deleted = FALSE`;
        const countParams = [];
        if (search) {
            countQuery += ` AND title LIKE ?`;
            countParams.push(`%${search}%`);
        }

        const [products] = await pool.query(query, queryParams);
        const [totalRows] = await pool.query(countQuery, countParams);
        const total = totalRows[0].total;

        res.status(200).json({
            message: "Lấy danh sách thành công",
            data: products,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Lấy chi tiết 1 Product theo ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM product WHERE id = ? AND is_deleted = FALSE', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy thiết bị" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Tạo mới Product
exports.createProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const [result] = await pool.query(
            'INSERT INTO product (title, description, price) VALUES (?, ?, ?)',
            [title, description, price]
        );
        res.status(201).json({ message: "Thêm thành công", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Cập nhật Product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price } = req.body;
        const [result] = await pool.query(
            'UPDATE product SET title = ?, description = ?, price = ? WHERE id = ? AND is_deleted = FALSE',
            [title, description, price, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy thiết bị để cập nhật" });
        }
        res.status(200).json({ message: "Cập nhật thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xóa mềm (Soft Delete)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Chỉ cập nhật is_deleted thành true thay vì xóa hoàn toàn
        const [result] = await pool.query(
            'UPDATE product SET is_deleted = TRUE WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy thiết bị" });
        }
        res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};