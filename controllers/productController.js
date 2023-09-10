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

exports.createInboundOrder = async (req, res) => {
  const userCredential = req.session.credentials;

  // await connectDB(userCredential.username, userCredential.password);
  await connectDB('lazada_seller', 'password');

  var inboundOrder = req.body.query;

  await productTable
    .findOne({
      where: {
        product_id: inboundOrder.product_id,
      },
    })
    .then(async (product) => {
      const product_volume = product.width * product.height * product.length;

      const newID = product.product_id;

      // Call procedure to select suitable warehouse

      await mysqlConnection.query(
        `CALL warehouse_selection(${newID}, ${product_volume}, ${inboundOrder.quantity}, @outParam);

        SELECT @outParam AS success;`,

        // Call back function execute after getting result from procedure

        async function (err, result) {
          if (err) {
            throw err;
          } else {
            // Get result from procedure

            warehouse_selection_result = result[1][0]['success'];

            console.log(warehouse_selection_result);

            // Check result

            // If all product are store successfully

            if (warehouse_selection_result == 1) {
              // Update information

              productTable
                .update(
                  {
                    unit_in_stock:
                      product.unit_in_stock + inboundOrder.quantity,
                  },

                  {
                    where: {
                      product_id: inboundOrder.product_id,
                    },
                  }
                )

                .then((result) => {
                  res.send(result ? 'Sucessfully' : 'Some error occurred.');
                })

                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      'Some error occurred while retrieving data.',
                  });
                });
            }

            // If all product are not able to store
            else {
              res.send({
                message:
                  'All warehouses do not have enough space(s) for product.',
              });
            }
          }
        }
      );
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Cannot find product with given id.',
      });
    });
};

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  const userCredential = req.session.credentials;

  // await connectDB(userCredential.username, userCredential.password);
  await connectDB('lazada_seller', 'password');

  const newObject = req.body.query;
  console.log(newObject);
  newObject['unit_in_stock'] = 0;
  newObject['unit_on_order'] = 0;

  // Store attribute list seperately
  const productAttributes = newObject.attributes;

  // Remove attrbute list from create product data
  delete newObject.attributes;
  console.log(newObject);
  // Create product in product table to get id
  await productTable
    .create(newObject)
    .then(async (newProduct) => {
      const data = new ProductAttributes({
        product_id: newProduct.product_id,
        attributes: productAttributes,
      });

      try {
        const newData = await data.save();

        console.log('Sucessfully store attribute of product.');

        res.send({
          message: 'Successfully create product and store its attributes.',
        });
      } catch (err) {
        res.status(400).json({ mesage: err.message });

        return;
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Product.',
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
  // const userCredential = req.session.credentials;
  // console.log(req.body)
  // const userCredential = req.body.user_credentials;

  // await connectDB(userCredential.username, userCredential.password);

  await connectDB('lazada_customer', 'password');

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

  const query = req.body.query;

  // let searchAtt = req.body.query.search_attribute;
  const searchStr = query.search_string;
  const price = query.price;
  const search_cate_id = query.category_id;
  const sort = query.sort;
  const pagination = query.pagination;

  // Prepare search paramaters
  var searchParams = {
    where: {
      [Op.and]: [
        // Search contained string in name and description
        {
          [Op.or]: [
            {
              product_name: {
                [Op.like]: `%${searchStr}%`,
              },
            },
            {
              product_desc: {
                [Op.like]: `%${searchStr}%`,
              },
            },
          ],
        },
        // Search by price range
        {
          price: {
            [Op.lte]: price.max,
            [Op.gte]: price.min,
          },
        },
      ],
    },
    order: [[sort.attribute, sort.order]],
  };

  if (search_cate_id.length > 0) {
    var cateIDs = [search_cate_id];

    cateIDs.push(...(await getAllChildrenID(search_cate_id)));

    searchParams.where[Op.and].push(
      // Filter by all category and its sub categories
      {
        category_id: {
          [Op.in]: cateIDs,
        },
      }
    );
  }

  productTable
    .findAll(searchParams)
    .then((result) => {
      // Get all products data
      var products = result.map((i) => i.dataValues);

      const startId = pagination.offset * pagination.limit;
      const lastId = startId + pagination.limit;

      // Apply pagination
      products = products.slice(startId, lastId);

      console.log(products);
      res.send(products);
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
  const seller_id = req.params.seller_id;
  console.log('request body: ');
  console.log(req.body);
  console.log('Seller id: ' + seller_id);
  // await connectDB(userCredential.username, userCredential.password);

  await connectDB('lazada_seller', 'password');
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

// Update a Product by the id in the request
exports.update = async (req, res) => {
  const userCredential = req.session.credentials;
  const product_id = req.params.product_id;
  // await connectDB(userCredential.user_name, userCredential.password);
  await connectDB('lazada_seller', 'password');
  const newObj = req.body.query;
  const filterParam = {
    where: {
      product_id: product_id,
    },
  };

  // Get old data
  oldObj = await productTable.findOne(filterParam).catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving data.',
    });
  });

  // Check if product existed
  if (oldObj == null) {
    res.status(500).send({
      message: 'The product with provided id is not existed!',
    });

    return;
  }

  // Only allow to udpate some attribute
  const updateParam = {
    product_name: newObj.product_name,
    product_desc: newObj.product_desc,
    image: newObj.image,
    category_id: newObj.category_id,
    price: newObj.price,
  };

  // Update information
  productTable
    .update(updateParam, filterParam)
    .then((result) => {
      res.send(result ? 'Sucessfully' : 'Some error occurred.');
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving data.',
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
  const userCredential = req.session.credentials;

  // await connectDB(userCredential.user_name, userCredential.password);
  await connectDB('lazada_seller', 'password');
  const product_id = req.params.product_id;
  // Get the delete product_id
  var newObj = req.body.query;

  // Check para
  if (product_id == null) {
    res.status(500).send({
      message: 'Missing product_id.',
    });

    return;
  }

  const filterParam = {
    where: {
      product_id: product_id,
    },
  };

  // Get the product from db
  const product = await productTable.findOne(filterParam);

  // Calculate the volume of product
  const product_volume = product.width * product.length * product.height;

  // Find all location of product in productLocation table
  let results = await productLocationTable.findAll(filterParam);

  // Loop through each row in produclocation table contain the product_id
  for (var i = 0; i < results.length; i++) {
    // Find the correspond warehouse by warehouse_id
    let warehouse = await warehouseTable.findOne({
      where: {
        warehouse_id: results[i].dataValues.warehouse_id,
      },
    });

    const updateVolume =
      warehouse.available_volume +
      product_volume * results[i].dataValues.product_quantity;
    // Prepare the update param for available_volume
    const updateParam = {
      available_volume: updateVolume,
    };

    // Update available space in warehouse
    try {
      await warehouseTable.update(updateParam, {
        where: {
          warehouse_id: results[i].dataValues.warehouse_id,
        },
      });

      console.log(`Restored the space in warehosue ${warehouse.warehouse_id}`);
    } catch (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while updating warehouse volume.',
      });

      return;
    }

    // Delete the row in productLocation table
    try {
      await productLocationTable.destroy({
        where: {
          id: results[i].dataValues.id,
        },
      });
    } catch (err) {
      res.status(500).send({
        message:
          err.message ||
          'Some error occurred while deleting in product_location table',
      });

      return;
    }
  }

  // Finally delete the product
  productTable
    .destroy(filterParam)
    .then((result) => {
      res.send({
        message: 'Delete product successfully!',
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting data.',
      });
    });
};

exports.filterProductByAttributeValue = async (req, res) => {
  let searchAtt = req.body.query.search_attribute;
  let searchStr = req.body.query.search_string;

  // Search by value of attribute ignore case-sensitive
  var searchParams = {
    'attributes.value': { $regex: searchStr, $options: 'i' },
  };

  try {
    const results = await ProductAttributes.find(searchParams);

    var products = [];

    for (var i = 0; i < results.length; i++) {
      const userCredential = req.session.credentials;

      await connectDB(userCredential.user_name, userCredential.password);

      var product = await productTable.findOne({
        where: {
          product_id: results[i].product_id,
        },
      });

      product = product.dataValues;
      product['attributes'] = results[i].attributes;

      products.push(product);
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

async function getAllChildrenID(categoryId) {
  var results = [];

  var categories = await Category.find({
    parent: categoryId,
  });

  categories = categories.map((i) => i._id.toString());

  results.push(...categories);

  for (var i = 0; i < categories.length; i++) {
    results.push(...(await getAllChildrenID(categories[i])));
  }

  return results;
}

exports.filterProductByCategory = async (req, res) => {
  const category_id = req.body.category_id;
  const userCredential = req.session.credentials;

  await connectDB(userCredential.user_name, userCredential.password);

  var cateIDs = [category_id];
  cateIDs.push(...(await getAllChildrenID(category_id)));

  console.log(cateIDs);

  try {
    var products = await productTable.findAll({
      where: {
        category_id: {
          [Op.in]: cateIDs,
        },
      },
    });

    res.send(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
