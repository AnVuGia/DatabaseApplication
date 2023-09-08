-- Create User and Role
CREATE USER 'lazada_admin'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'lazada_customer'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'lazada_seller'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'lazada_guest'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'lazada_auth'@'localhost' IDENTIFIED BY 'password';
CREATE ROLE 'customer','seller','auth','guest';


-- Grant Permission for Role
GRANT ALL ON lazada_database.* TO 'lazada_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON lazada_database.Products TO 'seller';
GRANT SELECT, INSERT ON lazada_database.ProductWarehouses TO 'seller';
GRANT SELECT, INSERT ON lazada_database.Warehouses TO 'seller';
GRANT SELECT ON lazada_database.Products TO 'customer';
GRANT SELECT, INSERT, DELETE ON lazada_database.Orders TO 'customer';
GRANT SELECT ON lazada_database.Warehouses TO 'customer';
GRANT SELECT, UPDATE ON lazada_database.ProductWarehouses TO 'customer';
GRANT SELECT ON lazada_database.Customers TO 'auth';
GRANT SELECT ON lazada_database.Admins TO 'auth';
GRANT SELECT ON lazada_database.Sellers TO 'auth';
GRANT SELECT, INSERT ON lazada_database.Customers TO 'guest';
GRANT SELECT, INSERT ON lazada_database.Sellers TO 'guest';

-- Grant Role to User
GRANT 'customer' TO 'lazada_customer'@'localhost';
GRANT 'seller' TO 'lazada_seller'@'localhost';
GRANT 'auth' TO 'lazada_auth'@'localhost';
GRANT 'guest' TO 'lazada_guest'@'localhost';



SET DEFAULT ROLE ALL TO
'lazada_customer'@'localhost',
'lazada_seller'@'localhost',
'lazada_auth'@'localhost',
'lazada_guest'@'localhost';
