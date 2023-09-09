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
    if (product.unit_in_stock < body.product_quantity) {
      console.log('Not enough product');
      await t.rollback();
      return;
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
exports.AcceptOrder = async (req, res) => {
  try {
    // Connect to the MySQL database
    const mysqlConnection = await mysql.createConnection({
      host: '127.0.0.1',
      dialect: 'mysql',
      user: req.session.credentials.username,
      password: req.session.credentials.password,
      database: 'lazada_database',
      multipleStatements: true,
    });

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
    const transaction = await mysqlConnection.beginTransaction();

    try {
      await productTable.update(
        { unit_in_stock: product.unit_in_stock - order.product_quantity },
        { where: { product_id: order.product_id }, transaction }
      );

      // Commit the product update transaction
      await transaction.commit();
    } catch (error) {
      // Rollback the product update transaction on error
      await transaction.rollback();
      console.error('Error updating product stock:', error);
      res.status(500).json({ error: 'Error updating product stock' });
      return;
    }

    // Start a transaction for deleting the order
    const transaction2 = await mysqlConnection.beginTransaction();

    try {
      await orderTable.destroy({
        where: { order_id: order.order_id },
        transaction: transaction2,
      });

      // Commit the order deletion transaction
      await transaction2.commit();
    } catch (error) {
      // Rollback the order deletion transaction on error
      await transaction2.rollback();
      console.error('Error deleting order:', error);
      res.status(500).json({ error: 'Error deleting order' });
      return;
    }

    // Return a success response
    res.status(200).json({ message: 'Order accepted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Close the MySQL connection when done
    mysqlConnection.end();
  }
};
