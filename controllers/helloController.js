const {connectDB} = require('./helperController')
exports.getHello = (req, res) => {
  res.sendFile('index.html', { root: 'views' });
};
exports.getLogin = (req, res) => {
  res.sendFile('sign-in.html', { root: 'views' });
};
exports.getSignup = (req, res) => {
  res.sendFile('sign-up.html', { root: 'views' });
};
exports.signupAccount = async (req, res) => {
    let body = req.body
    console.log(body)
    let model = body.role === 'seller' ? require('../models/Sellers') : require('../models/Customers')
    let Table = await connectDB(body.user_credential,model)
    Table.findOne({
        where: {
          username: body.info.username, 
          password: body.info.password,
        },
      })
      .then((user) => {
        if (user) {
          res.json("User already exists.");
        } else {
          let account = {}
          if (body.role === 'seller') {
            account = {
              seller_name: body.info.name,
              username: body.info.username,
              password: body.info.password,
              address: body.info.address
            };
          }else{
            account = {
              customer_name: body.info.name,
              username: body.info.username,
              password: body.info.password,
              address: body.info.address,
            }
          }
          Table.create(account)
          .then((newUser) => {
            res.json("User Created Successfully.");
          }
          ).catch((err) => {
            res.json(err);
          });
        }
      }).catch((err) => {
        res.send(err);
      }
      );
};
exports.loginAccount = async (req, res) => {
  let body = req.body
  console.log(body)
  let model = [require('../models/Admins'),require('../models/Sellers'),require('../models/Customers')] 
  for (let i = 0; i < model.length; i++) { 
    let Table = await connectDB(body.user_credential,model[i])
    Table.findOne({
      where: {
        username: body.info.username,
        password: body.info.password,
      },
    })
      .then((user) => {
        if (user) {
          if (Table.name === 'Admins') {
            res.send({role: 'admin', account: user});
          } else if (Table.name === 'Sellers') {
            res.send({role: 'seller', account: user});
          } else {
            res.send({role: 'customer', account: user});
          }
          return;
        }
      })
      .catch((err) => {
        res.json(err);
      });
  }
  res.json("Your username or password is invalid.");
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
  res.sendFile('customer-view.html', { root: 'views' });
};
exports.getProductDetail = (req, res) => {
  res.sendFile('product-details-view.html', { root: 'views' });
};
