CREATE USER IF NOT EXISTS 'user-test'@'localhost' identified with mysql_native_password by '12345';
GRANT ALL PRIVILEGES ON *.* TO 'user-test'@'localhost';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS `test`;
USE `test`;
CREATE TABLE IF NOT EXISTS Customers (
    CustomerID VARCHAR(5),
    username VARCHAR(15),
    password VARCHAR(15),
    Address VARCHAR(50),
    City VARCHAR(50),
    province VARCHAR(50),
    street VARCHAR(50),
    Phone VARCHAR(20)
);
CREATE TABLE IF NOT EXISTS Orders (
    OrderID INT,
    CustomerID VARCHAR(5),
    ShipperID INT,
    WareHouseOrSellerID INT,
    Phone VARCHAR(20)
);
CREATE TABLE IF NOT EXISTS OrderDetails(
    OrderID INT,
    ProductID INT,
    Price DOUBLE,
    Quantity INT
);
CREATE TABLE IF NOT EXISTS Products (
    ProductID INT,
    ProductName VARCHAR(40),
    ProductDescription TEXT,
    SellerID INT,
    CategoryID INT,
    ProductVolume DOUBLE,
    Price DOUBLE,
    Quantity INT,
    UnitsInStock INT,
    UnitsOnOrder INT
);
CREATE TABLE IF NOT EXISTS Shippers (
    ShipperID INT,
    Phone VARCHAR(24)
);
CREATE TABLE IF NOT EXISTS Sellers (
    SellerID INT,
    Address VARCHAR(50),
    City VARCHAR(50),
    Province VARCHAR(50),
    Street VARCHAR(50),
    Number VARCHAR(50),
    TotalVolume DOUBLE
);
