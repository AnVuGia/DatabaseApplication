const guest_credentials = require('../../config/credentials').guest_credentials;
const admin_credentials = require('../../config/credentials').admin_credentials;
const seller_credentials =
  require('../../config/credentials').seller_credentials;
const customer_credentials =
  require('../../config/credentials').customer_credentials;

function isAdmin(req, res, next) {
  if (req.session.credentials.username === admin_credentials.username) {
    next();
    return;
  }
  res.status(403).send({
    message: 'Require Admin Role!',
  });
}
function isSeller(req, res, next) {
  if (req.session.credentials.username === seller_credentials.username) {
    next();
    return;
  }
  res.status(403).send({
    message: 'Require Seller Role!',
  });
}
function isCustomer(req, res, next) {
  if (req.session.credentials.username === customer_credentials.username) {
    next();
    return;
  }
  res.status(403).send({
    message: 'Require Customer Role!',
  });
}
function isGuest(req, res, next) {
  req.session.credentials = guest_credentials;
  next();
  return;
}
const authJwt = {
  isAdmin,
  isSeller,
  isCustomer,
  isGuest,
};
module.exports = authJwt;
