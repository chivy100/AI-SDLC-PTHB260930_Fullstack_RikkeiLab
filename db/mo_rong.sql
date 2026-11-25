-- Rikkei Lab - Phan 2 (Huong A): Qua han va tien phat
-- Thu tu chay: schema.sql -> mo_rong.sql -> seed.sql

USE rikkei_lab;

SET time_zone = '+07:00';

-- Bang quan ly khoan phat da chot khi tra thiet bi tre han (quan he 1-1 tuy chon voi borrowings)
CREATE TABLE IF NOT EXISTS fines (
  id INT NOT NULL AUTO_INCREMENT,
  borrowing_id INT NOT NULL,
  late_days INT NOT NULL,
  daily_rate INT NOT NULL DEFAULT 5000,
  amount INT NOT NULL,
  status ENUM('unpaid', 'paid') NOT NULL DEFAULT 'unpaid',
  paid_at DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_fines PRIMARY KEY (id),
  CONSTRAINT uq_fines_borrowing_id UNIQUE (borrowing_id),
  CONSTRAINT fk_fines_borrowing
    FOREIGN KEY (borrowing_id) REFERENCES borrowings(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT chk_fines_late_days CHECK (late_days > 0),
  CONSTRAINT chk_fines_daily_rate CHECK (daily_rate = 5000),
  CONSTRAINT chk_fines_amount CHECK (amount > 0),
  CONSTRAINT chk_fines_paid_state CHECK (
    (status = 'unpaid' AND paid_at IS NULL)
    OR (status = 'paid' AND paid_at IS NOT NULL)
  ),
  INDEX idx_fines_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
