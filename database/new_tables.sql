-- Create database
CREATE DATABASE IF NOT EXISTS IMS;
USE IMS;

-- Asset Type table
CREATE TABLE asset_type (
    asset_type_ID INT AUTO_INCREMENT PRIMARY KEY,
    asset_type VARCHAR(100) NOT NULL,
    asset_type_status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Brand table
CREATE TABLE brand (
    brand_ID INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL,
    asset_type_ID INT,
    brand_status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (asset_type_ID) REFERENCES asset_type(asset_type_ID)
);

-- Barcode table
CREATE TABLE barcode (
    barcode_ID INT AUTO_INCREMENT PRIMARY KEY,
    barcode_image_path VARCHAR(255) NOT NULL
);

-- QR Code table
CREATE TABLE qr_code (
    qr_ID INT AUTO_INCREMENT PRIMARY KEY,
    qr_image_path VARCHAR(255) NOT NULL
);

-- Role table
CREATE TABLE role (
    role_ID INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    role_status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Unit table
CREATE TABLE unit (
    unit_ID INT AUTO_INCREMENT PRIMARY KEY,
    unit_name VARCHAR(100) NOT NULL,
    unit_status ENUM('active', 'inactive') DEFAULT 'active'
);

-- KLD email table
CREATE TABLE kld (
    kld_ID VARCHAR(100) PRIMARY KEY NOT NULL,
    kld_email VARCHAR(100) UNIQUE NULL,
    kld_email_status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Logs table
CREATE TABLE logs (
    log_ID INT AUTO_INCREMENT PRIMARY KEY,
    log_content VARCHAR(100)
);

-- User table
CREATE TABLE user (
    user_ID INT AUTO_INCREMENT PRIMARY KEY,
    f_name VARCHAR(50) NOT NULL,
    m_name VARCHAR(50) NULL,
    l_name VARCHAR(50) NOT NULL,
    kld_ID VARCHAR(100) NULL,
    unit_ID INT,
    user_status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (kld_ID) REFERENCES kld(kld_ID),
    FOREIGN KEY (unit_ID) REFERENCES unit(unit_ID)
);

-- Asset table
CREATE TABLE asset (
    asset_ID INT AUTO_INCREMENT PRIMARY KEY,
    brand_ID INT,
    asset_type_ID INT,
    inventory_tag VARCHAR(100) UNIQUE NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    responsible_user_ID INT,
    barcode_ID INT NOT NULL,
    qr_ID INT NOT NULL,
    asset_status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (brand_ID) REFERENCES brand(brand_ID),
    FOREIGN KEY (asset_type_ID) REFERENCES asset_type(asset_type_ID),
    FOREIGN KEY (responsible_user_ID) REFERENCES user(user_ID),
    FOREIGN KEY (barcode_ID) REFERENCES barcode(barcode_ID),
    FOREIGN KEY (qr_ID) REFERENCES qr_code(qr_ID)
);


-- Account table
CREATE TABLE account (
    account_ID INT AUTO_INCREMENT PRIMARY KEY,
    user_ID INT,
    kld_ID VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    log_ID INT,
    role_ID INT,
    remember_token VARCHAR(255),
    token_expiry DATETIME,
    FOREIGN KEY (user_ID) REFERENCES user(user_ID),
    FOREIGN KEY (log_ID) REFERENCES logs(log_ID),
    FOREIGN KEY (role_ID) REFERENCES role(role_ID),
    FOREIGN KEY (kld_ID) REFERENCES kld(kld_ID)
);


-- Return table
CREATE TABLE returns (
    return_ID INT AUTO_INCREMENT PRIMARY KEY,
    asset_ID INT,
    returned_date DATE,
    reason_of_return TEXT,
    remarks TEXT,
    notes TEXT,
    FOREIGN KEY (asset_ID) REFERENCES asset(asset_ID)
);

-- Session table
CREATE TABLE session (
    session_ID INT AUTO_INCREMENT PRIMARY KEY,
    account_ID INT,
    login_timestamp DATETIME,
    logout_timestamp DATETIME,
    FOREIGN KEY (account_ID) REFERENCES account(account_ID)
);

-- Request table
CREATE TABLE request_form (
    request_ID INT AUTO_INCREMENT PRIMARY KEY,
    borrower_name VARCHAR(50) NOT NULL,
    kld_ID VARCHAR(100) NOT NULL,
    request_date DATE NOT NULL,
    request_time TIME NOT NULL,
    brand_ID INT NOT NULL,
    uom VARCHAR(50),
    quantity INT NOT NULL,
    unit_ID INT NOT NULL, 
    purpose TEXT NOT NULL,
    request_note TEXT,
    response_status ENUM('approved', 'rejected', 'pending') DEFAULT 'pending',
    request_status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (kld_ID) REFERENCES kld(kld_ID), 
    FOREIGN KEY (brand_ID) REFERENCES brand(brand_ID),
    FOREIGN KEY (unit_ID) REFERENCES unit(unit_ID)
);

-- Borrow table
CREATE TABLE borrow (
    borrow_ID INT AUTO_INCREMENT PRIMARY KEY,
    asset_ID INT,
    borrow_date DATE NOT NULL,
    borrow_time TIME NOT NULL,
    due_date DATE NOT NULL,
    due_time TIME NOT NULL,
    borrow_status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (asset_ID) REFERENCES asset(asset_ID)
);

-- Message table
CREATE TABLE message (
    message_ID INT AUTO_INCREMENT PRIMARY KEY,
    sender_ID INT NOT NULL,
    receiver_ID INT NOT NULL,              
    subject VARCHAR(255),                 
    message_text TEXT NOT NULL,
    timestamp_sent DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    message_status ENUM('active', 'archived') DEFAULT 'active',
    FOREIGN KEY (sender_ID) REFERENCES user(user_ID),
    FOREIGN KEY (receiver_ID) REFERENCES user(user_ID)
);
