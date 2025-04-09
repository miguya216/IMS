-- Populate asset_type
INSERT INTO asset_type (asset_type) VALUES
('Laptop'),
('Monitor'),
('Printer'),
('Router');

-- Populate brand
INSERT INTO brand (brand_name) VALUES
('Dell'),
('HP'),
('Canon'),
('Cisco');

-- Populate unit
INSERT INTO unit (unit_name) VALUES
('IT Department'),
('Finance Department'),
('HR Department');

-- Populate user
INSERT INTO user (full_name, unit_ID) VALUES
('Alice Johnson', 1),
('Bob Smith', 2),
('Carol Lee', 3);

-- Populate role
INSERT INTO role (role_name) VALUES
('Admin'),
('Manager'),
('Staff');

-- Populate account
INSERT INTO account (user_ID, username, password_hash, role_ID, status) VALUES
(1, 'alicej', 'hashed_password1', 1, 'active'),
(2, 'bobsmith', 'hashed_password2', 2, 'active'),
(3, 'caroll', 'hashed_password3', 3, 'inactive');

-- Populate asset
INSERT INTO asset (brand_ID, asset_type_ID, inventory_tag, serial_number, responsible_user_ID) VALUES
(1, 1, 'INV-1001', 'SN123456', 1),
(2, 2, 'INV-1002', 'SN234567', 2),
(3, 3, 'INV-1003', 'SN345678', 3);

-- Populate return_table
INSERT INTO return_table (asset_ID, returned_date, reason_of_return, remarks, notes) VALUES
(1, '2024-12-01', 'Device malfunctioning', 'Sent for repair', 'Needs motherboard replacement'),
(2, '2025-01-15', 'User transferred', 'Reassigned', 'Ready for redeployment');
