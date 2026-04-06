const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');

const http = require('http');
const { Server } = require('socket.io');

const productRoutes = require('./src/routes/product');
const userRoutes = require('./src/routes/user');
const employeeRoutes = require('./src/routes/employee');

const app = express();
const PORT = 8080;

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173" }
});

io.on('connection', (socket) => {
    console.log('Có người vừa kết nối Socket:', socket.id);
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

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

// server.listen(PORT, () => {
//     console.log(`Server đang chạy tại http://localhost:${PORT}`);
// });