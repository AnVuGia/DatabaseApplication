const mongoose = require("mongoose");
const Category = require("../models/Category");

const db= {}

function connect(user, pass) {

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
    console.log( `update ${category} `  );
    let filter = {
        _id : category._id
    };

    // Delete the _id attribute from update data
    delete category._id;

    let update = category

    try {
        const results = await Category.findByIdAndUpdate(filter, update);
        resp.json(results);
    } 
    catch (err) {
        resp.status(500).json({message: err.message});
    }
};

// Delete by id
exports.delete = async function (req, resp) {
    let category = req.body;
    let filter = {
        _id : category._id
    };
    try {
        const results = await Category.findOneAndDelete(filter);
        resp.json(results);
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
        attributes: req.body.attributes
    });

    try {
        const newCategory = await category.save();

        resp.status(201).json(newCategory);
    }
    catch (err) {
        resp.status(400).json({ mesage: err.message})
    }
}


// {
//     "query" :{
//       "search_string" : "64fc9067984ffca862fdc369"
//     }
//   }
exports.getAllAttributesFromCategory = async function (req, resp) {
    let body = req.body.query;

    console.log(req.body);    
    let attributes = [];
    attributes = await getAttributes(body.search_string, attributes);
    resp.json(attributes);
}
async function getAttributes(id, attributes) {
    let category = await Category.findById(id);
    if (category.parent != null) {
        await getAttributes(category.parent, attributes);
    }
    // attributes.push(category.attributes);
    // return attributes;
    category.attributes.forEach(element => {
        attributes.push(element);
    });
    return attributes;
}
