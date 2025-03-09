
CREATE TABLE `account` (
  `user_ID` bigint(20) NOT NULL,
  `userName` varchar(32) NOT NULL,
  `password` varchar(64) NOT NULL
);

CREATE TABLE item (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    barcode VARCHAR(50) UNIQUE NOT NULL, 
    serial_num VARCHAR(30) UNIQUE NOT NULL,
    assets VARCHAR(30) NOT NULL,
    brand VARCHAR(30) NOT NULL,
    inventoryTag VARCHAR(50) NOT NULL,
    responsibleTo VARCHAR(50) NULL,
    remarks VARCHAR(80) NULL,
    notes VARCHAR(50) NULL,
    institute VARCHAR(40) NULL,
    returnedDate DATE NULL,
    reasonOfReturn VARCHAR(80) NULL
);

