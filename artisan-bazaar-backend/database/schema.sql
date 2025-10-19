-- Artisan Bazaar - Database Schema (MySQL/SQLite compatible)
-- Tables: users, cache, jobs, products, orders, reviews

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NULL,
  email_verified_at DATETIME NULL,
  password VARCHAR(255) NULL,
  remember_token VARCHAR(100) NULL,
  created_at DATETIME NULL,
  updated_at DATETIME NULL
);

-- Cache
CREATE TABLE IF NOT EXISTS cache (
  `key` VARCHAR(255) PRIMARY KEY,
  `value` MEDIUMTEXT NOT NULL,
  `expiration` INT NOT NULL
);

-- Jobs
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  queue VARCHAR(255) NOT NULL,
  payload MEDIUMTEXT NOT NULL,
  attempts TINYINT NOT NULL,
  reserved_at INT NULL,
  available_at INT NOT NULL,
  created_at INT NOT NULL
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url VARCHAR(1024) NULL,
  category VARCHAR(255) NULL,
  seller_id INTEGER NULL,
  seller_name VARCHAR(255) NULL,
  stock INT NOT NULL DEFAULT 0,
  rating FLOAT NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  status VARCHAR(50) NULL,
  sku VARCHAR(255) NULL,
  created_at DATETIME NULL,
  updated_at DATETIME NULL
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name VARCHAR(255) NOT NULL,
  seller_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at DATETIME NULL,
  updated_at DATETIME NULL
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NULL,
  created_at DATETIME NULL,
  updated_at DATETIME NULL
);

-- Seed data (optional)
INSERT INTO users (name, email, role, password, created_at, updated_at)
SELECT 'Super Admin','admin@artisanbazaar.com','super_admin','$2y$10$examplehash',datetime('now'),datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='admin@artisanbazaar.com');

INSERT INTO users (name, email, role, password, created_at, updated_at)
SELECT 'Ahmed Al-Fassi','artisan.ahmed@example.com','seller','$2y$10$examplehash',datetime('now'),datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='artisan.ahmed@example.com');

INSERT INTO users (name, email, role, password, created_at, updated_at)
SELECT 'Sarah Johnson','customer.sarah@example.com','customer','$2y$10$examplehash',datetime('now'),datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='customer.sarah@example.com');

INSERT INTO products (name, description, price, image_url, category, seller_id, seller_name, stock, rating, review_count, status, created_at, updated_at)
VALUES
('Handwoven Basket','Traditional Moroccan design',45.00,'https://picsum.photos/300/200?random=1','Home Decor',3,'Ahmed Al-Fassi',15,4.5,23,'approved',datetime('now'),datetime('now')),
('Ceramic Vase','Hand-painted Tunisian pottery',68.00,'https://picsum.photos/300/200?random=2','Home Decor',3,'Ahmed Al-Fassi',8,4.7,31,'approved',datetime('now'),datetime('now')),
('Leather Bag','Hand-stitched Egyptian leather',120.00,'https://picsum.photos/300/200?random=3','Fashion',3,'Ahmed Al-Fassi',12,4.8,45,'approved',datetime('now'),datetime('now'))
ON CONFLICT DO NOTHING;

INSERT INTO orders (customer_name, seller_name, status, total, created_at, updated_at)
VALUES
('Sophie Martin','Atelier Lumière','delivered',115.18,datetime('now'),datetime('now')),
('Thomas Dubois','Céramiques du Sud','shipped',140.99,datetime('now'),datetime('now'))
ON CONFLICT DO NOTHING;



