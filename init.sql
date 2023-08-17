CREATE USER IF NOT EXISTS 'user-test'@'localhost' identified with mysql_native_password by '12345';
GRANT ALL PRIVILEGES ON *.* TO 'user-test'@'localhost';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXIST `test`;