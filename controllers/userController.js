const User = require('../models').User;
exports.getLoginView = function (req, res) {
  res.sendFile('login.html', { root: 'views' });
};
exports.saveUser = function (req, res) {
  User.create(req.body)
    .then((newUser) => {
      res.json(newUser);
    })
    .catch((err) => {
      res.send(err);
    });
};
exports.getUsers = function (req, res) {
  User.findAll()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.deleteUser = function (req, res) {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedUser) => {
      res.json(deletedUser);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.updateUser = function (req, res) {
  User.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      res.send(err);
    });
};
exports.getUser = function (req, res) {
  User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.send(err);
    });
};
exports.getUserByUsername = function (req, res) {
  User.findOne({
    where: {
      username: req.params.username,
    },
  })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.send(err);
    });
};
exports.getUserByUsernameAndPassword = function (req, res) {
  User.findOne({
    where: {
      username: req.body.username,
      password: req.body.password,
    },
  })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.send(err);
    });
};
