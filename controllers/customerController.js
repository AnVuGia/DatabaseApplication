const connectDB = require('./helperController').connectDB;
const { MongoClient, ObjectId } = require('mongodb');
const shopCartModel = require('../models/ShopCart');
const { Sequelize } = require('sequelize');
const mongodb_uri = 'mongodb://localhost:27017';
const db_name = 'group_asm2';
const mongo_client = new MongoClient(`${mongodb_uri}/${db_name}`);

async function connect() {
  try {
    await mongo_client.connect();
    console.log('Connected to database');
    return mongo_client.db();
  } catch (e) {
    console.error(e);
  }
}
exports.addToCard = async (req, res) => {
  const body = req.body;
  console.log(body);
  const quantity = parseInt(body.quantity);

  const connection = await connect();
  const shopCart = await connection.collection('shop-carts').findOne({
    customer_id: body.customer_id.toString(),
  });

  console.log('customer id :' + body.customer_id);

  if (!shopCart) {
    await connection.collection('shop-carts').insertOne({
      customer_id: body.customer_id,
      products: [
        {
          product_id: body.product_id,
          quantity: quantity,
        },
      ],
    });
    res.status(200).json('Added to cart');
    return;
  }
  const products = shopCart.products;
  const product = products.find((product) => {
    return product.product_id === body.product_id;
  });
  if (product) {
    product.quantity += quantity;
  } else {
    products.push({
      product_id: body.product_id,
      quantity: quantity,
    });
  }

  await connection
    .collection('shop-carts')
    .updateOne(
      { customer_id: body.customer_id },
      { $set: { products: products } }
    );

  res.status(200).json('Added to cart');
};
exports.getCartProducts = async (req, res) => {
  const body = req.body;
  const connection = await connect();
  const productTable = await connectDB(
    {
      username: 'lazada_customer',
      password: 'password',
    },
    // req.session.credentials,
    require('../models/Products')
  );

  const products = [];
  const shopCart = await connection.collection('shop-carts').findOne({
    customer_id: body.customer_id,
  });

  if (!shopCart) {
    res.status(200).json([]);
  } else {
    const productsIds = shopCart.products;
    console.log(productsIds);
    for (const product of productsIds) {
      console.log(product);
      const productData = await productTable.findOne({
        where: {
          product_id: product.product_id,
        },
      });
      console.log(productData);
      products.push({
        product_id: product.product_id,
        quantity: product.quantity,
        product_name: productData.product_name,
        price: productData.price,
        image: productData.image,
      });
    }
    console.log(products);
    res.status(200).json(products);
  }
};
exports.deleteFromCart = async (req, res) => {
  const body = req.body;
  console.log(body);
  const connection = await connect();
  try {
    const shopCart = await connection.collection('shop-carts').findOne({
      customer_id: body.customer_id,
    });
    const products = shopCart.products;
    const product = products.find((product) => {
      return product.product_id === body.product_id;
    });
    if (!product) {
      throw new Error('Product not found');
    }
    products.splice(products.indexOf(product), 1);
    try {
      await connection
        .collection('shop-carts')
        .updateOne(
          { customer_id: body.customer_id },
          { $set: { products: products } }
        );
    } catch (err) {
      throw err;
    }
    res.status(200).json('Product deleted');
  } catch (err) {
    res.json({
      status: false,
      message: 'Invalid',
    });
  }
};
