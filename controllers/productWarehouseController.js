const { Sequelize, Op } = require('sequelize');
const mysql = require('mysql');
const mongoose = require('mongoose');
const util = require('util');
const ProductAttributes = require('../models/ProductAttribute');

var db = {};
var productTable;
var productLocationTable;
var warehouseTable;

var mysqlQuery;
var mysqlConnection;

async function connectDB(username, password) {
  const sequelize = new Sequelize('lazada_database', username, password, {
    host: '127.0.0.1',
    dialect: 'mysql',
  });

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  db.products = require('../models/Products.js')(sequelize, Sequelize);
  db.product_location = require('../models/ProductWarehouses.js')(
    sequelize,
    Sequelize
  );
  db.warehouse = require('../models/Warehouses.js')(sequelize, Sequelize);

  productTable = db.products;
  productLocationTable = db.product_location;
  warehouseTable = db.warehouse;

  // Establish connection for mysql
  mysqlConnection = await mysql.createConnection({
    host: '127.0.0.1',
    dialect: 'mysql',
    user: username,
    password: password,
    database: 'lazada_database',
    multipleStatements: true,
  });

  mysqlConnection.connect(function (err) {
    if (err) throw err;
    console.log('Connected!');
  });

  mysqlQuery = util.promisify(mysqlConnection.query).bind(mysqlConnection);

  await db.sequelize
    .sync()
    .then(() => {
      console.log('Synced db.');
    })
    .catch((err) => {
      console.log('Failed to sync db: ' + err.message);
    });
}

exports.findAll = async function (req, res) {

    const query = req.body.query;
    await connectDB ('lazada_admin','password')
    await mysqlConnection.query(
      `SELECT * FROM product_warehouse_view
      ORDER BY warehouse_id;    
      `,
      async function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
};

exports.moveProduct = async function (req, res) {
  const query = req.body.query;

  console.log(query); 
  await connectDB ('lazada_admin','password')
  console.log('after connect');
  productTable.findOne({
    where: {
      product_id: query.productID
    }
  }).then(async (product) => { 
      product = product.dataValues;
      console.log(product); 
     let volume = product.length * product.width * product.height;
     let totalVolum = volume * query.quantity;

     await mysqlConnection.query(
      `CALL move_product(${query.wid_start},${query.productID},${query.wid_dest},${totalVolum},${query.quantity},@outParam);
        SELECT @outParam as success;
      `, async function (err, result) {
        if (err) throw err;
        else{
          result = result[1][0]['success'];

          console.log(result);
          if(result == 1){
            res.json({ status: true,
              message: 'Move product successfully'});
          }else{
            res.json({ status: false,
              message: 'Move product failed'});
          }
        }

      });
  }).catch((err) => {
    res.json({ status: false,
      message: 'Move product failed'});
  }
);};



