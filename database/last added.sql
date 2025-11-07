CREATE TABLE asset_classification (
    asset_classification_ID INT AUTO_INCREMENT PRIMARY KEY,
    asset_classification VARCHAR (100) NOT NULL UNIQUE,
    asset_classification_status ENUM('active', 'inactive') DEFAULT 'active'
);
