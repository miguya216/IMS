-- IMS table August 14.

-- Create database
-- status (active, inactive) for soft deletion

CREATE DATABASE IF NOT EXISTS IMS;
USE IMS;

-- email sender
CREATE TABLE settings_preferences (
    setting_pref_ID TINYINT PRIMARY KEY,
    email_sender VARCHAR(255)
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

-- KLD creadentials
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
    is_borrowable ENUM('yes','no') DEFAULT 'no',
    asset_status ENUM('active', 'inactive', 'pending', 'borrowed') DEFAULT 'active',
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
    role_ID INT,
    qr_ID INT NULL,
    remember_token VARCHAR(255),
    token_expiry DATETIME,
    FOREIGN KEY (user_ID) REFERENCES user(user_ID),
    FOREIGN KEY (role_ID) REFERENCES role(role_ID),
    FOREIGN KEY (kld_ID) REFERENCES kld(kld_ID),
    FOREIGN KEY (qr_ID) REFERENCES qr_code(qr_ID)
);

CREATE TABLE forgot_pass_token (
    token_ID INT AUTO_INCREMENT PRIMARY KEY,
    kld_email VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    token_expiry DATE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (kld_email) REFERENCES kld(kld_email)
);

-- Notification
CREATE TABLE notification (
    notification_ID INT AUTO_INCREMENT PRIMARY KEY,
    recipient_account_ID INT NULL,             -- null if broadcast to all
    sender_account_ID INT NULL,                -- who triggered it (optional)
    title VARCHAR(150) NOT NULL,               -- short headline
    message TEXT NOT NULL,                     -- body content
    module VARCHAR(100) NULL,                  -- related module: 'asset', 'brs', 'ris', 'ptr', etc.
    reference_ID VARCHAR(50) NULL,             -- related record (e.g., brs_ID or ris_ID)
    is_read BOOLEAN DEFAULT FALSE,             -- read status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_account_ID) REFERENCES account(account_ID) ON DELETE CASCADE,
    FOREIGN KEY (sender_account_ID) REFERENCES account(account_ID) ON DELETE SET NULL
);

-- Logs table
CREATE TABLE activity_log (
    activity_ID INT AUTO_INCREMENT PRIMARY KEY,
    account_ID INT NULL,                -- who performed the action (nullable if system-generated)
    action_type VARCHAR(50) NOT NULL,   -- 'INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
    module VARCHAR(100) NOT NULL,       -- module/feature affected ('asset', 'account', 'request_form')
    record_ID INT NULL,                 -- ID of the affected record (if applicable)
    description TEXT NULL,              -- browser/device info (optional but useful)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_ID) REFERENCES account(account_ID)
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

CREATE TABLE reservation_borrowing (
    brs_ID INT AUTO_INCREMENT PRIMARY KEY,
    brs_no VARCHAR (50) UNIQUE NOT NULL,
    user_ID INT NOT NULL, -- who made the form
    date_of_use DATE NOT NULL,
    time_of_use TIME NOT NULL,
    date_of_return DATE NOT NULL,
    time_of_return TIME NOT NULL,
    purpose TEXT NOT NULL,
    brs_status ENUM('pending', 'inactive', 'completed', 'cancelled', 'issuing', 'on-going') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES user(user_ID)
);

CREATE TABLE brs_asset (
    brs_asset_ID INT AUTO_INCREMENT PRIMARY KEY,
    brs_ID INT NOT NULL,
    asset_ID INT NOT NULL,
    qty_brs INT NOT NULL,
    UOM_brs VARCHAR(50) NULL,
    is_available ENUM('yes','no') DEFAULT NULL,
    qty_issuance INT NULL,
    borrow_asset_remarks VARCHAR(50) NULL,
    return_asset_remarks VARCHAR(50) NULL,
    FOREIGN KEY (brs_ID) REFERENCES reservation_borrowing (brs_ID),
    FOREIGN KEY (asset_ID) REFERENCES asset (asset_ID)
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
    current_condition VARCHAR(50) NOT NULL,
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
    current_condition VARCHAR(50) NOT NULL,
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
    reference_type ENUM('IIR','RIS','BRS','PTR','CSV') NOT NULL,
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

CREATE TABLE room_assignation (
    room_assignation_ID INT AUTO_INCREMENT PRIMARY KEY,
    room_assignation_no VARCHAR(50) NOT NULL UNIQUE,
    from_room_ID INT NULL,
    to_room_ID INT NOT NULL,
    moved_by INT NOT NULL,
    moved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    log_status ENUM ('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (from_room_ID) REFERENCES room (room_ID),
    FOREIGN KEY (to_room_ID) REFERENCES room (room_ID),
    FOREIGN KEY (moved_by) REFERENCES user (user_ID)
);

CREATE TABLE room_a_asset (
    ra_asset_ID INT AUTO_INCREMENT PRIMARY KEY,
    room_assignation_ID INT NOT NULL,
    asset_ID INT NOT NULL,
    current_asset_conditon VARCHAR(50) NOT NULL,
    FOREIGN KEY (room_assignation_ID) REFERENCES room_assignation (room_assignation_ID),
    FOREIGN KEY (asset_ID) REFERENCES asset (asset_ID)
);
