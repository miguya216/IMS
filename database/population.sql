INSERT INTO asset_type (asset_type) VALUES
('Laptop'), ('Printer'), ('Monitor'), ('Projector'), ('Router');

INSERT INTO brand (brand_name, asset_type_ID) VALUES
('Dell', 1),
('HP', 2),
('Canon', 2),
('Asus', 1),
('Lenovo', 1),
('Epson', 2),
('LG', 3),
('Acer', 1),
('BenQ', 4),
('TP-Link', 5);

INSERT INTO unit (unit_name) VALUES
('IT Department'),
('Finance'),
('Human Resources'),
('Logistics'),
('Maintenance');

INSERT INTO role (role_name) VALUES
('Admin'),
('Manager'),
('Staff'),
('Clerk');

INSERT INTO user (full_name, unit_ID) VALUES
('Alice Johnson', 1), ('Bob Smith', 2), ('Carol Lee', 3), ('David Martinez', 4), ('Emily Clark', 5),
('Franklin Torres', 1), ('Grace Lopez', 2), ('Henry Wright', 3), ('Isabel Cruz', 4), ('Jackie Chen', 5),
('Kevin Reyes', 1), ('Lana Delos', 2), ('Martin Gomez', 3), ('Nina Ocampo', 4), ('Oscar Medina', 5),
('Paula Enriquez', 1), ('Quincy Navarro', 2), ('Rachel Uy', 3), ('Sam Tan', 4), ('Trisha Lim', 5);

INSERT INTO account (user_ID, username, password_hash, role_ID) VALUES
(1, 'alicej', 'hashed1', 1), (2, 'bobsmith', 'hashed2', 2), (3, 'caroll', 'hashed3', 3),
(4, 'davidm', 'hashed4', 2), (5, 'emilyc', 'hashed5', 3), (6, 'franktorres', 'hashed6', 3),
(7, 'gracel', 'hashed7', 2), (8, 'henryw', 'hashed8', 4), (9, 'isacruz', 'hashed9', 3),
(10, 'jackiec', 'hashed10', 2), (11, 'kevinr', 'hashed11', 3), (12, 'lanad', 'hashed12', 2),
(13, 'marting', 'hashed13', 4), (14, 'ninao', 'hashed14', 3), (15, 'oscarmed', 'hashed15', 3),
(16, 'paulae', 'hashed16', 2), (17, 'quincyn', 'hashed17', 3), (18, 'rachelu', 'hashed18', 4),
(19, 'samtan', 'hashed19', 3), (20, 'trishal', 'hashed20', 2);

INSERT INTO barcode (barcode_image_path) VALUES
('barcodes/INV-1001.png'), ('barcodes/INV-1002.png'), ('barcodes/INV-1003.png'), ('barcodes/INV-1004.png'), ('barcodes/INV-1005.png'),
('barcodes/INV-1006.png'), ('barcodes/INV-1007.png'), ('barcodes/INV-1008.png'), ('barcodes/INV-1009.png'), ('barcodes/INV-1010.png'),
('barcodes/INV-1011.png'), ('barcodes/INV-1012.png'), ('barcodes/INV-1013.png'), ('barcodes/INV-1014.png'), ('barcodes/INV-1015.png'),
('barcodes/INV-1016.png'), ('barcodes/INV-1017.png'), ('barcodes/INV-1018.png'), ('barcodes/INV-1019.png'), ('barcodes/INV-1020.png');

INSERT INTO asset (brand_ID, asset_type_ID, inventory_tag, serial_number, responsible_user_ID, barcode_image_path_ID) VALUES
(1, 1, 'INV-1001', 'DL-SN-001', 1, 1),
(2, 2, 'INV-1002', 'HP-SN-002', 2, 2),
(3, 2, 'INV-1003', 'CN-SN-003', 3, 3),
(4, 1, 'INV-1004', 'AS-SN-004', 4, 4),
(5, 1, 'INV-1005', 'LN-SN-005', 5, 5),
(6, 2, 'INV-1006', 'EP-SN-006', 6, 6),
(7, 3, 'INV-1007', 'LG-SN-007', 7, 7),
(8, 1, 'INV-1008', 'AC-SN-008', 8, 8),
(9, 4, 'INV-1009', 'BQ-SN-009', 9, 9),
(10, 5, 'INV-1010', 'TPL-SN-010', 10, 10),
(1, 1, 'INV-1011', 'DL-SN-011', 11, 11),
(2, 2, 'INV-1012', 'HP-SN-012', 12, 12),
(3, 2, 'INV-1013', 'CN-SN-013', 13, 13),
(4, 1, 'INV-1014', 'AS-SN-014', 14, 14),
(5, 1, 'INV-1015', 'LN-SN-015', 15, 15),
(6, 2, 'INV-1016', 'EP-SN-016', 16, 16),
(7, 3, 'INV-1017', 'LG-SN-017', 17, 17),
(8, 1, 'INV-1018', 'AC-SN-018', 18, 18),
(9, 4, 'INV-1019', 'BQ-SN-019', 19, 19),
(10, 5, 'INV-1020', 'TPL-SN-020', 20, 20);

