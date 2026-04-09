# HỆ THỐNG QUẢN TRỊ NHÂN SỰ 

Hệ thống quản lý nhân sự tích hợp chấm công, quản lý nghỉ phép và tính lương tự động.

---

## THÔNG TIN 
| Tiêu chí | Chi tiết |
| :--- | :--- |
| **Họ và tên** | **Trần Xuân Hiệp** |
| **Mã số sinh viên** | `2280618989` |
| **Lớp** | `22DTHD2` |
| **Học phần** | Đồ án Ngôn ngữ Phát triển Ứng dụng mới |

---

## 1. TỔNG QUAN DỰ ÁN
Dự án là một ứng dụng **Web Fullstack** hỗ trợ quản lý nhân sự chuyên sâu cho doanh nghiệp. Hệ thống giải quyết bài toán vận hành nhân sự thông qua việc tự động hóa quy trình quản lý hồ sơ, theo dõi chấm công, phê duyệt nghỉ phép và đặc biệt là **tự động kết xuất bảng lương** dựa trên dữ liệu thực tế từ hệ thống.

---

## 2. CÔNG NGHỆ SỬ DỤNG

### Frontend
- React
- Vite
- Ant-Design
- Socket.io

### Backend
- NodeJS
- Express.js
- MySQL
- JWT

---

## 3. CÁC CÔNG VIỆC ĐÃ THỰC HIỆN
- [x] **Thiết kế Cơ sở dữ liệu:** Xây dựng cấu trúc DB tối ưu gồm 9 bảng với các ràng buộc quan hệ chặt chẽ.
- [x] **Xây dựng API (RESTful):** Hoàn thiện hệ thống Endpoint xử lý nghiệp vụ CRUD và tính toán logic phức tạp.
- [x] **Tích hợp Real-time:** Triển khai **Socket.io** để xử lý thông báo tức thời (Ting-ting) khi có sự kiện mới.
- [x] **Phân quyền người dùng (RBAC):** Xây dựng Middleware bảo mật lớp ứng dụng, chia quyền Admin và Nhân viên.
- [x] **Xử lý Logic tính toán:** Phát triển thuật toán tự động đối soát ngày công và ngày nghỉ để tính lương.

---

## 4. CÁC CHỨC NĂNG CHÍNH

### A. Bảo mật & Phân quyền
* **Xác thực:** Đăng nhập/Đăng ký với mật khẩu được mã hóa **Bcrypt**.
* **Phân quyền (RBAC):** 
    * **Admin:** Toàn quyền quản lý, duyệt nghỉ phép, cấu hình thiết bị và chi trả lương.
    * **Nhân viên:** Chỉ truy cập các chức năng cá nhân: Chấm công, gửi đơn nghỉ phép và xem phiếu lương.

### B. Quản lý Nhân sự & Tài sản
* **Hồ sơ nhân viên:** Quản lý thông tin tập trung, hỗ trợ upload ảnh đại diện (Multer).
* **Quản lý thiết bị:** Theo dõi tài sản công ty, phân trang, tìm kiếm và **xuất báo cáo Excel** chuyên nghiệp.

### C. Luồng nghiệp vụ "Master Flow"
1.  **Chấm công (Attendance):** Ghi nhận ngày công thực tế thông qua tính năng Check-in hàng ngày.
2.  **Nghỉ phép (Leave Management):** Gửi đơn online. Admin nhận thông báo **Real-time** và phê duyệt trực tiếp.
3.  **Tính lương tự động (Payroll):** * Công thức: `Thực nhận = Lương cứng - (Ngày nghỉ không phép * Đơn giá ngày công)`.
    * Hệ thống tự động quét đơn nghỉ phép đã duyệt để tính toán khấu trừ chính xác.

---

## 📂 5. CẤU TRÚC THƯ MỤC
```text
├── app/                # Mã nguồn Frontend (ReactJS + Vite)
├── backend/            # Mã nguồn Backend (NodeJS + Express)
│   ├── src/
│   │   ├── config/     # Kết nối Database
│   │   ├── controllers/# Logic xử lý nghiệp vụ
│   │   ├── routes/     # Định tuyến API
│   │   └── middlewares/# Phân quyền & Bảo mật
│   └── uploads/        # Nơi lưu trữ tài nguyên tĩnh (Ảnh thẻ)
└── database.sql        # File script khởi tạo Database

---

Lần cập nhật cuối: 09/04/2026..
Đồ án được thực hiện bởi Trần Xuân Hiệp - MSSV: 2280618989
