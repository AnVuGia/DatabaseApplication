const mongoose = require('mongoose');
const Category = require('../models/Category');
const { Sequelize, Op, QueryTypes } = require('sequelize');

const db = {};
var productTable;
var sequelize;

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

// Find all document in collection
exports.findAll = async function (req, res) {
  console.log('find all category');
  try {
    const results = await Category.find({});
    res.json(results);
  } catch (err) {
    res.json({
      status: false,
      message: 'Invalid',
    });
  }
};

// Find all document in collection
exports.search = async function (req, res) {
  let searchAtt = req.body.search_attribute;
  let searchStr = req.body.search_string;

  var searchParams = {};

  searchParams[searchAtt] = searchStr;

  try {
    const results = await Category.find(searchParams);
    res.json(results);
  } catch (err) {
    res.json({
      status: false,
      message: 'Some error occurred while retrieving data.',
    });
  }
};
exports.searchByName = async function (req, res) {
  let searchValue = req.body.name;

  try {
    const results = await Category.find({ name: new RegExp(searchValue, 'i') });
    res.json(results);
  } catch (err) {
    res.json({
      status: false,
      message: 'Some error occurred while retrieving data.',
    });
  }
};

// Find specify doc in collection to update
// return the un updated version of doc
exports.update = async function (req, res) {
  try {
    let category = req.body;
    console.log(category);
    const userCredential = req.session.credentials;
    await connectDB(userCredential.username, userCredential.password);

    // Find all products with this category id
    const products = await productTable.findAll({
      where: {
        category_id: category._id,
      },
    });

    
    // Check if there are no products with this category id
    if (products.length === 0) {
      let filter = {
        _id: category._id,
      };

      // 
      let update = {
        name: category.name,
        attributes: category.attributes,
      };

      // Check if the category name already exists
      const result = await Category.findOne({ name: category.name });
      
      if (result !== null) {
        if (result._id.toString() !== category._id){
            console.log(result);
            return res.json({
                status: false,
                message: 'Category name already exists',
              });
        }
      }

      // Update the category
      const updatedCategory = await Category.findByIdAndUpdate(filter, update);

      if (updatedCategory) {
        return res.json({
          status: true,
          message: 'Update category successfully',
        });
      } else {
        return res.json({
          status: false,
          message: 'Cannot update category',
        });
      }
    } else {
      return res.json({
        status: false,
        message: 'Already have products using this category',
      });
    }
  }catch (err) {
    console.error(err);
    return res.json({
      status: false,
      message: 'Internal server error',
    });
  }
};

// Delete by id
exports.delete = async function (req, res) {
  let category = req.body;
  console.log(category);
  const userCredential = req.session.credentials;

  let filter = {
    _id: category._id,
  };

  const result = await Category.findOne(filter);

  // There are children category(s)
  if (result.children.length > 0) {
    res.json({
      status: false,
      message: 'Cannot delete attribute that have children',
    });

    return;
  } // There are no children category so check if there are any product use it
  else {
    await connectDB(userCredential.username, userCredential.password);
    // await connectDB('lazada_admin', 'password');
    // find all product have this category id
    const products = await productTable
      .findAll({
        where: {
          category_id: category._id,
        },
      })
      .then(async (products) => {
        // There is no product in result
        if (products.length < 1) {
          // If there is parent id
          if (result.parent != null) {
            var parent = await Category.findOne({
              _id: result.parent,
            });

            // Remove children id
            parent.children.splice(parent.children.indexOf(category._id));

            // Save
            await parent.save();
          }

          const results = await Category.findOneAndDelete(filter);
          res.json({
            status: true,
            message: 'Delete category successfully',
          });
        }
        // There are at least 1 product have
        else {
          res.json({
            status: false,
            message: 'There is at least 1 product using this category',
          });
          return;
        }
      })
      .catch((err) => {
        console.log('206');
        res.json({
          status: false,
          message: 'Some error occurred while retrieving data.',
        });
      });
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
exports.createCategory = async function (req, res) {
  console.log(req.body);

  const category = new Category({
    name: req.body.name,
    parent: req.body.parent,
    attributes: req.body.attributes,
    children: [],
  });

  try {
    // Create category
    const newCategory = await category.save();

    // Get parent category
    const parent = await Category.findOne({
      _id: req.body.parent,
    });

    // Check if there is
    if (parent != null) {
      // Add children id to children list
      parent.children.push(newCategory._id);

      await Category.findByIdAndUpdate(
        {
          _id: req.body.parent,
        },
        {
          children: parent.children,
        }
      );

      console.log(parent);
    }

    res.json({
      status: true,
      message: 'Create category successfully',
    });
  } catch (err) {
    res.json({
      status: false,
      message: 'Create category failed',
    });
  }
};

// {
//     "query" :{
//       "search_string" : "64fc9067984ffca862fdc369"
//     }
//   }
exports.getAllAttributesFromCategory = async function (req, res) {
  let body = req.body.query;

  console.log(req.body);
  let attributes = [];
  attributes = await getAttributes(body.search_string, attributes);
  res.json(attributes);
};
async function getAttributes(id, attributes) {
  let category = await Category.findById(id);
  if (category.parent != null) {
    await getAttributes(category.parent, attributes);
  }
  // attributes.push(category.attributes);
  // return attributes;
  category.attributes.forEach((element) => {
    attributes.push(element);
  });
  return attributes;
}
