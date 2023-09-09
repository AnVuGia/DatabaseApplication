const mongoose = require("mongoose");
const Category = require("../models/Category");
const {Sequelize, Op, QueryTypes} = require('sequelize');

const db= {};
var productTable;
var sequelize;

async function connectDB(username, password) {
    const sequelize = new Sequelize('lazada_database', username, password, {
        host: '127.0.0.1',
        dialect: 'mysql',
      });
    
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    db.products = require("../models/Product.js")(sequelize, Sequelize);

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

// Find all document in collection
exports.findAll = async function (req, resp) {
    console.log("find all category");
    try {
        const results = await Category.find({});
        resp.json(results);
    } 
    catch (err) {
        resp.status(500).json({message: err.message});
        // throw err;
    }
};


// Find all document in collection
exports.search = async function (req, resp) {
    let searchAtt = req.body.search_attribute;
    let searchStr = req.body.search_string;

    var searchParams = {};

    searchParams[searchAtt] = searchStr;

    try {
        const results = await Category.find(searchParams);
        resp.json(results);
    } 
    catch (err) {
        resp.status(500).json({message: err.message});
    }
};
exports.searchByName = async function (req, resp) {
    let searchValue = req.body.name;

    try {
        const results = await Category.find({ name: new RegExp(searchValue, 'i') });
        resp.json(results);
    } catch (err) {
        resp.status(500).json({ message: err.message });
    }
};



// Find specify doc in collection to update
// return the un updated version of doc
exports.update = async function (req, resp) {
    let category = req.body;

    const userCredential = req.session.credentials;

    await connectDB(userCredential.username, userCredential.password);

    // find all product have this category id
    const products = await productTable.findAll({
        where: {
            category_id: category._id
        }
    })
    .then( async (products) => {
        // There is no product in result
        if (products.length < 1) {
            let filter = {
                _id : category._id
            };

            // Only allow update attributes list
            let update = {
                attributes: category.attributes
            }

            try {
                const results = await Category.findByIdAndUpdate(filter, update);
                console.log(results);
                resp.json(results);
            } 
            catch (err) {
                resp.status(500).json({message: err.message});
            }
        }
        // There are at least 1 product have
        else {
            resp.status(500).send({
                message: "Update failed. There are product(s) inherit this category."
            });
        }
    })
    .catch(err => {
        resp.status(500).send({
            message: err.message || "Cannot find product by id."
        });
    });
};

// Delete by id
exports.delete = async function (req, resp) {
    let category = req.body;
    const userCredential = req.session.credentials;

    let filter = {
        _id : category._id
    };

    try {
        const result = await Category.findOne(filter);

        // There are children category(s)
        if (result.children.length > 0) {
            resp.status(500).json({message: "Delete Failed! There are sub-category(s) inherit it."});

            return;
        }

        // There are no children category so check if there are any product use it
        else {
            const userCredential = req.body.user_credential;
            await connectDB(userCredential.user_name, userCredential.password);

            // find all product have this category id
            const products = await productTable.findAll({
                where: {
                    category_id: category._id
                }
            })
            .then( async (products) => {
                // There is no product in result
                if (products.length < 1) {
                    // If there is parent id
                    if (result.parent != null) {
                        var parent = await Category.findOne({
                            _id: result.parent
                        });

                        // Remove children id
                        parent.children.splice(parent.children.indexOf(category._id));

                        // Save
                        await parent.save();
                    }

                    const results = await Category.findOneAndDelete(filter);
                    resp.json(results);
                }
                // There are at least 1 product have
                else {
                    resp.status(500).send({
                        message: "Delete failed. There are product(s) inherit this category."
                    });
                }
            })
            .catch(err => {
                resp.status(500).send({
                    message: err.message || "Cannot find product by id."
                });
            });
        }
    } 
    catch (err) {
        resp.status(500).json({message: err.message});
    }
};



//CREATE NEW CATEGORY
// {
//     "name": "laptop",
//     "parent": null,
//     "attributes": [
//       { "name": "name", "required": true },
//       { "name": "address", "required": false }
//     ]
// }
// Create new Category by passing Categroy into request body
exports.createCategory = async function (req, resp) {
    console.log(req.body);

    const category = new Category({
        name: req.body.name,
        parent: req.body.parent,
        attributes: req.body.attributes,
        children: []
    });

    try {
        // Create category
        const newCategory = await category.save();

        // Get parent category
        const parent = await Category.findOne({
            _id: req.body.parent
        });

        // Check if there is
        if (parent != null) {
            // Add children id to children list
            parent.children.push(newCategory._id);

            await Category.findByIdAndUpdate(
                {
                    _id: req.body.parent
                }, 
                {
                    children: parent.children
                });

            console.log(parent);
        }

        resp.status(201).json(newCategory);
    }
    catch (err) {
        resp.status(400).json({ mesage: err.message})
    }
}