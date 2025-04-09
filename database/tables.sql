-- Create database
CREATE DATABASE IF NOT EXISTS IMS;
USE IMS;

-- Asset Type table
CREATE TABLE asset_type (
    asset_type_ID INT AUTO_INCREMENT PRIMARY KEY,
    asset_type VARCHAR(100) NOT NULL
);

-- Brand table
CREATE TABLE brand (
    brand_ID INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL
);

-- Unit table
CREATE TABLE unit (
    unit_ID INT AUTO_INCREMENT PRIMARY KEY,
    unit_name VARCHAR(100) NOT NULL
);

-- User table
CREATE TABLE user (
    user_ID INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    unit_ID INT,
    FOREIGN KEY (unit_ID) REFERENCES unit(unit_ID)
);

-- Asset table
CREATE TABLE asset (
    asset_ID INT AUTO_INCREMENT PRIMARY KEY,
    brand_ID INT,
    asset_type_ID INT,
    inventory_tag VARCHAR(100),
    serial_number VARCHAR(100),
    responsible_user_ID INT,
    FOREIGN KEY (brand_ID) REFERENCES brand(brand_ID),
    FOREIGN KEY (asset_type_ID) REFERENCES asset_type(asset_type_ID),
    FOREIGN KEY (responsible_user_ID) REFERENCES user(user_ID)
);

-- Role table
CREATE TABLE role (
    role_ID INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

-- Account table
CREATE TABLE account (
    account_ID INT AUTO_INCREMENT PRIMARY KEY,
    user_ID INT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_ID INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
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
