const guest_credentials = require('../../config/credentials').guest_credentials;
const admin_credentials = require('../../config/credentials').admin_credentials;
const seller_credentials =
  require('../../config/credentials').seller_credentials;
const customer_credentials =
  require('../../config/credentials').customer_credentials;
const e = require('express');
const appController = require('../appController');
function isAdmin(req, res, next) {
  if (req.session.credentials.username === admin_credentials.username) {
    next();
    return;
  } else {
    appController.getLogin(req, res);
  }
}
function isSeller(req, res, next) {
  if (req.session.credentials.username === seller_credentials.username) {
    next();
    return;
  } else {
    appController.getLogin(req, res);
  }
}
function isCustomer(req, res, next) {
  if (req.session.credentials.username === customer_credentials.username) {
    next();
    return;
  } else {
    appController.getLogin(req, res);
  }
}
function isGuest(req, res, next) {
  req.session.credentials = guest_credentials;
  next();
  return;
}
function isUser(req, res, next) {
  if (req.session.credentials) {
    next();
    return;
  }
  appController.getLogin(req, res);
}
const authJwt = {
  isAdmin,
  isSeller,
  isCustomer,
  isGuest,
  isUser,
};
module.exports = authJwt;
