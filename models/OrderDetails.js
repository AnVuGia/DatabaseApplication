module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define('OrderDetails', {
    OrderDetailID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Assuming this is an auto-incrementing ID
    },
    OrderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  OrderDetail.associate = function (models) {};
  return OrderDetail;
};
