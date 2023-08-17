const User = require('../models').User;
exports.saveUser = function (req, res) {
  User.create(req.body)
    .then((newUser) => {
      res.json(newUser);
    })
    .catch((err) => {
      res.send(err);
    });
};
