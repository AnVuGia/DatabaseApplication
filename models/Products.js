module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Products', {
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Assuming this is an auto-incrementing ID
    },
    ProductName: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    ProductDescription: {
      type: DataTypes.TEXT,
    },
    SellerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ProductVolume: {
      type: DataTypes.DOUBLE,
    },
    Price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UnitsInStock: {
      type: DataTypes.INTEGER,
    },
    UnitsOnOrder: {
      type: DataTypes.INTEGER,
    },
  });
  Product.associate = function (models) {
    // associations can be defined here
  };
  return Product;
};
