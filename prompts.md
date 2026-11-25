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
