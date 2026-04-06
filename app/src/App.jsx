import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import ProductManagement from './pages/ProductManagement';
import EmployeeManagement from './pages/EmployeeManagement';
import Register from './pages/Register';
import LeaveManagement from './pages/LeaveManagement';

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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }>
                    <Route index element={<h2>Chào mừng đến với Hệ thống Quản lý</h2>} />

                    <Route path="products" element={<ProductManagement />} />
                    <Route path="employees" element={<EmployeeManagement />} />
                    <Route path="leave-management" element={<LeaveManagement />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;