const mongoose = require("mongoose");
const Attribute = require("../models/ProductAttribute");

const db= {}

function connect(user, pass) {

}

// Find all document in collection
exports.findAtribute = async function (req, res) {

    const product_id = req.params.product_id;

    Attribute.find({product_id: product_id})
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({
            status: false,
            message: err.message || "Some error occurred while retrieving data"
        });
    })
};
