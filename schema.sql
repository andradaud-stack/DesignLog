-- ========================================================
-- DesignLog V2 - TiDB Serverless Database Schema
-- Compatible with MySQL 8.0 & TiDB Cloud Serverless
-- ========================================================

-- 1. Table: works (Catalog of Graphic Design Deliverables)
CREATE TABLE IF NOT EXISTS works (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  hotel_id VARCHAR(50) NOT NULL,
  period_id VARCHAR(50) NOT NULL,
  category_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'final',
  description TEXT,
  date_certainty VARCHAR(30) DEFAULT 'exact',
  event_date VARCHAR(30) NULL,
  event_month INT DEFAULT 10,
  event_year INT DEFAULT 2026,
  revision_count INT DEFAULT 1,
  dimensions VARCHAR(100) DEFAULT '1080 × 1080 px',
  color_space VARCHAR(50) DEFAULT 'RGB / DIGITAL',
  aspect_ratio VARCHAR(30) DEFAULT '1:1',
  media_type VARCHAR(30) DEFAULT 'image',
  video_uri TEXT NULL,
  duration VARCHAR(50) NULL,
  image_uri MEDIUMTEXT NOT NULL,
  draft_image_uri MEDIUMTEXT NULL,
  is_user_created BOOLEAN DEFAULT TRUE,
  created_at VARCHAR(50) NOT NULL,
  updated_at VARCHAR(50) NOT NULL,
  INDEX idx_hotel (hotel_id),
  INDEX idx_status (status),
  INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: tasks (Design Request Intake & Backlog Board)
CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(50) NOT NULL,
  requester_name VARCHAR(150) NOT NULL,
  requester_contact VARCHAR(150) NULL,
  hotel_id VARCHAR(50) NOT NULL,
  media_type VARCHAR(30) DEFAULT 'image',
  target_output VARCHAR(150) NOT NULL,
  target_dimensions VARCHAR(100) NULL,
  priority VARCHAR(30) NOT NULL DEFAULT 'urgent',
  status VARCHAR(50) NOT NULL DEFAULT 'backlog',
  deadline VARCHAR(30) NOT NULL,
  description TEXT,
  reference_url TEXT NULL,
  converted_work_id VARCHAR(100) NULL,
  completed_at VARCHAR(50) NULL,
  revisions JSON NULL,
  created_at VARCHAR(50) NOT NULL,
  updated_at VARCHAR(50) NOT NULL,
  INDEX idx_task_hotel (hotel_id),
  INDEX idx_task_status (status),
  INDEX idx_task_dept (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: user_profile (Scholar Profile Credentials)
CREATE TABLE IF NOT EXISTS user_profile (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  name VARCHAR(150) NOT NULL,
  role VARCHAR(150) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  faculty VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  cohort VARCHAR(150) NOT NULL,
  avatar MEDIUMTEXT NOT NULL,
  cluster VARCHAR(150) NOT NULL,
  specialization VARCHAR(150) NOT NULL,
  supervisor VARCHAR(150) NOT NULL,
  email VARCHAR(150) NULL,
  phone VARCHAR(50) NULL,
  bio TEXT NULL,
  updated_at VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: security_settings (Editor PIN Hash Anti-Tamper)
CREATE TABLE IF NOT EXISTS security_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  pin_hash VARCHAR(255) NULL,
  is_security_enabled BOOLEAN DEFAULT FALSE,
  updated_at VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Initial Profile (Aang / Andra Syahdan Daud)
INSERT INTO user_profile (
  id, name, role, institution, faculty, company, cohort, avatar, cluster, specialization, supervisor, email, phone, bio, updated_at
) VALUES (
  'default',
  'Andra Syahdan Daud',
  'Lead Design Intern',
  'Universitas Dian Nuswantoro (UDINUS)',
  'Fakultas Ilmu Komputer (FIK)',
  'PT Metropolitan Golden Management (Horison Hotels Group)',
  'Cohort II (Oktober–Desember 2026)',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBlyjWEqlIk1TcTRjFlJprzeDyaLtIPN2XEuNCq5LJX1Qyj31Wnbb7VVPhYBEfs74KPfbvTsmCg0_R6jxTn-48KgsxuVvD4jwatiDKWh7zk2JkmJ2yP_zoxfE_qn4CcI3ZO8aD8UMEnfiY5wAZy1OVaRNdbR3iRQP0Qjftrfxm6VFERMnidd2GqpxXewScyy7HdUc6UG4C1IWcr7I1kGmR67j5cNQ3cgQysw7qzF2molhVi3KAju8c',
  'Central Java Cluster',
  'Visual & Marcomm Designer',
  'Cluster Marcomm Manager',
  'andra.design@horisonhotels.com',
  '+62 812-3456-7890',
  'Residency scholar at PT Metropolitan Golden Management (Horison Hotels Group) in cooperation with Universitas Dian Nuswantoro (UDINUS), Faculty of Computer Science. Managing creative visual communications for Horison Inn Antawirya Semarang & Horison Resort Antawirya Jepara.',
  NOW()
) ON DUPLICATE KEY UPDATE updated_at = NOW();
