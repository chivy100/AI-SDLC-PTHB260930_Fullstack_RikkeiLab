-- Rikkei Lab - Phan 1: Co so du lieu cot loi
-- Thu tu chay: schema.sql -> mo_rong.sql -> seed.sql

CREATE DATABASE IF NOT EXISTS rikkei_lab
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rikkei_lab;

SET time_zone = '+07:00';

-- Bang thiet bi
CREATE TABLE IF NOT EXISTS equipments (
  id INT NOT NULL AUTO_INCREMENT,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(150) NOT NULL,
  category ENUM('laptop', 'man_hinh', 'mach_dien_tu', 'phu_kien') NOT NULL,
  total_quantity INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_equipments PRIMARY KEY (id),
  CONSTRAINT uq_equipments_code UNIQUE (code),
  CONSTRAINT chk_equipments_code_not_blank CHECK (CHAR_LENGTH(TRIM(code)) > 0),
  CONSTRAINT chk_equipments_name_not_blank CHECK (CHAR_LENGTH(TRIM(name)) > 0),
  CONSTRAINT chk_equipments_total_qty CHECK (total_quantity >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bang phieu muon
CREATE TABLE IF NOT EXISTS borrowings (
  id INT NOT NULL AUTO_INCREMENT,
  equipment_id INT NOT NULL,
  borrower_name VARCHAR(120) NOT NULL,
  quantity INT NOT NULL,
  borrowed_at DATE NOT NULL,
  due_date DATE NOT NULL,
  returned_at DATE NULL,
  note VARCHAR(255) NULL,
  CONSTRAINT pk_borrowings PRIMARY KEY (id),
  CONSTRAINT fk_borrowings_equipment
    FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT chk_borrowings_borrower_not_blank CHECK (CHAR_LENGTH(TRIM(borrower_name)) > 0),
  CONSTRAINT chk_borrowings_qty CHECK (quantity > 0),
  CONSTRAINT chk_borrowings_due_date CHECK (due_date >= borrowed_at),
  CONSTRAINT chk_borrowings_returned_date CHECK (returned_at IS NULL OR returned_at >= borrowed_at),
  INDEX idx_borrowings_equipment_returned (equipment_id, returned_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
