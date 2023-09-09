const { sequelize } = require('../models');

const connectDB = require('./helperController').connectDB;
exports.addOrder = async (req, res) => {
  const body = req.body;
  console.log(body);
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
    customer_id: body.customer_id,
    product_id: body.product_id,
    product_quantity: body.product_quantity,
    seller_id: seller_id,
  };
  sequelize.transaction(async (t) => {
    const order = await orderTable.create({ newOrder }, { transaction: t });
    if (product.quantity < body.product_quantity) {
      console.log('Not enough product');
      await t.rollback();
    }
    await productTable.update(
      { unit_in_stock: product.unit_in_stock - body.product_quantity },
      { where: { product_id: body.product_id } },
      { transaction: t }
    );
    await t.commit();
  });

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
  const productTable = await connectDB(
    req.session.credentials,
    require('../models/Products')
  );
  const products = [];
  for (const orderItem of order) {
    const product = await productTable.findOne({
      where: {
        product_id: orderItem.product_id,
      },
    });
    products.push({
      product_id: product.product_id,
      product_name: product.product_name,
      price: product.price,
      image: product.image,
    });
  }
  res.status(200).json({
    products: products,
    orders: order,
  });
};
