ALTER TABLE users ADD COLUMN status ENUM('active','inactive') DEFAULT 'active';
ALTER TABLE material_master ADD COLUMN isActive TINYINT(1) DEFAULT 1;

CREATE TABLE IF NOT EXISTS restock_requests (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  partNumber VARCHAR(255) NOT NULL,
  plant VARCHAR(50) NOT NULL,
  qtyRequested DECIMAL(18,3) NOT NULL,
  requestedByUserId BIGINT NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  approvedByUserId BIGINT NULL,
  approvedAt DATETIME NULL,
  freeStockIn DECIMAL(18,3) NULL,
  blockedStockIn DECIMAL(18,3) NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  userId BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  isRead TINYINT(1) DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
