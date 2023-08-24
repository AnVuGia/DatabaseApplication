module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_name: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    product_desc: {
      type: DataTypes.STRING(40),
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_volume: {
      type: DataTypes.DOUBLE,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    units_in_stock: {
      type: DataTypes.INTEGER,
    },
    units_on_order: {
      type: DataTypes.INTEGER,
    },
  });
  Products.associate = function (models) {
    // associations can be defined here
  };
  return Products;
};
