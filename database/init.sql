CREATE USER IF NOT EXISTS 'user-lazada'@'localhost' identified with mysql_native_password by '12345';
GRANT ALL PRIVILEGES ON *.* TO 'user-lazada'@'localhost';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS `lazada_database`;
USE `lazada_database`;
CREATE TABLE IF NOT EXISTS Customers (
    customer_id bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cart_id VARCHAR(24) NOT NULL,
    customer_name VARCHAR(15),
    username VARCHAR(15),
    password VARCHAR(15),
    address VARCHAR(50),
    createdAt datetime,
    updatedAt datetime
);
CREATE TABLE IF NOT EXISTS Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    customer_id bigint(10) NOT NULL,
    seller_id bigint(10) NOT NULL,
    product_id bigint(10) NOT NULL,
    product_quantity INT NOT NULL,
    product_price DOUBLE NOT NULL,
	createdAt datetime,
    updatedAt datetime
);
CREATE TABLE IF NOT EXISTS Products (
    product_id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(40) NOT NULL,
    product_desc VARCHAR(300),
    seller_id bigint(10) NOT NULL,
    category_id VARCHAR(24) NOT NULL,
    image VARCHAR(250),
    width INT,
    height INT,
    length INT,
    price DOUBLE,
    quantity INT,
    unit_in_stock INT,
    unit_on_order INT,
	createdAt datetime,
    updatedAt datetime
);
CREATE TABLE IF NOT EXISTS Sellers (
    seller_id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(15),
    password VARCHAR(15),
    seller_name VARCHAR(15),
    address VARCHAR(50),
	createdAt datetime,
    updatedAt datetime
);
CREATE TABLE IF NOT EXISTS Warehouses (
    warehouse_id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    warehouse_name VARCHAR(15),
    address VARCHAR(50),
    total_volume INT,
    createdAt datetime,
    updatedAt datetime
);
CREATE TABLE IF NOT EXISTS ProductWarehouse (
    product_warehouse_id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id bigint(10) NOT NULL,
    warehouse_id bigint(10) NOT NULL,
    quantity INT,
    createdAt datetime,
    updatedAt datetime
);
CREATE TABLE IF NOT EXISTS Admin (
    admin_id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(15),
    password VARCHAR(15),
    createdAt datetime,
    updatedAt datetime
);

