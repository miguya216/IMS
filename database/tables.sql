-- IMS table September 14.

-- Create database
-- status (active, inactive) for soft deletion

CREATE DATABASE IF NOT EXISTS IMS;
USE IMS;


-- Logs table
CREATE TABLE logs (
    log_ID INT AUTO_INCREMENT PRIMARY KEY,
    log_content VARCHAR(100)
);

-- Sign up verification
CREATE TABLE email_verification (
  email VARCHAR(255),
  token VARCHAR(64) UNIQUE,
  expires_at DATETIME,
  is_used BOOLEAN DEFAULT FALSE
);

-- Asset Type table
CREATE TABLE asset_type (
    asset_type_ID INT AUTO_INCREMENT PRIMARY KEY,
    asset_type VARCHAR(100) NOT NULL UNIQUE,
    asset_type_status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Brand table
CREATE TABLE brand (
    brand_ID INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL UNIQUE,
    asset_type_ID INT,
    brand_status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (asset_type_ID) REFERENCES asset_type(asset_type_ID)
);

CREATE TABLE acquisition_source (
    a_source_ID INT AUTO_INCREMENT PRIMARY KEY,
    a_source_name VARCHAR(100) NOT NULL UNIQUE,
    a_source_status ENUM('active', 'inactive') DEFAULT 'active'
);

CREATE TABLE transfer_type (
    transfer_type_ID INT AUTO_INCREMENT PRIMARY KEY,
    transfer_type_name VARCHAR(100) NOT NULL UNIQUE,
    transfer_type_status ENUM('active', 'inactive') DEFAULT 'active'
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
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Unit table
CREATE TABLE unit (
    unit_ID INT AUTO_INCREMENT PRIMARY KEY,
    unit_name VARCHAR(100) NOT NULL UNIQUE,
    unit_status ENUM('active', 'inactive') DEFAULT 'active'
);

-- KLD email table
CREATE TABLE kld (
    kld_ID VARCHAR(100) PRIMARY KEY NOT NULL,
    kld_email VARCHAR(100) UNIQUE NULL,
    kld_email_status ENUM('active', 'inactive') DEFAULT 'active'
);

CREATE TABLE ris_tag_type (
    ris_tag_ID INT AUTO_INCREMENT PRIMARY KEY,
    ris_tag_name VARCHAR(50) UNIQUE NOT NULL,
    ris_tag_status ENUM('active', 'inactive') DEFAULT 'active'
);

-- room table 
CREATE TABLE room (
    room_ID INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR (20) UNIQUE NOT NULL,
    room_qr_value VARCHAR(100) NOT NULL,
    room_qr_ID INT NOT NULL,
    room_status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (room_qr_ID) REFERENCES qr_code (qr_ID)
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

CREATE TABLE asset_condition (
    asset_condition_ID INT AUTO_INCREMENT PRIMARY KEY,
    condition_name VARCHAR (50) NOT NULL,
    asset_condition_status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Asset table
CREATE TABLE asset (
    asset_ID INT AUTO_INCREMENT PRIMARY KEY,
    brand_ID INT,
    asset_type_ID INT,
    a_source_ID INT,
    transfer_type_ID INT NULL,
    kld_property_tag VARCHAR(100) UNIQUE NOT NULL,
    property_tag VARCHAR(100) UNIQUE NOT NULL,
    responsible_user_ID INT DEFAULT 1,
    barcode_ID INT NOT NULL,
    qr_ID INT NOT NULL,
    room_ID INT NULL,
    asset_condition_ID INT NOT NULL DEFAULT 1,
    date_acquired DATE NOT NULL,
    price_amount DECIMAL(10, 2) NOT NULL,
    serviceable_year YEAR NOT NULL,
    asset_status ENUM('active', 'inactive', 'borrowed') DEFAULT 'active',
    FOREIGN KEY (brand_ID) REFERENCES brand(brand_ID),
    FOREIGN KEY (asset_type_ID) REFERENCES asset_type(asset_type_ID),
    FOREIGN KEY (a_source_ID) REFERENCES acquisition_source (a_source_ID),
    FOREIGN KEY (transfer_type_ID) REFERENCES transfer_type (transfer_type_ID),
    FOREIGN KEY (responsible_user_ID) REFERENCES user(user_ID),
    FOREIGN KEY (barcode_ID) REFERENCES barcode(barcode_ID),
    FOREIGN KEY (qr_ID) REFERENCES qr_code(qr_ID),
    FOREIGN KEY (room_ID) REFERENCES room(room_ID),
    FOREIGN KEY (asset_condition_ID) REFERENCES asset_condition (asset_condition_ID)
);

CREATE TABLE consumable (
    consumable_ID INT AUTO_INCREMENT PRIMARY KEY,
    kld_property_tag VARCHAR(100) UNIQUE NOT NULL,
    consumable_name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    unit_of_measure VARCHAR(50) NOT NULL,
    total_quantity INT NOT NULL DEFAULT 0, 
    barcode_ID INT NOT NULL,
    qr_ID INT NOT NULL,
    price_amount DECIMAL(10,2) NULL,
    date_acquired DATE NULL,
    consumable_status ENUM('active', 'inactive') DEFAULT 'active',
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
    qr_ID INT NULL,
    borrow_score INT DEFAULT 0,
    borrow_behavior ENUM ('Good Borrower', 'Neutral', 'Late Returner') DEFAULT 'Neutral',
    remember_token VARCHAR(255),
    token_expiry DATETIME,
    FOREIGN KEY (user_ID) REFERENCES user(user_ID),
    FOREIGN KEY (log_ID) REFERENCES logs(log_ID),
    FOREIGN KEY (role_ID) REFERENCES role(role_ID),
    FOREIGN KEY (kld_ID) REFERENCES kld(kld_ID),
    FOREIGN KEY (qr_ID) REFERENCES qr_code(qr_ID)
);

CREATE TABLE requisition_and_issue (
    ris_ID INT AUTO_INCREMENT PRIMARY KEY,
    ris_no VARCHAR(50) NOT NULL UNIQUE,
    account_ID INT NOT NULL,
    ris_tag_ID INT NOT NULL,
    ris_status ENUM('pending', 'inactive', 'completed', 'cancelled', 'issuing') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_ID) REFERENCES account(account_ID),
    FOREIGN KEY (ris_tag_ID) REFERENCES ris_tag_type (ris_tag_ID)
);

CREATE TABLE ris_assets (
    ris_asset_ID INT AUTO_INCREMENT PRIMARY KEY,
    ris_ID INT NOT NULL,
    asset_property_no VARCHAR(50) NULL,
    asset_description VARCHAR(100) NOT NULL,
    UOM VARCHAR(50) NULL,
    quantity_requisition INT NOT NULL,
    quantity_issuance INT NULL,
    ris_remarks VARCHAR(50) NULL,
    FOREIGN KEY (ris_ID) REFERENCES requisition_and_issue(ris_ID)
);

CREATE TABLE ris_consumables (
    ris_consumable_ID INT AUTO_INCREMENT PRIMARY KEY,
    ris_ID INT NOT NULL,
    consumable_ID INT NOT NULL,
    consumable_description VARCHAR(255) NOT NULL,
    UOM VARCHAR(50) NULL,
    quantity_requisition INT NOT NULL,
    quantity_issuance INT NULL,
    ris_remarks VARCHAR(100) NULL,
    FOREIGN KEY (ris_ID) REFERENCES requisition_and_issue(ris_ID),
    FOREIGN KEY (consumable_ID) REFERENCES consumable(consumable_ID)
);

CREATE TABLE property_transfer (
    ptr_ID INT AUTO_INCREMENT PRIMARY KEY,
    ptr_no VARCHAR(50) NOT NULL UNIQUE,
    from_accounted_user_ID INT NOT NULL,
    to_accounted_user_ID INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ptr_status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (from_accounted_user_ID) REFERENCES user(user_ID),
    FOREIGN KEY (to_accounted_user_ID) REFERENCES user(user_ID)
);

CREATE TABLE ptr_asset (
    ptr_asset_ID INT AUTO_INCREMENT PRIMARY KEY,
    ptr_ID INT NOT NULL,
    asset_ID INT NOT NULL,
    FOREIGN KEY (ptr_ID) REFERENCES property_transfer (ptr_ID),
    FOREIGN KEY (asset_ID) REFERENCES asset (asset_ID)
);

CREATE TABLE inventory_inspection_report (
    iir_ID INT AUTO_INCREMENT PRIMARY KEY,
    iir_no VARCHAR(50) NOT NULL UNIQUE,
    user_ID INT NOT NULL,
    iir_status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES user(user_ID)
);

CREATE TABLE iir_asset (
    iir_asset_ID INT AUTO_INCREMENT PRIMARY KEY,
    iir_ID INT NOT NULL,
    asset_ID INT NOT NULL,
    quantity INT NOT NULL,
    total_cost DECIMAL(12,2) NOT NULL,
    accumulated_depreciation DECIMAL(12,2) NOT NULL,
    accumulated_impairment_losses DECIMAL(12,2) NOT NULL,
    carrying_amount DECIMAL(12,2) NOT NULL,
    sale INT NOT NULL,
    transfer INT NOT NULL,
    disposal INT NOT NULL,
    damage INT NOT NULL,
    others VARCHAR(50) NULL,
    FOREIGN KEY (iir_ID) REFERENCES inventory_inspection_report(iir_ID),
    FOREIGN KEY (asset_ID) REFERENCES asset(asset_ID)
);

-- Main property card per asset
CREATE TABLE property_card (
    property_card_ID INT AUTO_INCREMENT PRIMARY KEY,
    asset_ID INT NOT NULL UNIQUE,    
    FOREIGN KEY (asset_ID) REFERENCES asset(asset_ID)
);

-- History records for each property card
CREATE TABLE property_card_record (
    record_ID INT AUTO_INCREMENT PRIMARY KEY,
    property_card_ID INT NOT NULL,
    record_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reference_type ENUM('IIR','RIS','PTR','CSV') NOT NULL,
    reference_ID VARCHAR(50) NOT NULL,
    officer_user_ID INT NULL,
    price_amount DECIMAL(12,2) NOT NULL,
    remarks VARCHAR(255) NULL,
    FOREIGN KEY (property_card_ID) REFERENCES property_card(property_card_ID),
    FOREIGN KEY (officer_user_ID) REFERENCES user(user_ID)
);

CREATE TABLE stock_card (
    stock_card_ID INT AUTO_INCREMENT PRIMARY KEY,
    consumable_ID INT NOT NULL UNIQUE,
    FOREIGN KEY (consumable_ID) REFERENCES consumable(consumable_ID)
);

CREATE TABLE stock_card_record (
    record_ID INT AUTO_INCREMENT PRIMARY KEY,
    stock_card_ID INT NOT NULL,
    record_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reference_type ENUM('RIS','CSV') NOT NULL,
    reference_ID VARCHAR(50) NOT NULL,
    officer_user_ID INT NULL, -- sino nag-authorize
    quantity_in INT NOT NULL, -- pumasok (delivery)
    quantity_out INT NOT NULL, -- lumabas (issued)
    balance INT NOT NULL,       -- running balance
    remarks VARCHAR(255) NULL,
    FOREIGN KEY (stock_card_ID) REFERENCES stock_card(stock_card_ID),
    FOREIGN KEY (officer_user_ID) REFERENCES user(user_ID)
);

CREATE TABLE disposal (
    disposal_id INT AUTO_INCREMENT PRIMARY KEY,
    disposal_no VARCHAR(50) NOT NULL UNIQUE,
    user_ID INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    disposal_status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (user_ID) REFERENCES user (user_ID)
);

CREATE TABLE disposal_asset (
    disposal_asset_id INT AUTO_INCREMENT PRIMARY KEY,
    disposal_id INT NOT NULL,
    asset_ID INT NOT NULL,
    FOREIGN KEY (disposal_id) REFERENCES disposal(disposal_id),
    FOREIGN KEY (asset_ID) REFERENCES asset (asset_ID)
);

-- Request table
-- request_date = when the request issued
-- needed_date = when it is needed the item
-- expected_due_date = when they will return the item
CREATE TABLE request_form (
    request_ID INT AUTO_INCREMENT PRIMARY KEY,
    account_ID INT,
    request_date DATE NOT NULL,
    request_time TIME NOT NULL,
    needed_date DATE NOT NULL,
    needed_time TIME NOT NULL,
    expected_due_date DATE NOT NULL,
    expected_due_time TIME NOT NULL,
    purpose TEXT NOT NULL,
    response_status ENUM('approved', 'rejected', 'pending', 'cancelled') DEFAULT 'pending',
    request_status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (account_ID) REFERENCES account(account_ID)
);


CREATE TABLE request_items (
    request_item_ID INT AUTO_INCREMENT PRIMARY KEY,
    request_ID INT NOT NULL,
    asset_type_ID INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (request_ID) REFERENCES request_form(request_ID),
    FOREIGN KEY (asset_type_ID) REFERENCES asset_type(asset_type_ID)
);
-- token_expiry == needed_time in borrowing process
CREATE TABLE borrow_session (
    br_session_ID INT AUTO_INCREMENT PRIMARY KEY, 
    request_ID INT NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    token_expiry DATETIME NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (request_ID) REFERENCES request_form(request_ID)
);


CREATE TABLE borrowed_items (
    borrowed_item_ID INT AUTO_INCREMENT PRIMARY KEY,
    request_ID INT NOT NULL,
    asset_ID INT NOT NULL,
    returned_date DATE NULL,
    borrow_status ENUM('in use', 'inactive', 'returned') DEFAULT 'in use',
    FOREIGN KEY (request_ID) REFERENCES request_form(request_ID),
    FOREIGN KEY (asset_ID) REFERENCES asset(asset_ID)
);

CREATE TABLE request_log (
    log_ID INT AUTO_INCREMENT PRIMARY KEY,
    request_ID INT NOT NULL,
    action_by INT NOT NULL, -- account_ID of the admin/custodian/borrower who took action
    action_type ENUM('created', 'approved', 'rejected', 'cancelled', 'borrowed', 'returned') NOT NULL,
    action_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT NULL,
    FOREIGN KEY (request_ID) REFERENCES request_form(request_ID),
    FOREIGN KEY (action_by) REFERENCES account(account_ID)
);