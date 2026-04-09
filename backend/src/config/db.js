const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Yessirrr... Kết nối Database MySQL thành công!');
        connection.release();
    } catch (error) {
        console.error('OH NOooooo.... Lỗi kết nối Database:', error.message);
        process.exit(1);
    }
};

module.exports = { pool, connectDB };