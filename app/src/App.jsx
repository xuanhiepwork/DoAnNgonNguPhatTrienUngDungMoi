
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

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;

    const user = decodeToken(token);

    if (!user) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<RoleBasedRoute><Dashboard /></RoleBasedRoute>}>
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="employees" element={<EmployeeManagement />} />
                    <Route path="leave-request" element={<LeaveRequest />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route
                        path="leave-management"
                        element={<RoleBasedRoute allowedRoles={['admin']}><LeaveManagement /></RoleBasedRoute>}
                    />
                    <Route
                        path="payroll"
                        element={<RoleBasedRoute allowedRoles={['admin']}><Payroll /></RoleBasedRoute>}
                    />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

