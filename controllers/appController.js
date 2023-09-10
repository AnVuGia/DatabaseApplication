const { connectDB } = require('./helperController');
const hashPassword = require('../utils/bcrypt').hashPassword;
const admin_credentials = require('../config/credentials').admin_credentials;
const seller_credentials = require('../config/credentials').seller_credentials;
const customer_credentials =
  require('../config/credentials').customer_credentials;
const auth_credentials = require('../config/credentials').auth_credentials;
const admin_account = require('../config/credentials').admin_account;
const bcrypt = require('bcrypt');
const shopCartModel = require('../models/ShopCart');
const { ObjectId } = require('mongodb');
exports.getHello = (req, res) => {
  res.sendFile('index.html', { root: 'views' });
};
exports.getLogin = async (req, res) => {
  req.session.credentials = auth_credentials;
  req.session.save();
  await res.sendFile('sign-in.html', { root: 'views' });
};
exports.getSignup = (req, res) => {
  req.session.credentials = auth_credentials;
  res.sendFile('sign-up.html', { root: 'views' });
};
exports.signupAccount = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    let model;

    if (body.role === 'seller') {
      model = require('../models/Sellers');
    } else if (body.role === 'customer') {
      model = require('../models/Customers');
    } else {
      return res.json('Invalid role.'); // Handle unsupported roles
    }
    console.log(req.body);
    const Table = await connectDB(req.body.user_credential, model);
    const password = hashPassword(body.info.password);

    const existingUser = await Table.findOne({
      where: {
        username: body.info.username,
      },
    });

    if (existingUser) {
      return res.json('User already exists.');
    }

    const account = {
      username: body.info.username,
      password: password,
      address: body.info.address,
    };

    if (body.role === 'seller') {
      account.seller_name = body.info.name;
      const newUser = await Table.create(account);
      newUser.save();
      res.status(200).json('User Created Successfully.');
      return;
    } else {
      account.customer_name = body.info.name;
    }

    const newUser = await Table.create(account);
    const shopCart = await shopCartModel.create({
      customer_id: newUser.customer_id,
      products: [],
    });
    const cart_id = new ObjectId(shopCart._id).toString();
    console.log(cart_id);
    newUser.cart_id = cart_id;
    newUser.save();
    console.log(shopCart);
    await shopCart.save();
    res.status(200).json('User Created Successfully.');
  } catch (err) {
    res.status(500).json('An error occurred during registration.');
  }
};

exports.loginAccount = async (req, res) => {
  const body = req.body;
  console.log(body);
  const models = [
    { name: 'Admins', credentials: admin_credentials },
    { name: 'Sellers', credentials: seller_credentials },
    { name: 'Customers', credentials: customer_credentials },
  ];

  try {
    let found = false;
    for (const model of models) {
      const Table = await connectDB(
        auth_credentials,
        require(`../models/${model.name}`)
      );
      const user = await Table.findOne({
        where: {
          username: body.info.username,
        },
      });
      if (!user) continue;
      console.log(body.info.password, user.password);
      const match = await bcrypt.compare(body.info.password, user.password);
      if (match) {
        console.log('User found');
        found = true;
        req.session.credentials = model.credentials;
        await res.status(200).json({
          role: model.name.toLowerCase(),
          account: user,
        });
        return;
      }
    }

    if (!found) {
      if (
        body.info.username === admin_account.username &&
        body.info.password === admin_account.password
      ) {
        req.session.credentials = admin_credentials;
        await res.status(200).json({
          role: 'admins',
          account: admin_account,
        });
        return;
      }
      console.log('User not found');
      res.status(500).json('Your username or password is invalid.');
    }
  } catch (err) {
    console.error('in error');
    res.json(err);
  }
};

exports.getSellerInbound = (req, res) => {
  res.sendFile('seller-inbound.html', { root: 'views/sellerView' });
};
exports.getSellerProduct = (req, res) => {
  res.sendFile('seller-product.html', { root: 'views/sellerView' });
};
exports.getAdminVentory = (req, res) => {
  res.sendFile('admin-inventory.html', { root: 'views/adminView' });
};
exports.getAdminCategory = (req, res) => {
  res.sendFile('admin-category.html', { root: 'views/adminView' });
};
exports.getAdminProduct = (req, res) => {
  res.sendFile('admin-product.html', { root: 'views/adminView' });
};
exports.getCustomers = (req, res) => {
  res.sendFile('customer.html', { root: 'views/customerView' });
};
exports.getProductDetail = (req, res) => {
  res.sendFile('product-details-view.html', { root: 'views/customerView' });
};
exports.getCart = (req, res) => {
  res.sendFile('cart-view.html', { root: 'views/customerView' });
};
exports.getCheckout = (req, res) => {
  res.sendFile('checkout-view.html', { root: 'views/customerView' });
};
