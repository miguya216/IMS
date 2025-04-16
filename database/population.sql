-- Populate asset_type (20)
INSERT INTO asset_type (asset_type) VALUES 
('Laptop'), ('Projector'), ('Printer'), ('Router'), ('Switch'), 
('Monitor'), ('Keyboard'), ('Mouse'), ('Tablet'), ('Smartphone'),
('UPS'), ('Webcam'), ('Scanner'), ('Server'), ('Speaker'),
('Microphone'), ('HDMI Cable'), ('Ethernet Cable'), ('External HDD'), ('SSD');

-- Populate brand (20)
INSERT INTO brand (brand_name) VALUES 
('Dell'), ('HP'), ('Canon'), ('Cisco'), ('Logitech'),
('Asus'), ('Acer'), ('Apple'), ('Samsung'), ('Lenovo'),
('Epson'), ('Brother'), ('MSI'), ('Sony'), ('Xiaomi'),
('Huawei'), ('TP-Link'), ('Toshiba'), ('Intel'), ('AMD');

-- Populate unit (20)
INSERT INTO unit (unit_name) VALUES 
('IT Department'), ('Library'), ('Admin Office'), ('Registrar'), ('Accounting'),
('Engineering'), ('Business Office'), ('Science Lab'), ('HR Office'), ('Security'),
('Clinic'), ('Student Affairs'), ('Maintenance'), ('Faculty Room A'), ('Faculty Room B'),
('AV Room'), ('Gym'), ('Canteen'), ('Guidance Office'), ('Records Section');

-- Populate barcode (20)
INSERT INTO barcode (barcode_image_path) VALUES 
('barcodes/item01.png'), ('barcodes/item02.png'), ('barcodes/item03.png'), ('barcodes/item04.png'), ('barcodes/item05.png'),
('barcodes/item06.png'), ('barcodes/item07.png'), ('barcodes/item08.png'), ('barcodes/item09.png'), ('barcodes/item10.png'),
('barcodes/item11.png'), ('barcodes/item12.png'), ('barcodes/item13.png'), ('barcodes/item14.png'), ('barcodes/item15.png'),
('barcodes/item16.png'), ('barcodes/item17.png'), ('barcodes/item18.png'), ('barcodes/item19.png'), ('barcodes/item20.png');

-- Populate role (20)
INSERT INTO role (role_name) VALUES 
('Admin'), ('Staff'), ('Student'), ('Teacher'), ('Technician'),
('Librarian'), ('Clerk'), ('Registrar'), ('Cashier'), ('Instructor'),
('Janitor'), ('Security Guard'), ('Nurse'), ('Principal'), ('Assistant'),
('Maintenance Head'), ('Coach'), ('Canteen Staff'), ('Counselor'), ('Archivist');

-- Populate user (20)
INSERT INTO user (full_name, unit_ID) VALUES 
('Juan Miguel', 1), ('Maria Santos', 2), ('Pedro Reyes', 3),
('Ana Lopez', 4), ('Carlos Tan', 5), ('Jenny Cruz', 6),
('Lito Garcia', 7), ('Carmen Reyes', 8), ('Mark Dela Cruz', 9),
('Sandra Lim', 10), ('Jose Ramirez', 11), ('Nicole Uy', 12),
('Felix Javier', 13), ('Rhona Dizon', 14), ('Arnold Sy', 15),
('Greta Yu', 16), ('Daniel Co', 17), ('Monica Chua', 18),
('Leonard Ong', 19), ('Paula Aquino', 20);

-- Populate account (3 only)
INSERT INTO account (user_ID, username, password_hash, role_ID, status) VALUES 
(1, 'juanmiguel', '$2y$10$141uwWCyZkNSJvIFzubJ3OD3QCNscMqM25nZIsjawWqWbtPjAqFNG', 1, 'active'), -- password123
(2, 'mariasantos', '$2y$10$G5j0GZKny3oB4JcHbeH8/uz51T3ECXTss6qLhxT3NqFrq8x1pXb4C', 2, 'active'),
(3, 'pedroreyes', '$2y$10$99jHc1z8FtjvnB6JEMLBQuY6GE6N0K43XAJMXMIRJro5cHXZlxdnG', 3, 'inactive');

-- Populate asset (20)
INSERT INTO asset (brand_ID, asset_type_ID, inventory_tag, serial_number, responsible_user_ID, barcode_image_path_ID, asset_status) VALUES 
(1, 1, 'TAG-001', 'SN1001', 1, 1, 'active'),
(2, 2, 'TAG-002', 'SN1002', 2, 2, 'active'),
(3, 3, 'TAG-003', 'SN1003', 3, 3, 'inactive'),
(4, 4, 'TAG-004', 'SN1004', 4, 4, 'active'),
(5, 5, 'TAG-005', 'SN1005', 5, 5, 'active'),
(6, 6, 'TAG-006', 'SN1006', 6, 6, 'inactive'),
(7, 7, 'TAG-007', 'SN1007', 7, 7, 'active'),
(8, 8, 'TAG-008', 'SN1008', 8, 8, 'active'),
(9, 9, 'TAG-009', 'SN1009', 9, 9, 'active'),
(10, 10, 'TAG-010', 'SN1010', 10, 10, 'inactive'),
(11, 11, 'TAG-011', 'SN1011', 11, 11, 'active'),
(12, 12, 'TAG-012', 'SN1012', 12, 12, 'active'),
(13, 13, 'TAG-013', 'SN1013', 13, 13, 'active'),
(14, 14, 'TAG-014', 'SN1014', 14, 14, 'inactive'),
(15, 15, 'TAG-015', 'SN1015', 15, 15, 'active'),
(16, 16, 'TAG-016', 'SN1016', 16, 16, 'active'),
(17, 17, 'TAG-017', 'SN1017', 17, 17, 'inactive'),
(18, 18, 'TAG-018', 'SN1018', 18, 18, 'active'),
(19, 19, 'TAG-019', 'SN1019', 19, 19, 'active'),
(20, 20, 'TAG-020', 'SN1020', 20, 20, 'active');

-- Populate return_table (20)
INSERT INTO return_table (asset_ID, returned_date, reason_of_return, remarks, notes) VALUES 
(1, '2025-04-01', 'Damaged keyboard', 'Needs replacement', 'Check warranty.'),
(2, '2025-04-02', 'Overheating', 'Under maintenance', 'Fans need cleaning.'),
(3, '2025-04-03', 'Cracked screen', 'Replace screen', 'Dropped by user.'),
(4, '2025-04-04', 'Software issue', 'Reformat needed', 'Malware detected.'),
(5, '2025-04-05', 'Battery problem', 'Won’t charge', 'Old battery.'),
(6, '2025-04-06', 'Port issue', 'USB not working', 'Check connections.'),
(7, '2025-04-07', 'Loose parts', 'Screws missing', 'Needs technician.'),
(8, '2025-04-08', 'Defective speaker', 'No sound', 'Replace speaker.'),
(9, '2025-04-09', 'Camera not working', 'Blurry images', 'Clean lens.'),
(10, '2025-04-10', 'Bluetooth issue', 'Cannot connect', 'Check drivers.'),
(11, '2025-04-11', 'Dead pixels', 'Minor issue', 'Observe further.'),
(12, '2025-04-12', 'Faulty RAM', 'System crash', 'Replace RAM.'),
(13, '2025-04-13', 'Hard disk failure', 'Won’t boot', 'Recover data.'),
(14, '2025-04-14', 'No internet', 'WiFi card issue', 'Needs replacement.'),
(15, '2025-04-15', 'CD drive stuck', 'Old model', 'Not usable.'),
(16, '2025-04-16', 'Hinges broken', 'Physical damage', 'Replace hinges.'),
(17, '2025-04-17', 'Touchpad not working', 'Glitchy', 'Update drivers.'),
(18, '2025-04-18', 'Crashing apps', 'Overloaded', 'Increase memory.'),
(19, '2025-04-19', 'Overheating', 'Fan error', 'Check sensors.'),
(20, '2025-04-20', 'Missing keycaps', 'Typing problem', 'Replace keyboard.');

-- Populate session (will be populated during real login)

-- Populate request_form (20)
INSERT INTO request_form (student_ID, request_date, request_time, item_name, uom, quantity, unit_ID, purpose, request_note) VALUES 
('S001', '2025-04-01', '08:30:00', 'Extension Cord', 'pcs', 2, 1, 'Group project', 'For PC setup'),
('S002', '2025-04-02', '09:00:00', 'HDMI Cable', 'pcs', 1, 2, 'Presentation', 'Projector connection'),
('S003', '2025-04-03', '10:00:00', 'Whiteboard Marker', 'box', 1, 3, 'Classroom use', 'Requested by prof'),
('S004', '2025-04-04', '11:15:00', 'Mouse', 'pcs', 3, 4, 'Computer lab', 'Broken old mice'),
('S005', '2025-04-05', '13:00:00', 'Keyboard', 'pcs', 2, 5, 'Replacement', 'Malfunctioning unit'),
('S006', '2025-04-06', '14:20:00', 'Ethernet Cable', 'm', 10, 6, 'Internet setup', 'New room'),
('S007', '2025-04-07', '15:30:00', 'Microphone', 'pcs', 1, 7, 'Event', 'Seminar'),
('S008', '2025-04-08', '08:00:00', 'Webcam', 'pcs', 2, 8, 'Online class', 'Low quality cams'),
('S009', '2025-04-09', '09:45:00', 'Printer Ink', 'box', 1, 9, 'Printing', 'Out of stock'),
('S010', '2025-04-10', '10:30:00', 'UPS', 'pcs', 1, 10, 'Backup power', 'Frequent brownouts'),
('S011', '2025-04-11', '11:00:00', 'Scanner', 'pcs', 1, 11, 'Document archive', 'Old scanner died'),
('S012', '2025-04-12', '12:15:00', 'Tablet', 'pcs', 3, 12, 'Mobile research', 'Request from faculty'),
('S013', '2025-04-13', '13:45:00', 'External HDD', 'tb', 1, 13, 'Backup', 'Storage upgrade'),
('S014', '2025-04-14', '14:00:00', 'Laptop', 'pcs', 5, 14, 'Student use', 'Lab upgrade'),
('S015', '2025-04-15', '15:30:00', 'Smartphone', 'pcs', 2, 15, 'Testing apps', 'Software dev course'),
('S016', '2025-04-16', '16:00:00', 'SSD', 'pcs', 2, 16, 'PC upgrade', 'Slow systems'),
('S017', '2025-04-17', '08:45:00', 'Router', 'pcs', 1, 17, 'Network setup', 'Dead zone fix'),
('S018', '2025-04-18', '09:30:00', 'Switch', 'pcs', 2, 18, 'New computers', 'Network split'),
('S019', '2025-04-19', '10:15:00', 'Speaker', 'pcs', 2, 19, 'Audio needs', 'Bad speaker quality'),
('S020', '2025-04-20', '11:45:00', 'Camera Lens Cleaner', 'kit', 1, 20, 'Maintenance', 'Blurry lens issue');
