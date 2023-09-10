const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const shopCartSchema = new Schema(
  {
    customer_id: {
      type: String,
      required: true,
      unique: true,
    },
    products: [
      {
        product_id: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    collection: 'shop-carts',
  }
);
const shopCartModel = model('ShopCart', shopCartSchema);
module.exports = shopCartModel;
