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
