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
  const options = {
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  };
  const body = req.body;
  console.log(body);
  const orderTable = await connectDB(
    req.session.credentials,
    require('../models/Orders')
  );

  try {
    // Start a transaction
    await sequelize.transaction(options, async (t) => {
      // Find the product
      const productTable = await connectDB(
        req.session.credentials,
        require('../models/Products')
      );
      const product = await productTable.findOne({
        where: { product_id: body.product_id },
        transaction: t,
        lock: Sequelize.Transaction.LOCK.UPDATE,
      });
      if (!product) {
        res.json({
          status: false,
          message: 'Product not found',
        });
        throw new Error('Product not found');
        // Handle the case where the product is not found
      }
      if (product.unit_in_stock < body.product_quantity) {
        res.json({
          status: false,
          message: 'Not enough product',
        });
        throw new Error('Not enough product in stock');
        // Handle the case where there's not enough product in stock
      }
      const total_price = product.price * body.product_quantity;
      console.log(total_price);
      // Create a new order within the transaction
      const order = await orderTable.create(
        {
          customer_id: body.customer_id,
          product_id: body.product_id,
          product_quantity: body.product_quantity,
          total_price: total_price,
        },
        { transaction: t }
      );

      // Send a success response
      return res.status(200).json(order);
    });
  } catch (error) {
    // Handle any errors that occur during the transaction
    console.error('Transaction error:', error);
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
  const options = {
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  };
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
      res.json({
        status: false,
        message: 'Order not found',
      });
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
      res.json({
        status: false,
        message: 'Product not found',
      });
      return;
    }
    console.log({
      product_id: order.product_id,
      product_quantity: order.product_quantity,
      product_unit_in_stock: product.unit_in_stock,
    });
    if (product.unit_in_stock < order.product_quantity) {
      console.log('Not enough product');
      res.json({
        status: false,
        message: 'Not enough product',
      });
      return;
    }

    // Start a transaction for updating product stock
    sequelize.transaction(options, async (t) => {
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
      await sequelize.transaction(options, async (t1) => {
        await orderTable.destroy({
          where: { order_id: order.order_id },
          transaction: t1,
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
    res.json({
      status: false,
      message: 'Invalid',
    });
  }
};

exports.DeleteOrder = async (req, res) => {
  const body = req.body;
  console.log(body);
  const orderTable = await connectDB(
    req.session.credentials,
    require('../models/Orders')
  );
  const options = {
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  };
  sequelize.transaction(options, async (t) => {
    const order = await orderTable.findOne({
      where: { order_id: body.order_id },
      transaction: t,
      lock: Sequelize.Transaction.LOCK.UPDATE,
    });
    if (!order) {
      res.json({
        status: false,
        message: 'Order not found',
      });
      return;
    }
    await orderTable.destroy({
      where: { order_id: order.order_id },
      transaction: t,
    });
    res.status(200).json({ message: 'Order deleted' });
  });
};
