const { Sequelize, Op } = require('sequelize');

var db = {};
var productTable = db.products;

async function connectDB(username, password) {
  const sequelize = new Sequelize('lazada_database', username, password, {
    host: '127.0.0.1',
    dialect: 'mysql',
  });

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  db.products = require('../models/Products.js')(sequelize, Sequelize);

  productTable = db.products;

  await db.sequelize
    .sync()
    .then(() => {
      console.log('Synced db.');
    })
    .catch((err) => {
      console.log('Failed to sync db: ' + err.message);
    });
}

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  const userCredential = req.session.credentials;
  console.log(req.body.query);
  await connectDB(userCredential.username, userCredential.password);

  req.body.query['unit_in_stock'] = req.body.query.quantity;
  req.body.query['unit_on_order'] = '0';
  console.log(req.body.query);
  // Save Tutorial in the database
  console.log(productTable);
  productTable
    .create(req.body.query)
    .then((newProduct) => {
      console.log('New product created:');
      console.log(newProduct);
      res.send(newProduct);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Tutorial.',
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
  const userCredential = req.session.credentials;

  await connectDB(userCredential.username, userCredential.password);

  productTable
    .findAll()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving data.',
      });
    });
};

// Find all data has attribute search_att contains searchStr
exports.search = async function (req, res) {
  const userCredential = req.session.credentials;

  await connectDB(userCredential.username, userCredential.password);

  let searchAtt = req.body.query.search_attribute;
  let searchStr = req.body.query.search_string;

  var searchParams = {};

  searchParams[searchAtt] = {
    [Op.like]: '%' + searchStr + '%',
  };

  productTable
    .findAll({
      limit: 10,
      where: searchParams,
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving data.',
      });
    });
};
// productController.js
exports.getAllProductBySeller = async function (req, res) {
  const userCredential = req.session.credentials;
  const seller_id = req.body.query.seller_id;
  console.log('request body: ');
  console.log(req.body);
  console.log('Seller id: ' + seller_id);
  await connectDB(userCredential.username, userCredential.password);
  productTable
    .findAll({
      where: {
        seller_id: seller_id,
      },
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving data.',
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = async (req, res) => {
  const userCredential = req.session.credentials;
  await connectDB(userCredential.user_name, userCredential.password);
  const id = req.body.query.product_id;
  console.log(req.body.query);
  productTable
    .update(req.body.query, {
      where: { product_id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Tutorial was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
        });
      }
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
  const userCredential = req.session.credentials;
  await connectDB(userCredential.user_name, userCredential.password);
  const id = req.body.query.product_id;
  productTable
    .destroy({
      where: { product_id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Tutorial was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    });
};
