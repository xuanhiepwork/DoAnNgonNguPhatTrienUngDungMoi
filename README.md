Cấu trúc dự án:

my-react-app/
├── public/              # Chứa các file tĩnh (index.html, favicon.ico, hình ảnh tĩnh)
├── src/
│   ├── api/             # Nơi chứa các hàm gọi API đến Backend (sử dụng axios hoặc fetch)
│   │   ├── axiosClient.js # Cấu hình sẵn base URL (http://localhost:8080/api)
│   │   └── expenseApi.js  # Các hàm gọi API cụ thể (getExpenses, addExpense...)
│   ├── assets/          # Hình ảnh, icon, file CSS/SCSS dùng chung
│   ├── components/      # Các UI component có thể tái sử dụng (Button, Modal, Navbar, Form nhập liệu)
│   │   └── ExpenseItem.jsx
│   ├── context/         # (Hoặc store/ nếu dùng Redux) Quản lý state toàn cục (Auth Context, Theme Context)
│   ├── hooks/           # Các Custom Hook (VD: useFetch, useAuth)
│   ├── pages/           # Các component đại diện cho một trang hoàn chỉnh
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── utils/           # Các hàm tiện ích (format tiền tệ, format ngày tháng trên giao diện)
│   ├── App.jsx          # Component gốc, thường chứa Cấu hình Routing (React Router)
│   └── main.jsx         # Entry point, render App vào DOM
├── .env                 # Biến môi trường của React (VITE_API_URL...)
├── package.json
└── vite.config.js       # Cấu hình Vite (nếu bạn dùng Vite để khởi tạo React)

my-backend-api/
├── src/
│   ├── config/          # Cấu hình hệ thống (kết nối Database, biến môi trường)
│   │   └── db.js
│   ├── controllers/     # Xử lý logic Request/Response (nhận req, gọi service, trả res.json)
│   │   ├── expense.js   
│   │   └── user.js
│   ├── middlewares/     # Các hàm trung gian (xác thực token, bắt lỗi, kiểm tra dữ liệu)
│   │   ├── is-auth.js
│   │   └── error-handler.js
│   ├── models/          # Định nghĩa cấu trúc dữ liệu (Schema Database)
│   │   ├── expense.js
│   │   └── user.js
│   ├── routes/          # Định nghĩa các Endpoints (đường dẫn API)
│   │   ├── expense.js   # VD: router.get('/api/expenses', expenseController.getAll)
│   │   └── user.js
│   ├── services/        # (Tùy chọn) Chứa logic nghiệp vụ phức tạp để Controller gọn gàng hơn
│   └── utils/           # Các hàm tiện ích dùng chung (format ngày tháng, mã hóa password)
├── .env                 # File chứa các biến bảo mật (DB_URI, JWT_SECRET...)
├── .gitignore
├── package.json
└── server.js            # File gốc: Khởi tạo Express app, middleware (express.json, cors) và lắng nghe Port

# Xóa toàn bộ file khỏi bộ nhớ đệm của Git
git rm -r --cached .

# Đảm bảo bạn đang ở nhánh main
git checkout main

# Ép Git ghi đè (force push) lên nhánh main trên Github để xóa các file rác cũ
git push -f origin main