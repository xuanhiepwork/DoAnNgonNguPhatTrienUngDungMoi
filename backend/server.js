const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');

const productRoutes = require('./src/routes/product');
const userRoutes = require('./src/routes/user');
const employeeRoutes = require('./src/routes/employee');

const app = express();
const PORT = 8080;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static('uploads'))
app.use('/api/employees', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});