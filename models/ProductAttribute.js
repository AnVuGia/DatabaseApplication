const { Int32 } = require('mongodb');
const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const productAttributesSchema = new Schema({
    product_id: {
        type: Number,
        required: true,
        unique: true
    },
    attributes: [
        {
            "name": {
                type: String,
                required: true
            },
            "value": {
                type: String
            },
            "type": {
                type: String,
                required: true
            }
        }
    ]
}
, {
    collection: "product_attributes"
}
);

const productAttributesModel = model("ProductAttributes", productAttributesSchema);
module.exports = productAttributesModel;