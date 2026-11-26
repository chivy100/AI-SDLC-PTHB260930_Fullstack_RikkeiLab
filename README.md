# Rikkei Lab – Hệ thống quản lý mượn trả thiết bị phòng thực hành

> **Trạng thái tài liệu:** Đã hoàn thiện sau kiểm thử tích hợp toàn hệ thống (Giai đoạn 6 – Bước 6.4). Toàn bộ lệnh cài đặt, biến môi trường, API, quy tắc nghiệp vụ và kết quả kiểm thử dưới đây đã được đối chiếu trực tiếp với mã nguồn thực tế.

---

## Mục lục

1. [Tên dự án và mô tả bài toán](#1-tên-dự-án-và-mô-tả-bài-toán)
2. [Các chức năng chính](#2-các-chức-năng-chính)
3. [Công nghệ sử dụng và phiên bản thực tế](#3-công-nghệ-sử-dụng-và-phiên-bản-thực-tế)
4. [Phân tích bài toán và thiết kế hệ thống](#4-phân-tích-bài-toán-và-thiết-kế-hệ-thống)
5. [Cấu trúc thư mục dự án](#5-cấu-trúc-thư-mục-dự-án)
6. [Yêu cầu môi trường trước khi cài đặt](#6-yêu-cầu-môi-trường-trước-khi-cài-đặt)
7. [Hướng dẫn tạo Database và chạy các file SQL](#7-hướng-dẫn-tạo-database-và-chạy-các-file-sql)
8. [Hướng dẫn cấu hình biến môi trường (.env)](#8-hướng-dẫn-cấu-hình-biến-môi-trường-env)
9. [Hướng dẫn cài đặt dependencies](#9-hướng-dẫn-cài-đặt-dependencies)
10. [Hướng dẫn chạy Backend và Frontend](#10-hướng-dẫn-chạy-backend-và-frontend)
11. [Địa chỉ truy cập ứng dụng và Health API](#11-địa-chỉ-truy-cập-ứng-dụng-và-health-api)
12. [Danh sách API theo từng nhóm nghiệp vụ](#12-danh-sách-api-theo-từng-nhóm-nghiệp-vụ)
13. [Giả định nghiệp vụ và kỹ thuật](#13-giả-định-nghiệp-vụ-và-kỹ-thuật)
14. [Quy tắc Transaction, concurrency và rollback](#14-quy-tắc-transaction-concurrency-và-rollback)
15. [Quy tắc bảo mật và xử lý lỗi](#15-quy-tắc-bảo-mật-và-xử-lý-lỗi)
16. [Hướng dẫn kiểm thử bằng Newman / Postman](#16-hướng-dẫn-kiểm-thử-bằng-newman--postman)
17. [Kết quả nghiệm thu thực tế, lỗi khó phát hiện nhất và giới hạn đã biết](#17-kết-quả-nghiệm-thu-thực-tế-lỗi-khó-phát-hiện-nhất-và-giới-hạn-đã-biết)
18. [Danh sách ảnh minh chứng trong thư mục evidence/](#18-danh-sách-ảnh-minh-chứng-trong-thư-mục-evidence)

---

## 1. Tên dự án và mô tả bài toán

**Rikkei Lab** là ứng dụng web Fullstack quản lý thiết bị phòng thực hành và theo dõi quy trình mượn – trả – xử lý quá hạn/tiền phạt dành cho cán bộ phụ trách phòng lab:

- **Phần 1 (Nghiệp vụ cốt lõi):** Quản lý danh mục thiết bị (`laptop`, `màn hình`, `bo mạch điện tử`, `phụ kiện`), tính tồn kho khả dụng động theo thời gian thực và quản lý vòng đời phiếu mượn từ lúc tạo đến khi trả.
- **Phần 2 (Hướng mở rộng A – Quá hạn và tiền phạt):** Theo dõi khoản phạt tạm tính cho các phiếu quá hạn chưa trả, tự động chốt khoản phạt cứng trong giao dịch trả thiết bị trễ hạn và quản lý thu đủ tiền phạt một lần kèm tổng hợp tài chính (`đã thu`, `đã chốt chưa thu`, `tạm tính chưa trả`, `tổng đang nợ`).

---

## 2. Các chức năng chính

1. **Màn hình Thiết bị (`EquipmentPage`):**
   - Xem danh sách thiết bị phân trang Backend (`limit = 8` bản ghi/trang), hiển thị `totalQuantity`, `borrowedQuantity`, `availableQuantity` và badge `Còn hàng` / `Hết hàng`.
   - Tìm kiếm theo tên hoặc mã thiết bị (debounce) và lọc theo loại (`all`, `laptop`, `man_hinh`, `mach_dien_tu`, `phu_kien`).
   - Xem chi tiết thiết bị (`EquipmentDetailModal`), thêm mới, chỉnh sửa (`EquipmentFormModal`) và xóa (`ConfirmDeleteModal`).
   - Bảo vệ toàn vẹn dữ liệu: chặn trùng mã (`409`), chặn hạ tổng số lượng nhỏ hơn số đang mượn (`409`), chặn xóa thiết bị đã từng phát sinh phiếu mượn (`409`).
2. **Màn hình Phiếu mượn (`BorrowingPage`):**
   - Tạo phiếu mượn mới (`BorrowForm`), tự động disable thiết bị hết hàng trong danh sách chọn, kiểm tra số lượng không vượt tồn kho, hạn trả không ở quá khứ và tối đa `14` ngày kể từ ngày mượn.
   - Hiển thị danh sách phiếu kèm mã định dạng `PM-xxx` (tính từ `id`), lọc theo 4 trạng thái (`all`, `borrowed`, `overdue`, `returned`).
   - Trả thiết bị: mở `ConfirmReturnModal` (trả đúng hạn) hoặc `ReturnWithFineModal` (trả trễ hạn, hiển thị ước tính tiền phạt), chống trả trùng (`409`).
3. **Màn hình Quá hạn & tiền phạt (`FinePage`):**
   - 3 thẻ tổng quan (`FineSummary`): `Tiền phạt đã thu` (`collectedAmount`), `Tiền phạt đang nợ` (`totalOwedAmount = unpaidSettledAmount + provisionalAmount`), và `Mức phạt` cố định `5.000 đ / thiết bị / ngày`.
   - Bảng `FineTable` hiển thị đủ 3 trạng thái: `Tạm tính – Chưa trả` (`provisional`, nút `Trả thiết bị`), `Đã chốt – Chưa thu` (`unpaid`, nút `Thu tiền phạt`) và `Đã thu` (`paid`, hiển thị ngày thu).
   - Xác nhận thu tiền phạt qua `ConfirmPayFineModal`, chỉ cho phép thanh toán toàn bộ 1 lần, chống thu trùng (`409`).
4. **Giám sát kết nối Backend & DB (`BackendStatus`):**
   - Hiển thị trạng thái kết nối `GET /api/health` trên giao diện kèm nút `Kiểm tra lại`.

---

## 3. Công nghệ sử dụng và phiên bản thực tế

| Thành phần | Công nghệ / Thư viện | Khai báo trong `package.json` / Nguồn | Phiên bản cài đặt thực tế |
|---|---|---|---:|
| **Runtime & Package Manager** | Node.js / npm | Hệ thống thực thi | `Node.js v24.18.0` / `npm 11.16.0` |
| **Cơ sở dữ liệu** | MySQL (Engine `InnoDB`, `utf8mb4`) | Session timezone `+07:00` | MySQL 8.x (`rikkei_lab`) |
| **Backend Core** | Express (CommonJS) | `^4.22.3` | `4.22.3` |
| **MySQL Driver** | `mysql2` (`mysql2/promise` Pool) | `^3.24.6` | `3.24.6` |
| **Validation** | Zod | `^4.6.7` | `4.6.7` |
| **CORS & Env** | `cors` / `dotenv` | `^2.8.6` / `^18.0.10` | `2.8.6` / `18.0.10` |
| **Frontend Core** | React / React DOM | `18.3.1` / `18.3.1` | `18.3.1` / `18.3.1` |
| **HTTP Client** | Axios | `^1.7.9` | `1.21.1` |
| **Build / Dev Tool** | Vite / `@vitejs/plugin-react` | `^6.0.11` / `^4.3.4` | `6.4.6` / `4.7.0` |
| **UI Styling** | Bootstrap CSS (CDN) + Custom CSS | `frontend/index.html` | `5.3.3` |
| **Kiểm thử API** | Newman / `newman-reporter-htmlextra` | CLI toàn cục | `6.2.3` / `1.23.1` |

---

## 4. Phân tích bài toán và thiết kế hệ thống

```text
┌───────────────────────────┐       HTTP/JSON (Axios)       ┌───────────────────────────────────────────────────┐
│   Frontend (React + Vite) │  ──────────────────────────▶  │           Backend REST API (Express 4)            │
│   http://localhost:5173   │  ◀──────────────────────────  │           http://localhost:5000/api               │
└───────────────────────────┘                               ├───────────────────────────────────────────────────┤
  • pages/ (3 màn hình)                                     │ 1. routes/       (health, equipments, borrowings, │
  • hooks/ (state & AbortCtrl)                              │                   fines)                          │
  • services/ (axiosClient)                                 │ 2. controllers/  (parse req -> Zod -> call svc)   │
  • components/ (UI & Modals)                               │ 3. services/     (business rules, +07:00,         │
                                                            │                   runInTransaction)               │
                                                            │ 4. repositories/ (SQL thuần qua mysql2 Pool)      │
                                                            │ 5. middlewares/  (notFound 404, errorHandler)     │
                                                            └─────────────────────────┬─────────────────────────┘
                                                                                      │ mysql2/promise Pool
                                                                                      │ (time_zone = '+07:00',
                                                                                      │  dateStrings: true)
                                                                                      ▼
                                                            ┌───────────────────────────────────────────────────┐
                                                            │                MySQL (rikkei_lab)                 │
                                                            │   equipments ◀─── borrowings ◀─── fines (0..1)    │
                                                            │   (ON DELETE RESTRICT & CHECK constraints)        │
                                                            └───────────────────────────────────────────────────┘
```

- **Frontend** gọi API tập trung qua `frontend/src/services/axiosClient.js` (`baseURL` đọc từ `VITE_API_BASE_URL`, timeout `10000ms`), chuẩn hóa lỗi qua `normalizeApiError` và không tính toán thay quyền chốt nghiệp vụ của Backend.
- **Backend** kiểm tra đầu vào bằng Zod tại Controller, thực thi nghiệp vụ và transaction (`SELECT ... FOR UPDATE`) tại Service, thực hiện truy vấn tham số hóa (`?`) tại Repository để chống SQL injection, và trả về cấu trúc JSON thống nhất.

---

## 5. Cấu trúc thư mục dự án

```text
AI-SDLC-PTHB260930_Fullstack_RikkeiLab/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js (mysql2 pool +07:00), env.js (Zod env parser)
│   │   ├── controllers/     # borrowing, equipment, fine, health controllers
│   │   ├── middlewares/     # errorHandler.js, notFound.js
│   │   ├── repositories/    # borrowing, equipment, fine SQL repositories
│   │   ├── routes/          # index.js + route từng module (/api/*)
│   │   ├── services/        # business logic + runInTransaction
│   │   ├── utils/           # AppError.js, constants.js, date.js, transaction.js
│   │   ├── validators/      # Zod schemas (equipment, borrowing, fine)
│   │   ├── app.js           # Express app setup (CORS, express.json, /api routes)
│   │   └── server.js        # Khởi chạy HTTP server + kiểm tra DB + graceful shutdown
│   ├── .env.example         # Mẫu biến môi trường Backend
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── borrowings/  # BorrowFilter, BorrowForm, BorrowTable, ConfirmReturnModal
│   │   │   ├── common/      # AppNavbar, AppShell, BackendStatus, EmptyState,
│   │   │   │                # LoadingState, Pagination, ReturnWithFineModal, StatusAlert
│   │   │   ├── equipments/  # ConfirmDeleteModal, EquipmentDetailModal, EquipmentFormModal,
│   │   │   │                # EquipmentTable, EquipmentToolbar
│   │   │   └── fines/       # ConfirmPayFineModal, FineSummary, FineTable
│   │   ├── hooks/           # useBorrowings.js, useEquipments.js, useFines.js
│   │   ├── pages/           # EquipmentPage.jsx, BorrowingPage.jsx, FinePage.jsx
│   │   ├── services/        # axiosClient.js, equipmentService.js, borrowingService.js,
│   │   │                    # fineService.js, healthService.js
│   │   ├── styles/          # custom.css
│   │   ├── utils/           # error.js, format.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html           # Nhúng Bootstrap 5.3.3 CDN
│   ├── .env.example         # Mẫu biến môi trường Frontend
│   ├── vite.config.js       # port 5173, strictPort: true
│   ├── package.json
│   └── package-lock.json
├── db/
│   ├── schema.sql           # Tạo DB rikkei_lab, bảng equipments & borrowings
│   ├── mo_rong.sql          # Tạo bảng fines (Hướng mở rộng A)
│   └── seed.sql             # 14 thiết bị, 17 phiếu mượn, 4 khoản phạt mẫu
├── evidence/
│   ├── postman/             # RikkeiLab.postman_collection.json,
│   │                        # RikkeiLab.local.postman_environment.json & 7 ảnh Newman
│   └── ui/                  # 14 ảnh kiểm thử giao diện Desktop / Tablet / Mobile
├── .gitignore               # Loại trừ .env, node_modules, dist, log
├── prompts.md               # Nhật ký prompt và báo cáo từng bước
└── README.md
```

---

## 6. Yêu cầu môi trường trước khi cài đặt

- **Node.js:** Khuyến nghị v20 LTS trở lên (đã kiểm chứng trên `Node.js v24.18.0`, hỗ trợ `node --watch` dùng trong `npm run dev`).
- **npm:** Phiên bản đi kèm Node.js (đã kiểm chứng trên `npm 11.16.0`).
- **MySQL Server:** Phiên bản hỗ trợ `InnoDB`, `utf8mb4_unicode_ci` và `CHECK` constraints (MySQL `8.0+`).
- **Trình duyệt hiện đại** (Chrome / Edge / Firefox) để truy cập Frontend.
- *(Tùy chọn cho kiểm thử API)* **`newman` `>= 6.2.3`** hoặc **Postman Desktop `>= v10.22`** (khuyến nghị Postman v11).

---

## 7. Hướng dẫn tạo Database và chạy các file SQL

Chạy các script SQL theo đúng thứ tự: **`db/schema.sql` → `db/mo_rong.sql` → `db/seed.sql`**.

### Bước 1: Tạo tài khoản MySQL (nếu chưa có user `rikkei_dev`)
Đăng nhập MySQL với quyền quản trị (`root`) và cấp quyền cho database `rikkei_lab`:

```sql
CREATE USER IF NOT EXISTS 'rikkei_dev'@'127.0.0.1' IDENTIFIED BY 'mat_khau_cua_ban';
GRANT ALL PRIVILEGES ON rikkei_lab.* TO 'rikkei_dev'@'127.0.0.1';
FLUSH PRIVILEGES;
```

### Bước 2: Nạp schema, bảng mở rộng và dữ liệu mẫu (trên DB mới)

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p < db/mo_rong.sql
mysql -u root -p < db/seed.sql
```

*(Trên Windows PowerShell, có thể dùng `Get-Content db/schema.sql -Raw | mysql -u root -p` hoặc nạp trực tiếp qua MySQL Workbench / `SOURCE` theo đúng thứ tự trên.)*

> [!WARNING]
> **Không chạy `db/seed.sql` đè lên Database đang có dữ liệu:** `seed.sql` chèn trực tiếp 14 mã `LAB-001..014` và 17 dòng `borrowings` tương ứng. Nếu chạy lại trên DB đã có dữ liệu, lệnh `INSERT` thiết bị sẽ lỗi trùng khóa `uq_equipments_code` hoặc nhân bản phiếu mượn. Chỉ nạp `seed.sql` một lần cho Database mới tinh chưa có bản ghi.

### Kết quả kiểm tra sau khi nạp SQL lần đầu:
- `equipments`: `14` bản ghi (`LAB-001` đến `LAB-014`, đủ 4 loại ENUM, có thiết bị hết hàng `LAB-003`/`LAB-005` và thiết bị chưa từng mượn).
- `borrowings`: `17` bản ghi (đang mượn trong hạn, đúng hạn hôm nay, quá hạn chưa trả, đã trả đúng hạn, trả trễ chưa thu phạt, trả trễ đã thu phạt).
- `fines`: `4` bản ghi (`2` `unpaid` tổng `55.000 đ` và `2` `paid` tổng `80.000 đ`).

---

## 8. Hướng dẫn cấu hình biến môi trường (.env)

Tuyệt đối không commit file `.env` thật lên Git (`.gitignore` đã chặn `.env`, `backend/.env`, `frontend/.env`).

### 1. Backend (`backend/.env`)
Sao chép từ [backend/.env.example](file:///c:/Users/Admin/Documents/AI,%20C%C3%94NG%20NGH%E1%BB%86,%20MXH/DEV%20FULL%20STACK/AI-DRIVEN/BACKEND/RikkeiLab_Fullstack_3h/AI-SDLC-PTHB260930_Fullstack_RikkeiLab/backend/.env.example):

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=rikkei_dev
DB_PASSWORD=your_mysql_password_here
DB_NAME=rikkei_lab
CORS_ORIGIN=http://localhost:5173
```

**Lưu ý từ `backend/src/config/env.js`:** Backend dùng Zod kiểm tra toàn bộ các biến trên khi khởi động (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` không được để trống; nếu thiếu hoặc sai kiểu sẽ in `[ENV ERROR]` và thoát với mã `1`).

### 2. Frontend (`frontend/.env`)
Sao chép từ [frontend/.env.example](file:///c:/Users/Admin/Documents/AI,%20C%C3%94NG%20NGH%E1%BB%86,%20MXH/DEV%20FULL%20STACK/AI-DRIVEN/BACKEND/RikkeiLab_Fullstack_3h/AI-SDLC-PTHB260930_Fullstack_RikkeiLab/frontend/.env.example):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 9. Hướng dẫn cài đặt dependencies

Từ thư mục gốc dự án (`AI-SDLC-PTHB260930_Fullstack_RikkeiLab/`):

```bash
cd backend
npm install
```

Mở terminal mới hoặc quay về thư mục gốc để cài cho Frontend:

```bash
cd frontend
npm install
```

---

## 10. Hướng dẫn chạy Backend và Frontend

Chạy Backend và Frontend trên **hai cửa sổ terminal riêng biệt**:

### Terminal 1 – Khởi động Backend (`backend/`)
```bash
cd backend
npm run dev
# Hoặc chạy production/không watch:
# npm start
```
Log thành công kỳ vọng:
```text
[API] Server Rikkei Lab đang chạy tại http://localhost:5000
[DB] Kết nối MySQL thành công (database: rikkei_lab, session time_zone: +07:00)
```

### Terminal 2 – Khởi động Frontend (`frontend/`)
```bash
cd frontend
npm run dev
```
Log thành công kỳ vọng (`frontend/vite.config.js` khóa `strictPort: true` ở `5173`):
```text
  VITE v6.4.6  ready in ... ms
  ➜  Local:   http://localhost:5173/
```

*(Các lệnh build & preview khác của Frontend trong `frontend/package.json`: `npm run build`, `npm run preview` trên cổng `4173`.)*

---

## 11. Địa chỉ truy cập ứng dụng và Health API

- **Giao diện Web (Frontend):** `http://localhost:5173/`
- **API Base URL:** `http://localhost:5000/api`
- **Health Check Endpoint:** `GET http://localhost:5000/api/health`
  - Phản hồi thành công (`200 OK`):
    ```json
    {
      "status": "ok",
      "database": "connected"
    }
    ```
  - Kiểm tra `SELECT 1 AS ok, @@session.time_zone AS sessionTz` phải trả đúng `+07:00`.

---

## 12. Danh sách API theo từng nhóm nghiệp vụ

### A. Nhóm Health
| Method | Endpoint | Mô tả | Status thành công |
|---|---|---|---|
| `GET` | `/api/health` | Kiểm tra API Server, kết nối MySQL và session `time_zone = '+07:00'` | `200 OK` |

### B. Nhóm Thiết bị (`/api/equipments`)
| Method | Endpoint | Query / Body | Mô tả | Status / Error Codes chính |
|---|---|---|---|---|
| `GET` | `/api/equipments` | `?search=&category=all\|laptop\|man_hinh\|mach_dien_tu\|phu_kien&page=1&limit=8` (`limit` tối đa `100`) | Danh sách thiết bị phân trang kèm `borrowedQuantity`, `availableQuantity` | `200`, `400 VALIDATION_ERROR` |
| `GET` | `/api/equipments/:id` | Param `:id` nguyên dương | Xem chi tiết thiết bị | `200`, `400 VALIDATION_ERROR`, `404 EQUIPMENT_NOT_FOUND` |
| `POST` | `/api/equipments` | `{ code, name, category, totalQuantity }` | Thêm thiết bị mới (`code <= 20`, `name <= 150`, `totalQuantity >= 0`) | `201`, `400 VALIDATION_ERROR`, `409 DUPLICATE_EQUIPMENT_CODE` |
| `PUT` | `/api/equipments/:id` | `{ code, name, category, totalQuantity }` | Cập nhật thiết bị (trong transaction `FOR UPDATE`) | `200`, `400`, `404`, `409 DUPLICATE_EQUIPMENT_CODE` / `TOTAL_QUANTITY_LESS_THAN_BORROWED` |
| `DELETE` | `/api/equipments/:id` | Param `:id` | Xóa thiết bị chưa từng phát sinh phiếu mượn | `200`, `400`, `404`, `409 EQUIPMENT_HAS_BORROWINGS` |

### C. Nhóm Mượn trả (`/api/borrowings`)
| Method | Endpoint | Query / Body | Mô tả | Status / Error Codes chính |
|---|---|---|---|---|
| `GET` | `/api/borrowings` | `?status=all\|borrowed\|overdue\|returned` | Danh sách phiếu mượn kèm mã `PM-xxx`, trạng thái động & thông tin phạt | `200`, `400 VALIDATION_ERROR` |
| `POST` | `/api/borrowings` | `{ equipmentId, borrowerName, quantity, dueDate, note? }` (`note` tùy chọn) | Tạo phiếu mượn (`borrowedAt` lấy ngày `+07:00` server, hạn tối đa 14 ngày) | `201`, `400 VALIDATION_ERROR` / `INVALID_DUE_DATE` / `DUE_DATE_EXCEEDS_LIMIT`, `404 EQUIPMENT_NOT_FOUND`, `409 INSUFFICIENT_QUANTITY` |
| `PATCH` | `/api/borrowings/:id/return` | Không cần body (`returnedAt` server quyết định) | Trả thiết bị; nếu trễ hạn thì chốt `1` bản ghi `fines` trạng thái `unpaid` | `200`, `400 VALIDATION_ERROR` / `INVALID_RETURN_DATE`, `404 BORROWING_NOT_FOUND`, `409 BORROWING_ALREADY_RETURNED` |

### D. Nhóm Quá hạn & Tiền phạt (`/api/fines`)
| Method | Endpoint | Body | Mô tả | Status / Error Codes chính |
|---|---|---|---|---|
| `GET` | `/api/fines` | - | Tổng hợp 4 chỉ số (`dailyRate`, `collectedAmount`, `unpaidSettledAmount`, `provisionalAmount`, `totalOwedAmount`) và danh sách phiếu liên quan đến tiền phạt (`unpaid` → `provisional` → `paid`) | `200` |
| `PATCH` | `/api/fines/:id/pay` | `{}` hoặc không gửi body (`payFineBodySchema` chặn mọi field client gửi lên) | Thu đủ 1 lần khoản phạt `unpaid`, đặt `status = 'paid'`, `paidAt = todayVN` | `200`, `400 VALIDATION_ERROR`, `404 FINE_NOT_FOUND`, `409 FINE_ALREADY_PAID` |

---

## 13. Giả định nghiệp vụ và kỹ thuật

1. **Múi giờ nghiệp vụ thống nhất:** Cả Node.js (`backend/src/utils/date.js`) và MySQL Pool (`backend/src/config/db.js`, `timezone: '+07:00'` + `SET time_zone = '+07:00'`) đều dùng múi giờ **`Asia/Ho_Chi_Minh` (`+07:00`)** và định dạng ngày ISO `YYYY-MM-DD` qua API (`dateStrings: true`), hiển thị `dd/mm/yyyy` ở Frontend.
2. **Tính tồn kho động (`availableQuantity`):** Bảng `equipments` không lưu cột `available_quantity` vật lý. Giá trị này luôn được Backend/MySQL tính động:
   `availableQuantity = total_quantity - SUM(quantity các phiếu có returned_at IS NULL)`.
3. **Mã phiếu & trạng thái phiếu mượn tính động:**
   - Bảng `borrowings` không lưu cột `code`; mã `PM-001`, `PM-002`... được định dạng động từ `id` (`PM-${String(id).padStart(3, '0')}`).
   - Trạng thái được tính theo ngày `+07:00` hiện tại (`todayVN`):
     - `returnedAt !== null` → `returned` (`Đã trả`)
     - `returnedAt === null && dueDate < todayVN` → `overdue` (`Quá hạn`)
     - `returnedAt === null && dueDate >= todayVN` → `borrowed` (`Đang mượn`) — trả đúng hạn hoặc mượn–trả trong cùng ngày không bị coi là quá hạn.
4. **Giới hạn mượn 14 ngày:** `borrowedAt` luôn lấy `todayVN` tại server; `dueDate` phải thỏa `0 <= dueDate - borrowedAt <= 14` ngày.
5. **Quy tắc tiền phạt (cố định `5.000 VND / thiết bị / ngày`):**
   - `DAILY_FINE_RATE = 5000`, `fineAmount = lateDays × quantity × 5000`.
   - **`provisional` (*Tạm tính – Chưa trả*):** Áp dụng cho phiếu quá hạn chưa trả (`returned_at IS NULL AND due_date < todayVN AND chưa có bản ghi fines`). Số tiền được tính động theo từng ngày trôi qua, chưa ghi vào bảng `fines` và **không thể thu tiền trước khi trả thiết bị**.
   - **`unpaid` (*Đã chốt – Chưa thu*):** Khi gọi `PATCH /api/borrowings/:id/return` cho phiếu trả trễ (`lateDays > 0`), hệ thống chèn `1` bản ghi cố định vào bảng `fines` (`status = 'unpaid'`, `paid_at = NULL`).
   - **`paid` (*Đã thu*):** Khi gọi `PATCH /api/fines/:id/pay`, nhân viên thu **toàn bộ khoản phạt trong 1 lần** (`status = 'paid'`, `paid_at = todayVN`).
   - Tổng đang nợ: `totalOwedAmount = unpaidSettledAmount + provisionalAmount` (tách riêng với `collectedAmount` để không cộng trùng).
   - *Lưu ý về biến thiên số liệu theo ngày thực tế:* Vì `provisionalAmount` cộng dồn theo `DATEDIFF(todayVN, due_date)` cho mọi phiếu seed chưa trả (`PM-006..010`), tổng tiền phạt tạm tính tăng tự động mỗi lần bước sang ngày mới theo giờ `+07:00` (ví dụ trong đợt kiểm thử ngày `25/11/2026`, `provisionalAmount = 145.000 đ`, `totalOwedAmount = 200.000 đ`; sang ngày `26/11/2026`, `14` đơn vị chưa trả tăng thêm `+1` ngày = `+70.000 đ`, đưa mức nền seed lên `provisionalAmount = 215.000 đ`, `totalOwedAmount = 270.000 đ`).

---

## 14. Quy tắc Transaction, concurrency và rollback

Mọi thao tác ghi có kiểm tra điều kiện nhiều bước đều dùng helper `runInTransaction(work)` trong [transaction.js](file:///c:/Users/Admin/Documents/AI,%20C%C3%94NG%20NGH%E1%BB%86,%20MXH/DEV%20FULL%20STACK/AI-DRIVEN/BACKEND/RikkeiLab_Fullstack_3h/AI-SDLC-PTHB260930_Fullstack_RikkeiLab/backend/src/utils/transaction.js) (`beginTransaction()` → `work(conn)` → `commit()`, tự động `rollback()` khi có lỗi và luôn `conn.release()` trong `finally`):

- **Tạo phiếu mượn (`createBorrowing`):** Khóa hàng thiết bị bằng `SELECT ... FOR UPDATE` (`findByIdForUpdate`), cộng tổng đang mượn trong cùng transaction trước khi `INSERT` để ngăn 2 request đồng thời mượn vượt tồn kho.
- **Sửa / Xóa thiết bị (`updateEquipment`, `deleteEquipment`):** Khóa `FOR UPDATE` trên `equipments` rồi mới kiểm tra `totalQuantity >= currentBorrowed` hoặc `countBorrowingsByEquipmentId === 0`; tầng DB vẫn giữ `ON DELETE RESTRICT` trên `fk_borrowings_equipment`.
- **Trả thiết bị (`returnBorrowing`):** Khóa `FOR UPDATE` trên `borrowings`, kiểm tra `returned_at === null`, cập nhật điều kiện kép `WHERE id = ? AND returned_at IS NULL` (`affectedRows === 1`), và chèn `fines` (`borrowing_id UNIQUE`) trong **cùng một transaction** — nếu chèn `fines` lỗi, thao tác trả cũng rollback sạch. Bắt `ER_DUP_ENTRY` trả `409 BORROWING_ALREADY_RETURNED`.
- **Thu tiền phạt (`payFine`):** Khóa `FOR UPDATE` trên `fines`, cập nhật `WHERE id = ? AND status = 'unpaid'` (`affectedRows === 1`), ngăn double-pay dưới truy cập đồng thời (`409 FINE_ALREADY_PAID`).
- **Xử lý tranh chấp lock DB:** `ER_LOCK_DEADLOCK` trả `409 CONCURRENT_CONFLICT`; `ER_LOCK_WAIT_TIMEOUT` trả `503 LOCK_WAIT_TIMEOUT`.

---

## 15. Quy tắc bảo mật và xử lý lỗi

- **Không tin dữ liệu tính toán từ client:** `borrowedAt`, `returnedAt`, `paidAt`, `lateDays`, `dailyRate`, `amount` đều do Backend tính và chốt. Endpoint `PATCH /api/fines/:id/pay` dùng `payFineBodySchema` chặn mọi body khác `{}` (`400 VALIDATION_ERROR`).
- **CORS & Input Validation:** Chỉ cho phép origin trong `CORS_ORIGIN`; toàn bộ params, query và body được validate bằng Zod trước khi vào Service; trả `400 INVALID_JSON` nếu payload JSON sai cú pháp.
- **SQL Injection & Secret Safety:** Mọi câu SQL dùng prepared/parameterized placeholders (`?`); `.gitignore` loại trừ toàn bộ `.env`; `errorHandler` chỉ trả `{ error: { code, message } }` thân thiện tiếng Việt, không lộ stack trace hay thông tin DB ra client (503 cho lỗi kết nối DB, 500 `INTERNAL_SERVER_ERROR` cho lỗi không xác định).

---

## 16. Hướng dẫn kiểm thử bằng Newman / Postman

Bộ kiểm thử nằm tại:
- Collection: [RikkeiLab.postman_collection.json](file:///c:/Users/Admin/Documents/AI,%20C%C3%94NG%20NGH%E1%BB%86,%20MXH/DEV%20FULL%20STACK/AI-DRIVEN/BACKEND/RikkeiLab_Fullstack_3h/AI-SDLC-PTHB260930_Fullstack_RikkeiLab/evidence/postman/RikkeiLab.postman_collection.json) (`5` Folder, `35` Request).
- Environment: [RikkeiLab.local.postman_environment.json](file:///c:/Users/Admin/Documents/AI,%20C%C3%94NG%20NGH%E1%BB%86,%20MXH/DEV%20FULL%20STACK/AI-DRIVEN/BACKEND/RikkeiLab_Fullstack_3h/AI-SDLC-PTHB260930_Fullstack_RikkeiLab/evidence/postman/RikkeiLab.local.postman_environment.json) (`19` biến, không chứa mật khẩu).

### Quy tắc an toàn & chạy bằng Newman CLI (`newman >= 6.2.3`)

1. Khởi động Backend (`http://localhost:5000`) và đảm bảo 7 biến ID thử nghiệm (`tempCrudEqId`, `tempCrudEqCode`, `tempFlowEqId`, `tempBorrowingId`, `tempOverdueEqId`, `tempOverdueBorrowingId`, `tempOverdueFineId`) trong Environment đang rỗng.
2. **Chạy Folder 1–4** (không dùng trực tiếp file gốc làm `--export-environment` để giữ sạch bản git):
   ```bash
   newman run evidence/postman/RikkeiLab.postman_collection.json \
     --folder "1. Health" \
     --folder "2. Equipments" \
     --folder "3. Borrowings" \
     --folder "4. Fines" \
     -e evidence/postman/RikkeiLab.local.postman_environment.json \
     --export-environment ./tmp-f14-out.json
   ```
   - `1.1` luôn kiểm tra 7 biến ID tạm trước: nếu còn ID chưa cleanup sẽ bật `runBlocked='true'`, dừng Runner ngay sau Health và chặn toàn bộ request tiếp theo ở Collection Pre-request (`haltRunnerAndSkip`).
   - `2.12` tự xóa `tempCrudEqId` trong DB và chỉ `unset` biến sau HTTP `200`; Folder 3 để lại `tempFlowEqId` và `tempBorrowingId` để cleanup có kiểm soát.
3. **Chạy Folder 5 (`5. Overdue Pay`):** Chạy `5.1`, `5.2` (lấy `tempOverdueEqId`, `tempOverdueBorrowingId`), tạm dừng để chạy SQL backdate khóa chặt theo ID và `returned_at IS NULL` (`SET time_zone = '+07:00'`), rồi tiếp tục `5.3` → `5.6`.
4. **Dọn dẹp SQL đúng ID theo thứ tự Foreign Key:** `fines` → `borrowings` → `equipments` (kiểm tra `affectedRows = 1` và `0` dòng còn lại sau mỗi lệnh `DELETE`, không dùng `LIKE`/xóa diện rộng), sau đó mới xóa biến tạm trong Environment và chạy lại `1.1`.
5. **Nếu dùng Postman Desktop GUI:** Yêu cầu phiên bản **`>= v10.22`** (khuyến nghị Postman v11) để hỗ trợ `pm.execution.skipRequest()` và `pm.execution.setNextRequest(null)`.

---

## 17. Kết quả nghiệm thu thực tế, lỗi khó phát hiện nhất và giới hạn đã biết

### Kết quả nghiệm thu Bước 6.3
- **Kiểm thử API qua `newman@6.2.3` + Backend thực tế:**
  - Tổng cộng **`35/35` request PASS** và **`71/71` assertions PASS** (`0` failed):
    - Folder 1–4: **`29/29` request**, **`59/59` assertions** PASS.
    - Folder 5: **`6/6` request**, **`12/12` assertions** PASS (có bước tạm dừng SQL backdate chuẩn xác theo ID).
  - Cơ chế cổng chặn fail-closed (`1.1`) và guard (`runBlocked='true'`) đã được xác minh trực tiếp qua Newman (`0` request mutating bị gửi khi còn ID bẩn).
- **Kiểm tra Database:** Dữ liệu thử nghiệm đã cleanup đúng thứ tự FK; MySQL trở về nguyên vẹn **`14 equipments / 17 borrowings / 4 fines`** với `0` bản ghi dư thừa.
- **Kiểm tra giao diện thực tế (Chrome chạy trên profile tách biệt `chrome_profile_63`, không chạm profile cá nhân):**
  - Đủ cả 3 màn hình (**Thiết bị**, **Phiếu mượn**, **Quá hạn & tiền phạt**), đầy đủ thao tác CRUD, mượn/trả đúng hạn & quá hạn, thu phạt, loading, empty state và các lỗi `400`, `404`, `409`.
  - Responsive đạt ở cả **Desktop (`1280×900`)**, **Tablet (`768×1024`)** và **Mobile (`375×812`)** với `0` tràn ngang, **`0` lỗi JS console** và **`0` page error**.

### Lỗi khó phát hiện nhất và cách xử lý
Trong quá trình xây dựng và nghiệm thu Postman Collection, hai lỗi runtime ẩn chỉ lộ diện khi chạy thật bằng `newman@6.2.3` (`postman-sandbox@4.7.1`) chứ không xuất hiện ở kiểm tra tĩnh Node.js thông thường: (1) hàm `getTodayVN()` dùng `Intl.DateTimeFormat` bị `ReferenceError: Intl is not defined` trong `postman-sandbox` và lại chạy **trước** đoạn kiểm tra `runBlocked === 'true'`, vô tình làm vô hiệu hóa guard fail-closed cho mọi request khác `1.1`; (2) toàn bộ 34 test script từ `2.1` đến `5.6` khai báo `const data = pm.response.json()` bị `SyntaxError: Identifier 'data' has already been declared` vì trùng với legacy global `data` (và cả `responseBody`) trong `postman-legacy-interface.js`. Cả hai đã được xử lý dứt điểm bằng cách đưa khối kiểm tra `runBlocked` lên đầu Collection Pre-request trước khi tính ngày bằng toán học UTC+07:00 thuần (`Date.now() + 7*3600*1000` và `Date.UTC()`), đổi toàn bộ biến cục bộ ở 34 request sang `resBody`, rồi kiểm chứng lại `35/35` PASS trên `newman@6.2.3`.

### Giới hạn đã biết
- **Postman Desktop GUI:** Trợ lý không có quyền điều khiển cửa sổ ứng dụng Postman Desktop GUI, nên toàn bộ kiểm thử API và `7` ảnh minh chứng trong `evidence/postman/` được thực hiện và chụp trực tiếp từ báo cáo chính thức của **`newman@6.2.3`** (`newman-reporter-htmlextra`), **không phải** ảnh chụp giao diện Postman Desktop GUI.

---

## 18. Danh sách ảnh minh chứng trong thư mục `evidence/`

### A. Ảnh giao diện trình duyệt thực tế (`evidence/ui/` – 14 ảnh)

| STT | Tệp ảnh | Kích thước | Nội dung minh chứng |
|---:|---|---:|---|
| 01 | [01-equipment-list-desktop.png](evidence/ui/01-equipment-list-desktop.png) | `1280×900` | Danh sách thiết bị Desktop, badge `Còn hàng`/`Hết hàng`, phân trang `1/2 · 14 thiết bị` |
| 02 | [02-equipment-empty-state.png](evidence/ui/02-equipment-empty-state.png) | `1280×900` | Empty state khi tìm kiếm không khớp và nút `Xóa bộ lọc` |
| 03 | [03-equipment-delete-409-error.png](evidence/ui/03-equipment-delete-409-error.png) | `1280×900` | Thông báo lỗi `409` khi xóa thiết bị đã có phiếu mượn (`LAB-001`) |
| 04 | [04-equipment-form-modal.png](evidence/ui/04-equipment-form-modal.png) | `1280×900` | Modal `Thêm thiết bị` nhập mới thiết bị thử nghiệm |
| 05 | [05-borrowing-list-and-form.png](evidence/ui/05-borrowing-list-and-form.png) | `1280×900` | Màn hình Phiếu mượn: form tạo phiếu, bộ lọc 4 trạng thái và danh sách phiếu |
| 06 | [06-borrowing-validation-error.png](evidence/ui/06-borrowing-validation-error.png) | `1280×900` | Thông báo lỗi validation client khi tạo phiếu thiếu trường bắt buộc |
| 07 | [07-borrowing-return-modal.png](evidence/ui/07-borrowing-return-modal.png) | `1280×900` | Tạo phiếu thành công và modal `Xác nhận trả thiết bị` đúng hạn |
| 08 | [08-fines-summary-and-table.png](evidence/ui/08-fines-summary-and-table.png) | `1280×900` | Tổng quan tiền phạt (`80.000 đ` đã thu / `300.000 đ` đang nợ ngày `26/11` khi có phiếu quá hạn tạm tính `30.000 đ`) và bảng 3 trạng thái |
| 09 | [09-overdue-return-with-fine-modal.png](evidence/ui/09-overdue-return-with-fine-modal.png) | `1280×900` | Modal `Trả thiết bị quá hạn` hiển thị số ngày trễ và tiền phạt tạm tính `30.000 đ` |
| 10 | [10-fine-confirm-pay-modal.png](evidence/ui/10-fine-confirm-pay-modal.png) | `1280×900` | Modal `Xác nhận thu tiền phạt` cho khoản đã chốt `30.000 đ` |
| 11 | [11-tablet-768px-equipments.png](evidence/ui/11-tablet-768px-equipments.png) | `768×1024` | Giao diện Tablet `768px` (navbar collapse, không tràn ngang) |
| 12 | [12-mobile-375px-equipments.png](evidence/ui/12-mobile-375px-equipments.png) | `375×812` | Giao diện Mobile `375px` màn hình Thiết bị |
| 13 | [13-mobile-375px-fines.png](evidence/ui/13-mobile-375px-fines.png) | `375×812` | Giao diện Mobile `375px` màn hình Tiền phạt sau khi thu `30.000 đ` (`110.000 đ` đã thu / `270.000 đ` đang nợ) |
| 14 | [14-equipment-delete-404-error.png](evidence/ui/14-equipment-delete-404-error.png) | `1280×900` | Thông báo lỗi `404` thực từ Backend khi xóa thiết bị không còn trong DB |

### B. Ảnh báo cáo kiểm thử API từ Newman (`evidence/postman/` – 7 ảnh Newman, KHÔNG phải Postman Desktop GUI)

| STT | Tệp ảnh | Kích thước | Nội dung minh chứng (Newman `htmlextra`) |
|---:|---|---:|---|
| 01 | [newman-01-summary-f1-4.png](evidence/postman/newman-01-summary-f1-4.png) | `1280×960` | Tổng quan chạy Newman Folder 1–4 (`29` requests, `59` assertions, `0` lỗi) |
| 02 | [newman-02-health-1-1-200.png](evidence/postman/newman-02-health-1-1-200.png) | `1360×1200` | Request `1.1 GET /api/health` → `200 OK`, pass `100 %` |
| 03 | [newman-03-equipment-conflict-409.png](evidence/postman/newman-03-equipment-conflict-409.png) | `1360×1200` | Request `2.7 POST /api/equipments` trùng mã → `409 Conflict`, pass `100 %` |
| 04 | [newman-04-fail-closed-probe-1-1.png](evidence/postman/newman-04-fail-closed-probe-1-1.png) | `1355×1000` | Kiểm thử cổng chặn fail-closed `1.1` khi còn `tempBorrowingId=RUN-BLOCK-PROBE-NOT-A-DB-ID` |
| 05 | [newman-05-borrowing-double-return-409.png](evidence/postman/newman-05-borrowing-double-return-409.png) | `1360×1200` | Request `3.12 PATCH /api/borrowings/54/return` trả trùng → `409 Conflict`, pass `100 %` |
| 06 | [newman-06-fine-missing-404.png](evidence/postman/newman-06-fine-missing-404.png) | `1360×1200` | Request `4.2 PATCH /api/fines/999999/pay` → `404 Not Found`, pass `100 %` |
| 07 | [newman-07-overdue-pay-fine-200.png](evidence/postman/newman-07-overdue-pay-fine-200.png) | `1360×1200` | Folder 5 (`5.3..5.6` đều PASS) và chi tiết `5.5` thu phạt quá hạn → `200 OK`, pass `100 %` |
