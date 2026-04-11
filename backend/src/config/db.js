
const mysql = require('mysql2/promise');



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

        console.log('Yessirrr... Kết nối Database MySQL thành công!');

        connection.release();

    } catch (error) {

        console.error('OH NOooooo.... Lỗi kết nối Database:', error.message);

        process.exit(1);

    }

};



module.exports = { pool, connectDB };
