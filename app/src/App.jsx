import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Hàm kiểm tra xem đã đăng nhập chưa
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Trang Public */}
                <Route path="/login" element={<Login />} />

                {/* Trang cần bảo vệ (Yêu cầu đăng nhập) */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }>
                    {/* Các route con sẽ render vào thẻ <Outlet /> trong Dashboard */}
                    <Route index element={<h2>Chào mừng đến với Hệ thống Quản lý</h2>} />
                    <Route path="products" element={<h2>Giao diện Quản lý Thiết bị (Sẽ code tiếp)</h2>} />
                    <Route path="employees" element={<h2>Giao diện Quản lý Nhân viên (Sẽ code tiếp)</h2>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;