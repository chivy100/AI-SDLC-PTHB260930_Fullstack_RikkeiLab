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

---

## Prompt 8 – Giai đoạn 3 (Backend Phần 1): API Nghiệp vụ Thiết bị (`/api/equipments`) và Mượn trả (`/api/borrowings`)

- **Nhiệm vụ:** Đọc đối chiếu lại đề bài, cấu trúc DB (`schema.sql`, `mo_rong.sql`, `seed.sql`), nền tảng Backend hiện tại và Commit #3 (`afc7550`). Triển khai đầy đủ API quản lý thiết bị (`/api/equipments`) và phiếu mượn/trả (`/api/borrowings`) theo kiến trúc Routes → Controllers → Services → Repositories → MySQL; dùng Zod kiểm tra input; bảo đảm Transaction + `SELECT ... FOR UPDATE` chống race condition khi tạo phiếu mượn, cập nhật tổng số lượng và xóa thiết bị; chưa triển khai phần `fines`.
- **Phạm vi file dự kiến:**
  - `prompts.md` (cập nhật Prompt 8 và kết quả kiểm thử thực tế)
  - `backend/src/utils/transaction.js`
  - `backend/src/validators/equipment.validator.js`, `backend/src/validators/borrowing.validator.js`
  - `backend/src/repositories/equipment.repository.js`, `backend/src/repositories/borrowing.repository.js`
  - `backend/src/services/equipment.service.js`, `backend/src/services/borrowing.service.js`
  - `backend/src/controllers/equipment.controller.js`, `backend/src/controllers/borrowing.controller.js`
  - `backend/src/routes/equipment.routes.js`, `backend/src/routes/borrowing.routes.js`, `backend/src/routes/index.js` (cập nhật mount route)
- **Kết quả mong đợi:**
  - CRUD thiết bị đủ: danh sách (tìm kiếm theo mã/tên, lọc theo loại ENUM, phân trang `limit = 8`, `totalPages = 0` khi rỗng), xem chi tiết (`:id`), thêm mới, sửa (khóa row `FOR UPDATE`, kiểm tra trùng mã trừ chính mình, chặn `totalQuantity < currentBorrowed`), xóa (khóa row `FOR UPDATE`, chặn nếu đã phát sinh phiếu mượn).
  - Mượn/trả đủ: danh sách phiếu mượn + lọc trạng thái (`all`, `borrowed`, `overdue`, `returned`) với mã `PM-xxx`, tạo phiếu mượn (khóa row thiết bị `FOR UPDATE`, kiểm tra tồn kho trong transaction, `borrowedAt = todayVN`, hạn trả `[0, 14]` ngày), trả thiết bị (khóa row phiếu `FOR UPDATE`, chặn trả trùng, chặn trả trước ngày mượn).
  - Toàn bộ ca kiểm thử (gồm request đồng thời tạo phiếu mượn và rollback khi có lỗi giữa transaction) đều pass và đối chiếu khớp dữ liệu trong MySQL.
- **Lỗi AI đã phát hiện và cách xử lý:**
  - *Phát hiện phòng ngừa trong lúc thiết kế trước khi chạy:*
    1. MySQL `SUM(quantity)` trả về kiểu `DECIMAL` mà driver `mysql2` mặc định ép thành chuỗi (`"3"`), có thể làm sai phép so sánh hoặc kiểu JSON ở Frontend; đã ép `CAST(... AS SIGNED)` trong SQL kết hợp `Number(...)` ở Service/Mapper.
    2. `z.coerce.number()` trong Zod có thể ép chuỗi rỗng `""` hoặc `false` thành `0`, khiến kiểm tra số nguyên ở JSON body lỏng lẻo; đã dùng `z.number().int()` cho body JSON và regex `/^[1-9]\d*$/` cho `params`/`query`.
    3. Tách helper `runInTransaction` dùng chung 1 `conn` cho toàn bộ query trong transaction và luôn `release()` trong `finally`.
  - *Kết quả kiểm thử thực tế đã xác minh:*
    - `node -c` qua toàn bộ 23 file `.js` trong `backend/src/`.
    - Kiểm thử CRUD thiết bị, phân trang (`14` bản ghi → 2 trang 8+6), tìm kiếm escape wildcard (`search=_` → `totalItems=0`, `totalPages=0`), xem chi tiết, chặn sửa `totalQuantity < borrowed`, chặn trùng `code`, chặn xóa thiết bị đã có phiếu (`409`).
    - Kiểm thử danh sách/lọc phiếu mượn (`borrowed=7`, `overdue=3`, `returned=7`), tạo phiếu hợp lệ (biên `0` ngày và `14` ngày), chặn thiếu/âm/ngày giả `'2026-02-30'`/quá khứ/`15` ngày/vượt tồn kho, trả phiếu hợp lệ, chặn trả trùng (`409`), chặn trả trước ngày mượn (`400 INVALID_RETURN_DATE`).
    - Kiểm thử đồng thời (`Promise.all` 5 request mượn cùng lúc trên tồn kho `2` → đúng 2 thành công `201`, 3 bị từ chối `409`, MySQL `activeQty = 2`; đua song song `PUT totalQuantity=1` vs `POST quantity=2` → `PUT` thắng `200`, `POST` bị chặn `409`, tồn kho MySQL còn `1 >= 0`).
    - Kiểm thử rollback giữa transaction → `0` dòng rác; dọn sạch bản ghi test tạm để giữ nguyên tập seed (`14` thiết bị, `17` phiếu mượn, `4` khoản phạt).

---

## Prompt 9 – Rà soát kỹ thuật bổ sung (Concurrency 2 chiều, HTTP 409, Deadlock/Timeout) và tạo Commit #4

- **Nhiệm vụ:** Thực hiện rà soát kỹ thuật bổ sung cho Backend Phần 1: (1) Kiểm thử concurrency chiều ngược lại (`POST /api/borrowings` khóa `equipments` trước, `PUT /api/equipments/:id` chờ đồng thời và phải bị chặn khi `POST` commit); (2) Rà soát và thống nhất HTTP status `409 Conflict` cho `TOTAL_QUANTITY_LESS_THAN_BORROWED`; (3) Điều chỉnh nhận định về deadlock (không tuyệt đối hóa "không bao giờ deadlock", bổ sung xử lý lỗi `ER_LOCK_DEADLOCK` và `ER_LOCK_WAIT_TIMEOUT` ở `errorHandler.js` với rollback + release an toàn); (4) Đối chiếu toàn bộ endpoint Phần 1 với đề bài gốc; (5) Tạo Commit #4 (`feat(backend): triển khai API thiết bị và mượn trả`).
- **Phạm vi file thay đổi thêm:**
  - `backend/src/services/equipment.service.js` (cập nhật `TOTAL_QUANTITY_LESS_THAN_BORROWED` từ `400` sang `409`)
  - `backend/src/middlewares/errorHandler.js` (bổ sung xử lý `ER_LOCK_DEADLOCK` → `409` và `ER_LOCK_WAIT_TIMEOUT` → `503`)
  - `prompts.md` (cập nhật Prompt 9)
- **Kết quả kiểm thử thực tế & Điểm cải tiến:**
  - *Điều chỉnh HTTP Status Code:* Đề gốc không khóa cứng mã HTTP cụ thể, chỉ yêu cầu từ chối rõ ràng theo định dạng `{ error: { code, message } }`. Vì `totalQuantity >= 0` là dữ liệu hợp lệ về kiểu/biên tĩnh nhưng xung đột với trạng thái đang cho mượn thực tế trong DB, việc chuyển `TOTAL_QUANTITY_LESS_THAN_BORROWED` sang **`409 Conflict`** giúp đồng bộ hoàn toàn với `DUPLICATE_EQUIPMENT_CODE`, `EQUIPMENT_HAS_BORROWINGS`, `INSUFFICIENT_QUANTITY` và `BORROWING_ALREADY_RETURNED`.
  - *Điều chỉnh nhận định kỹ thuật về Deadlock & Lock Timeout:* Khóa cùng thứ tự trên `equipments (WHERE id = ? FOR UPDATE)` giúp **giảm thiểu nguy cơ deadlock** do vòng chờ khóa giữa các Transaction, nhưng không tuyệt đối hóa rằng hệ thống không thể gặp deadlock hoặc lock timeout dưới áp lực tải cao hay tương tác chéo chỉ mục trong InnoDB. Trong phạm vi bài tập chưa triển khai auto-retry phức tạp; khi gặp `ER_LOCK_DEADLOCK` (`409 CONCURRENT_CONFLICT`) hoặc `ER_LOCK_WAIT_TIMEOUT` (`503 LOCK_WAIT_TIMEOUT`), `runInTransaction` bảo đảm rollback và luôn `release()` connection, đồng thời trả thông báo tiếng Việt để client thử lại.
  - *Kết quả test Concurrency chiều ngược lại:* Trên thiết bị test `totalQuantity = 2`, sử dụng khóa InnoDB thực tế giữ lệnh `INSERT` của `POST /api/borrowings` ngay sau khi `POST` đã khóa `equipments FOR UPDATE` trong lúc gửi đồng thời `PUT /api/equipments/:id` (`totalQuantity = 1`) → `POST` thành công (`201`), `PUT` bị chặn chờ rồi đọc lại `borrowedQuantity = 2` và bị từ chối (`409 TOTAL_QUANTITY_LESS_THAN_BORROWED`); đối chiếu MySQL có `totalQuantity = 2`, `borrowedQuantity = 2`, `availableQuantity = 0`.
  - *Kết quả test Deadlock / Lock Timeout:* Đã xác minh `errorHandler` trả `409 CONCURRENT_CONFLICT` với `ER_LOCK_DEADLOCK`; kích hoạt thật `ER_LOCK_WAIT_TIMEOUT` từ MySQL (`innodb_lock_wait_timeout = 1`) bên trong `runInTransaction` xác nhận Transaction tự rollback, `conn.release()` không rò rỉ connection và `errorHandler` trả `503 LOCK_WAIT_TIMEOUT`.
  - *Kiểm tra hồi quy & DB:* `node -c` đạt 23/23 file; toàn bộ kịch bản CRUD, lọc, phân trang, mượn/trả, dọn dữ liệu test sạch về đúng `14` thiết bị, `17` phiếu mượn, `4` khoản phạt.

---

## Prompt 10 – Giai đoạn 4 (Backend Phần 2A): Triển khai Fines (Chốt phạt khi trả trễ, `GET /api/fines`, `PATCH /api/fines/:id/pay`)

- **Nhiệm vụ:** Đọc đối chiếu lại đề bài, `db/mo_rong.sql`, `borrowing.service.js`, `borrowing.repository.js`, `transaction.js` và Commit #4 (`f1c76a3`). Tích hợp tự động chốt phạt vào `PATCH /api/borrowings/:id/return` trong cùng Transaction; cập nhật thông tin phạt (tạm tính và đã chốt) trên `GET /api/borrowings`; triển khai `GET /api/fines` (phân biệt `collectedAmount`, `unpaidSettledAmount`, `provisionalAmount`, `totalOwedAmount`, không cộng trùng khi JOIN) và `PATCH /api/fines/:id/pay` (thanh toán toàn bộ 1 lần, khóa `FOR UPDATE` chống thu trùng, từ chối thay đổi `amount`/`dailyRate`/`paidAt` từ client). Chưa triển khai Frontend và chưa tạo Commit #5.
- **Phạm vi file dự kiến:**
  - `prompts.md` (cập nhật Prompt 10 và kết quả kiểm thử thực tế)
  - `backend/src/utils/constants.js`
  - `backend/src/validators/fine.validator.js`
  - `backend/src/repositories/fine.repository.js`, `backend/src/repositories/borrowing.repository.js`
  - `backend/src/services/fine.service.js`, `backend/src/services/borrowing.service.js`
  - `backend/src/controllers/fine.controller.js`
  - `backend/src/routes/fine.routes.js`, `backend/src/routes/index.js`
- **Kết quả mong đợi:**
  - Trả thiết bị đúng/sớm hạn không tạo bản ghi `fines`; trả trễ tạo đúng 1 bản ghi `fines` (`unpaid`, `paid_at = NULL`, `late_days * quantity * 5000`) trong cùng Transaction với `UPDATE borrowings.returned_at`.
  - Hai request đồng thời trả cùng một phiếu quá hạn → chỉ 1 thành công, 1 nhận `409`, chỉ có 1 dòng `fines`.
  - Hai request đồng thời thu cùng một khoản phạt → chỉ 1 chuyển sang `paid`, 1 nhận `409 FINE_ALREADY_PAID`.
  - Rollback khi `INSERT fines` lỗi sau `UPDATE returned_at` → `returned_at` quay về `NULL`, không có dòng `fines`, không rò rỉ connection.
  - Kiểm thử hồi quy toàn bộ Phần 1 vẫn pass 100%, kiểm tra trực tiếp dữ liệu MySQL sau test.
- **Lỗi AI đã phát hiện và cách xử lý:**
  - *Phòng ngừa kỹ thuật trong lúc triển khai:*
    1. Tách `DAILY_FINE_RATE = 5000` và `MAX_BORROW_DAYS = 14` vào `backend/src/utils/constants.js` để `borrowing.service.js` và `fine.service.js` dùng chung một nguồn hằng số duy nhất.
    2. Tách câu truy vấn tổng hợp ở `fine.repository.js` (`getSummaryTotals`) thành 2 truy vấn tách biệt (1 trên `fines` cho `paid`/`unpaid`, 1 trên `borrowings LEFT JOIN fines WHERE f.id IS NULL` cho tạm tính) nhằm tránh tuyệt đối lỗi nhân bản dòng và đảm bảo 1 phiếu không bao giờ bị cộng ở cả 2 nhóm.
    3. Ở `PATCH /api/fines/:id/pay`, dùng `payFineBodySchema` chặn luôn trường hợp client cố gửi body chứa `amount`, `dailyRate`, `paidAt` hoặc `status` (`400 VALIDATION_ERROR`), đồng thời vẫn cho phép request không có body (`undefined`) hoặc body rỗng `{}`.
  - *Kết quả kiểm thử thực tế đã xác minh:*
    - `node -c` đạt toàn bộ file `.js` trong `backend/src/`.
    - `GET /api/fines` trên dữ liệu seed trả đúng: `collectedAmount = 80000`, `unpaidSettledAmount = 55000`, `provisionalAmount = 145000`, `totalOwedAmount = 200000`, tổng `7` dòng (`2` `unpaid`, `3` `provisional`, `2` `paid`), đồng bộ với `GET /api/borrowings`.
    - Kiểm thử ngày: trả sớm/đúng hạn tạo `0` bản ghi `fines`; trễ `1` ngày × `2` thiết bị → tạm tính `10000`, khi trả chốt thành `unpaid` `10000` và giảm phần tạm tính đi `10000`; kiểm tra biên ranh giới nửa đêm UTC+7 của `getTodayVN`.
    - Kiểm thử Concurrency trả trễ đồng thời (`Promise.all` 2 request trên phiếu trễ `3` ngày × `2` cái) → `1` thành công (`200`, `30000`), `1` bị chặn (`409 BORROWING_ALREADY_RETURNED`), MySQL chỉ có `1` bản ghi `fines`.
    - Kiểm thử Concurrency thu phạt đồng thời (`Promise.all` 2 request trên cùng khoản phạt `30000`) → `1` thành công (`200`, `status = 'paid'`, `paidAt = todayVN`), `1` bị chặn (`409 FINE_ALREADY_PAID`), `collectedAmount` chỉ tăng thêm `30000`; từ chối `400` các body cố tình ghi đè `amount`/`dailyRate`/`paidAt`/`status`.
    - Kiểm thử Rollback khi `fineRepo.create` ném lỗi sau khi `UPDATE borrowings.returned_at` → HTTP `500`, trong MySQL `returned_at` trở về `NULL`, `0` bản ghi `fines`, không rò rỉ connection.
    - Chạy lại toàn bộ bộ test hồi quy Phần 1 (CRUD, tìm kiếm, phân trang, concurrency 2 chiều, deadlock/timeout) đều PASS 100%; dữ liệu MySQL sau dọn dẹp giữ nguyên `14` thiết bị, `17` phiếu mượn, `4` khoản phạt.

---

## Prompt 11 – Rà soát bảo mật/chất lượng Fines và tạo Commit #5

- **Nhiệm vụ:** Đọc lại toàn bộ 9 file nguồn Backend liên quan đến Fines và `prompts.md`; kiểm tra 10 tiêu chí chất lượng/bảo mật (mức phạt 5.000 VNĐ đồng nhất, cùng Transaction/connection, không tạo phạt khi trả đúng/sớm hạn, tách biệt 3 nhóm tiền phạt không nhân bản dòng, chặn sửa payload thanh toán, không sót code test/monkey patch, `.env` & `node_modules/` ngoài Git), kiểm tra cú pháp JS và tạo Commit #5 (`feat(backend): tích hợp API quá hạn và tiền phạt`). Chưa triển khai Frontend.
- **Phạm vi file commit:**
  - `backend/src/utils/constants.js`
  - `backend/src/validators/fine.validator.js`
  - `backend/src/repositories/fine.repository.js`, `backend/src/repositories/borrowing.repository.js`
  - `backend/src/services/fine.service.js`, `backend/src/services/borrowing.service.js`
  - `backend/src/controllers/fine.controller.js`
  - `backend/src/routes/fine.routes.js`, `backend/src/routes/index.js`
  - `prompts.md`
- **Kết quả kiểm tra & Lỗi phát hiện:**
  - Đọc trực tiếp toàn bộ 10 file: không có code thừa/monkey patch kiểm thử, không lộ secret, `node -c` đạt toàn bộ file JS, `git diff --check` sạch, `backend/.env` và `backend/node_modules/` tiếp tục bị `.gitignore` chặn. Không có chỉnh sửa thêm vào code nên không cần chạy lại suite kiểm thử đã pass ở Prompt 10.

---

## Prompt 12 – Giai đoạn 5 (Bước 5.1): Phân tích đề bài, HTML mẫu, API Backend và thiết kế Frontend

- **Nhiệm vụ:** Đọc lại đề bài gốc, toàn bộ các tệp trong `giao_dien_mau/`, `README.md`, `prompts.md` và mã nguồn API thực tế trong `backend/src/`. Lập bản phân tích đối chiếu đầy đủ 10 nội dung cho Frontend (danh sách màn hình, đối chiếu API request/response thực tế, luồng dữ liệu React → Axios → Express → MySQL, cấu trúc thư mục, component dùng chung, lộ trình chia bước nhỏ và các điểm nguy cơ sai lệch). Chưa tạo file source code Frontend, chưa chạy Vite, chưa cài package, chưa sửa Backend và chưa tạo Commit #6.
- **Phạm vi file:** Chỉ cập nhật nhật ký Prompt 12 vào `prompts.md`; không tạo hay sửa file mã nguồn nào khác.
- **Kết quả mong đợi:** Xác định chính xác hợp đồng JSON thực tế từ Backend (`equipment`, `borrowing`, `fine`), ánh xạ chính xác các thành phần từ `index.html`, `phieu-muon.html` và `mo_rong/a-tien-phat.html` sang React + Bootstrap 5.3.3 CDN, phòng ngừa các lỗi phổ biến (ép kiểu số cho Zod, `limit=100` cho dropdown chọn thiết bị ở `BorrowForm`, khác biệt tên trường giữa `/api/borrowings` và `/api/fines`, lệch múi giờ ngày và race condition khi search).
- **Lỗi / Điểm phát hiện trong bước phân tích:**
  - *Phát hiện 1 (Dropdown chọn thiết bị ở `BorrowForm`):* API `GET /api/equipments` phân trang mặc định `limit = 8`; nếu `BorrowForm` dùng chung dữ liệu trang hiện tại thì các thiết bị từ trang 2 trở đi (`LAB-009`..`LAB-014`) sẽ bị thiếu khi lập phiếu mượn. Đề xuất gọi riêng `limit = 100` cho select chọn thiết bị.
  - *Phát hiện 2 (Ép kiểu số nguyên cho Zod strict):* Backend dùng `z.number().int()` nên `<input type="number">` của React cần chuyển sang `Number(...)` trước khi gửi thay vì gửi chuỗi.
  - *Phát hiện 3 (Khác biệt tên trường giữa 2 API):* `/api/borrowings` dùng `id`, `code`, `finePaidAt`, còn `/api/fines` dùng `borrowingId`, `borrowingCode`, `paidAt`; đã ghi nhận chính xác vào bảng ánh xạ trước khi viết service/component Frontend.

---

## Prompt 13 – Giai đoạn 5 (Bước 5.2): Khởi tạo dự án Vite + React 18 và xây dựng Layout nền tảng Frontend

- **Nhiệm vụ:** Kiểm tra môi trường Node/npm và `.gitignore`; khởi tạo dự án Frontend thuần JavaScript tại `frontend/` với React `18.3.1`, React DOM `18.3.1`, Vite (tương thích Node 24), `@vitejs/plugin-react` và Axios; nhúng Bootstrap 5.3.3 CSS CDN (không cài Bootstrap npm, không Bootstrap JS bundle, không TypeScript/Tailwind/Router); cấu hình `frontend/.env` và `frontend/.env.example` (`VITE_API_BASE_URL=http://localhost:5000/api`); tạo Axios instance (`axiosClient.js`), `healthService.js`, `utils/` và bộ Layout nền tảng (`AppShell`, `AppNavbar`, `BackendStatus`, `LoadingState`, `EmptyState`, `StatusAlert`) với 3 màn hình placeholder. Kiểm thử thực tế trên trình duyệt, `npm run build` và `.gitignore`. Chưa tạo các màn hình CRUD/nghiệp vụ và chưa tạo Commit #6.
- **Phạm vi file dự kiến:**
  - `prompts.md` (cập nhật Prompt 13 và kết quả kiểm thử thực tế)
  - `frontend/package.json`, `frontend/package-lock.json`, `frontend/vite.config.js`, `frontend/index.html`
  - `frontend/.env` (ignored), `frontend/.env.example`
  - `frontend/src/main.jsx`, `frontend/src/App.jsx`, `frontend/src/styles/custom.css`
  - `frontend/src/utils/format.js`, `frontend/src/utils/error.js`
  - `frontend/src/services/axiosClient.js`, `frontend/src/services/healthService.js`
  - `frontend/src/components/common/AppNavbar.jsx`, `AppShell.jsx`, `BackendStatus.jsx`, `LoadingState.jsx`, `EmptyState.jsx`, `StatusAlert.jsx`
- **Kết quả mong đợi:**
  - `npm ls react react-dom vite axios` xác nhận `react@18.3.1`, `react-dom@18.3.1`, không cài nhầm React 19.
  - `git check-ignore -v` xác nhận `frontend/.env`, `frontend/node_modules/`, `frontend/dist/` bị chặn và `frontend/.env.example` được theo dõi.
  - Vite chạy tại `http://localhost:5173`, Bootstrap 5.3.3 CSS CDN hoạt động tốt trên desktop & mobile, điều hướng 3 tab mượt mà bằng React state, `BackendStatus` kết nối thật `GET /api/health` (hiển thị cả trạng thái kết nối thành công và cảnh báo khi Backend/DB tắt), `npm run build` thành công không lỗi.
- **Lỗi AI đã phát hiện và cách xử lý:**
  - *Cảnh báo khi `npm install` trên `esbuild`:* npm cảnh báo `allow-scripts` cho `esbuild@0.25.12`; đã kiểm tra thực tế bằng `npm run build` (`vite build` hoàn thành trong `2.33s` ra `dist/`) và chạy thử `npm run dev` phục vụ `http://localhost:5173/` bình thường.
  - *Giới hạn kiểm thử trình duyệt (trung thực trạng thái):* Khi gọi subagent `browser` để kiểm tra giao diện Chrome tại `http://localhost:5173/`, `chrome_devtools` báo lỗi `Could not find DevToolsActivePort ... (ENOENT)` do Google Chrome chưa bật remote debugging (`chrome://inspect/#remote-debugging`). Vì vậy các điểm **hiển thị trực quan trên trình duyệt Chrome và thao tác click UI/responsive thực tế trên DOM** được ghi nhận là **chưa kiểm chứng tự động qua Chrome**.
  - *Kết quả kiểm thử thực tế đã xác minh ở Bước 5.2:*
    - `node -v` = `v24.18.0`, `npm -v` = `11.16.0`.
    - `npm ls react react-dom vite axios @vitejs/plugin-react` xác nhận đúng `react@18.3.1`, `react-dom@18.3.1`, `vite@6.4.6`, `@vitejs/plugin-react@4.7.0`, `axios@1.21.1` (không cài nhầm React 19 hay Bootstrap npm).
    - `npm run build` thành công (`91 modules transformed`, tạo `dist/` sạch).
    - Vite dev server phản hồi `200` trên `http://localhost:5173/`, `index.html` có link CSS `bootstrap@5.3.3` CDN, `/src/App.jsx` biên dịch `200`.
    - Test `axios` + `normalizeApiError`: gọi `GET /api/health` (`200 { status: 'ok', database: 'connected' }` với CORS origin `http://localhost:5173`) và mô phỏng Backend tắt (port `5999`) trả về `NETWORK_ERROR` kèm thông báo tiếng Việt.
    - Test `format.js`: `formatDateVN`, `formatCurrencyVND`, `getTodayVN`, `addDaysIso` chính xác.
    - `git check-ignore -v` xác nhận `frontend/.env`, `frontend/node_modules/`, `frontend/dist/` bị chặn và `frontend/.env.example` được theo dõi.

---

## Prompt 14 – Giai đoạn 5 (Bước 5.3): Triển khai màn hình Quản lý thiết bị

- **Nhiệm vụ:** Đọc đối chiếu `giao_dien_mau/index.html`, mục 4.3 của đề bài và API `/api/equipments` thực tế. Triển khai màn hình Quản lý thiết bị (`EquipmentPage`) gồm: danh sách thiết bị, tìm kiếm có debounce + `AbortController`, lọc theo 4 loại ENUM, phân trang `limit = 8` (tự về trang 1 khi đổi bộ lọc, tự lùi trang khi xóa bản ghi cuối ở trang `> 1`), modal Xem chi tiết (`GET /api/equipments/:id`), modal Thêm/Sửa (validate client + ép `Number`, hiển thị lỗi Backend 409 tại form, khóa nút chống bấm đúp), modal Xác nhận xóa (hiển thị lỗi `409 EQUIPMENT_HAS_BORROWINGS` ngay trong modal) và đủ các trạng thái Loading, Empty, Empty search, Error, Success. Không sửa Backend/Database, không triển khai Phiếu mượn/Tiền phạt và chưa tạo Commit #6.
- **Phạm vi file dự kiến:**
  - `prompts.md` (cập nhật Prompt 14 và kết quả kiểm thử thực tế)
  - `frontend/src/utils/format.js` (bổ sung `CATEGORY_OPTIONS`)
  - `frontend/src/services/equipmentService.js`
  - `frontend/src/hooks/useEquipments.js`
  - `frontend/src/components/common/Pagination.jsx`
  - `frontend/src/components/equipments/EquipmentToolbar.jsx`, `EquipmentTable.jsx`, `EquipmentDetailModal.jsx`, `EquipmentFormModal.jsx`, `ConfirmDeleteModal.jsx`
  - `frontend/src/pages/EquipmentPage.jsx`
  - `frontend/src/App.jsx` (nối `EquipmentPage` vào tab `equipments`)
- **Kết quả thực tế đã kiểm chứng:**
  - `node -c` đạt 7/7 file `.js` (`vite.config.js`, `src/utils/*.js`, `src/services/*.js`, `src/hooks/useEquipments.js`); `npm run build` thành công (`vite v6.4.6`, `104 modules transformed`, tạo `dist/index.html` và bundle JS/CSS trong `2.91s`).
  - Kiểm thử tích hợp trực tiếp giữa Vite (`http://localhost:5173`), Backend (`http://localhost:5000/api`) và MySQL (`rikkei_lab`) đạt toàn bộ 18 kịch bản CRUD, tìm kiếm (gồm escape ký tự `%`), lọc 4 loại ENUM, phân trang (lùi trang khi xóa phần tử cuối của trang cuối), xử lý lỗi `400`/`409`/`NETWORK_ERROR`, hủy request qua `AbortController` và tranh chấp đồng thời (double POST/DELETE).
  - Sau kiểm thử đã dọn sạch dữ liệu tạm trên MySQL về nguyên trạng ban đầu (`14` thiết bị, `17` phiếu mượn, `4` khoản phạt).
- **Lỗi AI đã phát hiện và cách xử lý:**
  - Khi chạy `browser` subagent kiểm thử trực quan trên Chrome (`http://localhost:5173/`), Chrome DevTools MCP báo lỗi `ENOENT` tại `DevToolsActivePort` do chưa bật Remote Debugging; kết quả MCP ban đầu được ghi nhận trung thực là chưa xác minh tự động, sau đó người dùng đã mở Chrome kiểm tra trực tiếp toàn bộ giao diện, modal, tương tác và responsive đạt yêu cầu trước khi phê duyệt Commit #6.

---

## Prompt 15 – Giai đoạn 5 (Bước 5.4): Triển khai màn hình Phiếu mượn thiết bị

- **Nhiệm vụ:** Đọc đối chiếu `giao_dien_mau/phieu-muon.html`, `giao_dien_mau/mo_rong/a-tien-phat.html`, mục 4.4 của đề bài và mã nguồn API Backend (`borrowing.service.js`, `borrowing.repository.js`, `borrowing.validator.js`, `fine.repository.js`). Triển khai màn hình Phiếu mượn (`BorrowingPage`) gồm: `BorrowForm` (nạp đầy đủ thiết bị qua `GET /api/equipments?limit=100`, vô hiệu hóa thiết bị hết hàng, validate client khớp quy tắc UTC+7 và tối đa 14 ngày, ép `Number`), `BorrowFilter` (`all | borrowed | overdue | returned`), `BorrowTable` (hiển thị trạng thái và phân biệt rõ tiền phạt tạm tính với khoản phạt đã chốt), `ConfirmReturnModal` (phiếu đúng/sớm hạn) và `components/common/ReturnWithFineModal.jsx` (phiếu quá hạn, không gửi `fineAmount`/`returnedAt` từ client, đồng bộ lại cả danh sách phiếu và tồn kho thiết bị từ Backend sau thao tác). Không sửa Backend/Database, chưa triển khai màn hình Tiền phạt (Bước 5.5) và chưa tạo Commit #7.
- **Phạm vi file dự kiến:**
  - `prompts.md` (ghi Prompt 15 và cập nhật kết quả kiểm thử thực tế)
  - `frontend/src/utils/format.js` (bổ sung hằng số phạt/thời hạn, helper kiểm tra/tính ngày UTC+7 và nhãn lọc trạng thái phiếu mượn)
  - `frontend/src/services/borrowingService.js`
  - `frontend/src/hooks/useBorrowings.js`
  - `frontend/src/components/borrowings/BorrowForm.jsx`, `BorrowFilter.jsx`, `BorrowTable.jsx`, `ConfirmReturnModal.jsx`
  - `frontend/src/components/common/ReturnWithFineModal.jsx`
  - `frontend/src/pages/BorrowingPage.jsx`
  - `frontend/src/App.jsx` (nối `BorrowingPage` vào tab `borrowings`)
- **Kết quả thực tế đã kiểm chứng:**
  - `node -c` đạt 5/5 file `.js` (`src/utils/format.js`, `src/services/borrowingService.js`, `src/hooks/useBorrowings.js`, `src/services/equipmentService.js`, `src/utils/error.js`); `npm run build` thành công (`vite v6.4.6`, `112 modules transformed`, tạo `dist/` trong `1.60s`).
  - Kiểm thử tích hợp trực tiếp Vite (`http://localhost:5173`), Backend (`http://localhost:5000/api`) và MySQL (`rikkei_lab`) đạt toàn bộ: `GET /api/equipments?limit=100` nạp đủ `14` thiết bị, `GET /api/borrowings` lọc đủ `17` phiếu (`7` borrowed, `3` overdue tạm tính phạt, `7` returned), validate `400`/`409` (thiếu/0/âm/vượt tồn/hết hàng/ngày giả `2026-02-30`/trước hôm nay/vượt 14 ngày), tạo phiếu đồng bộ giảm tồn (`4 → 2`), trả đúng hạn khôi phục tồn (`2 → 4`), trả phiếu quá hạn tạm (lệch `3` ngày × `2` chiếc × `5.000 đ = 30.000 đ`) khớp chính xác khoản phạt Backend chốt trong Transaction, chống trả trùng đồng thời (`409`), hủy request qua `AbortController` và bắt lỗi `NETWORK_ERROR`.
  - Sau kiểm thử đã dọn sạch dữ liệu tạm theo thứ tự Foreign Key (`fines` → `borrowings` → `equipments`) và đối chiếu MySQL còn nguyên `14` thiết bị, `17` phiếu mượn, `4` khoản phạt, `0` bản ghi `TEST-*`.
- **Lỗi AI đã phát hiện và cách xử lý:**
  - Khi gọi subagent `browser` kiểm tra Chrome (`http://localhost:5173/`), Chrome DevTools MCP báo `ENOENT` tại `DevToolsActivePort` do chưa bật Remote Debugging; phần kiểm tra tự động qua MCP được ghi nhận trung thực là chưa xác minh, sau đó giữ nguyên Backend (`http://localhost:5000`) và Vite (`http://localhost:5173`) hoạt động để người dùng mở Chrome kiểm tra trực tiếp toàn bộ form, dropdown hết hàng, 4 bộ lọc, bảng và 2 modal trả thiết bị đạt yêu cầu trước khi phê duyệt Commit #7.

---

## Prompt 16 – Giai đoạn 5 (Bước 5.5): Triển khai màn hình Quá hạn và tiền phạt

- **Nhiệm vụ:** Đọc đối chiếu `giao_dien_mau/mo_rong/a-tien-phat.html`, đề bài hướng A, `prompts.md` và mã nguồn API Backend (`fine.service.js`, `fine.repository.js`, `fine.validator.js`). Triển khai màn hình Quá hạn và tiền phạt (`FinePage`) gồm: `FineSummary` (3 thẻ: Tiền phạt đã thu, Tiền phạt đang nợ tách rõ Đã chốt chưa thu & Tạm tính chưa trả, Mức phạt cố định `5.000 đ / thiết bị / ngày`), `FineTable` (phân biệt tuyệt đối 3 nhóm theo `fineStatus`: `provisional`, `unpaid`, `paid` với thao tác tương ứng), tái sử dụng `components/common/ReturnWithFineModal.jsx` cho nhóm `provisional`, và `ConfirmPayFineModal.jsx` gọi `PATCH /api/fines/:id/pay` với body `{}` (xử lý `409 FINE_ALREADY_PAID`, không optimistic update). Không sửa Backend/Database, chưa tạo Commit #8.
- **Phạm vi file dự kiến:**
  - `prompts.md` (ghi Prompt 16 và cập nhật kết quả kiểm thử thực tế + hồi quy toàn Frontend)
  - `frontend/src/services/fineService.js`
  - `frontend/src/hooks/useFines.js`
  - `frontend/src/components/fines/FineSummary.jsx`, `FineTable.jsx`, `ConfirmPayFineModal.jsx`
  - `frontend/src/pages/FinePage.jsx`
  - `frontend/src/App.jsx` (tích hợp `FinePage` vào tab `fines`)
- **Kết quả thực tế đã kiểm chứng:**
  - `node -c` đạt 11/11 file `.js` (`vite.config.js`, `src/utils/*.js`, `src/services/*.js`, `src/hooks/*.js`); `npm run build` thành công (`vite v6.4.6`, `118 modules transformed`, tạo `dist/` trong `3.28s`).
  - Kiểm thử tích hợp thật Bước 5.5 (`http://localhost:5173` ↔ `http://localhost:5000/api` ↔ MySQL `rikkei_lab`) đạt toàn bộ: `GET /api/fines` khớp dữ liệu seed (`collectedAmount = 80000`, `unpaidSettledAmount = 55000`, `provisionalAmount = 145000`, `totalOwedAmount = 200000`, `7` dòng gồm `2 unpaid`, `3 provisional`, `2 paid`), kiểm tra bất biến trường `null`/trạng thái ở cả 3 nhóm, chuyển `provisional → unpaid` bảo toàn đúng `totalOwedAmount = 240000` không cộng trùng, thu tiền `unpaid → paid` với body `{}` tăng `collectedAmount` một lần (`80000 → 120000`), xử lý `404`/`409 FINE_ALREADY_PAID`/`400 VALIDATION_ERROR`/tranh chấp đồng thời double-pay/hủy request `AbortController`/`NETWORK_ERROR`, và kiểm thử hồi quy màn hình Thiết bị, Phiếu mượn và `/api/health`.
  - Dọn sạch dữ liệu test theo thứ tự Foreign Key (`fines` → `borrowings` → `equipments`) và đối chiếu MySQL giữ nguyên `14` thiết bị, `17` phiếu mượn, `4` khoản phạt, `0` bản ghi `TEST-*`.
- **Lỗi AI đã phát hiện và cách xử lý:**
  - Khi gọi subagent `browser` đọc kiểm tra Chrome (`http://localhost:5173/`), Chrome DevTools MCP báo `ENOENT` tại `DevToolsActivePort` do chưa bật Remote Debugging; phần kiểm tra tự động qua MCP được ghi nhận trung thực là chưa xác minh, sau đó giữ nguyên Backend (`http://localhost:5000`) và Vite (`http://localhost:5173`) hoạt động để người dùng kiểm tra trực tiếp tab Quá hạn & tiền phạt trên Chrome và xác nhận đạt yêu cầu trước khi phê duyệt Commit #8.

---

## Prompt 17 – Giai đoạn 6 (Bước 6.1): Phân tích yêu cầu nghiệm thu và lập kế hoạch kiểm thử tổng thể

- **Nhiệm vụ:** Đọc lại toàn bộ đề bài gốc, `prompts.md`, `README.md`, `db/` (`schema.sql`, `mo_rong.sql`, `seed.sql`), toàn bộ mã nguồn thực tế trong `backend/src/` và `frontend/src/`, `giao_dien_mau/`, `evidence/`, cấu hình và lịch sử 8 commit Git. Đối chiếu ma trận yêu cầu với code thực tế, chỉ rõ các thiếu sót/rủi ro cần xử lý ở Giai đoạn 6 và lập kế hoạch chi tiết (ma trận E2E, chiến lược dữ liệu `TEST-E2E-*` an toàn không phá seed, kế hoạch Postman Collection & Environment, danh sách ảnh minh chứng, checklist trình duyệt 3 màn hình, dàn ý hoàn thiện `README.md`, lộ trình Bước 6.2–6.4 và tiêu chí nghiệm thu cuối). Chỉ lập kế hoạch; chưa sửa source code/README, chưa chạy test thay đổi DB, chưa tạo Postman Collection chính thức và chưa tạo Commit #9.
- **Phạm vi file dự kiến:** Chỉ cập nhật nhật ký Prompt 17 trong `prompts.md`.
- **Kết quả thực tế đã kiểm chứng ở Bước 6.1:**
  - Đã đối chiếu trực tiếp toàn bộ `29` file `backend/src/`, `36` file `frontend/src/`, `3` file `db/`, các file cấu hình, 8 commit Git và thư mục `evidence/` (hiện đang trống ở `evidence/postman/` và `evidence/ui/`).
  - Xác định rõ các hạng mục còn thiếu để hoàn thành nghiệm thu ở các bước 6.2–6.4: hoàn thiện `README.md` (hướng dẫn chạy, tạo user MySQL, cấu hình `.env`, API, kiểm thử, ảnh minh chứng và mục "Lỗi khó phát hiện nhất"), tạo Postman Collection & Environment mẫu, thực thi bộ kiểm thử E2E/Concurrency/Rollback với tiền tố `TEST-E2E-*` + dọn sạch về `14/17/4`, thu thập ảnh minh chứng thực tế vào `evidence/postman/` và `evidence/ui/`.
- **Lỗi AI đã phát hiện và cách xử lý:** *(Đã ghi nhận đầy đủ các rủi ro kỹ thuật và khoảng trống tài liệu/minh chứng trong báo cáo Bước 6.1, chờ người dùng phê duyệt trước khi thực hiện Bước 6.2.)*

---

## Prompt 18 – Giai đoạn 6 (Bước 6.2): Tạo Postman Collection/Environment và Kiểm thử Tích hợp, Concurrency, Rollback toàn hệ thống

- **Nhiệm vụ:** Tạo bộ `RikkeiLab.postman_collection.json` và `RikkeiLab.local.postman_environment.json` trong `evidence/postman/` (không chứa secret/mật khẩu thật, phân tách Read-only và Mutating, kèm `pm.test` assertions và dynamic dates UTC+7). Chụp snapshot MySQL trước test (`14 / 17 / 4`), chạy toàn bộ ma trận kiểm thử E2E (Nhóm A, B, C, D, E gồm Concurrency 2 chiều, Rollback fault-injection không sửa code chính thức, `ER_LOCK_DEADLOCK` thực, `ER_LOCK_WAIT_TIMEOUT` thực, kiểm chứng Connection Pool và `@@session.time_zone = '+07:00'`) chỉ dùng dữ liệu riêng theo `RUN_ID`, dọn đúng các ID đã tạo theo thứ tự Foreign Key và đối chiếu DB trở về `14 / 17 / 4`. Không sửa `README.md`, chưa tạo ảnh giả, chưa tạo Commit #9.
- **Phạm vi file dự kiến:**
  - `prompts.md` (ghi Prompt 18 và kết quả kiểm thử thực tế Bước 6.2)
  - `evidence/postman/RikkeiLab.postman_collection.json`
  - `evidence/postman/RikkeiLab.local.postman_environment.json`
- **Kết quả thực tế đã kiểm chứng:**
  - Đã tạo và kiểm tra cú pháp JSON hợp lệ (0 secret) cho `evidence/postman/RikkeiLab.postman_collection.json` (`5` thư mục: Health, Equipments, Borrowings, Fines, Overdue Pay) và `evidence/postman/RikkeiLab.local.postman_environment.json`.
  - Snapshot MySQL trước kiểm thử: `equipments = 14`, `borrowings = 17`, `fines = 4`, `runIdRows = 0`.
  - Đã chạy thực tế toàn bộ `33` kiểm tra trong `verify_step6_2.mjs` (`RUN_ID = 20261125-62A`): Nhóm A (`EQ-01..EQ-11`), Nhóm B (`BR-01..BR-09`, gồm biên `0` và `14` ngày), Nhóm C–D (`FN-01..FN-06`, luồng `provisional → unpaid → paid`), Concurrency (`CONC-1..4` gồm đua `PUT` vs `POST` cả 2 chiều, trả trùng và thu phạt trùng), Rollback bằng fault-injection trong tiến trình test riêng (`returned_at = NULL`, `0` dòng `fines`), `ER_LOCK_DEADLOCK` thực (`409 CONCURRENT_CONFLICT`), `ER_LOCK_WAIT_TIMEOUT` thực (`503 LOCK_WAIT_TIMEOUT`) và `10` truy vấn song song trên Connection Pool sau lỗi đều dùng đúng session `time_zone = '+07:00'`.
  - **Bốn mốc số liệu tiền phạt (lệch `3` ngày × `2` chiếc × `5.000 đ = 30.000 đ`):**
    - *Seed ban đầu:* `collected = 80.000`, `unpaid = 55.000`, `provisional = 145.000`, `totalOwed = 200.000` (đã chạy assertion & có dòng `recordCase` `FN-01` trong log JSON).
    - *Sau khi tạo phiếu tạm quá hạn 3 ngày × 2 chiếc:* `collected = 80.000`, `unpaid = 55.000`, `provisional = 175.000`, `totalOwed = 230.000` (**đã xác minh trực tiếp qua `assert.equal` trong code `verify_step6_2.mjs`**, nhưng trước đó chưa tách một dòng `recordCase` riêng để in snapshot trung gian này ra bảng log JSON).
    - *Sau khi trả phiếu (`provisional → unpaid`):* `collected = 80.000`, `unpaid = 85.000`, `provisional = 145.000`, `totalOwed = 230.000` (đã assert & có dòng `recordCase` `FN-02 + FLOW` trong log JSON).
    - *Sau khi thu khoản phạt `30.000`:* `collected = 110.000`, `unpaid = 55.000`, `provisional = 145.000`, `totalOwed = 200.000` (đã assert đủ cả 4 trường trong code; dòng `recordCase` `FN-03..06` in tóm tắt `110000/55000/200000`).
  - Dọn đúng các ID đã tạo trong `RUN_ID` theo thứ tự Foreign Key (`fines` → `borrowings` → `equipments`); Snapshot MySQL sau kiểm thử trở về nguyên trạng `equipments = 14`, `borrowings = 17`, `fines = 4`, `runIdRows = 0`.
- **Lỗi AI đã phát hiện và cách xử lý:**
  - *Lỗi độ dài mã test trong script Bước 6.2:* Lượt chạy đầu dùng `TEST-E2E-20261125-62A-A` (`23` ký tự `> VARCHAR(20)`) bị Zod chặn `400 VALIDATION_ERROR`; đã rút gọn tiền tố thành `T-20261125-62A-*` (`16–18` ký tự `<= 20`) và rà lại các mã `TEST-PM-{{runTag}}-*` (`16–18` ký tự) trong Postman Collection đều hợp lệ, sau đó chạy lại đạt `33/33 PASS`.
  - *Giới hạn công cụ Postman Desktop:* Chưa chạy trực tiếp Collection trên giao diện Postman Desktop trong bước này (dự kiến thực hiện cùng phần chụp ảnh minh chứng ở Bước 6.3).

---

## Prompt 19 – Giai đoạn 6 (Bước 6.2.1): Hoàn thiện Postman Collection, Environment và tài liệu kiểm thử sau Audit

- **Nhiệm vụ:** Khắc phục toàn bộ các điểm *Medium/Low* phát hiện ở Audit độc lập Bước 6.2 chỉ trong 3 file được phép (`evidence/postman/RikkeiLab.postman_collection.json`, `evidence/postman/RikkeiLab.local.postman_environment.json`, `prompts.md`). Không chỉnh sửa source code Backend/Frontend, file SQL, `README.md`, dữ liệu MySQL và chưa chạy Postman Desktop hay tạo ảnh/Commit #9.
- **Phạm vi file đã sửa:**
  - `evidence/postman/RikkeiLab.postman_collection.json` (`30 → 35` request): Request `1.1` tự sinh `runTag` mới và xóa các biến ID tạm cũ cho lượt chạy mới (không tái sinh mỗi request); `2.12` chỉ `unset('tempCrudEqId')`/`unset('tempCrudEqCode')` khi nhận HTTP `200`; bổ sung guard kiểm tra biến phụ thuộc (`pm.execution.skipRequest()` hoặc ném lỗi rõ ràng trước khi gửi); lấy động `lab001Id` ở `2.2` thay cho ID cứng `1` ở `2.4`/`2.10`/`2.11`; `4.3` dùng `999999` chứng minh Zod kiểm tra body trước khi truy vấn DB; chuẩn hóa URL dạng chuỗi `{{baseUrl}}/...` hợp lệ schema v2.1; bổ sung `3.8` kiểm tra `dueDatePast` (`400 INVALID_DUE_DATE`); hoàn thiện toàn bộ quy trình `5.1..5.6` kèm SQL khóa chặt theo ID và cleanup đúng thứ tự FK cho Folder 3 & Folder 5.
  - `evidence/postman/RikkeiLab.local.postman_environment.json` (`15 → 15` biến): Gỡ 3 biến dư (`dueDate0`, `dueDate14`, `tempFlowEqCode`), bổ sung `lab001Id`, `tempOverdueEqId`, `tempOverdueBorrowingId`; mọi biến đều có mục đích rõ ràng, giữ `baseUrl = http://localhost:5000/api` và 0 secret.
  - `prompts.md`: Bổ sung bảng 4 mốc số liệu tiền phạt (phân biệt rõ phần đã `assert` với phần ghi `recordCase` log) và ghi nhận Prompt 19.
- **Kết quả kiểm tra tĩnh đã thực hiện:**
  - `JSON.parse` thành công cả 2 file Postman, kiểm tra đủ 5 thư mục / `35` request, `0` biến thiếu, `0` biến dư, tất cả URL đúng chuẩn v2.1 (chuỗi `{{baseUrl}}/...`), không chứa secret hay hardcode ID seed, toàn bộ hướng dẫn SQL chỉ dùng ID đơn lẻ.
  - `git diff` và `git status -uall --short` xác nhận chỉ sửa đúng 3 file được phép.
- **Nội dung chưa kiểm chứng thực tế:** Chưa khởi động server để chạy Collection trực tiếp trên Postman Desktop Runner và chưa chụp ảnh minh chứng (chờ Bước 6.3).

---

## Prompt 20 – Giai đoạn 6 (Bước 6.2.2): Khắc phục an toàn dữ liệu thử nghiệm và hoàn thiện luồng Postman

- **Nhiệm vụ:** Khắc phục toàn bộ các lỗi *High/Medium/Low* phát hiện ở Final Review Bước 6.2.1 chỉ trong 3 file được phép (`evidence/postman/RikkeiLab.postman_collection.json`, `evidence/postman/RikkeiLab.local.postman_environment.json`, `prompts.md`). Không chỉnh sửa source Backend/Frontend, file SQL, `README.md`, `.env`, không thao tác MySQL, không mở server, không chạy Postman Desktop Runner và chưa tạo ảnh/Commit #9.
- **Các lỗi Final Review đã khắc phục:**
  - *[High]* Request `1.1` trước đây gọi `unset` vô điều kiện toàn bộ biến ID DB tạm (`tempCrudEqId`, `tempCrudEqCode`, `tempFlowEqId`, `tempBorrowingId`, `tempOverdueEqId`, `tempOverdueBorrowingId`, `tempOverdueFineId`), gây mất dấu ID cần cleanup nếu chạy lại Runner khi chưa dọn MySQL.
  - *[Medium]* Request `2.2` và `2.3` giả định `data.items.length === 1` trong khi Backend tìm bằng `LIKE '%search%'`, dễ fail giả hoặc chọn nhầm phần tử nếu có mã chứa chuỗi con `LAB-001`/`LAB-003`.
  - *[Medium]* Request `3.12`, `3.13` và `5.6` chỉ kiểm tra ID tồn tại mà chưa kiểm tra thao tác tiền đề (`3.11` / `5.5`) thực sự thành công; khi chạy riêng Folder 3/5 hoặc bỏ qua `1.1`, các request tạo dữ liệu không tự chặn nếu ID lượt trước vẫn còn.
  - *[Low]* Hướng dẫn cleanup Folder 3 và Folder 5 chưa bao phủ đầy đủ các kịch bản chạy dở dang, tình huống chưa phát sinh `fines` và cách tra cứu theo `borrowing_id` nếu mất `tempOverdueFineId`.
- **Thay đổi cấu trúc & biến Environment:**
  - *Số Folder và Request:* Giữ nguyên `5` Folder và `35` request (`1 + 12 + 13 + 3 + 6`).
  - *Environment (`15 → 19` biến):* Giữ nguyên 15 biến hiện có; bổ sung 4 biến trạng thái/kiểm soát: `runBlocked` (mặc định `"false"`), `runBlockedReason` (`""`), `tempBorrowingReturned` (`"false"`), `tempOverdueFinePaid` (`"false"`); không xóa biến nào và giữ `0` secret.
- **Cơ chế bảo vệ ID chưa cleanup & Fail-closed Runner (`1.1` + Collection Pre-request):**
  - Collection Pre-request không tự sinh `runTag`, chỉ cập nhật ngày giờ `Asia/Ho_Chi_Minh` (`todayIso`, `dueDate7`, `dueDate15`, `dueDatePast`), đặt mặc định `baseUrl`, và kiểm tra nếu request hiện tại không phải `1.1` trong khi `runBlocked === 'true'` thì gọi `setNextRequest(null)` + `skipRequest()` (fallback `throw new Error`) để chặn gửi HTTP.
  - Pre-request của `1.1` kiểm tra trước 7 biến ID DB tạm: nếu còn ít nhất 1 biến -> giữ nguyên toàn bộ ID & `runTag`, bật `runBlocked = 'true'`, ghi chi tiết biến/ID vào `runBlockedReason`, gọi `setNextRequest(null)` và đánh FAIL assertion cổng cleanup tại `1.1` Tests. Chỉ khi cả 7 biến đều rỗng, `1.1` mới đặt `runBlocked = 'false'`, cấp 1 `runTag` mới, `unset` cặp biến tham chiếu seed (`lab001Id`, `outOfStockEqId`) và đặt lại `tempBorrowingReturned = 'false'`, `tempOverdueFinePaid = 'false'`.
  - Không có script nào `unset` 5 biến ID luồng 3/5; `tempCrudEqId`/`tempCrudEqCode` chỉ bị `unset` bên trong nhánh HTTP `200` + `data.message` hợp lệ của `2.12`.
- **Tìm kiếm chính xác & Guard theo trạng thái / Chạy riêng Folder:**
  - `2.2` và `2.3`: `unset` `lab001Id`/`outOfStockEqId` ở Pre-request trước khi gửi; dùng `limit=100`; lọc chính xác `item.code === 'LAB-001'` / `item.code === 'LAB-003'` (`matches.length === 1`) rồi mới lưu ID.
  - `3.11` và `5.5`: reset cờ trạng thái về `'false'` trước khi gọi và chỉ bật `'true'` sau khi xác nhận HTTP `200` cùng đầy đủ cấu trúc body trả về (`returned` / `paid`, khớp ID, khớp `todayIso`). `3.12` và `3.13` bắt buộc `tempBorrowingReturned === 'true'`; `5.6` bắt buộc `tempOverdueFinePaid === 'true'`.
  - `2.6`, `3.5`, `3.10`, `5.1`, `5.2`, `5.4`: tự chặn (bật `runBlocked='true'` + `setNextRequest(null)` + `skipRequest()`) nếu biến ID đích của lượt trước vẫn còn, và yêu cầu có `runTag` (hướng dẫn chạy `1.1` trước khi chạy riêng Folder).
- **Hướng dẫn cleanup SQL khi luồng chạy dở dang:**
  - Bổ sung hướng dẫn SQL khóa chính xác theo ID trong mô tả Folder 2 (sau `2.6` nếu `2.12` lỗi), Folder 3 (4 tình huống: mới tạo thiết bị chưa mượn, đã tạo phiếu chưa trả, đã trả đúng hạn, và cleanup bản ghi lỗi), và Folder 5 (Trường hợp A..E: tránh chạy `DELETE FROM fines` với placeholder rỗng khi chưa phát sinh phạt; truy vấn `SELECT id, borrowing_id, amount, status FROM fines WHERE borrowing_id = <tempOverdueBorrowingId>;` nếu mất `tempOverdueFineId`; dừng ngay trước khi xóa bảng cha nếu lệnh xóa bảng con thất bại; không dùng `LIKE` hay xóa diện rộng).
- **Kết quả kiểm tra tĩnh đã thực hiện (`12/12 PASS`):**
  - `JSON.parse` thành công 2 file Postman; đúng schema v2.1; đủ `5` Folder / `35` request; toàn bộ URL/method/body JSON/JS script biên dịch hợp lệ; đủ `19` biến (`0` thiếu, `0` dư); `0` hardcode seed ID; `0` đường thực thi tự động `unset` ID DB đang chờ cleanup; mô phỏng JS sandbox trong Node xác nhận logic `runBlocked`, mở khóa `1.1`, lọc đa phần tử `2.2`/`2.3`, guard `3.11→3.12/3.13` và `5.5→5.6`; `0` SQL xóa diện rộng; `0` secret.
- **Những nội dung chưa kiểm chứng thực tế trên Postman Desktop:**
  - Đây mới là kiểm tra tĩnh và mô phỏng script JS; chưa khởi động Backend/Frontend, chưa ghi MySQL, chưa chạy trực tiếp Collection trên ứng dụng Postman Desktop Runner để kiểm chứng runtime thực tế của `pm.execution.skipRequest()` / `pm.execution.setNextRequest(null)` (chờ Bước 6.3).

---

## Prompt 21 – Giai đoạn 6 (Bước 6.2.3): Hoàn thiện cơ chế chặn Collection Runner và ghi nhận lỗi tại Health

- **Nhiệm vụ:** Khắc phục sự không nhất quán logic tại request `1.1` đã phát hiện ở Bước 6.2.2 — Pre-request Script gọi đồng thời `pm.execution.skipRequest()` và `pm.execution.setNextRequest(null)` trong nhánh phát hiện ID chưa cleanup, trong khi báo cáo lại khẳng định Tests của `1.1` sẽ chạy và ghi assertion FAIL. Hai hành vi này xung đột: theo tài liệu Postman, khi `skipRequest()` được gọi trong Pre-request thì request HTTP không được gửi và Tests (Post-response) **không** chạy.
- **Phân tích vấn đề:**
  - `pm.execution.skipRequest()` trong Pre-request: hủy gửi HTTP của request hiện tại; Tests không chạy; Runner chuyển sang request tiếp theo.
  - `pm.execution.setNextRequest(null)` trong Pre-request hoặc Tests: yêu cầu Runner không xếp lịch request tiếp theo sau khi item hiện tại kết thúc.
  - Hai lệnh này độc lập: `skipRequest` = không gửi request này; `setNextRequest(null)` = dừng Runner sau item này.
  - Gọi `skipRequest()` trước `setNextRequest(null)` trong Pre-request đồng nghĩa Tests KHÔNG chạy → assertion FAIL tại Tests là **bất khả đạt** → không thể dùng `pm.test()` FAIL để ghi nhận nguyên nhân chặn trong trường hợp này.
- **Phương án đã áp dụng:**
  - **1.1 Pre-request:** Chỉ kiểm tra các biến ID tạm; nếu phát hiện còn ID chưa cleanup → đặt `runBlocked='true'`, ghi chi tiết vào `runBlockedReason`, in `console.error(...)`, nhưng **không** gọi `skipRequest()` và **không** gọi `setNextRequest(null)` → cho phép `GET /api/health` được gửi bình thường (read-only, không nguy hiểm); nếu tất cả ID tạm rỗng → đặt `runBlocked='false'`, sinh `runTag` mới, reset các biến trạng thái.
  - **1.1 Post-response (Tests):** Kiểm tra `runBlocked === 'true'`; nếu đúng → gọi `pm.execution.setNextRequest(null)` (hoặc fallback `postman.setNextRequest(null)`) để dừng Runner, gọi `pm.test(...)` ném lỗi (assertion FAIL được ghi nhận vì Tests đang chạy), in `runBlockedReason` ra `console.error`; nếu `runBlocked === 'false'` → chạy các assertion Health bình thường (`HTTP 200`, `database: 'connected'`).
  - **Tất cả request khác (không phải 1.1):** Giữ nguyên guard `haltRunnerAndSkip()` trong Collection Pre-request — nếu `runBlocked === 'true'` và request hiện tại không phải `1.1` thì gọi `setNextRequest(null)` + `skipRequest()` (Tests không chạy, HTTP không gửi).
- **Quy định phiên bản Postman:** Yêu cầu tối thiểu **Postman Desktop ≥ v10.22**. Hàm `haltRunnerAndSkip()` trong Collection Pre-request ghi rõ fallback khi `pm.execution.skipRequest` không tồn tại: in cảnh báo `[UNSUPPORTED POSTMAN < 10.22]` và ném `throw new Error(...)` — cơ chế này **không bảo đảm tương đương** `skipRequest()` trên phiên bản cũ hơn; chỉ là biện pháp báo lỗi.
- **Phạm vi file đã sửa:**
  - `evidence/postman/RikkeiLab.postman_collection.json`: Cập nhật Pre-request Script của `1.1` (bỏ `skipRequest()` + `setNextRequest(null)` khỏi nhánh dirty); cập nhật Tests Script của `1.1` (thêm logic kiểm tra `runBlocked === 'true'` → `setNextRequest(null)` + `pm.test()` FAIL + `console.error(runBlockedReason)`, nhánh `else` giữ nguyên assertion Health); cập nhật `haltRunnerAndSkip()` trong Collection Pre-request (thêm chú thích phân biệt `setNextRequest` vs `skipRequest`, thêm cảnh báo phiên bản trong nhánh fallback `throw new Error`); cập nhật mô tả Collection (ghi rõ yêu cầu Postman ≥ v10.22).
  - `prompts.md`: Bổ sung Prompt 21.
  - `evidence/postman/RikkeiLab.local.postman_environment.json`: **Không thay đổi** — không cần biến mới cho Bước 6.2.3 (giữ nguyên 19 biến).
- **Kết quả kiểm tra tĩnh đã thực hiện:**
  - `verify_step6_2_3.mjs` — **10/10 PASS** (5 static + 5 JS harness cases):
    - `[PASS] 1`: JSON.parse thành công cả Collection và Environment.
    - `[PASS] 2`: Schema Postman v2.1, 5 Folders, 35 Requests (1+12+13+3+6).
    - `[PASS] 3`: Toàn bộ JS script biên dịch hợp lệ (không lỗi cú pháp).
    - `[PASS] 4`: 1.1 Pre-request **không** chứa `skipRequest` hoặc `setNextRequest`; 1.1 Post-response **có** `setNextRequest(null)` và in `runBlockedReason`.
    - `[PASS] 5`: Zero đường thực thi tự động `unset` ID DB đang chờ cleanup.
    - `[PASS] Case 1`: Môi trường sạch → 1.1 Health PASS, 1 `runTag` được sinh, Runner tiếp tục sang `2.1`.
    - `[PASS] Case 2`: Còn `tempBorrowingId=18` → 1.1 GET /health được gửi (read-only), Tests ghi FAIL, Runner dừng tại `setNextRequest(null)`, không gửi request mutating nào, ID được bảo toàn.
    - `[PASS] Case 3`: Còn `tempOverdueFineId=7` → 1.1 FAIL + halt, fine ID bảo toàn; nếu ép chạy `5.5` riêng lẻ trong khi `runBlocked='true'` → bị `skipRequest()` chặn.
    - `[PASS] Case 4`: Các request 2.1/2.6/2.12/3.5/3.10/3.11/4.2/5.1/5.5 với `runBlocked='true'` → tất cả `skipCalled=true`, HTTP không gửi, Tests không chạy.
    - `[PASS] Case 5`: Người dùng cleanup DB + xóa biến ID → chạy lại `1.1` → `runBlocked='false'`, `runTag` mới, Runner chạy sạch qua `2.1`→`2.6`.
  - `verify_step6_2_2.mjs` (regression) — **12/12 PASS** (cập nhật dòng 263 để match tên test tiếng Việt mới của `1.1`).
- **Những nội dung chưa kiểm chứng thực tế trên Postman Desktop:**
  - Đây mới là kiểm tra tĩnh và mô phỏng script JS; chưa khởi động Backend/Frontend, chưa ghi MySQL, chưa chạy trực tiếp Collection trên ứng dụng Postman Desktop Runner để kiểm chứng runtime thực tế của `pm.execution.skipRequest()` / `pm.execution.setNextRequest(null)` (chờ Bước 6.3).
  - Fallback `throw new Error()` khi Postman < v10.22 chưa kiểm chứng hành vi runtime thực tế trên phiên bản cũ.

---

## Prompt 22 – Giai đoạn 6 (Bước 6.3 & Bước 6.3.1): Kiểm thử runtime Newman, phát hiện & khắc phục 2 lỗi Critical trong Postman Collection

- **Bối cảnh từ Bước 6.3:** Khi chạy kiểm thử thực tế qua `newman@6.2.3` (`postman-runtime@7.39.1`, `postman-sandbox@4.7.1`) đối với Backend `http://localhost:5000`, đã phát hiện 2 lỗi runtime thực tế trong `evidence/postman/RikkeiLab.postman_collection.json`; đồng thời Chrome DevTools MCP bị chặn tại host (`ENOENT DevToolsActivePort`) và không thể thao tác trực tiếp Postman Desktop GUI. Bước 6.3 kết luận FAIL, dừng mọi thao tác ghi và chuyển sang Bước 6.3.1 để sửa đúng 2 lỗi Collection rồi kiểm chứng lại bằng Newman.
- **Nguyên nhân của hai lỗi runtime:**
  1. **`BUG-6.3-01` (Collection Pre-request):** `getTodayVN()` gọi `new Intl.DateTimeFormat('en-CA', ...)` vốn không tồn tại trong `postman-sandbox@4.7.1` → ném `ReferenceError: Intl is not defined` ở mọi request. Nghiêm trọng hơn, lệnh `const today = getTodayVN()` chạy **trước** đoạn `if (!isHealthCheck && runBlocked === 'true') haltRunnerAndSkip(...)`, làm cổng guard fail-closed bị bỏ qua hoàn toàn (chạy `--folder "4. Fines"` khi `runBlocked='true'` vẫn gửi cả 3 request HTTP thật).
  2. **`BUG-6.3-02` (34 Test Script từ `2.1` đến `5.6`):** Tất cả 34 request khai báo `const data = pm.response.json();` ở top-level, xung đột với legacy global `'data'` (alias `pm.iterationData`) được `postman-legacy-interface.js` (`LEGACY_GLOBS`) khai báo sẵn trong sandbox → ném `SyntaxError: Identifier 'data' has already been declared` và không chạy được assertion nào. Đồng thời kiểm tra trực tiếp trên `newman@6.2.3` cho thấy tên đề xuất `responseBody` **cũng trùng** `LEGACY_GLOBS` (`SyntaxError: Identifier 'responseBody' has already been declared`); sau khi xác nhận với người dùng, đã chọn tên **`resBody`** (an toàn, 0 xung đột).
- **Những thay đổi đã thực hiện trong `evidence/postman/RikkeiLab.postman_collection.json`:**
  - **Sửa Collection Pre-request (`BUG-6.3-01`):**
    - Đưa kiểm tra `!isHealthCheck && runBlocked === 'true'` lên **đầu tiên** trước mọi phép tính ngày; khi bị chặn thì gọi `haltRunnerAndSkip(...)` ngay lập tức, không tính ngày và không gửi HTTP.
    - Thay `Intl.DateTimeFormat` trong `getTodayVN()` bằng phép tính UTC+07:00 thuần (`new Date(Date.now() + 7 * 60 * 60 * 1000)` + `getUTCFullYear/Month/Date`); giữ `addDays()` dùng `Date.UTC()` xử lý đúng cuối tháng, cuối năm, năm nhuận và định dạng `YYYY-MM-DD`.
    - Chỉ tính `todayIso`, `dueDate7`, `dueDate15`, `dueDatePast` và mặc định `baseUrl` trong nhánh `else` (gồm `1.1` hoặc các request không bị block).
  - **Sửa 34 Test Script `2.1`–`5.6` (`BUG-6.3-02`):**
    - Đổi toàn bộ biến cục bộ `data` và các tham chiếu tương ứng sang `resBody` ở cả 34 request (`125` dòng được cập nhật); giữ nguyên 100% tên trường JSON API (`items`, `pagination`, `equipment`, `borrowing`, `fine`, `summary`, `error`, `message`).
    - Rà soát toàn bộ khai báo biến trong 35 request (`scan_all_identifiers.mjs`): `0` xung đột với `LEGACY_GLOBS` hoặc globals của Postman/Newman (`1.1` vẫn dùng `body`).
- **Kết quả kiểm chứng tĩnh, biên ngày & regression:**
  - `audit_postman_sandbox.mjs`: `0` cảnh báo `Intl` hay legacy global collision trên toàn bộ 35 request.
  - `test_dates.mjs`: Đạt các mốc biên UTC+07:00 (`16:59Z`/`17:00Z`), cuối tháng, cuối năm và năm nhuận (`2024-02-28` → `2024-02-29` → `2024-03-01`).
  - `verify_step6_2_3.mjs`: **10/10 PASS** (5 static + 5 JS harness cases).
  - `verify_step6_2_2.mjs`: **12/12 PASS** (schema v2.1, 5 folders / 35 requests, 19 env vars, 0 hardcoded seed IDs, 0 auto-unset live IDs, guard trạng thái và 0 secret).
- **Kết quả kiểm chứng runtime thực tế với `newman@6.2.3` + Backend `http://localhost:5000` (không ghi dữ liệu MySQL):**
  - **Case A – Clean Health (`--folder "1. Health"`, env sạch):** `exit=0`; `GET /api/health` → `200 OK`; `2/2` assertions PASS (`HTTP 200 OK`, `Database connected`); `todayIso='2026-11-26'`, `dueDate7='2026-12-03'`, `dueDate15='2026-12-11'`, `dueDatePast='2026-11-25'`, `runTag='WTHP3H'`, `runBlocked='false'`; `0` lỗi `Intl is not defined`.
  - **Case B – Dirty ID probe (toàn Collection, `tempBorrowingId='RUN-BLOCK-PROBE-NOT-A-DB-ID'`, `runTag='SEEDTAG63'`):** `exit=1` đúng cổng chặn `1.1`; chỉ `1` request HTTP (`GET /api/health` → `200 OK`) được gửi; assertion `'Cổng kiểm tra 1.1...'` FAIL; Runner dừng ngay sau `1.1`; `0` request mutating gửi đi; `tempBorrowingId` và `runTag='SEEDTAG63'` được giữ nguyên, `runBlocked='true'`.
  - **Case C – Guard khi `runBlocked='true'` (`--folder "4. Fines"` dùng env từ Case B):** `exit=0`; `requests: 0 executed`, `testScripts: 0 executed`, `total data received: 0B`, in `[BLOCKED] Không gửi request "4.1 ..."` và skip + dừng Runner ngay ở Collection Pre-request; `0` lỗi `Intl` hay lỗi cú pháp Pre-request.
  - **Case D – Folder 4 sạch (`--folder "4. Fines"`, env sạch):** `exit=0`; `3/3` requests chạy thật (`4.1 GET /api/fines` → `200 OK`, `4.2 PATCH /api/fines/999999/pay` → `404 FINE_NOT_FOUND`, `4.3` body `{amount:1000}` → `400 VALIDATION_ERROR`); `7/7` assertions PASS; `0` lỗi `Identifier 'data' has already been declared` hoặc `responseBody`.
  - **Đối chiếu DB & Server:** Đã tắt Backend gọn gàng (port `5000`/`5173` trống); MySQL giữ nguyên vẹn `14 equipments / 17 borrowings / 4 fines`.
- **Phân biệt Newman CLI vs Postman Desktop GUI & phần chưa kiểm chứng:**
  - Kết quả Case A–D chứng minh runtime thực tế trên engine chính thức **`newman@6.2.3` (`postman-runtime@7.39.1`, `postman-sandbox@4.7.1`)** với HTTP thật tới Backend/MySQL, **không phải** chạy trực tiếp trên cửa sổ Postman Desktop GUI (và chưa chụp ảnh Postman Desktop GUI).
  - Các Folder có thao tác ghi dữ liệu (`2. Equipments`, `3. Borrowings`, `5. Overdue Pay`) chưa chạy trong Bước 6.3.1 (theo giới hạn phạm vi không ghi DB).
  - Kiểm tra giao diện trình duyệt (Desktop/Tablet/Mobile) và ảnh `evidence/ui/` **vẫn chưa thực hiện được** do Chrome chưa bật remote debugging (`DevToolsActivePort`).

---

## Prompt 23 – Giai đoạn 6 (Bước 6.3 nghiệm thu đầy đủ & Bước 6.4 hoàn thiện tài liệu)

- **Kết quả kiểm thử tích hợp toàn hệ thống (Bước 6.3 – sau khi sửa 6.3.1):**
  - **API thực tế bằng `newman@6.2.3` + Backend `http://localhost:5000` (KHÔNG phải Postman Desktop GUI):**
    - Tổng hợp cả 5 Folder (`runTag = WTNMXZ`): **`35/35` request PASS** và **`71/71` assertions PASS** (`0` failed).
    - **Folder 1–4 (`run63_f14_report.json`):** **`29/29` request**, **`59/59` assertions** PASS (`1.1` Health `200`; `2.1..2.12` Equipments CRUD + `400`/`404`/`409` + `2.12` tự xóa `id=38` và unset biến; `3.1..3.13` Borrowings lọc 4 trạng thái + tạo `id=54` trên `eq=39` + trả đúng hạn + trả trùng `409 BORROWING_ALREADY_RETURNED` + khôi phục tồn kho; `4.1..4.3` Fines `200`/`404`/`400 VALIDATION_ERROR`).
    - **Folder 5 (`run_folder5.mjs`):** **`6/6` request**, **`12/12` assertions** PASS (`5.1..5.2` tạo `eq=40`, `b=55` → tạm dừng chạy SQL `SET time_zone='+07:00'` backdate khóa chặt theo `id=55 AND equipment_id=40 AND returned_at IS NULL` → `5.3..5.6` xác nhận trễ `3 ngày` `provisional 30.000 đ` → trả chốt `fineId=13` `unpaid` → thu tiền `200 OK` → thử thu trùng `409 FINE_ALREADY_PAID`).
  - **Database sau cleanup theo đúng thứ tự FK (`fines` → `borrowings` → `equipments`):**
    - Mọi bản ghi thử nghiệm của Newman (`38`, `39`, `54`, `40`, `55`, `13`) và UI (`TEST-UI-63A/B/C/D`, `eq=51/52`, `b=59/60`, `f=14`) đều được xóa theo ID chính xác và kiểm chứng `0` bản ghi dư.
    - MySQL trở về nguyên trạng **`14 equipments / 17 borrowings / 4 fines`**, dữ liệu seed nguyên vẹn 100%.
  - **Kiểm tra giao diện thực tế qua trình duyệt Chrome thật (`chrome_profile_63` tách biệt, không chạm profile cá nhân):**
    - Đã kiểm tra đủ 3 màn hình (**Thiết bị**, **Phiếu mượn**, **Quá hạn & tiền phạt**), modal thêm/sửa/chi tiết/xóa/trả/thu phạt, trạng thái loading, empty state, success alert, validation và các lỗi HTTP `400`, `404`, `409`.
    - Kiểm tra cả 3 kích thước **Desktop (`1280×900`)**, **Tablet (`768×1024`)** và **Mobile (`375×812`)**: `0` lỗi tràn ngang (`scrollWidth <= innerWidth`), **`0` lỗi JavaScript console** và **`0` page error**.
  - **Giải trình đối chiếu số liệu tiền phạt giữa ngày `25/11/2026` và `26/11/2026` (ảnh `08` & ảnh `13`):**
    - Ngày `25/11/2026`: 3 phiếu quá hạn seed (`PM-008`, `PM-009`, `PM-010`) có `provisionalAmount = 145.000 đ`, `unpaidSettledAmount = 55.000 đ`, `totalOwedAmount = 200.000 đ`.
    - Sang ngày `26/11/2026` (thời điểm chụp ảnh Bước 6.3): `14` đơn vị thiết bị của 5 phiếu seed chưa trả (`PM-006: 2`, `PM-007: 4`, `PM-008: 1`, `PM-009: 4`, `PM-010: 3`; trong đó `PM-006` và `PM-007` có `due_date = 25/11` bắt đầu quá hạn `1 ngày`) tăng thêm `+1 ngày × 14 × 5.000 = +70.000 đ`, nên nền seed trên API `GET /api/fines` là `provisionalAmount = 215.000 đ`, `totalOwedAmount = 270.000 đ`.
    - Do đó, trên ảnh `08-fines-summary-and-table.png` (khi phiếu thử nghiệm `PM-060` chưa trả, tạm tính `30.000 đ`): `collectedAmount = 80.000 đ`, `provisionalAmount = 245.000 đ`, `totalOwedAmount = 300.000 đ`. Sau khi trả và thu đủ `30.000 đ` cho `PM-060`, ảnh `13-mobile-375px-fines.png` hiển thị `collectedAmount = 110.000 đ`, `provisionalAmount = 215.000 đ`, `totalOwedAmount = 270.000 đ`. Số liệu khớp 100% với công thức động của Backend và Database thực tế, không phải lỗi tính toán.
  - **Minh chứng (`evidence/`) & giới hạn:**
    - `evidence/ui/`: Đủ **14 ảnh** chụp trực tiếp từ trình duyệt thực tế (`01`..`14`, đã mở kiểm tra trực tiếp từng ảnh + contact sheet ngoài repo).
    - `evidence/postman/`: Đủ **7 ảnh** (`newman-01`..`newman-07`) là ảnh chụp từ **báo cáo Newman `htmlextra`** (nêu rõ đây là minh chứng Newman CLI, không gọi nhầm là ảnh Postman Desktop GUI do trợ lý không thao tác trực tiếp app desktop Postman).
- **Hoàn thiện tài liệu (Bước 6.4):**
  - Cập nhật hoàn chỉnh `README.md` đủ 18 mục tiếng Việt (công nghệ & phiên bản thực tế từ `package.json`/`node_modules`, luồng kiến trúc, cây thư mục thật, hướng dẫn SQL an toàn không ghi đè `seed.sql`, `.env.example`, danh sách API, quy tắc động/+07:00/transaction/bảo mật, hướng dẫn Newman/Postman, lỗi khó phát hiện nhất, kết quả nghiệm thu và bảng 21 ảnh minh chứng).
  - Rà soát Git: không chứa `.env`, `node_modules`, `dist`, contact sheet hay file tạm; giữ nguyên chưa stage và chưa tạo Commit #9 để chờ nghiệm thu.
