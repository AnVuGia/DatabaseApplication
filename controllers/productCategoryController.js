const mongoose = require("mongoose");
const Attribute = require("../models/ProductAttribute");

const db= {}

function connect(user, pass) {

}

// Find all document in collection
exports.findAtribute = async function (req, resp) {

    const product_id = req.params.product_id;

    Attribute.find({product_id: product_id})
    .then(data => {
        resp.json(data);
    })
    .catch(err => {
        resp.status(500).send({
            message: err.message || "Some error occurred while retrieving product attribute."
        });
    })
};
