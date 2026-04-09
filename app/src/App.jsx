import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import ProductManagement from './pages/ProductManagement';
import EmployeeManagement from './pages/EmployeeManagement';
import Register from './pages/Register';
import LeaveManagement from './pages/LeaveManagement';
import LeaveRequest from './pages/LeaveRequest';
import Payroll from './pages/Payroll';
import Attendance from './pages/Attendance';

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;

    try {
        const user = JSON.parse(atob(token.split('.')[1]));
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            // Nếu không đủ quyền, đá về trang chủ hoặc trang 403
            return <Navigate to="/" replace />;
        }
    } catch (e) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Private Routes - Yêu cầu Đăng nhập */}
                <Route path="/" element={<RoleBasedRoute><Dashboard /></RoleBasedRoute>}>
                    <Route index element={<h2>Chào mừng đến với Hệ thống Quản lý</h2>} />

                    {/* Ai cũng vào được */}
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="employees" element={<EmployeeManagement />} />
                    <Route path="leave-request" element={<LeaveRequest />} />

                    {/* CHỈ ADMIN MỚI VÀO ĐƯỢC - Bảo mật 2 lớp */}
                    <Route path="leave-management" element={
                        <RoleBasedRoute allowedRoles={['admin']}><LeaveManagement /></RoleBasedRoute>
                    } />
                    <Route path="payroll" element={
                        <RoleBasedRoute allowedRoles={['admin']}><Payroll /></RoleBasedRoute>
                    } />
                    <Route path="attendance" element={<Attendance />} />
                </Route>

                {/* Catch-all: Nếu gõ bừa URL thì về login hoặc 404 */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;