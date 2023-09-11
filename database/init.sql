CREATE USER IF NOT EXISTS 'user-lazada'@'localhost' identified with mysql_native_password by '12345';
GRANT ALL PRIVILEGES ON *.* TO 'user-lazada'@'localhost';
FLUSH PRIVILEGES;
DROP DATABASE IF EXISTS `lazada_database`;
CREATE DATABASE IF NOT EXISTS `lazada_database`;
USE `lazada_database`;

CREATE TABLE IF NOT EXISTS Products (
    product_id BIGINT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(200) NOT NULL,
    product_desc VARCHAR(350),
    seller_id BIGINT NOT NULL,
    category_id VARCHAR(24) NOT NULL,
    width INT,
    length INT,
    height INT,
    price BIGINT,
    image VARCHAR(350),
    unit_in_stock INT,
    unit_on_order INT,
	createdAt datetime,
    updatedAt datetime,
    PRIMARY KEY(product_id, price)
) ENGINE = InnoDB
PARTITION BY RANGE(price) (
    PARTITION p_low_price VALUES LESS THAN (500),
    PARTITION p_medium_price VALUES LESS THAN (1000),
    PARTITION p_high_price VALUES LESS THAN (10000),
    PARTITION p_luxury_price VALUES LESS THAN (MAXVALUE)
);
