-- Create User and Role
CREATE USER 'lazada_admin'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'lazada_customer'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'lazada_seller'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'lazada_auth'@'localhost' IDENTIFIED BY 'password';
CREATE ROLE  'customer','seller','auth';


-- Grant Permission for Role
GRANT ALL ON test.* TO 'lazada_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON test.Products TO 'seller';
GRANT SELECT, INSERT ON test.ProductWarhouse TO 'seller';
GRANT SELECT, INSERT ON test.Warhouse TO 'seller';
GRANT SELECT ON test.Products TO 'customer';
GRANT SELECT, INSERT, DELETE ON test.Orders TO 'customer';
GRANT SELECT, ON test.Warhouse TO 'customer';
GRANT SELECT, UPDATE ON test.ProductWarhouse TO 'customer';
GRANT SELECT ON test.Customers TO 'auth';
GRANT SELECT ON test.Admin TO 'auth';
GRANT SELECT ON test.Sellers TO 'auth';


-- Grant Role to User
GRANT 'customer' TO 'lazada_customer'@'localhost';
GRANT 'seller' TO 'lazada_seller'@'localhost';
GRANT 'auth' TO 'lazada_auth'@'localhost';





