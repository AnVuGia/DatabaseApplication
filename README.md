# Group Assignment ​ISYS2099​ – ​Database Application Group 8

This is the group assignment submission for the ​ISYS2099​ – ​Database Application, the project is in master branch

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [ErrorHandling](#errorhandling)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Introduction

This project is about a mock Lazada commercial website that use pure HTML, CSS and JavaScript for the front-end
and Express.JS for the backend. For the database we use MySQL and MongoDB as the requirements of this course.

## Features

    - Customer features: customer can view products that listed by the sellers. The customer can add item to the cart and
    make orders. When the customer make an order successfully, the customer can accept/decline the order to finish the process
    - Seller features: Seller can search/add/update/delete Products, create Inbound Order and move Item from one warehouse to another.
    -Admin feature : admin can search/add/update/delete categories and warehouses.

## Getting started

### Prerequisites

Require user already install Node.js and MySQL server on the running machine

### Installation

1. Open the project with visual studio
2. Install dependencies
3. run the init.sql file in the database folder in MySqlWorkBench
4. npm start to run the server for sequelize to generate the tables
5. run the function.sql file in the database folder in MySqlWorkBench
6. run the auth.sql file in the database folder in MysqlWorkBench
7. run the index.sql file in the database folder in MysqlWorkBench
8. go to localhost:3000
9. Admin username: admin123 password: password123
10. For testing purpose in a new device, it is recomend to go from order admin -> seller -> customer

### Error Handling

1. This project manage user credentials by using session tokens store in the server. so if you want to use multiple
   tabs for different user, it is better to do it in different browsers (ex: 1 in chrome, 1 in edge, 1 in opera,...)
2. If at any time you crash/rerun the server, the credentials will be reset and will require you to login again.

## Contributing

1. s3926888 - Vu Gia An                5
2. s3870730 - Thieu Tran Tri Thuc      5 
3. s3878270 - Dinh Gia Huu Phuoc       5 
4. s3799602 - Lai Nghiep Tri           5

## Acknowledgments
