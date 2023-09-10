const { Sequelize } = require('sequelize');
const { sequelize } = require('../models');
const connectDB = require('./helperController').connectDB;

exports.addOrder = async (req, res) => {
  const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: req.session.credentials.username,
    password: req.session.credentials.password,
    database: 'lazada_database',
  });
  const body = req.body;
  const orderTable = await connectDB(
    req.session.credentials,
    require('../models/Orders')
  );
  const productTable = await connectDB(
    req.session.credentials,
    require('../models/Products')
  );

  try {
    // Start a transaction
    await sequelize.transaction(async (t) => {
      const product = await productTable.findOne({
        where: {
          product_id: body.product_id,
        },
        transaction: t,
      });

      if (!product) {
        // Handle the case where the product is not found
        await t.rollback();
        return res.status(404).json({ error: 'Product not found' });
      }

      const seller_id = product.seller_id;

      if (product.unit_in_stock < body.product_quantity) {
        throw new Error('Not enough product in stock');
        // Handle the case where there's not enough product in stock
      }

      // Create a new order within the transaction
      const order = await orderTable.create(
        {
          customer_id: body.customer_id,
          product_id: body.product_id,
          product_quantity: body.product_quantity,
          seller_id: seller_id,
        },
        { transaction: t }
      );

      // Commit the transaction if everything is successful

      // Send a success response
      return res.status(200).json(order);
    });
  } catch (error) {
    // Handle any errors that occur during the transaction
    console.error('Transaction error:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred during the transaction' });
  }
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
exports.AcceptOrder = async (req, res) => {
  // Connect to the MySQL database
  const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: req.session.credentials.username,
    password: req.session.credentials.password,
    database: 'lazada_database',
  });
  try {
    const body = req.body;
    console.log(body);

    // Find the order
    const orderTable = await connectDB(
      req.session.credentials,
      require('../models/Orders')
    );
    const order = await orderTable.findOne({
      where: { order_id: body.order_id },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Find the product
    const productTable = await connectDB(
      req.session.credentials,
      require('../models/Products')
    );
    const product = await productTable.findOne({
      where: { product_id: order.product_id },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (product.unit_in_stock < order.product_quantity) {
      console.log('Not enough product');
      res.status(400).json({ error: 'Not enough product' });
      return;
    }

    // Start a transaction for updating product stock
    sequelize.transaction(async (t) => {
      try {
        await productTable.update(
          { unit_in_stock: product.unit_in_stock - order.product_quantity },
          { where: { product_id: order.product_id } },
          { transaction: t }
        );
      } catch (error) {
        // Commit the product update transaction
        // Rollback the product update transaction on error

        throw error;
      }
    });
    // Start a transaction for deleting the order

    try {
      await sequelize.transaction(async (t) => {
        await orderTable.destroy({
          where: { order_id: order.order_id },
          transaction: t,
        });
      });
    } catch (error) {
      // Rollback the order deletion transaction on error
      throw error;
    }

    // Return a success response
    res.status(200).json({ message: 'Order accepted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.DeleteOrder = async (req, res) => {
  const body = req.body;
  console.log(body);
  const orderTable = await connectDB(
    req.session.credentials,
    require('../models/Orders')
  );
  sequelize.transaction(async (t) => {
    const order = await orderTable.findOne({
      where: { order_id: body.order_id },
    });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    await orderTable.destroy({
      where: { order_id: order.order_id },
    });
    res.status(200).json({ message: 'Order deleted' });
  });
};
