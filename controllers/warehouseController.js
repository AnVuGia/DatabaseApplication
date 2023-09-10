const { Sequelize, Op } = require('sequelize');
const { connectDB } = require('./helperController');
// Create and Save a new Tutorial
exports.create = async (req, res) => {

  const body = req.body;
  console.log(body);  
  warehouseTable = await connectDB(
    body.user_credential,
    require('../models/Warehouses.js')
  );

  req.body.query['available_volume'] = req.body.query.volume;

  // Save Tutorial in the database
  warehouseTable
    .create(req.body.query)
    .then((result) => {
      res.json({
        status: true,
        message: 'Create Warehouse successfully!',
      });
    })
    .catch((err) => {
      res.json({
        status: false,
        message: err.message || 'Some error occurred while creating data.',
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
  const userCredential = req.body.user_credential;
  const body = req.body;
  console.log(body);
  warehouseTable = await connectDB(
    body.user_credential,
    require('../models/Warehouses.js')
  );
  warehouseTable
    .findAll({
      offset: body.query.offset,
      limit: body.query.limit,
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.json({
        status: false,
        message: err.message || 'Some error occurred while retrieving data.',
      });
    });
};

// Find all data has attribute search_att contains searchStr
exports.search = async function (req, res) {
  const body = req.body;
  warehouseTable = await connectDB(
    body.user_credential,
    require('../models/Warehouses.js')
  );

  let searchConditions = body.query;

  let searchParams = {};

  if (searchConditions.hasOwnProperty('search')) {
    searchParams['where'] = {
      [searchConditions.search.search_attribute]: {
        [Op.like]: '%' + searchConditions.search.search_string + '%',
      },
    };
  }

  if (searchConditions.hasOwnProperty('order')) {
    searchParams['order'] = [searchConditions.order];
  }
  console.log(searchConditions);
  warehouseTable
    .findAll({
      offset: searchConditions.offset,
      limit: searchConditions.limit,
      // Only include 'where' and 'order' in the searchParams object if they exist
      ...(searchParams.where && { where: searchParams.where }),
      ...(searchParams.order && { order: searchParams.order }),
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.json({
        status: false,
        message: err.message ||  'Some error occurred while retrieving data.',
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = async (req, res) => {
  const body = req.body;
  console.log(body);
  warehouseTable = await connectDB(
    body.user_credential,
    require('../models/Warehouses.js')
  );

  let newObject = req.body.query;

  let filter = {
    where: {
      warehouse_id: newObject.warehouse_id,
    },
  };

  // Delete the id attribute from update data
  delete newObject.warehouse_id;

  // Handle when updated volume smaller than the occupying
  const oldData = await warehouseTable.findOne(filter);

  // If new total volume smaller than the volume occupied by product(s)
  if (newObject.volume < oldData.volume - oldData.available_volume) {
     
      res.json({
        status: false,
        message: err.message ||  'ERROR: New volume value smaller than current occupied volume.',
      });
      return;
  }

  const updateParam = {
      warehouse_name: newObject.warehouse_name,
      address: newObject.address,
      volume: newObject.volume,
      available_volume: newObject.volume - (oldData.volume - oldData.available_volume)
  };

  warehouseTable
    .update(updateParam, filter)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while updating data.',
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
  const body = req.body;

  warehouseTable = await connectDB(
    body.user_credential,
    require('../models/Warehouses.js')
  );

  const filterParam = {
    warehouse_id: req.body.query.warehouse_id,
  };

  warehouseTable
    .findOne({
      where: filterParam,
    })
    .then((warehouse) => {
      // Cannot find the warehouse by id
      if (warehouse == null) {
        res.json({
          status: false,
          message: err.message || "Can't find warehouse with specified id.",
        });
        return;
      }

      warehouse = warehouse.dataValues;

      // If found warehouse is empty
      if (warehouse.volume == warehouse.available_volume) {
        warehouseTable
          .destroy({
            where: filterParam,
          })
          .then((result) => {
            res.json({
              status: false,
              message: err.message || 'Delete successfully!',
            });
          })
          .catch((err) => {
            res.json({
              status: false,
              message: err.message || 'Some error occurred while deleting data',
            });
          });
      }
      // If available_volume < volume
      else {
        res.json({
          status: false,
          message: err.message || 'Warehouse is not empty.',
        });
      }
    })
    .catch((err) => {
      res.json({
        status: false,
        message: err.message || 'Some error occurred while deleting data',
      });
    });
};
