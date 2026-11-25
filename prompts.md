# Nhật ký Prompt và Kiểm soát Lỗi AI (`prompts.md`)

Tài liệu này ghi lại theo đúng thứ tự các prompt đã sử dụng với AI coding agent trong quá trình phân tích, thiết kế, triển khai và kiểm thử dự án **Rikkei Lab**, kèm phạm vi file, kết quả mong đợi và các lỗi thực tế phát hiện được cùng hướng xử lý.

---

## Prompt 1 – Giai đoạn 0: Đọc đề, đối chiếu giao diện mẫu và rà soát điểm chưa rõ

- **Nhiệm vụ:** Đọc toàn bộ đề bài `De_luyen_tap_Fullstack_3h_RikkeiLab.docx`, 7 tệp trong `giao_dien_mau/` và kiểm tra cấu trúc workspace hiện tại. Không viết mã nguồn, lập bảng đối chiếu yêu cầu, công nghệ, chức năng, dữ liệu, điểm chưa rõ, rủi ro suy diễn và đề xuất quyết định cần phê duyệt.
- **Phạm vi file:** Chỉ đọc tài liệu đề và giao diện mẫu; chưa tạo hay sửa tệp mã nguồn nào.
- **Kết quả mong đợi:** Xác định đúng khóa cứng công nghệ, các khoảng trống giữa đề và HTML mẫu (như tính năng "Xem chi tiết thiết bị", mã phiếu `PM-001`, quy tắc sửa/xóa thiết bị, múi giờ ngày `DATE`, chọn 1 hướng mở rộng cho Phần 2).
- **Lỗi / Điểm phát hiện và cách xử lý:**
  - *Phát hiện trong lúc đối chiếu đề và HTML mẫu:* Đề mục 4.3 yêu cầu chức năng **Xem chi tiết thiết bị**, nhưng `giao_dien_mau/index.html` chưa có nút/modal tương ứng; bảng `borrowings` không có cột `code` dù `phieu-muon.html` hiển thị `PM-001`; `a-tien-phat.html` có ô nhập sửa mức phạt dù đề không yêu cầu cấu hình động.
  - *Cách xử lý:* Phân tách rõ `[REQUIREMENT]`, `[UI REFERENCE]`, `[BUSINESS ASSUMPTION]` và trình danh sách câu hỏi chờ phê duyệt thay vì tự suy diễn.

---

## Prompt 2 – Phân tích thiết kế tổng thể (Phần 1 + Phần 2 Hướng A)

- **Nhiệm vụ:** Ghi nhận 8 quyết định đã chốt (chọn Hướng A – Quá hạn và tiền phạt với mức cố định 5.000 VNĐ/thiết bị/ngày; cấu trúc thư mục bàn giao độc lập; quy tắc sửa/xóa; múi giờ `Asia/Ho_Chi_Minh`; phân trang `limit = 8`; khóa công nghệ phụ trợ). Hoàn thành phân tích giao diện, nghiệp vụ, đề xuất DB (`fines`), API contract, ma trận mã lỗi và ca biên trước khi viết code.
- **Phạm vi file:** Chỉ cập nhật tài liệu phân tích thiết kế trong hội thoại; chưa tạo tệp dự án.
- **Kết quả mong đợi:** Bản thiết kế hoàn chỉnh thống nhất giữa DB, API, giao diện React và Requirement Traceability Matrix; chỉ rõ các đề xuất mới chờ duyệt.
- **Lỗi / Điểm phát hiện và cách xử lý:**
  - *Phát hiện trong lúc rà soát lại thiết kế:* Trong bản phân tích ban đầu có đề xuất thêm `FineFilter` trên màn hình tiền phạt; khi đối chiếu lại yêu cầu tối giản để tránh mở rộng ngoài đề, hạng mục này được loại bỏ khỏi phạm vi v1 theo chỉ đạo của người dùng. Đồng thời làm rõ sự khác biệt giữa tiền phạt tạm tính (chưa trả) và tiền phạt đã chốt chưa thu (`unpaid`).

---

## Prompt 3 – Giai đoạn 1: Phê duyệt 4 điểm kỹ thuật và khởi tạo dự án

- **Nhiệm vụ:** Khóa 4 đề xuất kỹ thuật (`GET /api/health`, `ConfirmPayFineModal`, `CHECK` constraint ngày trả trên MySQL hỗ trợ, quy tắc `totalPages = 0` khi rỗng và tự lùi trang khi xóa phần tử cuối) và khóa cơ chế kiểm soát đồng thời khi xóa thiết bị (`SELECT ... FOR UPDATE`), thống kê tiền phạt không cộng trùng, xử lý ngày tháng chuẩn VN. Thực hiện **Giai đoạn 1 – Khởi tạo dự án**.
- **Phạm vi file dự kiến:**
  - Thư mục gốc dự án: `AI-SDLC-PTHB260930_Fullstack_RikkeiLab/`
  - Các thư mục con: `frontend/`, `backend/`, `db/`, `evidence/postman/`, `evidence/ui/`
  - Các tệp khởi tạo: `.gitignore`, `README.md` (khung ban đầu), `prompts.md`
- **Kết quả mong đợi:**
  - Thư mục `AI-SDLC-PTHB260930_Fullstack_RikkeiLab/` được tạo đúng vị trí và là Git repository root độc lập, không ảnh hưởng thư mục cha.
  - `.gitignore` chặn tuyệt đối `node_modules/` và `.env` (giữ `.env.example`).
  - `README.md` khung ban đầu và `prompts.md` ghi nhận chính xác quy ước và tiến độ, không ghi thông tin chưa kiểm chứng.
- **Lỗi AI đã phát hiện và cách xử lý:** *(Chưa có lỗi mã nguồn do chưa bắt đầu viết code ở giai đoạn này.)*

---

## Prompt 4 – Commit #1 và Giai đoạn 2 (Bước 2.1 – Kiểm tra môi trường MySQL)

- **Nhiệm vụ:** Kiểm tra lại `.gitignore`, `README.md`, `prompts.md` và tạo Git Commit #1 (`feat: Khởi tạo cấu trúc dự án Fullstack Rikkei Lab`); sau đó bắt đầu Giai đoạn 2 bằng việc kiểm tra phiên bản MySQL thực tế (`SELECT VERSION()`), timezone, ngày hiện tại và danh sách database hiện có trước khi viết SQL.
- **Phạm vi file:**
  - Staging và Commit #1 cho: `.gitignore`, `README.md`, `prompts.md`
  - Cập nhật nhật ký Prompt 4 trong `prompts.md`
- **Kết quả mong đợi:**
  - Commit #1 tạo thành công tại Git root độc lập `AI-SDLC-PTHB260930_Fullstack_RikkeiLab/`.
  - Kết nối thành công vào MySQL server để lấy `SELECT VERSION()`, `@@session.time_zone`, `CURRENT_DATE()` và `SHOW DATABASES;`.
- **Kết quả thực tế & Điểm chặn gặp phải:**
  - Commit #1 (`d46ac0f`) thành công, `git ls-files` chỉ có đúng 3 tệp khởi tạo, Git root độc lập chính xác.
  - Khi chạy `mysql.exe -u root -e "SELECT VERSION()..."` bị từ chối xác thực: `ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)`.
  - *Cách xử lý:* Dừng đúng tại Bước 2.1, không suy đoán phiên bản server từ bản client (`8.0.44`), không viết hoặc giả lập kết quả kiểm thử SQL; báo rõ lỗi để người dùng cung cấp tài khoản/mật khẩu MySQL cục bộ (hoặc chạy truy vấn kiểm tra trực tiếp trong MySQL Workbench).

---

## Prompt 5 – Xác minh `.env`, kết nối MySQL với `rikkei_dev` và triển khai Giai đoạn 2 (`schema.sql`, `mo_rong.sql`, `seed.sql`)

- **Nhiệm vụ:** Kiểm tra `.gitignore` chặn `backend/.env`, xác nhận `.env` không bị Git theo dõi, kiểm tra biến môi trường (tuyệt đối không tiết lộ `DB_PASSWORD`), xác minh kết nối thực tế bằng tài khoản `rikkei_dev`, tạo `db/schema.sql`, `db/mo_rong.sql`, `db/seed.sql`, nạp theo đúng thứ tự vào `rikkei_lab` và chạy đủ các truy vấn kiểm chứng cấu trúc, ràng buộc và dữ liệu mẫu.
- **Phạm vi file dự kiến:**
  - `prompts.md` (cập nhật nhật ký Prompt 5)
  - `db/schema.sql`
  - `db/mo_rong.sql`
  - `db/seed.sql`
- **Kết quả mong đợi:**
  - `git check-ignore -v backend/.env` xác nhận `.env` bị chặn; `backend/.env` không nằm trong Git tracking.
  - Kết nối thành công MySQL bằng `rikkei_dev`, xác nhận `SELECT VERSION()`, timezone, charset/collation và bảng hiện có.
  - Chạy tuần tự `schema.sql` → `mo_rong.sql` → `seed.sql` không lỗi; kiểm chứng đủ >= 12 thiết bị, >= 15 phiếu mượn, 6 tình huống nghiệp vụ và kiểm thử thực thi khóa ngoại, UNIQUE, CHECK constraint.
- **Lỗi AI đã phát hiện và cách xử lý:**
  - *Kết quả kiểm thử thực tế Giai đoạn 2:* Không phát sinh lỗi SQL khi chạy tuần tự `schema.sql` → `mo_rong.sql` → `seed.sql` bằng tài khoản `rikkei_dev` trên MySQL `8.0.44`. Đã xác minh 14 thiết bị, 17 phiếu mượn, 4 bản ghi phạt, 5 kiểm tra bất thường (= 0), 12 test vi phạm ràng buộc bị chặn (`UNIQUE`, `CHECK`, `FOREIGN KEY ON DELETE RESTRICT`) và 1 test transaction rollback xóa thiết bị chưa phát sinh phiếu đều hoạt động chính xác.
  - *Lưu ý phòng ngừa lỗi đã áp dụng sẵn:* Đặt `INDEX idx_borrowings_equipment_returned` và `idx_fines_status` trực tiếp trong `CREATE TABLE IF NOT EXISTS` thay vì dùng `CREATE INDEX` rời (do MySQL 8 không hỗ trợ `CREATE INDEX IF NOT EXISTS`); dùng `LAST_INSERT_ID()` và truy vấn `SELECT id FROM equipments WHERE code = ...` trong `seed.sql` để không phụ thuộc ID tự tăng cố định.

---

## Prompt 6 – Giai đoạn 3 (Backend Phần 1): Nền tảng Backend, Connection Pool UTC+7 và `/api/health`

- **Nhiệm vụ:** Đọc lại tài liệu, kiểm tra Git Commit #2 (`dd969b1`), khởi tạo nền tảng Backend theo stack khóa cứng (Express 4, CommonJS, `mysql2/promise` pool, `zod`, `dotenv`, `cors`, `node --watch`), kiểm tra xác thực biến môi trường bằng Zod không lộ `DB_PASSWORD`, bảo đảm mọi kết nối mới trong Pool có MySQL session `time_zone = '+07:00'`, xây dựng helper ngày Việt Nam, middleware lỗi tập trung và endpoint `GET /api/health`. Chưa triển khai các API nghiệp vụ thiết bị/phiếu mượn/tiền phạt trong bước này.
- **Phạm vi file dự kiến:**
  - `prompts.md` (cập nhật Prompt 6 và kết quả kiểm thử thực tế)
  - `backend/package.json`, `backend/.env.example`
  - `backend/src/config/env.js`, `backend/src/config/db.js`
  - `backend/src/utils/AppError.js`, `backend/src/utils/date.js`
  - `backend/src/middlewares/notFound.js`, `backend/src/middlewares/errorHandler.js`
  - `backend/src/services/health.service.js`, `backend/src/controllers/health.controller.js`, `backend/src/routes/health.routes.js`, `backend/src/routes/index.js`
  - `backend/src/app.js`, `backend/src/server.js`
- **Kết quả mong đợi:**
  - Cài đặt đúng Express 4 (`express@4`), `mysql2`, `zod`, `dotenv`, `cors`.
  - Xác thực `.env` bằng Zod chạy đúng (bắt lỗi khi thiếu biến môi trường, không lộ `DB_PASSWORD`).
  - Pool kết nối bằng tài khoản `rikkei_dev`; mọi connection lấy từ Pool trả về `@@session.time_zone = '+07:00'`.
  - `GET /api/health` trả HTTP `200` khi DB kết nối bình thường và HTTP `503` (đúng cấu trúc `{ error: { code, message } }`) khi DB lỗi, không lộ thông tin nhạy cảm; các route lạ trả `404`.
  - `.gitignore` tiếp tục chặn `backend/.env` và `backend/node_modules/`.
- **Lỗi AI đã phát hiện và cách xử lý:**
  - *Lỗi 1 (Zod v4 breaking change ở `backend/src/config/env.js`):* Khi test truyền `DB_PORT=abc`, Zod v4 (`4.6.7`) không đọc tùy chọn `invalid_type_error` và `required_error` (cú pháp cũ của Zod v3), khiến thông báo lỗi in ra tiếng Anh (`Invalid input: expected number, received NaN`) thay vì tiếng Việt có dấu. Đã sửa sang cú pháp Zod v4 (`{ error: '...' }`) và test lại: thông báo trả về đúng tiếng Việt (`DB_PORT: DB_PORT phải là số nguyên hợp lệ.`).
  - *Lỗi 2 (`dotenv` v18 in log mặc định):* `dotenv@18.0.10` tự in dòng `◇ injected env (7) from ...` làm nhiễu log chuẩn. Đã bổ sung tùy chọn `quiet: true` trong `dotenv.config(...)` ở `env.js` và kiểm tra lại không còn log thừa.
  - *Lưu ý kiểm tra `npm run dev`:* Khi test spawn `npm run dev` trong script PowerShell, lệnh `taskkill` chạy bất đồng bộ làm tác vụ nền chưa thoát ngay cho đến khi hủy task test; đã kiểm tra lại bằng `Get-NetTCPConnection` xác nhận cổng `5000` đã được giải phóng sạch sẽ.
  - *Kết quả kiểm thử thực tế đã xác minh:* Kiểm tra cú pháp toàn bộ 12 file `.js`, test Pool 4 kết nối đồng thời đều có `@@session.time_zone = '+07:00'` dưới user `rikkei_dev@127.0.0.1`, test `date.js` (`getTodayVN`, `isValidIsoDate`, `diffDays`), test `GET /api/health` (200 OK & CORS header & 503 khi DB tắt cổng `3399`), test `404 NOT_FOUND`, test `400 INVALID_JSON`, và test khởi động `npm run dev`.

---

## Prompt 7 – Rà soát nền tảng Backend và tạo Commit #3

- **Nhiệm vụ:** Đọc lại toàn bộ 14 file nền tảng Backend và `prompts.md`, kiểm tra bảo mật `.env`/`.gitignore`, CommonJS, thứ tự sự kiện `connection` trên Pool, cách xử lý khi thiết lập `SET time_zone = '+07:00'` thất bại, sau đó tạo Commit #3 (`feat(backend): khởi tạo nền tảng Express và MySQL pool`) và dừng lại chờ duyệt bước triển khai API nghiệp vụ.
- **Phạm vi file:**
  - `backend/package.json`, `backend/package-lock.json`, `backend/.env.example`
  - Toàn bộ `backend/src/` (12 file JS)
  - `prompts.md`
- **Kết quả mong đợi:**
  - Nếu thiết lập `SET time_zone = '+07:00'` thất bại trên một kết nối mới trong Pool, kết nối đó phải bị hủy thay vì âm thầm chạy truy vấn với múi giờ `SYSTEM`.
  - Commit #3 sạch sẽ, không dính `backend/.env` hay `backend/node_modules/`.
- **Lỗi AI đã phát hiện và cách xử lý:**
  - *Phát hiện khi rà soát `backend/src/config/db.js`:* Ở phiên bản đầu, callback của `connection.query("SET time_zone = '+07:00'")` trong `pool.on('connection')` mới chỉ ghi `console.error(...)` mà chưa hủy kết nối lỗi, dẫn đến nguy cơ kết nối sai múi giờ vẫn được trả cho truy vấn nghiệp vụ nếu câu `SET time_zone` thất bại.
  - *Cách xử lý:* Bổ sung `connection.destroy()` trong nhánh lỗi của `pool.on('connection')` để loại bỏ kết nối khỏi Pool và đóng socket ngay (`_allConnections` về `0` khi test mô phỏng `SET time_zone = 'INVALID/ZONE'` thất bại với `ER_UNKNOWN_TIME_ZONE`).
  - *Kết quả kiểm thử lại sau chỉnh sửa `db.js`:* `node -c db.js` đạt; Pool thật trả về `sessionTz: '+07:00'` và `GET /api/health` trả `200`; Pool mô phỏng lỗi timezone hủy kết nối sạch (`BAD_POOL_ALL_CONNS_AFTER: 0`) và từ chối truy vấn thay vì chạy sai múi giờ.
