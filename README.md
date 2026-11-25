# Rikkei Lab – Hệ thống quản lý mượn trả thiết bị phòng thực hành

> **Trạng thái tài liệu:** Khung ban đầu (Giai đoạn 1 – Khởi tạo dự án). Hướng dẫn chạy chi tiết và ghi chú kiểm thử thực tế sẽ được cập nhật sau khi hoàn thành và kiểm chứng các giai đoạn Database, Backend, Frontend.

## 1. Giới thiệu bài toán

Ứng dụng web **Rikkei Lab** hỗ trợ quản lý mượn trả thiết bị phòng thực hành (laptop, màn hình, bo mạch điện tử, phụ kiện) theo kiến trúc 3 tầng **ReactJS (Vite) → Express (Node.js) → MySQL**:

- **Phần 1 (Chức năng cốt lõi):** Quản lý danh mục thiết bị (xem chi tiết, tìm kiếm, lọc theo loại, phân trang, thêm, sửa, xóa) và quản lý mượn trả thiết bị (tạo phiếu mượn, theo dõi trạng thái `Đang mượn` / `Quá hạn` / `Đã trả`, lọc theo trạng thái, trả thiết bị).
- **Phần 2 (Hướng mở rộng A – Quá hạn và tiền phạt):** Theo dõi tiền phạt tạm tính cho phiếu quá hạn chưa trả, chốt tiền phạt khi trả thiết bị trễ hạn và ghi nhận thu tiền phạt (phân biệt tiền phạt đã thu và tiền phạt đang nợ).

## 2. Cấu trúc thư mục

```text
AI-SDLC-PTHB260930_Fullstack_RikkeiLab/
├── backend/        # Express 4 API (CommonJS, mysql2/promise pool, Zod)
├── frontend/       # React 18 + Vite + Axios + Bootstrap 5.3.3 CDN
├── db/             # schema.sql, mo_rong.sql, seed.sql
├── evidence/       # Ảnh chụp minh chứng Postman và giao diện
│   ├── postman/
│   └── ui/
├── .gitignore
├── README.md
└── prompts.md
```

## 3. Hướng dẫn cài đặt và chạy dự án

*(Đang ở Giai đoạn 1 – Khởi tạo dự án. Các bước chạy chi tiết cho `db/`, `backend/` và `frontend/` sẽ được bổ sung đầy đủ và kiểm chứng thực tế ở các giai đoạn tiếp theo.)*

- Thứ tự nạp SQL dự kiến: `db/schema.sql` → `db/mo_rong.sql` → `db/seed.sql`
- Cổng mặc định:
  - Backend API: `http://localhost:5000/api` (`PORT=5000`)
  - Frontend Vite: `http://localhost:5173`

## 4. Giả định (Phần 1 & Quy ước chung)

1. **Mã phiếu mượn (`PM-xxx`):** Bảng `borrowings` giữ nguyên 8 cột theo đề bài (không thêm cột `code`). Mã phiếu hiển thị dạng `PM-001`, `PM-002`... được định dạng động từ `id` (`PM-${String(id).padStart(3, '0')}`).
2. **Số lượng còn lại (`availableQuantity`):** Không lưu thành cột vật lý trong bảng `equipments`, được tính động tại Backend/MySQL bằng `total_quantity - SUM(quantity của các phiếu có returned_at IS NULL)`.
3. **Xem chi tiết thiết bị:** Bổ sung API `GET /api/equipments/:id` và Modal Chi tiết trên giao diện để đáp ứng yêu cầu mục 4.3 của đề, chỉ hiển thị thông tin thiết bị, tổng số lượng, số lượng đang mượn và số lượng còn lại.
4. **Quy tắc sửa và xóa thiết bị:**
   - Cho phép sửa `code` nhưng kiểm tra duy nhất (loại trừ chính bản ghi đang sửa); trả HTTP `409` nếu trùng.
   - Chặn cập nhật `totalQuantity` nếu nhỏ hơn số lượng đang được mượn hiện tại (`newTotalQuantity < currentBorrowedQuantity`).
   - Không cho phép xóa thiết bị nếu đã phát sinh bất kỳ phiếu mượn nào, kể cả phiếu đã trả (`ON DELETE RESTRICT` + kiểm tra ở Backend Service trong transaction).
5. **Quy tắc ngày, thời hạn và múi giờ:**
   - Thống nhất múi giờ `Asia/Ho_Chi_Minh` (`+07:00`) cho cả Node.js và MySQL session.
   - API nhận và trả ngày định dạng ISO `YYYY-MM-DD`; Frontend hiển thị `dd/mm/yyyy`.
   - `borrowedAt` là ngày hiện tại khi tạo phiếu; cho phép mượn và trả trong cùng ngày (`dueDate >= borrowedAt`) và thời hạn tối đa `14` ngày.
   - Trạng thái phiếu: đã có `returnedAt` → `Đã trả`; chưa có `returnedAt` và `hôm nay > dueDate` → `Quá hạn`; chưa có `returnedAt` và `hôm nay <= dueDate` → `Đang mượn`.
6. **Phân trang:** Danh sách thiết bị phân trang ở Backend với `limit = 8` bản ghi/trang (`totalPages = Math.ceil(totalItems / limit)`, bằng `0` khi không có kết quả); danh sách phiếu mượn chỉ lọc theo trạng thái, không phân trang.
7. **Thư viện và phạm vi công nghệ:** Không dùng ORM, không cài thư viện ngoài danh sách đã khóa (`dotenv`, `cors`, `node --watch` ở Backend; Bootstrap 5.3.3 CDN và React state điều khiển điều hướng/Modal ở Frontend).

## 5. Phân tích (Phần 2 – Hướng A: Quá hạn và tiền phạt)

### 5.1. Bài toán và giả định nghiệp vụ
- Khách hàng yêu cầu khi trả muộn thì bị phạt, nhân viên cần thấy rõ mỗi phiếu đang nợ bao nhiêu tiền phạt và tổng tiền phạt đã thu.
- **Mức phạt cố định (giả định nghiệp vụ):** `5.000 VNĐ / thiết bị / ngày quá hạn`. Không có chức năng chỉnh sửa mức phạt.
- **Công thức:** `fineAmount = lateDays × quantity × 5000`, với `lateDays` tính từ ngày sau `dueDate` đến `returnedAt` (nếu đã trả) hoặc đến ngày hiện tại theo giờ Việt Nam (nếu chưa trả). Nếu `hôm nay == dueDate` thì chưa quá hạn (`lateDays = 0`).
- **Phân biệt khoản phạt:**
  - *Tạm tính chưa trả (`provisional`):* Phiếu chưa trả và đã quá hạn; số tiền thay đổi theo ngày hiện tại, không lưu vào bảng `fines`.
  - *Đang nợ đã chốt (`unpaid`):* Phiếu đã trả trễ hạn; số ngày trễ và tiền phạt được chốt cứng vào bảng `fines` tại thời điểm trả.
  - *Đã thu (`paid`):* Nhân viên thu **toàn bộ khoản phạt một lần** (không hỗ trợ thanh toán từng phần), ghi nhận `status = 'paid'` và `paid_at` trong Database.
- Tổng tiền phạt đang nợ trên giao diện được tách bạch thành hai thành phần: `totalOwedAmount = unpaidSettledAmount + provisionalAmount`.

### 5.2. Thiết kế bảng và API bổ sung
- **Database (`db/mo_rong.sql`):** Bổ sung bảng `fines` có quan hệ 1–1 tùy chọn với `borrowings` qua `borrowing_id UNIQUE` (`ON DELETE RESTRICT`), gồm `id`, `borrowing_id`, `late_days`, `daily_rate` (snapshot `5000`), `amount`, `status ENUM('unpaid', 'paid')`, `paid_at`, `created_at` và ràng buộc nhất quán trạng thái thanh toán.
- **Luồng xử lý 2 bước an toàn giao dịch:**
  1. `PATCH /api/borrowings/:id/return`: Trong transaction với `SELECT ... FOR UPDATE`, cập nhật `returned_at` và nếu trả trễ thì chèn đúng 1 bản ghi `fines` ở trạng thái `unpaid`.
  2. `GET /api/fines`: Trả về tổng hợp (`collectedAmount`, `unpaidSettledAmount`, `provisionalAmount`, `totalOwedAmount`, `dailyRate`) và danh sách phiếu có phát sinh phạt (tạm tính + đã chốt).
  3. `PATCH /api/fines/:id/pay`: Trong transaction với `SELECT ... FOR UPDATE`, kiểm tra `status === 'unpaid'` rồi mới cập nhật `paid` và `paid_at`; trả HTTP `409` nếu đã thu trước đó.

### 5.3. Các ca biên đã lường trước
- Trả đúng hạn hoặc đúng ngày `dueDate`: không tạo bản ghi `fines`.
- Gọi trả thiết bị 2 lần liên tiếp hoặc song song: khóa `FOR UPDATE` + kiểm tra `returned_at` ngăn trả trùng và ngăn sinh 2 bản ghi phạt.
- Gọi thu tiền phạt 2 lần hoặc song song: khóa `FOR UPDATE` + `WHERE status = 'unpaid'` trả HTTP `409`, chống cộng trùng tiền đã thu.
- Phiếu quá hạn chưa trả: không thể thu tiền phạt trước khi trả thiết bị (chỉ hiển thị nút `Trả` và tiền phạt tạm tính).
- Đổi ngày lúc nửa đêm: chuẩn hóa múi giờ `Asia/Ho_Chi_Minh` (`+07:00`) ở cả MySQL và Node.js, tránh lệch ngày UTC.

## 6. Lỗi khó phát hiện nhất và cách xử lý

*(Sẽ cập nhật 3–5 câu sau khi hoàn thành Giai đoạn 6 – Kiểm thử tổng thể.)*
