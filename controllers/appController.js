const { connectDB } = require('./helperController');
const hashPassword = require('../utils/bcrypt').hashPassword;
const admin_credentials = require('../config/credentials').admin_credentials;
const seller_credentials = require('../config/credentials').seller_credentials;
const customer_credentials =
  require('../config/credentials').customer_credentials;
const auth_credentials = require('../config/credentials').auth_credentials;
const bcrypt = require('bcrypt');

exports.getHello = (req, res) => {
  res.sendFile('index.html', { root: 'views' });
};
exports.getLogin = async (req, res) => {
  await res.sendFile('sign-in.html', { root: 'views' });
  await res.cookie(
    'session',
    {
      username: auth_credentials.username,
      password: auth_credentials.password,
    },
    { maxAge: 900000, path: '/login' }
  );
};
exports.getSignup = (req, res) => {
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

    const Table = await connectDB(body.user_credential, model);
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
    } else {
      account.customer_name = body.info.name;
    }

    const newUser = await Table.create(account);

    res.json('User Created Successfully.');
  } catch (err) {
    console.error(err);
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
    let found = false; // Initialize a flag to track if a user is found

    for (const model of models) {
      const Table = await connectDB(
        body.user_credential,
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
        await res.cookie(
          'session',
          {
            username: model.credentials.username,
            password: model.credentials.password,
          },
          { maxAge: 900000, httpOnly: true, secure: true }
        );

        await res.json({
          role: model.name.toLowerCase(),
          account: user,
        });
        return;
      }
    }

    if (!found) {
      console.log('User not found');
      res.json('Your username or password is invalid.');
    }
  } catch (err) {
    console.error('in error');
    res.json(err); // Handle errors and send an error response
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
exports.getCustomers = (req, res) => {
  res.sendFile('customer.html', { root: 'views' });
};
exports.getProductDetail = (req, res) => {
  res.sendFile('product-details-view.html', { root: 'views' });
};
