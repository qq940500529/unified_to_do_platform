-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建待办事项表
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  system_source VARCHAR(255),
  due_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建报告表
CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  report_type ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_status ON todos(status);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_type ON reports(report_type);

-- 插入初始用户
INSERT INTO users (username, password_hash, email)
VALUES 
  ('admin', '$2b$10$examplehash', 'admin@example.com'),
  ('user1', '$2b$10$examplehash', 'user1@example.com');

-- 插入初始待办事项
INSERT INTO todos (user_id, title, description, status, priority, system_source, due_date)
VALUES
  (1, '完成项目架构设计', '设计系统整体架构', 'completed', 'high', '内部系统', NOW()),
  (1, '编写API文档', '完成所有API接口文档', 'in_progress', 'medium', '内部系统', NOW() + INTERVAL 3 DAY),
  (2, '测试用户注册功能', '测试新用户注册流程', 'pending', 'low', '测试系统', NOW() + INTERVAL 1 DAY);

-- 插入初始报告
INSERT INTO reports (user_id, report_type, start_date, end_date, data)
VALUES
  (1, 'daily', NOW() - INTERVAL 1 DAY, NOW(), '{"total": 5, "completed": 2, "in_progress": 2, "pending": 1}'),
  (2, 'weekly', NOW() - INTERVAL 7 DAY, NOW(), '{"total": 10, "completed": 5, "in_progress": 3, "pending": 2}');
