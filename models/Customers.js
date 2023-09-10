const { Sequelize } = require('.');
const models = require('.');
module.exports = (sequelize, DataTypes) => {
  const Customers = sequelize.define('Customers', {
    customer_id: {
      type: DataTypes.BIGINT(10),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    customer_name: {
      type: DataTypes.STRING(15),
    },
    cart_id: {
      type: DataTypes.STRING(24),
    },
    username: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(50),
    },
  });
  return Customers;
};
// Sync the model with the database (this will create the table if it doesn't exist)
