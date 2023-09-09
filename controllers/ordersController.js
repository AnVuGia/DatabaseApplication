const connectDB = require('./helperController').connectDB;
exports.addOrder = async (req, res) => {
  const body = req.body;
  const orderTable = await connectDB(
    req.session.credentials,
    require('../models/Orders')
  );
  const productTable = await connectDB(
    req.session.credentials,
    require('../models/Products')
  );
  const product = await productTable.findOne({
    where: {
      product_id: body.product_id,
    },
  });
  if (!product) {
    res.status(500).json('Product not found');
    return;
  }
  const seller_id = product.seller_id;
  const price = product.price * body.product_quantity;
  const newOrder = {
    order_id: body.order_id,
    customer_id: body.customer_id,
    product_id: body.product_id,
    product_quantity: body.product_quantity,
    seller_id: seller_id,
    price: price,
  };
  const order = await orderTable.create(newOrder);
  res.status(200).json(order);
};
exports.getOrdersByCustomerId = async (req, res) => {
  const body = req.body;
  console.log(body);
  const orderTable = await connectDB(
    req.session.credentials,
    require('../models/Orders')
  );
  const order = await orderTable.findAll({
    where: {
      customer_id: body.customer_id,
    },
  });
  res.status(200).json(order);
};
