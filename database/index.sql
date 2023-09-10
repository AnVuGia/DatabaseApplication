use lazada_database;
-- Create an index on the username column in Customers
CREATE INDEX idx_username ON Customers (username);

-- Create an index on the password column in Customers
CREATE INDEX idx_password ON Customers (password);

-- Create an index on the product_id column in ProductWarehouses
CREATE INDEX idx_product_id ON ProductWarehouses (product_id);

