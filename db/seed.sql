-- Rikkei Lab - Du lieu mau (tieng Viet co dau, ngay tuong doi theo gio Viet Nam +07:00)
-- Thu tu chay: schema.sql -> mo_rong.sql -> seed.sql

USE rikkei_lab;

SET NAMES utf8mb4;
SET time_zone = '+07:00';

-- ============================================================
-- 1. SEED 14 THIET BI (du 4 loai ENUM, con hang, het hang, chua tung muon)
-- ============================================================
INSERT INTO equipments (code, name, category, total_quantity) VALUES
  ('LAB-001', 'Laptop Dell Latitude 5420', 'laptop', 10),
  ('LAB-002', 'Laptop Lenovo ThinkPad E14', 'laptop', 8),
  ('LAB-003', 'Laptop ASUS VivoBook 15', 'laptop', 5),
  ('LAB-004', 'Màn hình LG 24 inch IPS', 'man_hinh', 12),
  ('LAB-005', 'Màn hình Dell UltraSharp 27 inch', 'man_hinh', 4),
  ('LAB-006', 'Màn hình Samsung Odyssey 24 inch', 'man_hinh', 6),
  ('LAB-007', 'Bo mạch Arduino Uno R3', 'mach_dien_tu', 30),
  ('LAB-008', 'Raspberry Pi 4 Model B (4GB)', 'mach_dien_tu', 15),
  ('LAB-009', 'Kit phát triển ESP32 WiFi Bluetooth', 'mach_dien_tu', 20),
  ('LAB-010', 'Cảm biến siêu âm HC-SR04', 'mach_dien_tu', 18),
  ('LAB-011', 'Bàn phím cơ Keychron K2', 'phu_kien', 20),
  ('LAB-012', 'Chuột không dây Logitech M331', 'phu_kien', 25),
  ('LAB-013', 'Tai nghe chụp tai Sony MDR-ZX110', 'phu_kien', 10),
  ('LAB-014', 'Bộ chuyển đổi USB-C sang HDMI Ugreen', 'phu_kien', 14);

-- ============================================================
-- 2. SEED 17 PHIEU MUON & DU LIEU TIEN PHAT TUONG UNG
-- ============================================================

-- Nhom A: Dang muon trong han (5 phieu)
INSERT INTO borrowings (equipment_id, borrower_name, quantity, borrowed_at, due_date, returned_at, note)
VALUES
  ((SELECT id FROM equipments WHERE code = 'LAB-001'), 'Nguyễn Văn An', 2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 5 DAY), NULL, 'Thực hành môn Lập trình Web'),
  ((SELECT id FROM equipments WHERE code = 'LAB-002'), 'Trần Thị Bình', 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 6 DAY), NULL, 'Làm đồ án cuối kỳ'),
  ((SELECT id FROM equipments WHERE code = 'LAB-003'), 'Lê Minh Châu', 3, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), NULL, 'Nhóm phát triển giao diện'),
  ((SELECT id FROM equipments WHERE code = 'LAB-004'), 'Phạm Quốc Dũng', 3, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), NULL, 'Kiểm thử hiển thị đa màn hình'),
  ((SELECT id FROM equipments WHERE code = 'LAB-007'), 'Hoàng Thu Hà', 6, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), NULL, 'Thực hành IoT buổi sáng');

-- Nhom B: Den dung ngay han tra hom nay nhung chua tra (2 phieu -> trang thai Dang muon, chua qua han)
INSERT INTO borrowings (equipment_id, borrower_name, quantity, borrowed_at, due_date, returned_at, note)
VALUES
  ((SELECT id FROM equipments WHERE code = 'LAB-003'), 'Vũ Ngọc Khánh', 2, DATE_SUB(CURDATE(), INTERVAL 7 DAY), CURDATE(), NULL, 'Trả cuối giờ chiều nay'),
  ((SELECT id FROM equipments WHERE code = 'LAB-008'), 'Đặng Hữu Hải', 4, DATE_SUB(CURDATE(), INTERVAL 5 DAY), CURDATE(), NULL, 'Hạn trả đúng hôm nay');

-- Nhom C: Qua han chua tra (3 phieu -> khong tao ban ghi fines, tinh tien phat tam tinh)
INSERT INTO borrowings (equipment_id, borrower_name, quantity, borrowed_at, due_date, returned_at, note)
VALUES
  ((SELECT id FROM equipments WHERE code = 'LAB-001'), 'Ngô Bảo Long', 1, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY), NULL, 'Chưa mang thiết bị lên phòng lab'),
  ((SELECT id FROM equipments WHERE code = 'LAB-005'), 'Bùi Thanh Mai', 4, DATE_SUB(CURDATE(), INTERVAL 12 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY), NULL, 'Dùng cho workshop thiết kế'),
  ((SELECT id FROM equipments WHERE code = 'LAB-012'), 'Phan Tuấn Nam', 3, DATE_SUB(CURDATE(), INTERVAL 9 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), NULL, NULL);

-- Nhom D: Da tra dung han hoac som han (3 phieu -> khong co ban ghi fines)
INSERT INTO borrowings (equipment_id, borrower_name, quantity, borrowed_at, due_date, returned_at, note)
VALUES
  ((SELECT id FROM equipments WHERE code = 'LAB-006'), 'Đỗ Lan Phương', 2, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'Trả sớm trước hạn'),
  ((SELECT id FROM equipments WHERE code = 'LAB-009'), 'Trịnh Quang Minh', 5, DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Trả đúng ngày hạn'),
  ((SELECT id FROM equipments WHERE code = 'LAB-014'), 'Nguyễn Thị Thu', 2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Mượn và trả trong ngày');

-- Nhom E: Da tra qua han nhung CHUA THU TIEN PHAT (2 phieu -> fines.status = 'unpaid')
INSERT INTO borrowings (equipment_id, borrower_name, quantity, borrowed_at, due_date, returned_at, note)
VALUES (
  (SELECT id FROM equipments WHERE code = 'LAB-011'),
  'Võ Thị Giang',
  2,
  DATE_SUB(CURDATE(), INTERVAL 12 DAY),
  DATE_SUB(CURDATE(), INTERVAL 5 DAY),
  DATE_SUB(CURDATE(), INTERVAL 1 DAY),
  'Trả muộn 4 ngày, chưa đóng phạt'
);
SET @borrowing_unpaid_1 = LAST_INSERT_ID();
INSERT INTO fines (borrowing_id, late_days, daily_rate, amount, status, paid_at)
SELECT
  id,
  DATEDIFF(returned_at, due_date),
  5000,
  DATEDIFF(returned_at, due_date) * quantity * 5000,
  'unpaid',
  NULL
FROM borrowings
WHERE id = @borrowing_unpaid_1;

INSERT INTO borrowings (equipment_id, borrower_name, quantity, borrowed_at, due_date, returned_at, note)
VALUES (
  (SELECT id FROM equipments WHERE code = 'LAB-013'),
  'Lý Hải Sơn',
  1,
  DATE_SUB(CURDATE(), INTERVAL 10 DAY),
  DATE_SUB(CURDATE(), INTERVAL 4 DAY),
  DATE_SUB(CURDATE(), INTERVAL 1 DAY),
  'Hẹn đóng phạt vào chiều nay'
);
SET @borrowing_unpaid_2 = LAST_INSERT_ID();
INSERT INTO fines (borrowing_id, late_days, daily_rate, amount, status, paid_at)
SELECT
  id,
  DATEDIFF(returned_at, due_date),
  5000,
  DATEDIFF(returned_at, due_date) * quantity * 5000,
  'unpaid',
  NULL
FROM borrowings
WHERE id = @borrowing_unpaid_2;

-- Nhom F: Da tra qua han va DA THU TIEN PHAT (2 phieu -> fines.status = 'paid')
INSERT INTO borrowings (equipment_id, borrower_name, quantity, borrowed_at, due_date, returned_at, note)
VALUES (
  (SELECT id FROM equipments WHERE code = 'LAB-001'),
  'Trương Minh Đức',
  1,
  DATE_SUB(CURDATE(), INTERVAL 15 DAY),
  DATE_SUB(CURDATE(), INTERVAL 8 DAY),
  DATE_SUB(CURDATE(), INTERVAL 2 DAY),
  'Đã hoàn tất trả thiết bị và nộp phạt'
);
SET @borrowing_paid_1 = LAST_INSERT_ID();
INSERT INTO fines (borrowing_id, late_days, daily_rate, amount, status, paid_at)
SELECT
  id,
  DATEDIFF(returned_at, due_date),
  5000,
  DATEDIFF(returned_at, due_date) * quantity * 5000,
  'paid',
  returned_at
FROM borrowings
WHERE id = @borrowing_paid_1;

INSERT INTO borrowings (equipment_id, borrower_name, quantity, borrowed_at, due_date, returned_at, note)
VALUES (
  (SELECT id FROM equipments WHERE code = 'LAB-004'),
  'Cao Thị Huyền',
  2,
  DATE_SUB(CURDATE(), INTERVAL 18 DAY),
  DATE_SUB(CURDATE(), INTERVAL 10 DAY),
  DATE_SUB(CURDATE(), INTERVAL 5 DAY),
  'Nộp phạt sau 1 ngày kể từ ngày trả'
);
SET @borrowing_paid_2 = LAST_INSERT_ID();
INSERT INTO fines (borrowing_id, late_days, daily_rate, amount, status, paid_at)
SELECT
  id,
  DATEDIFF(returned_at, due_date),
  5000,
  DATEDIFF(returned_at, due_date) * quantity * 5000,
  'paid',
  DATE_ADD(returned_at, INTERVAL 1 DAY)
FROM borrowings
WHERE id = @borrowing_paid_2;
