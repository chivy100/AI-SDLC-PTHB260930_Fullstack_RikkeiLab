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
