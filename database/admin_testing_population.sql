INSERT INTO unit (unit_ID, unit_name) 
VALUES (1, 'PPSU')
ON DUPLICATE KEY UPDATE unit_name = 'PPSU';


INSERT INTO role (role_ID, role_name)
VALUES (1, 'Admin')
ON DUPLICATE KEY UPDATE role_name = 'Admin';
 
INSERT INTO user (full_name, unit_ID) 
VALUES ('Jen Camille Dominguez', 1);

INSERT INTO account (user_ID, username, password_hash, role_ID) 
VALUES (1, 'admin_unit2025', '$2y$10$141uwWCyZkNSJvIFzubJ3OD3QCNscMqM25nZIsjawWqWbtPjAqFNG', 1);





----- NEW -----------

-- Ensure the unit exists
INSERT INTO unit (unit_ID, unit_name) 
VALUES (1, 'PPSU')
ON DUPLICATE KEY UPDATE unit_name = 'PPSU';

-- Ensure the role exists
INSERT INTO role (role_ID, role_name)
VALUES (1, 'Admin')
ON DUPLICATE KEY UPDATE role_name = 'Admin';

-- Insert or update the KLD email
INSERT INTO kld (kld_ID, kld_email)
VALUES (1, 'jmprepuya@kld.edu.ph')
ON DUPLICATE KEY UPDATE kld_email = 'jmprepuya@kld.edu.ph';

-- Insert or update the user linked to the KLD email
INSERT INTO user (user_ID, f_name, m_name, l_name, unit_ID, kld_ID, user_status)
VALUES (1, 'Jen', 'Camille', 'Dominguez', 1, 1, 'active')
ON DUPLICATE KEY UPDATE 
    f_name = 'Jen', 
    m_name = 'Camille', 
    l_name = 'Dominguez', 
    unit_ID = 1, 
    kld_ID = 1, 
    user_status = 'active';

-- Insert or update the account, referencing the user and role
INSERT INTO account (account_ID, user_ID, kld_ID, password_hash, role_ID)
VALUES (1, 1, 1, '$2y$10$141uwWCyZkNSJvIFzubJ3OD3QCNscMqM25nZIsjawWqWbtPjAqFNG', 1)
ON DUPLICATE KEY UPDATE 
    password_hash = '$2y$10$141uwWCyZkNSJvIFzubJ3OD3QCNscMqM25nZIsjawWqWbtPjAqFNG',
    role_ID = 1,
    kld_ID = 1;
