-- insert/update pattern:
INSERT INTO settings_preferences (setting_pref_ID, email_sender)
VALUES (1, 'repuya.juanmiguel.kld@gmail.com')
ON DUPLICATE KEY UPDATE email_sender = VALUES(email_sender);

-- Ensure the unit exists
INSERT INTO unit (unit_ID, unit_name) 
VALUES (1, 'PPSU')
ON DUPLICATE KEY UPDATE unit_name = 'PPSU';

-- Ensure the roles exist
INSERT INTO role (role_ID, role_name)
VALUES 
    (1, 'Super-Admin'), 
    (2, 'Admin'), 
    (3, 'Custodian')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

-- Ensure asset conditions exist
INSERT INTO asset_condition (asset_condition_ID, condition_name)
VALUES 
    (1, 'Good Condition'),
    (2, 'For repair'),
    (3, 'For disposal')
ON DUPLICATE KEY UPDATE 
    condition_name = VALUES(condition_name);

INSERT INTO ris_tag_type (ris_tag_ID, ris_tag_name)
VALUES 
    (1, 'Repair'),
    (2, 'Purchase')
ON DUPLICATE KEY UPDATE
    ris_tag_name = VALUEs(ris_tag_name);

INSERT INTO transfer_type (transfer_type_ID, transfer_type_name)
VALUES 
    (1, 'Donation'), 
    (2, 'Reassignment'), 
    (3, 'Return'),
    (4, 'Relocate')
ON DUPLICATE KEY UPDATE transfer_type_name = VALUES(transfer_type_name);

-- Insert or update the KLD email (kld_ID is VARCHAR, not INT)
INSERT INTO kld (kld_ID, kld_email)
VALUES ('PPSU-ADMIN-001', 'gpevangelista@kld.edu.ph')
ON DUPLICATE KEY UPDATE kld_email = 'gpevangelista@kld.edu.ph';

-- Insert or update the user linked to the KLD email
INSERT INTO user (user_ID, f_name, m_name, l_name, unit_ID, kld_ID, user_status)
VALUES (1, 'Grace', 'Paulme', 'Evangelista', 1, 'PPSU-ADMIN-001', 'active')
ON DUPLICATE KEY UPDATE 
    f_name = VALUES(f_name), 
    m_name = VALUES(m_name), 
    l_name = VALUES(l_name), 
    unit_ID = VALUES(unit_ID), 
    kld_ID = VALUES(kld_ID), 
    user_status = VALUES(user_status);

-- Insert or update the account, referencing the user and role
INSERT INTO account (account_ID, user_ID, kld_ID, password_hash, role_ID)
VALUES (1, 1, 'PPSU-ADMIN-001', '$2y$10$141uwWCyZkNSJvIFzubJ3OD3QCNscMqM25nZIsjawWqWbtPjAqFNG', 1)
ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    role_ID = VALUES(role_ID),
    kld_ID = VALUES(kld_ID);
