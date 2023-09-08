const { Sequelize, Op } = require('sequelize');
const mysql = require('mysql2');
const util = require('util');

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
  db.product_location = require('../models/ProductLocation.js')(
    sequelize,
    Sequelize
  );
  db.warehouse = require('../models/Warehouse.js')(sequelize, Sequelize);

  productTable = db.products;
  productLocationTable = db.product_location;
  warehouseTable = db.warehouse;

  // Establish connection for mysql
  mysqlConnection = await mysql.createConnection({
    host: '127.0.0.1',
    dialect: 'mysql',
    user: username,
    password: password,
    database: 'test',
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

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  const userCredential = req.session.credentials;
  console.log(req.body.query);
  await connectDB(userCredential.username, userCredential.password);

  req.body.query['unit_in_stock'] = req.body.query.quantity;
  req.body.query['unit_on_order'] = '0';

  const product_volume = newObject.width * newObject.height * newObject.length;

  // Create a stored procedure
  await mysqlConnection.query(
    `
        DROP PROCEDURE IF EXISTS warehouse_selection;
        CREATE PROCEDURE warehouse_selection(IN p_id INT, product_volume INT, product_quantity INT, OUT success BOOLEAN)
        BEGIN  
            DECLARE id INT; 
            DECLARE warehouse_volume INT;  

            DECLARE done INT DEFAULT FALSE;  

            DECLARE num_product INT;

            DECLARE cur CURSOR FOR SELECT warehouse_id, available_volume FROM warehouses ORDER BY available_volume DESC;  

            DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;  

            START TRANSACTION;  

            OPEN cur;  

            read_loop: LOOP  
                FETCH cur INTO id, warehouse_volume;  
                IF done THEN  
                    LEAVE read_loop;  
                END IF;  

                SET num_product = 0;

                while_loop: WHILE warehouse_volume >= product_volume DO  
                    SET warehouse_volume = warehouse_volume - product_volume;

                    SET product_quantity = product_quantity - 1;
                    
                    SET num_product = num_product + 1;

                    IF product_quantity = 0  THEN
                        SET success = TRUE;  

                        SET done = TRUE;

                        LEAVE while_loop;
                        LEAVE read_loop;
                    END IF;  

                END WHILE while_loop;

                UPDATE warehouses
                SET available_volume = warehouse_volume
                WHERE warehouse_id = id;

                INSERT INTO product_locations(product_id, warehouse_id, product_quantity)
                            VALUES(p_id, id, num_product);

            END LOOP;  

            IF product_quantity > 0 THEN  
                ROLLBACK;  
                SET success = FALSE;  
            END IF;  

            IF product_quantity = 0  THEN
                COMMIT;
            END IF;  

            CLOSE cur;  

        END`,

    // Call back function execute after creating procedure
    async function (err, result) {
      if (err) throw err;
      console.log('Created Store procedure successfully!');

      var newID = 1,
        warehouse_selection_result;

      // Create product in product table to get id
      await productTable
        .create(newObject)
        // Call back function execute after creating product
        .then(async (newProduct) => {
          newID = newProduct.product_id;

          console.log(newID);

          // Call procedure to select suitable warehouse
          await mysqlConnection.query(
            `CALL warehouse_selection(${newID}, ${product_volume}, ${newObject.quantity}, @outParam);
                        SELECT @outParam AS success;`,

            // Call back function execute after getting result from procedure
            function (err, result) {
              if (err) {
                throw err;
              } else {
                // Get result from procedure
                warehouse_selection_result = result[1][0]['success'];

                console.log(warehouse_selection_result);

                // Check result
                // If all product are store successfully
                if (warehouse_selection_result == 1) {
                  res.send({
                    message:
                      'Successfully create and select suitable warehouse.',
                  });
                }
                // If all product are not able to store
                else {
                  // Delete product in table
                  productTable
                    .destroy({
                      where: {
                        product_id: newID,
                      },
                    })
                    .then((result) => {
                      res.send({
                        message:
                          'All warehouses do not have enough space(s) for product.',
                      });
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message:
                          err.message ||
                          'Some error occurred while deleting data.',
                      });
                    });
                }
              }
            }
          );
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || 'Some error occurred while creating the Product.',
          });
        });
    }
  );
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

// Update a Product by the id in the request
exports.update = async (req, res) => {
  const userCredential = req.session.credentials;

  await connectDB(userCredential.user_name, userCredential.password);

  var newObj = req.body.query;

  const filterParam = {
    where: {
      product_id: newObj.product_id,
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

  await connectDB(userCredential.user_name, userCredential.password);

  // Get the delete product_id
  var newObj = req.body.query;

  // Check para
  if (newObj.product_id == null) {
    res.status(500).send({
      message: 'Missing product_id.',
    });

    return;
  }

  const filterParam = {
    where: {
      product_id: newObj.product_id,
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
