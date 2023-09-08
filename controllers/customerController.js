const connectDB = require('./helperController').connectDB;
const { MongoClient, ObjectId } = require('mongodb');
const shopCartModel = require('../models/ShopCart');
const mongodb_uri = 'mongodb://127.0.0.1:27017';
const mongo_client = new MongoClient(mongodb_uri);
async function connectMongo(dbName) {
  try {
    await mongo_client.connect();

    return mongo_client.db(dbName);
  } catch (e) {
    console.error(e);
  }
}
exports.addToCard = async (req, res) => {
  const body = req.body;
  const connection = await connectMongo('group_asm');
  const shopCart = await connection.collection('shopcarts').findOne({
    customer_id: body.customer_id,
  });
  if (!shopCart) {
    await shopCartModel.create({
      customer_id: body.customer_id,
      products: [
        {
          product_id: body.product_id,
          quantity: body.quantity,
        },
      ],
    });
  } else {
    const products = shopCart.products;
    const product = products.find((product) => {
      return product.product_id === body.product_id;
    });
    if (product) {
      product.quantity += body.quantity;
    } else {
      products.push({
        product_id: body.product_id,
        quantity: body.quantity,
      });
    }
    shopCart.products = products;
    await shopCart.save();
  }
  res.status(200).json('Added to cart');
};
