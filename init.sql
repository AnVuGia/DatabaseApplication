CREATE USER IF NOT EXISTS 'user-test'@'localhost' identified with mysql_native_password by '12345';
GRANT ALL PRIVILEGES ON *.* TO 'user-test'@'localhost';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS `test`;
USE `test`;
CREATE TABLE IF NOT EXISTS Customers (
    customer_id VARCHAR(5),
    username VARCHAR(15),
    password VARCHAR(15),
    address VARCHAR(50),
    city VARCHAR(50),
    province VARCHAR(50),
    street VARCHAR(50),
    phone VARCHAR(20),
    createdAt datetime,
    updatedAt datetime
);
CREATE TABLE IF NOT EXISTS Orders (
    order_id INT,
    customer_id VARCHAR(5),
    shipper_id INT,
    seller_id INT,
    phone VARCHAR(20),
	createdAt datetime,
    updatedAt datetime
);
CREATE TABLE IF NOT EXISTS OrderDetails(
    order_id INT,
    product_id INT,
    price DOUBLE,
    quantity INT,
	createdAt datetime,
    updatedAt datetime
);
CREATE TABLE IF NOT EXISTS Products (
    product_id INT,
    product_name VARCHAR(40),
    product_desc TEXT,
    seller_id INT,
    category_id INT,
    product_volume DOUBLE,
    price DOUBLE,
    quantity INT,
    units_in_stock INT,
    units_on_order INT,
	createdAt datetime,
    updatedAt datetime
);
CREATE TABLE IF NOT EXISTS Shippers (
    shipper_id INT,
    phone VARCHAR(24)
);
CREATE TABLE IF NOT EXISTS Sellers (
    seller_id INT,
    address VARCHAR(50),
    city VARCHAR(50),
    province VARCHAR(50),
    street VARCHAR(50),
    number VARCHAR(50),
    total_volume DOUBLE,
	createdAt datetime,
    updatedAt datetime
);

