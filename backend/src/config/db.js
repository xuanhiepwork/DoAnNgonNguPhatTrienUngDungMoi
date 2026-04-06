const mysql = require('mysql2/promise');

// Khởi tạo Connection Pool để tối ưu hóa hiệu suất (tái sử dụng các kết nối)
const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'hrm_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Kết nối Database MySQL thành công!');
        connection.release();
    } catch (error) {
        console.error('❌ Lỗi kết nối Database:', error.message);
        process.exit(1); // Dừng ứng dụng nếu không kết nối được DB
    }
};

module.exports = { pool, connectDB };