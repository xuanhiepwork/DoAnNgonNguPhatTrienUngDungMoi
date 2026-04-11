
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Xử lý lỗi chung (ví dụ: Token hết hạn -> Bắt đăng nhập lại)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
