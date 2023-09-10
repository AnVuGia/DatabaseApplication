const Products = require('../models').Products;
const io = require('../socket');
exports.getAllProducts = function (req, res) {
  Products.findAll()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.json({
        status: false,
        message: err.message ||  'Some error occurred while deleting in product_location table',
      });
    });
};
exports.saveProduct = function (req, res) {
  Products.create(req.body)
    .then((newProduct) => {
      io.getIO().emit('post item', { action: 'create', product: newProduct });
      res.json(newProduct);
    })
    .catch((err) => {
      res.json({
        status: false,
        message: err.message ||  'Some error occurred while deleting in product_location table',
      });
    });
};
