const { Sequelize } = require('.');
const models = require('.');

module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
    product_id: {
      type: DataTypes.BIGINT(10),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    product_desc: {
      type: DataTypes.STRING(300),
    },
    seller_id: {
      type: DataTypes.BIGINT(10),
      allowNull: false,
    },
    category_id: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(300),
    },
    unit_in_stock: {
      type: DataTypes.INTEGER,
    },
    unit_on_order: {
      type: DataTypes.INTEGER,
    },
  });
  return Products;
};
