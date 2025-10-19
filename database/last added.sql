-- notification
CREATE TABLE notification (
    notif_id INT AUTO_INCREMENT PRIMARY KEY,
    notif_for INT NOT NULL, -- where the notif show up
    notif_from INT NOT NULL, -- where the notif from
    notif_content VARCHAR (200) NOT NULL,
    is_opened BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (notif_for) REFERENCES user (user_ID),
    FOREIGN KEY (notif_from) REFERENCES user (user_ID)
);


CREATE TABLE forgot_pass_token (
    token_ID INT AUTO_INCREMENT PRIMARY KEY,
    kld_email VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (kld_email) REFERENCES kld(kld_email)
);