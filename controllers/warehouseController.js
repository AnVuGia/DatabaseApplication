const {Sequelize, Op} = require('sequelize');
const {connectDB} = require('./helperController')
// var db = {}
// var warehouseTable = db.warehouses;

// async function connectDB(username, password) {
//     const sequelize = new Sequelize("test", username, password, {
//         host: "127.0.0.1",
//         dialect: "mysql"
//     });

//     db.Sequelize = Sequelize;
//     db.sequelize = sequelize;

//     db.warehouses = require("../models/Warehouses.js")(sequelize, Sequelize);

//     warehouseTable = db.warehouses;

//     await db.sequelize.sync()
//     .then(() => {
//             console.log("Synced db.");
//           })
//     .catch((err) => {
//         console.log("Failed to sync db: " + err.message);
//     });
// }

// Create and Save a new Tutorial
exports.create = async (req, res) => {
    
    const body = req.body;

    warehouseTable = await connectDB(body.user_credential, require("../models/Warehouses.js"));

    req.body.query["available_volume"] = req.body.query.volume;

    // Save Tutorial in the database
    warehouseTable.create(req.body.query)
        .then( (result) => {
            res.send(result);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
    const userCredential = req.body.user_credential;
    const body = req.body;
    console.log(req.body);
    // await connectDB(userCredential.username, userCredential.password)
    warehouseTable = await connectDB(body.user_credential, require("../models/Warehouses.js"));
    warehouseTable.findAll(
        {
            offset: body.offset,
            limit: body.limit
        }
    )
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving data."
            });
      });
};

// Find all data has attribute search_att contains searchStr
exports.search = async function (req, res) {
    const userCredential = req.body.user_credential;

    warehouseTable = await connectDB(body.user_credential, require("../models/Warehouses.js"));

    let searchAtt = req.body.query.search_attribute;
    let searchStr = req.body.query.search_string;

    var searchParams = {};

    searchParams[searchAtt] = {
        [Op.like]: '%' + searchStr + '%'
    };

    warehouseTable.findAll({
        limit: 10,
        where: searchParams
    })
    .then(result => {
        res.send(result);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving data."
        });
      });
};

// Update a Tutorial by the id in the request
exports.update = async (req, res) => {
    const userCredential = req.body.user_credential;

    warehouseTable = await connectDB(body.user_credential, require("../models/Warehouses.js"));

    let object = req.body.query;

    let filter = { where: {
        warehouse_id : object.warehouse_id
    }};

    // Delete the id attribute from update data
    delete object.warehouse_id;

    let update = object

    // Handle when updated volume smaller than the occupying
    // if (object.volume < )

    warehouseTable.update(
        update,
        filter
    )
    .then(result => {
        res.send(result);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while updating data."
        });
      });
};

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
    const userCredential = req.body.user_credential;

    warehouseTable = await connectDB(body.user_credential, require("../models/Warehouses.js"));

    const filterParam = {
        warehouse_id: req.body.query.warehouse_id
    };

    warehouseTable.findAll({
        limit: 1,
        where: filterParam
    })
    .then(warehouse => {
        // Cannot find any matching
        if (warehouse.length < 1) {
            res.status(500).send({
                message: "Can't find warehouse with specified id."
              });
        }
        
        // If found warehouse is empty
        else if (warehouse.volume == warehouse.available_volume) {
            warehouseTable.destroy({
                where: filterParam
            })
            .then( (result) => {
                res.send({
                    message: "Delete Warehouse successfully!"
                });
            })
            .catch(err => {
                res.status(500).send({
                  message:
                    err.message || "Some error occurred while deleting data."
                });
              });
        }
        // If available_volume < volume
        else {
            res.status(400).send({
                message:
                    "Delete failed. There are product(s) in the Warehouse!"
              });
        }
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while finding data"
        });
      });
};
