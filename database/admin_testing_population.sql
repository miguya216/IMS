INSERT INTO unit (unit_ID, unit_name) 
VALUES (1, 'Admin Unit')
ON DUPLICATE KEY UPDATE unit_name = 'Admin Unit';


INSERT INTO role (role_ID, role_name)
VALUES (1, 'Admin')
ON DUPLICATE KEY UPDATE role_name = 'Admin';
 
INSERT INTO user (full_name, unit_ID) 
VALUES ('Juan Miguel', 1);

INSERT INTO account (user_ID, username, password_hash, role_ID, status) 
VALUES (1, 'juanmiguel', '$2y$10$141uwWCyZkNSJvIFzubJ3OD3QCNscMqM25nZIsjawWqWbtPjAqFNG', 1, 'active');
