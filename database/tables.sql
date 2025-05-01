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
    FOREIGN KEY (asset_type_ID) REFERENCES asset_type (asset_type_ID)
);

CREATE TABLE barcode (
    barcode_image_path_ID INT AUTO_INCREMENT PRIMARY KEY,
    barcode_image_path VARCHAR(255) NOT NULL
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

-- User table
CREATE TABLE user (
    user_ID INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    unit_ID INT,
    user_status ENUM('active', 'inactive') DEFAULT 'active',
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
    barcode_image_path_ID INT NOT NULL,
    asset_status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (brand_ID) REFERENCES brand(brand_ID),
    FOREIGN KEY (asset_type_ID) REFERENCES asset_type(asset_type_ID),
    FOREIGN KEY (responsible_user_ID) REFERENCES user(user_ID),
    FOREIGN KEY (barcode_image_path_ID) REFERENCES barcode(barcode_image_path_ID)
);

-- Account table
CREATE TABLE account (
    account_ID INT AUTO_INCREMENT PRIMARY KEY,
    user_ID INT,
    username VARCHAR(50) UNIQUE NULL,
    password_hash VARCHAR(255) NULL,
    role_ID INT NULL,
    remember_token VARCHAR(255),
    token_expiry DATETIME,
    FOREIGN KEY (user_ID) REFERENCES user(user_ID),
    FOREIGN KEY (role_ID) REFERENCES role(role_ID)
);


-- Return table
CREATE TABLE return_table (
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
    student_ID VARCHAR(50) NOT NULL,
    request_date DATE NOT NULL,
    request_time TIME NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    uom VARCHAR(50), 
    quantity INT NOT NULL,
    unit_ID INT, 
    purpose TEXT,
    request_note TEXT,
    FOREIGN KEY (unit_ID) REFERENCES unit(unit_ID)
);
